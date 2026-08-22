import { useEffect, useRef } from 'react';
import { X } from '@phosphor-icons/react';
import IconButton from './buttons/IconButton';

export default function Modal({ open, onClose, title, icon, busy = false, children, footer, className = '' }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const root = dialogRef.current;
    const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const onKey = (e) => {
      if (e.key === 'Escape' && !busy) onClose?.();
      if (e.key !== 'Tab' || !root) return;
      const nodes = [...root.querySelectorAll(selector)].filter((el) => !el.hasAttribute('disabled'));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    const onFocusIn = (e) => {
      if (root && !root.contains(e.target)) {
        const nodes = [...root.querySelectorAll(selector)].filter((el) => !el.hasAttribute('disabled'));
        nodes[0]?.focus();
      }
    };
    document.addEventListener('focusin', onFocusIn);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    root?.querySelectorAll(selector)?.[0]?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocusIn);
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={`relative z-[90] flex max-h-[90vh] w-full max-w-[440px] flex-col overflow-hidden rounded-lg border border-border-card bg-surface-card shadow-modal animate-slide-up ${className}`}
      >
        <div className="flex shrink-0 items-center gap-3 px-5 pt-5 pb-3">
          {icon}
          {title && (
            <h2 className="min-w-0 flex-1 font-dmSerif text-xl text-text-primary">{title}</h2>
          )}
          <IconButton label="Close" disabled={busy} onClick={onClose} className="ml-auto">
            <X size={18} />
          </IconButton>
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
