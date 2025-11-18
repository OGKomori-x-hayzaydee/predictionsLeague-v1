/**
 * Secure LocalStorage Wrapper
 * Multi-layered protection against tampering
 * 
 * Security Layers:
 * 1. Encryption with session-based key
 * 2. HMAC signature verification
 * 3. Timestamp validation
 * 4. Checksum verification
 * 5. Structure validation
 * 6. Anti-tampering detection
 */

import CryptoJS from 'crypto-js';

// Generate session-specific key on app load (lost on refresh)
const SESSION_KEY = generateSessionKey();
const STORAGE_PREFIX = '__sec_';
const INTEGRITY_SUFFIX = '_sig';

/**
 * Generate a unique session key
 * Different each session, making replay attacks harder
 */
function generateSessionKey() {
  const userAgent = navigator.userAgent;
  const timestamp = Date.now();
  const random = Math.random().toString(36);
  const screenInfo = `${window.screen.width}x${window.screen.height}`;
  
  return CryptoJS.SHA256(
    `${userAgent}${timestamp}${random}${screenInfo}`
  ).toString();
}

/**
 * Generate HMAC signature for data integrity
 */
function generateSignature(data, key) {
  return CryptoJS.HmacSHA256(JSON.stringify(data), key).toString();
}

/**
 * Calculate checksum of critical fields
 */
function calculateChecksum(data) {
  const criticalFields = JSON.stringify({
    id: data.id,
    fixtureId: data.fixtureId,
    homeTeam: data.homeTeam,
    awayTeam: data.awayTeam,
    homeScore: data.homeScore,
    awayScore: data.awayScore,
    chips: data.chips,
    timestamp: data.timestamp
  });
  
  return CryptoJS.SHA256(criticalFields).toString().substring(0, 16);
}

/**
 * Encrypt data using AES
 */
function encryptData(data) {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SESSION_KEY
  ).toString();
}

/**
 * Decrypt data using AES
 */
function decryptData(encrypted) {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SESSION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption failed - data may be tampered:', error);
    return null;
  }
}

/**
 * Validate data structure
 */
function validateStructure(data) {
  const requiredFields = [
    'id', 'fixtureId', 'homeTeam', 'awayTeam',
    'timestamp', 'expiresAt', '_checksum', '_version'
  ];
  
  return requiredFields.every(field => field in data);
}

/**
 * Validate timestamp (prevent future timestamps and extreme past)
 */
function validateTimestamp(timestamp) {
  const now = Date.now();
  const maxAge = 72 * 60 * 60 * 1000; // 72 hours
  
  // Reject future timestamps
  if (timestamp > now) {
    console.warn('🚨 Security: Future timestamp detected');
    return false;
  }
  
  // Reject very old timestamps
  if (now - timestamp > maxAge) {
    console.warn('🚨 Security: Expired timestamp detected');
    return false;
  }
  
  return true;
}

/**
 * Secure Storage Class
 */
class SecureStorage {
  constructor() {
    this.version = '1.0';
    this.tamperAttempts = 0;
    this.maxTamperAttempts = 3;
  }

  /**
   * Store data securely
   */
  setItem(key, value) {
    try {
      const timestamp = Date.now();
      
      // Add metadata
      const secureData = {
        ...value,
        timestamp,
        expiresAt: timestamp + (72 * 60 * 60 * 1000),
        _version: this.version,
        _checksum: calculateChecksum(value),
        _nonce: CryptoJS.lib.WordArray.random(16).toString()
      };

      // Generate signature
      const signature = generateSignature(secureData, SESSION_KEY);

      // Encrypt the data
      const encrypted = encryptData(secureData);

      // Store encrypted data and signature separately
      localStorage.setItem(
        `${STORAGE_PREFIX}${key}`,
        encrypted
      );
      
      localStorage.setItem(
        `${STORAGE_PREFIX}${key}${INTEGRITY_SUFFIX}`,
        signature
      );

      console.log('✅ Secure storage: Data encrypted and signed');
      return true;
    } catch (error) {
      console.error('Failed to store securely:', error);
      return false;
    }
  }

  /**
   * Retrieve and validate data
   */
  getItem(key) {
    try {
      // Retrieve encrypted data and signature
      const encrypted = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      const storedSignature = localStorage.getItem(
        `${STORAGE_PREFIX}${key}${INTEGRITY_SUFFIX}`
      );

      if (!encrypted || !storedSignature) {
        return null;
      }

      // Decrypt data
      const decrypted = decryptData(encrypted);
      
      if (!decrypted) {
        this.handleTamperAttempt('Decryption failed');
        return null;
      }

      // Validate structure
      if (!validateStructure(decrypted)) {
        this.handleTamperAttempt('Invalid structure');
        return null;
      }

      // Validate timestamp
      if (!validateTimestamp(decrypted.timestamp)) {
        this.handleTamperAttempt('Invalid timestamp');
        return null;
      }

      // Verify signature
      const calculatedSignature = generateSignature(decrypted, SESSION_KEY);
      if (calculatedSignature !== storedSignature) {
        this.handleTamperAttempt('Signature mismatch');
        return null;
      }

      // Verify checksum
      const { _checksum, _version, _nonce, timestamp, expiresAt, ...originalData } = decrypted;
      const calculatedChecksum = calculateChecksum(originalData);
      
      if (calculatedChecksum !== _checksum) {
        this.handleTamperAttempt('Checksum mismatch');
        return null;
      }

      // Check expiry
      if (Date.now() > decrypted.expiresAt) {
        console.warn('⏰ Data expired, removing...');
        this.removeItem(key);
        return null;
      }

      console.log('✅ Secure storage: Data validated successfully');
      return originalData;
      
    } catch (error) {
      console.error('Failed to retrieve securely:', error);
      this.handleTamperAttempt('Retrieval error');
      return null;
    }
  }

  /**
   * Remove data securely
   */
  removeItem(key) {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    localStorage.removeItem(`${STORAGE_PREFIX}${key}${INTEGRITY_SUFFIX}`);
  }

  /**
   * Clear all secure storage
   */
  clear() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Handle tampering attempts
   */
  handleTamperAttempt(reason) {
    this.tamperAttempts++;
    console.warn(`🚨 SECURITY ALERT: Tampering detected (${reason})`, {
      attempts: this.tamperAttempts,
      maxAttempts: this.maxTamperAttempts
    });

    if (this.tamperAttempts >= this.maxTamperAttempts) {
      console.error('🔒 Maximum tamper attempts reached - clearing all storage');
      this.clear();
      this.tamperAttempts = 0;
      
      // Optionally notify user or redirect
      window.dispatchEvent(new CustomEvent('security:tamper-detected', {
        detail: { reason, cleared: true }
      }));
    }
  }

  /**
   * Get all items (for migration/debugging)
   */
  getAllItems() {
    const keys = Object.keys(localStorage);
    const items = {};
    
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX) && !key.endsWith(INTEGRITY_SUFFIX)) {
        const cleanKey = key.replace(STORAGE_PREFIX, '');
        items[cleanKey] = this.getItem(cleanKey);
      }
    });
    
    return items;
  }

  /**
   * Health check - verify storage integrity
   */
  healthCheck() {
    const keys = Object.keys(localStorage);
    let healthy = 0;
    let corrupted = 0;
    
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX) && !key.endsWith(INTEGRITY_SUFFIX)) {
        const cleanKey = key.replace(STORAGE_PREFIX, '');
        const data = this.getItem(cleanKey);
        
        if (data) {
          healthy++;
        } else {
          corrupted++;
          this.removeItem(cleanKey);
        }
      }
    });

    console.log('🏥 Storage health check:', { healthy, corrupted });
    return { healthy, corrupted };
  }
}

// Export singleton instance
export const secureStorage = new SecureStorage();

// Export for testing/debugging
export { SecureStorage, generateSessionKey };
