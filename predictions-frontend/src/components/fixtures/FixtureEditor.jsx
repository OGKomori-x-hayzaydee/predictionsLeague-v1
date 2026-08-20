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
 * Fixture Editor — matching Spine.dc.html lines 328-456.
 * Center edit console for scores, scorers, chip selection, and AI team reads.
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
  ceiling,
  onSubmit,
  submitting,
  error,
}) {
  const totalGoals = draft.homeScore + draft.awayScore;
  const isFiled = !!fixture.predicted;
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
    <div className="flex w-full flex-col items-center gap-4">
      {/* Header Kickoff + Venue */}
      <span className="font-mono text-[11px] tracking-[0.2em] text-[#8fa6bf]">
        {formatKickoff(fixture.date)} · {fixture.venue || 'Stadium'}
      </span>

      {/* Main Stepper Grid */}
      <div className="grid w-full max-w-[1080px] grid-cols-[1fr_auto_1fr] items-start gap-4 md:gap-9">
        {/* Home Side (Right Aligned) */}
        <div className="flex flex-col items-end gap-2 text-right pt-3 min-w-0">
          <TeamCrest team={fixture.homeTeam} size={64} />
          <span className="font-dmSerif text-3xl md:text-4xl leading-none tracking-[-0.01em] text-white">
            {fixture.homeTeam}
          </span>
          {insight && (
            <span className="font-mono text-[11px] tracking-[0.14em] text-[#7f93ad]">
              {insight.homeForm.split('').join(' ')}
            </span>
          )}
        </div>

        {/* Center Steppers + Slots */}
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex items-start gap-4 md:gap-5">
            {/* Home Score Stepper */}
            <div className="flex w-[140px] md:w-[152px] flex-col items-center gap-1">
              <ScoreStepper
                team={fixture.homeTeam}
                value={draft.homeScore}
                onChange={onChangeHomeScore}
                size="lg"
              />
              <div className="mt-1.5 w-full">
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
            <span className="pt-8 md:pt-9 font-dmSerif text-3xl md:text-4xl text-[#2c3a53] leading-none">–</span>

            {/* Away Score Stepper */}
            <div className="flex w-[140px] md:w-[152px] flex-col items-center gap-1">
              <ScoreStepper
                team={fixture.awayTeam}
                value={draft.awayScore}
                onChange={onChangeAwayScore}
                size="lg"
              />
              <div className="mt-1.5 w-full">
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
            <span className="max-w-[24em] text-center font-mono text-[10.5px] leading-relaxed tracking-[0.09em] text-[#4f5b70]">
              0–0 AS IT STANDS · A VALID CALL — SCORER SLOTS OPEN AS THE NUMBERS MOVE
            </span>
          )}
        </div>

        {/* Away Side (Left Aligned) */}
        <div className="flex flex-col items-start gap-2 pt-3 min-w-0">
          <TeamCrest team={fixture.awayTeam} size={64} />
          <span className="font-dmSerif text-3xl md:text-4xl leading-none tracking-[-0.01em] text-white">
            {fixture.awayTeam}
          </span>
          {insight && (
            <span className="font-mono text-[11px] tracking-[0.14em] text-[#7f93ad]">
              {insight.awayForm.split('').join(' ')}
            </span>
          )}
        </div>
      </div>

      {/* Chips Selector */}
      <div className="w-full max-w-[1080px] mt-2">
        <ChipSelector chips={matchChips} selected={draft.chip} onToggle={onChangeChip} />
      </div>

      {/* AI Team Read Panel */}
      <div className="w-full max-w-[1080px] mt-1">
        <AiTeamReadPanel
          fixture={fixture}
          open={aiOpen}
          onToggle={onToggleAi}
          onPickScorer={handlePickLikelyScorer}
        />
      </div>

      {/* Action Button for Editor */}
      <div className="mt-2 flex flex-col items-center gap-2">
        {error && <p className="text-xs text-state-error">{error}</p>}
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className={`flex cursor-pointer items-center gap-2 rounded-full px-8 py-3.5 font-outfit text-sm font-semibold transition-all disabled:opacity-50 ${
            isFiled
              ? 'border border-[#14b8a666] bg-[#0f766e44] text-[#5eead4] hover:bg-[#0f766e66]'
              : 'bg-brand-indigo-mid text-white shadow-lg hover:bg-brand-indigo-hover'
          }`}
        >
          {submitting ? 'Filing…' : isFiled ? 'Filed · amend to re-file' : 'Review & file'} &rarr;
        </button>
      </div>
    </div>
  );
}
