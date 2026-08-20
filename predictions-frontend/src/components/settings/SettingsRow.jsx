/**
 * Settings "info row" — Spine.dc.html buildSettings() `tog()`/`val()` row recipe
 * (template lines 1414-1433 desktop, 3242-3264 mobile). One component covers
 * both breakpoints via responsive classes rather than a `variant` prop, since
 * the only differences are radius/padding/gap, not structure.
 *
 * kind: 'toggle' (switch, mobile 46x28/knob22 -> desktop 44x24/knob18) or
 * 'value' (static mono value, optionally clickable with a trailing chevron
 * on mobile — e.g. "Delete account").
 */
export default function SettingsRow({ label, detail, danger = false, kind, value, checked, onToggle, onClick }) {
  const clickable = kind === 'value' && !!onClick;
  const Wrapper = clickable ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      type={clickable ? 'button' : undefined}
      className={`flex min-h-16 w-full items-center gap-3 rounded-14 border border-border-base bg-surface-card-3 px-[13px] py-[13px] text-left md:min-h-0 md:gap-[14px] md:rounded-12 md:bg-surface-header/60 md:px-[17px] md:py-[15px] ${
        clickable ? 'cursor-pointer transition-colors hover:border-border-control' : ''
      }`}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-[3px] leading-[1.45] md:gap-0">
        <span className={`text-[13px] md:text-[13.5px] ${danger ? 'text-state-error-mid' : 'text-text-secondary'}`}>
          {label}
        </span>
        {detail && (
          <span className="text-[11px] leading-[1.45] text-text-muted-3 [text-wrap:pretty] md:text-xs md:text-text-muted-1">
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
          className={`flex h-7 w-[46px] shrink-0 cursor-pointer items-center rounded-full border p-0.5 transition-colors md:h-6 md:w-11 ${
            checked ? 'justify-end border-brand-teal-mid bg-brand-teal-deep' : 'justify-start border-border-dropdown bg-surface-card-4'
          }`}
        >
          <span
            className={`h-[22px] w-[22px] rounded-full transition-colors md:h-[18px] md:w-[18px] ${
              checked ? 'bg-brand-teal-tint' : 'bg-border-control'
            }`}
          />
        </span>
      )}

      {kind === 'value' && (
        <span className="flex shrink-0 items-center gap-[7px]">
          <span className="font-mono text-xs text-text-muted-1">{value}</span>
          {clickable && <span className="font-mono text-xs text-text-muted-4 md:hidden">&rsaquo;</span>}
        </span>
      )}
    </Wrapper>
  );
}
