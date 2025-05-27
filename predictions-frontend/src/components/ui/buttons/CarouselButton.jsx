import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/classUtils';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

/**
 * CarouselButton - Navigation buttons for carousels and sliders
 * Used for: Image carousels, content sliders, navigation
 */
const CarouselButton = ({
  direction = 'next',
  onClick,
  disabled = false,
  visible = true,
  size = 'md',
  variant = 'default',
  className = '',
  ariaLabel,
  ...props
}) => {
  if (!visible) return null;

  const sizeClasses = {
    sm: 'w-8 h-8 p-1',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const variantClasses = {
    default: 'bg-indigo-900/80 hover:bg-primary-700 text-white shadow-md border border-indigo-800/50',
    minimal: 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/50',
    accent: 'bg-teal-600/80 hover:bg-teal-600 text-white shadow-lg shadow-teal-600/20 border border-teal-500/50'
  };

  const baseClasses = cn(
    'absolute top-1/2 transform -translate-y-1/2 z-10 rounded-full transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:ring-offset-2 focus:ring-offset-slate-900',
    'flex items-center justify-center',
    sizeClasses[size],
    disabled ? 'opacity-50 cursor-not-allowed' : variantClasses[variant],
    className
  );

  const positionStyle = {
    [direction === 'left' ? 'left' : 'right']: '8px'
  };

  const getIcon = () => {
    const iconClass = iconSizes[size];
    return direction === 'left' 
      ? <ChevronLeftIcon className={iconClass} />
      : <ChevronRightIcon className={iconClass} />;
  };

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={baseClasses}
      style={positionStyle}
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ duration: 0.2 }}
      aria-label={ariaLabel || `Scroll ${direction}`}
      {...props}
    >
      {getIcon()}
    </motion.button>
  );
};

/**
 * CarouselDots - Dot indicators for carousel position
 */
export const CarouselDots = ({
  total,
  current,
  onDotClick,
  className = '',
  ...props
}) => {
  if (total <= 1) return null;

  return (
    <div className={cn("flex justify-center space-x-2 mt-4", className)} {...props}>
      {Array.from({ length: total }).map((_, index) => (
        <motion.button
          key={index}
          onClick={() => onDotClick?.(index)}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-200",
            index === current 
              ? "bg-teal-400 scale-125" 
              : "bg-slate-600 hover:bg-slate-500"
          )}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default CarouselButton;
