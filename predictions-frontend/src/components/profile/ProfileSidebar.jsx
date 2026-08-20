import ProfileSidebarContent from './ProfileSidebarContent';

/**
 * Desktop-only right rail (foundation spec §5.3, `1fr 330px` grid) —
 * Spine.dc.html desktop lines 1618-1681. On mobile the same content renders
 * inline below the tab content instead (matches Record's Sidebar/sheet
 * split, without the extra bottom-sheet machinery since this rail is a
 * single short section).
 */
export default function ProfileSidebar(props) {
  return (
    <div className="hidden min-h-0 flex-col gap-[18px] overflow-y-auto border-l border-border-hairline bg-surface-bar px-5 py-[22px] md:flex">
      <ProfileSidebarContent {...props} />
    </div>
  );
}
