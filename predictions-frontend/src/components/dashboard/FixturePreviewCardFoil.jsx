import { useNavigate } from 'react-router-dom';
import TeamCrest from '../ui/TeamCrest';
import ChipPile from './ChipPile';
import { resolveFiledChips } from './resolveFiledChips';

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

/**
 * Fixed-height box so a 0-scorer side and a 3-scorer side never pull their
 * crest/name row out of line with each other (the original version let
 * scorer-list height vary, which shifted the crests up/down relative to
 * one another).
 */
function ScorerBox({ names, isMobile }) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-1 rounded-[10px] border border-[#1c2942] bg-[#0b1424] px-3 ${
        isMobile ? 'min-h-[70px] py-2' : 'min-h-[88px] py-2.5'
      }`}
    >
      {names.length > 0 ? (
        names.map((name) => (
          <span key={name} className="font-outfit text-caption text-[#c8d2e0]">
            {name}
          </span>
        ))
      ) : (
        <span className="font-outfit text-2xs text-[#4f5b70]">no scorer named</span>
      )}
    </div>
  );
}

function ChipStampTooltip({ chips }) {
  if (!chips.length) return null;
  return (
    <div
      className="pointer-events-none absolute bottom-full right-0 z-10 mb-2 w-max max-w-[220px] rounded-[10px] border border-[#243247] bg-[#0b1424] px-3 py-2 opacity-0 shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-opacity duration-150 group-hover:opacity-100"
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

  if (!fixture) {
    return (
      <div
        className="mx-auto w-full max-w-[644px] rounded-[20px] border border-border-card p-6 text-center font-outfit text-sm text-text-muted-2"
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
    <div className="relative mx-auto w-full max-w-[644px] pb-3.5 pr-3.5">
      <div
        className={`relative overflow-visible rounded-[20px] border ${
          predicted ? 'border-brand-teal-mid/40' : 'border-[#1c2942]'
        }`}
        style={{ background: 'linear-gradient(180deg, #0a1120, #070d18)' }}
      >
        {/* Corner brackets */}
        <span className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 border-l border-t border-[#33445e]" />
        <span className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 border-r border-t border-[#33445e]" />
        <span className="pointer-events-none absolute bottom-2 left-2 h-3.5 w-3.5 border-b border-l border-[#33445e]" />
        <span className="pointer-events-none absolute bottom-2 right-2 h-3.5 w-3.5 border-b border-r border-[#33445e]" />

        {/* Title plate — slot label + venue/kickoff + a plain filed badge (no stamp) */}
        <div className="flex flex-col items-center gap-1.5 border-b border-dashed border-[#1c2942] px-7 pb-3.5 pt-[18px] text-center">
          <span
            className={`whitespace-nowrap rounded-xs border px-[9px] py-1 font-outfit text-2xs tracking-[0.12em] ${
              predicted
                ? 'border-brand-teal-mid/40 bg-brand-teal-deep/15 text-brand-teal'
                : 'border-[#b4530966] bg-[#78350f26] text-brand-amber-mid'
            }`}
          >
            {predicted ? 'FILED' : 'NOT FILED'}
          </span>
          <span className="font-outfit text-2xs uppercase tracking-[0.16em] text-brand-teal">
            {formatSlot(date) || `${homeTeam} v ${awayTeam}`}
          </span>
          <span className="font-outfit text-2xs text-[#66748c]">
            {[venue, formatKickoff(date)].filter(Boolean).join(' · ')}
          </span>
        </div>

        {predicted ? (
          <div
            className={`grid items-start gap-5 px-7 py-7 ${
              isMobile ? 'grid-cols-1 justify-items-center' : 'grid-cols-[1fr_auto_1fr]'
            }`}
          >
            <div className="flex w-full flex-col items-center gap-2.5">
              <TeamCrest team={homeTeam} size={crestSize} />
              <span className="font-dmSerif text-xl leading-tight text-white">{homeTeam}</span>
              <ScorerBox names={homeScorers} isMobile={isMobile} />
            </div>

            <div className="flex flex-col items-center gap-1 self-center rounded-[12px] border border-[#1c2942] bg-[#050a13] px-7 py-3.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-3">
                <span className="font-dmSerif text-6xl leading-[0.9] text-white">{prediction.homeScore}</span>
                <span className="font-dmSerif text-2xl leading-none text-[#4a5b78]">–</span>
                <span className="font-dmSerif text-6xl leading-[0.9] text-white">{prediction.awayScore}</span>
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-2.5">
              <TeamCrest team={awayTeam} size={crestSize} />
              <span className="font-dmSerif text-xl leading-tight text-white">{awayTeam}</span>
              <ScorerBox names={awayScorers} isMobile={isMobile} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-7 py-7 text-center">
            <span className="font-dmSerif text-2xl leading-tight text-white">
              Nothing filed on {homeTeam} v {awayTeam}
            </span>
            <span className="max-w-[38em] font-outfit text-caption text-[#8896ad]" style={{ textWrap: 'pretty' }}>
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
          className={`flex w-full flex-col gap-1.5 border-t border-dashed border-[#1c2942] bg-[#070d18] px-7 py-3.5 text-left ${
            isMobile ? 'cursor-pointer' : 'cursor-default'
          }`}
        >
          <span className="flex items-center gap-[9px]">
            <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#818cf8]" />
            <span className="font-outfit text-2xs uppercase tracking-[0.16em] text-[#66748c]">AI overview</span>
            <span className="font-outfit text-2xs text-[#4f5b70]">coming soon</span>
            {isMobile && (
              <span className="ml-auto font-outfit text-xs text-text-muted-2">{aiOpen ? '▴' : '▾'}</span>
            )}
          </span>
          {(!isMobile || aiOpen) && (
            <p className="m-0 font-outfit text-caption leading-relaxed text-[#8fa0b8]" style={{ textWrap: 'pretty' }}>
              Predicted scorelines, head-to-head history and what the league is picking will land here
              once a live model is plugged in. For now, this one&rsquo;s on you.
            </p>
          )}
        </button>

        {/* Bottom row — grayed-out ceiling points on the left, CTA on the right */}
        <div className="flex items-center justify-between gap-4 border-t border-[#1c2942] px-7 py-3">
          <span className="font-outfit text-2xs text-[#4f5b70]">
            {predicted ? `${ceiling} pts if it lands exactly` : 'nothing on the line'}
          </span>
          <button
            type="button"
            onClick={() => navigate('/fixtures')}
            className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-[9px] bg-brand-indigo-mid px-3.5 py-[7px] font-outfit text-caption font-semibold text-white transition-colors hover:bg-brand-indigo-hover"
          >
            {predicted ? 'Edit in reel' : 'File in reel'}
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
              <path d="M3 7.5h8.5M8 4l3.5 3.5L8 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chip stack — filed chip(s) overlapping the card's corner like a
          sticker (reusing the shared ChipPile stacking), with a hover
          tooltip spelling out exactly which chip(s) and their effect. */}
      <div className="group absolute bottom-0 right-0">
        <ChipStampTooltip chips={filedChips} />
        <div style={{ transform: 'rotate(8deg)', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.45))' }}>
          <ChipPile chips={filedChips} size={stampSize} />
        </div>
      </div>
    </div>
  );
}
