import KickerLabel from '../ui/KickerLabel';

/**
 * League records tiles — derived from settled gameweek prediction totals.
 */
export default function RecordsGrid({ records }) {
  if (!records || records.length === 0) {
    return (
      <div className="rounded-16 border border-border-base bg-surface-card p-5">
        <KickerLabel className="mb-2">LEAGUE RECORDS</KickerLabel>
        <p className="text-2xs leading-relaxed text-text-muted-2">
          No settled gameweeks yet — records appear once your league's first results are scored.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {records.map((r) => (
        <div key={r.label} className="flex flex-col gap-0.5 rounded-12 border border-border-base bg-surface-card-3 p-3 md:p-4">
          <span className="font-outfit text-3xs tracking-widest text-text-muted-4">{r.label}</span>
          <span className="flex items-baseline gap-2.5">
            <span className="font-dmSerif text-xl leading-none text-brand-teal md:text-3xl">{r.val}</span>
            <span className="text-caption text-text-secondary">{r.who}</span>
          </span>
          <span className="text-2xs leading-relaxed text-text-muted-2">{r.note}</span>
        </div>
      ))}
    </div>
  );
}
