import { useContext } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { 
  ClockIcon,
  CheckIcon,
  Cross2Icon,
  Pencil1Icon,
  EyeOpenIcon
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";

const SimplePredictionCard = ({
  prediction,
  teamLogos,
  selected = false,
  onClick,
  onEditClick,
}) => {
  const { theme } = useContext(ThemeContext);

  const isPending = prediction.status === "pending";
  const matchDate = new Date(prediction.date);
  const formattedDate = format(matchDate, "MMM d");

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

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEditClick(prediction);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(prediction)}
      className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 ${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/60"
          : "bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md"
      } ${
        selected
          ? theme === "dark"
            ? "ring-2 ring-teal-400"
            : "ring-2 ring-teal-500"
          : ""
      }`}
    >
      {/* Header with date and status */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <ClockIcon className={`w-3 h-3 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`} />
          <span className={`text-xs font-medium ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
            {formattedDate} • GW{prediction.gameweek}
          </span>
        </div>
        
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${statusConfig.bgColor} ${statusConfig.borderColor} border`}
        >
          <statusConfig.icon className={`w-3 h-3 ${statusConfig.textColor}`} />
          <span className={`text-xs font-medium ${statusConfig.textColor}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Teams and prediction */}
      <div className="flex items-center justify-between mb-3">
        {/* Home team */}
        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-lg bg-slate-700/30 p-1 flex items-center justify-center">
            <img
              src={teamLogos[prediction.homeTeam]}
              alt={prediction.homeTeam}
              className="w-6 h-6 object-contain"
            />
          </div>
          <span className={`text-sm font-medium truncate ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
            {prediction.homeTeam}
          </span>
        </div>

        {/* Score prediction */}
        <div className="flex items-center gap-2 mx-3">
          <div className={`px-2 py-1 rounded-md ${theme === "dark" ? "bg-indigo-600/20 border border-indigo-500/20" : "bg-indigo-50 border border-indigo-200"}`}>
            <span className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
              {prediction.homeScore}
            </span>
          </div>
          <span className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>-</span>
          <div className={`px-2 py-1 rounded-md ${theme === "dark" ? "bg-indigo-600/20 border border-indigo-500/20" : "bg-indigo-50 border border-indigo-200"}`}>
            <span className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
              {prediction.awayScore}
            </span>
          </div>
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className={`text-sm font-medium truncate ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
            {prediction.awayTeam}
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-700/30 p-1 flex items-center justify-center">
            <img
              src={teamLogos[prediction.awayTeam]}
              alt={prediction.awayTeam}
              className="w-6 h-6 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex items-center justify-between">
        {/* Points/Chips display */}
        <div className="flex items-center gap-2">
          {!isPending ? (
            <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${
              prediction.points > 0
                ? theme === "dark" 
                  ? "bg-teal-800/30 text-teal-300" 
                  : "bg-teal-50 text-teal-700 border border-teal-200"
                : theme === "dark"
                  ? "bg-red-900/30 text-red-300"
                  : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              <span className="text-xs font-semibold">
                {prediction.points} pts
              </span>
            </div>
          ) : (
            prediction.chips && prediction.chips.length > 0 && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${theme === "dark" ? "bg-purple-800/30 text-purple-300" : "bg-purple-50 text-purple-700 border border-purple-200"}`}>
                <span className="text-xs font-medium">
                  {prediction.chips.length} chip{prediction.chips.length > 1 ? 's' : ''}
                </span>
              </div>
            )
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleEditClick}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
              isPending
                ? theme === "dark"
                  ? "bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/20"
                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                : theme === "dark"
                  ? "bg-slate-700/30 text-slate-400 hover:bg-slate-700/50"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {isPending ? (
              <>
                <Pencil1Icon className="w-3 h-3" />
                Edit
              </>
            ) : (
              <>
                <EyeOpenIcon className="w-3 h-3" />
                View
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SimplePredictionCard;
