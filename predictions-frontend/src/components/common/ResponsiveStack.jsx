import React from 'react';
import { spacing, padding } from '../../utils/mobileScaleUtils';

/**
 * ResponsiveStack Component
 * Vertical stack with responsive spacing
 * 
 * @param {string} space - Spacing variant (tight, normal, loose, section)
 * @param {string} pad - Optional padding variant (card, cardCompact, panel, section, page)
 * @param {string|React.Component} as - Element or component to render as (default: 'div')
 * @param {string} className - Additional classes
 * @param {React.ReactNode} children - Stack content
 * 
 * @example
 * // Simple stack with normal spacing
 * <ResponsiveStack>
 *   <Section1 />
 *   <Section2 />
 *   <Section3 />
 * </ResponsiveStack>
 * 
 * @example
 * // Tight spacing for compact layouts
 * <ResponsiveStack space="tight">
 *   <FormField />
 *   <FormField />
 *   <FormField />
 * </ResponsiveStack>
 * 
 * @example
 * // With padding (creates a card-like container)
 * <ResponsiveStack space="tight" pad="panel" className="bg-white rounded-xl border">
 *   <HeaderContent />
 *   <BodyContent />
 *   <FooterContent />
 * </ResponsiveStack>
 * 
 * @example
 * // Page-level container
 * <ResponsiveStack space="section" pad="page" className="min-h-screen">
 *   <Hero />
 *   <Features />
 *   <Footer />
 * </ResponsiveStack>
 * 
 * @example
 * // As motion.div with framer-motion
 * <ResponsiveStack as={motion.div} space="normal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
 *   <Content />
 * </ResponsiveStack>
 */
export const ResponsiveStack = ({ 
  space = 'normal',
  pad,
  as: Component = 'div',
  className = '',
  children,
  ...props
}) => {
  const spaceClass = spacing[space] || spacing.normal;
  const padClass = pad ? (padding[pad] || '') : '';
  
  return (
    <Component className={`${spaceClass} ${padClass} ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default ResponsiveStack;
