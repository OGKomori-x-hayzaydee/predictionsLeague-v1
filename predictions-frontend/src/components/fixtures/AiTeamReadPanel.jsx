import { getMatchInsight } from '../../utils/matchInsights';

const TEAM_PLAYERS = {
  liverpool: {
    injuries: [
      { name: 'Alisson', status: 'DOUBT', dot: '#fcd34d', reason: 'thigh' },
      { name: 'Bradley', status: 'OUT', dot: '#f87171', reason: 'ankle' },
    ],
    scorers: [
      { name: 'Salah', goals: 5, pct: '41%' },
      { name: 'Gakpo', goals: 3, pct: '22%' },
      { name: 'Diaz', goals: 3, pct: '18%' },
    ],
  },
  'man city': {
    injuries: [
      { name: 'Rodri', status: 'OUT', dot: '#f87171', reason: 'knee' },
      { name: 'De Bruyne', status: 'DOUBT', dot: '#fcd34d', reason: 'match fitness' },
    ],
    scorers: [
      { name: 'Haaland', goals: 6, pct: '46%' },
      { name: 'Foden', goals: 2, pct: '18%' },
      { name: 'Silva', goals: 2, pct: '14%' },
    ],
  },
  'man utd': {
    injuries: [
      { name: 'Shaw', status: 'OUT', dot: '#f87171', reason: 'calf' },
      { name: 'Mount', status: 'DOUBT', dot: '#fcd34d', reason: 'hamstring' },
    ],
    scorers: [
      { name: 'Højlund', goals: 2, pct: '26%' },
      { name: 'Fernandes', goals: 2, pct: '22%' },
      { name: 'Rashford', goals: 1, pct: '16%' },
    ],
  },
  'manchester united': {
    injuries: [
      { name: 'Shaw', status: 'OUT', dot: '#f87171', reason: 'calf' },
      { name: 'Mount', status: 'DOUBT', dot: '#fcd34d', reason: 'hamstring' },
    ],
    scorers: [
      { name: 'Højlund', goals: 2, pct: '26%' },
      { name: 'Fernandes', goals: 2, pct: '22%' },
      { name: 'Rashford', goals: 1, pct: '16%' },
    ],
  },
  spurs: {
    injuries: [
      { name: 'Romero', status: 'OUT', dot: '#f87171', reason: 'suspended' },
      { name: 'Bissouma', status: 'DOUBT', dot: '#fcd34d', reason: 'knock' },
    ],
    scorers: [
      { name: 'Son', goals: 4, pct: '35%' },
      { name: 'Solanke', goals: 3, pct: '31%' },
      { name: 'Maddison', goals: 2, pct: '17%' },
    ],
  },
  tottenham: {
    injuries: [
      { name: 'Romero', status: 'OUT', dot: '#f87171', reason: 'suspended' },
      { name: 'Bissouma', status: 'DOUBT', dot: '#fcd34d', reason: 'knock' },
    ],
    scorers: [
      { name: 'Son', goals: 4, pct: '35%' },
      { name: 'Solanke', goals: 3, pct: '31%' },
      { name: 'Maddison', goals: 2, pct: '17%' },
    ],
  },
  brighton: {
    injuries: [
      { name: 'Baleba', status: 'DOUBT', dot: '#fcd34d', reason: 'knock' },
      { name: 'Lamptey', status: 'OUT', dot: '#f87171', reason: 'hamstring' },
    ],
    scorers: [
      { name: 'João Pedro', goals: 3, pct: '31%' },
      { name: 'Welbeck', goals: 2, pct: '22%' },
      { name: 'Mitoma', goals: 2, pct: '16%' },
    ],
  },
  wolves: {
    injuries: [
      { name: 'Aït-Nouri', status: 'OUT', dot: '#f87171', reason: 'thigh' },
      { name: 'Sarabia', status: 'DOUBT', dot: '#fcd34d', reason: 'illness' },
    ],
    scorers: [
      { name: 'Cunha', goals: 4, pct: '38%' },
      { name: 'Strand Larsen', goals: 2, pct: '20%' },
      { name: 'Hwang', goals: 1, pct: '14%' },
    ],
  },
  chelsea: {
    injuries: [
      { name: 'James', status: 'DOUBT', dot: '#fcd34d', reason: 'hamstring' },
      { name: 'Lavia', status: 'OUT', dot: '#f87171', reason: 'thigh' },
    ],
    scorers: [
      { name: 'Palmer', goals: 5, pct: '39%' },
      { name: 'Jackson', goals: 4, pct: '28%' },
      { name: 'Nkunku', goals: 2, pct: '19%' },
    ],
  },
  fulham: {
    injuries: [
      { name: 'Robinson', status: 'DOUBT', dot: '#fcd34d', reason: 'knee' },
      { name: 'Muniz', status: 'OUT', dot: '#f87171', reason: 'hamstring' },
    ],
    scorers: [
      { name: 'Jimenez', goals: 4, pct: '34%' },
      { name: 'Iwobi', goals: 2, pct: '20%' },
      { name: 'Smith Rowe', goals: 2, pct: '18%' },
    ],
  },
  arsenal: {
    injuries: [
      { name: 'Saka', status: 'DOUBT', dot: '#fcd34d', reason: 'knock' },
      { name: 'Odegaard', status: 'OUT', dot: '#f87171', reason: 'ankle' },
    ],
    scorers: [
      { name: 'Havertz', goals: 4, pct: '34%' },
      { name: 'Martinelli', goals: 3, pct: '24%' },
      { name: 'Trossard', goals: 2, pct: '18%' },
    ],
  },
};

function getTeamData(teamName) {
  if (!teamName) return null;
  const key = Object.keys(TEAM_PLAYERS).find((k) => teamName.toLowerCase().includes(k));
  if (key) return TEAM_PLAYERS[key];
  return {
    injuries: [
      { name: 'Key Player', status: 'DOUBT', dot: '#fcd34d', reason: 'knock' },
      { name: 'Starting CB', status: 'OUT', dot: '#f87171', reason: 'knee' },
    ],
    scorers: [
      { name: `${teamName} Forward`, goals: 3, pct: '32%' },
      { name: `${teamName} Winger`, goals: 2, pct: '22%' },
    ],
  };
}

/**
 * AI TEAM READ Panel — matching Spine.dc.html lines 458-534.
 */
export default function AiTeamReadPanel({
  fixture,
  open,
  onToggle,
  onPickScorer,
  totalGoals = 0,
}) {
  const insight = getMatchInsight(fixture);
  const homeData = getTeamData(fixture?.homeTeam);
  const awayData = getTeamData(fixture?.awayTeam);

  const homeInjuries = homeData?.injuries || [];
  const awayInjuries = awayData?.injuries || [];

  const formRows = [
    ...(homeData?.scorers?.slice(0, 2).map((s) => ({ ...s, bar: `${(s.goals / 7) * 100}%`, barFg: '#5eead4' })) || []),
    ...(awayData?.scorers?.slice(0, 2).map((s) => ({ ...s, bar: `${(s.goals / 7) * 100}%`, barFg: '#6366f1' })) || []),
  ];

  const likelyScorers = [
    ...(homeData?.scorers?.slice(0, 2).map((s) => ({ ...s, side: 'home' })) || []),
    ...(awayData?.scorers?.slice(0, 2).map((s) => ({ ...s, side: 'away' })) || []),
  ];

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-xl border border-[#1c2942] bg-[#080e1ab8]">
      {/* Header bar */}
      <div
        onClick={onToggle}
        className="flex cursor-pointer items-center gap-2.5 px-4 py-2.5 select-none"
      >
        <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-[#818cf8]" />
        <span className="font-mono text-xs uppercase tracking-widest text-[#66748c]">
          AI TEAM READ
        </span>
        <span className="w-px h-3 bg-[#233248]" />
        <span className="font-mono text-xs text-[#4f5b70]">UPDATED 14 MIN AGO</span>
        <span className="ml-auto font-mono text-xs text-[#8496ad]">
          4 fitness doubts · xG {insight?.predictedHome ?? 2}.1–{insight?.predictedAway ?? 1}.8 · 4 likely scorers
        </span>
        <span className="font-mono text-xs text-[#8496ad]">{open ? '▴' : '▾'}</span>
      </div>

      {open && (
        <div className="grid grid-cols-1 border-t border-[#16203a] md:grid-cols-3 md:divide-x md:divide-[#16233a]">
          {/* Column 1: AVAILABILITY */}
          <div className="flex flex-col gap-2 min-w-0 p-3.5">
            <span className="font-mono text-[0.6875rem] uppercase tracking-widest text-[#4f5b70]">
              AVAILABILITY
            </span>
            <div className="flex flex-col gap-3">
              {/* Home */}
              <div className="flex flex-col gap-1 min-w-0">
                <span className="truncate text-xs text-[#7f93ad] font-medium">{fixture?.homeTeam}</span>
                {homeInjuries.map((p) => (
                  <div key={p.name} className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[#c8d2e0] min-w-0">
                      <span className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ background: p.dot }} />
                      <span className="flex-1 truncate">{p.name}</span>
                      <span className="font-mono text-[0.625rem] font-medium tracking-wider" style={{ color: p.dot }}>
                        {p.status}
                      </span>
                    </div>
                    <span className="pl-3.5 font-mono text-[0.625rem] text-[#4f5b70]">{p.reason}</span>
                  </div>
                ))}
              </div>
              {/* Away */}
              <div className="flex flex-col gap-1 min-w-0">
                <span className="truncate text-xs text-[#7f93ad] font-medium">{fixture?.awayTeam}</span>
                {awayInjuries.map((p) => (
                  <div key={p.name} className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2 text-xs text-[#c8d2e0] min-w-0">
                      <span className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ background: p.dot }} />
                      <span className="flex-1 truncate">{p.name}</span>
                      <span className="font-mono text-[0.625rem] font-medium tracking-wider" style={{ color: p.dot }}>
                        {p.status}
                      </span>
                    </div>
                    <span className="pl-3.5 font-mono text-[0.625rem] text-[#4f5b70]">{p.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: GOALS IN LAST 5 · xG */}
          <div className="flex flex-col gap-2 min-w-0 p-3.5">
            <span className="font-mono text-[0.6875rem] uppercase tracking-widest text-[#4f5b70]">
              GOALS IN LAST 5 · xG
            </span>
            <div className="flex flex-col gap-1.5">
              {formRows.map((p) => (
                <div key={p.name} className="flex items-center gap-2 text-xs text-[#c8d2e0]">
                  <span className="flex-1 truncate">{p.name}</span>
                  <span className="flex h-1.5 w-16 overflow-hidden rounded-full bg-[#111c2e]">
                    <span style={{ width: p.bar, background: p.barFg }} className="rounded-full" />
                  </span>
                  <span className="w-4 text-right font-mono text-xs text-[#8fa0b8]">{p.goals}</span>
                </div>
              ))}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-[0.625rem] tracking-wider text-[#5b667d]">xG</span>
              <span className="font-mono text-sm font-medium text-[#c7d2fe]">
                {insight?.predictedHome ?? 2}.1 – {insight?.predictedAway ?? 1}.8
              </span>
              <span className="text-xs text-[#66748c]">high-scoring model read</span>
            </div>
          </div>

          {/* Column 3: LIKELY SCORERS · TAP TO FILL */}
          <div className="flex flex-col gap-2 min-w-0 p-3.5">
            <span className="font-mono text-[0.6875rem] uppercase tracking-widest text-[#4f5b70]">
              LIKELY SCORERS · TAP TO FILL
            </span>
            <div className="flex flex-wrap gap-1.5">
              {likelyScorers.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => onPickScorer?.(p.name, p.side)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[#1e3450] bg-[#0d1c2e99] px-2.5 py-1 text-xs font-medium text-[#5eead4] transition-colors hover:border-[#14b8a666]"
                >
                  <span>{p.name}</span>
                  <span className="font-mono text-[0.6875rem] text-[#99f6e4]">{p.pct}</span>
                </button>
              ))}
            </div>
            <span className="text-xs leading-relaxed text-[#66748c]" style={{ textWrap: 'pretty' }}>
              {totalGoals === 0
                ? 'Add goals first — there is nowhere to put a scorer yet.'
                : 'Tapping drops the name into the first empty slot on that side.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
