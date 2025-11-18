import React from 'react';
import { gridCols, gaps } from '../../utils/mobileScaleUtils';

/**
 * ResponsiveGrid Component
 * Auto-responsive grid that handles mobile → desktop layouts
 * 
 * @param {string} variant - Preset grid pattern (stats, auto2, auto3, auto4, etc.)
 * @param {string} gap - Gap size (tight, normal, loose, extraLoose)
 * @param {string} customCols - Override with custom grid-cols classes
 * @param {string|React.Component} as - Element or component to render as (default: 'div')
 * @param {string} className - Additional classes
 * @param {React.ReactNode} children - Grid content
 * 
 * @example
 * // Simple usage with preset
 * <ResponsiveGrid variant="stats">
 *   <StatCard />
 *   <StatCard />
 *   <StatCard />
 *   <StatCard />
 * </ResponsiveGrid>
 * 
 * @example
 * // Custom configuration
 * <ResponsiveGrid variant="auto3" gap="loose" className="mt-4">
 *   {items.map(item => <Card key={item.id} {...item} />)}
 * </ResponsiveGrid>
 * 
 * @example
 * // With custom columns
 * <ResponsiveGrid customCols="grid-cols-1 md:grid-cols-5" gap="tight">
 *   <CustomCard />
 * </ResponsiveGrid>
 * 
 * @example
 * // As motion.div with framer-motion
 * <ResponsiveGrid as={motion.div} variant="stats" variants={itemVariants}>
 *   <StatCard />
 * </ResponsiveGrid>
 */
export const ResponsiveGrid = ({ 
  variant = 'auto2',
  gap = 'normal',
  customCols,
  as: Component = 'div',
  className = '',
  children,
  ...props
}) => {
  // Use custom columns if provided, otherwise use variant from gridCols
  const gridClass = customCols || gridCols[variant] || gridCols.auto2;
  const gapClass = gaps[gap] || gaps.normal;
  
  return (
    <Component 
      className={`grid ${gridClass} ${gapClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default ResponsiveGrid;
