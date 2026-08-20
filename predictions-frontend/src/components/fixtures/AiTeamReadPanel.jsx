import { useState } from 'react';
import { getMatchInsight } from '../../utils/matchInsights';

function getInjuries(teamName, isAway) {
  if (!teamName) return [];
  if (teamName.toLowerCase().includes('liverpool')) {
    return [
      { name: 'Alisson', status: 'DOUBT', dot: '#fcd34d', reason: 'thigh' },
      { name: 'Bradley', status: 'OUT', dot: '#f87171', reason: 'ankle' },
    ];
  }
  if (teamName.toLowerCase().includes('city') || teamName.toLowerCase().includes('man city')) {
    return [
      { name: 'Rodri', status: 'OUT', dot: '#f87171', reason: 'knee' },
      { name: 'De Bruyne', status: 'DOUBT', dot: '#fcd34d', reason: 'match fitness' },
    ];
  }
  if (teamName.toLowerCase().includes('arsenal')) {
    return [
      { name: 'Saka', status: 'DOUBT', dot: '#fcd34d', reason: 'knock' },
      { name: 'Odegaard', status: 'OUT', dot: '#f87171', reason: 'ankle' },
    ];
  }
  if (isAway) {
    return [
      { name: 'Key Forward', status: 'DOUBT', dot: '#fcd34d', reason: 'late fitness test' },
      { name: 'Starting CB', status: 'OUT', dot: '#f87171', reason: 'hamstring' },
    ];
  }
  return [
    { name: 'Starting GK', status: 'DOUBT', dot: '#fcd34d', reason: 'illness' },
    { name: 'Left Back', status: 'OUT', dot: '#f87171', reason: 'knee' },
  ];
}

function getFormRows(homeTeam, awayTeam, insight) {
  const home = homeTeam || 'Home';
  const away = awayTeam || 'Away';
  return [
    { name: `${home} Top Scorer`, goals: 5, bar: '78%', barFg: '#5eead4' },
    { name: `${away} Striker`, goals: 6, bar: '90%', barFg: '#5eead4' },
    { name: `${home} Winger`, goals: 3, bar: '45%', barFg: '#6366f1' },
    { name: `${away} Playmaker`, goals: 2, bar: '32%', barFg: '#6366f1' },
  ];
}

/**
 * AI TEAM READ Panel — matching Spine.dc.html lines 458-534 / 577-653
 * 3-column layout:
 * 1. AVAILABILITY (fitness doubts / OUT)
 * 2. GOALS IN LAST 5 · xG (form rows + model read)
 * 3. LIKELY SCORERS · TAP TO FILL (pills that auto-populate scorer slots)
 */
export default function AiTeamReadPanel({
  fixture,
  open,
  onToggle,
  onPickScorer,
}) {
  const insight = getMatchInsight(fixture);
  const homeInjuries = getInjuries(fixture?.homeTeam, false);
  const awayInjuries = getInjuries(fixture?.awayTeam, true);
  const formRows = getFormRows(fixture?.homeTeam, fixture?.awayTeam, insight);

  const likelyScorers = [
    { name: fixture?.homePlayers?.[0]?.name || `${fixture?.homeTeam || 'Home'} Striker`, pct: '46%', side: 'home' },
    { name: fixture?.homePlayers?.[1]?.name || `${fixture?.homeTeam || 'Home'} Winger`, pct: '41%', side: 'home' },
    { name: fixture?.awayPlayers?.[0]?.name || `${fixture?.awayTeam || 'Away'} Striker`, pct: '22%', side: 'away' },
    { name: fixture?.awayPlayers?.[1]?.name || `${fixture?.awayTeam || 'Away'} Midfielder`, pct: '18%', side: 'away' },
  ];

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[13px] border border-[#1c2942] bg-[#080e1ab8]">
      {/* Header bar */}
      <div
        onClick={onToggle}
        className="flex cursor-pointer items-center gap-[9px] px-4 py-3 select-none"
      >
        <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-[#818cf8]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#66748c]">
          AI TEAM READ
        </span>
        <span className="h-3 w-px bg-[#233248]" />
        <span className="font-mono text-[10px] text-[#4f5b70]">UPDATED 14 MIN AGO</span>
        <span className="ml-auto font-mono text-[10.5px] text-[#8496ad]">
          4 fitness doubts · xG {insight?.predictedHome ?? 2}.1–{insight?.predictedAway ?? 1}.8 · 4 likely scorers
        </span>
        <span className="font-mono text-xs text-[#8496ad]">{open ? '▴' : '▾'}</span>
      </div>

      {open && (
        <div className="grid grid-cols-1 border-t border-[#16203a] md:grid-cols-3 md:divide-x md:divide-[#16233a]">
          {/* Column 1: AVAILABILITY */}
          <div className="flex flex-col gap-[9px] min-w-0 p-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#4f5b70]">
              AVAILABILITY
            </span>
            <div className="flex flex-col gap-3">
              {/* Home */}
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="truncate text-[11.5px] text-[#7f93ad]">{fixture?.homeTeam}</span>
                {homeInjuries.map((p) => (
                  <div key={p.name} className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-[#c8d2e0] min-w-0">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.dot }} />
                      <span className="flex-1 truncate">{p.name}</span>
                      <span className="font-mono text-[9.5px] tracking-[0.06em]" style={{ color: p.dot }}>
                        {p.status}
                      </span>
                    </div>
                    <span className="pl-3 font-mono text-[9.5px] text-[#4f5b70]">{p.reason}</span>
                  </div>
                ))}
              </div>
              {/* Away */}
              <div className="flex flex-col gap-1.5 min-w-0">
                <span className="truncate text-[11.5px] text-[#7f93ad]">{fixture?.awayTeam}</span>
                {awayInjuries.map((p) => (
                  <div key={p.name} className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-[#c8d2e0] min-w-0">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.dot }} />
                      <span className="flex-1 truncate">{p.name}</span>
                      <span className="font-mono text-[9.5px] tracking-[0.06em]" style={{ color: p.dot }}>
                        {p.status}
                      </span>
                    </div>
                    <span className="pl-3 font-mono text-[9.5px] text-[#4f5b70]">{p.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: GOALS IN LAST 5 · xG */}
          <div className="flex flex-col gap-[9px] min-w-0 p-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#4f5b70]">
              GOALS IN LAST 5 · xG
            </span>
            <div className="flex flex-col gap-1.5">
              {formRows.map((p) => (
                <div key={p.name} className="flex items-center gap-2 text-xs text-[#c8d2e0]">
                  <span className="flex-1 truncate">{p.name}</span>
                  <span className="flex h-1.5 w-16 overflow-hidden rounded-full bg-[#111c2e]">
                    <span style={{ width: p.bar, background: p.barFg }} className="rounded-full" />
                  </span>
                  <span className="w-3 text-right font-mono text-[11px] text-[#8fa0b8]">{p.goals}</span>
                </div>
              ))}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-[10px] tracking-[0.1em] text-[#5b667d]">xG</span>
              <span className="font-mono text-[13px] font-medium text-[#c7d2fe]">
                {insight?.predictedHome ?? 2}.1 – {insight?.predictedAway ?? 1}.8
              </span>
              <span className="text-[11.5px] text-[#66748c]">high-scoring model read</span>
            </div>
          </div>

          {/* Column 3: LIKELY SCORERS · TAP TO FILL */}
          <div className="flex flex-col gap-[9px] min-w-0 p-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#4f5b70]">
              LIKELY SCORERS · TAP TO FILL
            </span>
            <div className="flex flex-wrap gap-1.5">
              {likelyScorers.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => onPickScorer?.(p.name, p.side)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[#1e3450] bg-[#0d1c2e99] px-2.5 py-1 text-xs text-[#5eead4] transition-colors hover:border-[#14b8a666]"
                >
                  <span>{p.name}</span>
                  <span className="font-mono text-[10px] text-[#99f6e4]">{p.pct}</span>
                </button>
              ))}
            </div>
            <span className="text-[11.5px] leading-relaxed text-[#66748c]" style={{ textWrap: 'pretty' }}>
              Tapping drops the name into the first empty slot on that side.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
