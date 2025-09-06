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
    console.log(`🔍 Auth check requested from: ${source}`);

    // Return cached result if still valid and not forced
    if (!force && this.isCacheValid()) {
      console.log('📋 Returning cached auth state');
      return {
        success: true,
        isAuthenticated: this.authCache.isAuthenticated,
        user: this.authCache.user,
        source: 'cache',
      };
    }

    // If already checking, return the existing promise
    if (this.authCache.isChecking && this.authCache.promise) {
      console.log('⏳ Auth check already in progress, waiting...');
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
      console.log(`🔄 Performing secure auth check (source: ${source})`);
      
      // Add security validation for OAuth sources
      if (source.includes('oauth')) {
        // Validate origin for OAuth-related auth checks
        if (!oauthSecurity.validateOrigin(window.location.origin)) {
          throw new Error('Authentication check from unauthorized origin');
        }
        
        // Check rate limiting for OAuth auth checks
        if (!oauthSecurity.checkRateLimit(`auth_check_${source}`)) {
          throw new Error('Too many authentication attempts');
        }
      }
      
      const response = await authAPI.getCurrentUser();
      
      if (response.success && response.user) {
        // Additional user data validation for security
        if (!this.validateUserData(response.user)) {
          throw new Error('Invalid user data received');
        }
        
        this.updateCache(true, response.user);
        this.emit('authenticated', { user: response.user, source });
        
        console.log('✅ Auth check successful (security validated)');
        return {
          success: true,
          isAuthenticated: true,
          user: response.user,
          source: 'api',
        };
      } else {
        this.updateCache(false, null);
        this.emit('unauthenticated', { source });
        
        console.log('❌ Auth check failed - no valid session');
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
      
      console.error(`❌ Auth check error (source: ${source}):`, error);
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
   * OAuth-specific authentication check
   * Used during OAuth callback processing
   */
  async checkOAuthAuth() {
    console.log('🔄 OAuth-specific auth check');
    
    try {
      // Always force check during OAuth (no cache)
      const result = await this.checkAuth({ 
        force: true, 
        source: 'oauth-callback' 
      });
      
      if (result.isAuthenticated) {
        this.emit('oauth-authenticated', { user: result.user });
        return {
          success: true,
          user: result.user,
        };
      } else {
        throw new Error('OAuth authentication failed - no valid session');
      }
    } catch (error) {
      this.emit('oauth-error', { error: error.message });
      throw error;
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
    console.log('🧹 Clearing auth cache');
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
    
    console.log('📋 Auth cache updated:', {
      isAuthenticated,
      user: user ? user.username || user.email : null,
      timestamp: this.authCache.lastCheck,
    });
  }

  /**
   * Manual cache invalidation
   */
  invalidateCache() {
    console.log('🗑️ Auth cache invalidated');
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

    // Check for required fields
    const requiredFields = ['id', 'email'];
    const hasRequiredFields = requiredFields.every(field => 
      user.hasOwnProperty(field) && user[field] !== null && user[field] !== undefined
    );

    if (!hasRequiredFields) {
      console.warn('🔒 User data missing required fields');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      console.warn('🔒 Invalid email format in user data');
      return false;
    }

    // Check for suspicious fields or XSS attempts
    const suspiciousPatterns = /<script|javascript:|onload=|onerror=/i;
    for (const [key, value] of Object.entries(user)) {
      if (typeof value === 'string' && suspiciousPatterns.test(value)) {
        console.warn(`🔒 Suspicious content detected in user field: ${key}`);
        return false;
      }
    }

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