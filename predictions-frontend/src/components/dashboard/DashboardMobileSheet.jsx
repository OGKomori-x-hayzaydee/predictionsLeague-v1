import { useEffect } from 'react';
import RivalsSection from './RivalsSection';
import ChipStockSection from './ChipStockSection';
import LedgerSection from './LedgerSection';

export default function DashboardMobileSheet({ open, onClose, ledger, ledgerFooter, ledgerLoading, leagues }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        aria-label="Close sheet"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ledger, chips and rivals"
        className="absolute inset-x-0 bottom-0 z-[90] flex max-h-[78%] flex-col rounded-t-lg border border-border-card bg-surface-card shadow-modal animate-slide-up"
      >
        <div className="flex flex-none items-center justify-center py-2">
          <span className="h-1 w-8 rounded-full bg-border-card" />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-1.5">
          <div className="flex flex-col gap-5">
            <LedgerSection ledger={ledger} footer={ledgerFooter} isLoading={ledgerLoading} />
            <div className="h-px shrink-0 bg-border-base" />
            <ChipStockSection />
            <div className="h-px shrink-0 bg-border-base" />
            <RivalsSection leagues={leagues} />
          </div>
        </div>
      </div>
    </div>
  );
}
