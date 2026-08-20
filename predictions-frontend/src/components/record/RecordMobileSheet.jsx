import RecordSidebarContent from './RecordSidebarContent';

/**
 * Mobile-only bottom sheet holding the same scope/bands/chip-return/insight
 * content as RecordSidebar — Spine.dc.html `mobSheetIsRec` (lines 3850-3887),
 * opened from the "Hit rate, bands & chip return" button (line 2861).
 */
export default function RecordMobileSheet({ open, onClose, ...contentProps }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] md:hidden">
      <div onClick={onClose} role="presentation" className="absolute inset-0 animate-rise-in bg-black/60" />
      <div className="absolute inset-x-0 bottom-0 z-[90] flex max-h-[78%] flex-col rounded-t-20 border border-border-card bg-surface-card shadow-modal animate-rise-in">
        <div className="flex flex-none items-center justify-center py-2">
          <span className="h-1 w-[34px] rounded-full bg-border-card" />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-[18px] pb-[22px] pt-1.5">
          <RecordSidebarContent {...contentProps} />
        </div>
      </div>
    </div>
  );
}
