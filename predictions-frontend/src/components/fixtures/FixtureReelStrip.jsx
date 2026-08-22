import TeamCrest from '../ui/TeamCrest';
import { SCORE_TONE } from '../../utils/matchResult';

function formatDay(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  const day = d.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase();
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
}

function toneClass(tone, isSelected) {
  switch (tone) {
    case SCORE_TONE.exact:
      return 'text-brand-teal';
    case SCORE_TONE.outcome:
      return 'text-brand-indigo';
    case SCORE_TONE.miss:
      return 'text-brand-amber';
    case SCORE_TONE.live:
      return 'text-brand-amber';
    case SCORE_TONE.filed:
      return 'text-brand-teal';
    case SCORE_TONE.editing:
      return 'text-brand-amber';
    default:
      return isSelected ? 'text-brand-amber' : 'text-text-muted';
  }
}

function markClass(tone, isSelected) {
  switch (tone) {
    case SCORE_TONE.exact:
    case SCORE_TONE.filed:
      return 'bg-brand-teal-mid';
    case SCORE_TONE.outcome:
      return 'bg-brand-indigo-mid';
    case SCORE_TONE.miss:
    case SCORE_TONE.live:
    case SCORE_TONE.editing:
      return 'bg-brand-amber';
    default:
      return isSelected ? 'bg-brand-amber' : 'bg-border-base';
  }
}

/**
 * "THE REEL" fixture-thumbnail strip along the bottom dock of the desktop editor
 * (Spine.dc.html desktop lines 664-679).
 * Contained in max-w-[76rem] matching the widened editor width.
 *
 * `locked` briefly disables station-switching while a prediction is
 * actively being filed (phase !== 'idle') — the simplest, most robust fix
 * for the navigation-interrupt bug: rather than trying to gracefully
 * cancel/retarget an in-flight API call + optimistic-state update for a
 * *different* fixture mid-animation, we just block navigation for the
 * ~2.2s the ceremony takes.
 */
export default function FixtureReelStrip({ stations, locked = false }) {
  if (!stations.length) return null;

  const filedCount = stations.filter((s) => s.predicted).length;
  const totalPoints = stations.reduce((sum, s) => sum + (s.predicted ? (s.ceiling || 15) : 0), 0);

  return (
    <div className="mx-auto flex w-full max-w-[76rem] flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="font-outfit text-2xs tracking-widest text-text-muted">THE REEL</span>
        <span className="font-outfit text-2xs tracking-widest text-text-muted">
          {totalPoints > 0 ? `${totalPoints} pts staked across ${filedCount} filed` : `${filedCount} of ${stations.length} filed`}
        </span>
      </div>

      <div className="flex items-stretch gap-2 overflow-x-auto">
        {stations.map((s) => {
          const isSelected = s.isSelected;
          const isPredicted = s.predicted;
          const label = s.scoreLabel || (isSelected ? 'editing' : 'open');
          const scoreColor = toneClass(s.scoreTone, isSelected);
          const markColor = markClass(s.scoreTone, isSelected);
          const bgClass = isSelected ? 'bg-surface-card' : isPredicted ? 'bg-surface-card/70' : 'bg-surface-header/50';
          const borderClass = isSelected
            ? 'border-brand-teal-mid'
            : isPredicted
              ? 'border-border-base'
              : 'border-border-card';

          return (
            <button
              key={s.id}
              type="button"
              onClick={s.onSelect}
              disabled={locked}
              aria-disabled={locked}
              title={locked ? 'Finish filing this prediction before switching fixtures' : undefined}
              className={`flex min-w-[7.5rem] shrink-0 flex-col gap-1 overflow-hidden rounded-lg border p-2 font-outfit transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                locked ? '' : 'cursor-pointer hover:border-border-control'
              } ${bgClass} ${borderClass}`}
            >
              <span className={`font-outfit text-2xs tracking-wider ${isSelected ? 'text-brand-teal' : 'text-text-muted'}`}>
                {formatDay(s.date)}
              </span>
              <div className="flex items-center justify-center gap-1.5 py-0.5">
                <TeamCrest team={s.homeTeam} size={18} />
                <TeamCrest team={s.awayTeam} size={18} />
              </div>
              <span className={`text-center font-outfit text-xs font-medium ${scoreColor}`}>{label}</span>
              <span className={`h-0.5 w-full rounded-full ${markColor}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
