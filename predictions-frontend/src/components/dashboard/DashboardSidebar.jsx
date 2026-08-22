import RivalsSection from './RivalsSection';
import ChipStockSection from './ChipStockSection';
import LedgerSection from './LedgerSection';

export default function DashboardSidebar({ ledger, ledgerFooter, ledgerLoading, leagues }) {
  return (
    <div className="hidden min-h-0 flex-col gap-6 overflow-y-auto border-l border-border-hairline bg-surface-bar px-6 py-6 lg:flex">
      <LedgerSection ledger={ledger} footer={ledgerFooter} isLoading={ledgerLoading} />
      <div className="h-px shrink-0 bg-border-base" />
      <ChipStockSection />
      <div className="h-px shrink-0 bg-border-base" />
      <RivalsSection leagues={leagues} />
    </div>
  );
}
