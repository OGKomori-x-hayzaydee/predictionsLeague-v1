import React, { useContext } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ClockIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import TeamLogo from "../ui/TeamLogo";
import { LOGO_SIZES } from "../../utils/teamLogos";
import { ThemeContext } from "../../context/ThemeContext";

/**
 * OPTION 1: "MATCH TICKET" DESIGN
 * Desktop: Wide horizontal card with teams side-by-side, center score area
 * Mobile: Compact horizontal with smaller elements, maintains ticket aesthetic
 * 
 * Key Features:
 * - Ticket-style layout with perforated divider effect
 * - Central score/prediction zone
 * - Status indicated by left border accent
 * - Clean, symmetric design
 */

const FixtureCardOption1 = ({
  fixture,
  selected = false,
  onClick,
}) => {
  const { theme } = useContext(ThemeContext);

  const isPredicted = fixture.predicted || fixture.hasPrediction;
  const userPrediction = fixture.userPrediction;

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(fixture)}
      className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${
        theme === "dark"
          ? "bg-slate-800/50 border border-slate-700/50 shadow-md"
          : "bg-white border border-slate-200 shadow-sm hover:shadow-md"
      } ${
        selected
          ? "ring-2 ring-teal-500 ring-offset-2 ring-offset-slate-900"
          : ""
      }`}
    >
      {/* Status Border Accent */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          isPredicted
            ? "bg-gradient-to-b from-teal-500 to-teal-600"
            : "bg-gradient-to-b from-amber-500 to-amber-600"
        }`}
      />

      {/* Card Content */}
      <div className="pl-4 pr-3 py-3 sm:py-4">
        {/* Header: Competition & Time */}
        <div className={`flex items-center justify-between mb-3 text-2xs sm:text-xs ${
          theme === "dark" ? "text-slate-400" : "text-slate-500"
        }`}>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{fixture.competition}</span>
            {isPredicted && (
              <CheckCircledIcon className="w-3 h-3 text-teal-500" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            <span className="hidden sm:inline">
              {format(parseISO(fixture.date), "EEE, MMM d · h:mm a")}
            </span>
            <span className="sm:hidden">
              {format(parseISO(fixture.date), "MMM d · h:mm a")}
            </span>
          </div>
        </div>

        {/* Main Content: Teams + Score Area */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center">
          {/* Home Team */}
          <div className="flex items-center gap-2 min-w-0">
            <TeamLogo
              teamName={fixture.homeTeam}
              size={LOGO_SIZES.md}
              theme={theme}
              className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12"
            />
            <div className="min-w-0 flex-1">
              <div className={`font-semibold text-xs sm:text-base truncate ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}>
                {fixture.homeTeam}
              </div>
              <div className={`text-2xs sm:text-xs ${
                theme === "dark" ? "text-slate-500" : "text-slate-600"
              }`}>
                Home
              </div>
            </div>
          </div>

          {/* Center: Score/Prediction Zone */}
          <div className={`flex flex-col items-center justify-center px-2 sm:px-4 py-2 rounded-lg min-w-[60px] sm:min-w-[80px] ${
            theme === "dark" 
              ? "bg-slate-900/50 border border-slate-700/30" 
              : "bg-slate-50 border border-slate-200"
          }`}>
            {userPrediction ? (
              <>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className={`text-base sm:text-2xl font-bold ${
                    theme === "dark" ? "text-teal-400" : "text-teal-600"
                  }`}>
                    {userPrediction.homeScore}
                  </span>
                  <span className={`text-xs sm:text-sm ${
                    theme === "dark" ? "text-slate-500" : "text-slate-400"
                  }`}>
                    -
                  </span>
                  <span className={`text-base sm:text-2xl font-bold ${
                    theme === "dark" ? "text-teal-400" : "text-teal-600"
                  }`}>
                    {userPrediction.awayScore}
                  </span>
                </div>
                <div className={`text-2xs sm:text-xs mt-0.5 ${
                  theme === "dark" ? "text-teal-500" : "text-teal-600"
                }`}>
                  Predicted
                </div>
              </>
            ) : (
              <>
                <div className={`text-xl sm:text-3xl font-light ${
                  theme === "dark" ? "text-slate-600" : "text-slate-300"
                }`}>
                  -
                </div>
                <div className={`text-2xs sm:text-xs mt-0.5 ${
                  theme === "dark" ? "text-slate-600" : "text-slate-400"
                }`}>
                  Predict
                </div>
              </>
            )}
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-2 min-w-0 justify-end">
            <div className="min-w-0 flex-1 text-right">
              <div className={`font-semibold text-xs sm:text-base truncate ${
                theme === "dark" ? "text-white" : "text-slate-900"
              }`}>
                {fixture.awayTeam}
              </div>
              <div className={`text-2xs sm:text-xs ${
                theme === "dark" ? "text-slate-500" : "text-slate-600"
              }`}>
                Away
              </div>
            </div>
            <TeamLogo
              teamName={fixture.awayTeam}
              size={LOGO_SIZES.md}
              theme={theme}
              className="flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12"
            />
          </div>
        </div>

        {/* Footer: Venue (desktop only) */}
        <div className={`hidden sm:flex items-center justify-center mt-3 pt-3 border-t text-xs ${
          theme === "dark" 
            ? "text-slate-500 border-slate-700/50" 
            : "text-slate-600 border-slate-200"
        }`}>
          <span>📍 {fixture.venue}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FixtureCardOption1;
