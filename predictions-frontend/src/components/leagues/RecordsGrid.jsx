import KickerLabel from '../ui/KickerLabel';

/**
 * League records tiles — real, derived from every settled gameweek's
 * prediction totals in the fetched window (utils/leagueStats.buildRecords).
 * Empty/sparse until the league has settled gameweeks on record.
 */
export default function RecordsGrid({ records }) {
  if (!records || records.length === 0) {
    return (
      <div className="rounded-16 border border-border-base bg-surface-card p-5">
        <KickerLabel className="mb-2">LEAGUE RECORDS</KickerLabel>
        <p className="text-[11.5px] leading-relaxed text-text-muted-2">
          No settled gameweeks yet — records appear once your league's first results are scored.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-[9px] sm:grid-cols-2">
      {records.map((r) => (
        <div key={r.label} className="flex flex-col gap-[3px] rounded-12 border border-border-base bg-surface-card-3 p-[12px_13px] md:p-[15px_17px]">
          <span className="font-mono text-[9.5px] tracking-[0.13em] text-text-muted-4">{r.label}</span>
          <span className="flex items-baseline gap-[10px]">
            <span className="font-dmSerif text-[21px] leading-none text-brand-teal md:text-[30px]">{r.val}</span>
            <span className="text-[13px] text-text-secondary">{r.who}</span>
          </span>
          <span className="text-[11px] leading-relaxed text-text-muted-2 md:text-[11.5px]">{r.note}</span>
        </div>
      ))}
    </div>
  );
}
