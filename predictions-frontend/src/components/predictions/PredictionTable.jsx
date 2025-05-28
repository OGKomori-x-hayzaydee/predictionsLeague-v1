import React, { useContext } from "react";
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
import EmptyState from "../common/EmptyState";

const PredictionTable = ({
  predictions,
  onPredictionSelect,
  onEditClick,
  teamLogos,
  searchQuery,
}) => {
  const { theme } = useContext(ThemeContext);

  if (predictions.length === 0) {
    return <EmptyState />;
  }

  const getStatusConfig = (prediction) => {
    const isPending = prediction.status === "pending";
    if (isPending) {
      return {
        bgColor: "bg-amber-500/10",
        textColor: "text-amber-300",
        icon: ClockIcon,
        label: "Pending",
      };
    }
    if (prediction.correct) {
      return {
        bgColor: "bg-emerald-500/10",
        textColor: "text-emerald-300",
        icon: CheckIcon,
        label: "Correct",
      };
    }
    return {
      bgColor: "bg-red-500/10",
      textColor: "text-red-300",
      icon: Cross2Icon,
      label: "Incorrect",
    };
  };

  const handleEditClick = (e, prediction) => {
    e.stopPropagation();
    onEditClick(prediction);
  };

  return (
    <div className="overflow-x-auto">
      <table className={`w-full ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
        <thead>
          <tr className={`${theme === "dark" ? "border-slate-700" : "border-slate-200"} border-b`}>
            <th className={`text-left py-3 px-4 font-medium text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Date
            </th>
            <th className={`text-left py-3 px-4 font-medium text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Match
            </th>
            <th className={`text-center py-3 px-4 font-medium text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Prediction
            </th>
            <th className={`text-center py-3 px-4 font-medium text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Status
            </th>
            <th className={`text-center py-3 px-4 font-medium text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Points
            </th>
            <th className={`text-center py-3 px-4 font-medium text-sm ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((prediction, index) => {
            const statusConfig = getStatusConfig(prediction);
            const isPending = prediction.status === "pending";
            const matchDate = new Date(prediction.date);

            return (
              <motion.tr
                key={prediction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                onClick={() => onPredictionSelect(prediction)}
                className={`cursor-pointer transition-colors ${
                  theme === "dark"
                    ? "hover:bg-slate-800/50 border-slate-700/50"
                    : "hover:bg-slate-50 border-slate-200"
                } border-b`}
              >
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {format(matchDate, "MMM d, yyyy")}
                    </span>
                    <span className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                      GW{prediction.gameweek}
                    </span>
                  </div>
                </td>
                
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={teamLogos[prediction.homeTeam]}
                        alt={prediction.homeTeam}
                        className="w-6 h-6 object-contain"
                      />
                      <span className="text-sm font-medium">{prediction.homeTeam}</span>
                    </div>
                    <span className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>vs</span>
                    <div className="flex items-center gap-2">
                      <img
                        src={teamLogos[prediction.awayTeam]}
                        alt={prediction.awayTeam}
                        className="w-6 h-6 object-contain"
                      />
                      <span className="text-sm font-medium">{prediction.awayTeam}</span>
                    </div>
                  </div>
                </td>
                
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`px-2 py-1 rounded-md ${theme === "dark" ? "bg-indigo-600/20 border border-indigo-500/20" : "bg-indigo-50 border border-indigo-200"}`}>
                      <span className="text-sm font-bold">
                        {prediction.homeScore}
                      </span>
                    </div>
                    <span className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>-</span>
                    <div className={`px-2 py-1 rounded-md ${theme === "dark" ? "bg-indigo-600/20 border border-indigo-500/20" : "bg-indigo-50 border border-indigo-200"}`}>
                      <span className="text-sm font-bold">
                        {prediction.awayScore}
                      </span>
                    </div>
                  </div>
                </td>
                
                <td className="py-3 px-4 text-center">
                  <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${statusConfig.bgColor}`}>
                    <statusConfig.icon className={`w-3 h-3 ${statusConfig.textColor}`} />
                    <span className={`text-xs font-medium ${statusConfig.textColor}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </td>
                
                <td className="py-3 px-4 text-center">
                  {!isPending ? (
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${
                      prediction.points > 0
                        ? theme === "dark" 
                          ? "bg-teal-800/30 text-teal-300" 
                          : "bg-teal-50 text-teal-700"
                        : theme === "dark"
                          ? "bg-red-900/30 text-red-300"
                          : "bg-red-50 text-red-700"
                    }`}>
                      <span className="text-xs font-semibold">
                        {prediction.points} pts
                      </span>
                    </div>
                  ) : (
                    prediction.chips && prediction.chips.length > 0 && (
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${theme === "dark" ? "bg-purple-800/30 text-purple-300" : "bg-purple-50 text-purple-700"}`}>
                        <span className="text-xs font-medium">
                          {prediction.chips.length} chip{prediction.chips.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )
                  )}
                </td>
                
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={(e) => handleEditClick(e, prediction)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                      isPending
                        ? theme === "dark"
                          ? "bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30"
                          : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                        : theme === "dark"
                          ? "bg-slate-700/30 text-slate-400 hover:bg-slate-700/50"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
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
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PredictionTable;
