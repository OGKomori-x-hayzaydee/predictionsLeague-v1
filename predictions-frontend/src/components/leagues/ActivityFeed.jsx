import KickerLabel from '../ui/KickerLabel';

/**
 * Recent activity — join events and chip plays, newest first.
 */
export default function ActivityFeed({ feed, className = '' }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <KickerLabel>RECENT ACTIVITY</KickerLabel>
      {feed && feed.length > 0 ? (
        <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
          {feed.map((f, i) => (
            <span key={i} className="flex items-start gap-2.5 border-b border-border-hairline py-2.5 last:border-0">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ background: f.tone }} />
              <span className="flex-1 text-caption leading-relaxed text-text-muted-2">
                <span className="font-dmSerif text-sm text-text-primary">{f.who}</span> {f.text}
              </span>
              <span className="shrink-0 font-outfit text-2xs text-text-muted-4">{f.time}</span>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-2xs leading-relaxed text-text-muted-2">Nothing to show yet — activity appears as members join and play.</p>
      )}
    </div>
  );
}
