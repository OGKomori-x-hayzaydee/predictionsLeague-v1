import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/classUtils';

/**
 * MotionButton - Highly animated buttons for enhanced interactions
 * Used for: Hero CTAs, special actions, landing page buttons
 */
const MotionButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  icon,
  size = 'lg',
  variant = 'primary',
  color = 'teal',
  animation = 'scale',
  className = '',
  type = 'button',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-12 py-5 text-xl'
  };

  const colorVariants = {
    teal: {
      primary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40',
      outline: 'border-2 border-teal-500 text-teal-300 hover:bg-teal-500/10 hover:text-teal-200',
      gradient: 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg shadow-teal-600/25'
    },
    indigo: {
      primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40',
      outline: 'border-2 border-indigo-500 text-indigo-300 hover:bg-indigo-500/10 hover:text-indigo-200',
      gradient: 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg shadow-indigo-600/25'
    },
    purple: {
      primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40',
      outline: 'border-2 border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200',
      gradient: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-600/25'
    }
  };

  const animations = {
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    lift: {
      whileHover: { y: -2, scale: 1.02 },
      whileTap: { y: 0, scale: 0.98 },
      transition: { duration: 0.2 }
    },
    bounce: {
      whileHover: { y: -4 },
      whileTap: { y: 0 },
      transition: { type: "spring", stiffness: 300, damping: 10 }
    },
    glow: {
      whileHover: { 
        boxShadow: "0 0 20px rgba(45, 212, 191, 0.4)",
        scale: 1.02
      },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.3 }
    }
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-lg font-bold font-outfit transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
    'transform hover:scale-105',
    sizeClasses[size],
    disabled || loading ? 'opacity-50 cursor-not-allowed' : colorVariants[color][variant],
    className
  );

  const motionProps = disabled || loading ? {} : animations[animation];

  return (
    <motion.button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={baseClasses}
      {...motionProps}
      {...props}
    >
      {loading && (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {icon && !loading && (
        <span className="mr-2">
          {icon}
        </span>
      )}
      {children}
    </motion.button>
  );
};

export default MotionButton;
