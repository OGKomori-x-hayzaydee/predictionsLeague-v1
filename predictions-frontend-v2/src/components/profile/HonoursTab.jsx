import Card from '../ui/Card';
import KickerLabel from '../ui/KickerLabel';

/**
 * Honours/achievements deferred per plan §4/§5 — no backend rules exist yet
 * (no table, no endpoint, no defined thresholds). Shown as a locked
 * "Coming soon" state rather than omitted or faked.
 */
export default function HonoursTab() {
  return (
    <Card className="flex flex-col items-center gap-2 border-dashed p-12 text-center">
      <span className="text-3xl">🔒</span>
      <KickerLabel as="div">Coming soon</KickerLabel>
      <p className="max-w-xs text-sm text-text-muted-1">
        Achievements and badges are on the way — we&apos;re still defining what earns one.
      </p>
    </Card>
  );
}
