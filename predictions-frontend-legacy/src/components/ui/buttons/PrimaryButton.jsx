import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/classUtils';

/**
 * PrimaryButton - Main action buttons with prominent styling
 * Used for: Primary CTAs, form submissions, main actions
 */
const PrimaryButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'solid',
  color = 'teal',
  className = '',
  type = 'button',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const colorVariants = {
    teal: {
      solid: 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/25 hover:shadow-teal-600/40',
      outline: 'border-2 border-teal-500 text-teal-300 hover:bg-teal-500/10 hover:text-teal-200'
    },
    indigo: {
      solid: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40',
      outline: 'border-2 border-indigo-500 text-indigo-300 hover:bg-indigo-500/10 hover:text-indigo-200'
    },
    purple: {
      solid: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40',
      outline: 'border-2 border-purple-500 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200'
    },
    amber: {
      solid: 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40',
      outline: 'border-2 border-amber-500 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200'
    },
    blue: {
      solid: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40',
      outline: 'border-2 border-blue-500 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200'
    }
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-lg font-medium font-outfit transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
    sizeClasses[size],
    disabled || loading 
      ? 'opacity-50 cursor-not-allowed' 
      : colorVariants[color][variant],
    disabled || loading ? '' : 'hover:scale-105 active:scale-95',
    className
  );

  return (
    <motion.button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={baseClasses}
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </motion.button>
  );
};

export default PrimaryButton;
