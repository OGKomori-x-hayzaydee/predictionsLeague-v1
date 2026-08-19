import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';

const Modal = ({ children, onClose }) => {
  const { theme } = useContext(ThemeContext);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.75, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.75, y: 20 }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 500,
          duration: 0.3
        }}
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-[90vw] sm:max-w-md rounded-xl sm:rounded-2xl shadow-2xl border overflow-hidden text-sm sm:text-base ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-700/60'
            : 'bg-white border-slate-200'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-3 sm:p-6 font-outfit">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
