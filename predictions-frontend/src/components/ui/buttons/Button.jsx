const VARIANTS = {
  primary: 'bg-brand-teal-deep text-white hover:bg-brand-teal shadow-card',
  urgent: 'bg-brand-amber text-surface-app hover:brightness-95',
  secondary:
    'border border-border-control bg-surface-elevated text-text-primary hover:border-brand-teal/60',
  ghost: 'text-text-muted hover:bg-surface-elevated hover:text-text-primary',
  danger:
    'border border-state-error/30 bg-state-error/15 text-state-error hover:bg-state-error/25',
};

const SIZES = {
  sm: 'min-h-11 px-3 py-1.5 text-xs',
  md: 'min-h-11 px-4 py-2.5 text-sm',
  lg: 'min-h-12 px-6 py-3 text-sm',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  pill = false,
  loading = false,
  className = '',
  children,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-outfit font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal disabled:cursor-not-allowed disabled:opacity-40 ${
        pill ? 'rounded-full' : 'rounded-md'
      } ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
