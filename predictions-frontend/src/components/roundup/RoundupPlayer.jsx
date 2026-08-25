import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FixtureSlip from '../fixtures/FixtureSlip';
import ChipToken from '../ui/ChipToken';
import { CHIP_HUES, CHIP_TAGS, DEFAULT_CHIP_HUE } from '../chips/chipHues';
import { calculateCeilingPoints } from '../../utils/pointsCalculation';
import { attributeChipReturn, computeChipAlmanac } from '../../utils/profileStats';
import { callVerdict } from '../../utils/recordStats';
import {
  VERDICT_LABELS,
  pointsLabel,
  predictionAsReceiptPair,
} from '../../utils/matchResult';
import { CHIP_CONFIG } from '../../utils/chipManager';

function FoilCard({ kicker, children, notches, index, onNext, onBack, nextLabel, onClose }) {
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/75 p-4">
      <div
        className="relative flex max-h-[90vh] w-full max-w-[820px] flex-col overflow-hidden rounded-[20px] border border-[#1c2942]"
        style={{ background: 'linear-gradient(180deg, #0a1120, #070d18)' }}
      >
        <div className="flex items-center justify-between border-b border-dashed border-white/10 px-6 py-3">
          <span className="font-outfit text-xs uppercase tracking-[0.16em] text-brand-teal">{kicker}</span>
          <button type="button" onClick={onClose} className="font-outfit text-xs text-[#8496ad] hover:text-white">
            Close
          </button>
        </div>
        <div className="flex gap-1 px-6 pt-3">
          {Array.from({ length: notches }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= index ? 'bg-brand-teal' : 'bg-[#1c2942]'}`}
            />
          ))}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        <div className="flex items-center justify-between gap-3 border-t border-dashed border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={onBack}
            disabled={index === 0}
            className="font-outfit text-sm text-[#8496ad] disabled:opacity-30"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-full bg-brand-indigo-mid px-5 py-2 font-outfit text-sm font-semibold text-white hover:bg-brand-indigo-hover"
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function totals(rows) {
  let ceiling = 0;
  let actual = 0;
  rows.forEach((p) => {
    ceiling += calculateCeilingPoints(p) || 0;
    actual += p.points || 0;
  });
  return { ceiling, actual };
}

function buildScenes(data) {
  const { candidate, rows, prevRows, seasonAvg } = data;
  const { ceiling, actual } = totals(rows);
  const verdicts = { EXACT: 0, OUTCOME: 0, MISSED: 0 };
  rows.forEach((p) => {
    const v = callVerdict(p)?.verdict;
    if (v) verdicts[v] += 1;
  });
  const almanac = computeChipAlmanac(rows).filter((c) => c.usageCount > 0);
  const chipLines = [];
  rows.forEach((p) => {
    (p.chips || []).forEach((id) => {
      chipLines.push({ id, pts: attributeChipReturn(p, id), match: `${p.homeTeam} v ${p.awayTeam}` });
    });
  });
  const prevTotal = prevRows.reduce((s, p) => s + (p.points || 0), 0);

  return [
    {
      id: 'open',
      kicker: `GW${candidate} ROUNDUP`,
      requires: () => true,
      render: () => (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="font-outfit text-xs uppercase tracking-[0.16em] text-brand-teal">The week is in</span>
          <h2 className="font-dmSerif text-4xl text-white">Gameweek {candidate}</h2>
          <p className="max-w-[28em] font-outfit text-sm text-[#8896ad]">
            {rows.length} slips scored. Deal through the tape, then see what the chips left on the table.
          </p>
        </div>
      ),
    },
    {
      id: 'tape',
      kicker: 'THE TAPE',
      requires: () => rows.length > 0,
      render: () => (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {rows.map((p) => {
            const pair = predictionAsReceiptPair(p);
            return (
              <FixtureSlip
                key={p.matchId || p.id}
                fixture={pair.fixture}
                prediction={pair.prediction}
                variant="scored"
                density="compact"
                gameweekLabel={`GW${candidate}`}
              />
            );
          })}
        </div>
      ),
    },
    {
      id: 'flip',
      kicker: 'CALL VS RESULT',
      requires: () => rows.length > 0,
      render: () => (
        <div className="flex flex-col gap-3">
          {rows.map((p) => {
            const ceil = calculateCeilingPoints(p) || 0;
            return (
              <div key={p.matchId || p.id} className="flex items-center justify-between rounded-[12px] border border-[#1c2942] bg-[#070d18] px-4 py-3">
                <span className="font-outfit text-sm text-[#c8d2e0]">
                  {p.homeTeam} {p.homeScore}–{p.awayScore} {p.awayTeam}
                </span>
                <span className="font-outfit text-xs text-[#8496ad]">
                  FT {p.actualHomeScore}–{p.actualAwayScore} · ceil {ceil} vs {pointsLabel(p.points)}
                </span>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      id: 'verdicts',
      kicker: 'THE MIX',
      requires: () => rows.length > 0,
      render: () => (
        <div className="grid grid-cols-3 gap-3 py-4">
          {Object.entries(verdicts).map(([key, n]) => (
            <div key={key} className="flex flex-col items-center gap-1 rounded-[12px] border border-[#1c2942] py-4">
              <span className="font-outfit text-2xs uppercase tracking-[0.14em] text-[#66748c]">{VERDICT_LABELS[key]}</span>
              <span className="font-dmSerif text-3xl text-white">{n}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'table',
      kicker: 'LEFT ON THE TABLE',
      requires: () => rows.length > 0,
      render: () => (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <span className="font-outfit text-xs uppercase tracking-[0.14em] text-[#66748c]">Ceiling vs actual</span>
          <span className="font-dmSerif text-5xl text-white">
            <span className="text-brand-amber">{ceiling}</span>
            <span className="mx-2 text-[#4a5b78]">vs</span>
            <span className="text-[#5eead4]">{actual}</span>
          </span>
          <p className="font-outfit text-sm text-[#8896ad]">
            {ceiling - actual} points left on the table this week.
          </p>
        </div>
      ),
    },
    {
      id: 'chips',
      kicker: 'CHIP NIGHT',
      requires: () => chipLines.length > 0 || almanac.length > 0,
      render: () => (
        <div className="flex flex-col gap-3">
          {(almanac.length ? almanac : []).map((c) => (
            <div key={c.chipId} className="flex items-center gap-3 rounded-[12px] border border-[#1c2942] px-4 py-3">
              <ChipToken
                tag={CHIP_TAGS[c.chipId] || CHIP_CONFIG[c.chipId]?.icon}
                hue={CHIP_HUES[c.chipId] || DEFAULT_CHIP_HUE}
                size={32}
              />
              <span className="flex-1 font-outfit text-sm text-white">{c.name}</span>
              <span className="font-dmSerif text-xl text-brand-teal">{c.totalReturn > 0 ? `+${c.totalReturn}` : c.totalReturn}</span>
            </div>
          ))}
          {almanac.length === 0 && chipLines.map((line, i) => (
            <div key={`${line.id}-${i}`} className="flex items-center justify-between rounded-[12px] border border-[#1c2942] px-4 py-3">
              <span className="font-outfit text-sm text-[#c8d2e0]">{CHIP_CONFIG[line.id]?.name} · {line.match}</span>
              <span className="font-dmSerif text-lg text-brand-teal">{line.pts > 0 ? `+${line.pts}` : line.pts}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'context',
      kicker: 'IN CONTEXT',
      requires: () => candidate > 1,
      render: () => {
        const vsLast = candidate <= 4 && prevRows.length > 0;
        return (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <span className="font-dmSerif text-3xl text-white">{actual} pts</span>
            {vsLast ? (
              <p className="font-outfit text-sm text-[#8896ad]">
                Last week you scored {prevTotal}. This week is {actual >= prevTotal ? 'up' : 'down'} {Math.abs(actual - prevTotal)}.
              </p>
            ) : (
              <p className="font-outfit text-sm text-[#8896ad]">
                Season average is {seasonAvg != null ? seasonAvg.toFixed(1) : '—'}. This week is{' '}
                {seasonAvg != null && actual >= seasonAvg ? 'above' : 'below'} that line.
              </p>
            )}
          </div>
        );
      },
    },
    {
      id: 'close',
      kicker: 'WHAT NEXT',
      requires: () => true,
      render: ({ goFixtures, goRecord }) => (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <h2 className="font-dmSerif text-3xl text-white">File the next week, or search the record.</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={goFixtures}
              className="rounded-full bg-brand-indigo-mid px-5 py-2 font-outfit text-sm font-semibold text-white"
            >
              File GW{candidate + 1}
            </button>
            <button
              type="button"
              onClick={goRecord}
              className="rounded-full border border-[#1c2942] px-5 py-2 font-outfit text-sm text-[#c8d2e0]"
            >
              Search the record
            </button>
          </div>
        </div>
      ),
    },
  ];
}

export default function RoundupPlayer({ candidate, rows, allPredictions = [], onClose }) {
  const navigate = useNavigate();
  const prevRows = useMemo(
    () => (allPredictions || []).filter((p) => Number(p.gameweek) === Number(candidate) - 1),
    [allPredictions, candidate]
  );
  const seasonAvg = useMemo(() => {
    const byGw = new Map();
    (allPredictions || []).forEach((p) => {
      if (p.gameweek == null || p.actualHomeScore == null) return;
      byGw.set(p.gameweek, (byGw.get(p.gameweek) || 0) + (p.points || 0));
    });
    const totalsList = [...byGw.values()];
    if (!totalsList.length) return null;
    return totalsList.reduce((a, b) => a + b, 0) / totalsList.length;
  }, [allPredictions]);

  const scenes = useMemo(
    () => buildScenes({ candidate, rows, prevRows, seasonAvg }).filter((s) => s.requires()),
    [candidate, rows, prevRows, seasonAvg]
  );
  const [index, setIndex] = useState(0);
  const scene = scenes[Math.min(index, scenes.length - 1)];
  const last = index >= scenes.length - 1;

  if (!scene) return null;

  return (
    <FoilCard
      kicker={scene.kicker}
      notches={scenes.length}
      index={index}
      onBack={() => setIndex((i) => Math.max(0, i - 1))}
      onNext={() => {
        if (last) {
          onClose?.();
          return;
        }
        setIndex((i) => Math.min(scenes.length - 1, i + 1));
      }}
      nextLabel={last ? 'Done' : 'Next'}
      onClose={onClose}
    >
      {scene.render({
        goFixtures: () => {
          onClose?.();
          navigate('/fixtures');
        },
        goRecord: () => {
          onClose?.();
          navigate('/record?tab=search');
        },
      })}
    </FoilCard>
  );
}
