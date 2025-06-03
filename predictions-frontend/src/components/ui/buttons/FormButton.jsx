import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/classUtils';

/**
 * FormButton - Specialized buttons for forms and input controls
 * Used for: Form submissions, step navigation, form actions
 */
const FormButton = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  icon,
  loadingText,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base'
  };

  const variantClasses = {
    primary: {
      base: 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors',
      disabled: 'bg-indigo-700/50 cursor-not-allowed text-indigo-200'
    },
    secondary: {
      base: 'border border-indigo-500/50 text-indigo-200 hover:bg-indigo-800/20 font-outfit transition-colors',
      disabled: 'border-indigo-500/30 text-indigo-300/50 cursor-not-allowed'
    },
    submit: {
      base: 'bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40',
      disabled: 'bg-purple-700/50 cursor-not-allowed text-purple-200'
    },
    cancel: {
      base: 'border border-slate-600/50 text-slate-300 hover:text-slate-100 hover:border-slate-500/70 hover:bg-slate-700/30',
      disabled: 'border-slate-600/30 text-slate-400/50 cursor-not-allowed'
    }
  };

  const variant_config = variantClasses[variant] || variantClasses.menu;
  
  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-md transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    (disabled || loading) ? variant_config.disabled : variant_config.base,
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
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {icon && !loading && (
        <span className="mr-2 flex-shrink-0">
          {icon}
        </span>
      )}
      <span>
        {loading && loadingText ? loadingText : children}
      </span>
    </motion.button>
  );
};

/**
 * StepButton - Navigation buttons for multi-step forms
 */
export const StepButton = ({
  children,
  onClick,
  disabled = false,
  direction = 'next',
  icon,
  className = '',
  ...props
}) => {
  const directionClasses = {
    next: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40',
    back: 'border border-slate-600/50 text-slate-300 hover:text-slate-100 hover:border-slate-500/70 hover:bg-slate-700/30',
    submit: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40'
  };

  const baseClasses = cn(
    'px-6 py-2.5 rounded-lg text-sm font-medium font-outfit transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
    disabled ? 'opacity-50 cursor-not-allowed' : directionClasses[direction],
    className
  );

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={baseClasses}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <div className="flex items-center">
        {direction === 'back' && icon && (
          <span className="mr-1 w-4 h-4">{icon}</span>
        )}
        {children}
        {direction === 'next' && icon && (
          <span className="ml-1 w-4 h-4">{icon}</span>
        )}
      </div>
    </motion.button>
  );
};

export default FormButton;
