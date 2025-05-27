import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../utils/classUtils';
import { CheckIcon, Cross2Icon, ClockIcon } from '@radix-ui/react-icons';

/**
 * StatusButton - Buttons that display status with appropriate styling
 * Used for: Status indicators, prediction states, action outcomes
 */
const StatusButton = ({
  children,
  onClick,
  status = 'pending',
  disabled = false,
  size = 'md',
  showIcon = true,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const statusConfig = {
    pending: {
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-300',
      borderColor: 'border-amber-500/20',
      icon: ClockIcon,
      hoverBg: 'hover:bg-amber-500/20'
    },
    correct: {
      bgColor: 'bg-emerald-500/10',
      textColor: 'text-emerald-300',
      borderColor: 'border-emerald-500/20',
      icon: CheckIcon,
      hoverBg: 'hover:bg-emerald-500/20'
    },
    incorrect: {
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-300',
      borderColor: 'border-red-500/20',
      icon: Cross2Icon,
      hoverBg: 'hover:bg-red-500/20'
    },
    active: {
      bgColor: 'bg-teal-500/10',
      textColor: 'text-teal-300',
      borderColor: 'border-teal-500/20',
      icon: CheckIcon,
      hoverBg: 'hover:bg-teal-500/20'
    },
    inactive: {
      bgColor: 'bg-slate-500/10',
      textColor: 'text-slate-400',
      borderColor: 'border-slate-500/20',
      icon: null,
      hoverBg: 'hover:bg-slate-500/20'
    }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-1.5 rounded-lg border transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900',
    sizeClasses[size],
    config.bgColor,
    config.textColor,
    config.borderColor,
    !disabled && onClick ? config.hoverBg : '',
    disabled ? 'opacity-50 cursor-not-allowed' : onClick ? 'cursor-pointer' : 'cursor-default',
    className
  );

  const ButtonComponent = onClick ? motion.button : motion.div;

  const motionProps = onClick && !disabled ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <ButtonComponent
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={baseClasses}
      {...motionProps}
      {...props}
    >
      {showIcon && StatusIcon && (
        <StatusIcon className="w-3 h-3 flex-shrink-0" />
      )}
      {children}
    </ButtonComponent>
  );
};

/**
 * BadgeButton - Small status badges that can be interactive
 */
export const BadgeButton = ({
  children,
  onClick,
  variant = 'default',
  size = 'sm',
  icon,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const variantClasses = {
    default: 'bg-slate-700/30 text-slate-300 border border-slate-600/30',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
  };

  const baseClasses = cn(
    'inline-flex items-center gap-1 rounded-full font-medium transition-colors',
    sizeClasses[size],
    variantClasses[variant],
    onClick ? 'cursor-pointer hover:opacity-80' : 'cursor-default',
    className
  );

  const ButtonComponent = onClick ? motion.button : 'span';

  return (
    <ButtonComponent
      onClick={onClick}
      className={baseClasses}
      {...(onClick ? {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 }
      } : {})}
      {...props}
    >
      {icon && (
        <span className="w-3 h-3 flex-shrink-0">
          {icon}
        </span>
      )}
      {children}
    </ButtonComponent>
  );
};

export default StatusButton;
