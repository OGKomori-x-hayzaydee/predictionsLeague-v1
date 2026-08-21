import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '@phosphor-icons/react';
import KickerLabel from '../ui/KickerLabel';
import TeamCrest from '../ui/TeamCrest';
import FixtureSlip from '../fixtures/FixtureSlip';
import ResultsPreviewSwitcher from './ResultsPreviewSwitcher';
import useCarouselScroll from '../../hooks/useCarouselScroll';
import {
  buildResultView,
  pointsLabel,
  predictionAsReceiptPair,
  SCORE_TONE,
} from '../../utils/matchResult';
import { calculateCeilingPoints } from '../../utils/pointsCalculation';

function openInRecord(navigate, prediction) {
  const highlight = prediction.matchId ?? prediction.id ?? '';
  const q = `${prediction.homeTeam || ''} ${prediction.awayTeam || ''}`.trim();
  const params = new URLSearchParams({ tab: 'search', highlight: String(highlight) });
  if (q) params.set('q', q);
  navigate(`/record?${params.toString()}`);
}

function toneBar(tone) {
  if (tone === SCORE_TONE.exact) return 'bg-[#14b8a6]';
  if (tone === SCORE_TONE.outcome) return 'bg-[#6366f1]';
  if (tone === SCORE_TONE.miss) return 'bg-[#fcd34d]';
  return 'bg-[#1e2a3f]';
}

function toneText(tone) {
  if (tone === SCORE_TONE.exact) return 'text-[#5eead4]';
  if (tone === SCORE_TONE.outcome) return 'text-[#818cf8]';
  if (tone === SCORE_TONE.miss) return 'text-[#fbbf24]';
  return 'text-[#7f93ad]';
}

function TicketTape({ predictions, gameweekLabel }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const { canScrollLeft, canScrollRight, scroll, checkScrollability } = useCarouselScroll(ref);

  return (
    <div className="flex items-stretch gap-1.5">
      <button
        type="button"
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Previous results"
        className="mt-8 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1e2a3f] bg-[#0b1424] text-[#c8d2e0] disabled:opacity-30"
      >
        &#8249;
      </button>
      <div
        ref={ref}
        onScroll={checkScrollability}
        className="flex min-w-0 flex-1 snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {predictions.map((prediction) => {
          const { fixture, prediction: pred } = predictionAsReceiptPair(prediction);
          return (
            <button
              key={prediction.matchId ?? prediction.id}
              type="button"
              onClick={() => openInRecord(navigate, prediction)}
              aria-label={`${prediction.homeTeam} vs ${prediction.awayTeam} result`}
              className="snap-start shrink-0 cursor-pointer text-left"
            >
              <FixtureSlip
                fixture={fixture}
                prediction={pred}
                ceiling={calculateCeilingPoints(pred)}
                variant="scored"
                density="compact"
                gameweekLabel={gameweekLabel}
              />
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Next results"
        className="mt-8 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#1e2a3f] bg-[#0b1424] text-[#c8d2e0] disabled:opacity-30"
      >
        &#8250;
      </button>
    </div>
  );
}

function ResultRidge({ predictions }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-stretch gap-2">
      {predictions.map((prediction) => {
        const { fixture, prediction: pred } = predictionAsReceiptPair(prediction);
        const result = buildResultView(fixture, pred);
        const hero = result.actualHome != null ? `${result.actualHome}–${result.actualAway}` : '—';
        return (
          <button
            key={prediction.matchId ?? prediction.id}
            type="button"
            onClick={() => openInRecord(navigate, prediction)}
            className="flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-1.5 rounded-lg border border-[#1e3450] bg-[#0b1424b8] px-1.5 py-2.5"
          >
            <span className={`h-0.5 w-full rounded-full ${toneBar(result.tone)}`} />
            <span className="flex items-center gap-1">
              <TeamCrest team={prediction.homeTeam} size={18} />
              <TeamCrest team={prediction.awayTeam} size={18} />
            </span>
            <span className={`font-dmSerif text-lg leading-none ${toneText(result.tone)}`}>{hero}</span>
            <span className="font-outfit text-2xs tracking-wider text-[#5b667d]">
              {result.hasCall ? `CALL ${result.callHome}–${result.callAway}` : 'NO SLIP'}
            </span>
            <span className={`font-dmSerif text-base leading-none ${toneText(result.tone)}`}>
              {pointsLabel(result.points)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function OneUpWell({ predictions, gameweekLabel }) {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const safeIdx = Math.min(idx, Math.max(predictions.length - 1, 0));
  const prediction = predictions[safeIdx];
  if (!prediction) return null;
  const { fixture, prediction: pred } = predictionAsReceiptPair(prediction);
  const canPrev = safeIdx > 0;
  const canNext = safeIdx < predictions.length - 1;

  return (
    <div className="flex min-h-[280px] items-stretch gap-3">
      <button
        type="button"
        onClick={() => canPrev && setIdx(safeIdx - 1)}
        disabled={!canPrev}
        aria-label="Previous result"
        className="flex h-9 w-9 shrink-0 self-center items-center justify-center rounded-full border border-[#1e2a3f] bg-[#0b1424] text-[#c8d2e0] disabled:opacity-30"
      >
        &#8249;
      </button>
      <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
        <FixtureSlip
          fixture={fixture}
          prediction={pred}
          ceiling={calculateCeilingPoints(pred)}
          variant="scored"
          gameweekLabel={gameweekLabel}
        />
        <button
          type="button"
          onClick={() => openInRecord(navigate, prediction)}
          className="font-outfit text-2xs tracking-[0.14em] text-[#66748c] hover:text-brand-teal"
        >
          FULL PREDICTION &rarr;
        </button>
      </div>
      <button
        type="button"
        onClick={() => canNext && setIdx(safeIdx + 1)}
        disabled={!canNext}
        aria-label="Next result"
        className="flex h-9 w-9 shrink-0 self-center items-center justify-center rounded-full border border-[#1e2a3f] bg-[#0b1424] text-[#c8d2e0] disabled:opacity-30"
      >
        &#8250;
      </button>
    </div>
  );
}

/**
 * Desktop last-gameweek results strip. Three preview directions:
 * A ticket tape, B result ridge, C one-up well.
 */
export default function ResultsCarousel({
  predictions = [],
  gameweek,
  variant = 'A',
  onVariantChange,
  usingDemo = false,
  hasReal = false,
  previewMode = false,
  onTogglePreview,
  isLoading = false,
}) {
  const gameweekLabel = gameweek ? `GW${gameweek}` : 'LAST GW';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <KickerLabel as="span" className="tracking-[0.16em] text-[#66748c]">
            Last gameweek{gameweek ? ` · GW${gameweek}` : ''}
          </KickerLabel>
          {usingDemo && (
            <span className="font-outfit text-2xs tracking-wider text-[#fbbf24]">EXAMPLE DATA</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ResultsPreviewSwitcher value={variant} onChange={onVariantChange} />
          {onTogglePreview && (
            <button
              type="button"
              onClick={onTogglePreview}
              aria-label="Toggle preview with example data"
              className={`shrink-0 rounded-md border p-1.5 ${
                previewMode || !hasReal
                  ? 'border-brand-amber/50 text-brand-amber'
                  : 'border-[#2a3a52] text-[#66748c]'
              }`}
            >
              <Ticket size={13} />
            </button>
          )}
        </div>
      </div>

      {isLoading && <p className="text-xs text-[#66748c]">Loading last gameweek…</p>}

      {!isLoading && predictions.length === 0 && (
        <p className="text-xs text-[#66748c]">No scored predictions yet this season.</p>
      )}

      {!isLoading && predictions.length > 0 && variant === 'A' && (
        <TicketTape predictions={predictions} gameweekLabel={gameweekLabel} />
      )}
      {!isLoading && predictions.length > 0 && variant === 'B' && (
        <ResultRidge predictions={predictions} />
      )}
      {!isLoading && predictions.length > 0 && variant === 'C' && (
        <OneUpWell key={gameweek} predictions={predictions} gameweekLabel={gameweekLabel} />
      )}
    </div>
  );
}
