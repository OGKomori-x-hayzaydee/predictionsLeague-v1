import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Custom hook to access the theme context and provide helper utilities
 * @returns {Object} Theme context object with isDarkMode helper
 */
export const useTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  // Helper to check if current theme is dark mode
  const isDarkMode = theme === 'dark';
  
  // Helper function to get the appropriate class based on theme
  const getThemeClass = (darkClass, lightClass) => {
    return isDarkMode ? darkClass : lightClass;
  };
  
  // Helper to get a dynamic class object
  const themeClass = (classObject) => {
    return classObject[theme];
  };
  
  return { 
    theme, 
    isDarkMode, 
    toggleTheme,
    getThemeClass,
    themeClass 
  };
};

export default useTheme;
