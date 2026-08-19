import KickerLabel from '../ui/KickerLabel';
import Card from '../ui/Card';
import BarChart from '../charts/BarChart';
import PredictionRow from './PredictionRow';

export default function SeasonTab({ stats, predictions }) {
  const sorted = [...predictions].sort((a, b) => (b.gameweek ?? 0) - (a.gameweek ?? 0));

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <KickerLabel as="div" className="mb-3">Points by gameweek</KickerLabel>
        <BarChart
          data={stats.pointsByGameweek.map((p) => p.points)}
          labels={stats.pointsByGameweek.map((p) => p.gameweek)}
        />
      </Card>

      <div>
        <KickerLabel as="div" className="mb-3">All predictions</KickerLabel>
        <div className="space-y-2">
          {sorted.length === 0 && (
            <p className="text-sm text-text-muted-2">No predictions filed yet this season.</p>
          )}
          {sorted.map((p) => (
            <PredictionRow key={p.id || p.matchId} prediction={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
