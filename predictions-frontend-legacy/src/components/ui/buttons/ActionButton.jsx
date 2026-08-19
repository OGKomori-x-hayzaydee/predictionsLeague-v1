import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/classUtils';

/**
 * ActionButton - Buttons for specific actions with contextual styling
 * Used for: Predict, Edit, Join, Apply, etc.
 */
const ActionButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'primary',
  color = 'teal',
  className = '',
  type = 'button',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const colorVariants = {
    teal: {
      primary: 'bg-teal-600/20 hover:bg-teal-600/30 text-teal-400 hover:text-teal-300 border border-teal-500/30',
      solid: 'bg-teal-600 hover:bg-teal-700 text-white border border-teal-500/50',
      ghost: 'text-teal-400 hover:text-teal-300 hover:bg-teal-500/10'
    },
    indigo: {
      primary: 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 hover:text-indigo-300 border border-indigo-500/30',
      solid: 'bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500/50',
      ghost: 'text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10'
    },
    purple: {
      primary: 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-500/30',
      solid: 'bg-purple-600 hover:bg-purple-700 text-white border border-purple-500/50',
      ghost: 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10'
    },
    amber: {
      primary: 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 hover:text-amber-300 border border-amber-500/30',
      solid: 'bg-amber-600 hover:bg-amber-700 text-white border border-amber-500/50',
      ghost: 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
    },
    red: {
      primary: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-500/30',
      solid: 'bg-red-600 hover:bg-red-700 text-white border border-red-500/50',
      ghost: 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
    }
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium font-outfit transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
    sizeClasses[size],
    disabled || loading ? 'opacity-50 cursor-not-allowed' : colorVariants[color][variant],
    className
  );

  const renderIcon = () => {
    if (loading) {
      return <div className={cn("border-2 border-current border-t-transparent rounded-full animate-spin", iconSizes[size])} />;
    }
    if (icon) {
      return React.cloneElement(icon, { className: iconSizes[size] });
    }
    return null;
  };

  return (
    <motion.button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={baseClasses}
      whileHover={disabled || loading ? {} : { scale: 1.05 }}
      whileTap={disabled || loading ? {} : { scale: 0.95 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </motion.button>
  );
};

export default ActionButton;
