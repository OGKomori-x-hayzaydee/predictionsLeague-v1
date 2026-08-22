import { ArrowRight } from '@phosphor-icons/react';
import Button from '../ui/buttons/Button';
import TeamCrest from '../ui/TeamCrest';
import { buildLedgerRows, namedScorers, slipHeadline, slipSentence } from './predictionLedger';
import {
  buildResultView,
  pointsLabel,
} from '../../utils/matchResult';

function formatFiledClock(prediction) {
  const raw = prediction?.submittedAt || prediction?.predictedAt;
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
}

const SLIP_SHELL =
  'relative flex w-full max-w-[46.2rem] flex-col gap-4 overflow-hidden rounded-2xl border border-border-card bg-gradient-to-b from-surface-card to-surface-header p-[1.65rem] shadow-2xl';

/**
 * FixtureSlip — supports:
 * 1. `variant="rail"`: live updating preview slip in the right sidebar.
 * 2. `variant="resting"` / `variant="main"`: resting filed card with rubber-stamp and edit CTA.
 * 3. `variant="scored"`: CALL vs FT receipt once the match is live or finished.
 */
export default function FixtureSlip({
  fixture,
  prediction,
  filed,
  ceiling,
  variant = 'rail',
  onEdit,
  onViewFull,
  gameweekLabel = 'GW24',
  deadlineLabel,
  density = 'full',
}) {
  if (!fixture) return null;

  if (variant === 'scored') {
    return (
      <ScoredSlip
        fixture={fixture}
        prediction={prediction}
        ceiling={ceiling}
        gameweekLabel={gameweekLabel}
        density={density}
        onViewFull={onViewFull}
      />
    );
  }

  const { homeTeam, awayTeam } = fixture;

  const homeScore = prediction?.homeScore ?? 0;
  const awayScore = prediction?.awayScore ?? 0;
  const scorers = namedScorers(prediction?.homeScorers, prediction?.awayScorers);
  const ledger = buildLedgerRows(prediction || {});
  const headline = slipHeadline(homeTeam, awayTeam, homeScore, awayScore);
  const sentence = slipSentence(homeTeam, awayTeam, homeScore, awayScore, prediction?.homeScorers, prediction?.awayScorers);
  const filedClock = formatFiledClock(prediction);
  const kickerBits = [gameweekLabel, deadlineLabel].filter(Boolean);

  // RESTING / MAIN VIEW (Picture 3 - when fixture is filed and resting in center)
  if (variant === 'resting' || variant === 'main') {
    return (
      <div className={SLIP_SHELL}>
        <div className="flex items-center justify-between gap-2.5">
          <span className="font-outfit text-xs tracking-wider text-text-muted">
            THE SLIP · {kickerBits.join(' · ')}{filedClock ? ` · ${filedClock}` : ''}
          </span>
          <span className="shrink-0 rotate-[-8deg] rounded-md border-[3px] border-brand-teal-mid px-3.5 py-1 font-outfit text-sm font-bold tracking-wider text-brand-teal">
            FILED
          </span>
        </div>

        <h2 className="m-0 font-dmSerif text-[2.0625rem] md:text-[2.475rem] leading-tight text-text-primary [text-wrap:pretty]">
          {headline}
        </h2>

        <div className="flex items-center justify-center gap-4 py-2">
          <TeamCrest team={homeTeam} size={44} />
          <span className="font-dmSerif text-[3.3rem] md:text-[4.125rem] leading-none text-text-primary">
            {homeScore}–{awayScore}
          </span>
          <TeamCrest team={awayTeam} size={44} />
        </div>

        <div className="h-px bg-border-card" />

        <div className="flex flex-wrap justify-center gap-2">
          {scorers.length > 0 ? (
            scorers.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex items-center gap-2 rounded-full border border-border-card bg-surface-card px-3.5 py-1.5 text-xs text-text-secondary"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full border-[1.5px] border-brand-teal" />
                {name}
              </span>
            ))
          ) : (
            <span className="font-outfit text-xs text-text-muted">no scorers named</span>
          )}
        </div>

        <div className="h-px bg-border-card" />

        <div className="flex items-center gap-6">
          {ledger.map((row) => (
            <div key={row.label} className="flex flex-col leading-snug">
              <span className="font-outfit text-2xs tracking-wider text-text-muted">{row.label}</span>
              <span className="font-outfit text-sm font-medium text-text-primary">{row.value}</span>
            </div>
          ))}

          <div className="ml-auto flex flex-col items-end leading-none">
            <span className="font-outfit text-2xs tracking-wider text-text-muted">CEILING</span>
            <span className="font-dmSerif text-[2.0625rem] text-brand-amber">{ceiling}</span>
          </div>

          {onEdit && (
            <Button type="button" onClick={onEdit} className="shrink-0">
              Edit slip
            </Button>
          )}
        </div>
      </div>
    );
  }

  // LIVE PREVIEW SLIP (Picture 5 - Right rail preview while editing)
  return (
    <div className="relative flex w-full flex-col gap-3 overflow-hidden rounded-xl border border-border-card bg-gradient-to-b from-surface-card to-surface-header p-4 shadow-xl">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-outfit text-2xs tracking-wider text-text-muted">
          THE SLIP · {kickerBits.join(' · ')}{filed && filedClock ? ` · ${filedClock}` : ''}
        </span>
        <span
          className={`font-outfit text-2xs tracking-wide ${
            filed ? 'text-brand-teal' : 'text-brand-amber-mid'
          }`}
        >
          {filed ? 'FILED' : 'UNFILED'}
        </span>
      </div>

      <div className="flex items-center justify-center gap-3 py-1">
        <TeamCrest team={homeTeam} size={28} />
        <span className="font-dmSerif text-4xl leading-none text-text-primary">{homeScore}</span>
        <span className="font-dmSerif text-lg text-text-disabled">–</span>
        <span className="font-dmSerif text-4xl leading-none text-text-primary">{awayScore}</span>
        <TeamCrest team={awayTeam} size={28} />
      </div>

      <p className="m-0 font-outfit text-xs leading-relaxed text-text-secondary [text-wrap:pretty]">
        {sentence}
      </p>

      <div className="h-px bg-border-card" />

      <div className="flex flex-col gap-1.5">
        {ledger.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-2 text-xs text-text-muted">
            <span>{row.label}</span>
            <span className="font-outfit text-text-primary">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-border-card" />

      <div className="flex items-end justify-between">
        <span className="text-xs text-text-muted">If it lands exactly</span>
        <span className="font-dmSerif text-3xl leading-none text-brand-amber">{ceiling}</span>
      </div>

      <span className="font-outfit text-2xs leading-relaxed text-text-muted">
        This slip is what gets filed. Review it, then sign it off.
      </span>
    </div>
  );
}

function ScorerPills({ names, empty, hitNames = [] }) {
  if (!names.length) {
    return <span className="font-outfit text-xs text-text-muted">{empty}</span>;
  }
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {names.map((name, i) => {
        const hit = hitNames.includes(name);
        return (
          <span
            key={`${name}-${i}`}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs ${
              hit
                ? 'border-brand-teal-mid/40 bg-brand-teal-deep/15 text-brand-teal'
                : 'border-border-card bg-surface-card text-text-secondary'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full border-[1.5px] ${
                hit ? 'border-brand-teal bg-brand-teal' : 'border-text-disabled'
              }`}
            />
            {name}
          </span>
        );
      })}
    </div>
  );
}

function ScoredSlip({ fixture, prediction, ceiling, gameweekLabel, density, onViewFull }) {
  const { homeTeam, awayTeam } = fixture;
  const result = buildResultView(fixture, prediction);
  const compact = density === 'compact';
  const actualNames = namedScorers(
    prediction?.actualHomeScorers || fixture?.actualHomeScorers,
    prediction?.actualAwayScorers || fixture?.actualAwayScorers,
  );
  const called = namedScorers(prediction?.homeScorers, prediction?.awayScorers);
  const heroReady = result.actualHome != null && result.actualAway != null;
  const heroScore = heroReady ? `${result.actualHome}–${result.actualAway}` : '—';
  const heroExact = result.verdict?.verdict === 'EXACT';
  const headline = result.awaiting
    ? 'Awaiting official score'
    : !result.hasCall
      ? `${homeTeam} v ${awayTeam}`
      : heroReady
        ? slipHeadline(homeTeam, awayTeam, result.actualHome, result.actualAway)
        : slipHeadline(homeTeam, awayTeam, result.callHome, result.callAway);
  const kicker = result.live ? 'THE RECEIPT · LIVE' : 'THE RECEIPT';
  const pointsClass = result.settled
    ? (result.points > 0 ? 'text-brand-teal' : 'text-text-muted')
    : 'text-brand-amber';

  const stamp = (
    <span
      className={`rotate-[-8deg] rounded-md border-[3px] font-outfit font-bold tracking-wider ${
        compact ? 'px-2 py-0.5 text-2xs' : 'px-3.5 py-1 text-sm'
      }`}
      style={{ borderColor: result.stamp.border, color: result.stamp.fg }}
    >
      {result.stamp.label}
    </span>
  );

  if (compact) {
    return (
      <div className="relative flex h-full w-[13.5rem] shrink-0 flex-col gap-2.5 overflow-hidden rounded-xl border border-border-card bg-gradient-to-b from-surface-card to-surface-header p-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-outfit text-2xs tracking-wider text-text-muted">
            {gameweekLabel}
          </span>
          {stamp}
        </div>
        <div className="flex items-center justify-center gap-2 py-1">
          <TeamCrest team={homeTeam} size={22} />
          <span className={`font-dmSerif text-[1.85rem] leading-none ${heroExact ? 'text-brand-teal' : 'text-text-primary'}`}>
            {heroScore}
          </span>
          <TeamCrest team={awayTeam} size={22} />
        </div>
        <span className="text-center font-outfit text-2xs tracking-wider text-text-muted">
          {result.hasCall ? `CALL ${result.callHome}–${result.callAway}` : 'NO SLIP'}
        </span>
        <div className="mt-auto flex items-end justify-between">
          <span className="truncate font-outfit text-2xs text-text-muted">
            {homeTeam.split(' ').pop()}–{awayTeam.split(' ').pop()}
          </span>
          <span className={`font-dmSerif text-xl leading-none ${pointsClass}`}>
            {result.settled ? pointsLabel(result.points) : result.live ? ceiling : '—'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={SLIP_SHELL}>
      <span className="font-outfit text-xs tracking-wider text-text-muted">
        {kicker} · {gameweekLabel}
      </span>

      <div className="relative pr-20">
        <h2 className="m-0 font-dmSerif text-[2.0625rem] md:text-[2.475rem] leading-tight text-text-primary [text-wrap:pretty]">
          {headline}
        </h2>
        <span className="absolute right-0 top-0">{stamp}</span>
      </div>

      <div className="flex flex-col items-center gap-1.5 py-2">
        <div className="flex items-center justify-center gap-4">
          <TeamCrest team={homeTeam} size={44} />
          <span
            className={`font-dmSerif text-[3.3rem] md:text-[4.125rem] leading-none ${heroExact ? 'text-brand-teal' : 'text-text-primary'}`}
          >
            {heroScore}
          </span>
          <TeamCrest team={awayTeam} size={44} />
        </div>
        <span className="font-outfit text-xs tracking-[0.14em] text-text-muted">
          {result.hasCall ? `CALL ${result.callHome}–${result.callAway}` : 'NO SLIP FILED'}
        </span>
      </div>

      <div className="h-px bg-border-card" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-0">
        <div className="flex flex-col items-center gap-2 sm:border-r sm:border-border-card sm:pr-4">
          <span className="font-outfit text-2xs tracking-[0.14em] text-text-muted">CALLED</span>
          <ScorerPills
            names={called}
            empty={result.hasCall ? 'no scorers named' : 'nothing on file'}
            hitNames={actualNames}
          />
        </div>
        <div className="flex flex-col items-center gap-2 sm:pl-4">
          <span className="font-outfit text-2xs tracking-[0.14em] text-text-muted">
            {result.live ? 'LIVE' : 'ACTUAL'}
          </span>
          <ScorerPills
            names={actualNames}
            empty={result.awaiting || !heroReady ? 'awaiting scorers' : 'no scorers'}
            hitNames={called}
          />
        </div>
      </div>

      <div className="h-px bg-border-card" />

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col leading-snug">
          <span className="font-outfit text-2xs tracking-wider text-text-muted">STAKED</span>
          <span className="font-dmSerif text-xl leading-none text-brand-amber">{ceiling ?? '—'}</span>
        </div>
        <div className="flex flex-col leading-snug">
          <span className="font-outfit text-2xs tracking-wider text-text-muted">ACTUAL</span>
          <span className={`font-dmSerif text-xl leading-none ${pointsClass}`}>
            {result.settled ? pointsLabel(result.points) : '—'}
          </span>
        </div>
        {onViewFull && (
          <Button type="button" onClick={onViewFull} className="ml-auto shrink-0">
            Full prediction
            <ArrowRight size={16} weight="bold" />
          </Button>
        )}
      </div>
    </div>
  );
}
