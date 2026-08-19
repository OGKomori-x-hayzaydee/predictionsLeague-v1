// Logo caching utilities
// This file provides utilities for caching and retrieving team logos

// Local storage keys
const LOGO_CACHE_KEY = 'team_logos_cache';
const LOGO_CACHE_TIMESTAMP_KEY = 'team_logos_cache_timestamp';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Save team logos to localStorage
 * @param {Object} logoMapping - Object with team names as keys and logo URLs as values
 */
export const saveLogosToCache = (logoMapping) => {
  try {
    // Store the logo mapping in local storage
    localStorage.setItem(LOGO_CACHE_KEY, JSON.stringify(logoMapping));
    
    // Store the timestamp
    localStorage.setItem(LOGO_CACHE_TIMESTAMP_KEY, Date.now().toString());
    
    console.log('Team logos saved to cache:', Object.keys(logoMapping).length);
    return true;
  } catch (error) {
    console.error('Error saving logos to cache:', error);
    return false;
  }
};

/**
 * Get cached team logos from localStorage
 * @returns {Object|null} Object with team names as keys and logo URLs as values, or null if cache is invalid
 */
export const getLogosFromCache = () => {
  try {
    // Get the cached data
    const cachedLogos = localStorage.getItem(LOGO_CACHE_KEY);
    const timestamp = localStorage.getItem(LOGO_CACHE_TIMESTAMP_KEY);
    
    // Check if cache exists and is not expired
    if (cachedLogos && timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      
      if (age < CACHE_TTL) {
        const logoMapping = JSON.parse(cachedLogos);
        console.log('Retrieved logos from cache:', Object.keys(logoMapping).length);
        return logoMapping;
      } else {
        console.log('Logo cache expired, needs refresh');
        return null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving logos from cache:', error);
    return null;
  }
};

/**
 * Check if logo cache is valid
 * @returns {boolean} True if cache exists and is not expired
 */
export const isLogoCacheValid = () => {
  try {
    const timestamp = localStorage.getItem(LOGO_CACHE_TIMESTAMP_KEY);
    
    if (timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      return age < CACHE_TTL;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking logo cache validity:', error);
    return false;
  }
};

/**
 * Get a team logo URL, with fallbacks for different name formats
 * @param {string} teamName - Team name to look up 
 * @param {Object} logoMapping - Mapping of team names to logo URLs
 * @param {Function} normalizeTeamName - Function to normalize team names
 * @returns {string} URL of team logo or placeholder
 */
export const getLogoUrl = (teamName, logoMapping, normalizeTeamName) => {
  if (!teamName) {
    return `https://via.placeholder.com/40?text=???`;
  }
  
  // Try with the exact name
  if (logoMapping[teamName]) {
    return logoMapping[teamName];
  }
  
  // Try with normalized name
  const normalizedName = normalizeTeamName ? normalizeTeamName(teamName) : teamName;
  if (normalizedName !== teamName && logoMapping[normalizedName]) {
    return logoMapping[normalizedName];
  }
  
  // Try without FC suffix
  if (teamName.endsWith(' FC')) {
    const nameWithoutFC = teamName.replace(' FC', '');
    if (logoMapping[nameWithoutFC]) {
      return logoMapping[nameWithoutFC];
    }
  }
  
  // Return placeholder with team initials
  return `https://via.placeholder.com/40?text=${teamName.substring(0, 3)}`;
};

/**
 * Pre-fetch and store images in browser cache
 * @param {Object} logoMapping - Object with team names as keys and logo URLs as values
 */
export const preloadTeamLogos = (logoMapping) => {
  if (!logoMapping) return;
  
  // Extract unique logo URLs (since multiple team names may map to the same logo)
  const uniqueLogoUrls = [...new Set(Object.values(logoMapping))];
  
  // Preload each unique logo
  uniqueLogoUrls.forEach(url => {
    if (url && !url.includes('placeholder')) {
      const img = new Image();
      img.src = url;
      console.log(`Preloading image: ${url}`);
    }
  });
};
