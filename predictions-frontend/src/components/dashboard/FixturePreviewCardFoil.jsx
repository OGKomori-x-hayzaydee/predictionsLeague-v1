import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamCrest from '../ui/TeamCrest';
import ChipPile from './ChipPile';
import { resolveFiledChips } from './resolveFiledChips';
import { isFinishedMatch } from '../../utils/fixtureUtils';

function formatKickoff(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.toLocaleDateString(undefined, { weekday: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
}

function formatSlot(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.getDay();
  const hour = d.getHours() + d.getMinutes() / 60;
  if (day === 5) return 'Friday Night';
  if (day === 6) return hour < 13 ? 'Saturday Lunchtime' : hour < 17.5 ? 'Saturday 3pm' : 'Saturday Evening';
  if (day === 0) return hour < 15 ? 'Sunday Early' : 'Sunday Late';
  if (day === 1) return 'Monday Night';
  return d.toLocaleDateString(undefined, { weekday: 'long' });
}

/** Scorer pill row — the same recipe as FixtureSlip's scorer pills, not a
 * bordered box, just flat pills wrapped per side. */
function ScorerPills({ names }) {
  return (
    <div className="flex min-h-[64px] w-full flex-wrap content-center justify-center gap-1.5">
      {names.length > 0 ? (
        names.map((name) => (
          <span
            key={name}
            className="flex items-center gap-2 rounded-full border border-[#1c2942] bg-[#0b1626] px-3 py-1 text-xs text-[#c8d2e0]"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full border-[1.5px] border-brand-teal" />
            {name}
          </span>
        ))
      ) : (
        <span className="font-outfit text-xs text-[#4f5b70]">no scorer named</span>
      )}
    </div>
  );
}

function ChipStampTooltip({ chips, visible }) {
  if (!chips.length) return null;
  return (
    <div
      className={`pointer-events-none absolute left-full top-1/2 z-20 ml-2 w-max max-w-[220px] -translate-y-1/2 rounded-[10px] border border-[#243247] bg-[#0b1424] px-3 py-2 shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-opacity duration-150 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <ul className="flex flex-col gap-1.5">
        {chips.map((chip) => (
          <li key={chip.id} className="flex flex-col">
            <span className="font-outfit text-2xs font-semibold tracking-[0.06em]" style={{ color: chip.hue }}>
              {chip.name}
            </span>
            <span className="font-outfit text-2xs text-[#8fa0b8]">{chip.effect}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * spineVariant 'C' — "foil" / collectible-card treatment. Deliberately
 * bypasses the shared PreviewHeader/PreviewAiFooter/FiledSpine composition
 * the A/B/D variants use in FixturePreviewCard.jsx: this one owns its own
 * frame, proportions and chrome end to end rather than sharing them, per
 * explicit sign-off that it doesn't need to match the others' sizing.
 */
export default function FixturePreviewCardFoil({
  fixture,
  ceiling,
  variant = 'desktop',
  aiOpen = true,
  onToggleAi,
  deadlineLabel,
}) {
  const navigate = useNavigate();
  const isMobile = variant === 'mobile';
  const [chipHover, setChipHover] = useState(false);

  if (!fixture) {
    return (
      <div
        className="mx-auto w-full max-w-[820px] rounded-[20px] border border-border-card p-6 text-center font-outfit text-sm text-text-muted-2"
        style={{ background: 'linear-gradient(180deg, #0a1120, #070d18)' }}
      >
        No fixture selected.
      </div>
    );
  }

  const { homeTeam, awayTeam, venue, date, predicted } = fixture;
  const prediction = fixture.userPrediction;
  const chipIds = (prediction?.chips || []).filter(Boolean);
  const filedChips = resolveFiledChips(chipIds);

  const homeScorers = (prediction?.homeScorers || []).filter(Boolean);
  const awayScorers = (prediction?.awayScorers || []).filter(Boolean);
  const crestSize = isMobile ? 50 : 69;
  const stampSize = isMobile ? 46 : 60;

  return (
    <div className="relative mx-auto w-full max-w-[820px] pt-3.5 pr-3.5">
      <div
        className="relative overflow-visible rounded-[20px] border border-[#1c2942]"
        style={{ background: 'linear-gradient(180deg, #0a1120, #070d18)' }}
      >
        {/* Title plate — slot label + venue/kickoff only, no filed indicator */}
        <div className="flex flex-col items-center gap-1 border-b border-dashed border-white/10 px-7 pb-2.5 pt-3 text-center">
          <span className="font-outfit text-xs uppercase tracking-[0.16em] text-brand-teal">
            {formatSlot(date) || `${homeTeam} v ${awayTeam}`}
          </span>
          <span className="font-outfit text-xs text-[#66748c]">
            {[venue, formatKickoff(date)].filter(Boolean).join(' · ')}
          </span>
        </div>

        {predicted ? (
          <div
            className={`grid items-start gap-5 px-7 py-5 ${
              isMobile ? 'grid-cols-1 justify-items-center' : 'grid-cols-[1fr_auto_1fr]'
            }`}
          >
            <div className="flex w-full flex-col items-center gap-2.5">
              <TeamCrest team={homeTeam} size={crestSize} />
              <span className="font-dmSerif text-2xl leading-tight text-white">{homeTeam}</span>
              <ScorerPills names={homeScorers} />
            </div>

            <div className="flex flex-col items-center gap-1 self-center rounded-[12px] border border-[#1c2942] bg-[#050a13] px-8 py-3 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3">
                <span className="font-dmSerif text-7xl leading-[0.9] text-white">{prediction.homeScore}</span>
                <span className="font-dmSerif text-3xl leading-none text-[#4a5b78]">–</span>
                <span className="font-dmSerif text-7xl leading-[0.9] text-white">{prediction.awayScore}</span>
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-2.5">
              <TeamCrest team={awayTeam} size={crestSize} />
              <span className="font-dmSerif text-2xl leading-tight text-white">{awayTeam}</span>
              <ScorerPills names={awayScorers} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-7 py-6 text-center">
            <span className="font-dmSerif text-3xl leading-tight text-white">
              Nothing filed on {homeTeam} v {awayTeam}
            </span>
            <span className="max-w-[38em] font-outfit text-sm text-[#8896ad]" style={{ textWrap: 'pretty' }}>
              {deadlineLabel
                ? `File a scoreline before the deadline (${deadlineLabel}) to put points on it.`
                : 'File a scoreline before the deadline to put points on it.'}
            </span>
          </div>
        )}

        {/* Footer — AI overview as a card-back flap */}
        <button
          type="button"
          onClick={isMobile ? onToggleAi : undefined}
          disabled={!isMobile}
          className={`flex w-full flex-col gap-1.5 border-t border-dashed border-white/10 bg-[#070d18] px-7 py-2.5 text-left ${
            isMobile ? 'cursor-pointer' : 'cursor-default'
          }`}
        >
          <span className="flex items-center gap-[9px]">
            <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#818cf8]" />
            <span className="font-outfit text-xs uppercase tracking-[0.16em] text-[#66748c]">AI overview</span>
            <span className="font-outfit text-xs text-[#4f5b70]">coming soon</span>
            {isMobile && (
              <span className="ml-auto font-outfit text-xs text-text-muted-2">{aiOpen ? '▴' : '▾'}</span>
            )}
          </span>
          {(!isMobile || aiOpen) && (
            <p className="m-0 font-outfit text-sm leading-relaxed text-[#8fa0b8]" style={{ textWrap: 'pretty' }}>
              Predicted scorelines, head-to-head history and what the league is picking will land here
              once a live model is plugged in. For now, this one&rsquo;s on you.
            </p>
          )}
        </button>

        {/* Bottom row — ceiling + reel CTA inside the card */}
        <div className="flex items-center justify-between gap-3 border-t border-[#1c2942] px-7 py-3">
          <div className="flex flex-col leading-none">
            <span className="font-outfit text-2xs uppercase tracking-[0.14em] text-[#7f93ad]">Ceiling</span>
            <span className="font-dmSerif text-lg text-brand-amber">
              {predicted ? `${ceiling} pts` : '—'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/fixtures')}
            className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-[9px] bg-brand-indigo-mid px-4 py-2 font-outfit text-sm font-semibold text-white transition-colors hover:bg-brand-indigo-hover"
          >
            {isFinishedMatch(fixture.status)
              ? 'View in reel'
              : predicted
                ? 'Edit in reel'
                : 'File in reel'}
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <path d="M3 7.5h8.5M8 4l3.5 3.5L8 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chip stack — filed chip(s) overlapping the card's corner like a
          sticker (reusing the shared ChipPile stacking), with a hover
          tooltip spelling out exactly which chip(s) and their effect. */}
      <div
        className="absolute top-0 right-0 p-2"
        onMouseEnter={() => setChipHover(true)}
        onMouseLeave={() => setChipHover(false)}
      >
        <ChipStampTooltip chips={filedChips} visible={chipHover} />
        <div style={{ transform: 'rotate(8deg)', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.45))' }}>
          <ChipPile chips={filedChips} size={stampSize} />
        </div>
      </div>

    </div>
  );
}
