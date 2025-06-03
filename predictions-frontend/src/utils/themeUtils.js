/**
 * Theme utility functions to help with conditional styling based on theme
 */

/**
 * Returns the appropriate class based on the current theme
 * @param {string} theme - Current theme ('dark' or 'light')
 * @param {string} darkClass - Class to use in dark mode
 * @param {string} lightClass - Class to use in light mode
 * @returns {string} - The appropriate class
 */
export const getThemeClass = (theme, darkClass, lightClass) => {
  return theme === 'dark' ? darkClass : lightClass;
};

/**
 * Common background classes for different container types
 */
export const backgrounds = {
  // Main content areas
  main: {
    dark: 'text-white',
    light: 'bg-slate-50 text-light-text'
  },
  // Card backgrounds
  card: {
    dark: 'bg-primary-700/50 border-primary-700/30',
    light: 'bg-light-card border-light-border shadow-sm'
  },
  // Secondary cards/sections
  secondary: {
    dark: 'bg-primary-700/30 border-primary-600/30',
    light: 'bg-slate-50 border-slate-200'
  },
  // Input fields
  input: {
    dark: 'bg-primary-600/50 border-primary-500/50 text-white placeholder:text-slate-400',
    light: 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-500'
  }
};

/**
 * Common text color classes
 */
export const text = {
  primary: {
    dark: 'text-white',
    light: 'text-light-text'
  },
  secondary: {
    dark: 'text-slate-300',
    light: 'text-light-text-secondary'
  },
  muted: {
    dark: 'text-slate-400',
    light: 'text-slate-500'
  },
  accent: {
    dark: 'text-teal-dark',
    light: 'text-teal-light'
  }
};

/**
 * Status colors for indicators
 */
export const status = {
  success: {
    bg: {
      dark: 'bg-emerald-500/10',
      light: 'bg-emerald-50'
    },
    text: {
      dark: 'text-emerald-dark',
      light: 'text-emerald-light'
    },
    border: {
      dark: 'border-emerald-500/20',
      light: 'border-emerald-200'
    }
  },
  warning: {
    bg: {
      dark: 'bg-amber-500/10',
      light: 'bg-amber-50'
    },
    text: {
      dark: 'text-amber-dark',
      light: 'text-amber-light'
    },
    border: {
      dark: 'border-amber-500/20',
      light: 'border-amber-200'
    }
  },
  error: {
    bg: {
      dark: 'bg-red-500/10',
      light: 'bg-red-50'
    },
    text: {
      dark: 'text-red-300',
      light: 'text-red-500'
    },
    border: {
      dark: 'border-red-500/20',
      light: 'border-red-200'
    }
  },
  info: {
    bg: {
      dark: 'bg-blue-500/10',
      light: 'bg-blue-50'
    },
    text: {
      dark: 'text-blue-300',
      light: 'text-blue-600'
    },
    border: {
      dark: 'border-blue-500/20',
      light: 'border-blue-200'
    }
  },
  neutral: {
    bg: {
      dark: 'bg-slate-700/40',
      light: 'bg-slate-100'
    },
    text: {
      dark: 'text-slate-300',
      light: 'text-slate-600'
    },
    border: {
      dark: 'border-slate-600/30',
      light: 'border-slate-200'
    }
  }
};

/**
 * Button style variants
 */
export const buttons = {
  primary: {
    dark: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    light: 'bg-indigo-600 hover:bg-indigo-700 text-white'
  },
  secondary: {
    dark: 'bg-primary-700 hover:bg-primary-600 text-white border border-primary-600',
    light: 'bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 hover:border-indigo-300'
  },
  outline: {
    dark: 'bg-transparent hover:bg-primary-700/50 text-white border border-primary-600/50',
    light: 'bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-300'
  },
  danger: {
    dark: 'bg-red-600/80 hover:bg-red-500/80 text-white',
    light: 'bg-red-600 hover:bg-red-700 text-white'
  }
};

/**
 * Returns all theme classes for a component
 * @param {string} theme - Current theme ('dark' or 'light')
 * @param {object} styleObject - Object with dark and light properties
 * @returns {string} - The appropriate class
 */
export const getThemeStyles = (theme, styleObject) => {
  return styleObject[theme.toLowerCase()];
};
