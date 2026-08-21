import { useEffect, useState } from 'react';
import ChipToken from '../ui/ChipToken';
import KickerLabel from '../ui/KickerLabel';
import LoadingState from '../common/LoadingState';
import userPredictionsAPI from '../../services/api/userPredictionsAPI';
import { computeChipAlmanac } from '../../utils/profileStats';
import { CHIP_CONFIG } from '../../utils/chipManager';
import { CHIP_HUES, CHIP_TAGS, DEFAULT_CHIP_HUE } from './chipHues';

function bestWorstWeek(log) {
  if (!log.length) return { best: null, worst: null };
  const sorted = [...log].sort((a, b) => b.points - a.points);
  return { best: sorted[0], worst: sorted[sorted.length - 1] };
}

// Real rules this app actually enforces (chipValidation.js / chipManager.js),
// not the prototype's fictional combination limits — COMPATIBILITY_RULES.
// STRICT_MODE is off by default here, so chips can be freely combined; say
// so rather than inventing restrictions the backend doesn't apply.
function buildRules() {
  const rules = [
    'Defence++ only pays out on predictions where you called a clean sheet (0–X or X–0).',
    'A chip is only recorded once you file the prediction it applies to — planning one here is a personal reminder, not a reservation.',
  ];
  Object.values(CHIP_CONFIG).forEach((c) => {
    if (c.seasonLimit != null) rules.push(`${c.name} is capped at ${c.seasonLimit} uses for the season.`);
    if (c.cooldown > 0) rules.push(`${c.name} goes on a ${c.cooldown}-gameweek cooldown after use.`);
  });
  return rules;
}

export default function AlmanacTab() {
  const [predictions, setPredictions] = useState(null);

  useEffect(() => {
    let cancelled = false;
    userPredictionsAPI
      .getAllUserPredictions({ status: 'all' })
      .then((res) => !cancelled && setPredictions(res.data || []))
      .catch(() => !cancelled && setPredictions([]));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!predictions) return <LoadingState message="Loading chip history..." />;

  const almanac = computeChipAlmanac(predictions);
  const used = almanac.filter((c) => c.usageCount > 0);
  const auditTotal = almanac.reduce((sum, c) => sum + c.totalReturn, 0);
  const totalUses = almanac.reduce((sum, c) => sum + c.usageCount, 0);
  const rules = buildRules();

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

  return (
    <div className="flex flex-col gap-3">
      {used.length > 0 && (
        <div className="flex items-end gap-3 rounded-md border border-border-base bg-surface-card-2 px-4 py-[13px]">
          <span className="flex-1 font-dmSerif text-lg leading-snug text-text-primary [text-wrap:pretty]">{leadLine}</span>
          <span className={`font-dmSerif text-2xl leading-none ${auditTotal >= 0 ? 'text-brand-teal' : 'text-state-error'}`}>
            {auditTotal >= 0 ? '+' : ''}
            {auditTotal}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {almanac.map((chip) => {
          const hue = CHIP_HUES[chip.chipId] || DEFAULT_CHIP_HUE;
          const tag = CHIP_TAGS[chip.chipId] || chip.icon;
          const { best, worst } = bestWorstWeek(chip.log);
          return (
            <div key={chip.chipId} className="flex flex-col gap-[9px] rounded-md border border-border-card bg-surface-card p-[13px]">
              <div className="flex items-center gap-2.5">
                <ChipToken tag={tag} hue={hue} size={30} muted={chip.usageCount === 0} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-caption text-text-secondary">{chip.name}</p>
                  <KickerLabel as="p" className="normal-case tracking-normal text-text-muted-4">
                    {chip.usageCount} used this season
                  </KickerLabel>
                </div>
                {chip.usageCount > 0 && (
                  <span className={`font-dmSerif text-lg ${chip.totalReturn >= 0 ? 'text-brand-teal' : 'text-state-error'}`}>
                    {chip.totalReturn >= 0 ? '+' : ''}
                    {chip.totalReturn}
                  </span>
                )}
              </div>
              {(best || worst) && (
                <div className="flex flex-col gap-1 border-t border-border-base pt-[9px] text-2xs text-text-muted-2">
                  {best && (
                    <span>
                      Best: GW{best.gameweek} · {best.points >= 0 ? '+' : ''}
                      {best.points}
                    </span>
                  )}
                  {worst && worst !== best && (
                    <span className="text-text-muted-3">
                      Worst: GW{worst.gameweek} · {worst.points >= 0 ? '+' : ''}
                      {worst.points}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {used.length > 0 && (
        <div className="flex flex-col gap-2 rounded-md border border-border-base bg-surface-header/60 p-[14px]">
          <KickerLabel>What the record says</KickerLabel>
          <p className="text-caption leading-relaxed text-text-muted-2 [text-wrap:pretty]">
            {totalUses} chip{totalUses === 1 ? '' : 's'} played this season, {auditTotal >= 0 ? '+' : ''}
            {auditTotal} points above what those predictions would have scored unboosted.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {Object.values(CHIP_CONFIG).map((c) => (
          <div key={c.id} className="flex flex-col gap-[7px] rounded-md border border-border-card bg-surface-card p-[13px]">
            <div className="flex items-center gap-2">
              <ChipToken tag={CHIP_TAGS[c.id] || c.icon} hue={CHIP_HUES[c.id] || DEFAULT_CHIP_HUE} size={26} />
              <span className="flex-1 text-caption text-text-secondary">{c.name}</span>
              <span className="font-mono text-3xs tracking-[0.1em] text-text-muted-4">{c.scope === 'match' ? 'MATCH' : 'WEEK'}</span>
            </div>
            <span className="text-xs leading-relaxed text-text-muted-2 [text-wrap:pretty]">{c.description}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 rounded-md border border-border-base bg-surface-header/60 p-[14px]">
        <KickerLabel>The rules</KickerLabel>
        {rules.map((r, i) => (
          <span key={i} className="flex gap-2 text-xs leading-relaxed text-text-muted-2">
            <span className="shrink-0 font-mono text-2xs text-text-muted-4">{i + 1}.</span>
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}
