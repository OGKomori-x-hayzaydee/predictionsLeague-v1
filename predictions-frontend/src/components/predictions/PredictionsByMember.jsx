import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PersonIcon,
  PlusIcon,
  MinusIcon
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import EmptyState from "../common/EmptyState";
import PredictionCard from "./PredictionCard";

const PredictionsByMember = ({
  predictions = [],
  onPredictionSelect,
  onEditClick,
  teamLogos = {},
  searchQuery = "",
  mode = "league", // "personal" | "league"
  currentGameweek,
  cardStyle = "normal"
}) => {
  const { theme } = useContext(ThemeContext);
  const [expandedMembers, setExpandedMembers] = useState(new Set());

  // Determine component behavior based on mode
  const isLeagueMode = mode === "league";

  // Filter predictions based on search query
  const filteredPredictions = searchQuery 
    ? predictions.filter(prediction => 
        (isLeagueMode && prediction.userDisplayName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        prediction.homeTeam?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prediction.awayTeam?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : predictions;

  // Group predictions by member/user
  const predictionsByMember = filteredPredictions.reduce((groups, prediction) => {
    // Use userDisplayName (or username as fallback) for grouping since backend doesn't provide userId
    const memberId = isLeagueMode ? (prediction.userDisplayName || prediction.username || 'unknown') : 'personal';
    if (!groups[memberId]) {
      groups[memberId] = {
        memberInfo: {
          id: memberId,
          name: isLeagueMode ? (prediction.userDisplayName || 'Unknown User') : 'Your Predictions',
          avatar: isLeagueMode ? prediction.userDisplayName?.charAt(0).toUpperCase() || '?' : 'Y'
        },
        predictions: []
      };
    }
    groups[memberId].predictions.push(prediction);
    return groups;
  }, {});

  const members = Object.values(predictionsByMember);

  const toggleMember = (memberId) => {
    const newExpanded = new Set(expandedMembers);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedMembers(newExpanded);
  };

  const getMemberStats = (memberPredictions) => {
    const total = memberPredictions.length;
    const completed = memberPredictions.filter(p => p.status === 'completed').length;
    const pending = total - completed;
    const totalPoints = memberPredictions
      .filter(p => p.points !== null && p.points !== undefined)
      .reduce((sum, p) => sum + p.points, 0);
    
    return { total, completed, pending, totalPoints };
  };



  if (members.length === 0) {
    return (
      <EmptyState 
        icon={<PersonIcon className={`w-12 h-12 ${
          theme === "dark" ? "text-slate-500" : "text-slate-400"
        }`} />}
        title={isLeagueMode ? "No Member Predictions" : "No Predictions"}
        description={isLeagueMode 
          ? "Predictions will appear here once members start making them."
          : "Your predictions will appear here once you start making them."
        }
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {members.map((member) => {
        const isExpanded = expandedMembers.has(member.memberInfo.id);
        const stats = getMemberStats(member.predictions);
        
        return (
          <div
            key={member.memberInfo.id}
            className={`rounded-lg border overflow-hidden ${
              theme === "dark"
                ? "bg-slate-800/50 border-slate-600/50"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            {/* Member Header */}
            <div
              className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                theme === "dark" ? "bg-slate-900/60" : "hover:bg-gray-50"
              }`}
              onClick={() => toggleMember(member.memberInfo.id)}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                  theme === "dark" ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"
                }`}>
                  {member.memberInfo.avatar}
                </div>
                <div>
                  <h3 className={`font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}>
                    {member.memberInfo.name}
                  </h3>
                  <div className={`text-xs ${
                    theme === "dark" ? "text-white/60" : "text-gray-500"
                  }`}>
                    {stats.total} prediction{stats.total !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Stats Display */}
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-sm font-bold ${
                      theme === "dark" ? "text-teal-400" : "text-teal-600"
                    }`}>
                      {stats.totalPoints}
                    </span>
                    <span className={`text-xs font-medium ${
                      theme === "dark" ? "text-teal-500" : "text-teal-500"
                    }`}>
                      pts
                    </span>
                  </div>
                  <div className={`text-xs ${
                    theme === "dark" ? "text-white/60" : "text-gray-500"
                  }`}>
                    {stats.completed}/{stats.total} complete
                  </div>
                </div>
                
                {/* Expand/Collapse Icon */}
                {isExpanded ? (
                  <MinusIcon className={`w-4 h-4 ${theme === "dark" ? "text-white/60" : "text-gray-400"}`} />
                ) : (
                  <PlusIcon className={`w-4 h-4 ${theme === "dark" ? "text-white/60" : "text-gray-400"}`} />
                )}
              </div>
            </div>

            {/* Member Predictions - Expanded */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`border-t overflow-hidden ${
                    theme === "dark" ? "border-slate-600/50 bg-slate-900/60" : "border-gray-200"
                  }`}
                >
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {member.predictions.map((prediction) => (
                        <PredictionCard
                          key={prediction.id}
                          prediction={prediction}
                          mode={mode}
                          showMemberInfo={mode === "league"} // Show member info for league mode
                          onSelect={onPredictionSelect}
                          onEdit={onEditClick}
                          isReadonly={isLeagueMode}
                          size={cardStyle}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
};

export default PredictionsByMember;