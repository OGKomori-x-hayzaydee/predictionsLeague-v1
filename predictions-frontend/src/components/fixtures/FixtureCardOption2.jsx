import React, { useContext } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ClockIcon, DotFilledIcon, Pencil1Icon } from "@radix-ui/react-icons";
import TeamLogo from "../ui/TeamLogo";
import { LOGO_SIZES } from "../../utils/teamLogos";
import { ThemeContext } from "../../context/ThemeContext";
import { isPredictionDeadlinePassed } from "../../utils/dateUtils";
import { showToast } from "../../services/notificationService";

/**
 * OPTION 2: "SPLIT PANEL" DESIGN
 * Desktop: Two-column card with home/away on separate sides, metadata on top
 * Mobile: Stacks to single column, teams separate panels
 *
 * Key Features:
 * - Clear home/away visual separation with background tints
 * - Team-centric design with larger logos
 * - Prediction shown as overlay badge
 * - Responsive column-to-stack transformation
 */

const FixtureCardOption2 = ({ fixture, selected = false, onClick }) => {
  const { theme } = useContext(ThemeContext);

  const isPredicted = fixture.predicted || fixture.hasPrediction;
  const userPrediction = fixture.userPrediction;
  const deadlinePassed = isPredictionDeadlinePassed(fixture.date);

  const handleClick = () => {
    if (deadlinePassed) {
      showToast("Deadline has passed for this match", "error");
      return;
    }
    onClick(fixture);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all ${
        theme === "dark"
          ? "bg-slate-800 border border-slate-700/50"
          : "bg-white border border-slate-200 shadow-sm hover:shadow-md"
      } ${selected ? "ring-2 ring-teal-500" : ""}`}
    >
      {/* Header Bar */}
      <div
        className={`px-3 py-2 border-b flex items-center justify-between ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700/50"
            : "bg-slate-50 border-slate-200"
        }`}
      >
        <div
          className={`flex items-center gap-2 text-2xs sm:text-xs ${
            theme === "dark" ? "text-slate-400" : "text-slate-600"
          }`}
        >
          <span className="font-medium">{fixture.competition}</span>
          <DotFilledIcon className="w-2 h-2" />
          <ClockIcon className="w-3 h-3" />
          <span className="hidden sm:inline">
            {format(parseISO(fixture.date), "EEE, MMM d 'at' h:mm a")}
          </span>
          <span className="sm:hidden">
            {format(parseISO(fixture.date), "MMM d, h:mm a")}
          </span>
        </div>

        {/* Status Badge */}
        {isPredicted ? (
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-medium group-hover:pr-1 transition-all ${
              theme === "dark"
                ? "bg-teal-900/40 text-teal-400 border border-teal-700/50"
                : "bg-teal-100 text-teal-700 border border-teal-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            <span className="hidden sm:inline">Predicted</span>
            <span className="sm:hidden">✓</span>
            <Pencil1Icon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
          </div>
        ) : (
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-medium ${
              theme === "dark"
                ? "bg-amber-900/60 text-amber-400 border border-amber-700/50"
                : "bg-amber-100 text-amber-700 border border-amber-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="hidden sm:inline">TODO</span>
            <span className="sm:hidden">!</span>
          </div>
        )}
      </div>

      {/* Teams Grid */}
      <div
        className={`grid grid-cols-2 ${
          theme === "dark"
            ? "divide-x divide-slate-700/30"
            : "divide-x divide-slate-200"
        }`}
      >
        {/* Home Team Panel */}
        <div
          className={`p-3 sm:p-4 ${
            theme === "dark"
              ? "bg-gradient-to-br from-blue-950/20 to-transparent"
              : "bg-gradient-to-br from-blue-50/50 to-transparent"
          }`}
        >
          <div className="flex flex-col items-center text-center gap-2 sm:gap-3 w-full">
            <div className="flex items-center justify-center w-full">
              <TeamLogo
                teamName={fixture.homeTeam}
                size={LOGO_SIZES.sm}
                theme={theme}
                className="flex-shrink-0"
              />
            </div>
            <div className="w-full">
              <div
                className={`font-bold text-xs sm:text-sm mb-0.5 ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}
              >
                {fixture.homeTeam}
              </div>
              <div
                className={`text-2xs sm:text-xs ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                HOME
              </div>
            </div>

            {/* Score Display - Actual Match Score Only */}
            {fixture.homeScore !== null && fixture.homeScore !== undefined ? (
              <div
                className={`w-full py-1.5 sm:py-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-slate-900/60 border border-slate-700/50"
                    : "bg-white border border-slate-200"
                }`}
              >
                <div
                  className={`text-xl sm:text-3xl font-bold ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  {fixture.homeScore}
                </div>
              </div>
            ) : (
              <div
                className={`w-full py-1.5 sm:py-2 rounded-lg border-2 border-dashed ${
                  theme === "dark"
                    ? "border-slate-700 text-slate-600"
                    : "border-slate-300 text-slate-400"
                }`}
              >
                <div className="text-xl sm:text-3xl font-light">-</div>
              </div>
            )}
          </div>
        </div>

        {/* Away Team Panel */}
        <div
          className={`p-3 sm:p-4 ${
            theme === "dark"
              ? "bg-gradient-to-bl from-red-950/20 to-transparent"
              : "bg-gradient-to-bl from-red-50/50 to-transparent"
          }`}
        >
          <div className="flex flex-col items-center text-center gap-2 sm:gap-3 w-full">
            <div className="flex items-center justify-center w-full">
              <TeamLogo
                teamName={fixture.awayTeam}
                size={LOGO_SIZES.sm}
                theme={theme}
                className="flex-shrink-0"
              />
            </div>
            <div className="w-full">
              <div
                className={`font-bold text-xs sm:text-sm mb-0.5 ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}
              >
                {fixture.awayTeam}
              </div>
              <div
                className={`text-2xs sm:text-xs ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                AWAY
              </div>
            </div>

            {/* Score Display - Actual Match Score Only */}
            {fixture.awayScore !== null && fixture.awayScore !== undefined ? (
              <div
                className={`w-full py-1.5 sm:py-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-slate-900/60 border border-slate-700/50"
                    : "bg-white border border-slate-200"
                }`}
              >
                <div
                  className={`text-xl sm:text-3xl font-bold ${
                    theme === "dark" ? "text-white" : "text-slate-900"
                  }`}
                >
                  {fixture.awayScore}
                </div>
              </div>
            ) : (
              <div
                className={`w-full py-1.5 sm:py-2 rounded-lg border-2 border-dashed ${
                  theme === "dark"
                    ? "border-slate-700 text-slate-600"
                    : "border-slate-300 text-slate-400"
                }`}
              >
                <div className="text-xl sm:text-3xl font-light">-</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actual Scorers Section - Only show if match is finished and scorers data exists */}
      {fixture.status === "FINISHED" &&
        (fixture.actualHomeScorers || fixture.actualAwayScorers) && (
          <div
            className={`px-3 py-2 border-t ${
              theme === "dark"
                ? "bg-slate-900/20 border-slate-700/50"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div
              className={`text-2xs sm:text-xs font-medium mb-2 text-center ${
                theme === "dark" ? "text-white/80" : "text-slate-700"
              }`}
            >
              Goalscorers
            </div>
            <div className={`grid grid-cols-2 gap-3 text-2xs sm:text-xs`}>
              {/* Home Scorers */}
              <div className="pr-3">
                {fixture.actualHomeScorers &&
                fixture.actualHomeScorers.length > 0 ? (
                  <div
                    className={`space-y-1 ${
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    {fixture.actualHomeScorers.map((scorer, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <span className="text-blue-500">⚽</span>
                        <span>{scorer}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`text-center ${
                      theme === "dark" ? "text-white/40" : "text-slate-400"
                    }`}
                  >
                    No scorers
                  </div>
                )}
              </div>

              {/* Away Scorers */}
              <div className="pl-3">
                {fixture.actualAwayScorers &&
                fixture.actualAwayScorers.length > 0 ? (
                  <div
                    className={`space-y-1 ${
                      theme === "dark" ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    {fixture.actualAwayScorers.map((scorer, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 justify-end"
                      >
                        <span>{scorer}</span>
                        <span className="text-red-500">⚽</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`text-center ${
                      theme === "dark" ? "text-white/40" : "text-slate-400"
                    }`}
                  >
                    No scorers
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Footer - Venue */}
      <div
        className={`flex items-center justify-center px-3 py-1.5 sm:py-2 border-t text-2xs sm:text-xs ${
          theme === "dark"
            ? "bg-slate-900/30 border-slate-700/50 text-slate-500"
            : "bg-slate-50 border-slate-200 text-slate-600"
        }`}
      >
        <span>📍 {fixture.venue}</span>
      </div>

      {/* Animated Hover Overlay - Only show if deadline hasn't passed */}
      {!deadlinePassed && (
        <div
          className={`absolute inset-0 flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${
            theme === "dark" ? "bg-slate-900/95" : "bg-white/95"
          }`}
        >
          <div className="text-center px-6">
            <motion.div
              initial={{ scale: 0.95, y: 5 }}
              whileInView={{ scale: 1, y: 0 }}
              className="group-hover:animate-pulse-subtle"
            >
              <div
                className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl font-outfit font-semibold text-sm sm:text-base ${
                  isPredicted
                    ? theme === "dark"
                      ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg shadow-teal-500/50"
                      : "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg shadow-teal-400/50"
                    : theme === "dark"
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/50"
                    : "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-400/50"
                }`}
              >
                {isPredicted ? (
                  <>
                    <Pencil1Icon className="w-5 h-5" />
                    <span>Click to Edit Prediction</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Click to Make Prediction</span>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FixtureCardOption2;
