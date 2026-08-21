import { useNavigate } from 'react-router-dom';
import CrestMedallion from '../ui/CrestMedallion';
import ChipPile from './ChipPile';
import { TEAM_COLORS, normalizeTeamName } from '../../utils/teamLogos';
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

function ScorerList({ names }) {
  if (!names.length) {
    return <span className="font-outfit text-2xs text-[#4f5b70]">no scorer named</span>;
  }
  return (
    <div className="flex flex-col items-center gap-1">
      {names.map((name) => (
        <span key={name} className="font-outfit text-caption text-[#c8d2e0]">
          {name}
        </span>
      ))}
    </div>
  );
}

/**
 * spineVariant 'C' — "foil" / collectible-card treatment. Deliberately
 * bypasses the shared PreviewHeader/PreviewAiFooter/FiledSpine composition
 * the A/B/D variants use in FixturePreviewCard.jsx: this one owns its own
 * frame, proportions and chrome end to end rather than sharing them, per
 * explicit sign-off that it doesn't need to match the others' sizing.
 *
 * Crest medallions reuse ChipToken's own conic-gradient rim recipe (via
 * CrestMedallion) so crests and the filed ChipPile read as the same
 * physical "coin/stamp" object language, instead of the chip being the
 * only physical element on an otherwise flat card.
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
        className="mx-auto w-full max-w-[560px] rounded-[17px] border border-border-card p-6 text-center font-outfit text-sm text-text-muted-2"
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
  const medallionSize = isMobile ? 44 : 60;
  const stampSize = isMobile ? 40 : 52;

  const homeHue = TEAM_COLORS[normalizeTeamName(homeTeam)] || 'var(--brand-teal)';
  const awayHue = TEAM_COLORS[normalizeTeamName(awayTeam)] || 'var(--brand-indigo-mid)';

  const frameBorder = predicted
    ? 'linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-indigo-mid) 50%, var(--brand-teal) 100%)'
    : '#243247';

  return (
    <div className="relative mx-auto w-full max-w-[560px] pb-3 pr-3">
      {/* Foil hairline border, via padding around the inner frame */}
      <div className="rounded-[20px] p-[3px]" style={{ background: frameBorder }}>
        <div
          className="relative overflow-visible rounded-[17px] border border-[#1c2942]"
          style={{ background: 'linear-gradient(180deg, #0a1120, #070d18)' }}
        >
          {/* Corner brackets */}
          <span className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-[#33445e]" />
          <span className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-[#33445e]" />
          <span className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-[#33445e]" />
          <span className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[#33445e]" />

          {/* FILED / NOT FILED corner ribbon */}
          <div
            className={`absolute -right-2 -top-2 rotate-[24deg] whitespace-nowrap rounded-sm border px-3 py-[3px] font-outfit text-2xs font-semibold tracking-[0.12em] shadow-[0_3px_8px_rgba(0,0,0,0.4)] ${
              predicted
                ? 'border-brand-teal-mid/50 bg-brand-teal-deep/90 text-brand-teal-pale'
                : 'border-[#b4530966] bg-[#3a2410] text-brand-amber-mid'
            }`}
          >
            {predicted ? 'FILED' : 'NOT FILED'}
          </div>

          {/* Title plate */}
          <div className="flex flex-col items-center gap-1 border-b border-dashed border-[#1c2942] px-6 pb-3 pt-4 text-center">
            <span className="font-outfit text-2xs uppercase tracking-[0.16em] text-brand-teal">
              {formatSlot(date) || `${homeTeam} v ${awayTeam}`}
            </span>
            <span className="font-outfit text-2xs text-[#66748c]">
              {[venue, formatKickoff(date)].filter(Boolean).join(' · ')}
            </span>
          </div>

          {predicted ? (
            <div
              className={`grid items-center gap-4 px-6 py-6 ${
                isMobile ? 'grid-cols-1 justify-items-center' : 'grid-cols-[1fr_auto_1fr]'
              }`}
            >
              <div className="flex flex-col items-center gap-2.5">
                <CrestMedallion team={homeTeam} hue={homeHue} size={medallionSize} />
                <span className="font-dmSerif text-lg leading-tight text-white">{homeTeam}</span>
                <ScorerList names={homeScorers} />
              </div>

              <div className="flex flex-col items-center gap-1 rounded-[12px] border border-[#1c2942] bg-[#050a13] px-6 py-3 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3">
                  <span className="font-dmSerif text-5xl leading-[0.9] text-white">{prediction.homeScore}</span>
                  <span className="font-dmSerif text-xl leading-none text-[#4a5b78]">–</span>
                  <span className="font-dmSerif text-5xl leading-[0.9] text-white">{prediction.awayScore}</span>
                </div>
                <span className="font-outfit text-2xs tracking-[0.1em] text-[#66748c]">
                  {ceiling} pts if it lands exactly
                </span>
              </div>

              <div className="flex flex-col items-center gap-2.5">
                <CrestMedallion team={awayTeam} hue={awayHue} size={medallionSize} />
                <span className="font-dmSerif text-lg leading-tight text-white">{awayTeam}</span>
                <ScorerList names={awayScorers} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 px-6 py-6 text-center">
              <span className="font-dmSerif text-xl leading-tight text-white">
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
            className={`flex w-full flex-col gap-1.5 border-t border-dashed border-[#1c2942] bg-[#070d18] px-6 py-3 text-left ${
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

          {/* CTA, tucked under the frame rather than in the title plate */}
          <div className="flex justify-center border-t border-[#1c2942] px-6 py-2.5">
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
      </div>

      {/* Foil stamp — filed chip(s) overlapping the card's corner like a
          sticker (reusing the shared ChipPile stacking), or a dashed empty
          slot when nothing's on it yet. */}
      <div
        className="absolute bottom-0 right-0"
        style={{ transform: 'rotate(8deg)', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.45))' }}
      >
        <ChipPile chips={filedChips} size={stampSize} />
      </div>
    </div>
  );
}
