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

function homeLead(n) {
  if (n === 0) return 'No leagues yet';
  const words = { 1: 'One league', 2: 'Two leagues', 3: 'Three leagues', 4: 'Four leagues' };
  return `${words[n] || `${n} leagues`}, one record`;
}

function moveLabel(delta) {
  if (delta == null) return null;
  if (delta > 0) return { text: `▲ ${delta}`, tone: 'up' };
  if (delta < 0) return { text: `▼ ${Math.abs(delta)}`, tone: 'down' };
  return { text: '— level', tone: 'muted' };
}

/**
 * "All leagues" home view — real per-league data from useLeagues, or the
 * preview pack when the user has opted into example data.
 */
export default function LeagueHome({ myLeagues, isLoading, onOpen, onJoin, onCreate, onPreview, previewMode }) {
  const [showForm, setShowForm] = useState(false);

  const adminCount = myLeagues.filter((l) => l.isAdmin).length;
  const best = myLeagues.reduce((a, b) => ((b.position ?? Infinity) < (a?.position ?? Infinity) ? b : a), null);

  const stats = [
    { label: 'LEAGUES', val: myLeagues.length, note: adminCount ? `${adminCount} you own` : 'none owned yet' },
    { label: 'BEST STANDING', val: best ? ordinal(best.position) : '—', note: best ? best.name : 'join a league' },
    { label: 'YOUR WEEK', val: best?.points ?? '—', note: best ? `season in ${best.name}` : '—' },
    { label: 'OPEN NOW', val: previewMode ? 'GW24' : '—', note: previewMode ? '4 of 10 filed' : 'live week on the fixtures reel' },
  ];

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-dmSerif text-2xl leading-tight text-text-primary md:text-4xl">
            {homeLead(myLeagues.length)}
          </h2>
          <p className="max-w-prose text-caption leading-relaxed text-text-muted-1 md:text-sm">
            {best
              ? `Best placed in ${best.name} at ${ordinal(best.position)}. Pick a league below to see the full form book.`
              : 'Join a league with a code, or start your own — the full form book is one tap deeper.'}
          </p>
          {!previewMode && myLeagues.length === 0 && !isLoading && onPreview && (
            <button
              onClick={onPreview}
              className="mt-1 self-start font-outfit text-2xs tracking-wide text-text-muted-2 underline decoration-dotted underline-offset-2 hover:text-brand-teal"
            >
              Preview with example data →
            </button>
          )}
        </div>
        {myLeagues.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:flex md:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5 rounded-md border border-border-card bg-surface-card-2 p-3 md:items-end md:border-0 md:bg-transparent md:p-0">
                <KickerLabel className="text-text-muted-4">{s.label}</KickerLabel>
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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {myLeagues.map((l) => {
            const tone = leagueTone(l.id);
            const move = moveLabel(l.rankDelta);
            return (
              <button
                key={l.id}
                onClick={() => onOpen(l)}
                className="flex min-h-16 items-center gap-3 rounded-14 border border-border-card bg-surface-card p-3 text-left transition-colors hover:border-brand-teal-mid/40 md:gap-3.5 md:px-5 md:py-4"
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-12 font-outfit text-sm font-semibold text-text-primary md:size-12 md:text-base"
                  style={{ background: tone.tint, color: tone.var }}
                >
                  {l.name?.slice(0, 2).toUpperCase()}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate font-dmSerif text-lg leading-none text-text-primary md:text-2xl">{l.name}</span>
                  <span className="font-outfit text-2xs text-text-muted-4">
                    {l.members} member{l.members === 1 ? '' : 's'} · since {formatMonthYear(l.createdAt)}
                    {l.isAdmin ? ' · admin' : ''}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-0.5">
                  <span className="font-dmSerif text-2xl leading-none md:text-3xl" style={{ color: tone.var }}>
                    {ordinal(l.position)}
                  </span>
                  {move && (
                    <span className={`font-outfit text-2xs ${move.tone === 'up' ? 'text-brand-teal' : move.tone === 'down' ? 'text-state-error' : 'text-text-muted-2'}`}>
                      {move.text}
                    </span>
                  )}
                </span>
              </button>
            );
          })}

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="flex min-h-16 items-center justify-center gap-2 rounded-14 border border-dashed border-border-control text-caption text-text-muted-2 hover:border-brand-teal-mid/50 hover:text-text-primary"
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
