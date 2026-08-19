import { useUserPreferences } from '../../context/UserPreferencesContext';
import TeamCrest from '../ui/TeamCrest';
import KickerLabel from '../ui/KickerLabel';

// The backend currently only tracks fixtures/scoring for these six clubs
// (TeamEntity.isBigSixTeam) — "pick up to six" from the prototype is
// naturally satisfied since this is the entire pool.
const TEAMS = ['Arsenal', 'Chelsea', 'Liverpool', 'Man City', 'Man United', 'Spurs'];
const FOLLOW_CAP = 6;

export default function TeamsTab() {
  const { preferences, updatePreference } = useUserPreferences();
  const followed = preferences.followedTeams || [];

  const toggle = (team) => {
    const isFollowed = followed.includes(team);
    if (isFollowed) {
      updatePreference('followedTeams', followed.filter((t) => t !== team));
    } else if (followed.length < FOLLOW_CAP) {
      updatePreference('followedTeams', [...followed, team]);
    }
  };

  return (
    <div>
      <KickerLabel as="div" className="mb-3">
        Following · {followed.length} of {FOLLOW_CAP}
      </KickerLabel>
      <p className="mb-4 text-xs text-text-muted-2">
        Followed teams pin their fixtures to the top of the reel and colour their crest in the grid.
        It changes ordering only, never scoring.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {TEAMS.map((team) => {
          const isFollowed = followed.includes(team);
          return (
            <button
              key={team}
              onClick={() => toggle(team)}
              className={`flex flex-col items-center gap-2 rounded-md border p-4 transition-colors ${
                isFollowed
                  ? 'border-brand-teal/50 bg-brand-teal/10'
                  : 'border-border-card bg-surface-card-2 hover:border-border-control'
              }`}
            >
              <TeamCrest team={team} size={36} className={isFollowed ? '' : 'opacity-50 grayscale'} />
              <span className="text-sm text-text-primary">{team}</span>
              <span className={`font-mono text-[10px] uppercase tracking-wide ${isFollowed ? 'text-brand-teal' : 'text-text-muted-3'}`}>
                {isFollowed ? 'Following' : 'Follow'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
