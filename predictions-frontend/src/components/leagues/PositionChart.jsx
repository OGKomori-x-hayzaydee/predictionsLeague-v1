import KickerLabel from '../ui/KickerLabel';
import { ordinal } from '../../utils/leagueStats';

/**
 * "Your position, week by week" — real rank-over-time series computed by
 * useLeagueDetail from every settled gameweek's actual points totals
 * (utils/leagueStats.computeStandingsHistory), not a fabricated history.
 */
export default function PositionChart({ series, line, gws, moveLabel, moveTone = 'muted', tone = 'var(--color-brand-teal)' }) {
  const hasData = series && series.length >= 2;

  return (
    <div className="flex flex-col gap-[10px] rounded-16 border border-border-base bg-surface-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <KickerLabel>POSITION, WEEK BY WEEK</KickerLabel>
        {moveLabel && (
          <span
            className={`font-mono text-[10.5px] ${
              moveTone === 'up' ? 'text-brand-teal' : moveTone === 'down' ? 'text-state-error' : 'text-text-muted-2'
            }`}
          >
            {moveLabel}
          </span>
        )}
      </div>

      {hasData ? (
        <>
          <div className="relative h-[84px] md:h-[112px]">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <polyline
                points={line}
                fill="none"
                stroke={tone}
                strokeWidth="1.8"
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex justify-between font-mono text-[10px] text-text-muted-4">
            <span>GW{gws[0]}</span>
            {gws.length > 2 && <span>GW{gws[Math.floor((gws.length - 1) / 2)]}</span>}
            <span>GW{gws[gws.length - 1]}</span>
          </div>
          <span className="text-[11.5px] leading-relaxed text-text-muted-2">
            Your position after every settled week. Lower is better.
          </span>
        </>
      ) : (
        <p className="text-[11.5px] leading-relaxed text-text-muted-2">
          {series && series.length === 1
            ? `Currently ${ordinal(series[0])} — the trend line fills in once a second gameweek settles.`
            : 'Not enough settled gameweeks yet to chart a trend.'}
        </p>
      )}
    </div>
  );
}
