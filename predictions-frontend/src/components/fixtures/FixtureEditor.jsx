import TeamCrest from '../ui/TeamCrest';
import ScoreStepper from './ScoreStepper';
import ScorerSelect from './ScorerSelect';
import ChipSelector from './ChipSelector';
import AiTeamReadPanel from './AiTeamReadPanel';
import { getMatchInsight } from '../../utils/matchInsights';

function formatKickoff(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase();
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
}

/**
 * Fixture Editor — compact layout matching Spine.dc.html.
 */
export default function FixtureEditor({
  fixture,
  draft,
  onChangeHomeScore,
  onChangeAwayScore,
  onChangeHomeScorers,
  onChangeAwayScorers,
  onChangeChip,
  matchChips,
  aiOpen,
  onToggleAi,
}) {
  const totalGoals = draft.homeScore + draft.awayScore;
  const insight = getMatchInsight(fixture);

  const handlePickLikelyScorer = (name, side) => {
    if (side === 'home') {
      const current = [...(draft.homeScorers || [])];
      const emptyIdx = current.findIndex((s) => !s);
      if (emptyIdx !== -1) {
        current[emptyIdx] = name;
        onChangeHomeScorers(current);
      } else if (current.length < draft.homeScore) {
        onChangeHomeScorers([...current, name]);
      }
    } else {
      const current = [...(draft.awayScorers || [])];
      const emptyIdx = current.findIndex((s) => !s);
      if (emptyIdx !== -1) {
        current[emptyIdx] = name;
        onChangeAwayScorers(current);
      } else if (current.length < draft.awayScore) {
        onChangeAwayScorers([...current, name]);
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      {/* Header Kickoff + Venue */}
      <span className="font-mono text-[10.5px] tracking-[0.16em] text-[#8fa6bf]">
        {formatKickoff(fixture.date)} · {fixture.venue || 'Stadium'}
      </span>

      {/* Main Stepper Grid */}
      <div className="grid w-full max-w-[960px] grid-cols-[1fr_auto_1fr] items-start gap-3 md:gap-6">
        {/* Home Side (Right Aligned) */}
        <div className="flex flex-col items-end gap-1.5 text-right pt-1 min-w-0">
          <TeamCrest team={fixture.homeTeam} size={48} />
          <span className="font-dmSerif text-2xl md:text-[28px] leading-tight text-white">
            {fixture.homeTeam}
          </span>
          {insight && (
            <span className="font-mono text-[10.5px] tracking-[0.12em] text-[#7f93ad]">
              {insight.homeForm.split('').join(' ')}
            </span>
          )}
        </div>

        {/* Center Steppers + Slots */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-start gap-3 md:gap-4">
            {/* Home Score Stepper */}
            <div className="flex w-[120px] md:w-[136px] flex-col items-center gap-0.5">
              <ScoreStepper
                team={fixture.homeTeam}
                value={draft.homeScore}
                onChange={onChangeHomeScore}
                size="md"
              />
              <div className="mt-1 w-full">
                <ScorerSelect
                  team={fixture.homeTeam}
                  goalCount={draft.homeScore}
                  players={fixture.homePlayers}
                  scorers={draft.homeScorers}
                  onChange={onChangeHomeScorers}
                  align="left"
                />
              </div>
            </div>

            {/* Dash */}
            <span className="pt-6 md:pt-7 font-dmSerif text-2xl md:text-3xl text-[#2c3a53] leading-none">–</span>

            {/* Away Score Stepper */}
            <div className="flex w-[120px] md:w-[136px] flex-col items-center gap-0.5">
              <ScoreStepper
                team={fixture.awayTeam}
                value={draft.awayScore}
                onChange={onChangeAwayScore}
                size="md"
              />
              <div className="mt-1 w-full">
                <ScorerSelect
                  team={fixture.awayTeam}
                  goalCount={draft.awayScore}
                  players={fixture.awayPlayers}
                  scorers={draft.awayScorers}
                  onChange={onChangeAwayScorers}
                  align="right"
                />
              </div>
            </div>
          </div>

          {totalGoals === 0 && (
            <span className="max-w-[22em] text-center font-mono text-[9.5px] leading-relaxed tracking-[0.06em] text-[#4f5b70]">
              0–0 AS IT STANDS · A VALID CALL — SCORER SLOTS OPEN AS THE NUMBERS MOVE
            </span>
          )}
        </div>

        {/* Away Side (Left Aligned) */}
        <div className="flex flex-col items-start gap-1.5 pt-1 min-w-0">
          <TeamCrest team={fixture.awayTeam} size={48} />
          <span className="font-dmSerif text-2xl md:text-[28px] leading-tight text-white">
            {fixture.awayTeam}
          </span>
          {insight && (
            <span className="font-mono text-[10.5px] tracking-[0.12em] text-[#7f93ad]">
              {insight.awayForm.split('').join(' ')}
            </span>
          )}
        </div>
      </div>

      {/* Chips Selector */}
      <div className="w-full max-w-[960px]">
        <ChipSelector chips={matchChips} selected={draft.chip} onToggle={onChangeChip} />
      </div>

      {/* AI Team Read Panel */}
      <div className="w-full max-w-[960px]">
        <AiTeamReadPanel
          fixture={fixture}
          open={aiOpen}
          onToggle={onToggleAi}
          onPickScorer={handlePickLikelyScorer}
        />
      </div>
    </div>
  );
}
