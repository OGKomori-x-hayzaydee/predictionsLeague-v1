import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  PersonIcon,
  CalendarIcon,
  TargetIcon
} from "@radix-ui/react-icons";
import { format, parseISO } from "date-fns";
import { ThemeContext } from "../../context/ThemeContext";

const LeaguePredictionsByTeam = ({
  predictions,
  onPredictionSelect,
  teamLogos = {},
  currentGameweek
}) => {
  const { theme } = useContext(ThemeContext);
  const [expandedMembers, setExpandedMembers] = useState(new Set());

  // Group predictions by member
  const predictionsByMember = predictions.reduce((groups, prediction) => {
    const memberId = prediction.userId;
    if (!groups[memberId]) {
      groups[memberId] = {
        memberInfo: {
          id: prediction.userId,
          name: prediction.userDisplayName || 'Unknown User',
          avatar: prediction.userDisplayName?.charAt(0).toUpperCase() || '?'
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
      .filter(p => p.points !== null)
      .reduce((sum, p) => sum + p.points, 0);
    
    return { total, completed, pending, totalPoints };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {members.length === 0 ? (
        <div className={`text-center py-12 ${
          theme === "dark" ? "text-slate-400" : "text-slate-600"
        }`}>
          <PersonIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium font-outfit">No member predictions found</p>
          <p className="text-sm mt-2">Predictions will appear here once members start making them.</p>
        </div>
      ) : (
        members.map((member) => {
          const isExpanded = expandedMembers.has(member.memberInfo.id);
          const stats = getMemberStats(member.predictions);
          
          return (
            <motion.div
              key={member.memberInfo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-xl border transition-all duration-200 ${
                theme === "dark"
                  ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70"
                  : "bg-white border-slate-200 hover:shadow-md"
              } backdrop-blur-sm`}
            >
              {/* Member Header */}
              <button
                onClick={() => toggleMember(member.memberInfo.id)}
                className={`w-full p-6 text-left transition-colors ${
                  theme === "dark" ? "hover:bg-slate-700/30" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                      theme === "dark" ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-700"
                    }`}>
                      {member.memberInfo.avatar}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${
                        theme === "dark" ? "text-white" : "text-slate-900"
                      } font-outfit`}>
                        {member.memberInfo.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`text-sm ${
                          theme === "dark" ? "text-slate-400" : "text-slate-600"
                        } font-outfit`}>
                          {stats.total} predictions
                        </span>
                        <span className={`text-sm font-medium ${
                          theme === "dark" ? "text-teal-400" : "text-teal-600"
                        } font-outfit`}>
                          {stats.totalPoints} pts
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className={`${
                          theme === "dark" ? "text-green-400" : "text-green-600"
                        } font-medium`}>
                          {stats.completed} complete
                        </span>
                        <span className={`${
                          theme === "dark" ? "text-amber-400" : "text-amber-600"
                        } font-medium`}>
                          {stats.pending} pending
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDownIcon className={`w-5 h-5 ${
                        theme === "dark" ? "text-slate-400" : "text-slate-600"
                      }`} />
                    ) : (
                      <ChevronRightIcon className={`w-5 h-5 ${
                        theme === "dark" ? "text-slate-400" : "text-slate-600"
                      }`} />
                    )}
                  </div>
                </div>
              </button>

              {/* Member Predictions */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className={`px-6 pb-6 border-t ${
                      theme === "dark" ? "border-slate-700/50" : "border-slate-200"
                    }`}>
                      <div className="pt-4 space-y-3">
                        {member.predictions.map((prediction) => (
                          <motion.div
                            key={prediction.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => onPredictionSelect?.(prediction)}
                            className={`p-4 rounded-lg cursor-pointer transition-colors ${
                              theme === "dark"
                                ? "bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30"
                                : "bg-slate-50 hover:bg-slate-100 border border-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <CalendarIcon className={`w-4 h-4 ${
                                  theme === "dark" ? "text-slate-500" : "text-slate-500"
                                }`} />
                                <span className={`text-sm font-medium ${
                                  theme === "dark" ? "text-slate-300" : "text-slate-700"
                                } font-outfit`}>
                                  {prediction.homeTeam} vs {prediction.awayTeam}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs ${
                                  theme === "dark" ? "text-slate-500" : "text-slate-500"
                                } font-outfit`}>
                                  GW{prediction.gameweek}
                                </span>
                                <div className={`text-sm font-bold ${
                                  theme === "dark" ? "text-white" : "text-slate-900"
                                } font-outfit`}>
                                  {prediction.points !== null ? `${prediction.points}pts` : '—'}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`text-lg font-bold ${
                                  theme === "dark" ? "text-white" : "text-slate-900"
                                } font-outfit`}>
                                  {prediction.homeScore} - {prediction.awayScore}
                                </div>
                                <div className={`text-xs px-2 py-1 rounded-full ${
                                  prediction.status === 'pending'
                                    ? theme === "dark"
                                      ? "bg-amber-900/30 text-amber-400"
                                      : "bg-amber-100 text-amber-700"
                                    : theme === "dark"
                                    ? "bg-green-900/30 text-green-400"
                                    : "bg-green-100 text-green-700"
                                } font-outfit font-medium`}>
                                  {prediction.status}
                                </div>
                              </div>
                              
                              {prediction.chips?.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {prediction.chips.slice(0, 2).map((chip, index) => (
                                    <span
                                      key={index}
                                      className={`text-xs px-2 py-1 rounded-full font-medium font-outfit ${
                                        theme === "dark"
                                          ? "bg-teal-900/30 text-teal-400"
                                          : "bg-teal-100 text-teal-700"
                                      }`}
                                    >
                                      {chip.replace('_', ' ')}
                                    </span>
                                  ))}
                                  {prediction.chips.length > 2 && (
                                    <span className={`text-xs ${
                                      theme === "dark" ? "text-slate-500" : "text-slate-500"
                                    }`}>
                                      +{prediction.chips.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
};

export default LeaguePredictionsByTeam;
