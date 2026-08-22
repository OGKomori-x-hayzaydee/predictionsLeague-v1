export default function IconButton({
  children,
  active = false,
  className = '',
  label,
  ...props
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal ${
        active
          ? 'bg-brand-teal/15 text-brand-teal'
          : 'text-text-muted hover:bg-surface-elevated hover:text-text-primary'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
