import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/classUtils';

/**
 * SecondaryButton - Secondary actions with subtle styling
 * Used for: Cancel actions, secondary CTAs, back buttons
 */
const SecondaryButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'outline',
  className = '',
  type = 'button',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variantClasses = {
    outline: 'border border-slate-600/50 text-slate-300 hover:text-slate-100 hover:border-slate-500/70 hover:bg-slate-700/30',
    ghost: 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30',
    subtle: 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50 hover:text-slate-200 border border-slate-600/30'
  };

  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-lg font-medium font-outfit transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-2 focus:ring-offset-slate-900',
    sizeClasses[size],
    disabled || loading ? 'opacity-50 cursor-not-allowed' : variantClasses[variant],
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
      transition={{ duration: 0.2 }}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </motion.button>
  );
};

export default SecondaryButton;
