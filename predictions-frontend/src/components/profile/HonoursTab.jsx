/**
 * Honours/achievements deferred per plan §4/§5 — no backend rules exist yet
 * (no table, no endpoint, no defined thresholds). Shown as a locked
 * "Coming soon" state rather than omitted or faked.
 *
 * Styled after the prototype's own "locked" honour-card treatment (Spine.dc.html
 * desktop lines 1594-1611, `state === "locked"` branch: muted badge, dimmed
 * title/border, no progress bar) rather than a generic empty-state card —
 * the prototype already defines what "locked" looks like for this exact
 * component, so this reuses that visual language at the tab level.
 */
export default function HonoursTab() {
  return (
    <div className="flex items-start gap-4 rounded-12 border border-border-hairline bg-surface-card-4/60 p-6">
      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-11 border border-border-card bg-transparent text-base text-text-muted-4">
        🔒
      </span>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline gap-2.5">
          <span className="font-dmSerif text-lg text-text-muted-1">Honours</span>
          <span className="font-mono text-[9.5px] tracking-[0.1em] text-text-muted-4">LOCKED</span>
        </div>
        <p className="max-w-sm text-[13px] leading-relaxed text-text-muted-2">
          Achievements and badges are on the way — we&apos;re still defining what earns one. Nothing here
          is faked in the meantime.
        </p>
      </div>
    </div>
  );
}
