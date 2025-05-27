import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../utils/classUtils';

/**
 * MenuButton - Dropdown menu trigger buttons with menu content
 * Used for: Action menus, filter menus, sort menus, dropdown menus
 */
const MenuButton = ({
  children,
  menuContent,
  isOpen,
  onToggle,
  disabled = false,
  icon,
  size = 'md',
  variant = 'default',
  position = 'bottom-right',
  className = '',
  menuClassName = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const variantClasses = {
    default: 'bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 text-white/80 hover:text-white/90',
    filter: 'bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 text-white/80',
    actions: 'bg-slate-700/40 hover:bg-slate-700/60 border border-slate-600/30 text-white/70 hover:text-white/90'
  };

  const positionClasses = {
    'bottom-right': 'right-0 top-full mt-1',
    'bottom-left': 'left-0 top-full mt-1',
    'top-right': 'right-0 bottom-full mb-1',
    'top-left': 'left-0 bottom-full mb-1'
  };

  const baseClasses = cn(
    'inline-flex items-center rounded-md transition-colors relative',
    sizeClasses[size],
    variantClasses[variant],
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  );

  const menuClasses = cn(
    'absolute z-20 bg-slate-800 border border-slate-600/40 rounded-lg shadow-xl',
    positionClasses[position],
    'min-w-[180px] py-1.5',
    menuClassName
  );

  return (
    <div className="relative">
      <motion.button
        onClick={disabled ? undefined : onToggle}
        disabled={disabled}
        className={baseClasses}
        whileHover={disabled ? {} : { scale: 1.02 }}
        whileTap={disabled ? {} : { scale: 0.98 }}
        transition={{ duration: 0.15 }}
        {...props}
      >
        {icon && (
          <span className="mr-1.5 w-4 h-4 flex-shrink-0">
            {icon}
          </span>
        )}
        {children}
      </motion.button>

      <AnimatePresence>
        {isOpen && menuContent && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={menuClasses}
          >
            {menuContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * MenuItem - Individual menu item component
 */
export const MenuItem = ({
  children,
  onClick,
  icon,
  disabled = false,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantClasses = {
    default: 'text-white/90 hover:bg-slate-700/50',
    danger: 'text-red-300 hover:bg-red-500/10',
    success: 'text-emerald-300 hover:bg-emerald-500/10'
  };

  const classes = cn(
    'w-full text-left px-3 py-2 flex items-center text-sm transition-colors',
    variantClasses[variant],
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  );

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={classes}
      whileHover={disabled ? {} : { x: 2 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {icon && (
        <span className="w-4 h-4 mr-2.5 flex-shrink-0">
          {icon}
        </span>
      )}
      {children}
    </motion.button>
  );
};

export default MenuButton;
