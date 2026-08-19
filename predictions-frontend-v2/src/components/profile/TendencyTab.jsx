import { generatePerformanceInsights } from '../../utils/performanceInsights';
import Card from '../ui/Card';
import KickerLabel from '../ui/KickerLabel';

const COLOR_MAP = {
  green: 'var(--brand-teal)',
  blue: 'var(--brand-indigo)',
  amber: 'var(--brand-amber)',
  purple: 'var(--brand-indigo-mid)',
  red: 'var(--state-error)',
};

export default function TendencyTab({ predictions }) {
  const insights = generatePerformanceInsights(predictions, {});

  if (predictions.length < 15) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-text-muted-1">
          Tendency analysis unlocks after 15 settled predictions — you have {predictions.length} so far.
        </p>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-text-muted-1">No strong tendencies detected yet — keep filing predictions.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <Card key={insight.id} className="p-5">
          <div className="flex items-center justify-between">
            <KickerLabel as="div">{insight.type}</KickerLabel>
            <span className="font-dmSerif text-lg" style={{ color: COLOR_MAP[insight.color] || 'var(--brand-teal)' }}>
              {insight.value}
            </span>
          </div>
          <h3 className="mt-1 font-dmSerif text-lg text-text-primary">{insight.title}</h3>
          <p className="mt-1 text-sm text-text-muted-1">{insight.description}</p>
        </Card>
      ))}
    </div>
  );
}
