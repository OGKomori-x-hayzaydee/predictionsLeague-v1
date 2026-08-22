import KickerLabel from '../ui/KickerLabel';
import Avatar from '../ui/Avatar';
import { chipBadge } from '../../utils/leagueStats';

const VISUAL_ORDER = [1, 0, 2];
const PLINTH = ['h-24', 'h-16', 'h-12'];
const AVATAR_SIZE = [44, 32, 32];
const PTS = ['text-3xl', 'text-2xl md:text-3xl', 'text-2xl md:text-3xl'];

/**
 * Gameweek podium — top 3 by the latest settled week's real points.
 */
export default function Podium({ podium, label, note, bestCall, expandedUsername, onToggleExpand, onOpenInFormBook }) {
  if (!podium || podium.length === 0) {
    return (
      <div className="flex shrink-0 flex-col gap-2 rounded-16 border border-border-base bg-surface-card p-5">
        <KickerLabel>GAMEWEEK PODIUM</KickerLabel>
        <p className="text-2xs leading-relaxed text-text-muted-2">
          No settled gameweek yet — the podium fills in once your league's first results are scored.
        </p>
      </div>
    );
  }

  const expandedMember = expandedUsername ? podium.find((m) => m.username === expandedUsername) : null;
  const expandedBest = expandedMember ? bestCall?.[expandedMember.username] : null;

  const tile = (member, i) => {
    const place = i + 1;
    const first = i === 0;
    const name = member.isCurrentUser ? 'You' : member.displayName || member.username;
    return (
      <button
        key={member.username}
        onClick={() => onToggleExpand?.(member.username)}
        style={{ animation: `podiumRise .5s ${(VISUAL_ORDER.indexOf(i) * 0.08).toFixed(2)}s both cubic-bezier(.2,.8,.2,1)` }}
        className="flex w-24 shrink-0 flex-col items-center gap-2 font-outfit focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal sm:w-32 md:w-40"
      >
        <span
            style={{ animation: first && member.isCurrentUser ? 'podiumGlow 2.6s ease-in-out 1' : 'none' }}
          className="inline-flex"
        >
          <Avatar
            name={member.displayName || member.username}
            src={member.avatar}
            size={AVATAR_SIZE[i]}
            className={member.isCurrentUser ? 'ring-2 ring-brand-teal' : ''}
          />
        </span>
        <span className="max-w-full truncate text-caption text-text-secondary">{name}</span>
        <span className={`font-dmSerif leading-none ${PTS[i]} ${member.isCurrentUser ? 'text-brand-teal' : 'text-text-secondary'}`}>
          {member.gwTotal}
        </span>
        <div
          className={`relative flex w-full items-start justify-center overflow-hidden rounded-t-9 border border-b-0 pt-2 ${PLINTH[i]} ${
            first
              ? 'border-brand-teal-mid/40 bg-gradient-to-b from-brand-teal-deep/25 to-surface-card-2'
              : 'border-border-base bg-surface-card-3'
          }`}
        >
          <span
            className={`font-dmSerif text-3xl leading-none ${first ? 'text-brand-teal' : 'text-text-disabled'}`}
          >
            {place}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="flex shrink-0 flex-col gap-2.5 overflow-hidden rounded-16 border border-border-base bg-surface-card p-5 pb-4">
      <KickerLabel>{label}</KickerLabel>
      <div className="flex items-end justify-center gap-2 border-b-2 border-border-card pt-2 md:gap-3.5">
        {VISUAL_ORDER.filter((i) => podium[i]).map((i) => tile(podium[i], i))}
      </div>

      {expandedMember && (
        <div className="flex flex-col gap-1.5 rounded-12 border border-dashed border-border-control bg-surface-card-3 px-4 py-3.5 animate-rise-in">
          <KickerLabel className="text-text-muted-2">
            {expandedMember.isCurrentUser ? 'YOUR' : `${(expandedMember.displayName || expandedMember.username).split(' ')[0].toUpperCase()}'S`} BEST CALL THIS SEASON
          </KickerLabel>
          {expandedBest ? (
            <>
              <p className="text-caption leading-relaxed text-text-secondary">
                {expandedMember.isCurrentUser ? 'You' : (expandedMember.displayName || expandedMember.username).split(' ')[0]} called{' '}
                {expandedBest.homeTeam} v {expandedBest.awayTeam} for +{expandedBest.points}
                {chipBadge(expandedBest.chips) ? ` with ${chipBadge(expandedBest.chips).name}` : ''} in GW{expandedBest.gw}.
              </p>
              <button
                onClick={() => onOpenInFormBook?.(expandedMember.username)}
                className="self-start font-outfit text-2xs tracking-wide text-brand-teal"
              >
                OPEN IN FORM BOOK →
              </button>
            </>
          ) : (
            <p className="text-caption leading-relaxed text-text-muted-2">No settled calls on record yet this season.</p>
          )}
        </div>
      )}

      {note && <span className="text-caption leading-relaxed text-text-muted-2">{note}</span>}
    </div>
  );
}
