import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '@phosphor-icons/react';
import KickerLabel from '../ui/KickerLabel';
import FixtureSlip from '../fixtures/FixtureSlip';
import useCarouselScroll from '../../hooks/useCarouselScroll';
import { predictionAsReceiptPair, recordSearchPath } from '../../utils/matchResult';
import { calculateCeilingPoints } from '../../utils/pointsCalculation';

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
              onClick={() => navigate(recordSearchPath(prediction))}
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

/**
 * Desktop last-gameweek results tape — compact scored receipts, one GW.
 */
export default function ResultsCarousel({
  predictions = [],
  gameweek,
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

      {isLoading && <p className="text-xs text-[#66748c]">Loading last gameweek…</p>}

      {!isLoading && predictions.length === 0 && (
        <p className="text-xs text-[#66748c]">No scored predictions yet this season.</p>
      )}

      {!isLoading && predictions.length > 0 && (
        <TicketTape predictions={predictions} gameweekLabel={gameweekLabel} />
      )}
    </div>
  );
}
