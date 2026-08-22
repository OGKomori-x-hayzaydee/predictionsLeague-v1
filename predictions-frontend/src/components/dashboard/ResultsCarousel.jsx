import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import KickerLabel from '../ui/KickerLabel';
import FixtureSlip from '../fixtures/FixtureSlip';
import useCarouselScroll from '../../hooks/useCarouselScroll';
import { predictionAsReceiptPair, recordSearchPath } from '../../utils/matchResult';
import { calculateCeilingPoints } from '../../utils/pointsCalculation';

const arrowClass =
  'mt-8 inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-text-muted-4 bg-surface-card text-text-primary transition-colors hover:border-brand-teal-mid hover:text-brand-teal disabled:pointer-events-none disabled:opacity-30';

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
        className={arrowClass}
      >
        <ArrowLeft size={16} weight="bold" />
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
        className={arrowClass}
      >
        <ArrowRight size={16} weight="bold" />
      </button>
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
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <KickerLabel>
          {gameweek ? `GAMEWEEK ${gameweek}` : 'LAST GAMEWEEK'}
        </KickerLabel>
        <h2 className="m-0 font-dmSerif text-lg leading-tight text-text-muted">
          Recent results
        </h2>
      </div>

      {isLoading && <p className="text-xs text-text-muted">Loading recent results…</p>}

      {!isLoading && predictions.length === 0 && (
        <p className="text-xs text-text-muted">No scored predictions yet this season.</p>
      )}

      {!isLoading && predictions.length > 0 && (
        <TicketTape predictions={predictions} gameweekLabel={gameweekLabel} />
      )}
    </div>
  );
}
