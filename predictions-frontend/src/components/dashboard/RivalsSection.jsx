import KickerLabel from '../ui/KickerLabel';

/**
 * The prototype's "RIVALS · OWLS & OTHERS" panel is a leaderboard of other
 * players' season points relative to yours — but even in the prototype
 * itself those names/points are hardcoded fixtures, not real data, and the
 * backend has no rivals-comparison endpoint (no per-league leaderboard of
 * other members' points, only the current user's own position via
 * /dashboard/leagues/user). Rather than fabricate rival names and scores,
 * this renders an honest "coming soon" state — the surrounding layout slot
 * still exists so this reads as a real, complete screen with one deferred
 * panel, not a missing one.
 */
export default function RivalsSection() {
  return (
    <div className="flex flex-col gap-[11px]">
      <KickerLabel as="div" className="tracking-[0.16em] text-text-muted-3">
        Rivals
      </KickerLabel>
      <p className="text-xs leading-relaxed text-text-muted-2">
        Head-to-head standings against the rest of your leagues are arriving soon — check back once
        league leaderboards are wired in.
      </p>
    </div>
  );
}
