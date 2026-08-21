import KickerLabel from '../ui/KickerLabel';
import RadarChart from '../ui/RadarChart';

/**
 * Head-to-head TAPE/RADAR carousel — one card per league rival, both
 * variants driven by the same real per-member aggregate (utils/leagueStats.
 * buildHeadToHead). Desktop and mobile share this component; mobile just
 * gets smaller touch targets via responsive classes.
 */
export default function HeadToHeadCarousel({ rivals, vsIdx, setVsIdx, vsVariant, setVsVariant }) {
  if (!rivals || rivals.length === 0) {
    return (
      <div className="flex flex-col gap-[10px] rounded-16 border border-border-base bg-surface-card p-5">
        <KickerLabel>HEAD TO HEAD</KickerLabel>
        <p className="text-2xs leading-relaxed text-text-muted-2">
          Invite someone else into this league to see a head-to-head breakdown.
        </p>
      </div>
    );
  }

  const idx = Math.min(vsIdx, rivals.length - 1);
  const current = rivals[idx];
  const canPrev = idx > 0;
  const canNext = idx < rivals.length - 1;

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center justify-between gap-3">
        <KickerLabel>HEAD TO HEAD</KickerLabel>
        <div className="flex gap-[3px] rounded-9 border border-border-card bg-surface-card-4 p-[3px]">
          {['tape', 'radar'].map((v) => (
            <button
              key={v}
              onClick={() => setVsVariant(v)}
              className={`min-h-8 rounded-7 px-[11px] py-[5px] font-mono text-3xs tracking-[0.08em] md:min-h-0 ${
                vsVariant === v ? 'bg-surface-nav-active text-brand-teal' : 'text-text-muted-2'
              }`}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-16 border border-border-base bg-surface-card">
        <div className="flex items-center gap-[6px] p-[6px]">
          <button
            onClick={() => canPrev && setVsIdx(idx - 1)}
            disabled={!canPrev}
            aria-label="Previous rival"
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-border-control bg-surface-card-4/70 text-text-muted-1 disabled:opacity-30 md:h-[26px] md:w-[26px]"
          >
            &#8249;
          </button>

          <div className="flex min-w-0 flex-1 flex-col gap-[13px] p-[10px_14px_14px]">
            <div className="flex items-center justify-between gap-2 border-b border-border-base pb-[9px]">
              <span className="font-dmSerif text-lg text-brand-teal md:text-2xl">You</span>
              <span className="font-mono text-2xs tracking-[0.2em] text-text-muted-5 md:text-2xs">VS</span>
              <span className="truncate font-dmSerif text-lg text-text-secondary md:text-2xl">{current.name}</span>
            </div>

            {vsVariant === 'tape' ? (
              <div className="flex flex-col gap-[11px] md:gap-0">
                {current.tapeRows.map((r) => (
                  <div key={r.label} className="flex flex-col gap-[5px] md:grid md:grid-cols-[50px_1fr_142px_1fr_50px] md:items-center md:gap-[9px]">
                    <div className="md:hidden">
                      <span className="block text-center font-mono text-3xs tracking-[0.1em] text-text-muted-2">{r.label}</span>
                    </div>
                    <span className="text-right font-mono text-caption md:text-base" style={{ color: r.youFg }}>
                      {r.you}
                    </span>
                    <span className="flex justify-end">
                      <span className="h-1.5 rounded-full transition-all" style={{ width: r.youW, background: r.youBar }} />
                    </span>
                    <span className="hidden text-center font-mono text-3xs tracking-[0.1em] text-text-muted-2 md:block">
                      {r.label}
                    </span>
                    <span className="flex">
                      <span className="h-1.5 rounded-full transition-all" style={{ width: r.themW, background: r.themBar }} />
                    </span>
                    <span className="font-mono text-caption md:text-base" style={{ color: r.themFg }}>
                      {r.them}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-[13px] md:flex-row md:items-center">
                <RadarChart rows={current.radarRows} themLabel={current.name} />
                <div className="flex w-full flex-col gap-[9px]">
                  <div className="flex items-center gap-4 border-b border-border-base pb-[6px]">
                    <span className="flex items-center gap-[7px]">
                      <span className="h-[9px] w-[9px] rounded-[2px] bg-brand-teal" />
                      <span className="text-caption text-text-secondary">You</span>
                    </span>
                    <span className="flex items-center gap-[7px]">
                      <span className="h-[9px] w-[9px] rounded-[2px] bg-[#f87171]" />
                      <span className="text-caption text-text-secondary">{current.name}</span>
                    </span>
                  </div>
                  {current.radarRows.map((r) => (
                    <div key={r.label} className="grid grid-cols-[1fr_46px_46px] items-baseline gap-[10px]">
                      <span className="font-mono text-3xs tracking-[0.1em] text-text-muted-2">{r.label}</span>
                      <span className="text-right font-mono text-caption text-brand-teal">{r.you}</span>
                      <span className="text-right font-mono text-caption text-[#f87171]">{r.them}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <span className="text-wrap-pretty border-t border-border-base pt-[9px] text-center text-caption leading-relaxed text-text-muted-2">
              {current.verdict}
            </span>
          </div>

          <button
            onClick={() => canNext && setVsIdx(idx + 1)}
            disabled={!canNext}
            aria-label="Next rival"
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-border-control bg-surface-card-4/70 text-text-muted-1 disabled:opacity-30 md:h-[26px] md:w-[26px]"
          >
            &#8250;
          </button>
        </div>

        <div className="flex justify-center gap-1 pb-3">
          {rivals.map((r, i) => (
            <span
              key={r.id}
              className="h-1 rounded-full transition-all"
              style={{ width: i === idx ? 14 : 4, background: i === idx ? 'var(--color-brand-teal)' : 'var(--border-card)' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
