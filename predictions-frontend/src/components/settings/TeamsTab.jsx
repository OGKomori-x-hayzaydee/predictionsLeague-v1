import { useUserPreferences } from '../../context/UserPreferencesContext';
import TeamCrest from '../ui/TeamCrest';
import KickerLabel from '../ui/KickerLabel';

// The backend currently only tracks fixtures/scoring for these six clubs
// (TeamEntity.isBigSixTeam) — the prototype's ST_TEAMS list has 9 entries
// with a "pick up to six" cap; here the follow pool and the cap are the same
// six, since that's the entire real pool this app can pin fixtures for.
const TEAMS = ['Arsenal', 'Chelsea', 'Liverpool', 'Man City', 'Man United', 'Spurs'];
const FOLLOW_CAP = 6;

export default function TeamsTab() {
  const { preferences, updatePreference } = useUserPreferences();
  const followed = preferences.followedTeams || [];
  const atCap = followed.length >= FOLLOW_CAP;

  const toggle = (team) => {
    const isFollowed = followed.includes(team);
    if (isFollowed) {
      updatePreference('followedTeams', followed.filter((t) => t !== team));
    } else if (followed.length < FOLLOW_CAP) {
      updatePreference('followedTeams', [...followed, team]);
    }
  };

  return (
    <div className="flex flex-col gap-[10px] md:gap-[10px]">
      <span className="hidden font-mono text-2xs tracking-[0.14em] text-text-muted-2 md:inline">
        FOLLOWING · {followed.length} OF {FOLLOW_CAP}
      </span>
      <span className="text-2xs leading-[1.55] text-text-muted-2 [text-wrap:pretty] md:hidden">
        Followed teams pin their fixtures to the top of the reel. It changes ordering only, never scoring.
      </span>

      <div className="grid grid-cols-2 gap-[9px] md:grid-cols-3 md:gap-2">
        {TEAMS.map((team) => {
          const isFollowed = followed.includes(team);
          return (
            <button
              key={team}
              onClick={() => toggle(team)}
              className={`flex min-h-14 items-center gap-[9px] rounded-14 border px-3 py-[11px] text-left transition-colors md:min-h-0 md:gap-[10px] md:rounded-11 md:px-[14px] md:py-3 ${
                isFollowed
                  ? 'border-brand-teal-mid/40 bg-brand-teal/10'
                  : 'border-border-base bg-surface-header/60 hover:border-border-control'
              }`}
            >
              <TeamCrest team={team} size={22} className={`shrink-0 ${isFollowed ? '' : 'opacity-50 grayscale'}`} />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 md:flex-row md:items-center md:justify-between">
                <span
                  className={`truncate text-caption md:text-caption ${isFollowed ? 'text-text-secondary' : 'text-text-muted-2'}`}
                >
                  {team}
                </span>
                <span
                  className={`shrink-0 font-mono text-3xs tracking-[0.1em] md:text-2xs ${
                    isFollowed ? 'text-brand-teal' : 'text-text-muted-5'
                  }`}
                >
                  {isFollowed ? 'FOLLOWING' : '+'}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {atCap && (
        <KickerLabel as="span" className="normal-case tracking-normal text-text-muted-2">
          Six is the cap — unfollow one to add another.
        </KickerLabel>
      )}
    </div>
  );
}
