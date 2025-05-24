import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  CheckIcon,
  Cross2Icon,
  LightningBoltIcon,
  Pencil1Icon,
  ChevronDownIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import { getChipInfo, isCorrectScorer } from "../../utils/chipUtils";

const PredictionCard = ({ prediction, teamLogos, onEditClick }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const isPending = prediction.status === "pending";
  const matchDate = new Date(prediction.date);
  const formattedDate = format(matchDate, "EEEE, MMM d");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-primary-600/40 backdrop-blur-md rounded-lg border border-primary-400/20 overflow-hidden"
    >
      {/* Header with date and status */}
      <div className="bg-primary-700/30 px-5 py-3 flex flex-wrap md:flex-nowrap items-center justify-between">
        <div className="flex items-center text-white/70">
          <CalendarIcon className="mr-2" />
          <span>
            {formattedDate} • GW{prediction.gameweek}
          </span>
        </div>

        <div className="flex items-center mt-2 md:mt-0">
          {/* Status badge */}
          {isPending ? (
            <span className="bg-indigo-700/20 text-indigo-300 text-xs font-medium py-1 px-2 rounded-full">
              Pending
            </span>
          ) : prediction.correct ? (
            <span className="bg-green-700/20 text-green-300 text-xs font-medium py-1 px-2 rounded-full flex items-center">
              <CheckIcon className="mr-1" /> Correct
            </span>
          ) : (
            <span className="bg-red-700/20 text-red-300 text-xs font-medium py-1 px-2 rounded-full flex items-center">
              <Cross2Icon className="mr-1" /> Incorrect
            </span>
          )}
        </div>
      </div>

      {/* Match details and prediction */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1: Prediction */}
          <PredictionDetails 
            prediction={prediction} 
            teamLogos={teamLogos} 
          />

          {/* Column 2: Actual Result */}
          <ActualResultDetails 
            prediction={prediction} 
            teamLogos={teamLogos} 
            isPending={isPending} 
          />

          {/* Column 3: Points or Chips */}
          <PointsOrChipsDetails 
            prediction={prediction} 
            isPending={isPending}
            expanded={expanded}
            toggleExpanded={toggleExpanded}
          />
        </div>

        {/* Expanded details section */}
        <AnimatePresence>
          {expanded && (
            <ExpandedDetails 
              prediction={prediction}
              teamLogos={teamLogos}
              isPending={isPending}
            />
          )}
        </AnimatePresence>

        {/* Add Edit button at bottom for pending predictions */}
        {isPending && (
          <div className="mt-4 pt-4 border-t border-primary-400/20 flex justify-center">
            <button
              onClick={() => onEditClick(prediction)}
              className="bg-teal-800/30 hover:bg-teal-700/40 text-teal-300 hover:text-teal-200 rounded-md px-4 py-2 flex items-center transition-colors font-medium"
            >
              <Pencil1Icon className="mr-2 w-4 h-4" />
              Edit Prediction
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PredictionDetails = ({ prediction, teamLogos }) => (
  <div className="flex flex-col items-center">
    <div className="text-xs text-white/50 mb-2">
      Your prediction
    </div>
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 p-1 bg-white/5 rounded-full mb-1 flex items-center justify-center">
          <img
            src={teamLogos[prediction.homeTeam]}
            alt={prediction.homeTeam}
            className="w-10 h-10 object-contain"
          />
        </div>
        <span className="text-white text-xs font-outfit">
          {prediction.homeTeam}
        </span>
      </div>

      <div className="mx-4">
        <div className="text-center mb-1">
          <span className="bg-primary-700/50 rounded-lg px-3 py-1 text-white font-medium text-2xl font-outfit">
            {prediction.homeScore} - {prediction.awayScore}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-14 h-14 p-1 bg-white/5 rounded-full mb-1 flex items-center justify-center">
          <img
            src={teamLogos[prediction.awayTeam]}
            alt={prediction.awayTeam}
            className="w-10 h-10 object-contain"
          />
        </div>
        <span className="text-white text-xs font-outfit">
          {prediction.awayTeam}
        </span>
      </div>
    </div>

    {/* Prediction scorers */}
    <div className="mt-3 text-center w-full">
      <span className="text-white/50 text-xs block mb-1">
        Predicted scorers
      </span>
      <div className="text-white text-sm">
        {[
          ...prediction.homeScorers,
          ...prediction.awayScorers,
        ].length > 0 ? (
          [
            ...prediction.homeScorers,
            ...prediction.awayScorers,
          ].join(", ")
        ) : (
          <span className="text-white/30">
            None predicted
          </span>
        )}
      </div>
    </div>
  </div>
);

const ActualResultDetails = ({ prediction, teamLogos, isPending }) => (
  <div className="flex flex-col items-center">
    {!isPending ? (
      <>
        <div className="text-xs text-white/50 mb-2">
          Actual result
        </div>
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 p-1 bg-white/5 rounded-full mb-1 flex items-center justify-center">
              <img
                src={teamLogos[prediction.homeTeam]}
                alt={prediction.homeTeam}
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>

          <div className="mx-4">
            <div className="text-center mb-1">
              <span className="bg-teal-700/20 text-teal-300 px-3 py-1 rounded-lg font-medium text-2xl">
                {prediction.actualHomeScore} -{" "}
                {prediction.actualAwayScore}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 p-1 bg-white/5 rounded-full mb-1 flex items-center justify-center">
              <img
                src={teamLogos[prediction.awayTeam]}
                alt={prediction.awayTeam}
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Actual scorers */}
        <div className="mt-3 text-center w-full">
          <span className="text-white/50 text-xs block mb-1">
            Actual scorers
          </span>
          <div className="text-white text-sm">
            {[
              ...prediction.actualHomeScorers,
              ...prediction.actualAwayScorers,
            ].length > 0 ? (
              [
                ...prediction.actualHomeScorers,
                ...prediction.actualAwayScorers,
              ].join(", ")
            ) : (
              <span className="text-white/30">
                No goals scored
              </span>
            )}
          </div>
        </div>
      </>
    ) : (
      <div className="flex items-center justify-center h-full">
        <div className="bg-primary-700/30 rounded-lg py-8 px-6 text-center">
          <div className="text-indigo-300 mb-2 text-lg">
            Match Pending
          </div>
          <div className="text-white/50 text-sm">
            Results will appear here after the match
          </div>
        </div>
      </div>
    )}
  </div>
);

const PointsOrChipsDetails = ({ prediction, isPending, expanded, toggleExpanded }) => (
  <div className="flex flex-col items-center justify-center">
    {!isPending ? (
      <>
        <div className="text-xs text-white/50 mb-2">
          Points earned
        </div>
        <div className="bg-primary-700/30 rounded-lg p-4 text-center min-w-[120px]">
          <div className="text-3xl font-bold text-white font-dmSerif">
            {prediction.points}
          </div>
        </div>

        <button
          onClick={toggleExpanded}
          className="text-indigo-300 text-sm hover:text-indigo-200 flex items-center transition-colors mt-4"
        >
          {expanded ? "Hide details" : "View details"}
          <ChevronDownIcon
            className={`ml-1 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </>
    ) : (
      <>
        <div className="text-xs text-white/50 mb-2">
          Applied chips
        </div>
        {prediction.chips && prediction.chips.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-1 mb-4">
            {prediction.chips.map((chip) => (
              <span
                key={chip}
                className="bg-primary-700/60 text-white/80 text-xs py-1 px-2 rounded-full flex items-center"
                title={getChipInfo(chip).description}
              >
                <LightningBoltIcon className="mr-1 w-3 h-3 text-indigo-300" />
                {getChipInfo(chip).name}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-white/50 text-sm mb-4">
            No chips used
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={toggleExpanded}
            className="text-indigo-300 text-sm hover:text-indigo-200 flex items-center transition-colors"
          >
            {expanded ? "Hide details" : "View details"}
            <ChevronDownIcon
              className={`ml-1 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </>
    )}
  </div>
);

const ExpandedDetails = ({ prediction, teamLogos, isPending }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.3 }}
    className="mt-4 pt-4 border-t border-primary-400/20"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h4 className="text-white/70 text-sm font-medium mb-2">
          Prediction Details
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {/* Home team scorers */}
          <ScorersList 
            team={prediction.homeTeam}
            predictedScorers={prediction.homeScorers}
            actualScorers={prediction.actualHomeScorers}
            isPending={isPending}
          />

          {/* Away team scorers */}
          <ScorersList 
            team={prediction.awayTeam}
            predictedScorers={prediction.awayScorers}
            actualScorers={prediction.actualAwayScorers}
            isPending={isPending}
          />
        </div>
      </div>

      <div>
        <h4 className="text-white/70 text-sm font-medium mb-2">
          Applied Chips
        </h4>
        <ChipsList chips={prediction.chips} />

        {!isPending && (
          <PointsBreakdown prediction={prediction} />
        )}
      </div>
    </div>
  </motion.div>
);

const ScorersList = ({ team, predictedScorers, actualScorers, isPending }) => (
  <div className="bg-primary-700/30 rounded-lg p-3">
    <div className="text-white/50 text-xs mb-1">
      {team} Scorers
    </div>
    <div>
      <div className="text-xs uppercase text-white/40 font-medium tracking-wider mb-2">
        Predicted
      </div>
      <div className="text-white text-sm mb-4">
        {predictedScorers.length > 0 ? (
          predictedScorers.map(
            (scorer, i) => (
              <div
                key={i}
                className={`py-1 border-b border-primary-600/30 last:border-0 flex items-center ${
                  !isPending &&
                  isCorrectScorer(
                    scorer,
                    actualScorers
                  )
                    ? "text-green-300"
                    : ""
                }`}
              >
                <span className="bg-indigo-800/30 text-xs rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">
                  {i + 1}
                </span>
                {scorer}
                {!isPending &&
                  isCorrectScorer(
                    scorer,
                    actualScorers
                  ) && (
                    <CheckIcon className="ml-1 text-green-300" />
                  )}
              </div>
            )
          )
        ) : (
          <span className="text-white/30">
            None predicted
          </span>
        )}
      </div>

      {!isPending && (
        <>
          <div className="text-xs uppercase text-white/40 font-medium tracking-wider mb-2">
            Actual
          </div>
          <div className="text-white text-sm">
            {actualScorers.length > 0 ? (
              actualScorers.map(
                (scorer, i) => (
                  <div
                    key={i}
                    className={`py-1 border-b border-primary-600/30 last:border-0 flex items-center ${
                      isCorrectScorer(
                        scorer,
                        predictedScorers
                      )
                        ? "text-teal-300"
                        : ""
                    }`}
                  >
                    <span className="bg-teal-800/30 text-xs rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">
                      {i + 1}
                    </span>
                    {scorer}
                    {isCorrectScorer(
                      scorer,
                      predictedScorers
                    ) && (
                      <CheckIcon className="ml-1 text-teal-300" />
                    )}
                  </div>
                )
              )
            ) : (
              <span className="text-white/30">
                No goals scored
              </span>
            )}
          </div>
        </>
      )}
    </div>
  </div>
);

const ChipsList = ({ chips }) => (
  <>
    {chips.length > 0 ? (
      <div className="space-y-2">
        {chips.map((chip) => (
          <div
            key={chip}
            className="bg-primary-700/30 rounded-lg p-3 flex items-start"
          >
            <div className="bg-indigo-700/50 p-2 rounded mr-2">
              <LightningBoltIcon className="text-indigo-300" />
            </div>
            <div>
              <div className="text-white text-sm font-medium">
                {getChipInfo(chip).name}
              </div>
              <div className="text-white/60 text-xs">
                {getChipInfo(chip).description}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-primary-700/30 rounded-lg p-3 text-white/50 text-sm">
        No chips used for this prediction
      </div>
    )}
  </>
);

const PointsBreakdown = ({ prediction }) => (
  <>
    <h4 className="text-white/70 text-sm font-medium mt-4 mb-2">
      Points Breakdown
    </h4>
    <div className="bg-primary-700/30 rounded-lg p-3">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/70">
            Correct outcome
          </span>
          <span className="text-white">
            {prediction.correct ? "+3" : "0"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/70">
            Exact score
          </span>
          <span className="text-white">
            {prediction.correct &&
            prediction.homeScore ===
              prediction.actualHomeScore &&
            prediction.awayScore ===
              prediction.actualAwayScore
              ? "+3"
              : "0"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/70">
            Scorers
          </span>
          <span className="text-white">
            +
            {prediction.correct
              ? prediction.points - 6
              : prediction.points}
          </span>
        </div>
        <div className="flex justify-between text-sm font-medium border-t border-primary-600/30 pt-2 mt-2">
          <span className="text-white">Total</span>
          <span className="text-white">
            +{prediction.points}
          </span>
        </div>
      </div>
    </div>
  </>
);

export default PredictionCard;