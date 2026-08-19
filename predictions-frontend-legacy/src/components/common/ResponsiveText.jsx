import React from 'react';
import { textScale } from '../../utils/mobileScaleUtils';

/**
 * ResponsiveText Component
 * Auto-scaling text component that adjusts size across breakpoints
 * 
 * @param {string} variant - Text scale variant (h1, h2, h3, h4, body, label, caption, etc.)
 * @param {string} as - HTML element to render (h1, h2, h3, p, span, div, etc.)
 * @param {string} className - Additional classes
 * @param {React.ReactNode} children - Text content
 * 
 * @example
 * // Page heading
 * <ResponsiveText variant="h1" as="h1" className="font-bold text-teal-700">
 *   Welcome back
 * </ResponsiveText>
 * 
 * @example
 * // Subheading
 * <ResponsiveText variant="subheading" className="text-slate-600">
 *   Check your performance
 * </ResponsiveText>
 * 
 * @example
 * // Body text (default)
 * <ResponsiveText className="text-slate-700">
 *   This is body text that scales from sm to base
 * </ResponsiveText>
 * 
 * @example
 * // Label with custom element
 * <ResponsiveText variant="label" as="label" htmlFor="input-id" className="font-medium">
 *   Username
 * </ResponsiveText>
 */
export const ResponsiveText = ({ 
  variant = 'body',
  as: Component = 'p',
  className = '',
  children,
  ...props 
}) => {
  const scaleClass = textScale[variant] || textScale.body;
  
  return (
    <Component className={`${scaleClass} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default ResponsiveText;
