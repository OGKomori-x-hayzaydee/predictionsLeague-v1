const VARIANTS = {
  primary: 'bg-brand-indigo-mid text-white hover:bg-brand-indigo-hover shadow-card',
  urgent: 'bg-brand-amber text-surface-app hover:brightness-95',
  secondary: 'border border-border-control bg-surface-card-2 text-text-primary hover:border-brand-teal/60',
  ghost: 'text-text-muted-1 hover:bg-surface-card-2 hover:text-text-primary',
  danger: 'border border-state-error/30 bg-state-error/15 text-state-error hover:bg-state-error/25',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-sm',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  pill = true,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        pill ? 'rounded-full' : 'rounded-md'
      } ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
