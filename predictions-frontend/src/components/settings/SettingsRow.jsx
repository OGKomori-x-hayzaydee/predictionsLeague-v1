/**
 * Settings "info row" — Spine.dc.html buildSettings() `tog()`/`val()` row recipe
 * (template lines 1414-1433 desktop, 3242-3264 mobile). One component covers
 * both breakpoints via responsive classes rather than a `variant` prop, since
 * the only differences are radius/padding/gap, not structure.
 *
 * kind: 'toggle' (switch) or 'value' (static mono value, optionally
 * clickable with a trailing chevron on mobile — e.g. "Delete account").
 * size: 'md' (default, used by league manage) or 'lg' (settings page).
 */
export default function SettingsRow({
  label,
  detail,
  danger = false,
  kind,
  value,
  checked,
  onToggle,
  onClick,
  size = 'md',
}) {
  const clickable = kind === 'value' && !!onClick;
  const Wrapper = clickable ? 'button' : 'div';
  const large = size === 'lg';

  return (
    <Wrapper
      onClick={onClick}
      type={clickable ? 'button' : undefined}
      className={`flex w-full items-center text-left ${
        large
          ? 'min-h-[4.75rem] gap-4 rounded-[16px] border border-border-base bg-surface-card-3 px-5 py-[18px] md:min-h-0 md:gap-5 md:rounded-14 md:bg-surface-header/60 md:px-6 md:py-5'
          : 'min-h-16 gap-3 rounded-14 border border-border-base bg-surface-card-3 px-[13px] py-[13px] md:min-h-0 md:gap-[14px] md:rounded-12 md:bg-surface-header/60 md:px-[17px] md:py-[15px]'
      } ${clickable ? 'cursor-pointer transition-colors hover:border-border-control' : ''}`}
    >
      <span className={`flex min-w-0 flex-1 flex-col leading-[1.45] ${large ? 'gap-1 md:gap-0.5' : 'gap-[3px] md:gap-0'}`}>
        <span
          className={`${large ? 'text-base' : 'text-caption'} ${danger ? 'text-state-error-mid' : 'text-text-secondary'}`}
        >
          {label}
        </span>
        {detail && (
          <span
            className={`leading-[1.45] [text-wrap:pretty] ${
              large ? 'text-sm text-text-muted-3 md:text-text-muted-1' : 'text-2xs text-text-muted-3 md:text-xs md:text-text-muted-1'
            }`}
          >
            {detail}
          </span>
        )}
      </span>

      {kind === 'toggle' && (
        <span
          role="switch"
          aria-checked={checked}
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.(!checked);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onToggle?.(!checked);
            }
          }}
          className={`flex shrink-0 cursor-pointer items-center rounded-full border p-0.5 transition-colors ${
            large ? 'h-8 w-[52px] md:h-7 md:w-12' : 'h-7 w-[46px] md:h-6 md:w-11'
          } ${
            checked ? 'justify-end border-brand-teal-mid bg-brand-teal-deep' : 'justify-start border-border-dropdown bg-surface-card-4'
          }`}
        >
          <span
            className={`rounded-full transition-colors ${
              large ? 'h-6 w-6 md:h-5 md:w-5' : 'h-[22px] w-[22px] md:h-[18px] md:w-[18px]'
            } ${checked ? 'bg-brand-teal-tint' : 'bg-border-control'}`}
          />
        </span>
      )}

      {kind === 'value' && (
        <span className={`flex shrink-0 items-center ${large ? 'gap-2.5' : 'gap-[7px]'}`}>
          <span className={`font-mono text-text-muted-1 ${large ? 'text-sm' : 'text-xs'}`}>{value}</span>
          {clickable && (
            <span className={`font-mono text-text-muted-4 md:hidden ${large ? 'text-sm' : 'text-xs'}`}>&rsaquo;</span>
          )}
        </span>
      )}
    </Wrapper>
  );
}
