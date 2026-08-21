import TeamCrest from '../ui/TeamCrest';
import ChipPile from './ChipPile';

function ScorerRow({ name, side = 'home', align = 'auto' }) {
  const centered = align === 'center';
  const end = align === 'end' || (!centered && align !== 'start' && side === 'home');
  return (
    <span
      className={`flex items-center gap-2 font-outfit text-caption text-[#c8d2e0] ${
        centered ? 'justify-center' : end ? 'justify-end' : 'justify-start'
      }`}
    >
      {side === 'away' && (
        <span className="h-[7px] w-[7px] shrink-0 rounded-full border-[1.5px] border-brand-teal" />
      )}
      {name}
      {side === 'home' && (
        <span className="h-[7px] w-[7px] shrink-0 rounded-full border-[1.5px] border-brand-teal" />
      )}
    </span>
  );
}

function scorerAlignClass(align, side) {
  if (align === 'center') return 'text-center';
  if (align === 'end' || (align === 'auto' && side === 'home')) return 'text-right';
  return 'text-left';
}

function ScorerList({ names, side, align = 'auto' }) {
  if (!names.length) {
    return (
      <span className={`font-outfit text-2xs text-[#4f5b70] ${scorerAlignClass(align, side)}`}>
        no scorer named
      </span>
    );
  }
  return (
    <div className="flex flex-col gap-1.5">
      {names.map((name) => (
        <ScorerRow key={name} name={name} side={side} align={align} />
      ))}
    </div>
  );
}

function CaptionRail({ homeTeam, awayTeam, crestSize, compact }) {
  const nameClass = compact
    ? 'font-dmSerif text-base leading-tight text-white truncate'
    : 'font-dmSerif text-lg leading-tight text-white truncate sm:text-xl';
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <TeamCrest team={homeTeam} size={crestSize} />
        <span className={nameClass}>{homeTeam}</span>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <span className={nameClass}>{awayTeam}</span>
        <TeamCrest team={awayTeam} size={crestSize} />
      </div>
    </div>
  );
}

/**
 * A — Chip as the hyphen. Read: 0  [D+]  2. Teams sit on a tight caption
 * rail; scorers hang off each digit. Empty chip = dashed token in the
 * same hyphen slot.
 */
export function SpineHyphen({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  homeScorers,
  awayScorers,
  filedChips,
  isMobile,
}) {
  const chipSize = isMobile ? 56 : 64;
  const stacked = isMobile;

  return (
    <div className={`flex flex-col gap-4 px-7 ${isMobile ? 'py-5' : 'py-6'}`}>
      <CaptionRail homeTeam={homeTeam} awayTeam={awayTeam} crestSize={isMobile ? 22 : 28} />

      <div
        className={
          stacked
            ? 'flex flex-col items-center gap-3'
            : 'flex items-start justify-center gap-5'
        }
      >
        <div className={`flex flex-col gap-1.5 ${stacked ? 'items-center' : 'items-end'}`}>
          <span className={`font-dmSerif leading-[0.9] text-white ${isMobile ? 'text-5xl' : 'text-6xl'}`}>
            {homeScore}
          </span>
          <ScorerList names={homeScorers} side="home" align={stacked ? 'center' : 'end'} />
        </div>

        <div
          className="flex items-center self-center"
          style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.4))' }}
        >
          <ChipPile chips={filedChips} size={chipSize} />
        </div>

        <div className={`flex flex-col gap-1.5 ${stacked ? 'items-center' : 'items-start'}`}>
          <span className={`font-dmSerif leading-[0.9] text-white ${isMobile ? 'text-5xl' : 'text-6xl'}`}>
            {awayScore}
          </span>
          <ScorerList names={awayScorers} side="away" align={stacked ? 'center' : 'start'} />
        </div>
      </div>
    </div>
  );
}

/**
 * B — Wax-seal poster. Vertical fight-poster stack; the ChipToken overlaps
 * the stamped score box at bottom-right. Two chips = stacked seals.
 */
export function SpineSeal({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  homeScorers,
  awayScorers,
  filedChips,
  isMobile,
}) {
  const crestSize = isMobile ? 36 : 48;
  const sealSize = isMobile ? 52 : 60;
  const hue = filedChips[0]?.hue;

  return (
    <div className={`flex flex-col items-center gap-4 px-7 ${isMobile ? 'py-5' : 'pb-8 pt-6'}`}>
      <div className="flex flex-col items-center gap-1.5">
        <TeamCrest team={homeTeam} size={crestSize} />
        <span className="font-outfit text-2xs uppercase tracking-[0.22em] text-[#5b667d]">Home</span>
        <span className="font-dmSerif text-2xl leading-tight text-white sm:text-[1.75rem]">{homeTeam}</span>
      </div>

      <div className="relative px-5 pb-6">
        <div
          className="relative px-10 py-4 sm:px-14 sm:py-5"
          style={{
            background:
              'repeating-linear-gradient(-18deg, transparent, transparent 6px, rgba(255,255,255,0.018) 6px, rgba(255,255,255,0.018) 7px), linear-gradient(180deg, #101b2e, #0a1322)',
            border: '1px solid #24344f',
            boxShadow: 'inset 0 0 0 3px #070d18, inset 0 0 0 4px #1c2a42, 0 8px 24px rgba(0,0,0,0.28)',
          }}
        >
          <div className="flex items-center justify-center gap-4">
            <span className={`font-dmSerif leading-[0.85] text-white ${isMobile ? 'text-5xl' : 'text-6xl'}`}>
              {homeScore}
            </span>
            <span className={`font-dmSerif leading-none text-[#4a5b78] ${isMobile ? 'text-2xl' : 'text-3xl'}`}>–</span>
            <span className={`font-dmSerif leading-[0.85] text-white ${isMobile ? 'text-5xl' : 'text-6xl'}`}>
              {awayScore}
            </span>
          </div>
          <span
            className="absolute"
            style={{
              right: -10,
              bottom: -14,
              transform: 'rotate(8deg)',
              filter: hue
                ? `drop-shadow(0 6px 10px rgba(0,0,0,0.5)) drop-shadow(0 0 10px ${hue}33)`
                : 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))',
            }}
          >
            <ChipPile chips={filedChips} size={sealSize} />
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 pt-2">
        <span className="font-dmSerif text-2xl leading-tight text-white sm:text-[1.75rem]">{awayTeam}</span>
        <span className="font-outfit text-2xs uppercase tracking-[0.22em] text-[#5b667d]">Away</span>
        <TeamCrest team={awayTeam} size={crestSize} />
      </div>

      <div className="mt-1 grid w-full max-w-md grid-cols-2 gap-4 border-t border-[#16203a] pt-3">
        <div className="flex flex-col items-end gap-1.5">
          <ScorerList names={homeScorers} side="home" align="end" />
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <ScorerList names={awayScorers} side="away" align="start" />
        </div>
      </div>
    </div>
  );
}

function ChipWell({ chips, isMobile }) {
  const tokenSize = isMobile ? 48 : 52;
  const well = isMobile ? 76 : 84;
  const primary = chips[0];
  const hue = primary?.hue;

  return (
    <div
      className="flex w-[148px] shrink-0 flex-col items-center gap-2.5 rounded-[22px] border border-[#1a2740] px-3.5 pb-3.5 pt-4"
      style={{
        background: 'linear-gradient(180deg, #0c1626, #070d18)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: well,
          height: well,
          background: 'radial-gradient(circle at 50% 32%, #122036, #050910 72%)',
          boxShadow: hue
            ? `inset 0 8px 16px rgba(0,0,0,0.65), inset 0 -1px 0 ${hue}40, 0 1px 0 #1e2c44`
            : 'inset 0 8px 16px rgba(0,0,0,0.65), 0 1px 0 #1e2c44',
        }}
      >
        <ChipPile chips={chips} size={tokenSize} />
      </div>
      {primary ? (
        <>
          <span className="text-center font-outfit text-caption leading-tight text-[#c8d2e0]">{primary.name}</span>
          <span className="text-center font-outfit text-2xs leading-snug text-[#66748c]">{primary.effect}</span>
        </>
      ) : (
        <span className="text-center font-outfit text-2xs leading-snug text-[#5b667d]">no chip on this slip</span>
      )}
    </div>
  );
}

/**
 * D — Score column + chip well. Huge score and scorers on the left; a
 * circular recess on the right holds the token, name, and one-line effect.
 * Narrow widths stack the well under the score.
 */
export function SpineWell({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  homeScorers,
  awayScorers,
  filedChips,
  isMobile,
}) {
  return (
    <div
      className={`flex px-7 ${isMobile ? 'flex-col items-center gap-5 py-5' : 'flex-row items-center justify-between gap-6 py-6'}`}
    >
      <div className={`flex min-w-0 flex-1 flex-col gap-3 ${isMobile ? 'w-full items-center' : ''}`}>
        <CaptionRail
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          crestSize={isMobile ? 22 : 26}
          compact
        />
        <div className="flex items-baseline justify-center gap-3 sm:justify-start">
          <span className={`font-dmSerif leading-[0.9] text-white ${isMobile ? 'text-5xl' : 'text-6xl'}`}>
            {homeScore}
          </span>
          <span className={`font-dmSerif leading-none text-[#4a5b78] ${isMobile ? 'text-2xl' : 'text-3xl'}`}>–</span>
          <span className={`font-dmSerif leading-[0.9] text-white ${isMobile ? 'text-5xl' : 'text-6xl'}`}>
            {awayScore}
          </span>
        </div>
        <div className={`grid grid-cols-2 gap-4 ${isMobile ? 'w-full' : 'max-w-sm'}`}>
          <div className="flex flex-col items-end gap-1.5">
            <ScorerList names={homeScorers} side="home" align="end" />
          </div>
          <div className="flex flex-col items-start gap-1.5">
            <ScorerList names={awayScorers} side="away" align="start" />
          </div>
        </div>
      </div>

      <ChipWell chips={filedChips} isMobile={isMobile} />
    </div>
  );
}
