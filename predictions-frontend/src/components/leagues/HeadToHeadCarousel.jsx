import KickerLabel from '../ui/KickerLabel';
import RadarChart from '../ui/RadarChart';
import SegmentedControl from '../ui/SegmentedControl';

/**
 * Head-to-head TAPE/RADAR carousel — one card per league rival.
 */
export default function HeadToHeadCarousel({ rivals, vsIdx, setVsIdx, vsVariant, setVsVariant }) {
  if (!rivals || rivals.length === 0) {
    return (
      <div className="flex flex-col gap-2.5 rounded-16 border border-border-base bg-surface-card p-5">
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
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <KickerLabel>HEAD TO HEAD</KickerLabel>
        <SegmentedControl
          value={vsVariant}
          onChange={setVsVariant}
          options={[
            { id: 'tape', label: 'TAPE' },
            { id: 'radar', label: 'RADAR' },
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-16 border border-border-base bg-surface-card">
        <div className="flex items-center gap-1.5 p-1.5">
          <button
            onClick={() => canPrev && setVsIdx(idx - 1)}
            disabled={!canPrev}
            aria-label="Previous rival"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border-control bg-surface-card-4/70 text-text-muted-1 disabled:opacity-30"
          >
            &#8249;
          </button>

          <div className="flex min-w-0 flex-1 flex-col gap-3 px-3.5 pb-3.5 pt-2.5">
            <div className="flex items-center justify-between gap-2 border-b border-border-base pb-2">
              <span className="font-dmSerif text-lg text-brand-teal md:text-2xl">You</span>
              <span className="font-outfit text-2xs tracking-widest text-text-muted-5">VS</span>
              <span className="truncate font-dmSerif text-lg text-text-secondary md:text-2xl">{current.name}</span>
            </div>

            {vsVariant === 'tape' ? (
              <div className="flex flex-col gap-2.5 md:gap-1.5">
                {current.tapeRows.map((r) => (
                  <div key={r.label} className="flex flex-col gap-1 md:grid md:grid-cols-[3rem_minmax(0,1fr)_9rem_minmax(0,1fr)_3rem] md:items-center md:gap-2">
                    <div className="md:hidden">
                      <span className="block text-center font-outfit text-3xs tracking-widest text-text-muted-2">{r.label}</span>
                    </div>
                    <span className="text-right font-outfit text-caption md:text-base" style={{ color: r.youFg }}>
                      {r.you}
                    </span>
                    <span className="flex justify-end">
                      <span className="h-1.5 rounded-full transition-all" style={{ width: r.youW, background: r.youBar }} />
                    </span>
                    <span className="hidden text-center font-outfit text-3xs tracking-widest text-text-muted-2 md:block">
                      {r.label}
                    </span>
                    <span className="flex">
                      <span className="h-1.5 rounded-full transition-all" style={{ width: r.themW, background: r.themBar }} />
                    </span>
                    <span className="font-outfit text-caption md:text-base" style={{ color: r.themFg }}>
                      {r.them}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
                <RadarChart rows={current.radarRows} themLabel={current.name} />
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center gap-4 border-b border-border-base pb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-xs bg-brand-teal" />
                      <span className="text-caption text-text-secondary">You</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-xs bg-[#f87171]" />
                      <span className="text-caption text-text-secondary">{current.name}</span>
                    </span>
                  </div>
                  {current.radarRows.map((r) => (
                    <div key={r.label} className="grid grid-cols-[1fr_3rem_3rem] items-baseline gap-2.5">
                      <span className="font-outfit text-3xs tracking-widest text-text-muted-2">{r.label}</span>
                      <span className="text-right font-outfit text-caption text-brand-teal">{r.you}</span>
                      <span className="text-right font-outfit text-caption text-[#f87171]">{r.them}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <span className="border-t border-border-base pt-2 text-center text-caption leading-relaxed text-text-muted-2 [text-wrap:pretty]">
              {current.verdict}
            </span>
          </div>

          <button
            onClick={() => canNext && setVsIdx(idx + 1)}
            disabled={!canNext}
            aria-label="Next rival"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border-control bg-surface-card-4/70 text-text-muted-1 disabled:opacity-30"
          >
            &#8250;
          </button>
        </div>

        <div className="flex justify-center gap-1 pb-3">
          {rivals.map((r, i) => (
            <span
              key={r.id}
              className={`h-1 rounded-full transition-all ${i === idx ? 'w-3.5 bg-brand-teal' : 'w-1 bg-border-card'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
