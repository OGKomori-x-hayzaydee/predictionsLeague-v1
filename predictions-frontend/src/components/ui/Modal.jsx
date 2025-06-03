import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '../../context/ThemeContext';

const Modal = ({ children, onClose }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 ${
        theme === 'dark' 
          ? 'bg-slate-950/85' 
          : 'bg-slate-700/60'
      } backdrop-blur-lg z-50 flex items-center justify-center p-4 overflow-y-auto`}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 15 }}
        className={`${
          theme === 'dark'
            ? 'bg-gradient-to-b from-slate-700 to-slate-800 border-slate-400/20'
            : 'bg-white border-slate-200 shadow-xl'
        } border rounded-lg p-5 max-w-md w-full font-outfit`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default Modal;