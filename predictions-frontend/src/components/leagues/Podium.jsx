import KickerLabel from '../ui/KickerLabel';
import { chipBadge } from '../../utils/leagueStats';

const VISUAL_ORDER = [1, 0, 2]; // 2nd, 1st, 3rd
const PLINTH_H = ['96px', '68px', '50px'];
const AVATAR_SIZE = ['42px', '34px', '34px'];
const AVATAR_FONT = ['15px', '13px', '13px'];
const PTS_SIZE = ['30px', '26px', '26px'];

/**
 * Leagues podium (foundation spec §4 podiumRise/podiumGlow/podiumShine/
 * podiumFloat keyframes, wired up on the 1st-place tile only). `podium` is
 * the hook's top-3-by-latest-settled-gameweek array (real standings +
 * that week's real points total, no fabricated rank).
 */
export default function Podium({ podium, label, note, bestCall, expandedUsername, onToggleExpand, onOpenInFormBook }) {
  if (!podium || podium.length === 0) {
    return (
      <div className="flex flex-col gap-2 rounded-16 border border-border-base bg-surface-card p-5">
        <KickerLabel>GAMEWEEK PODIUM</KickerLabel>
        <p className="text-[11.5px] leading-relaxed text-text-muted-2">
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
        className="flex w-full flex-1 flex-col items-center gap-2 font-outfit md:w-[170px] md:flex-none"
      >
        <span
          style={{
            width: AVATAR_SIZE[i],
            height: AVATAR_SIZE[i],
            fontSize: AVATAR_FONT[i],
            animation: first ? 'podiumGlow 2.6s ease-in-out infinite' : 'none',
          }}
          className={`flex items-center justify-center rounded-full font-semibold ${
            member.isCurrentUser ? 'bg-brand-teal-deep text-brand-teal-tint' : 'bg-surface-card-4 text-text-muted-1'
          }`}
        >
          {(member.displayName || member.username).charAt(0).toUpperCase()}
        </span>
        <span className="max-w-full truncate text-[12.5px] text-text-secondary">{name}</span>
        <span
          style={{ fontSize: PTS_SIZE[i] }}
          className={`font-dmSerif leading-none ${member.isCurrentUser ? 'text-brand-teal' : 'text-text-secondary'}`}
        >
          {member.gwTotal}
        </span>
        <div
          style={{ height: PLINTH_H[i] }}
          className={`relative flex w-full items-start justify-center overflow-hidden rounded-t-6 border border-b-0 pt-[9px] ${
            first
              ? 'border-brand-teal-mid/40 bg-gradient-to-b from-brand-teal-deep/25 to-surface-card-2'
              : 'border-border-base bg-surface-card-3'
          }`}
        >
          <span
            style={{ animation: first ? 'podiumFloat 2.4s ease-in-out infinite' : 'none' }}
            className={`font-dmSerif text-[30px] leading-none ${first ? 'text-brand-teal' : 'text-text-muted-5'}`}
          >
            {place}
          </span>
          {first && (
            <span
              className="absolute inset-y-0 left-0 w-[36%]"
              style={{
                background: 'linear-gradient(100deg,transparent,rgba(255,255,255,.17),transparent)',
                animation: 'podiumShine 3.4s ease-in-out infinite',
              }}
            />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-[10px] rounded-16 border border-border-base bg-surface-card p-5 pb-4">
      <KickerLabel className="tracking-[0.14em]">{label}</KickerLabel>
      <div className="flex items-end justify-center gap-2 border-b-2 border-border-card pt-2 md:gap-[14px]">
        {VISUAL_ORDER.filter((i) => podium[i]).map((i) => tile(podium[i], i))}
      </div>

      {expandedMember && (
        <div className="flex flex-col gap-[7px] rounded-12 border border-dashed border-border-control bg-surface-card-3 p-[14px_16px] animate-rise-in">
          <KickerLabel className="text-text-muted-2">
            {expandedMember.isCurrentUser ? 'YOUR' : `${(expandedMember.displayName || expandedMember.username).split(' ')[0].toUpperCase()}'S`} BEST CALL THIS SEASON
          </KickerLabel>
          {expandedBest ? (
            <>
              <p className="text-[13px] leading-relaxed text-text-secondary">
                {expandedMember.isCurrentUser ? 'You' : (expandedMember.displayName || expandedMember.username).split(' ')[0]} called{' '}
                {expandedBest.homeTeam} v {expandedBest.awayTeam} for +{expandedBest.points}
                {chipBadge(expandedBest.chips) ? ` with ${chipBadge(expandedBest.chips).name}` : ''} in GW{expandedBest.gw}.
              </p>
              <button
                onClick={() => onOpenInFormBook?.(expandedMember.username)}
                className="self-start font-mono text-[10.5px] tracking-[0.06em] text-brand-teal"
              >
                OPEN IN FORM BOOK →
              </button>
            </>
          ) : (
            <p className="text-[13px] leading-relaxed text-text-muted-2">No settled calls on record yet this season.</p>
          )}
        </div>
      )}

      {note && <span className="text-[11.5px] leading-relaxed text-text-muted-2">{note}</span>}
    </div>
  );
}
