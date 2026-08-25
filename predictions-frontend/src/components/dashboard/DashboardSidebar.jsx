import RivalsSection from './RivalsSection';
import ChipStockSection from './ChipStockSection';
import LedgerSection from './LedgerSection';

/**
 * Desktop-only right rail (foundation spec §5.3, dash grid `1fr 400px`):
 * Rivals · Chips in hand · Last gameweek, matching Spine.dc.html desktop
 * dashboard lines 269-315. On mobile the same three sections are rendered
 * inside DashboardMobileSheet instead (prototype mobile lines 2339-2342 +
 * 3779-3819) since the mobile shell has no equivalent right-rail chrome.
 */
export default function DashboardSidebar({ ledger, ledgerFooter, ledgerLoading, leagues }) {
  return (
    <div className="hidden min-h-0 flex-col gap-[22px] overflow-y-auto border-l border-border-hairline bg-surface-bar px-6 py-6 md:flex">
      <RivalsSection leagues={leagues} />
      <div className="h-px shrink-0 bg-border-base" />
      <ChipStockSection />
      <div className="h-px shrink-0 bg-border-base" />
      <LedgerSection ledger={ledger} footer={ledgerFooter} isLoading={ledgerLoading} />
    </div>
  );
}
