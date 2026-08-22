import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import KickerLabel from '../ui/KickerLabel';
import CarouselArrow from '../ui/CarouselArrow';
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
      <CarouselArrow
        direction="left"
        size="lg"
        label="Previous results"
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className="mt-8"
      />
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
      <CarouselArrow
        direction="right"
        size="lg"
        label="Next results"
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className="mt-8"
      />
    </div>
  );
}

/**
 * Desktop recent-results tape — compact scored receipts, one GW.
 */
export default function ResultsCarousel({
  predictions = [],
  gameweek,
  isLoading = false,
}) {
  const gameweekLabel = gameweek ? `GW${gameweek}` : 'LAST GW';

  return (
    <div className="flex flex-col gap-3">
      <KickerLabel as="span" className="tracking-[0.16em] text-[#66748c]">
        Recent results{gameweek ? ` · GW${gameweek}` : ''}
      </KickerLabel>

      {isLoading && <p className="text-xs text-[#66748c]">Loading recent results…</p>}

      {!isLoading && predictions.length === 0 && (
        <p className="text-xs text-[#66748c]">No scored predictions yet this season.</p>
      )}

      {!isLoading && predictions.length > 0 && (
        <TicketTape predictions={predictions} gameweekLabel={gameweekLabel} />
      )}
    </div>
  );
}
