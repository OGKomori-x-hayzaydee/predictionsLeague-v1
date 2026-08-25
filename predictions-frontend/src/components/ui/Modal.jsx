import { useEffect } from 'react';
import { X } from '@phosphor-icons/react';

/**
 * Centered overlay dialog. Esc and backdrop click close unless `busy`.
 */
export default function Modal({ open, onClose, title, icon, busy = false, children, footer, className = '' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && !busy) onClose?.();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, busy, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        role="presentation"
        onClick={() => {
          if (!busy) onClose?.();
        }}
        className="absolute inset-0 bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={`relative z-[90] flex max-h-[90vh] w-full max-w-[440px] flex-col overflow-hidden rounded-[18px] border border-border-card bg-surface-card shadow-modal ${className}`}
      >
        <div className="flex shrink-0 items-center gap-3 px-5 pt-5 pb-3">
          {icon}
          {title && (
            <h2 className="min-w-0 flex-1 font-dmSerif text-xl text-text-primary">{title}</h2>
          )}
          <button
            type="button"
            aria-label="Close"
            disabled={busy}
            onClick={onClose}
            className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-full text-text-muted-2 transition-colors hover:text-text-primary disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">{children}</div>
        {footer && (
          <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border-base px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
