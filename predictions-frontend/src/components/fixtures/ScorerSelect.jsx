import { useState, useMemo } from 'react';

const EXTRA_OPTIONS = [
  { name: 'Own goal', meta: 'no scorer pts' },
  { name: 'Not sure yet', meta: 'decide later' },
];
const EXTRA_NAMES = EXTRA_OPTIONS.map((o) => o.name);
const SKELETON_WIDTHS = ['78%', '62%', '84%', '55%', '70%'];

// Backend Position enum (dto/enumerated/Position.java) is DEFENDER/MIDFIELDER/
// FORWARD; GOALKEEPER is carried anyway since fixtureUtils' PLAYER_POSITIONS
// declares it. Anything unrecognised falls into the trailing "Other" bucket.
const POSITION_GROUPS = [
  { key: 'FORWARD', label: 'Forwards', short: 'FWD' },
  { key: 'MIDFIELDER', label: 'Midfielders', short: 'MID' },
  { key: 'DEFENDER', label: 'Defenders', short: 'DEF' },
  { key: 'GOALKEEPER', label: 'Goalkeepers', short: 'GK' },
  { key: 'OTHER', label: 'Other', short: '' },
];

const positionKey = (p) => {
  const raw = (p?.position || '').toString().toUpperCase();
  return POSITION_GROUPS.some((g) => g.key === raw && g.key !== 'OTHER') ? raw : 'OTHER';
};
const shortPosition = (key) => POSITION_GROUPS.find((g) => g.key === key)?.short || '';

/**
 * Squad split into position groups, alphabetical within each, with anyone
 * already on the scoresheet lifted out (they live in the pinned block instead).
 */
function groupPlayers(players, pickedNames) {
  const buckets = new Map(POSITION_GROUPS.map((g) => [g.key, []]));
  for (const p of players) {
    if (!p?.name || pickedNames.includes(p.name)) continue;
    buckets.get(positionKey(p)).push(p);
  }
  return POSITION_GROUPS.map((g) => ({
    ...g,
    players: buckets.get(g.key).sort((a, b) => a.name.localeCompare(b.name)),
  })).filter((g) => g.players.length > 0);
}

function OptionRow({ label, meta, metaTone = 'accent', selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left font-outfit text-xs transition-colors hover:bg-[#132238] ${
        selected ? 'bg-[#0f766e26] text-[#5eead4]' : 'text-[#c8d2e0]'
      }`}
    >
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {meta ? (
        <span
          className={`shrink-0 font-outfit text-2xs ${
            metaTone === 'muted' ? 'text-[#5b667d]' : 'text-[#818cf8]'
          }`}
        >
          {meta}
        </span>
      ) : null}
    </button>
  );
}

function ScorerSlot({ team, value, players, picked, align, onPick }) {
  const [open, setOpen] = useState(false);
  const loading = players === undefined;
  const options = loading ? [] : players || [];

  const pickedKey = picked.map((p) => p.name).join('|');
  const groups = useMemo(
    () => groupPlayers(options, pickedKey ? pickedKey.split('|') : []),
    [options, pickedKey]
  );
  const positionOf = useMemo(() => {
    const map = new Map();
    for (const p of options) if (p?.name) map.set(p.name, positionKey(p));
    return map;
  }, [options]);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`${team} scorer slot`}
        className={`flex w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-left font-outfit text-xs md:text-sm transition-colors hover:border-[#14b8a666] ${
          value
            ? 'border-[#14b8a666] bg-[#0f766e26] text-[#5eead4]'
            : 'border-[#1e3450] bg-[#0b1424b8] text-[#8fa0b8]'
        }`}
      >
        <span
          className={`w-2 h-2 shrink-0 rounded-full border-[1.5px] ${
            value ? 'border-[#5eead4]' : 'border-[#4f5b70]'
          }`}
        />
        <span className="min-w-0 flex-1 truncate">{value || 'Pick scorer'}</span>
        <svg className="w-3 h-3 shrink-0 opacity-70" viewBox="0 0 15 15" fill="none">
          <path d="m4 6 3.5 3.5L11 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className={`absolute top-[calc(100%+0.375rem)] z-30 flex max-h-72 w-52 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-[#22344e] bg-[#0a1220f2] shadow-2xl animate-[slotIn_.18s_ease_both] ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            {loading ? (
              <div className="flex flex-col gap-1.5 p-3.5">
                {SKELETON_WIDTHS.map((w, i) => (
                  <span
                    key={i}
                    style={{ width: w, backgroundSize: '11rem 100%' }}
                    className="h-3 animate-[shimmer_1.1s_linear_infinite] rounded-xs bg-[linear-gradient(90deg,#131f33,#1e2d45,#131f33)]"
                  />
                ))}
                <span className="mt-1 font-outfit text-2xs tracking-[0.1em] text-[#4f5b70]">
                  LOADING SQUAD…
                </span>
              </div>
            ) : (
              <>
                {/* Pinned: everyone already on this team's scoresheet, any position */}
                {picked.length > 0 && (
                  <div className="shrink-0 border-b border-[#1b2c44] bg-[#0d1a2c] p-1.5">
                    <div className="flex items-center justify-between px-2.5 pb-1 pt-0.5">
                      <span className="font-outfit text-2xs tracking-[0.14em] text-[#5eead4]">
                        ON THE SCORESHEET
                      </span>
                      <span className="font-outfit text-2xs text-[#4f5b70]">{picked.length}</span>
                    </div>
                    {picked.map((p) => (
                      <OptionRow
                        key={p.name}
                        label={p.name}
                        meta={
                          p.count > 1
                            ? `×${p.count}`
                            : shortPosition(positionOf.get(p.name) || 'OTHER')
                        }
                        metaTone={p.name === value ? 'accent' : 'muted'}
                        selected={p.name === value}
                        onClick={() => {
                          onPick(p.name);
                          setOpen(false);
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-auto p-1.5">
                  {options.length === 0 && (
                    <div className="px-2.5 py-2 font-outfit text-xs text-[#4f5b70]">
                      No squad data available
                    </div>
                  )}
                  {groups.map((g) => (
                    <div key={g.key} className="flex flex-col gap-0.5">
                      <div className="sticky top-0 z-10 flex items-center justify-between bg-[#0a1220] px-2.5 py-1">
                        <span className="font-outfit text-2xs tracking-[0.14em] text-[#5b667d]">
                          {g.label.toUpperCase()}
                        </span>
                        <span className="font-outfit text-2xs text-[#3d4759]">{g.players.length}</span>
                      </div>
                      {g.players.map((p) => (
                        <OptionRow
                          key={p.name}
                          label={p.name}
                          meta={g.short}
                          selected={p.name === value}
                          onClick={() => {
                            onPick(p.name);
                            setOpen(false);
                          }}
                        />
                      ))}
                    </div>
                  ))}

                  <div className="mt-0.5 border-t border-[#1b2c44] pt-1">
                    {EXTRA_OPTIONS.map((o) => (
                      <OptionRow
                        key={o.name}
                        label={o.name}
                        meta={o.meta}
                        metaTone="muted"
                        selected={o.name === value}
                        onClick={() => {
                          onPick(o.name);
                          setOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function ScorerSelect({ team, goalCount, players, scorers, onChange, align = 'left' }) {
  const slotKey = scorers.slice(0, goalCount).join('|');

  // Named scorers already filed across this team's slots, in pick order, with
  // brace counts. Placeholders ("Own goal"/"Not sure yet") stay out of it.
  const picked = useMemo(() => {
    const counts = new Map();
    for (const name of slotKey ? slotKey.split('|') : []) {
      if (!name || EXTRA_NAMES.includes(name)) continue;
      counts.set(name, (counts.get(name) || 0) + 1);
    }
    return Array.from(counts, ([name, count]) => ({ name, count }));
  }, [slotKey]);

  if (goalCount === 0) return null;

  const setScorer = (index, name) => {
    const next = [...scorers];
    next[index] = name;
    onChange(next.slice(0, goalCount));
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      {Array.from({ length: goalCount }).map((_, i) => (
        <ScorerSlot
          key={i}
          team={team}
          value={scorers[i] || ''}
          players={players}
          picked={picked}
          align={align}
          onPick={(name) => setScorer(i, name)}
        />
      ))}
    </div>
  );
}
