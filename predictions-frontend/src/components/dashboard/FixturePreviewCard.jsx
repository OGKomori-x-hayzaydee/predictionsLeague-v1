import { useNavigate } from 'react-router-dom';
import { CHIP_CONFIG } from '../../utils/chipManager';
import { CHIP_HUES, CHIP_BADGES, CHIP_EFFECTS, DEFAULT_CHIP_HUE } from './chipHues';
import { SpineHyphen, SpineSeal, SpineWell } from './fixturePreviewSpines';

function formatKickoff(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const day = d.toLocaleDateString(undefined, { weekday: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
}

// Familiar broadcast-slot naming (Friday Night, Saturday Lunchtime, ...) —
// pure formatting over the real kickoff date, no schedule/broadcast data.
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

function resolveFiledChips(chipIds) {
  return chipIds.map((id) => ({
    id,
    name: CHIP_CONFIG[id]?.name || id,
    tag: CHIP_BADGES[id] || CHIP_CONFIG[id]?.icon || '',
    hue: CHIP_HUES[id] || DEFAULT_CHIP_HUE,
    effect: CHIP_EFFECTS[id] || CHIP_CONFIG[id]?.description || '',
  }));
}

function PreviewHeader({ homeTeam, awayTeam, venue, date, predicted, ceiling, onEdit }) {
  const statusClasses = predicted
    ? 'bg-brand-teal-deep/15 border-brand-teal-mid/40 text-brand-teal'
    : 'bg-[#78350f26] border-[#b4530966] text-brand-amber-mid';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#16203a] px-[22px] py-[13px]">
      <div className="flex items-center gap-[11px] text-xs">
        <span className="font-outfit text-2xs uppercase tracking-[0.14em] text-brand-teal">
          {formatSlot(date) || `${homeTeam} v ${awayTeam}`}
        </span>
        {venue && (
          <>
            <span className="h-3 w-px bg-[#233248]" />
            <span className="font-outfit text-xs text-[#7c8aa2]">{venue}</span>
          </>
        )}
        {date && (
          <>
            <span className="h-3 w-px bg-[#233248]" />
            <span className="font-outfit text-2xs text-[#66748c]">{formatKickoff(date)}</span>
          </>
        )}
      </div>
      <div className="flex items-center gap-3.5">
        <span
          className={`whitespace-nowrap rounded-xs border px-[9px] py-1 font-outfit text-2xs tracking-[0.12em] ${statusClasses}`}
        >
          {predicted ? 'FILED' : 'NOT FILED'}
        </span>
        <span className="hidden font-outfit text-xs text-[#8fa0b8] sm:inline">
          {predicted ? `${ceiling} pts if it lands exactly` : 'nothing on the line'}
        </span>
        <button
          type="button"
          onClick={onEdit}
          className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-[9px] bg-brand-indigo-mid px-3.5 py-[9px] font-outfit text-caption font-semibold text-white transition-colors hover:bg-brand-indigo-hover"
        >
          {predicted ? 'Edit in reel' : 'File in reel'}
          <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
            <path d="M3 7.5h8.5M8 4l3.5 3.5L8 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function PreviewAiFooter({ isMobile, aiOpen, onToggleAi }) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-[#16203a] bg-[#070d18] px-[22px] py-2.5">
      <button
        type="button"
        onClick={isMobile ? onToggleAi : undefined}
        disabled={!isMobile}
        className={`flex items-center gap-[9px] text-left ${isMobile ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#818cf8]" />
        <span className="font-outfit text-2xs uppercase tracking-[0.16em] text-[#66748c]">
          AI overview
        </span>
        <span className="font-outfit text-2xs text-[#4f5b70]">coming soon</span>
        {isMobile && (
          <span className="ml-auto font-outfit text-xs text-text-muted-2">{aiOpen ? '▴' : '▾'}</span>
        )}
      </button>
      {(!isMobile || aiOpen) && (
        <p
          className="m-0 max-w-md font-outfit text-caption leading-relaxed text-[#8fa0b8]"
          style={{ textWrap: 'pretty' }}
        >
          Scorelines, head-to-head and league picks will land here once a live model is in. For now,
          this one&rsquo;s on you.
        </p>
      )}
    </div>
  );
}

function FiledSpine({ spineVariant, isMobile, homeTeam, awayTeam, prediction, homeScorers, awayScorers, filedChips }) {
  const shared = {
    homeTeam,
    awayTeam,
    homeScore: prediction.homeScore,
    awayScore: prediction.awayScore,
    homeScorers,
    awayScorers,
    filedChips,
    isMobile,
  };

  if (spineVariant === 'B') return <SpineSeal {...shared} />;
  if (spineVariant === 'D') return <SpineWell {...shared} />;
  return <SpineHyphen {...shared} />;
}

/**
 * Fixture-preview card — the selected station's detail view (Spine.dc.html
 * desktop lines 131-266, mobile lines 2257-2336).
 *
 * `spineVariant` picks the filed-score spine (A hyphen / B wax-seal / D well).
 * Unfiled copy is shared across all three.
 */
export default function FixturePreviewCard({
  fixture,
  ceiling,
  variant = 'desktop',
  spineVariant = 'A',
  aiOpen = true,
  onToggleAi,
  deadlineLabel,
}) {
  const navigate = useNavigate();
  const isMobile = variant === 'mobile';

  if (!fixture) {
    return (
      <div
        className="rounded-[14px] border border-border-card p-6 text-center font-outfit text-sm text-text-muted-2"
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

  return (
    <div
      className="flex flex-col overflow-hidden rounded-[14px] border border-border-card"
      style={{ background: 'linear-gradient(180deg, #0a1120, #070d18)' }}
    >
      <PreviewHeader
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        venue={venue}
        date={date}
        predicted={predicted}
        ceiling={ceiling}
        onEdit={() => navigate('/fixtures')}
      />

      {predicted ? (
        <FiledSpine
          spineVariant={spineVariant}
          isMobile={isMobile}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          prediction={prediction}
          homeScorers={homeScorers}
          awayScorers={awayScorers}
          filedChips={filedChips}
        />
      ) : (
        <div className="flex flex-col gap-1.5 px-7 py-[22px]">
          <span className="font-dmSerif text-2xl leading-tight text-white">
            Nothing filed on {homeTeam} v {awayTeam}
          </span>
          <span className="max-w-[46em] font-outfit text-caption text-[#8896ad]" style={{ textWrap: 'pretty' }}>
            {deadlineLabel
              ? `The read below is the model's, not yours. File a scoreline before the deadline (${deadlineLabel}) to put points on it.`
              : 'File a scoreline before the deadline to put points on it.'}
          </span>
        </div>
      )}

      <PreviewAiFooter isMobile={isMobile} aiOpen={aiOpen} onToggleAi={onToggleAi} />
    </div>
  );
}
