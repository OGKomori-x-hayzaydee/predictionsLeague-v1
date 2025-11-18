import { useState, useEffect } from 'react';

/**
 * Custom hook for state that persists to localStorage
 * @param {string} key - localStorage key
 * @param {any} defaultValue - Default value if nothing in localStorage
 * @returns {[any, function]} - [value, setValue] tuple like useState
 */
export const usePersistentState = (key, defaultValue) => {
  // Initialize state from localStorage or use default
  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Update localStorage whenever state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};

/**
 * Custom hook for filter state that persists to localStorage
 * Provides a standardized way to persist filter selections across page navigation
 * 
 * @param {string} viewName - Name of the view (e.g., 'fixtures', 'predictions')
 * @param {Object} defaultFilters - Default filter values
 * @returns {Object} Object with filter states and setters
 * 
 * @example
 * const {
 *   activeFilter, setActiveFilter,
 *   dateFilter, setDateFilter,
 *   searchQuery, setSearchQuery
 * } = usePersistentFilters('fixtures', {
 *   activeFilter: 'all',
 *   dateFilter: 'all',
 *   searchQuery: ''
 * });
 */
export const usePersistentFilters = (viewName, defaultFilters = {}) => {
  const storageKey = `${viewName}Filters`;
  
  // Load all filters from localStorage at once
  const [filters, setFilters] = usePersistentState(storageKey, defaultFilters);
  
  // Create individual setters for each filter
  const filterSetters = {};
  Object.keys(defaultFilters).forEach(filterKey => {
    filterSetters[`set${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}`] = (value) => {
      setFilters(prev => ({
        ...prev,
        [filterKey]: value
      }));
    };
  });
  
  return {
    ...filters,
    ...filterSetters,
    // Reset all filters to defaults
    resetFilters: () => setFilters(defaultFilters)
  };
};

export default usePersistentState;
