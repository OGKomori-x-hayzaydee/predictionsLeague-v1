import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/classUtils';

/**
 * ToggleButton - Buttons with on/off states
 * Used for: Theme toggle, view toggle, filter toggle, expand/collapse
 */
const ToggleButton = ({
  children,
  onClick,
  active = false,
  disabled = false,
  icon,
  size = 'md',
  variant = 'default',
  className = '',
  tooltip,
  ...props
}) => {
  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base'
  };

  const variantClasses = {
    default: {
      base: 'inline-flex items-center justify-center rounded-lg transition-all duration-200',
      active: 'bg-primary-600 text-white shadow-inner',
      inactive: 'text-white/60 hover:text-white/80 hover:bg-primary-700/40'
    },
    theme: {
      base: 'relative inline-flex items-center justify-center w-10 h-10 rounded-full overflow-hidden transition-all duration-200',
      active: 'bg-primary-700',
      inactive: 'bg-indigo-100'
    },
    chip: {
      base: 'relative flex items-center rounded-xl border transition-all duration-200 p-3',
      active: 'border-teal-400/60 bg-teal-500/10 shadow-lg shadow-teal-500/10',
      inactive: 'border-slate-600/30 bg-slate-800/20 hover:bg-slate-700/30'
    },
    expand: {
      base: 'p-2 rounded-lg transition-all duration-200',
      active: 'bg-slate-700/50 text-slate-300',
      inactive: 'bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-slate-200 border border-slate-600/50 hover:border-slate-500/50'
    }
  };

  const variant_config = variantClasses[variant] || variantClasses.menu;
  
  const baseClasses = cn(
    variant_config.base,
    sizeClasses[size],
    active ? variant_config.active : variant_config.inactive,
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  );

  const getMotionProps = () => {
    switch (variant) {
      case 'theme':
        return {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 }
        };
      case 'chip':
        return {
          whileHover: disabled ? {} : { scale: 1.02 },
          whileTap: { scale: 0.98 }
        };
      default:
        return {
          whileHover: disabled ? {} : { scale: 1.02 },
          whileTap: disabled ? {} : { scale: 0.98 }
        };
    }
  };

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={baseClasses}
      transition={{ duration: 0.2 }}
      title={tooltip}
      {...getMotionProps()}
      {...props}
    >
      {icon && (
        <div className="flex-shrink-0 mr-1.5">
          {icon}
        </div>
      )}
      {children}
    </motion.button>
  );
};

export default ToggleButton;
