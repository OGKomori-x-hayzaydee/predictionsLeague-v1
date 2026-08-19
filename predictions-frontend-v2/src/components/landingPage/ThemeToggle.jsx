import React, { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const springTransition = {
    type: "spring",
    stiffness: 700,
    damping: 30
  };
  
  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-12 h-12 rounded-full overflow-hidden ${
        theme === "dark" 
          ? "bg-primary-700 hover:bg-primary-600" 
          : "bg-white hover:bg-slate-100 shadow-sm border border-slate-200"
      }`}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={springTransition}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <motion.div
          initial={{ rotate: -45, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 45, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-teal-300"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
              clipRule="evenodd" 
            />
          </svg>
        </motion.div>
      ) : (
        <motion.div
          initial={{ rotate: 45, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: -45, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-indigo-800"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          <motion.span 
            className="absolute inset-0 rounded-full"
            animate={{
              background: [
                "radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.1) 0%, rgba(0, 0, 0, 0) 70%)",
                "radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
                "radial-gradient(circle at 50% 50%, rgba(76, 29, 149, 0.1) 0%, rgba(0, 0, 0, 0) 70%)"
              ]
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
      <motion.span
        className={`absolute inset-0 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: theme === "dark" ? 0 : 0 }}
        exit={{ opacity: 0 }}
        style={{
          zIndex: -1
        }}
      />
    </motion.button>
  );
}