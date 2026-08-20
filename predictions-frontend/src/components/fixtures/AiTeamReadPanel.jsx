/**
 * AI TEAM READ panel — the prototype's squad-availability / recent-form /
 * likely-scorer read has no real data source behind it yet (no injury
 * feed, no form/xG model), so rather than presenting invented numbers as
 * fact, this collapses to an honest "coming soon" placeholder until a real
 * feed exists. Keeps the same collapsible header shell as the rest of the
 * fixtures screen so the layout doesn't jump once real data lands here.
 */
export default function AiTeamReadPanel({ open, onToggle }) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border border-[#1c2942] bg-[#080e1ab8]">
      {/* Header bar */}
      <div
        onClick={onToggle}
        className="flex cursor-pointer items-center gap-2.5 px-4 py-2.5 select-none"
      >
        <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-[#818cf8]" />
        <span className="font-mono text-xs uppercase tracking-widest text-[#66748c]">
          AI TEAM READ
        </span>
        <span className="ml-auto font-mono text-xs text-[#8496ad]">Coming soon</span>
        <span className="font-mono text-xs text-[#8496ad]">{open ? '▴' : '▾'}</span>
      </div>

      {open && (
        <div className="flex flex-col items-center gap-2 border-t border-[#16203a] px-6 py-7 text-center">
          <span className="font-dmSerif text-lg text-white">Squad reads are coming soon</span>
          <p
            className="m-0 max-w-sm font-outfit text-xs leading-relaxed text-[#8fa0b8]"
            style={{ textWrap: 'pretty' }}
          >
            Injury news, recent form and likely-scorer suggestions will land here once a live
            squad feed is plugged in. For now, back your own read.
          </p>
        </div>
      )}
    </div>
  );
}
