import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { 
  ClockIcon,
  CheckIcon,
  Cross2Icon,
  Pencil1Icon,
  EyeOpenIcon,
  PersonIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CaretSortIcon
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import EmptyState from "../common/EmptyState";
import TeamLogo from "../ui/TeamLogo";
import { LOGO_SIZES } from "../../utils/teamLogos";

const PredictionTable = ({
  predictions,
  onPredictionSelect,
  onEditClick,
  teamLogos = {},
  searchQuery = "",
  mode = "personal", // "personal" | "league"
}) => {
  const { theme } = useContext(ThemeContext);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  
  // Determine component behavior based on mode
  const isLeagueMode = mode === "league";
  const showMemberInfo = isLeagueMode;
  const allowEdit = !isLeagueMode && onEditClick;

  // Filter predictions based on search query (for league mode)
  const filteredPredictions = isLeagueMode && searchQuery 
    ? predictions.filter(prediction => {
        const searchLower = searchQuery.toLowerCase();
        return (
          prediction.userDisplayName?.toLowerCase().includes(searchLower) ||
          prediction.homeTeam?.toLowerCase().includes(searchLower) ||
          prediction.awayTeam?.toLowerCase().includes(searchLower) ||
          `${prediction.homeTeam} vs ${prediction.awayTeam}`.toLowerCase().includes(searchLower)
        );
      })
    : predictions;

  // Sort predictions (for league mode)
  const sortedPredictions = isLeagueMode 
    ? [...filteredPredictions].sort((a, b) => {
        let aValue, bValue;
        
        switch (sortConfig.key) {
          case 'member':
            aValue = a.userDisplayName;
            bValue = b.userDisplayName;
            break;
          case 'match':
            aValue = `${a.homeTeam} vs ${a.awayTeam}`;
            bValue = `${b.homeTeam} vs ${b.awayTeam}`;
            break;
          case 'prediction':
            aValue = `${a.homeScore}-${a.awayScore}`;
            bValue = `${b.homeScore}-${b.awayScore}`;
            break;
          case 'gameweek':
            aValue = a.gameweek || 0;
            bValue = b.gameweek || 0;
            break;
          case 'points':
            aValue = a.points || 0;
            bValue = b.points || 0;
            break;
          case 'date':
          default:
            aValue = new Date(a.date || a.predictedAt);
            bValue = new Date(b.date || b.predictedAt);
            break;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      })
    : filteredPredictions;

  if (sortedPredictions.length === 0) {
    return <EmptyState />;
  }

  // Helper functions
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleEditClick = (e, prediction) => {
    e.stopPropagation();
    onEditClick(prediction);
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <CaretSortIcon className={`w-4 h-4 ${
        theme === "dark" ? "text-slate-500" : "text-slate-400"
      }`} />;
    }
    return <CaretSortIcon className={`w-4 h-4 ${
      theme === "dark" ? "text-teal-300" : "text-teal-600"
    }`} />;
  };



  const formatPrediction = (prediction) => {
    if (prediction.homeScore !== null && prediction.awayScore !== null) {
      return `${prediction.homeScore}-${prediction.awayScore}`;
    }
    return "No prediction";
  };

  const getStatusConfig = (prediction) => {
    const isPending = prediction.status === "pending";
    if (isPending) {
      return {
        bgColor: theme === "dark" ? "bg-amber-800/30" : "bg-amber-50",
        textColor: theme === "dark" ? "text-amber-300" : "text-amber-700",
        icon: ClockIcon,
        label: "Pending",
      };
    }
    if (prediction.correct === "exact" || prediction.correct === "partial") {
      return {
        bgColor: theme === "dark" ? "bg-indigo-800/30" : "bg-indigo-50",
        textColor: theme === "dark" ? "text-indigo-300" : "text-indigo-700",
        icon: CheckIcon,
        label: prediction.correct === "exact" ? "Correct" : "Partial",
      };
    }
    return {
      bgColor: theme === "dark" ? "bg-slate-800/30" : "bg-slate-50",
      textColor: theme === "dark" ? "text-slate-300" : "text-slate-700",
      icon: Cross2Icon,
      label: "Incorrect",
    };
  };

  const getStatusColor = (prediction) => {
    if (prediction.points !== null && prediction.points !== undefined) {
      return theme === 'dark' 
        ? 'text-green-400 bg-green-500/10 border-green-500/20'
        : 'text-green-700 bg-green-50 border-green-200';
    }
    return theme === 'dark'
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
      : 'text-amber-700 bg-amber-50 border-amber-200';
  };

  const getPointsDisplay = (prediction) => {
    if (prediction.points !== null && prediction.points !== undefined) {
      return prediction.points;
    }
    return "Pending";
  };

  const SortableHeader = ({ columnKey, children, className = "text-left" }) => (
    <th 
      className={`py-3 px-4 font-medium text-sm cursor-pointer transition-colors ${
        theme === "dark"
          ? "text-slate-300 hover:text-teal-300"
          : "text-slate-600 hover:text-teal-600"
      } ${className}`}
      onClick={() => handleSort(columnKey)}
    >
      <div className="flex items-center gap-2">
        {children}
        <SortIcon columnKey={columnKey} />
      </div>
    </th>
  );

  const RegularHeader = ({ children, className = "text-left" }) => (
    <th className={`py-3 px-4 font-medium text-sm ${
      theme === "dark" ? "text-slate-300" : "text-slate-600"
    } ${className}`}>
      {children}
    </th>
  );

  return (
    <div className={`rounded-lg border overflow-hidden ${
      theme === "dark" 
        ? "bg-slate-800/50 border-slate-700/50" 
        : "bg-white border-slate-200"
    }`}>
      <div className="overflow-x-auto">
        <table className={`w-full ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
          <thead>
            <tr className={`border-b ${
              theme === "dark" 
                ? "border-slate-700/50 bg-slate-900/30" 
                : "border-slate-200 bg-slate-50"
            }`}>
              {/* Member column - only in league mode */}
              {showMemberInfo && (
                isLeagueMode ? (
                  <SortableHeader columnKey="member">Member</SortableHeader>
                ) : (
                  <RegularHeader>Member</RegularHeader>
                )
              )}
              
              {/* Match column */}
              {isLeagueMode ? (
                <SortableHeader columnKey="match">Match</SortableHeader>
              ) : (
                <RegularHeader>Match</RegularHeader>
              )}
              
              {/* Prediction column */}
              {isLeagueMode ? (
                <SortableHeader columnKey="prediction">Prediction</SortableHeader>
              ) : (
                <RegularHeader>Prediction</RegularHeader>
              )}

              {/* Gameweek - only in league mode */}
              {isLeagueMode && (
                <SortableHeader columnKey="gameweek">Gameweek</SortableHeader>
              )}

              {/* Date column */}
              {isLeagueMode ? (
                <SortableHeader columnKey="date">Date</SortableHeader>
              ) : (
                <RegularHeader>Date</RegularHeader>
              )}

              {/* Actual Result - only in personal mode */}
              {!isLeagueMode && (
                <RegularHeader>Actual Result</RegularHeader>
              )}

              {/* Status/Points column */}
              {isLeagueMode ? (
                <SortableHeader columnKey="points">Points</SortableHeader>
              ) : (
                <RegularHeader>Status</RegularHeader>
              )}

              {/* Actions - only in personal mode */}
              {allowEdit && (
                <RegularHeader>Actions</RegularHeader>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedPredictions.map((prediction, index) => {
              const statusConfig = getStatusConfig(prediction);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.tr
                  key={prediction.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`border-b cursor-pointer transition-colors ${
                    theme === "dark"
                      ? "border-slate-700/50 hover:bg-slate-800/30"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={() => onPredictionSelect?.(prediction)}
                >
                  {/* Member column - only in league mode */}
                  {showMemberInfo && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${
                          theme === 'dark' ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-700'
                        } flex items-center justify-center text-sm font-medium`}>
                          {prediction.userDisplayName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                        }`}>
                          {prediction.userDisplayName}
                        </span>
                      </div>
                    </td>
                  )}

                  {/* Match column */}
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <TeamLogo
                          teamName={prediction.homeTeam}
                          size={LOGO_SIZES.xs}
                          theme={theme}
                        />
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {prediction.homeTeam}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <TeamLogo
                          teamName={prediction.awayTeam}
                          size={LOGO_SIZES.xs}
                          theme={theme}
                        />
                        <span className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                          {prediction.awayTeam}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Prediction column */}
                  <td className="px-4 py-3">
                    <span className={`text-lg font-bold ${
                      theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                    }`}>
                      {formatPrediction(prediction)}
                    </span>
                  </td>

                  {/* Gameweek - only in league mode */}
                  {isLeagueMode && (
                    <td className="px-4 py-3">
                      {prediction.gameweek ? (
                        <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                          theme === "dark" 
                            ? "bg-slate-700/50 border border-slate-600/50 text-slate-300" 
                            : "bg-slate-100 border border-slate-300 text-slate-700"
                        }`}>
                          {prediction.gameweek}
                        </div>
                      ) : (
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          -
                        </span>
                      )}
                    </td>
                  )}

                  {/* Date column */}
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <div className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
                        {format(parseISO(prediction.date), "MMM d")}
                      </div>
                      <div className={theme === "dark" ? "text-slate-500" : "text-slate-500"}>
                        {format(parseISO(prediction.date), "h:mm a")}
                      </div>
                    </div>
                  </td>

                  {/* Actual Result - only in personal mode */}
                  {!isLeagueMode && (
                    <td className="px-4 py-3">
                      {prediction.actualHomeScore !== null && prediction.actualAwayScore !== null ? (
                        <span className={`text-lg font-bold ${
                          theme === "dark" ? "text-slate-300" : "text-slate-700"
                        }`}>
                          {prediction.actualHomeScore}-{prediction.actualAwayScore}
                        </span>
                      ) : (
                        <span className={`text-sm ${
                          theme === "dark" ? "text-slate-500" : "text-slate-500"
                        }`}>
                          TBD
                        </span>
                      )}
                    </td>
                  )}

                  {/* Status/Points column */}
                  <td className="px-4 py-3">
                    {isLeagueMode ? (
                      prediction.points !== null && prediction.points !== undefined ? (
                        <div className="flex items-center gap-1">
                          <span className={`text-xl font-bold ${
                            theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                          }`}>
                            {getPointsDisplay(prediction)}
                          </span>
                          <span className={`text-xs font-medium ${
                            theme === 'dark' ? 'text-teal-500' : 'text-teal-500'
                          }`}>
                            pts
                          </span>
                        </div>
                      ) : (
                        <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                          theme === "dark" 
                            ? "bg-amber-800/30 text-amber-300" 
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {getPointsDisplay(prediction)}
                        </div>
                      )
                    ) : (
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </div>
                    )}
                  </td>

                  {/* Actions - only in personal mode */}
                  {allowEdit && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onPredictionSelect?.(prediction)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            theme === "dark"
                              ? "text-slate-400 hover:text-white hover:bg-slate-700"
                              : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                          }`}
                          title="View details"
                        >
                          <EyeOpenIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictionTable;
