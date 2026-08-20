import KickerLabel from '../ui/KickerLabel';

const CHIP_TAGS = {
  doubleDown: '×2',
  wildcard: '×3',
  scorerFocus: 'S+',
  defensePlusPlus: 'D+',
  allInWeek: 'AI',
};

/**
 * Shared content for the desktop right rail (RecordSidebar) and the mobile
 * "Hit rate, bands & chip return" sheet (RecordMobileSheet) — Spine.dc.html
 * desktop lines 1031-1075 / mobile sheet lines 3850-3886. Every figure here
 * is a real aggregate over the user's own settled predictions (see
 * utils/recordStats.js and utils/profileStats.js) — nothing is mocked.
 */
export default function RecordSidebarContent({ scopeLabel, scopeVal, scopeVerdict, scopePct, scopeFoot, bandsLabel, bands, chipScope, chipReturn, insight }) {
  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex flex-col gap-2 rounded-12 border border-border-card bg-surface-card-3 p-4">
        <KickerLabel>{scopeLabel}</KickerLabel>
        <span className="flex items-baseline gap-2">
          <span className="font-dmSerif text-4xl leading-none text-brand-teal">{scopeVal}</span>
          <span className="text-[13px] text-text-muted-2">pts</span>
        </span>
        <span className="font-outfit text-[11px] leading-relaxed text-text-muted-2">{scopeVerdict}</span>
        <div className="relative mt-0.5 h-1 overflow-hidden rounded-full bg-surface-card-4">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-teal-mid to-brand-indigo-mid"
            style={{ width: `${Math.max(0, Math.min(100, scopePct))}%` }}
          />
        </div>
        {scopeFoot && <span className="font-outfit text-[10px] text-text-muted-4">{scopeFoot}</span>}
      </div>

      <div className="flex flex-col gap-2.5">
        <KickerLabel className="tracking-[0.16em]">{bandsLabel}</KickerLabel>
        {bands.every((b) => b.n === 0) ? (
          <p className="text-[12px] text-text-muted-3">No settled calls in this scope yet.</p>
        ) : (
          bands.map((b) => (
            <span key={b.label} className="flex items-center gap-2.5">
              <span className="w-[52px] shrink-0 text-[12.5px] text-text-tertiary">{b.label}</span>
              <span className="flex h-[7px] flex-1 overflow-hidden rounded-full bg-surface-card-4">
                <span className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
              </span>
              <span className="w-[24px] shrink-0 text-right font-outfit text-[11px] text-text-muted-1">{b.n}</span>
            </span>
          ))
        )}
      </div>

      <div className="h-px shrink-0 bg-border-base" />

      <div className="flex flex-col gap-2.5">
        <KickerLabel className="tracking-[0.16em]">CHIP RETURN, {chipScope}</KickerLabel>
        {chipReturn.map((c) => (
          <span key={c.chipId} className="flex items-center gap-2.5">
            <span className="w-5 shrink-0 font-outfit text-[10px] text-text-muted-1">{CHIP_TAGS[c.chipId] || c.icon}</span>
            <span className="flex-1 truncate text-[12.5px] text-text-tertiary">{c.name}</span>
            <span className="font-outfit text-[10px] text-text-muted-2">{c.usageCount ? `${c.usageCount} used` : 'unused'}</span>
            <span
              className="w-[38px] shrink-0 text-right font-outfit text-[11.5px]"
              style={{ color: c.totalReturn > 0 ? 'var(--brand-teal)' : c.usageCount > 0 ? 'var(--text-tertiary)' : 'var(--text-muted-4)' }}
            >
              {c.usageCount ? (c.totalReturn >= 0 ? `+${c.totalReturn}` : c.totalReturn) : '—'}
            </span>
          </span>
        ))}
      </div>

      {insight && (
        <div className="mt-auto flex flex-col gap-1.5 rounded-12 border border-border-card bg-surface-card-3 p-[15px]">
          <KickerLabel>THE PATTERN</KickerLabel>
          <span className="font-dmSerif text-[17px] leading-snug text-text-secondary">{insight.title}</span>
          <span className="text-xs leading-relaxed text-text-muted-2">{insight.body}</span>
        </div>
      )}
    </div>
  );
}
