import { useState } from 'react';
import TeamCrest from '../ui/TeamCrest';
import Avatar from '../ui/Avatar';
import GwPicker from './GwPicker';
import FormBookPanel from './FormBookPanel';
import FormBookCellCard from './FormBookCellCard';
import SegmentedControl from '../ui/SegmentedControl';
import { verdictColors } from '../../utils/leagueStats';

/**
 * Desktop Form book — member × fixture grid + right-rail detail panel.
 */
export default function FormBookGrid({ formBook, sel, setSel, mode, setMode, gwOptions, selectedGw, setSelectedGw, leagueName, currentGameweek, settledGws }) {
  const [card, setCard] = useState(null);

  if (!formBook) return null;
  const { fixtures, rows, isSettled, gw } = formBook;

  if (fixtures.length === 0) {
    return (
      <div className="hidden min-h-0 flex-1 flex-col items-center justify-center gap-2 px-6 text-center md:flex">
        <span className="font-dmSerif text-xl text-text-primary">No calls filed yet for GW{gw}</span>
        <p className="max-w-sm text-sm text-text-muted-2">Once anyone in this league files a prediction for this gameweek, the form book fills in here.</p>
      </div>
    );
  }

  const legend = isSettled
    ? [
        { label: 'Exact', ...verdictColors('exact') },
        { label: 'Correct draw', ...verdictColors('draw') },
        { label: 'Right winner', ...verdictColors('winner') },
        { label: 'Missed', ...verdictColors('miss') },
      ]
    : [
        { label: 'Your own call', bg: 'color-mix(in srgb, var(--color-brand-teal) 15%, transparent)', border: 'var(--color-brand-teal-mid)' },
        { label: 'Not filed yet', bg: 'var(--surface-card-4)', border: 'var(--border-hairline)' },
      ];

  const cols = `minmax(9rem,11.5rem) repeat(${fixtures.length}, minmax(0,1fr)) 3.5rem`;
  const fixtureSel = sel?.type === 'fixture' ? sel.id : null;

  return (
    <div className="relative hidden min-h-0 flex-1 md:grid md:grid-cols-[minmax(0,1fr)_25rem]">
      <div className="flex min-h-0 flex-col px-6 pt-5">
        <div className="flex flex-none items-end justify-between gap-5">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="font-outfit text-2xs tracking-widest" style={{ color: isSettled ? 'var(--color-brand-teal)' : 'var(--color-brand-amber)' }}>
              GAMEWEEK {gw} · {isSettled ? 'REVEALED' : 'OPEN, UNSCORED'}
              {leagueName ? ` · ${leagueName.toUpperCase()}` : ''}
            </span>
            <h2 className="font-dmSerif text-3xl leading-tight text-text-primary">
              {isSettled
                ? fixtures.length === 10
                  ? "Everyone's ten calls, side by side"
                  : "Everyone's calls, side by side"
                : "Everyone's calls so far, nothing scored yet"}
            </h2>
          </div>
          <div className="flex flex-none items-center gap-2.5">
            <GwPicker
              options={gwOptions}
              value={selectedGw}
              onChange={(nextGw) => { setSelectedGw(nextGw); setCard(null); }}
              currentGameweek={currentGameweek}
              settledGws={settledGws}
            />
            <SegmentedControl
              value={mode}
              onChange={setMode}
              options={[
                { id: 'score', label: 'SCORES' },
                { id: 'points', label: 'POINTS' },
              ]}
            />
          </div>
        </div>

        <div className="mt-4 flex min-h-0 flex-1 flex-col gap-1">
          <div
            className="grid flex-none items-end gap-0.5 border-b border-border-base pb-1.5"
            style={{ gridTemplateColumns: cols }}
          >
            <span className="font-outfit text-2xs tracking-widest text-text-muted-2">MEMBER</span>
            {fixtures.map((f) => {
              const on = fixtureSel === f.matchId;
              return (
                <button
                  key={f.matchId}
                  onClick={() => { setSel({ type: 'fixture', id: f.matchId }); setCard(null); }}
                  className={`flex flex-col items-center gap-1 rounded-6 py-1 ${on ? 'bg-surface-card-2' : ''}`}
                >
                  <span className="flex gap-0.5">
                    <TeamCrest team={f.homeTeam} size={16} className="size-4" tint={on ? 'var(--color-brand-teal)' : undefined} />
                    <TeamCrest team={f.awayTeam} size={16} className="size-4" tint={on ? 'var(--color-brand-teal)' : undefined} />
                  </span>
                  <span className={`font-outfit text-2xs ${on ? 'text-brand-teal' : 'text-text-muted-2'}`}>
                    {f.actualHomeScore != null ? `${f.actualHomeScore}–${f.actualAwayScore}` : '—'}
                  </span>
                </button>
              );
            })}
            <span className="text-right font-outfit text-2xs tracking-widest text-text-muted-2">{isSettled ? `GW${gw}` : 'STATUS'}</span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto pr-1">
            {rows.map((r) => {
              const selected = sel?.type === 'member' && sel.id === r.username;
              return (
                <div
                  key={r.username}
                  className="grid items-center gap-0.5 rounded-9 border"
                  style={{
                    gridTemplateColumns: cols,
                    background: selected ? 'var(--surface-card-2)' : 'transparent',
                    borderColor: selected ? 'var(--color-brand-teal-mid)' : 'transparent',
                  }}
                >
                  <button
                    onClick={() => { setSel({ type: 'member', id: r.username }); setCard(null); }}
                    className="flex min-w-0 items-center gap-2 p-2.5 text-left"
                  >
                    <span className="w-4 font-outfit text-2xs text-text-muted-2">{r.position}</span>
                    <Avatar
                      name={r.name}
                      src={r.avatar}
                      size={24}
                      animateFallback={false}
                      className={r.isCurrentUser ? 'ring-1 ring-brand-teal' : ''}
                    />
                    <span className={`min-w-0 flex-1 truncate text-sm ${r.isCurrentUser ? 'text-brand-teal' : 'text-text-secondary'}`}>{r.name}</span>
                    {!isSettled && (
                      <span className={`font-outfit text-2xs ${r.filed === fixtures.length ? 'text-brand-teal' : 'text-brand-amber'}`}>
                        {r.filed}/{fixtures.length}
                      </span>
                    )}
                  </button>
                  {r.cells.map((c) => {
                    const vc = c.filed ? verdictColors(!isSettled ? (r.isCurrentUser ? 'exact' : null) : c.verdict) : null;
                    const dim = fixtureSel != null && fixtureSel !== c.matchId;
                    const bg = dim
                      ? '#0a111d'
                      : !c.filed
                        ? 'var(--surface-card-4)'
                        : !isSettled
                          ? r.isCurrentUser
                            ? 'color-mix(in srgb, var(--color-brand-teal) 15%, transparent)'
                            : 'var(--surface-card-3)'
                          : vc.bg;
                    const border = dim
                      ? '#141f31'
                      : !c.filed
                        ? 'var(--border-hairline)'
                        : !isSettled
                          ? r.isCurrentUser
                            ? 'var(--color-brand-teal-mid)'
                            : 'var(--border-card)'
                          : vc.border;
                    const fg = dim
                      ? 'var(--text-muted-5)'
                      : !c.filed
                        ? 'var(--text-muted-5)'
                        : !isSettled
                          ? (r.isCurrentUser ? 'var(--color-brand-teal)' : 'var(--text-secondary)')
                          : vc.fg;
                    return (
                      <button
                        key={c.matchId}
                        onClick={() => {
                          if (!c.filed) return;
                          setSel({ type: 'fixture', id: c.matchId });
                          setCard({ username: r.username, matchId: c.matchId });
                        }}
                        className="flex h-9 items-center justify-center gap-0.5 rounded-6 border font-outfit text-caption"
                        style={{ background: bg, borderColor: border, color: fg }}
                      >
                        {c.filed ? c.label : '—'}
                        {c.chip && <span className="font-outfit text-3xs text-brand-amber">{c.chip}</span>}
                      </button>
                    );
                  })}
                  <span className={`pr-2.5 text-right font-dmSerif text-lg ${r.isCurrentUser ? 'text-brand-teal' : 'text-text-secondary'}`}>
                    {isSettled ? r.total : r.filed === fixtures.length ? 'in' : '—'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-none items-center gap-4 border-t border-border-base py-3.5">
            <span className="font-outfit text-2xs tracking-widest text-text-muted-2">{isSettled ? 'SCORED' : 'STATE'}</span>
            {legend.map((l) => (
              <span key={l.label} className="flex items-center gap-2">
                <span className="size-3 rounded-xs border" style={{ background: l.bg, borderColor: l.border }} />
                <span className="text-caption text-text-muted-1">{l.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-col gap-4 border-l border-border-hairline bg-surface-bar p-5">
        <FormBookPanel formBook={formBook} sel={sel} />
      </div>

      <FormBookCellCard formBook={formBook} card={card} onClose={() => setCard(null)} />
    </div>
  );
}
