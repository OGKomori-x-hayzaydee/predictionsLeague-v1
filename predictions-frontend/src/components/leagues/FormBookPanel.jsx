import { useMemo } from 'react';
import KickerLabel from '../ui/KickerLabel';
import { verdictColors, buildMemberPanel, buildFixturePanel } from '../../utils/leagueStats';

/**
 * Form-book side panel — member sheet or fixture spread.
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
      <div className="flex min-h-0 flex-1 flex-col gap-3 md:gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full text-base font-semibold ${
              memberPanel.isCurrentUser ? 'bg-brand-teal-deep text-brand-teal-tint' : 'bg-surface-card-4 text-text-muted-1'
            }`}
          >
            {memberPanel.initial}
          </span>
          <div className="flex min-w-0 flex-1 flex-col leading-tight">
            <span className="truncate font-dmSerif text-lg text-text-primary md:text-2xl">{memberPanel.name}</span>
            <span className="font-outfit text-2xs text-text-muted-2">{memberPanel.sheetNote}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {memberPanel.stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-0.5 rounded-9 border border-border-card bg-surface-card-3 p-2.5">
              <span className="font-outfit text-3xs tracking-widest text-text-muted-2">{s.label}</span>
              <span className="font-dmSerif text-2xl leading-none" style={{ color: s.fg }}>
                {s.val}
              </span>
            </div>
          ))}
        </div>

        {memberPanel.sealed && (
          <div className="flex flex-col gap-1.5 rounded-12 border border-dashed border-brand-amber-mid/50 bg-brand-amber-pale/5 p-3">
            <span className="font-outfit text-2xs tracking-widest text-brand-amber">SEALED UNTIL KICKOFF</span>
            <span className="text-caption leading-relaxed text-text-secondary">{memberPanel.sealedBody}</span>
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="flex-1" />
            <span className="flex items-baseline gap-2 font-outfit text-3xs tracking-widest text-text-muted-2">
              <span className="w-8 text-right">{memberPanel.isCurrentUser ? '' : 'THEM'}</span>
              <span className="w-8 text-right text-brand-teal">YOU</span>
              <span className="w-8 text-right">PTS</span>
            </span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
            {memberPanel.sheet.map((s, i) => (
              <div
                key={i}
                className="grid min-h-11 grid-cols-[1fr_2rem_2rem_2rem] items-center gap-2 rounded-9 border px-2.5 py-2"
                style={{
                  background: s.isExact ? 'color-mix(in srgb, var(--color-brand-teal) 6%, var(--surface-card))' : 'var(--surface-card-2)',
                  borderColor: s.isExact ? 'var(--color-brand-teal-mid)' : 'var(--border-hairline)',
                }}
              >
                <span className="min-w-0 truncate text-caption text-text-secondary">{s.match}</span>
                <span className="text-center font-outfit text-caption text-text-muted-2">{s.theirs}</span>
                <span className="text-center font-outfit text-caption text-brand-teal">{s.yours}</span>
                <span className="text-right font-outfit text-caption text-text-muted-2">{s.pts}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (fixturePanel) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-3 md:gap-4">
        <div className="flex flex-col gap-1">
          <KickerLabel>HOW THE ROOM SPLIT</KickerLabel>
          <span className="font-dmSerif text-lg leading-tight text-text-primary md:text-2xl">{fixturePanel.title}</span>
          <span className="font-outfit text-2xs text-text-muted-2">{fixturePanel.state}</span>
        </div>

        {fixturePanel.spread.length > 0 && (
          <div className="flex flex-col gap-2">
            <KickerLabel>THE SPREAD</KickerLabel>
            {fixturePanel.spread.map((s) => (
              <div key={s.label} className="flex items-center gap-2.5">
                <span className="w-10 font-outfit text-xs" style={{ color: s.labelFg }}>{s.label}</span>
                <span className="flex h-2 flex-1 overflow-hidden rounded-xs bg-surface-card-4">
                  <span className="h-full" style={{ width: s.pct, background: s.color }} />
                </span>
                <span className="w-12 text-right font-outfit text-2xs text-text-muted-2">{s.count}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex min-h-0 flex-1 flex-col gap-2">
          <KickerLabel>EVERY CALL ON THIS FIXTURE</KickerLabel>
          <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
            {fixturePanel.calls.map((c) => {
              const vc = c.verdict ? verdictColors(c.verdict) : null;
              return (
                <div
                  key={c.initial + c.name}
                  className="grid min-h-11 grid-cols-[1.5rem_1fr_3.5rem_2.5rem] items-center gap-2 rounded-9 border px-2.5 py-1.5"
                  style={{
                    background: c.isCurrentUser ? 'color-mix(in srgb, var(--color-brand-teal) 6%, var(--surface-card))' : 'var(--surface-card-2)',
                    borderColor: c.isCurrentUser ? 'var(--color-brand-teal-mid)' : 'var(--border-hairline)',
                  }}
                >
                  <span
                    className={`flex size-6 items-center justify-center rounded-full text-2xs font-semibold ${
                      c.isCurrentUser ? 'bg-brand-teal-deep text-brand-teal-tint' : 'bg-surface-card-4 text-text-muted-1'
                    }`}
                  >
                    {c.initial}
                  </span>
                  <span className={`truncate text-caption ${c.isCurrentUser ? 'text-brand-teal' : 'text-text-secondary'}`}>{c.name}</span>
                  <span className="text-center font-outfit text-caption" style={{ color: vc?.fg || 'var(--text-muted-4)' }}>{c.call}</span>
                  <span className="text-right font-outfit text-caption text-text-muted-2">{c.pts}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return <p className="text-2xs text-text-muted-2">Select a member or fixture to see the detail.</p>;
}
