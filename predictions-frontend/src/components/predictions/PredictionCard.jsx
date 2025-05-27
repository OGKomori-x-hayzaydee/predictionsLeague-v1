import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  CheckIcon,
  Cross2Icon,
  LightningBoltIcon,
  Pencil1Icon,
  ChevronDownIcon,
  CalendarIcon,
  TargetIcon,
  ClockIcon,
} from "@radix-ui/react-icons";
import { getChipInfo, isCorrectScorer } from "../../utils/chipUtils";

const PredictionCard = ({ prediction, teamLogos, onEditClick }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const isPending = prediction.status === "pending";
  const matchDate = new Date(prediction.date);
  const formattedDate = format(matchDate, "MMM d, yyyy");

  const getStatusConfig = () => {
    if (isPending) {
      return {
        bgColor: "bg-amber-500/10",
        textColor: "text-amber-300",
        borderColor: "border-amber-500/20",
        icon: ClockIcon,
        label: "Pending",
      };
    }
    if (prediction.correct) {
      return {
        bgColor: "bg-emerald-500/10",
        textColor: "text-emerald-300",
        borderColor: "border-emerald-500/20",
        icon: CheckIcon,
        label: "Correct",
      };
    }
    return {
      bgColor: "bg-red-500/10",
      textColor: "text-red-300",
      borderColor: "border-red-500/20",
      icon: Cross2Icon,
      label: "Incorrect",
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative  backdrop-blur-xl rounded-2xl border border-slate-700/50 transition-all duration-300 overflow-hidden"
    >
      {/* Status indicator bar */}
      {/* <div
        className={`h-1 w-full ${statusConfig.bgColor.replace("/10", "/50")}`}
      /> */}

      {/* Main content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-400">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{formattedDate}</span>
              <span className="text-xs">•</span>
              <span className="text-sm">GW{prediction.gameweek}</span>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}
          >
            <statusConfig.icon
              className={`w-3.5 h-3.5 ${statusConfig.textColor}`}
            />
            <span className={`text-xs font-semibold ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>{" "}
        {/* Match prediction vs actual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Your Prediction */}
          <PredictionSection
            prediction={prediction}
            teamLogos={teamLogos}
            type="prediction"
          />

          {/* Actual Result or Pending State */}
          {!isPending ? (
            <ActualResultSection
              prediction={prediction}
              teamLogos={teamLogos}
            />
          ) : (
            <PendingStateSection
              prediction={prediction}
              formattedDate={formattedDate}
            />
          )}
        </div>{" "}
        {/* Bottom section */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-4">
            {/* Points/Chips indicator */}
            {!isPending ? (
              <div className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 ${
                    prediction.points <= 0
                      ? "bg-red-900/50 rounded-lg px-3 py-2"
                      : "bg-teal-800/50 rounded-lg px-3 py-2"
                  }`}
                >
                  {/* <TrophyIcon className="w-4 h-4 text-amber-400" /> */}
                  <span
                    className={`${
                      prediction.points <= 0 ? "text-red-300" : "text-teal-500"
                    } font-semibold`}
                  >
                    {prediction.points}
                  </span>
                  <span
                    className={`${
                      prediction.points <= 0 ? "text-red-300" : "text-teal-400"
                    } text-sm`}
                  >
                    pts
                  </span>
                </div>
              </div>
            ) : (
              <ChipsDisplay chips={prediction.chips} />
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Expand button */}
            <button
              onClick={toggleExpanded}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors text-sm font-medium"
            >
              {expanded ? "Less details" : "More details"}
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-200 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Edit button for pending predictions */}
            {isPending && (
              <button
                onClick={() => onEditClick(prediction)}
                className="flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 rounded-lg px-4 py-2 transition-all duration-200 text-sm font-medium border border-indigo-500/20"
              >
                <Pencil1Icon className="w-4 h-4" />
                Edit Prediction
              </button>
            )}
          </div>
        </div>
        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <ExpandedDetails
              prediction={prediction}
              teamLogos={teamLogos}
              isPending={isPending}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const PredictionSection = ({ prediction, teamLogos, type }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-3">
      <TargetIcon className="w-4 h-4 text-indigo-400" />
      <h3 className="text-sm font-semibold text-slate-300">Your Prediction</h3>
    </div>

    {/* Teams and score */}
    <div className=" rounded-xl p-4">
      <div className="flex items-center justify-between">
        {/* Home team */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 bg-slate-700/50 rounded-xl p-2 mb-2 flex items-center justify-center">
            <img
              src={teamLogos[prediction.homeTeam]}
              alt={prediction.homeTeam}
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-xs font-medium text-slate-300 text-center">
            {prediction.homeTeam}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-3 mx-4">
          <div className="bg-indigo-600/20 rounded-lg px-4 py-2 border border-indigo-500/20">
            <span className="text-xl font-bold text-white">
              {prediction.homeScore}
            </span>
          </div>
          <span className="text-slate-500 font-medium">-</span>
          <div className="bg-indigo-600/20 rounded-lg px-4 py-2 border border-indigo-500/20">
            <span className="text-xl font-bold text-white">
              {prediction.awayScore}
            </span>
          </div>
        </div>

        {/* Away team */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 bg-slate-700/50 rounded-xl p-2 mb-2 flex items-center justify-center">
            <img
              src={teamLogos[prediction.awayTeam]}
              alt={prediction.awayTeam}
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-xs font-medium text-slate-300 text-center">
            {prediction.awayTeam}
          </span>
        </div>
      </div>
    </div>

    {/* Predicted scorers */}
    <div className="bg-slate-800/20 rounded-lg p-3 border border-slate-700/20">
      <div className="text-xs font-medium text-slate-400 mb-2">
        Predicted Scorers
      </div>
      <div className="text-sm text-slate-300">
        {[...prediction.homeScorers, ...prediction.awayScorers].length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {[...prediction.homeScorers, ...prediction.awayScorers].map(
              (scorer, index) => (
                <span
                  key={index}
                  className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded-md text-xs"
                >
                  {scorer}
                </span>
              )
            )}
          </div>
        ) : (
          <span className="text-slate-500 text-xs">No scorers predicted</span>
        )}
      </div>
    </div>
  </div>
);

const ActualResultSection = ({ prediction, teamLogos }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-3">
      <CheckIcon className="w-4 h-4 text-emerald-400" />
      <h3 className="text-sm font-semibold text-slate-300">Actual Result</h3>
    </div>

    {/* Teams and score */}
    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
      <div className="flex items-center justify-between">
        {/* Home team */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 bg-slate-700/50 rounded-xl p-2 mb-2 flex items-center justify-center">
            <img
              src={teamLogos[prediction.homeTeam]}
              alt={prediction.homeTeam}
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-xs font-medium text-slate-300 text-center">
            {prediction.homeTeam}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-3 mx-4">
          <div className="bg-emerald-600/20 rounded-lg px-4 py-2 border border-emerald-500/20">
            <span className="text-xl font-bold text-white">
              {prediction.actualHomeScore}
            </span>
          </div>
          <span className="text-slate-500 font-medium">-</span>
          <div className="bg-emerald-600/20 rounded-lg px-4 py-2 border border-emerald-500/20">
            <span className="text-xl font-bold text-white">
              {prediction.actualAwayScore}
            </span>
          </div>
        </div>

        {/* Away team */}
        <div className="flex flex-col items-center flex-1">
          <div className="w-12 h-12 bg-slate-700/50 rounded-xl p-2 mb-2 flex items-center justify-center">
            <img
              src={teamLogos[prediction.awayTeam]}
              alt={prediction.awayTeam}
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="text-xs font-medium text-slate-300 text-center">
            {prediction.awayTeam}
          </span>
        </div>
      </div>
    </div>

    {/* Actual scorers */}
    <div className="bg-slate-800/20 rounded-lg p-3 border border-slate-700/20">
      <div className="text-xs font-medium text-slate-400 mb-2">
        Actual Scorers
      </div>
      <div className="text-sm text-slate-300">
        {[...prediction.actualHomeScorers, ...prediction.actualAwayScorers]
          .length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {[
              ...prediction.actualHomeScorers,
              ...prediction.actualAwayScorers,
            ].map((scorer, index) => (
              <span
                key={index}
                className="bg-emerald-700/50 text-emerald-300 px-2 py-1 rounded-md text-xs"
              >
                {scorer}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-slate-500 text-xs">No goals scored</span>
        )}
      </div>
    </div>
  </div>
);

const PendingStateSection = ({ prediction, formattedDate }) => (
  <div className="space-y-4 flex flex-col h-full justify-center">
    {/* Pending match display */}
    <div className="rounded-xl p-6 flex flex-col items-center justify-center h-full min-h-[140px]">
      <div className="flex items-center gap-3 mb-4">
        <ClockIcon className="w-6 h-6 text-indigo-400" />
        <span className="text-lg font-semibold text-indigo-300">
          Match Pending
        </span>
      </div>

      <div className="text-center space-y-2">
        <p className="text-slate-400 text-sm">
          This match hasn't been played yet
        </p>
        <p className="text-slate-500 text-xs">
          Results will appear here after the match is completed
        </p>
      </div>
    </div>
  </div>
);

const ChipsDisplay = ({ chips }) => (
  <div className="flex items-center gap-2">
    {chips && chips.length > 0 ? (
      <div className="flex items-center gap-2">
        <LightningBoltIcon className="w-4 h-4 text-teal-400" />
        <div className="flex gap-1">
          {chips.map((chip) => (
            <span
              key={chip}
              className="bg-teal-500/10 text-teal-300 text-xs px-2 py-1 rounded-md border border-teal-500/20"
              title={getChipInfo(chip).description}
            >
              {getChipInfo(chip).name}
            </span>
          ))}
        </div>
      </div>
    ) : (
      <span className="text-slate-500 text-sm">No chips used</span>
    )}
  </div>
);

const ExpandedDetails = ({ prediction, teamLogos, isPending }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="mt-6 pt-6 border-t border-slate-700/50"
  >
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Detailed scorers breakdown */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <TargetIcon className="w-4 h-4 text-indigo-400" />
          Scorer Analysis
        </h4>
        <div className="space-y-3">
          <ScorerBreakdown
            team={prediction.homeTeam}
            teamLogo={teamLogos[prediction.homeTeam]}
            predictedScorers={prediction.homeScorers}
            actualScorers={prediction.actualHomeScorers}
            isPending={isPending}
          />
          <ScorerBreakdown
            team={prediction.awayTeam}
            teamLogo={teamLogos[prediction.awayTeam]}
            predictedScorers={prediction.awayScorers}
            actualScorers={prediction.actualAwayScorers}
            isPending={isPending}
          />
        </div>
      </div>

      {/* Points and chips breakdown */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <LightningBoltIcon className="w-4 h-4 text-teal-400" />
          Details
        </h4>

        <DetailedChipsList chips={prediction.chips} />

        {!isPending && <PointsBreakdown prediction={prediction} />}
      </div>
    </div>
  </motion.div>
);

const ScorerBreakdown = ({
  team,
  teamLogo,
  predictedScorers,
  actualScorers,
  isPending,
}) => (
  <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 bg-slate-700/50 rounded-lg p-1.5 flex items-center justify-center">
        <img
          src={teamLogo}
          alt={team}
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-sm font-medium text-slate-300">{team}</span>
    </div>

    <div className="space-y-3">
      {/* Predicted */}
      <div>
        <div className="text-xs font-medium text-slate-400 mb-2">Predicted</div>
        {predictedScorers.length > 0 ? (
          <div className="space-y-1">
            {predictedScorers.map((scorer, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 text-sm ${
                  !isPending && isCorrectScorer(scorer, actualScorers)
                    ? "text-emerald-300"
                    : "text-slate-300"
                }`}
              >
                <span className="bg-indigo-600/20 text-indigo-300 text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                  {index + 1}
                </span>
                {scorer}
                {!isPending && isCorrectScorer(scorer, actualScorers) && (
                  <CheckIcon className="w-3 h-3 text-emerald-300" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <span className="text-slate-500 text-sm">None predicted</span>
        )}
      </div>

      {/* Actual (only show if not pending) */}
      {!isPending && (
        <div>
          <div className="text-xs font-medium text-slate-400 mb-2">Actual</div>
          {actualScorers.length > 0 ? (
            <div className="space-y-1">
              {actualScorers.map((scorer, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 text-sm ${
                    isCorrectScorer(scorer, predictedScorers)
                      ? "text-emerald-300"
                      : "text-slate-300"
                  }`}
                >
                  <span className="bg-emerald-600/20 text-emerald-300 text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                    {index + 1}
                  </span>
                  {scorer}
                  {isCorrectScorer(scorer, predictedScorers) && (
                    <CheckIcon className="w-3 h-3 text-emerald-300" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-slate-500 text-sm">No goals scored</span>
          )}
        </div>
      )}
    </div>
  </div>
);

const DetailedChipsList = ({ chips }) => (
  <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
    <div className="text-sm font-medium text-slate-300 mb-3">Applied Chips</div>
    {chips && chips.length > 0 ? (
      <div className="space-y-3">
        {chips.map((chip) => (
          <div key={chip} className="flex items-start gap-3">
            <div className="bg-teal-500/20 p-2 rounded-lg border border-teal-500/20">
              {<LightningBoltIcon className="w-4 h-4 text-teal-400" />}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-300">
                {getChipInfo(chip).name}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {getChipInfo(chip).description}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-slate-500 text-sm">
        No chips applied to this prediction
      </div>
    )}
  </div>
);

const PointsBreakdown = ({ prediction }) => (
  <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
    <div className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
      {/* <TrophyIcon className="w-4 h-4 text-amber-400" /> */}
      Points Breakdown
    </div>
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-400">Correct outcome</span>
        <span className="text-slate-300 font-medium">
          {prediction.correct ? "+3" : "0"} pts
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-400">Exact score</span>
        <span className="text-slate-300 font-medium">
          {prediction.correct &&
          prediction.homeScore === prediction.actualHomeScore &&
          prediction.awayScore === prediction.actualAwayScore
            ? "+3"
            : "0"}{" "}
          pts
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-400">Scorer predictions</span>
        <span className="text-slate-300 font-medium">
          +{prediction.correct ? prediction.points - 6 : prediction.points} pts
        </span>
      </div>
      <div className="flex justify-between items-center text-sm font-semibold border-t border-slate-700/50 pt-2 mt-3">
        <span className="text-slate-300">Total</span>
        <span className="text-amber-400">+{prediction.points} pts</span>
      </div>
    </div>
  </div>
);

export default PredictionCard;
