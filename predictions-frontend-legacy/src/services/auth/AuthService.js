/**
 * Centralized Authentication Service
 * Eliminates duplicate API calls and provides single source of truth for auth checks
 */
import authAPI from '../api/authAPI.js';

class AuthService {
  constructor() {
    this.authCache = {
      user: null,
      isAuthenticated: false,
      lastCheck: null,
      isChecking: false,
      promise: null, // Store ongoing promise to prevent duplicate calls
    };
    this.CACHE_DURATION = 30000; // 30 seconds cache
    this.listeners = new Map();
  }

  /**
   * Event system for auth state changes
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Auth service event error (${event}):`, error);
        }
      });
    }
  }

  /**
   * Check if user is authenticated
   * Uses cache to prevent duplicate API calls
   */
  async checkAuth({ force = false, source = 'unknown' } = {}) {
    // Return cached result if still valid and not forced
    if (!force && this.isCacheValid()) {
      return {
        success: true,
        isAuthenticated: this.authCache.isAuthenticated,
        user: this.authCache.user,
        source: 'cache',
      };
    }

    // If already checking, return the existing promise
    if (this.authCache.isChecking && this.authCache.promise) {
      return this.authCache.promise;
    }

    // Start new auth check
    this.authCache.isChecking = true;
    this.authCache.promise = this._performAuthCheck(source);

    try {
      const result = await this.authCache.promise;
      return result;
    } finally {
      this.authCache.isChecking = false;
      this.authCache.promise = null;
    }
  }

  /**
   * Perform actual authentication check
   */
  async _performAuthCheck(source) {
    try {
      // Always use getCurrentUser for authentication verification
      const response = await authAPI.getCurrentUser();
      
      if (response.success && response.user) {
        if (!this.validateUserData(response.user)) {
          throw new Error('Invalid user data received');
        }
        
        this.updateCache(true, response.user);
        this.emit('authenticated', { user: response.user, source });
        
        return {
          success: true,
          isAuthenticated: true,
          user: response.user,
          source: 'api',
        };
      } else {
        this.updateCache(false, null);
        this.emit('unauthenticated', { source });
        
        return {
          success: true,
          isAuthenticated: false,
          user: null,
          source: 'api',
        };
      }
    } catch (error) {
      this.updateCache(false, null);
      this.emit('error', { error: error.message, source });
      
      return {
        success: false,
        error: error.message,
        isAuthenticated: false,
        user: null,
        source: 'api',
      };
    }
  }

  /**
   * Update user data in cache
   */
  updateUser(userData) {
    if (this.authCache.isAuthenticated && this.authCache.user) {
      this.authCache.user = { ...this.authCache.user, ...userData };
      this.authCache.lastCheck = Date.now();
      this.emit('user-updated', { user: this.authCache.user });
    }
  }

  /**
   * Clear authentication cache
   */
  clearAuth() {
    this.authCache = {
      user: null,
      isAuthenticated: false,
      lastCheck: null,
      isChecking: false,
      promise: null,
    };
    this.emit('cleared', {});
  }

  /**
   * Get current cached auth state
   */
  getCachedAuth() {
    return {
      isAuthenticated: this.authCache.isAuthenticated,
      user: this.authCache.user,
      lastCheck: this.authCache.lastCheck,
      isValid: this.isCacheValid(),
    };
  }

  /**
   * Check if cache is still valid
   */
  isCacheValid() {
    if (!this.authCache.lastCheck) return false;
    return (Date.now() - this.authCache.lastCheck) < this.CACHE_DURATION;
  }

  /**
   * Update cache with new auth state
   */
  updateCache(isAuthenticated, user) {
    this.authCache.isAuthenticated = isAuthenticated;
    this.authCache.user = user;
    this.authCache.lastCheck = Date.now();
  }

  /**
   * Manual cache invalidation
   */
  invalidateCache() {
    this.authCache.lastCheck = null;
  }

  /**
   * Validate user data for security
   */
  validateUserData(user) {
    if (!user || typeof user !== 'object') {
      console.warn('🔒 Invalid user data type');
      return false;
    }

    // For dashboard/me endpoint, username is sufficient to confirm valid user
    // Email is not required for all user data sources
    if (user.username && typeof user.username === 'string') {
      
      // Basic security check for XSS attempts
      const suspiciousPatterns = /<script|javascript:|onload=|onerror=/i;
      for (const [key, value] of Object.entries(user)) {
        if (typeof value === 'string' && suspiciousPatterns.test(value)) {
          console.warn(`🔒 Suspicious content detected in user field: ${key}`);
          return false;
        }
      }
      
      return true;
    }

    // Fallback: check for email if username is not available (OAuth scenarios)
    const email = user.email || user.emailAddress || user.userEmail;
    if (email && typeof email === 'string') {
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.warn('🔒 Invalid email format in user data');
        return false;
      }
      
      return true;
    }

    console.warn('🔒 User data missing both username and email');
    console.warn('🔒 Available user fields:', Object.keys(user));
    return false;

    return true;
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.clearAuth();
    this.listeners.clear();
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;