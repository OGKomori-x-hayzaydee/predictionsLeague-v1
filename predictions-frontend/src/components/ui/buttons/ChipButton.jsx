import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/classUtils';

/**
 * ChipButton - Buttons that represent selectable chips/tags
 * Used for: Game chips, filter chips, selectable options
 */
const ChipButton = ({
  children,
  onClick,
  selected = false,
  disabled = false,
  color = 'teal',
  size = 'md',
  variant = 'default',
  icon,
  value,
  maxValue,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'p-3 text-sm',
    lg: 'p-4 text-base'
  };
  const colorVariants = {
    teal: {
      selected: 'border-teal-400/60 bg-teal-500/10 shadow-lg shadow-teal-500/10',
      unselected: 'border-slate-600/30 bg-slate-800/20 hover:bg-slate-700/30'
    },
    emerald: {
      selected: 'border-emerald-400/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10',
      unselected: 'border-slate-600/30 bg-slate-800/20 hover:bg-slate-700/30'
    },
    indigo: {
      selected: 'border-indigo-400/60 bg-indigo-500/10 shadow-lg shadow-indigo-500/10',
      unselected: 'border-slate-600/30 bg-slate-800/20 hover:bg-slate-700/30'
    },
    purple: {
      selected: 'border-purple-400/60 bg-purple-500/10 shadow-lg shadow-purple-500/10',
      unselected: 'border-slate-600/30 bg-slate-800/20 hover:bg-slate-700/30'
    },
    amber: {
      selected: 'border-amber-400/60 bg-amber-500/10 shadow-lg shadow-amber-500/10',
      unselected: 'border-slate-600/30 bg-slate-800/20 hover:bg-slate-700/30'
    },
    cyan: {
      selected: 'border-cyan-400/60 bg-cyan-500/10 shadow-lg shadow-cyan-500/10',
      unselected: 'border-slate-600/30 bg-slate-800/20 hover:bg-slate-700/30'
    }
  };

  const getChipStyles = () => {
    if (disabled) {
      return 'opacity-50 cursor-not-allowed border-slate-600/30 bg-slate-800/20';
    }
    return selected 
      ? colorVariants[color].selected 
      : colorVariants[color].unselected;
  };

  const baseClasses = cn(
    'relative flex items-center rounded-xl border transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
    sizeClasses[size],
    getChipStyles(),
    className
  );

  const getMotionProps = () => {
    if (disabled) return {};
    
    return {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.2 }
    };
  };

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={baseClasses}
      {...getMotionProps()}
      {...props}
    >
      {/* Icon section */}
      {icon && (
        <div className="flex-shrink-0 mr-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center border",
            selected 
              ? `bg-${color}-900/40 border-${color}-700/30`
              : 'bg-slate-800/40 border-slate-700/30'
          )}>
            <span className={cn(
              "text-lg font-bold",
              selected ? `text-${color}-400` : 'text-slate-400'
            )}>
              {icon}
            </span>
          </div>
        </div>
      )}

      {/* Content section */}
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between mb-1">
          <h4 className={cn(
            "font-semibold",
            selected ? 'text-slate-100' : 'text-slate-300'
          )}>
            {children}
          </h4>
          {selected && (
            <div className={cn(
              "w-2 h-2 rounded-full",
              `bg-${color}-400`
            )} />
          )}
        </div>
        
        {/* Value indicator */}
        {value && maxValue && (
          <div className="text-xs text-slate-400 mb-2">
            Worth up to {maxValue} points
          </div>
        )}
      </div>

      {/* Selection indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            "absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 flex items-center justify-center",
            `bg-${color}-400`
          )}
        >
          <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </motion.div>
      )}
    </motion.button>
  );
};

/**
 * SimpleChip - Simplified chip for tags and labels
 */
export const SimpleChip = ({
  children,
  onClick,
  selected = false,
  color = 'slate',
  size = 'sm',
  removable = false,
  onRemove,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const colorClasses = {
    slate: selected ? 'bg-slate-600 text-white' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50',
    teal: selected ? 'bg-teal-600 text-white' : 'bg-teal-600/20 text-teal-300 hover:bg-teal-600/30',
    indigo: selected ? 'bg-indigo-600 text-white' : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30'
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full transition-colors font-medium',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
      {removable && (
        <span 
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1.5 w-3 h-3 rounded-full bg-current/20 hover:bg-current/30 flex items-center justify-center cursor-pointer"
        >
          ×
        </span>
      )}
    </motion.button>
  );
};

export default ChipButton;
