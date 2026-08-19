import { useEffect, useState } from 'react';
import Card from '../ui/Card';
import KickerLabel from '../ui/KickerLabel';
import TokenBadge from '../ui/TokenBadge';
import LoadingState from '../common/LoadingState';
import userPredictionsAPI from '../../services/api/userPredictionsAPI';
import { computeChipAlmanac } from '../../utils/profileStats';

const COLOR_VARS = {
  teal: 'var(--brand-teal)',
  purple: 'var(--brand-indigo)',
  green: 'var(--brand-teal-deep)',
  amber: 'var(--brand-amber)',
};

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

  return (
    <div className="space-y-3">
      {almanac.map((chip) => (
        <Card key={chip.chipId} className="p-4">
          <div className="flex items-center gap-3">
            <TokenBadge label={chip.icon} color={COLOR_VARS[chip.color] || 'var(--brand-teal)'} size={36} />
            <div className="flex-1">
              <p className="text-sm text-text-primary">{chip.name}</p>
              <KickerLabel as="p">{chip.usageCount} used this season</KickerLabel>
            </div>
            <span className={`font-dmSerif text-lg ${chip.totalReturn >= 0 ? 'text-brand-teal' : 'text-state-error'}`}>
              {chip.totalReturn >= 0 ? '+' : ''}
              {chip.totalReturn}
            </span>
          </div>
          {chip.log.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 border-t border-border-base pt-3">
              {chip.log.map((entry, i) => (
                <span key={i} className="font-mono text-[10px] text-text-muted-2">
                  GW{entry.gameweek} · {entry.points >= 0 ? '+' : ''}{entry.points}
                </span>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
