import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/classUtils';

/**
 * NavigationButton - Buttons for navigation and menu items
 * Used for: Menu items, navigation, back buttons, carousel navigation
 */
const NavigationButton = ({
  children,
  onClick,
  disabled = false,
  active = false,
  icon,
  direction,
  size = 'md',
  variant = 'menu',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const variantClasses = {
    menu: {
      base: 'flex items-center w-full text-left transition-colors rounded-md',
      active: 'bg-primary-600/60 text-teal-300 border-l-2 border-teal-400',
      inactive: 'text-white/70 hover:bg-primary-600/40 hover:text-teal-200'
    },
    tab: {
      base: 'relative flex-1 flex items-center justify-center gap-2 transition-all duration-200 rounded-xl font-medium',
      active: 'bg-teal-600 text-white shadow-lg shadow-teal-600/20',
      inactive: 'text-slate-300 hover:text-white hover:bg-slate-700/50'
    },
    back: {
      base: 'flex items-center text-white/70 hover:text-white transition-colors',
      active: '',
      inactive: ''
    },
    carousel: {
      base: 'absolute top-1/2 transform -translate-y-1/2 z-10 bg-indigo-900/80 hover:bg-primary-700 text-white rounded-full p-1 shadow-md',
      active: '',
      inactive: ''
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

  // Special positioning for carousel buttons
  const carouselStyle = variant === 'carousel' ? {
    [direction === 'left' ? 'left' : 'right']: 0
  } : {};

  const motionProps = variant === 'back' 
    ? { whileHover: { x: -3 } }
    : { whileHover: disabled ? {} : { scale: 1.02 }, whileTap: disabled ? {} : { scale: 0.98 } };

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={baseClasses}
      style={carouselStyle}
      transition={{ duration: 0.2 }}
      {...motionProps}
      {...props}
    >
      {icon && (
        <span className={cn(
          "flex-shrink-0",
          variant === 'menu' ? "mr-3" : "mr-1.5",
          variant === 'carousel' ? "w-5 h-5" : "w-4 h-4"
        )}>
          {icon}
        </span>
      )}
      {children}
      
      {/* Active indicator for tabs */}
      {variant === 'tab' && active && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
          layoutId="tabIndicator"
        />
      )}
    </motion.button>
  );
};

export default NavigationButton;
