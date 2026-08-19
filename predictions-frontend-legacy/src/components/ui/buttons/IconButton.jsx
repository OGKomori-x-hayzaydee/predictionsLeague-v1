import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/classUtils';

/**
 * IconButton - Icon-only buttons for actions and navigation
 * Used for: Close buttons, menu toggles, action icons
 */
const IconButton = ({
  icon,
  onClick,
  disabled = false,
  size = 'md',
  variant = 'ghost',
  color = 'slate',
  className = '',
  ariaLabel,
  tooltip,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5',
    xl: 'w-14 h-14 p-3'
  };

  const colorVariants = {
    slate: {
      ghost: 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40',
      solid: 'bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-slate-100',
      outline: 'border border-slate-600/50 text-slate-400 hover:text-slate-200 hover:border-slate-500/70 hover:bg-slate-700/30'
    },
    teal: {
      ghost: 'text-teal-400 hover:text-teal-300 hover:bg-teal-500/10',
      solid: 'bg-teal-600 text-white hover:bg-teal-700',
      outline: 'border border-teal-500/50 text-teal-400 hover:text-teal-300 hover:border-teal-400/70 hover:bg-teal-500/10'
    },
    red: {
      ghost: 'text-red-400 hover:text-red-300 hover:bg-red-500/10',
      solid: 'bg-red-600 text-white hover:bg-red-700',
      outline: 'border border-red-500/50 text-red-400 hover:text-red-300 hover:border-red-400/70 hover:bg-red-500/10'
    },
    indigo: {
      ghost: 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10',
      solid: 'bg-indigo-600 text-white hover:bg-indigo-700',
      outline: 'border border-indigo-500/50 text-indigo-400 hover:text-indigo-300 hover:border-indigo-400/70 hover:bg-indigo-500/10'
    }
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
    sizeClasses[size],
    disabled ? 'opacity-50 cursor-not-allowed' : colorVariants[color][variant],
    className
  );

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={baseClasses}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ duration: 0.15 }}
      aria-label={ariaLabel}
      title={tooltip}
      {...props}
    >
      {icon}
    </motion.button>
  );
};

export default IconButton;
