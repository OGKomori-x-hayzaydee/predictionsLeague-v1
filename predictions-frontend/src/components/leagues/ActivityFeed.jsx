import KickerLabel from '../ui/KickerLabel';

/**
 * Recent activity — real join events (LeagueStanding.joinedAt) and chip
 * plays (LeaguePredictionSummary.chips/predictedAt) from the fetched
 * gameweek window, newest first (utils/leagueStats.buildActivityFeed).
 */
export default function ActivityFeed({ feed, className = '' }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <KickerLabel className="tracking-[0.16em]">RECENT ACTIVITY</KickerLabel>
      {feed && feed.length > 0 ? (
        <div className="flex flex-col gap-0.5 overflow-y-auto">
          {feed.map((f, i) => (
            <span key={i} className="flex items-start gap-[10px] border-b border-border-hairline py-[11px] last:border-0">
              <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: f.tone }} />
              <span className="flex-1 text-[12.5px] leading-relaxed text-text-muted-2">
                <span className="text-text-secondary">{f.who}</span> {f.text}
              </span>
              <span className="shrink-0 font-mono text-[10px] text-text-muted-4">{f.time}</span>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[11.5px] leading-relaxed text-text-muted-2">Nothing to show yet — activity appears as members join and play.</p>
      )}
    </div>
  );
}
