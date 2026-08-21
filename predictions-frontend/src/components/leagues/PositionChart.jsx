import KickerLabel from '../ui/KickerLabel';
import { ordinal } from '../../utils/leagueStats';

/**
 * Rank-over-time series from every settled gameweek's actual points totals.
 */
export default function PositionChart({ series, line, gws, moveLabel, moveTone = 'muted', tone = 'var(--color-brand-teal)' }) {
  const hasData = series && series.length >= 2;

  return (
    <div className="flex flex-col gap-2.5 rounded-16 border border-border-base bg-surface-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <KickerLabel>POSITION, WEEK BY WEEK</KickerLabel>
        {moveLabel && (
          <span
            className={`font-outfit text-2xs ${
              moveTone === 'up' ? 'text-brand-teal' : moveTone === 'down' ? 'text-state-error' : 'text-text-muted-2'
            }`}
          >
            {moveLabel}
          </span>
        )}
      </div>

      {hasData ? (
        <>
          <div className="relative h-20 md:h-28">
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
          <div className="flex justify-between font-outfit text-2xs text-text-muted-4">
            <span>GW{gws[0]}</span>
            {gws.length > 2 && <span>GW{gws[Math.floor((gws.length - 1) / 2)]}</span>}
            <span>GW{gws[gws.length - 1]}</span>
          </div>
          <span className="text-caption leading-relaxed text-text-muted-2">
            Your position after every settled week. Lower is better.
          </span>
        </>
      ) : (
        <p className="text-2xs leading-relaxed text-text-muted-2">
          {series && series.length === 1
            ? `Currently ${ordinal(series[0])} — the trend line fills in once a second gameweek settles.`
            : 'Not enough settled gameweeks yet to chart a trend.'}
        </p>
      )}
    </div>
  );
}
