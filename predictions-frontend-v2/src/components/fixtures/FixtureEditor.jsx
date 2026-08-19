import { useEffect, useState } from 'react';
import TeamCrest from '../ui/TeamCrest';
import KickerLabel from '../ui/KickerLabel';
import Card from '../ui/Card';
import { Button } from '../ui/buttons';
import ScoreStepper from './ScoreStepper';
import ScorerSelect from './ScorerSelect';
import ChipSelector from './ChipSelector';
import { useChipManagement } from '../../context/ChipManagementContext';
import userPredictionsAPI from '../../services/api/userPredictionsAPI';

export default function FixtureEditor({ fixture, onFiled }) {
  const existing = fixture.userPrediction;
  const [homeScore, setHomeScore] = useState(existing?.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState(existing?.awayScore ?? 0);
  const [homeScorers, setHomeScorers] = useState(existing?.homeScorers ?? []);
  const [awayScorers, setAwayScorers] = useState(existing?.awayScorers ?? []);
  const [chip, setChip] = useState(existing?.chips?.[0] ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { getMatchChips } = useChipManagement();
  const matchChips = getMatchChips();

  useEffect(() => {
    setHomeScore(existing?.homeScore ?? 0);
    setAwayScore(existing?.awayScore ?? 0);
    setHomeScorers(existing?.homeScorers ?? []);
    setAwayScorers(existing?.awayScorers ?? []);
    setChip(existing?.chips?.[0] ?? null);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixture.id || fixture.matchId]);

  const handleFile = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await userPredictionsAPI.makePrediction(
        {
          homeScore,
          awayScore,
          homeScorers: homeScorers.filter(Boolean),
          awayScorers: awayScorers.filter(Boolean),
          chips: chip ? [chip] : [],
        },
        fixture,
        !!fixture.predicted
      );
      onFiled?.();
    } catch (err) {
      setError(err?.message || 'Could not file this prediction.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-center gap-10">
        <div className="flex flex-col items-center gap-2">
          <TeamCrest team={fixture.homeTeam} size={40} />
        </div>
        <span className="font-dmSerif text-lg text-text-muted-3">vs</span>
        <div className="flex flex-col items-center gap-2">
          <TeamCrest team={fixture.awayTeam} size={40} />
        </div>
      </div>

      <div className="mb-6 flex items-center justify-center gap-8">
        <ScoreStepper team={fixture.homeTeam} value={homeScore} onChange={setHomeScore} />
        <span className="font-dmSerif text-2xl text-text-muted-3">–</span>
        <ScoreStepper team={fixture.awayTeam} value={awayScore} onChange={setAwayScore} />
      </div>

      {(homeScore > 0 || awayScore > 0) && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ScorerSelect
            team={fixture.homeTeam}
            goalCount={homeScore}
            players={fixture.homePlayers}
            scorers={homeScorers}
            onChange={setHomeScorers}
          />
          <ScorerSelect
            team={fixture.awayTeam}
            goalCount={awayScore}
            players={fixture.awayPlayers}
            scorers={awayScorers}
            onChange={setAwayScorers}
          />
        </div>
      )}

      <div className="mb-6">
        <ChipSelector chips={matchChips} selected={chip} onToggle={setChip} />
      </div>

      {error && <p className="mb-3 text-xs text-state-error">{error}</p>}

      <div className="flex items-center justify-between gap-4 border-t border-border-base pt-4">
        <KickerLabel>{fixture.predicted ? 'Filed · amend to re-file' : 'Not filed yet'}</KickerLabel>
        <Button variant={fixture.predicted ? 'secondary' : 'primary'} pill={false} onClick={handleFile} disabled={submitting}>
          {submitting ? 'Filing…' : fixture.predicted ? 'Amend slip' : 'File prediction'}
        </Button>
      </div>
    </Card>
  );
}
