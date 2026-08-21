import TeamCrest from '../ui/TeamCrest';
import GwPicker from './GwPicker';
import FormBookPanel from './FormBookPanel';
import SegmentedControl from '../ui/SegmentedControl';

/**
 * Mobile Form book — by-member / by-fixture rails.
 */
export default function FormBookMobile({ formBook, sel, setSel, mobGrid, setMobGrid, gwOptions, selectedGw, setSelectedGw, currentGameweek, settledGws }) {
  if (!formBook) return null;
  const { fixtures, rows, isSettled, gw } = formBook;
  const byMember = mobGrid === 'member';

  return (
    <div className="flex flex-col gap-3 md:hidden">
      <div className="flex flex-col gap-1">
        <span
          className="font-outfit text-2xs tracking-widest"
          style={{ color: isSettled ? 'var(--color-brand-teal)' : 'var(--color-brand-amber)' }}
        >
          GAMEWEEK {gw} · {isSettled ? 'REVEALED' : 'OPEN, UNSCORED'}
        </span>
        <span className="font-dmSerif text-xl leading-tight text-text-primary">
          {isSettled ? "Everyone's ten calls, side by side" : "Everyone's calls so far, nothing scored yet"}
        </span>
      </div>

      <GwPicker
        options={gwOptions}
        value={selectedGw}
        onChange={setSelectedGw}
        currentGameweek={currentGameweek}
        settledGws={settledGws}
      />

      {fixtures.length === 0 ? (
        <p className="rounded-16 border border-border-base bg-surface-card p-4 text-caption text-text-muted-2">
          No calls filed yet for this gameweek.
        </p>
      ) : (
        <>
          <SegmentedControl
            grow
            value={mobGrid}
            onChange={setMobGrid}
            options={[
              { id: 'member', label: 'BY MEMBER' },
              { id: 'fixture', label: 'BY FIXTURE' },
            ]}
          />

          <span className="text-2xs text-text-muted-1">
            {byMember ? 'Tap a name to read their sheet against yours' : 'Tap a fixture to see how the room called it'}
          </span>

          {byMember ? (
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {rows.map((r) => {
                const on = sel?.type === 'member' && sel.id === r.username;
                return (
                  <button
                    key={r.username}
                    onClick={() => setSel({ type: 'member', id: r.username })}
                    className="flex min-h-24 w-16 shrink-0 flex-col items-center gap-1.5 rounded-14 border px-1.5 py-2.5"
                    style={{
                      background: on ? 'color-mix(in srgb, var(--color-brand-teal) 15%, transparent)' : 'var(--surface-card-2)',
                      borderColor: on ? 'var(--color-brand-teal-mid)' : 'var(--border-base)',
                    }}
                  >
                    <span
                      className={`flex size-8 items-center justify-center rounded-full text-sm ${
                        r.isCurrentUser ? 'bg-brand-teal-deep text-brand-teal-tint' : 'bg-surface-card-4 text-text-muted-1'
                      }`}
                    >
                      {r.initial}
                    </span>
                    <span className="max-w-full truncate text-2xs" style={{ color: on ? 'var(--color-brand-teal)' : 'var(--text-secondary)' }}>
                      {r.name}
                    </span>
                    <span className="font-outfit text-3xs text-text-muted-1">#{r.position}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {fixtures.map((f) => {
                const on = sel?.type === 'fixture' && sel.id === f.matchId;
                return (
                  <button
                    key={f.matchId}
                    onClick={() => setSel({ type: 'fixture', id: f.matchId })}
                    className="flex min-h-24 w-24 shrink-0 flex-col items-center gap-1.5 rounded-14 border px-2 py-2.5"
                    style={{
                      background: on ? 'color-mix(in srgb, var(--color-brand-teal) 15%, transparent)' : 'var(--surface-card-2)',
                      borderColor: on ? 'var(--color-brand-teal-mid)' : 'var(--border-base)',
                    }}
                  >
                    <span className="flex items-center gap-1">
                      <TeamCrest team={f.homeTeam} size={20} className="size-5" />
                      <TeamCrest team={f.awayTeam} size={20} className="size-5" />
                    </span>
                    <span className="text-center text-2xs leading-tight" style={{ color: on ? 'var(--color-brand-teal)' : 'var(--text-secondary)' }}>
                      {f.homeTeam} v {f.awayTeam}
                    </span>
                    <span className="font-outfit text-2xs text-text-muted-1">
                      {f.actualHomeScore != null ? `${f.actualHomeScore}–${f.actualAwayScore}` : 'open'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex flex-col gap-3 rounded-16 border border-border-base bg-surface-card p-3.5">
            <FormBookPanel formBook={formBook} sel={sel} />
          </div>
        </>
      )}
    </div>
  );
}
