import RivalsSection from './RivalsSection';
import ChipStockSection from './ChipStockSection';
import LedgerSection from './LedgerSection';

/**
 * Mobile-only bottom sheet holding Rivals / Chips in hand / Last gameweek —
 * matching Spine.dc.html's `mobSheet === "dash"` overlay (lines 3773-3819).
 * This is Dashboard-local rather than a shared ui/ primitive: the prototype's
 * mobile shell has a generic multi-purpose sheet (dash/slip/rec), but no
 * such shared component exists yet in this codebase and building one is a
 * cross-screen concern outside this screen's scope — so this only covers
 * Dashboard's own "dash" sheet content.
 */
export default function DashboardMobileSheet({ open, onClose, ledger, ledgerFooter, ledgerLoading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] md:hidden">
      <div
        onClick={onClose}
        role="presentation"
        className="absolute inset-0 animate-rise-in bg-black/60"
      />
      <div className="absolute inset-x-0 bottom-0 z-[90] flex max-h-[78%] flex-col rounded-t-[20px] border border-border-card bg-surface-card shadow-modal animate-rise-in">
        <div className="flex flex-none items-center justify-center py-2">
          <span className="h-1 w-[34px] rounded-full bg-border-card" />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-[18px] pb-[22px] pt-1.5">
          <div className="flex flex-col gap-5">
            <RivalsSection />
            <div className="h-px shrink-0 bg-border-base" />
            <ChipStockSection />
            <div className="h-px shrink-0 bg-border-base" />
            <LedgerSection ledger={ledger} footer={ledgerFooter} isLoading={ledgerLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
