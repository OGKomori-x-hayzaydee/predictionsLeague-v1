import React, { useContext } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ClockIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import TeamLogo from "../ui/TeamLogo";
import { LOGO_SIZES } from "../../utils/teamLogos";
import { ThemeContext } from "../../context/ThemeContext";

/**
 * OPTION 3: "COMPACT LIST" DESIGN
 * Desktop: Wide horizontal list item, all info in single row
 * Mobile: Maintains horizontal layout but condenses intelligently
 * 
 * Key Features:
 * - Information-dense, scannable design
 * - All data visible without expansion
 * - Prediction inline with team matchup
 * - Status shown via left accent + right indicator
 * - Minimal height for maximum fixtures per screen
 */

const FixtureCardOption3 = ({
  fixture,
  selected = false,
  onClick,
}) => {
  const { theme } = useContext(ThemeContext);

  const isPredicted = fixture.predicted || fixture.hasPrediction;
  const userPrediction = fixture.userPrediction;

  return (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(fixture)}
      className={`relative rounded-lg cursor-pointer transition-all ${
        theme === "dark"
          ? "bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50"
          : "bg-white hover:bg-slate-50 border border-slate-200 shadow-sm"
      } ${
        selected
          ? "ring-2 ring-teal-500"
          : ""
      }`}
    >
      {/* Left Status Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
        isPredicted
          ? "bg-teal-500"
          : "bg-amber-500"
      }`} />

      <div className="pl-3 pr-2 py-2 sm:py-3">
        {/* Desktop: Single Row Layout */}
        <div className="hidden sm:grid sm:grid-cols-[140px_1fr_140px_100px_120px_24px] sm:gap-4 sm:items-center">
          {/* Time & Competition */}
          <div className={`text-xs ${
            theme === "dark" ? "text-slate-400" : "text-slate-600"
          }`}>
            <div className="flex items-center gap-1 mb-0.5">
              <ClockIcon className="w-3 h-3" />
              <span className="font-medium">
                {format(parseISO(fixture.date), "h:mm a")}
              </span>
            </div>
            <div className="text-2xs truncate">
              {format(parseISO(fixture.date), "EEE, MMM d")}
            </div>
          </div>

          {/* Home Team */}
          <div className="flex items-center gap-2 justify-end">
            <span className={`font-semibold text-sm truncate ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              {fixture.homeTeam}
            </span>
            <TeamLogo
              teamName={fixture.homeTeam}
              size={LOGO_SIZES.sm}
              theme={theme}
              className="flex-shrink-0 w-8 h-8"
            />
          </div>

          {/* Score/Prediction */}
          <div className="flex items-center justify-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              userPrediction
                ? theme === "dark"
                  ? "bg-teal-900/30 border border-teal-700/50"
                  : "bg-teal-50 border border-teal-200"
                : theme === "dark"
                ? "bg-slate-900/60 border border-slate-700/50"
                : "bg-slate-100 border border-slate-200"
            }`}>
              <span className={`text-base font-bold ${
                userPrediction
                  ? theme === "dark" ? "text-teal-400" : "text-teal-600"
                  : theme === "dark" ? "text-slate-600" : "text-slate-400"
              }`}>
                {userPrediction ? userPrediction.homeScore : "-"}
              </span>
              <span className={`text-xs ${
                theme === "dark" ? "text-slate-500" : "text-slate-400"
              }`}>
                :
              </span>
              <span className={`text-base font-bold ${
                userPrediction
                  ? theme === "dark" ? "text-teal-400" : "text-teal-600"
                  : theme === "dark" ? "text-slate-600" : "text-slate-400"
              }`}>
                {userPrediction ? userPrediction.awayScore : "-"}
              </span>
            </div>
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-2">
            <TeamLogo
              teamName={fixture.awayTeam}
              size={LOGO_SIZES.sm}
              theme={theme}
              className="flex-shrink-0 w-8 h-8"
            />
            <span className={`font-semibold text-sm truncate ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              {fixture.awayTeam}
            </span>
          </div>

          {/* Competition */}
          <div className={`text-xs truncate ${
            theme === "dark" ? "text-slate-500" : "text-slate-600"
          }`}>
            {fixture.competition}
          </div>

          {/* Arrow */}
          <ChevronRightIcon className={`w-5 h-5 ${
            theme === "dark" ? "text-slate-600" : "text-slate-400"
          }`} />
        </div>

        {/* Mobile: Compact Two-Row Layout */}
        <div className="sm:hidden space-y-2">
          {/* Row 1: Time + Teams + Score */}
          <div className="flex items-center gap-2">
            {/* Time */}
            <div className={`flex items-center gap-0.5 text-2xs flex-shrink-0 ${
              theme === "dark" ? "text-slate-500" : "text-slate-600"
            }`}>
              <ClockIcon className="w-2.5 h-2.5" />
              <span>{format(parseISO(fixture.date), "h:mm")}</span>
            </div>

            {/* Teams */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <TeamLogo
                teamName={fixture.homeTeam}
                size={LOGO_SIZES.sm}
                theme={theme}
                className="flex-shrink-0 w-6 h-6"
              />
              <span className={`font-semibold text-2xs truncate ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}>
                {fixture.homeTeam}
              </span>
            </div>

            {/* Score */}
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
              userPrediction
                ? theme === "dark"
                  ? "bg-teal-900/30 text-teal-400"
                  : "bg-teal-50 text-teal-600"
                : theme === "dark"
                ? "bg-slate-900/60 text-slate-600"
                : "bg-slate-100 text-slate-400"
            }`}>
              <span className="text-xs font-bold">
                {userPrediction ? userPrediction.homeScore : "-"}
              </span>
              <span className="text-2xs">:</span>
              <span className="text-xs font-bold">
                {userPrediction ? userPrediction.awayScore : "-"}
              </span>
            </div>

            {/* Away Team */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
              <span className={`font-semibold text-2xs truncate text-right ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}>
                {fixture.awayTeam}
              </span>
              <TeamLogo
                teamName={fixture.awayTeam}
                size={LOGO_SIZES.sm}
                theme={theme}
                className="flex-shrink-0 w-6 h-6"
              />
            </div>
          </div>

          {/* Row 2: Date + Competition */}
          <div className={`flex items-center justify-between text-2xs ${
            theme === "dark" ? "text-slate-500" : "text-slate-600"
          }`}>
            <span>{format(parseISO(fixture.date), "EEE, MMM d")}</span>
            <span className="truncate ml-2">{fixture.competition}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FixtureCardOption3;
