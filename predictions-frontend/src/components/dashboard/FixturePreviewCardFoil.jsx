import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamCrest from '../ui/TeamCrest';
import ChipPile from './ChipPile';
import Button from '../ui/buttons/Button';
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

function ScorerPills({ names }) {
  return (
    <div className="flex min-h-12 w-full flex-wrap content-center justify-center gap-1.5">
      {names.length > 0 ? (
        names.map((name) => (
          <span
            key={name}
            className="flex items-center gap-2 rounded-full border border-border-card bg-surface-elevated px-3 py-1 text-xs text-text-secondary"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full border-[1.5px] border-brand-teal" />
            {name}
          </span>
        ))
      ) : (
        <span className="font-outfit text-xs text-text-disabled">no scorer named</span>
      )}
    </div>
  );
}

function ChipStampTooltip({ chips, visible }) {
  if (!chips.length) return null;
  return (
    <div
      className={`pointer-events-none absolute left-full top-1/2 z-20 ml-2 w-max max-w-[220px] -translate-y-1/2 rounded-md border border-border-card bg-surface-elevated px-3 py-2 shadow-dropdown transition-opacity duration-150 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <ul className="flex flex-col gap-1.5">
        {chips.map((chip) => (
          <li key={chip.id} className="flex flex-col">
            <span className="font-outfit text-xs font-semibold tracking-[0.06em]" style={{ color: chip.hue }}>
              {chip.name}
            </span>
            <span className="font-outfit text-xs text-text-muted">{chip.effect}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FixturePreviewCardFoil({
  fixture,
  ceiling,
  variant = 'desktop',
  deadlineLabel,
  tableMax,
}) {
  const navigate = useNavigate();
  const isMobile = variant === 'mobile';
  const [chipHover, setChipHover] = useState(false);
  const [chipTap, setChipTap] = useState(false);

  if (!fixture) {
    return (
      <div className="mx-auto w-full max-w-[820px] rounded-lg border border-border-card bg-surface-card p-6 text-center font-outfit text-sm text-text-muted">
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
  const crestSize = isMobile ? 50 : 64;
  const stampSize = isMobile ? 46 : 60;
  const showChipNames = chipHover || chipTap;

  return (
    <div className="relative mx-auto w-full max-w-[820px] pt-3.5 pr-3.5">
      <div className="relative overflow-visible rounded-lg border border-border-card bg-surface-card animate-[cardShimmer_0.9s_ease-out_1]">
        <div className="flex flex-col items-center gap-1 border-b border-dashed border-border-hairline px-6 pb-2.5 pt-3 text-center">
          <span className="font-outfit text-xs uppercase tracking-[0.14em] text-brand-teal">
            {formatSlot(date) || `${homeTeam} v ${awayTeam}`}
          </span>
          <span className="font-outfit text-xs text-text-muted">
            {[venue, formatKickoff(date)].filter(Boolean).join(' · ')}
          </span>
        </div>

        {predicted ? (
          <div
            className={`grid items-start gap-5 px-6 py-5 ${
              isMobile ? 'grid-cols-1 justify-items-center' : 'grid-cols-[1fr_auto_1fr]'
            }`}
          >
            <div className="flex w-full flex-col items-center gap-2.5">
              <TeamCrest team={homeTeam} size={crestSize} />
              <span className="font-dmSerif text-2xl leading-tight text-text-primary">{homeTeam}</span>
              <ScorerPills names={homeScorers} />
            </div>

            <div className="flex flex-col items-center gap-1 self-center rounded-md border border-border-card bg-surface-elevated px-8 py-3">
              <div className="flex items-center gap-3">
                <span className="font-dmSerif text-6xl leading-[0.9] text-text-primary lg:text-7xl">{prediction.homeScore}</span>
                <span className="font-dmSerif text-3xl leading-none text-text-disabled">–</span>
                <span className="font-dmSerif text-6xl leading-[0.9] text-text-primary lg:text-7xl">{prediction.awayScore}</span>
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-2.5">
              <TeamCrest team={awayTeam} size={crestSize} />
              <span className="font-dmSerif text-2xl leading-tight text-text-primary">{awayTeam}</span>
              <ScorerPills names={awayScorers} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-6 py-6 text-center">
            <span className="font-dmSerif text-3xl leading-tight text-text-primary">
              Nothing filed on {homeTeam} v {awayTeam}
            </span>
            <span className="max-w-[38em] font-outfit text-sm text-text-muted">
              {deadlineLabel
                ? `File a scoreline before the deadline (${deadlineLabel}) to put points on it.`
                : 'File a scoreline before the deadline to put points on it.'}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-border-card px-6 py-3">
          <div className="flex gap-6">
            <div className="flex flex-col leading-none">
              <span className="font-outfit text-xs uppercase tracking-[0.14em] text-text-muted">Ceiling</span>
              <span className="font-dmSerif text-lg text-brand-amber">
                {predicted ? `${ceiling} pts` : '—'}
              </span>
            </div>
            {tableMax != null && (
              <div className="flex flex-col leading-none">
                <span className="font-outfit text-xs uppercase tracking-[0.14em] text-text-muted">Max on table</span>
                <span className="font-dmSerif text-lg text-text-secondary">{tableMax} pts</span>
              </div>
            )}
          </div>
          <Button size="md" onClick={() => navigate('/fixtures')}>
            {isFinishedMatch(fixture.status)
              ? 'View in reel'
              : predicted
                ? 'Edit in reel'
                : 'File in reel'}
          </Button>
        </div>
      </div>

      <div
        className="absolute top-0 right-0 p-2"
        onMouseEnter={() => setChipHover(true)}
        onMouseLeave={() => setChipHover(false)}
        onClick={() => setChipTap((v) => !v)}
      >
        <ChipStampTooltip chips={filedChips} visible={showChipNames} />
        <div className="animate-[stampIn_0.42s_ease-out_both]" style={{ transform: 'rotate(8deg)' }}>
          <ChipPile chips={filedChips} size={stampSize} />
        </div>
      </div>
    </div>
  );
}
