import TeamCrest from '../ui/TeamCrest';
import ScoreStepper from './ScoreStepper';
import ScorerSelect from './ScorerSelect';
import ChipSelector from './ChipSelector';
import AiTeamReadPanel from './AiTeamReadPanel';

function formatKickoff(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase();
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
}

/**
 * Fixture Editor — widened by ~15% for generous breathing room.
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

  return (
    <div className="flex w-full flex-col items-center gap-2.5">
      {/* Header Kickoff + Venue */}
      <span className="font-outfit text-xs tracking-widest text-[#8fa6bf]">
        {formatKickoff(fixture.date)} · {fixture.venue || 'Stadium'}
      </span>

      {/* Main Stepper Grid */}
      <div className="grid w-full max-w-4xl grid-cols-[1fr_auto_1fr] items-start gap-4 md:gap-8">
        {/* Home Side (Right Aligned) */}
        <div className="flex flex-col items-end gap-1.5 text-right pt-1 min-w-0">
          <TeamCrest team={fixture.homeTeam} size={56} />
          <span className="font-dmSerif text-3xl md:text-4xl leading-tight text-white tracking-tight">
            {fixture.homeTeam}
          </span>
        </div>

        {/* Center Steppers + Slots */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-start gap-4 md:gap-6">
            {/* Home Score Stepper */}
            <div className="flex w-32 md:w-36 flex-col items-center gap-0.5">
              <ScoreStepper
                team={fixture.homeTeam}
                value={draft.homeScore}
                onChange={onChangeHomeScore}
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
            <span className="pt-7 md:pt-9 font-dmSerif text-3xl md:text-4xl text-[#2c3a53] leading-none">–</span>

            {/* Away Score Stepper */}
            <div className="flex w-32 md:w-36 flex-col items-center gap-0.5">
              <ScoreStepper
                team={fixture.awayTeam}
                value={draft.awayScore}
                onChange={onChangeAwayScore}
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
            <span className="max-w-xs text-center font-outfit text-[0.6875rem] leading-relaxed tracking-wide text-[#4f5b70]">
              0–0 AS IT STANDS · A VALID CALL — SCORER SLOTS OPEN AS THE NUMBERS MOVE
            </span>
          )}
        </div>

        {/* Away Side (Left Aligned) */}
        <div className="flex flex-col items-start gap-1.5 pt-1 min-w-0">
          <TeamCrest team={fixture.awayTeam} size={56} />
          <span className="font-dmSerif text-3xl md:text-4xl leading-tight text-white tracking-tight">
            {fixture.awayTeam}
          </span>
        </div>
      </div>

      {/* Chips Selector (Widened container) */}
      <div className="w-full max-w-[76rem]">
        <ChipSelector chips={matchChips} selected={draft.chip} onToggle={onChangeChip} />
      </div>

      {/* AI Team Read Panel (Widened container) */}
      <div className="w-full max-w-[76rem]">
        <AiTeamReadPanel open={aiOpen} onToggle={onToggleAi} />
      </div>
    </div>
  );
}
