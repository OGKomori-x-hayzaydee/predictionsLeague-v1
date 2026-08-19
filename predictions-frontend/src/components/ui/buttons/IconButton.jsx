export default function IconButton({ children, active = false, className = '', ...props }) {
  return (
    <button
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
        active ? 'bg-brand-teal/15 text-brand-teal' : 'text-text-muted-1 hover:bg-surface-card-2 hover:text-text-primary'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
