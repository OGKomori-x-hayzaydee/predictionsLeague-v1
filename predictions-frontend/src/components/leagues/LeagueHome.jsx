import { useState } from 'react';
import KickerLabel from '../ui/KickerLabel';
import { Button } from '../ui/buttons';
import { ordinal, leagueTone, formatMonthYear } from '../../utils/leagueStats';

function JoinCreateForm({ onJoin, onCreate, onDone }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const inputClass =
    'min-h-11 flex-1 rounded-md border border-border-control bg-surface-card-2 px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal';

  return (
    <div className="grid gap-3 rounded-16 border border-border-base bg-surface-card p-4 sm:grid-cols-2">
      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          try {
            await onJoin(code);
            setCode('');
            onDone?.();
          } catch (err) {
            setError(err.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <input placeholder="Join code" value={code} onChange={(e) => setCode(e.target.value)} className={inputClass} />
        <Button type="submit" size="sm" disabled={busy || !code}>Join</Button>
      </form>
      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          try {
            await onCreate(name);
            setName('');
            onDone?.();
          } catch (err) {
            setError(err.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <input placeholder="League name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        <Button type="submit" size="sm" variant="secondary" disabled={busy || !name}>Create</Button>
      </form>
      {error && <p className="text-xs text-state-error sm:col-span-2">{error}</p>}
    </div>
  );
}

/**
 * "All leagues" home view — real per-league data from useLeagues
 * (LeagueOverview[]: name/members/position/points/createdAt/isAdmin).
 * homeLead/homeStats mirror the prototype's shape but every number here is
 * computed from the fetched list, not authored flavor text.
 */
export default function LeagueHome({ myLeagues, isLoading, onOpen, onJoin, onCreate }) {
  const [showForm, setShowForm] = useState(false);

  const adminCount = myLeagues.filter((l) => l.isAdmin).length;
  const best = myLeagues.reduce((a, b) => ((b.position ?? Infinity) < (a?.position ?? Infinity) ? b : a), null);
  const totalPoints = myLeagues.reduce((sum, l) => sum + (l.points ?? 0), 0);
  const largest = myLeagues.reduce((a, b) => ((b.members ?? 0) > (a?.members ?? 0) ? b : a), null);

  const stats = [
    { label: 'LEAGUES', val: myLeagues.length, note: adminCount ? `${adminCount} you own` : 'none owned yet' },
    { label: 'BEST STANDING', val: best ? ordinal(best.position) : '—', note: best ? best.name : 'join a league' },
    { label: 'TOTAL POINTS', val: totalPoints, note: 'across all leagues' },
    { label: 'LARGEST', val: largest ? largest.members : '—', note: largest ? largest.name : '—' },
  ];

  return (
    <div className="flex flex-col gap-[26px] px-4 py-6 md:px-[34px] md:py-[30px]">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
        <div className="flex flex-col gap-1.5 md:gap-[6px]">
          <h2 className="font-dmSerif text-2xl leading-tight text-text-primary md:text-4xl">
            {myLeagues.length > 0 ? `${myLeagues.length} league${myLeagues.length === 1 ? '' : 's'}, one record` : 'No leagues yet'}
          </h2>
          <p className="max-w-[44em] text-xs leading-relaxed text-text-muted-1 md:text-sm">
            {best
              ? `Best placed in ${best.name} at ${ordinal(best.position)}. Pick a league below to see the full form book.`
              : 'Join a league with a code, or start your own — the full form book is one tap deeper.'}
          </p>
        </div>
        {myLeagues.length > 0 && (
          <div className="grid grid-cols-2 gap-[9px] md:flex md:gap-[26px]">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-[3px] rounded-13 border border-border-card bg-surface-card-2 p-3 md:items-end md:border-0 md:bg-transparent md:p-0">
                <span className="font-mono text-2xs tracking-[0.13em] text-text-muted-4">{s.label}</span>
                <span className="font-dmSerif text-2xl leading-none text-text-primary md:text-3xl">{s.val}</span>
                <span className="text-2xs text-text-muted-2">{s.note}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-text-muted-2">Loading leagues…</p>
      ) : (
        <div className="grid grid-cols-1 gap-[9px] md:grid-cols-2 md:gap-4">
          {myLeagues.map((l) => {
            const tone = leagueTone(l.id);
            return (
              <button
                key={l.id}
                onClick={() => onOpen(l)}
                className="flex min-h-[72px] items-center gap-3 rounded-16 border border-border-card bg-surface-card p-[13px] text-left transition-colors hover:border-brand-teal-mid/40 md:gap-[14px] md:p-[18px_22px]"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-12 font-dmSerif text-lg text-text-primary md:h-[46px] md:w-[46px]"
                  style={{ background: tone.tint, color: tone.var }}
                >
                  {l.name?.slice(0, 2).toUpperCase()}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <span className="truncate text-sm text-text-primary md:font-dmSerif md:text-2xl">{l.name}</span>
                  <span className="font-mono text-2xs text-text-muted-4 md:text-2xs">
                    {l.members} member{l.members === 1 ? '' : 's'} · since {formatMonthYear(l.createdAt)}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-[2px]">
                  <span className="font-dmSerif text-xl leading-none md:text-3xl" style={{ color: tone.var }}>
                    {ordinal(l.position)}
                  </span>
                  <span className="font-mono text-2xs text-text-muted-2">{l.points ?? 0} pts</span>
                </span>
              </button>
            );
          })}

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex min-h-[72px] items-center justify-center gap-[9px] rounded-16 border border-dashed border-border-control text-caption text-text-muted-2 hover:border-brand-teal-mid/50 hover:text-text-primary"
            >
              Join or create a league <span className="text-brand-teal">+</span>
            </button>
          ) : (
            <div className="md:col-span-2">
              <JoinCreateForm onJoin={onJoin} onCreate={onCreate} onDone={() => setShowForm(false)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
