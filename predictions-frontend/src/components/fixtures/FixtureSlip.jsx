import { useState } from 'react';
import TeamCrest from '../ui/TeamCrest';
import { buildLedgerRows, namedScorers, slipHeadline, slipSentence } from './predictionLedger';
import {
  buildResultView,
  BREAKDOWN_LABELS,
  pointsLabel,
  scorerWasCorrect,
} from '../../utils/matchResult';

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
  gameweekLabel = 'GW24',
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

  // RESTING / MAIN VIEW (Picture 3 - when fixture is filed and resting in center)
  if (variant === 'resting' || variant === 'main') {
    return (
      <div className="relative flex w-full max-w-[46.2rem] flex-col gap-4 overflow-hidden rounded-2xl border border-[#1c2942] bg-gradient-to-b from-[#0c1424] to-[#080e1a] p-[1.65rem] shadow-2xl">
        {/* Top line */}
        <div className="flex items-baseline justify-between gap-2.5">
          <span className="font-outfit text-xs tracking-wider text-[#66748c]">
            THE SLIP · {gameweekLabel}
          </span>
          <span className="font-outfit text-xs tracking-wide text-[#5eead4]">
            FILED 20:41
          </span>
        </div>

        {/* Headline + FILED stamp */}
        <div className="relative pr-20">
          <h2 className="m-0 font-dmSerif text-[2.0625rem] md:text-[2.475rem] leading-tight text-white" style={{ textWrap: 'pretty' }}>
            {headline}
          </h2>
          <span className="absolute right-0 top-0 rotate-[-8deg] rounded-md border-[3px] border-[#14b8a699] px-3.5 py-1 font-outfit text-sm font-bold tracking-wider text-[#5eead4]">
            FILED
          </span>
        </div>

        {/* Crests + Scores */}
        <div className="flex items-center justify-center gap-4 py-2">
          <TeamCrest team={homeTeam} size={44} />
          <span className="font-dmSerif text-[3.3rem] md:text-[4.125rem] leading-none text-white">
            {homeScore}–{awayScore}
          </span>
          <TeamCrest team={awayTeam} size={44} />
        </div>

        <div className="h-px bg-[#16203a]" />

        {/* Scorer pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {scorers.length > 0 ? (
            scorers.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="flex items-center gap-2 rounded-full border border-[#1c2942] bg-[#0b1626] px-3.5 py-1.5 text-xs text-[#c8d2e0]"
              >
                <span className="w-1.5 h-1.5 shrink-0 rounded-full border-[1.5px] border-brand-teal" />
                {name}
              </span>
            ))
          ) : (
            <span className="font-outfit text-xs text-[#4f5b70]">no scorers named</span>
          )}
        </div>

        <div className="h-px bg-[#16203a]" />

        {/* Ledger & Ceiling */}
        <div className="flex items-center gap-6">
          {ledger.map((row) => (
            <div key={row.label} className="flex flex-col leading-snug">
              <span className="font-outfit text-2xs tracking-wider text-[#5b667d]">{row.label}</span>
              <span className="font-outfit text-sm font-medium text-white">{row.value}</span>
            </div>
          ))}

          <div className="ml-auto flex flex-col items-end leading-none">
            <span className="font-outfit text-2xs tracking-wider text-[#7f93ad]">CEILING</span>
            <span className="font-dmSerif text-[2.0625rem] text-[#fcd34d]">{ceiling}</span>
          </div>

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-brand-indigo-mid px-5 py-2.5 font-outfit text-xs font-semibold text-white transition-colors hover:bg-brand-indigo-hover"
            >
              Edit slip
            </button>
          )}
        </div>
      </div>
    );
  }

  // LIVE PREVIEW SLIP (Picture 5 - Right rail preview while editing)
  return (
    <div className="relative flex w-full flex-col gap-3 overflow-hidden rounded-xl border border-[#1c2942] bg-gradient-to-b from-[#0c1424] to-[#080e1a] p-4 shadow-xl">
      {/* Top line */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-outfit text-2xs tracking-wider text-[#66748c]">
          THE SLIP · {gameweekLabel}
        </span>
        <span
          className={`font-outfit text-2xs tracking-wide ${
            filed ? 'text-[#5eead4]' : 'text-brand-amber-mid'
          }`}
        >
          {filed ? 'FILED' : 'UNFILED'}
        </span>
      </div>

      {/* Crests + Score */}
      <div className="flex items-center justify-center gap-3 py-1">
        <TeamCrest team={homeTeam} size={28} />
        <span className="font-dmSerif text-4xl leading-none text-white">{homeScore}</span>
        <span className="font-dmSerif text-lg text-[#2c3a53]">–</span>
        <span className="font-dmSerif text-4xl leading-none text-white">{awayScore}</span>
        <TeamCrest team={awayTeam} size={28} />
      </div>

      {/* Summary sentence */}
      <p className="m-0 font-outfit text-xs leading-relaxed text-[#c8d2e0]" style={{ textWrap: 'pretty' }}>
        {sentence}
      </p>

      <div className="h-px bg-[#16203a]" />

      {/* Breakdown rows */}
      <div className="flex flex-col gap-1.5">
        {ledger.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-2 text-xs text-[#8fa0b8]">
            <span>{row.label}</span>
            <span className="font-outfit text-white">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#16203a]" />

      {/* Ceiling */}
      <div className="flex items-end justify-between">
        <span className="text-xs text-[#8fa0b8]">If it lands exactly</span>
        <span className="font-dmSerif text-3xl leading-none text-[#fcd34d]">{ceiling}</span>
      </div>

      <span className="font-outfit text-2xs leading-relaxed text-[#4f5b70]">
        This slip is what gets filed. Review it, then sign it off.
      </span>
    </div>
  );
}

function ScoredSlip({ fixture, prediction, ceiling, gameweekLabel, density }) {
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const { homeTeam, awayTeam } = fixture;
  const result = buildResultView(fixture, prediction);
  const compact = density === 'compact';
  const actualScorers = [
    ...(prediction?.actualHomeScorers || fixture?.actualHomeScorers || []),
    ...(prediction?.actualAwayScorers || fixture?.actualAwayScorers || []),
  ];
  const called = namedScorers(prediction?.homeScorers, prediction?.awayScorers);
  const heroReady = result.actualHome != null && result.actualAway != null;
  const heroScore = heroReady ? `${result.actualHome}–${result.actualAway}` : '—';
  const heroColor = result.verdict?.verdict === 'EXACT' ? '#5eead4' : '#ffffff';
  const headline = result.awaiting
    ? 'Awaiting official score'
    : !result.hasCall
      ? `${homeTeam} v ${awayTeam}`
      : heroReady
        ? slipHeadline(homeTeam, awayTeam, result.actualHome, result.actualAway)
        : slipHeadline(homeTeam, awayTeam, result.callHome, result.callAway);
  const kicker = result.live ? 'THE RECEIPT · LIVE' : 'THE RECEIPT';
  const pointsFg = result.settled
    ? (result.points > 0 ? '#5eead4' : '#7f93ad')
    : '#8a7a4a';

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
      <div className="relative flex h-full w-[13.5rem] shrink-0 flex-col gap-2.5 overflow-hidden rounded-xl border border-[#1c2942] bg-gradient-to-b from-[#0c1424] to-[#080e1a] p-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-outfit text-2xs tracking-wider text-[#66748c]">
            {gameweekLabel}
          </span>
          {stamp}
        </div>
        <div className="flex items-center justify-center gap-2 py-1">
          <TeamCrest team={homeTeam} size={22} />
          <span className="font-dmSerif text-[1.85rem] leading-none" style={{ color: heroColor }}>
            {heroScore}
          </span>
          <TeamCrest team={awayTeam} size={22} />
        </div>
        <span className="text-center font-outfit text-2xs tracking-wider text-[#5b667d]">
          {result.hasCall ? `CALL ${result.callHome}–${result.callAway}` : 'NO SLIP'}
        </span>
        <div className="mt-auto flex items-end justify-between">
          <span className="truncate font-outfit text-2xs text-[#7f93ad]">
            {homeTeam.split(' ').pop()}–{awayTeam.split(' ').pop()}
          </span>
          <span className="font-dmSerif text-xl leading-none" style={{ color: pointsFg }}>
            {result.settled ? pointsLabel(result.points) : result.live ? ceiling : '—'}
          </span>
        </div>
      </div>
    );
  }

  const breakdownEntries = result.breakdown ? Object.entries(result.breakdown) : [];

  return (
    <div className="relative flex w-full max-w-[46.2rem] flex-col gap-4 overflow-hidden rounded-2xl border border-[#1c2942] bg-gradient-to-b from-[#0c1424] to-[#080e1a] p-[1.65rem] shadow-2xl">
      <div className="flex items-baseline justify-between gap-2.5">
        <span className="font-outfit text-xs tracking-wider text-[#66748c]">
          {kicker} · {gameweekLabel}
        </span>
        <span className="font-outfit text-xs tracking-wide" style={{ color: result.stamp.fg }}>
          {result.live ? result.stamp.label : result.settled ? 'SCORED' : result.awaiting ? 'AWAITING' : 'LOCKED'}
        </span>
      </div>

      <div className="relative pr-20">
        <h2 className="m-0 font-dmSerif text-[2.0625rem] md:text-[2.475rem] leading-tight text-white" style={{ textWrap: 'pretty' }}>
          {headline}
        </h2>
        <span className="absolute right-0 top-0">{stamp}</span>
      </div>

      <div className="flex flex-col items-center gap-1.5 py-2">
        <div className="flex items-center justify-center gap-4">
          <TeamCrest team={homeTeam} size={44} />
          <span
            className="font-dmSerif text-[3.3rem] md:text-[4.125rem] leading-none"
            style={{ color: heroColor }}
          >
            {heroScore}
          </span>
          <TeamCrest team={awayTeam} size={44} />
        </div>
        <span className="font-outfit text-xs tracking-[0.14em] text-[#7f93ad]">
          {result.hasCall ? `CALL ${result.callHome}–${result.callAway}` : 'NO SLIP FILED'}
        </span>
      </div>

      <div className="h-px bg-[#16203a]" />

      <div className="flex flex-wrap justify-center gap-2">
        {called.length > 0 ? (
          called.map((name, i) => {
            const hit = scorerWasCorrect(name, prediction?.actualHomeScorers, prediction?.actualAwayScorers)
              || actualScorers.includes(name);
            return (
              <span
                key={`${name}-${i}`}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs ${
                  hit
                    ? 'border-[#14b8a666] bg-[#0f766e22] text-[#5eead4]'
                    : 'border-[#1c2942] bg-[#0b1626] text-[#c8d2e0]'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full border-[1.5px] ${
                    hit ? 'border-brand-teal bg-brand-teal' : 'border-[#4f5b70]'
                  }`}
                />
                {name}
              </span>
            );
          })
        ) : (
          <span className="font-outfit text-xs text-[#4f5b70]">
            {result.hasCall ? 'no scorers named' : 'nothing on file'}
          </span>
        )}
      </div>

      <div className="h-px bg-[#16203a]" />

      <div className="flex items-end gap-6">
        <div className="ml-auto flex flex-col items-end leading-none">
          <span className="font-outfit text-2xs tracking-wider text-[#7f93ad]">
            {result.settled ? 'POINTS' : 'STAKED'}
          </span>
          <span
            className="font-dmSerif text-[2.0625rem]"
            style={{ color: result.settled ? pointsFg : '#8a7a4a' }}
          >
            {result.settled ? pointsLabel(result.points) : (ceiling ?? '—')}
          </span>
        </div>
      </div>

      {result.settled && breakdownEntries.length > 0 && (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setLedgerOpen((v) => !v)}
            className="flex cursor-pointer items-center justify-between font-outfit text-2xs tracking-[0.14em] text-[#5b667d] hover:text-[#c8d2e0]"
          >
            HOW THIS SCORED
            <span className={`transition-transform ${ledgerOpen ? 'rotate-180' : ''}`}>&#9662;</span>
          </button>
          {ledgerOpen && (
            <div className="flex flex-col gap-1.5">
              {breakdownEntries.map(([key, val]) => (
                <div key={key} className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="text-[#8fa0b8]">{BREAKDOWN_LABELS[key] || key}</span>
                  <span className="font-outfit text-white">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
