import { useNavigate } from 'react-router-dom';
import TeamCrest from '../ui/TeamCrest';
import KickerLabel from '../ui/KickerLabel';
import Card from '../ui/Card';
import { Button } from '../ui/buttons';

/**
 * The prototype's "AI Team Read" panel (predicted score/confidence, H2H,
 * crowd-pick distribution, injuries, xG) has no backing data source yet —
 * see plan §4/§6 (needs a new MatchRepository query + a football-data.org
 * odds add-on, neither shipped). Showing fabricated numbers here would be
 * worse than showing nothing, so this renders an honest "arriving soon"
 * state instead of fake confidence/H2H data.
 */
export default function SpotlightCard({ match, timeDisplay, isLive }) {
  const navigate = useNavigate();

  if (!match) {
    return (
      <Card className="p-6 text-center text-sm text-text-muted-2">
        No upcoming fixture to spotlight right now.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border-base px-5 py-3">
        <KickerLabel>{isLive ? 'Live now' : 'Up next'}</KickerLabel>
        {timeDisplay && <span className="font-mono text-xs text-brand-amber">{timeDisplay}</span>}
      </div>

      <div className="flex items-center justify-center gap-8 px-6 py-8">
        <div className="flex flex-col items-center gap-2">
          <TeamCrest team={match.homeTeam} size={44} />
          <span className="text-sm text-text-primary">{match.homeTeam}</span>
        </div>
        <span className="font-dmSerif text-xl text-text-muted-3">vs</span>
        <div className="flex flex-col items-center gap-2">
          <TeamCrest team={match.awayTeam} size={44} />
          <span className="text-sm text-text-primary">{match.awayTeam}</span>
        </div>
      </div>

      {match.venue && (
        <p className="px-6 pb-4 text-center text-xs text-text-muted-2">{match.venue}</p>
      )}

      <div className="border-t border-border-base px-5 py-4">
        <Button
          variant={match.predicted ? 'secondary' : 'urgent'}
          pill={false}
          className="w-full"
          onClick={() => navigate('/fixtures')}
        >
          {match.predicted ? 'Amend prediction' : 'File your prediction'}
        </Button>
      </div>

      <div className="border-t border-border-base bg-surface-card-2 px-5 py-4">
        <KickerLabel as="div" className="mb-1">AI overview</KickerLabel>
        <p className="text-xs text-text-muted-2">
          Match insights (form, head-to-head, crowd picks) are arriving once real fixture-history
          data is wired in — check back soon.
        </p>
      </div>
    </Card>
  );
}
