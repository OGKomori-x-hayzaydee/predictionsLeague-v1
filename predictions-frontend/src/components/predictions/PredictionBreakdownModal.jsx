import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, addMinutes } from 'date-fns';
import { ThemeContext } from '../../context/ThemeContext';
import { backgrounds, text, getThemeStyles } from '../../utils/themeUtils';
import { calculatePoints, getPointsBreakdown } from '../../utils/pointsCalculation';
import { CHIP_CONFIG } from '../../utils/chipManager';
import { 
  Cross2Icon, 
  CalendarIcon,
  StarIcon,
  PersonIcon,
  ClockIcon,
  MagicWandIcon,
  ExclamationTriangleIcon
} from '@radix-ui/react-icons';
import TeamLogo from "../ui/TeamLogo";
import { LOGO_SIZES } from "../../utils/teamLogos";

const PredictionBreakdownModal = ({ 
  isOpen, 
  onClose, 
  prediction, 
  onEdit
}) => {
  const { theme } = useContext(ThemeContext);
  
  if (!prediction) return null;
  
  // Check if deadline has passed
  // NOTE: We need to fetch the actual fixture date from somewhere else
  // because prediction.matchDate/prediction.date contains the prediction creation timestamp
  // For now, only allow editing if match status is still 'pending'
  // Backend should also validate deadline on their end
  const canEdit = prediction.status === 'pending';

  // Calculate accurate points using utility function
  const calculatedPoints = calculatePoints(prediction);
  const pointsBreakdownData = getPointsBreakdown(prediction);

  // Calculate base points (without chip multipliers) for mathematics section
  const calculateBasePoints = () => {
    if (prediction.actualHomeScore === null || prediction.actualHomeScore === undefined ||
        prediction.actualAwayScore === null || prediction.actualAwayScore === undefined) {
      return 0;
    }

    let basePoints = 0;
    
    // Score prediction points
    if (prediction.homeScore === prediction.actualHomeScore && 
        prediction.awayScore === prediction.actualAwayScore) {
      basePoints += 10;
    } else if ((prediction.homeScore > prediction.awayScore && prediction.actualHomeScore > prediction.actualAwayScore) ||
               (prediction.homeScore < prediction.awayScore && prediction.actualHomeScore < prediction.actualAwayScore) ||
               (prediction.homeScore === prediction.awayScore && prediction.actualHomeScore === prediction.actualAwayScore)) {
      basePoints += 5;
    }
    
    // Goalscorer points
    const homeCorrect = prediction.homeScorers?.filter(scorer => 
      prediction.actualHomeScorers?.includes(scorer)
    ).length || 0;
    const awayCorrect = prediction.awayScorers?.filter(scorer => 
      prediction.actualAwayScorers?.includes(scorer)
    ).length || 0;
    basePoints += (homeCorrect + awayCorrect) * 2;
    
    return basePoints;
  };

  const basePoints = calculateBasePoints();



  const formattedDate = format(parseISO(prediction.date), 'MMM dd, HH:mm');

  // Calculate goal counts for predicted scorers
  const getGoalCounts = (scorers) => {
    if (!scorers || scorers.length === 0) return {};
    const counts = {};
    scorers.forEach(scorer => {
      counts[scorer] = (counts[scorer] || 0) + 1;
    });
    return counts;
  };

  const homeGoalCounts = getGoalCounts(prediction.homeScorers);
  const awayGoalCounts = getGoalCounts(prediction.awayScorers);

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.75,
      y: 20 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.75,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-full max-w-[92vw] sm:max-w-2xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden text-sm sm:text-base ${getThemeStyles(theme, backgrounds.card)}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-3 sm:p-6 border-b ${getThemeStyles(theme, {
              dark: 'border-slate-700/60',
              light: 'border-slate-200'
            })}`}>
              <h2 className={`text-xl font-bold font-outfit ${getThemeStyles(theme, text.primary)}`}>
                Prediction Details
              </h2>
              <div className="flex items-center space-x-2">
                {onEdit && prediction.status === 'pending' && (
                  <>
                    {!canEdit && (
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-outfit ${getThemeStyles(theme, {
                        dark: 'bg-amber-900/20 text-amber-300 border border-amber-700/30',
                        light: 'bg-amber-50 text-amber-700 border border-amber-200'
                      })}`}>
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        <span>Match started</span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        if (!canEdit) return;
                        onEdit(prediction);
                        onClose();
                      }}
                      disabled={!canEdit}
                      className={`px-4 py-2 rounded-lg font-medium text-sm font-outfit transition-colors ${
                        !canEdit 
                          ? getThemeStyles(theme, {
                              dark: 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50',
                              light: 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                            })
                          : getThemeStyles(theme, {
                              dark: 'bg-blue-600 hover:bg-blue-700 text-white',
                              light: 'bg-blue-600 hover:bg-blue-700 text-white'
                            })
                      }`}
                    >
                      Edit Prediction
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${getThemeStyles(theme, {
                    dark: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
                    light: 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  })}`}
                >
                  <Cross2Icon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-6 max-h-[80vh] overflow-y-auto">
              {/* Rich Card Header */}
              <div className={`rounded-xl p-6 mb-6 ${getThemeStyles(theme, backgrounds.secondary)}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getThemeStyles(theme, {
                      dark: 'bg-blue-500/10 text-blue-300',
                      light: 'bg-blue-100 text-blue-600'
                    })}`}>
                      <CalendarIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`font-semibold font-outfit ${getThemeStyles(theme, text.primary)}`}>
                        {prediction.homeTeam} vs {prediction.awayTeam}
                      </p>
                      <p className={`text-xs font-outfit ${getThemeStyles(theme, text.muted)}`}>
                        GW{prediction.gameweek} • {formattedDate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold font-outfit ${getThemeStyles(theme, text.primary)}`}>
                      {calculatedPoints !== null && calculatedPoints !== undefined ? calculatedPoints : '—'}
                      {calculatedPoints !== null && calculatedPoints !== undefined && (
                        <span className="text-xs font-medium ml-0.5 font-outfit">pts</span>
                      )}
                    </div>
                    <div className={`text-xs font-medium font-outfit ${
                      prediction.status === 'pending'
                        ? "text-amber-400"
                        : "text-green-400"
                    }`}>
                      {prediction.status === 'pending' ? 'Pending' : 'Complete'}
                    </div>
                  </div>
                </div>

                {/* Score Prediction */}
                <div className={`rounded-lg p-4 mb-4 ${getThemeStyles(theme, {
                  dark: 'bg-slate-900/50 border border-slate-700/30',
                  light: 'bg-slate-100 border border-slate-200'
                })}`}>
                  <div className={`text-xs font-medium mb-3 font-outfit ${getThemeStyles(theme, text.muted)}`}>
                    Predicted Score
                  </div>
                  <div className="flex items-start justify-center space-x-6">
                    <div className="text-center flex-1">
                      <div className={`text-2xl font-bold font-outfit ${getThemeStyles(theme, text.primary)}`}>
                        {prediction.homeScore}
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-1 mb-2">
                        <TeamLogo 
                          teamName={prediction.homeTeam} 
                          size={LOGO_SIZES.xs}
                          className="flex-shrink-0"
                        />
                        <div className={`text-xs font-outfit truncate ${getThemeStyles(theme, text.muted)}`}>
                          {prediction.homeTeam}
                        </div>
                      </div>
                      {/* Home Team Predicted Scorers as subtext */}
                      {prediction.homeScorers?.length > 0 && (
                        <div className="space-y-1">
                          {Object.entries(homeGoalCounts).map(([scorer, count]) => (
                            <div key={scorer} className={`text-xs font-outfit ${getThemeStyles(theme, {
                              dark: 'text-blue-300/70',
                              light: 'text-blue-600'
                            })}`}>
                              {scorer} {count > 1 ? `(${count})` : ''}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className={`text-lg font-bold font-outfit self-start mt-2 ${getThemeStyles(theme, text.muted)}`}>
                      —
                    </div>
                    
                    <div className="text-center flex-1">
                      <div className={`text-2xl font-bold font-outfit ${getThemeStyles(theme, text.primary)}`}>
                        {prediction.awayScore}
                      </div>
                      <div className="flex items-center justify-center gap-2 mt-1 mb-2">
                        <TeamLogo 
                          teamName={prediction.awayTeam} 
                          size={LOGO_SIZES.xs}
                          className="flex-shrink-0"
                        />
                        <div className={`text-xs font-outfit truncate ${getThemeStyles(theme, text.muted)}`}>
                          {prediction.awayTeam}
                        </div>
                      </div>
                      {/* Away Team Predicted Scorers as subtext */}
                      {prediction.awayScorers?.length > 0 && (
                        <div className="space-y-1">
                          {Object.entries(awayGoalCounts).map(([scorer, count]) => (
                            <div key={scorer} className={`text-xs font-outfit ${getThemeStyles(theme, {
                              dark: 'text-blue-300/70',
                              light: 'text-blue-600'
                            })}`}>
                              {scorer} {count > 1 ? `(${count})` : ''}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actual Result if available */}
                {(prediction.actualHomeScore !== null && prediction.actualHomeScore !== undefined && 
                  prediction.actualAwayScore !== null && prediction.actualAwayScore !== undefined) && (
                  <div className={`rounded-lg p-4 ${getThemeStyles(theme, {
                    dark: 'bg-slate-900/50 border border-slate-700/30',
                    light: 'bg-slate-100 border border-slate-200'
                  })}`}>
                    <div className={`text-xs font-medium mb-3 font-outfit ${getThemeStyles(theme, text.muted)}`}>
                      Actual Result
                    </div>
                    <div className="flex items-start justify-center space-x-6">
                      <div className="text-center flex-1">
                        <div className="text-2xl font-bold text-emerald-300 font-outfit">
                          {prediction.actualHomeScore}
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-1 mb-2">
                          <TeamLogo 
                            teamName={prediction.homeTeam} 
                            size={LOGO_SIZES.xs}
                            className="flex-shrink-0"
                          />
                          <div className={`text-xs font-outfit truncate ${getThemeStyles(theme, text.muted)}`}>
                            {prediction.homeTeam}
                          </div>
                        </div>
                        {/* Home Team Actual Scorers as subtext */}
                        {prediction.actualHomeScorers?.length > 0 && (
                          <div className="space-y-1">
                            {prediction.actualHomeScorers.map((scorer, index) => (
                              <div key={index} className={`text-xs font-outfit ${getThemeStyles(theme, {
                                dark: 'text-emerald-300/70',
                                light: 'text-emerald-600'
                              })}`}>
                                {scorer}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className={`text-lg font-bold font-outfit self-start mt-2 ${getThemeStyles(theme, text.muted)}`}>
                        —
                      </div>
                      
                      <div className="text-center flex-1">
                        <div className="text-2xl font-bold text-emerald-300 font-outfit">
                          {prediction.actualAwayScore}
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-1 mb-2">
                          <TeamLogo 
                            teamName={prediction.awayTeam} 
                            size={LOGO_SIZES.xs}
                            className="flex-shrink-0"
                          />
                          <div className={`text-xs font-outfit truncate ${getThemeStyles(theme, text.muted)}`}>
                            {prediction.awayTeam}
                          </div>
                        </div>
                        {/* Away Team Actual Scorers as subtext */}
                        {prediction.actualAwayScorers?.length > 0 && (
                          <div className="space-y-1">
                            {prediction.actualAwayScorers.map((scorer, index) => (
                              <div key={index} className={`text-xs font-outfit ${getThemeStyles(theme, {
                                dark: 'text-emerald-300/70',
                                light: 'text-emerald-600'
                              })}`}>
                                {scorer}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>



              {/* Chips Applied */}
              {prediction.chips && prediction.chips.length > 0 && (
                <div className={`rounded-xl p-6 mt-6 ${getThemeStyles(theme, backgrounds.secondary)}`}>
                  <div className="flex items-start gap-3 mb-4">
                    <h3 className={`text-lg font-semibold font-outfit ${getThemeStyles(theme, text.primary)}`}>
                      Chips Applied
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {prediction.chips.map((chip, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${getThemeStyles(theme, {
                        dark: 'bg-slate-800/50 border border-slate-700/30',
                        light: 'bg-slate-50 border border-slate-200'
                      })}`}>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border font-outfit ${getThemeStyles(theme, {
                            dark: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
                            light: 'bg-blue-50 text-blue-700 border-blue-200'
                          })}`}>
                            {chip}
                          </span>
                          <div>
                            <div className={`text-sm font-medium font-outfit ${getThemeStyles(theme, text.primary)}`}>
                              {CHIP_CONFIG[chip]?.name || chip}
                            </div>
                            <div className={`text-xs font-outfit ${getThemeStyles(theme, text.muted)}`}>
                              {CHIP_CONFIG[chip]?.description || ''}
                            </div>
                          </div>
                        </div>
                        <div className={`text-sm font-semibold font-outfit ${getThemeStyles(theme, text.primary)}`}>
                          {chip === 'doubleDown' && '×2'}
                          {chip === 'wildcard' && '×3'}
                          {chip === 'scorerFocus' && '×2'}
                          {chip === 'defensePlusPlus' && '+10'}
                          {chip === 'allInWeek' && '×2'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Points Breakdown */}
              {pointsBreakdownData && (
                <div className={`rounded-xl p-6 mt-6 ${getThemeStyles(theme, backgrounds.secondary)}`}>
                  <h3 className={`text-lg font-semibold mb-4 font-outfit ${getThemeStyles(theme, text.primary)}`}>
                    Points Breakdown
                  </h3>
                  
                  <div className="space-y-3">
                    {Object.entries(pointsBreakdownData).map(([category, points]) => (
                      <div key={category} className={`flex items-center justify-between py-2 border-b last:border-b-0 ${getThemeStyles(theme, {
                        dark: 'border-slate-700/30',
                        light: 'border-slate-200'
                      })}`}>
                        <span className={`text-sm font-outfit capitalize ${getThemeStyles(theme, text.secondary)}`}>
                          {category === 'exactScore' && 'Exact Score'}
                          {category === 'correctOutcome' && 'Correct Outcome'}
                          {category === 'goalscorers' && 'Goalscorers'}
                          {category === 'wildcard' && 'Wildcard Multiplier'}
                          {category === 'doubleDown' && 'Double Down Multiplier'}
                          {category === 'scorerFocus' && 'Scorer Focus Multiplier'}
                          {category === 'defensePlusPlus' && 'Defense++ Bonus'}
                        </span>
                        <span className={`font-semibold font-outfit ${getThemeStyles(theme, text.primary)}`}>
                          {typeof points === 'number' ? `+${points}` : points}
                        </span>
                      </div>
                    ))}
                    
                    <div className={`flex items-center justify-between pt-3 mt-3 border-t ${getThemeStyles(theme, {
                      dark: 'border-slate-600/50',
                      light: 'border-slate-300'
                    })}`}>
                      <span className={`font-semibold font-outfit ${getThemeStyles(theme, text.primary)}`}>
                        Total Points
                      </span>
                      <span className="text-lg font-bold text-green-400 font-outfit">
                        {calculatedPoints}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Calculations Section */}
              {(prediction.actualHomeScore !== null && prediction.actualHomeScore !== undefined && 
                prediction.actualAwayScore !== null && prediction.actualAwayScore !== undefined) && (
                <div className={`rounded-xl p-6 mt-6 ${getThemeStyles(theme, backgrounds.secondary)}`}>
                  <h3 className={`text-lg font-semibold mb-4 font-outfit ${getThemeStyles(theme, text.primary)}`}>
                    Calculations
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Score Accuracy */}
                    <div className={`rounded-lg p-4 ${getThemeStyles(theme, {
                      dark: 'bg-slate-900/50 border border-slate-700/30',
                      light: 'bg-slate-100 border border-slate-200'
                    })}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-outfit ${getThemeStyles(theme, text.secondary)}`}>Score Prediction</span>
                        <span className={`text-sm font-semibold font-outfit ${
                          prediction.homeScore === prediction.actualHomeScore && 
                          prediction.awayScore === prediction.actualAwayScore
                            ? 'text-emerald-400' 
                            : 'text-red-400'
                        }`}>
                          {prediction.homeScore === prediction.actualHomeScore && 
                           prediction.awayScore === prediction.actualAwayScore
                            ? 'Exact Match' 
                            : 'Incorrect'}
                        </span>
                      </div>
                      <div className="text-xs font-outfit">
                        <span className={`${getThemeStyles(theme, text.muted)}`}>
                          Predicted: {prediction.homeScore}-{prediction.awayScore} | 
                          Actual: {prediction.actualHomeScore}-{prediction.actualAwayScore}
                        </span>
                      </div>
                    </div>

                    {/* Result Accuracy */}
                    <div className={`rounded-lg p-4 ${getThemeStyles(theme, {
                      dark: 'bg-slate-900/50 border border-slate-700/30',
                      light: 'bg-slate-100 border border-slate-200'
                    })}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-outfit ${getThemeStyles(theme, text.secondary)}`}>Result Prediction</span>
                        <span className={`text-sm font-semibold font-outfit ${
                          ((prediction.homeScore > prediction.awayScore && prediction.actualHomeScore > prediction.actualAwayScore) ||
                           (prediction.homeScore < prediction.awayScore && prediction.actualHomeScore < prediction.actualAwayScore) ||
                           (prediction.homeScore === prediction.awayScore && prediction.actualHomeScore === prediction.actualAwayScore))
                            ? 'text-emerald-400' 
                            : 'text-red-400'
                        }`}>
                          {((prediction.homeScore > prediction.awayScore && prediction.actualHomeScore > prediction.actualAwayScore) ||
                            (prediction.homeScore < prediction.awayScore && prediction.actualHomeScore < prediction.actualAwayScore) ||
                            (prediction.homeScore === prediction.awayScore && prediction.actualHomeScore === prediction.actualAwayScore))
                            ? 'Correct' 
                            : 'Incorrect'}
                        </span>
                      </div>
                      <div className="text-xs font-outfit">
                        <span className={`${getThemeStyles(theme, text.muted)}`}>
                          Predicted: {prediction.homeScore > prediction.awayScore ? `${prediction.homeTeam} Win` : 
                                     prediction.homeScore < prediction.awayScore ? `${prediction.awayTeam} Win` : 'Draw'} | 
                          Actual: {prediction.actualHomeScore > prediction.actualAwayScore ? `${prediction.homeTeam} Win` : 
                                   prediction.actualHomeScore < prediction.actualAwayScore ? `${prediction.awayTeam} Win` : 'Draw'}
                        </span>
                      </div>
                    </div>

                    {/* Goalscorer Accuracy */}
                    {(prediction.homeScorers?.length > 0 || prediction.awayScorers?.length > 0) && 
                     (prediction.actualHomeScorers?.length > 0 || prediction.actualAwayScorers?.length > 0) && (
                      <div className={`rounded-lg p-4 ${getThemeStyles(theme, {
                        dark: 'bg-slate-900/50 border border-slate-700/30',
                        light: 'bg-slate-100 border border-slate-200'
                      })}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-outfit ${getThemeStyles(theme, text.secondary)}`}>Goalscorer Predictions</span>
                          <span className={`text-sm font-semibold font-outfit text-blue-400`}>
                            {/* Calculate correct predictions */}
                            {(() => {
                              const homeCorrect = prediction.homeScorers?.filter(scorer => 
                                prediction.actualHomeScorers?.includes(scorer)
                              ).length || 0;
                              const awayCorrect = prediction.awayScorers?.filter(scorer => 
                                prediction.actualAwayScorers?.includes(scorer)
                              ).length || 0;
                              const totalPredicted = (prediction.homeScorers?.length || 0) + (prediction.awayScorers?.length || 0);
                              return `${homeCorrect + awayCorrect}/${totalPredicted} Correct`;
                            })()}
                          </span>
                        </div>
                        <div className="text-xs space-y-1 font-outfit">
                          {prediction.homeScorers?.map((scorer, index) => (
                            <div key={`home-${index}`} className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <TeamLogo 
                                  teamName={prediction.homeTeam} 
                                  size={LOGO_SIZES.xs}
                                  className="flex-shrink-0"
                                />
                                <span className={`${getThemeStyles(theme, text.muted)}`}>{prediction.homeTeam}: {scorer}</span>
                              </div>
                              <span className={`font-medium font-outfit ${
                                prediction.actualHomeScorers?.includes(scorer) ? 'text-emerald-400' : 'text-red-400'
                              }`}>
                                {prediction.actualHomeScorers?.includes(scorer) ? '✓' : '✗'}
                              </span>
                            </div>
                          ))}
                          {prediction.awayScorers?.map((scorer, index) => (
                            <div key={`away-${index}`} className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <TeamLogo 
                                  teamName={prediction.awayTeam} 
                                  size={LOGO_SIZES.xs}
                                  className="flex-shrink-0"
                                />
                                <span className={`${getThemeStyles(theme, text.muted)}`}>{prediction.awayTeam}: {scorer}</span>
                              </div>
                              <span className={`font-medium font-outfit ${
                                prediction.actualAwayScorers?.includes(scorer) ? 'text-emerald-400' : 'text-red-400'
                              }`}>
                                {prediction.actualAwayScorers?.includes(scorer) ? '✓' : '✗'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Points Mathematics Section */}
              {(prediction.actualHomeScore !== null && prediction.actualHomeScore !== undefined && 
                prediction.actualAwayScore !== null && prediction.actualAwayScore !== undefined) && (
                <div className={`rounded-xl p-6 mt-6 ${getThemeStyles(theme, backgrounds.secondary)}`}>
                  <h3 className={`text-lg font-semibold mb-4 font-outfit ${getThemeStyles(theme, text.primary)}`}>
                    Points Mathematics
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Base Points Calculation */}
                    <div className={`rounded-lg p-4 ${getThemeStyles(theme, {
                      dark: 'bg-slate-900/50 border border-slate-700/30',
                      light: 'bg-slate-100 border border-slate-200'
                    })}`}>
                      <h4 className={`text-sm font-semibold mb-3 font-outfit ${getThemeStyles(theme, text.primary)}`}>
                        Base Points Breakdown
                      </h4>
                      <div className="space-y-2">
                        {/* Exact Score Points */}
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-outfit ${getThemeStyles(theme, text.secondary)}`}>
                            Exact Scoreline ({prediction.homeScore}-{prediction.awayScore})
                          </span>
                          <span className={`text-sm font-semibold font-outfit ${
                            prediction.homeScore === prediction.actualHomeScore && 
                            prediction.awayScore === prediction.actualAwayScore
                              ? 'text-emerald-400' 
                              : 'text-slate-400'
                          }`}>
                            {prediction.homeScore === prediction.actualHomeScore && 
                             prediction.awayScore === prediction.actualAwayScore ? '+10' : '+0'}
                          </span>
                        </div>

                        {/* Correct Result Points (only if not exact score) */}
                        {!(prediction.homeScore === prediction.actualHomeScore && 
                           prediction.awayScore === prediction.actualAwayScore) && (
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-outfit ${getThemeStyles(theme, text.secondary)}`}>
                              Correct Outcome
                            </span>
                            <span className={`text-sm font-semibold font-outfit ${
                              ((prediction.homeScore > prediction.awayScore && prediction.actualHomeScore > prediction.actualAwayScore) ||
                               (prediction.homeScore < prediction.awayScore && prediction.actualHomeScore < prediction.actualAwayScore) ||
                               (prediction.homeScore === prediction.awayScore && prediction.actualHomeScore === prediction.actualAwayScore))
                                ? 'text-emerald-400' 
                                : 'text-slate-400'
                            }`}>
                              {((prediction.homeScore > prediction.awayScore && prediction.actualHomeScore > prediction.actualAwayScore) ||
                                (prediction.homeScore < prediction.awayScore && prediction.actualHomeScore < prediction.actualAwayScore) ||
                                (prediction.homeScore === prediction.awayScore && prediction.actualHomeScore === prediction.actualAwayScore))
                                ? '+5' : '+0'}
                            </span>
                          </div>
                        )}

                        {/* Goalscorer Points */}
                        {(prediction.homeScorers?.length > 0 || prediction.awayScorers?.length > 0) && (
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-outfit ${getThemeStyles(theme, text.secondary)}`}>
                              Goalscorer Predictions
                            </span>
                            <span className={`text-sm font-semibold font-outfit text-blue-400`}>
                              {(() => {
                                const homeCorrect = prediction.homeScorers?.filter(scorer => 
                                  prediction.actualHomeScorers?.includes(scorer)
                                ).length || 0;
                                const awayCorrect = prediction.awayScorers?.filter(scorer => 
                                  prediction.actualAwayScorers?.includes(scorer)
                                ).length || 0;
                                const totalCorrect = homeCorrect + awayCorrect;
                                return `+${totalCorrect * 2}`;
                              })()}
                            </span>
                          </div>
                        )}

                        {/* Base Points Subtotal */}
                        <div className={`flex items-center justify-between pt-2 border-t ${getThemeStyles(theme, {
                          dark: 'border-slate-700/30',
                          light: 'border-slate-200'
                        })}`}>
                          <span className={`text-sm font-semibold font-outfit ${getThemeStyles(theme, text.primary)}`}>
                            Base Points Subtotal
                          </span>
                          <span className={`text-sm font-bold font-outfit text-blue-400`}>
                            +{basePoints}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Chip Multipliers */}
                    {prediction.chips && prediction.chips.length > 0 && (
                      <div className={`rounded-lg p-4 ${getThemeStyles(theme, {
                        dark: 'bg-slate-900/50 border border-slate-700/30',
                        light: 'bg-slate-100 border border-slate-200'
                      })}`}>
                        <h4 className={`text-sm font-semibold mb-3 font-outfit ${getThemeStyles(theme, text.primary)}`}>
                          Chip Effects Applied
                        </h4>
                        <div className="space-y-2">
                          {prediction.chips.map((chip, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border font-outfit ${getThemeStyles(theme, {
                                  dark: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
                                  light: 'bg-blue-50 text-blue-700 border-blue-200'
                                })}`}>
                                  {chip}
                                </span>
                                <span className={`text-sm font-outfit ${getThemeStyles(theme, text.secondary)}`}>
                                  {CHIP_CONFIG[chip]?.description || ''}
                                </span>
                              </div>
                              <span className={`text-sm font-semibold font-outfit text-purple-400`}>
                                {chip === 'doubleDown' && '×2'}
                                {chip === 'wildcard' && '×3'}
                                {chip === 'scorerFocus' && '×2 (scorers)'}
                                {chip === 'defensePlusPlus' && '+10'}
                                {chip === 'allInWeek' && '×2 (all)'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Final Points Calculation */}
                    <div className={`rounded-lg p-4 ${getThemeStyles(theme, {
                      dark: 'bg-gradient-to-r from-emerald-900/20 to-blue-900/20 border border-emerald-700/30',
                      light: 'bg-gradient-to-r from-emerald-100 to-blue-100 border border-emerald-200'
                    })}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`text-lg font-bold font-outfit ${getThemeStyles(theme, text.primary)}`}>
                            Final Points Earned
                          </h4>
                          <p className={`text-xs font-outfit ${getThemeStyles(theme, text.muted)}`}>
                            Base points + chip effects applied
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-emerald-400 font-outfit">
                            {calculatedPoints}
                          </div>
                          <div className={`text-xs font-outfit ${getThemeStyles(theme, text.muted)}`}>
                            points
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Match Info */}
              <div className={`mt-6 pt-6 border-t ${getThemeStyles(theme, {
                dark: 'border-slate-700/60',
                light: 'border-slate-200'
              })}`}>
                <div className={`flex items-center justify-between text-sm font-outfit ${getThemeStyles(theme, text.muted)}`}>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>Prediction made: {format(parseISO(prediction.createdAt || prediction.date), 'MMM dd, yyyy • HH:mm')}</span>
                  </div>
                  {prediction.lastModified && (
                    <span>
                      Last modified: {format(parseISO(prediction.lastModified), 'MMM dd, yyyy • HH:mm')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PredictionBreakdownModal;
