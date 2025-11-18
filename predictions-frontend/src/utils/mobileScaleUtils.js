/**
 * Mobile-First Responsive Scale Utilities
 * Provides consistent scaling patterns across the app
 * 
 * Usage:
 * import { spacing, textScale, gridCols } from '@/utils/mobileScaleUtils';
 * <div className={spacing.normal}>...</div>
 */

// ==================== SPACING ====================
// Vertical gaps between sections
export const spacing = {
  tight: "space-y-2 sm:space-y-3 md:space-y-4",
  normal: "space-y-3 sm:space-y-4 md:space-y-6",    // DashboardView pattern
  loose: "space-y-4 sm:space-y-6 md:space-y-8",
  section: "space-y-5 sm:space-y-6 md:space-y-8",
};

// ==================== GAPS ====================
// For grid/flex layouts
export const gaps = {
  tight: "gap-2 sm:gap-2.5 md:gap-3",
  normal: "gap-2 sm:gap-3 md:gap-5",                // DashboardView pattern
  loose: "gap-3 sm:gap-4 md:gap-6",
  extraLoose: "gap-4 sm:gap-5 md:gap-8",
};

// ==================== PADDING ====================
export const padding = {
  card: "p-3 sm:p-4 md:p-5",
  cardCompact: "p-2.5 sm:p-3 md:p-4",
  cardTight: "p-2 sm:p-2.5 md:p-3",
  panel: "p-4 sm:p-5 md:p-6",
  section: "px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5",
  page: "p-4 sm:p-5 md:p-6",
};

// ==================== MARGINS ====================
export const margins = {
  bottom: {
    tight: "mb-1.5 sm:mb-2 md:mb-3",
    normal: "mb-2 sm:mb-3 md:mb-4",               // DashboardView pattern
    loose: "mb-3 sm:mb-4 md:mb-6",
  },
  top: {
    tight: "mt-1.5 sm:mt-2 md:mt-3",
    normal: "mt-2 sm:mt-3 md:mt-4",
    loose: "mt-3 sm:mt-4 md:mt-6",
  },
};

// ==================== TEXT SCALING ====================
export const textScale = {
  // Page headings
  h1: "text-xl sm:text-2xl md:text-3xl",           // DashboardView pattern
  h2: "text-lg sm:text-xl md:text-2xl",
  h3: "text-base sm:text-lg md:text-xl",
  h4: "text-sm sm:text-base md:text-lg",
  
  // Subheadings
  subheading: "text-sm sm:text-base md:text-lg",
  subheadingSmall: "text-xs sm:text-sm md:text-base",
  
  // Body text
  body: "text-sm sm:text-base",                     // DashboardView pattern
  bodyLarge: "text-base sm:text-lg",
  bodySmall: "text-xs sm:text-sm",
  
  // Labels/captions
  label: "text-xs sm:text-sm",
  labelTiny: "text-2xs sm:text-xs",
  caption: "text-2xs sm:text-xs",
};

// ==================== GRID COLUMNS ====================
export const gridCols = {
  // Stats cards pattern (DashboardView)
  stats: "grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4",
  
  // Generic auto-responsive grids
  auto2: "grid-cols-1 sm:grid-cols-2",
  auto3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  auto4: "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  
  // Flexible grids
  responsive: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  
  // Specific layouts
  dashboardMain: "grid-cols-1 xl:grid-cols-3",     // DashboardView pattern (sidebar)
  dashboardContent: "xl:col-span-2",               // Main content area
  dashboardSidebar: "",                             // Sidebar (1 col)
  
  // Equal columns at all breakpoints
  equal2: "grid-cols-2",
  equal3: "grid-cols-3",
  equal4: "grid-cols-4",
};

// ==================== BORDER RADIUS ====================
export const borderRadius = {
  card: "rounded-lg sm:rounded-xl",
  panel: "rounded-xl sm:rounded-2xl",
  button: "rounded-md sm:rounded-lg",
  input: "rounded-md sm:rounded-lg",
  badge: "rounded-full",
};

// ==================== ICON SIZES ====================
export const iconSize = {
  tiny: "w-3 h-3 sm:w-3.5 sm:h-3.5",
  small: "w-3.5 h-3.5 sm:w-4 sm:h-4",
  normal: "w-4 h-4 sm:w-5 sm:h-5",
  large: "w-5 h-5 sm:w-6 sm:h-6",
  xlarge: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8",
};

// ==================== COMBINED PATTERNS ====================
// Common combinations for convenience
export const patterns = {
  // View container (like DashboardView)
  viewContainer: spacing.normal,
  
  // Section header
  sectionHeader: margins.bottom.normal,
  
  // Card grid (stats cards)
  statsGrid: `${gridCols.stats} ${gaps.normal}`,
  
  // Panel padding
  panel: padding.panel,
  
  // Page wrapper
  page: `${spacing.normal} ${padding.page}`,
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Combine multiple utility classes
 * Filters out falsy values for conditional classes
 * 
 * @param  {...string} classes - Class strings to combine
 * @returns {string} Combined class string
 * 
 * @example
 * combine(spacing.normal, theme === 'dark' && 'bg-dark', 'custom-class')
 */
export const combine = (...classes) => classes.filter(Boolean).join(' ');

/**
 * Get responsive padding based on component type
 * 
 * @param {string} type - Component type (card, panel, section, page)
 * @returns {string} Padding classes
 */
export const getPadding = (type = 'card') => padding[type] || padding.card;

/**
 * Get responsive gap based on density
 * 
 * @param {string} density - Gap density (tight, normal, loose)
 * @returns {string} Gap classes
 */
export const getGap = (density = 'normal') => gaps[density] || gaps.normal;

/**
 * Get responsive spacing based on density
 * 
 * @param {string} density - Spacing density (tight, normal, loose, section)
 * @returns {string} Spacing classes
 */
export const getSpacing = (density = 'normal') => spacing[density] || spacing.normal;

/**
 * Build a responsive grid with custom configuration
 * 
 * @param {Object} config - Grid configuration
 * @param {string} config.cols - Column configuration key or custom classes
 * @param {string} config.gap - Gap size (tight, normal, loose)
 * @param {string} config.className - Additional classes
 * @returns {string} Complete grid classes
 * 
 * @example
 * buildGrid({ cols: 'stats', gap: 'normal', className: 'mt-4' })
 */
export const buildGrid = ({ cols = 'auto2', gap = 'normal', className = '' } = {}) => {
  const colClass = gridCols[cols] || cols;
  const gapClass = gaps[gap] || gaps.normal;
  return combine('grid', colClass, gapClass, className);
};

/**
 * Build responsive text classes
 * 
 * @param {Object} config - Text configuration
 * @param {string} config.variant - Text scale variant
 * @param {string} config.className - Additional classes
 * @returns {string} Complete text classes
 * 
 * @example
 * buildText({ variant: 'h1', className: 'font-bold text-teal-700' })
 */
export const buildText = ({ variant = 'body', className = '' } = {}) => {
  const scaleClass = textScale[variant] || textScale.body;
  return combine(scaleClass, className);
};

// ==================== MOBILE-SPECIFIC UTILITIES ====================

/**
 * Classes that only apply on mobile
 */
export const mobileOnly = {
  hidden: "sm:hidden",
  block: "block sm:hidden",
  flex: "flex sm:hidden",
  grid: "grid sm:hidden",
};

/**
 * Classes that hide on mobile
 */
export const desktopOnly = {
  hidden: "hidden sm:block",
  flex: "hidden sm:flex",
  grid: "hidden sm:grid",
};

/**
 * Responsive flex direction
 */
export const flexDirection = {
  mobileCol: "flex-col sm:flex-row",
  mobileRow: "flex-row sm:flex-col",
};

/**
 * Common mobile touch target sizes
 */
export const touchTarget = {
  small: "min-h-[44px] min-w-[44px]",    // iOS minimum
  normal: "min-h-[48px] min-w-[48px]",   // Material Design
  large: "min-h-[56px] min-w-[56px]",
};

// ==================== EXPORTS ====================

export default {
  spacing,
  gaps,
  padding,
  margins,
  textScale,
  gridCols,
  borderRadius,
  iconSize,
  patterns,
  mobileOnly,
  desktopOnly,
  flexDirection,
  touchTarget,
  // Helper functions
  combine,
  getPadding,
  getGap,
  getSpacing,
  buildGrid,
  buildText,
};
