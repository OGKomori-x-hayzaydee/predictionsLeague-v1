import TeamCrest from '../ui/TeamCrest';
import GwPicker from './GwPicker';
import FormBookPanel from './FormBookPanel';

/**
 * Mobile Form book — by-member / by-fixture panel replacement for the
 * desktop 12×N grid (mobile-leagues-plan.md §"Form book"), real data from
 * the same `formBook` object as the desktop grid.
 */
export default function FormBookMobile({ formBook, sel, setSel, mobGrid, setMobGrid, gwOptions, selectedGw, setSelectedGw }) {
  if (!formBook) return null;
  const { fixtures, rows, isSettled, gw } = formBook;
  const byMember = mobGrid === 'member';

  return (
    <div className="flex flex-col gap-3 md:hidden">
      <div className="flex flex-col gap-[5px]">
        <span
          className="font-mono text-2xs tracking-[0.12em]"
          style={{ color: isSettled ? 'var(--color-brand-teal)' : 'var(--color-brand-amber)' }}
        >
          GAMEWEEK {gw} · {isSettled ? 'REVEALED' : 'OPEN, UNSCORED'}
        </span>
        <span className="text-caption leading-relaxed text-text-secondary">
          {isSettled ? "Everyone's calls, side by side" : "Everyone's calls so far, nothing scored yet"}
        </span>
      </div>

      <GwPicker options={gwOptions} value={selectedGw} onChange={setSelectedGw} />

      {fixtures.length === 0 ? (
        <p className="rounded-16 border border-border-base bg-surface-card p-4 text-caption text-text-muted-2">
          No calls filed yet for this gameweek.
        </p>
      ) : (
        <>
          <div className="flex rounded-11 border border-border-card bg-surface-card-4 p-[3px]">
            {[{ id: 'member', label: 'BY MEMBER' }, { id: 'fixture', label: 'BY FIXTURE' }].map((t) => (
              <button
                key={t.id}
                onClick={() => setMobGrid(t.id)}
                className={`min-h-[38px] flex-1 rounded-8 font-mono text-2xs tracking-[0.1em] ${
                  mobGrid === t.id ? 'bg-surface-nav-active text-brand-teal' : 'text-text-muted-2'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <span className="text-2xs text-text-muted-1">
            {byMember ? 'Tap a name to read their sheet against yours' : 'Tap a fixture to see how the room called it'}
          </span>

          {byMember ? (
            <div className="flex gap-[7px] overflow-x-auto pb-1">
              {rows.map((r) => {
                const on = sel?.type === 'member' && sel.id === r.username;
                return (
                  <button
                    key={r.username}
                    onClick={() => setSel({ type: 'member', id: r.username })}
                    className="flex min-h-[88px] w-[66px] shrink-0 flex-col items-center gap-[6px] rounded-14 border p-[10px_6px]"
                    style={{
                      background: on ? 'color-mix(in srgb, var(--color-brand-teal) 15%, transparent)' : 'var(--surface-card-2)',
                      borderColor: on ? 'var(--color-brand-teal-mid)' : 'var(--border-base)',
                    }}
                  >
                    <span
                      className={`flex h-[34px] w-[34px] items-center justify-center rounded-full text-sm ${
                        r.isCurrentUser ? 'bg-brand-teal-deep text-brand-teal-tint' : 'bg-surface-card-4 text-text-muted-1'
                      }`}
                    >
                      {r.initial}
                    </span>
                    <span className="max-w-full truncate text-2xs" style={{ color: on ? 'var(--color-brand-teal)' : 'var(--text-secondary)' }}>
                      {r.name}
                    </span>
                    <span className="font-mono text-3xs text-text-muted-1">#{r.position}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex gap-[7px] overflow-x-auto pb-1">
              {fixtures.map((f) => {
                const on = sel?.type === 'fixture' && sel.id === f.matchId;
                return (
                  <button
                    key={f.matchId}
                    onClick={() => setSel({ type: 'fixture', id: f.matchId })}
                    className="flex min-h-[100px] w-[92px] shrink-0 flex-col items-center gap-[6px] rounded-14 border p-[11px_8px]"
                    style={{
                      background: on ? 'color-mix(in srgb, var(--color-brand-teal) 15%, transparent)' : 'var(--surface-card-2)',
                      borderColor: on ? 'var(--color-brand-teal-mid)' : 'var(--border-base)',
                    }}
                  >
                    <span className="flex items-center gap-[5px]">
                      <TeamCrest team={f.homeTeam} size={20} />
                      <TeamCrest team={f.awayTeam} size={20} />
                    </span>
                    <span className="text-center text-2xs leading-tight" style={{ color: on ? 'var(--color-brand-teal)' : 'var(--text-secondary)' }}>
                      {f.homeTeam} v {f.awayTeam}
                    </span>
                    <span className="font-mono text-2xs text-text-muted-1">
                      {f.actualHomeScore != null ? `${f.actualHomeScore}–${f.actualAwayScore}` : 'open'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-3 rounded-16 border border-border-base bg-surface-card p-[14px]">
            <FormBookPanel formBook={formBook} sel={sel} />
          </div>
        </>
      )}
    </div>
  );
}
