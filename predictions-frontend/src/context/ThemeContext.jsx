import React, { createContext, useState, useEffect } from "react";
import { notificationManager } from "../services/notificationService.js";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check local storage or use system preference as default
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check user's system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };
  
  const [theme, setTheme] = useState(getInitialTheme);
  
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      // Show theme change notification
      notificationManager.settings.themeChanged(newTheme);
      return newTheme;
    });
  };
  
  // Update local storage, document class, and meta tag when theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
    
    // Update HTML class
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Update theme-color meta tag for mobile status bars
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    const themeColor = theme === "dark" ? "#021526" : "#ffffff";

    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", themeColor);
    } else {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = themeColor;
      document.head.appendChild(meta);
    }
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};