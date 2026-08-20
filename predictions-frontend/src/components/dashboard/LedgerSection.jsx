import { useNavigate } from 'react-router-dom';
import KickerLabel from '../ui/KickerLabel';

/**
 * "LAST GAMEWEEK" panel — real data, derived in useDashboardData from the
 * backend's /dashboard/predictions/recent (matchId/scores/correct/points/
 * gameweek), filtered client-side to the most recently completed gameweek.
 * Styled to match prototype lines 300-313.
 */
export default function LedgerSection({ ledger, footer, isLoading }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-[13px]">
      <KickerLabel as="div" className="tracking-[0.16em] text-text-muted-3">
        Last gameweek
      </KickerLabel>
      {isLoading && <p className="text-xs text-text-muted-2">Loading…</p>}
      {!isLoading && (!ledger || ledger.length === 0) && (
        <p className="text-xs text-text-muted-2">No scored predictions yet this season.</p>
      )}
      <div className="flex flex-col gap-[13px]">
        {(ledger || []).map((entry) => (
          <button
            key={entry.id}
            onClick={() => navigate('/record')}
            className="flex cursor-pointer items-center gap-[10px] text-left"
          >
            <span className="h-[26px] w-[2px] shrink-0 rounded-sm" style={{ background: entry.mark }} />
            <span className="flex min-w-0 flex-1 flex-col leading-[1.25]">
              <span className="truncate text-[13px] text-[#dbe3ee]">{entry.match}</span>
              <span className="font-outfit text-[11px] text-[#66748c]">{entry.detail}</span>
            </span>
            <span className="shrink-0 font-dmSerif text-xl" style={{ color: entry.mark }}>
              {entry.pts > 0 ? `+${entry.pts}` : entry.pts}
            </span>
          </button>
        ))}
      </div>
      {footer && <span className="font-outfit text-[11px] text-[#4f5b70]">{footer}</span>}
    </div>
  );
}
