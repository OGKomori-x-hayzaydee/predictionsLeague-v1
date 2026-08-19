import React, { useContext } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ClockIcon } from "@radix-ui/react-icons";
import { getTeamLogo } from "../../utils/teamUtils";
import TeamLogo from "../ui/TeamLogo";
import { LOGO_SIZES } from "../../utils/teamLogos";
import { ThemeContext } from "../../context/ThemeContext";
import { padding, textScale } from "../../utils/mobileScaleUtils";
import { isPredictionDeadlinePassed } from "../../utils/dateUtils";
import { showToast } from "../../services/notificationService";

const FixtureCard = ({
  fixture,
  selected = false,
  onClick,
  teamLogos = {},
}) => {
  // Get theme context
  const { theme } = useContext(ThemeContext);
  const deadlinePassed = isPredictionDeadlinePassed(fixture.date);

  // Use getTeamLogo utility with fallback to context logos
  const getLogoSrc = (teamName) => {
    return teamLogos[teamName] || getTeamLogo(teamName);
  };
  
  const handleClick = () => {
    if (deadlinePassed) {
      showToast('Deadline has passed for this match', 'error');
      return;
    }
    onClick(fixture);
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`border rounded-lg ${padding.cardCompact} ${
        theme === "dark"
          ? "bg-slate-800/50 border-slate-600/50 shadow-sm"
          : "border-slate-300 bg-white shadow-sm"
      } transition-all ${
        selected
          ? theme === "dark"
            ? "ring-2 ring-teal-400"
            : "ring-2 ring-teal-500"
          : ""
      }`}
    >
      {" "}
      <div
        className={`flex justify-between items-center text-2xs sm:text-xs ${
          theme === "dark" ? "text-white/60" : "text-slate-500"
        } mb-1.5 sm:mb-2`}
      >
        <span className="truncate mr-2">{fixture.competition}</span>
        <div className="text-right flex-shrink-0">
          <div className="flex items-center justify-end">
            <ClockIcon className="mr-0.5 sm:mr-1 w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden sm:inline">
              {format(parseISO(fixture.date), "MMM d, yyyy")} |{" "}
              {format(parseISO(fixture.date), "h:mm a")}
            </span>
            <span className="sm:hidden">
              {format(parseISO(fixture.date), "MMM d")} |{" "}
              {format(parseISO(fixture.date), "h:mm a")}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        {/* Home Team */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <TeamLogo
            teamName={fixture.homeTeam}
            size={LOGO_SIZES.sm}
            theme={theme}
            className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8"
          />
          <span
            className={`${
              theme === "dark" ? "text-white" : "text-slate-800"
            } font-medium text-2xs sm:text-xs truncate`}
          >
            {fixture.homeTeam}
          </span>
        </div>

        {/* VS Divider */}
        <span
          className={`${
            theme === "dark" ? "text-slate-400" : "text-slate-500"
          } font-outfit text-2xs sm:text-xs flex-shrink-0 px-1`}
        >
          vs
        </span>

        {/* Away Team */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
          <span
            className={`${
              theme === "dark" ? "text-white" : "text-slate-800"
            } font-medium text-2xs sm:text-xs truncate text-right`}
          >
            {fixture.awayTeam}
          </span>
          <TeamLogo
            teamName={fixture.awayTeam}
            size={LOGO_SIZES.sm}
            theme={theme}
            className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8"
          />
        </div>
      </div>
      <div className="mt-1.5 sm:mt-2 flex justify-between items-center gap-2">
        <div
          className={`text-2xs sm:text-xs ${
            theme === "dark" ? "text-white/60" : "text-slate-500"
          } truncate flex-1`}
        >
          {fixture.venue}
        </div>
        {/* Only show prediction status badge if deadline hasn't passed */}
        {!deadlinePassed && (
          <div
            className={`text-2xs sm:text-xs py-0.5 px-1.5 sm:py-1 sm:px-2 rounded whitespace-nowrap flex-shrink-0 ${
              fixture.predicted
                ? theme === "dark"
                  ? "bg-indigo-900/30 text-indigo-300"
                  : "bg-indigo-100 text-indigo-700 border border-indigo-200"
                : theme === "dark"
                ? "bg-teal-900/30 text-teal-300"
                : "bg-teal-100 text-teal-700 border border-teal-200"
            }`}
          >
            <span className="hidden sm:inline">
              {fixture.predicted ? "Prediction Made" : "Prediction Required"}
            </span>
            <span className="sm:hidden">
              {fixture.predicted ? "Done" : "TODO"}
            </span>
          </div>
        )}
      </div>
      
      {/* Actual Scorers Section - Only show if match is finished and scorers data exists */}
      {fixture.status === 'FINISHED' && (fixture.actualHomeScorers || fixture.actualAwayScorers) && (
        <div className={`mt-2 pt-2 border-t ${theme === "dark" ? "border-slate-700" : "border-slate-200"}`}>
          <div className="text-2xs sm:text-xs font-medium mb-1 ${theme === 'dark' ? 'text-white/80' : 'text-slate-700'}">
            ⚽ Scorers
          </div>
          <div className="flex justify-between gap-4 text-2xs sm:text-xs">
            {/* Home Scorers */}
            <div className="flex-1">
              <div className={`font-medium mb-0.5 ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>
                {fixture.homeTeam}
              </div>
              {fixture.actualHomeScorers && fixture.actualHomeScorers.length > 0 ? (
                <div className={`space-y-0.5 ${theme === 'dark' ? 'text-white/60' : 'text-slate-500'}`}>
                  {fixture.actualHomeScorers.map((scorer, idx) => (
                    <div key={idx}>• {scorer}</div>
                  ))}
                </div>
              ) : (
                <div className={`${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>
                  No scorers
                </div>
              )}
            </div>
            
            {/* Away Scorers */}
            <div className="flex-1 text-right">
              <div className={`font-medium mb-0.5 ${theme === 'dark' ? 'text-white/70' : 'text-slate-600'}`}>
                {fixture.awayTeam}
              </div>
              {fixture.actualAwayScorers && fixture.actualAwayScorers.length > 0 ? (
                <div className={`space-y-0.5 ${theme === 'dark' ? 'text-white/60' : 'text-slate-500'}`}>
                  {fixture.actualAwayScorers.map((scorer, idx) => (
                    <div key={idx}>{scorer} •</div>
                  ))}
                </div>
              ) : (
                <div className={`${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>
                  No scorers
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FixtureCard;
