import TeamCrest from '../ui/TeamCrest';
import ScoreStepper from './ScoreStepper';
import ScorerSelect from './ScorerSelect';
import ChipSelector from './ChipSelector';
import AiTeamReadPanel from './AiTeamReadPanel';
import { buildLedgerRows } from './predictionLedger';

function formatKickoff(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.toLocaleDateString(undefined, { weekday: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
}

/**
 * The scoreline + scorer + chip editor — Spine.dc.html's reel edit panel
 * (desktop lines 328-456, mobile lines 2449-2563). Runs the same layout at
 * every breakpoint (crest/name/stepper/slots stacked per side, scaling size
 * up on desktop) rather than porting the prototype's two structurally
 * different desktop/mobile arrangements verbatim — this keeps one real,
 * fully responsive implementation instead of two parallel layouts, while
 * keeping every token/color/keyframe faithful to the foundation spec.
 * Fully controlled: FixturesPage owns the draft state so the same values
 * can drive the live rail/mobile-sheet slip preview.
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
  const ledger = buildLedgerRows(draft);
  const amending = !!fixture.predicted;

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <span className="font-mono text-[11px] tracking-[0.16em] text-text-muted-1">
        {[formatKickoff(fixture.date), fixture.venue].filter(Boolean).join(' · ')}
      </span>

      <div className="grid w-full max-w-[560px] grid-cols-[1fr_auto_1fr] items-start gap-3 md:gap-6">
        <div className="flex flex-col items-center gap-2.5">
          <TeamCrest team={fixture.homeTeam} size={44} />
          <span className="text-center font-dmSerif text-base leading-tight text-text-primary md:text-xl">
            {fixture.homeTeam}
          </span>
          <ScoreStepper team={fixture.homeTeam} value={draft.homeScore} onChange={onChangeHomeScore} />
          <ScorerSelect
            team={fixture.homeTeam}
            goalCount={draft.homeScore}
            players={fixture.homePlayers}
            scorers={draft.homeScorers}
            onChange={onChangeHomeScorers}
            align="left"
          />
        </div>

        <span className="pt-14 font-dmSerif text-2xl text-text-muted-4 md:pt-16 md:text-4xl">–</span>

        <div className="flex flex-col items-center gap-2.5">
          <TeamCrest team={fixture.awayTeam} size={44} />
          <span className="text-center font-dmSerif text-base leading-tight text-text-primary md:text-xl">
            {fixture.awayTeam}
          </span>
          <ScoreStepper team={fixture.awayTeam} value={draft.awayScore} onChange={onChangeAwayScore} />
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

      {totalGoals === 0 && (
        <span className="max-w-[26em] text-center font-mono text-[10.5px] leading-relaxed tracking-[0.03em] text-text-muted-5">
          0–0 AS IT STANDS · A VALID CALL — SCORER SLOTS OPEN AS THE NUMBERS MOVE
        </span>
      )}

      <ChipSelector chips={matchChips} selected={draft.chip} onToggle={onChangeChip} />

      <AiTeamReadPanel open={aiOpen} onToggle={onToggleAi} />

      <div className="flex w-full flex-col gap-3 border-t border-border-base pt-4">
        <div className="flex items-center gap-4">
          {ledger.map((row) => (
            <span key={row.label} className="flex flex-col leading-tight">
              <span className="font-mono text-[9px] tracking-[0.1em] text-text-muted-4">{row.label}</span>
              <span className="font-mono text-[12.5px] text-text-tertiary">{row.value}</span>
            </span>
          ))}
          <span className="ml-auto flex flex-col items-end leading-tight">
            <span className="font-mono text-[9px] tracking-[0.14em] text-text-muted-2">CEILING</span>
            <span className="font-dmSerif text-2xl text-brand-amber">{ceiling}</span>
          </span>
        </div>

        {error && <p className="text-xs text-state-error">{error}</p>}

        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-full bg-brand-indigo-mid px-6 py-[13px] font-outfit text-sm font-semibold text-white transition-colors hover:bg-brand-indigo-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Filing…' : amending ? 'Amend slip' : 'Review & file'}
          {!submitting && (
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <path d="M3 7.5h8.5M8 4l3.5 3.5L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
