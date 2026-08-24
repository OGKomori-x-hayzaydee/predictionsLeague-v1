import { useMemo, useState } from 'react';
import ChipToken from '../ui/ChipToken';
import KickerLabel from '../ui/KickerLabel';
import LoadingState from '../common/LoadingState';
import { computeChipAlmanac } from '../../utils/profileStats';
import { CHIP_CONFIG } from '../../utils/chipManager';
import { hasSeasonCap } from '../../utils/chipStatus';
import { CHIP_HUES, CHIP_TAGS, DEFAULT_CHIP_HUE } from './chipHues';
import {
  CHIP_ALMANAC_COPY,
  CHIP_ALMANAC_RULES,
} from './chipsDemoData';

const CHIP_ORDER = Object.keys(CHIP_CONFIG);

function signed(n) {
  if (n > 0) return `+${n}`;
  if (n < 0) return `\u2212${Math.abs(n)}`;
  return '0';
}

function weekMark(entry) {
  if (!entry) return '—';
  return `GW${entry.gameweek} · ${signed(entry.points)}`;
}

function bestWorstWeek(log) {
  if (!log.length) return { best: null, worst: null };
  const sorted = [...log].sort((a, b) => b.points - a.points);
  return { best: sorted[0], worst: sorted[sorted.length - 1] };
}

function usedLabel(chip) {
  if (hasSeasonCap(chip)) return `${chip.usageCount} of ${chip.seasonLimit}`;
  return `${chip.usageCount} used`;
}

function constraintLabel(chipId) {
  const config = CHIP_CONFIG[chipId];
  if (!config) return '';
  const parts = [];
  if (config.cooldown > 0) {
    parts.push(`${config.cooldown} GW cooldown`);
  } else {
    parts.push('No cooldown');
  }
  if (config.seasonLimit) {
    parts.push(`${config.seasonLimit} per season`);
  } else {
    parts.push('no season cap');
  }
  return parts.join(' · ');
}

function buildHabits(rows, auditTotal, totalUses) {
  if (totalUses === 0) return '';
  const used = rows.filter((c) => c.usageCount > 0);
  const ranked = [...used].sort((a, b) => b.totalReturn - a.totalReturn);
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];
  const head = `${totalUses} chip${totalUses === 1 ? '' : 's'} played, ${signed(auditTotal)} points above baseline`;
  if (!best) return `${head}.`;
  if (worst && worst.chipId !== best.chipId && worst.totalReturn < 0) {
    return `${head} — but the spread is lopsided. ${best.name} has returned ${signed(best.totalReturn)} from ${best.usageCount} use${best.usageCount === 1 ? '' : 's'}. ${worst.name} is the only negative: ${worst.usageCount} use${worst.usageCount === 1 ? '' : 's'} and a net ${signed(worst.totalReturn)}.`;
  }
  return `${head}. ${best.name} has returned ${signed(best.totalReturn)} from ${best.usageCount} use${best.usageCount === 1 ? '' : 's'}.`;
}

function DebriefRow({ chip, focused, onFocus }) {
  const hue = CHIP_HUES[chip.chipId] || DEFAULT_CHIP_HUE;
  const tag = CHIP_TAGS[chip.chipId] || chip.icon;
  const netFg = chip.usageCount === 0
    ? 'var(--text-muted-4)'
    : chip.totalReturn >= 0
      ? 'var(--brand-teal)'
      : 'var(--state-error)';

  return (
    <button
      type="button"
      onClick={onFocus}
      className="grid w-full grid-cols-[1.4fr_74px_1fr_1fr_68px] items-center gap-3 border-b border-border-hairline py-2.5 text-left transition-colors"
      style={{ background: focused ? 'color-mix(in srgb, var(--brand-teal) 8%, transparent)' : 'transparent' }}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <ChipToken tag={tag} hue={hue} size={26} muted={chip.usageCount === 0} />
        <span className="truncate text-sm text-text-secondary">{chip.name}</span>
      </span>
      <span className="font-outfit text-2xs text-text-muted-1">{chip.used}</span>
      <span className="font-outfit text-2xs text-text-muted-2">{chip.bestLabel}</span>
      <span className="font-outfit text-2xs text-text-muted-2">{chip.worstLabel}</span>
      <span className="text-right font-dmSerif text-xl leading-none" style={{ color: netFg }}>
        {chip.usageCount ? signed(chip.totalReturn) : '—'}
      </span>
    </button>
  );
}

function MobileDebriefCard({ chip, focused, onFocus }) {
  const hue = CHIP_HUES[chip.chipId] || DEFAULT_CHIP_HUE;
  const tag = CHIP_TAGS[chip.chipId] || chip.icon;
  const netFg = chip.usageCount === 0
    ? 'var(--text-muted-4)'
    : chip.totalReturn >= 0
      ? 'var(--brand-teal)'
      : 'var(--state-error)';

  return (
    <button
      type="button"
      onClick={onFocus}
      className="flex flex-col gap-[9px] rounded-14 border p-[13px] text-left"
      style={{
        background: focused ? 'color-mix(in srgb, var(--brand-teal) 8%, var(--surface-card))' : 'var(--surface-card)',
        borderColor: focused ? 'color-mix(in srgb, var(--brand-teal-mid) 45%, var(--border-card))' : 'var(--border-card)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <ChipToken tag={tag} hue={hue} size={28} muted={chip.usageCount === 0} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-caption text-text-secondary">{chip.name}</span>
          <span className="font-outfit text-3xs text-text-muted-4">{chip.used}</span>
        </div>
        <span className="font-dmSerif text-xl leading-none" style={{ color: netFg }}>
          {chip.usageCount ? signed(chip.totalReturn) : '—'}
        </span>
      </div>
      {chip.usageCount > 0 && (
        <div className="flex flex-col gap-1 border-t border-border-card pt-[9px] text-2xs">
          <span className="text-text-muted-1">Best {chip.bestLabel}</span>
          <span className="text-text-muted-3">Worst {chip.worstLabel}</span>
        </div>
      )}
    </button>
  );
}

function ExplainCard({ chip, focused }) {
  const hue = CHIP_HUES[chip.chipId] || DEFAULT_CHIP_HUE;
  const tag = CHIP_TAGS[chip.chipId] || chip.icon;
  const copy = CHIP_ALMANAC_COPY[chip.chipId] || {};
  return (
    <div
      className="flex flex-none flex-col gap-1.5 rounded-11 border p-3.5"
      style={{
        background: focused ? 'color-mix(in srgb, var(--brand-teal) 8%, var(--surface-card))' : 'var(--surface-card)',
        borderColor: focused ? 'var(--brand-teal)' : 'var(--border-card)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <ChipToken tag={tag} hue={hue} size={30} />
        <span className="flex-1 font-dmSerif text-lg text-text-primary">{chip.name}</span>
        <span className="font-outfit text-3xs tracking-[0.1em] text-text-muted-4">
          {chip.scope === 'match' ? 'MATCH' : 'WEEK'}
        </span>
      </div>
      <span className="font-outfit text-3xs tracking-[0.08em] text-text-muted-4">
        {constraintLabel(chip.chipId)}
      </span>
      <span className="text-caption leading-relaxed text-text-muted-2 [text-wrap:pretty]">{copy.explain}</span>
      <span className="text-xs leading-relaxed text-text-muted-3 italic [text-wrap:pretty]">{copy.forWhat}</span>
    </div>
  );
}

/**
 * Almanac / debrief — Spine.dc.html desktop lines 1289-1356 (`CH.isAlm`),
 * mobile lines 2979-3032. Table, habit copy and net are computed from real
 * (or preview) settled predictions via computeChipAlmanac. CHIP BY CHIP
 * blurbs and the numbered rules are the prototype's copy. Clicking a
 * debrief row focuses the matching explain card (`chFocus`).
 */
export default function AlmanacTab({ predictions, previewMode: _previewMode = false, onBackToPlan, loading = false }) {
  const [focusId, setFocusId] = useState('doubleDown');

  const rows = useMemo(() => {
    const almanac = computeChipAlmanac(predictions)
      .slice()
      .sort((a, b) => CHIP_ORDER.indexOf(a.chipId) - CHIP_ORDER.indexOf(b.chipId));

    return almanac.map((chip) => {
      const { best, worst } = bestWorstWeek(chip.log);
      return {
        ...chip,
        used: usedLabel(chip),
        bestLabel: chip.usageCount ? weekMark(best) : '—',
        worstLabel: chip.usageCount === 0 ? '—' : chip.usageCount === 1 ? 'unplayed since' : weekMark(worst),
      };
    });
  }, [predictions]);

  const used = rows.filter((c) => c.usageCount > 0);
  const auditTotal = rows.reduce((sum, c) => sum + c.totalReturn, 0);
  const totalUses = rows.reduce((sum, c) => sum + c.usageCount, 0);
  const ranked = [...used].sort((a, b) => b.totalReturn - a.totalReturn);
  const bestChip = ranked[0];
  const worstChip = ranked[ranked.length - 1];
  const leadLine =
    used.length === 0
      ? 'No chips used yet this season — your audit fills in once you file a prediction with one attached.'
      : bestChip && worstChip && bestChip.chipId !== worstChip.chipId && worstChip.totalReturn < 0
        ? `${bestChip.name} carries your season. ${worstChip.name} has cost you.`
        : bestChip
          ? `${bestChip.name} is carrying your season so far.`
          : '';
  const habits = buildHabits(rows, auditTotal, totalUses);

  if (loading) return <LoadingState message="Loading chip history..." />;

  return (
    <>
      {/* Desktop — Spine.dc.html 1289-1356 */}
      <div className="hidden min-h-0 md:grid md:h-full md:grid-cols-[1fr_340px]">
        <div className="flex min-h-0 min-w-0 flex-col gap-[15px] overflow-y-auto px-[26px] py-[22px]">
          <div className="flex items-end justify-between gap-5">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <KickerLabel className="text-brand-teal">The debrief · chips already spent</KickerLabel>
              <h2 className="font-dmSerif text-[28px] leading-[1.14] text-text-primary [text-wrap:pretty]">{leadLine}</h2>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <KickerLabel>Net, season to date</KickerLabel>
              <span className={`font-dmSerif text-[31px] leading-none ${auditTotal >= 0 ? 'text-brand-teal' : 'text-state-error'}`}>
                {signed(auditTotal)}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="grid grid-cols-[1.4fr_74px_1fr_1fr_68px] gap-3 border-y border-border-card py-1.5 font-outfit text-2xs tracking-[0.12em] text-text-muted-3">
              <span>CHIP</span>
              <span>USED</span>
              <span>BEST WEEK</span>
              <span>WORST WEEK</span>
              <span className="text-right">NET</span>
            </div>
            {rows.map((chip) => (
              <DebriefRow
                key={chip.chipId}
                chip={chip}
                focused={focusId === chip.chipId}
                onFocus={() => setFocusId(chip.chipId)}
              />
            ))}
          </div>

          {used.length > 0 && (
            <div className="flex flex-col gap-2 rounded-12 border border-border-card bg-surface-card-3 px-[17px] py-[15px]">
              <KickerLabel>What the record says</KickerLabel>
              <p className="text-caption leading-relaxed text-text-muted-2 [text-wrap:pretty]">{habits}</p>
            </div>
          )}

          <div className="flex min-h-0 flex-1 flex-col gap-[9px]">
            <KickerLabel>The rules, plainly</KickerLabel>
            <div className="flex flex-col gap-[7px]">
              {CHIP_ALMANAC_RULES.map((text, i) => (
                <div key={text} className="flex items-baseline gap-2.5">
                  <span className="w-4 shrink-0 font-outfit text-2xs text-text-muted-5">{i + 1}.</span>
                  <span className="flex-1 text-caption leading-relaxed text-text-muted-2">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-3.5 overflow-hidden border-l border-border-hairline bg-surface-bar px-5 py-[22px]">
          <KickerLabel className="tracking-[0.16em]">Chip by chip</KickerLabel>
          <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
            {rows.map((chip) => (
              <ExplainCard key={chip.chipId} chip={chip} focused={focusId === chip.chipId} />
            ))}
          </div>
          {onBackToPlan && (
            <button
              type="button"
              onClick={onBackToPlan}
              className="flex-none rounded-[10px] border border-brand-teal-mid/40 bg-[color-mix(in_srgb,var(--brand-teal-deep)_15%,transparent)] py-3 text-center text-caption text-brand-teal"
            >
              Back to the plan
            </button>
          )}
        </div>
      </div>

      {/* Mobile — Spine.dc.html 2979-3032 */}
      <div className="flex flex-col gap-[13px] px-4 pb-6 pt-4 md:hidden">
        <div className="flex items-end gap-3 rounded-14 border border-border-card bg-surface-card-2 px-[15px] py-3.5">
          <span className="flex-1 font-dmSerif text-lg leading-snug text-text-primary [text-wrap:pretty]">{leadLine}</span>
          <span className={`font-dmSerif text-2xl leading-none ${auditTotal >= 0 ? 'text-brand-teal' : 'text-state-error'}`}>
            {signed(auditTotal)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {rows.map((chip) => (
            <MobileDebriefCard
              key={chip.chipId}
              chip={chip}
              focused={focusId === chip.chipId}
              onFocus={() => setFocusId(chip.chipId)}
            />
          ))}
        </div>

        {used.length > 0 && (
          <div className="flex flex-col gap-2 rounded-14 border border-border-card bg-surface-header/60 p-3.5">
            <KickerLabel>What the record says</KickerLabel>
            <p className="text-caption leading-relaxed text-text-muted-2 [text-wrap:pretty]">{habits}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {rows.map((chip) => (
            <ExplainCard key={chip.chipId} chip={chip} focused={focusId === chip.chipId} />
          ))}
        </div>

        <div className="flex flex-col gap-[9px] rounded-14 border border-border-card bg-surface-header/60 p-3.5">
          <KickerLabel>The rules</KickerLabel>
          {CHIP_ALMANAC_RULES.map((text, i) => (
            <span key={text} className="flex gap-2 text-xs leading-relaxed text-text-muted-2">
              <span className="shrink-0 font-outfit text-2xs text-text-muted-5">{i + 1}.</span>
              {text}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
