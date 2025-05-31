import { useContext } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ClockIcon } from "@radix-ui/react-icons";
import { getTeamLogo } from "../../utils/teamUtils";
import { ThemeContext } from "../../context/ThemeContext";

const SimplePredictionCard = ({
  prediction,
  teamLogos = {},
  selected = false,
  onClick,
  onEditClick,
}) => {
  // Get theme context
  const { theme } = useContext(ThemeContext);

  // Use getTeamLogo utility with fallback to context logos
  const getLogoSrc = (teamName) => {
    return teamLogos[teamName] || getTeamLogo(teamName);
  };

  const isPending = prediction.status === "pending";
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick && onClick(prediction)}
      className={`border rounded-lg p-3 ${
        theme === "dark"
          ? "bg-slate-800/50 border-slate-600/50"
          : "border-slate-300 bg-white shadow-sm"
      } transition-all ${
        selected
          ? theme === "dark"
            ? "ring-2 ring-teal-400"
            : "ring-2 ring-teal-500"
          : ""
      }`}
    >
      <div
        className={`flex justify-between items-center text-xs ${
          theme === "dark" ? "text-white/60" : "text-slate-500"
        } mb-2`}
      >
        <span>{prediction.competition || "Premier League"}</span>
        <div className="text-right">
          <div className="flex items-center justify-end">
            <ClockIcon className="mr-1 w-3 h-3" />
            {format(parseISO(prediction.date), "MMM d, yyyy")} | {format(parseISO(prediction.date), "h:mm a")}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <img
          src={getLogoSrc(prediction.homeTeam)}
          alt={prediction.homeTeam}
          className="w-10 h-10 object-contain"
        />
        <div className="mx-2 flex-grow">
          <div className="flex justify-between items-center">
            <span
              className={`${
                theme === "dark" ? "text-white" : "text-slate-800"
              } font-medium`}
            >
              {prediction.homeTeam}
            </span>
            <div className="flex items-center gap-2">
              <div
                className={`px-2 py-1 rounded text-sm font-bold ${
                  theme === "dark"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/20"
                    : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                }`}
              >
                {prediction.homeScore}
              </div>
              <span
                className={`${
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                } font-outfit text-xs`}
              >
                -
              </span>
              <div
                className={`px-2 py-1 rounded text-sm font-bold ${
                  theme === "dark"
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/20"
                    : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                }`}
              >
                {prediction.awayScore}
              </div>
            </div>
            <span
              className={`${
                theme === "dark" ? "text-white" : "text-slate-800"
              } font-medium`}
            >
              {prediction.awayTeam}
            </span>
          </div>
        </div>
        <img
          src={getLogoSrc(prediction.awayTeam)}
          alt={prediction.awayTeam}
          className="w-10 h-10 object-contain"
        />
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div
          className={`text-xs ${
            theme === "dark" ? "text-white/60" : "text-slate-500"
          }`}
        >
          GW{prediction.gameweek || "36"} • {prediction.points ? `${prediction.points} pts` : "Pending"}
        </div>
        <div className="flex items-center gap-2">
          {/* Status chip */}
          <div
            className={`text-xs py-1 px-2 rounded ${
              isPending
                ? theme === "dark"
                  ? "bg-amber-900/30 text-amber-300"
                  : "bg-amber-100 text-amber-700 border border-amber-200"
                : prediction.correct
                ? theme === "dark"
                  ? "bg-emerald-900/30 text-emerald-300"
                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : theme === "dark"
                ? "bg-red-900/30 text-red-300"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {isPending ? "Pending" : prediction.correct ? "Correct" : "Incorrect"}
          </div>
          
          {/* Edit button for pending predictions */}
          {isPending && onEditClick && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(prediction);
              }}
              className={`text-xs py-1 px-2 rounded ${
                theme === "dark"
                  ? "bg-indigo-900/30 text-indigo-300 hover:bg-indigo-900/50"
                  : "bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200"
              } transition-colors`}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SimplePredictionCard;
