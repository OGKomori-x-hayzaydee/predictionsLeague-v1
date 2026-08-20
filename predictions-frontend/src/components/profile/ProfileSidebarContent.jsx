import KickerLabel from '../ui/KickerLabel';

const CHIP_TAGS = {
  doubleDown: '×2',
  wildcard: '×3',
  scorerFocus: 'S+',
  defensePlusPlus: 'D+',
  allInWeek: 'AI',
};

/**
 * Shared content for the desktop right rail (ProfileSidebar) and the mobile
 * inline card — Spine.dc.html desktop lines 1635-1645 ("CHIP RETURN,
 * CAREER"). The prototype's right rail also carries a Leagues list, a
 * Honours mini-widget and "Career Markers" timeline, but those all need
 * data this app doesn't have yet (league standings history, an honours
 * system, freeform milestone events) — see HonoursTab's deferral note.
 * Fabricating them would violate the "no fake history" rule, so this rail
 * only ships the one section that's genuinely computable from the user's
 * real prediction history (utils/profileStats.js#computeChipAlmanac).
 */
export default function ProfileSidebarContent({ chipAlmanac = [] }) {
  const used = chipAlmanac.filter((c) => c.usageCount > 0);

  return (
    <div className="flex flex-col gap-2.5">
      <KickerLabel className="tracking-[0.16em]">Chip return, career</KickerLabel>
      {used.length === 0 ? (
        <p className="text-[12px] text-text-muted-3">No chips played yet this season.</p>
      ) : (
        used.map((c) => (
          <span key={c.chipId} className="flex items-center gap-2.5">
            <span className="w-5 shrink-0 font-mono text-[10px] text-text-muted-1">{CHIP_TAGS[c.chipId] || c.icon}</span>
            <span className="flex-1 truncate text-[12.5px] text-text-tertiary">{c.name}</span>
            <span className="shrink-0 font-mono text-[10px] text-text-muted-2">{c.usageCount} used</span>
            <span
              className="w-[40px] shrink-0 text-right font-mono text-[11.5px]"
              style={{ color: c.totalReturn >= 0 ? 'var(--brand-teal)' : 'var(--state-error)' }}
            >
              {c.totalReturn >= 0 ? `+${c.totalReturn}` : c.totalReturn}
            </span>
          </span>
        ))
      )}
    </div>
  );
}
