import { useMemo } from 'react';
import KickerLabel from '../ui/KickerLabel';
import { verdictColors, buildMemberPanel, buildFixturePanel } from '../../utils/leagueStats';

/**
 * Form-book side panel — member sheet or fixture spread, shared by the
 * desktop right rail and the mobile by-member/by-fixture sections.
 */
export default function FormBookPanel({ formBook, sel }) {
  const memberPanel = useMemo(
    () => (sel?.type === 'member' ? buildMemberPanel({ formBook, username: sel.id }) : null),
    [formBook, sel]
  );
  const fixturePanel = useMemo(
    () => (sel?.type === 'fixture' ? buildFixturePanel({ formBook, matchId: sel.id }) : null),
    [formBook, sel]
  );

  if (memberPanel) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-[13px] md:gap-[15px]">
        <div className="flex items-center gap-[11px]">
          <span
            className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-[15px] font-semibold ${
              memberPanel.isCurrentUser ? 'bg-brand-teal-deep text-brand-teal-tint' : 'bg-surface-card-4 text-text-muted-1'
            }`}
          >
            {memberPanel.initial}
          </span>
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate font-dmSerif text-[18px] text-text-primary md:text-[20px]">{memberPanel.name}</span>
            <span className="font-mono text-[10px] text-text-muted-2">{memberPanel.sheetNote}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-[8px]">
          {memberPanel.stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-[2px] rounded-10 border border-border-card bg-surface-card-3 p-[10px_11px]">
              <span className="font-mono text-[9px] tracking-[0.1em] text-text-muted-2">{s.label}</span>
              <span className="font-dmSerif text-[19px] leading-none md:text-[22px]" style={{ color: s.fg }}>
                {s.val}
              </span>
            </div>
          ))}
        </div>

        {memberPanel.sealed && (
          <div className="flex flex-col gap-[7px] rounded-12 border border-dashed border-brand-amber-mid/50 bg-brand-amber-pale/5 p-[13px]">
            <span className="font-mono text-[10px] tracking-[0.1em] text-brand-amber">SEALED UNTIL KICKOFF</span>
            <span className="text-[12px] leading-relaxed text-text-secondary">{memberPanel.sealedBody}</span>
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="flex-1" />
            <span className="flex items-baseline gap-[9px] font-mono text-[9px] tracking-[0.1em] text-text-muted-2">
              <span className="w-[34px] text-right">{memberPanel.isCurrentUser ? '' : 'THEM'}</span>
              <span className="w-[34px] text-right text-brand-teal">YOU</span>
              <span className="w-[30px] text-right">PTS</span>
            </span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-[6px] overflow-y-auto pr-1">
            {memberPanel.sheet.map((s, i) => (
              <div
                key={i}
                className="grid min-h-[44px] grid-cols-[1fr_34px_34px_30px] items-center gap-[8px] rounded-9 border p-[8px_9px]"
                style={{
                  background: s.isExact ? 'color-mix(in srgb, var(--color-brand-teal) 6%, var(--surface-card))' : 'var(--surface-card-2)',
                  borderColor: s.isExact ? 'var(--color-brand-teal-mid)' : 'var(--border-hairline)',
                }}
              >
                <span className="min-w-0 truncate text-[11.5px] text-text-secondary">{s.match}</span>
                <span className="text-center font-mono text-[12px] text-text-muted-2">{s.theirs}</span>
                <span className="text-center font-mono text-[12px] text-brand-teal">{s.yours}</span>
                <span className="text-right font-mono text-[11.5px] text-text-muted-2">{s.pts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (fixturePanel) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-[13px] md:gap-[15px]">
        <div className="flex flex-col gap-[4px]">
          <KickerLabel>HOW THE ROOM SPLIT</KickerLabel>
          <span className="font-dmSerif text-[19px] leading-tight text-text-primary md:text-[21px]">{fixturePanel.title}</span>
          <span className="font-mono text-[10.5px] text-text-muted-2">{fixturePanel.state}</span>
        </div>

        {fixturePanel.spread.length > 0 && (
          <div className="flex flex-col gap-[9px]">
            <KickerLabel>THE SPREAD</KickerLabel>
            {fixturePanel.spread.map((s) => (
              <div key={s.label} className="flex items-center gap-[10px]">
                <span className="w-[38px] font-mono text-[12px]" style={{ color: s.labelFg }}>{s.label}</span>
                <span className="flex h-[9px] flex-1 overflow-hidden rounded-4 bg-surface-card-4">
                  <span className="h-full" style={{ width: s.pct, background: s.color }} />
                </span>
                <span className="w-[52px] text-right font-mono text-[11px] text-text-muted-2">{s.count}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <KickerLabel>EVERY CALL ON THIS FIXTURE</KickerLabel>
          <div className="flex min-h-0 flex-1 flex-col gap-[6px] overflow-y-auto pr-1">
            {fixturePanel.calls.map((c) => {
              const vc = c.verdict ? verdictColors(c.verdict) : null;
              return (
                <div
                  key={c.initial + c.name}
                  className="grid min-h-[44px] grid-cols-[22px_1fr_52px_40px] items-center gap-[9px] rounded-9 border p-[7px_10px]"
                  style={{
                    background: c.isCurrentUser ? 'color-mix(in srgb, var(--color-brand-teal) 6%, var(--surface-card))' : 'var(--surface-card-2)',
                    borderColor: c.isCurrentUser ? 'var(--color-brand-teal-mid)' : 'var(--border-hairline)',
                  }}
                >
                  <span
                    className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-semibold ${
                      c.isCurrentUser ? 'bg-brand-teal-deep text-brand-teal-tint' : 'bg-surface-card-4 text-text-muted-1'
                    }`}
                  >
                    {c.initial}
                  </span>
                  <span className={`truncate text-[12.5px] ${c.isCurrentUser ? 'text-brand-teal' : 'text-text-secondary'}`}>{c.name}</span>
                  <span className="text-center font-mono text-[12px]" style={{ color: vc?.fg || 'var(--text-muted-4)' }}>{c.call}</span>
                  <span className="text-right font-mono text-[11.5px] text-text-muted-2">{c.pts}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return <p className="text-[11.5px] text-text-muted-2">Select a member or fixture to see the detail.</p>;
}
