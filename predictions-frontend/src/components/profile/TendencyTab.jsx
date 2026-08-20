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

/**
 * Spine.dc.html desktop lines 1543-1566 ("YOUR HABITS, MEASURED AGAINST
 * WHAT ACTUALLY HAPPENS") renders a fabricated "you vs reality" bar-chart
 * per habit (call rate vs actual result rate) built from mock PF_YOU/PF_REAL
 * arrays that don't correspond to any real data source in this app.
 * utils/performanceInsights.js — a genuinely working analysis utility that
 * was previously wired with a hardcoded `[]` — computes a different but
 * equally real shape (ranked insight cards: title/value/description) from
 * the user's actual settled predictions. This tab is built around that real
 * output rather than reproducing the prototype's specific bar/line widget,
 * which this app has no honest data to drive.
 */
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
      <KickerLabel as="div" className="tracking-[0.13em]">Patterns in your prediction history</KickerLabel>
      {insights.map((insight) => (
        <Card key={insight.id} className="p-5">
          <div className="flex items-center justify-between gap-3">
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
