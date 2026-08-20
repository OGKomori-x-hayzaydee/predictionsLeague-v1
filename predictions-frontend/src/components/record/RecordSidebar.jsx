import RecordSidebarContent from './RecordSidebarContent';

/**
 * Desktop-only right rail (foundation spec §5.3, `1fr 320px` grid) —
 * Spine.dc.html desktop lines 1031-1075. On mobile the same content renders
 * inside RecordMobileSheet instead, since the mobile shell has no
 * equivalent right-rail chrome (matches Dashboard's Sidebar/MobileSheet
 * split).
 */
export default function RecordSidebar(props) {
  return (
    <div className="hidden min-h-0 flex-col gap-[18px] overflow-y-auto border-l border-border-hairline bg-surface-bar px-5 py-[22px] md:flex">
      <RecordSidebarContent {...props} />
    </div>
  );
}
