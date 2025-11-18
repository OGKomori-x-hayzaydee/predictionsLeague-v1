import { motion } from "framer-motion";
import { InfoCircledIcon, Cross2Icon, CheckIcon, ExclamationTriangleIcon, CalendarIcon, ClockIcon, StarIcon } from "@radix-ui/react-icons";
import { useContext, useMemo, memo } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { getThemeStyles, backgrounds, text } from "../../utils/themeUtils";

const RulesAndPointsModal = memo(({ isOpen, onClose }) => {
  const { theme } = useContext(ThemeContext);
  
  // Memoize all theme-related styles
  const themeStyles = useMemo(() => ({
    modalBg: getThemeStyles(theme, {
      dark: "bg-slate-900/98 border-slate-700/40",
      light: "bg-white/98 border-slate-200/60",
    }),
    headerBg: getThemeStyles(theme, {
      dark: "bg-gradient-to-r from-slate-800/90 to-slate-700/90 border-slate-700/50",
      light: "bg-gradient-to-r from-slate-50/90 to-slate-100/90 border-slate-200/50"
    }),
    cardBg: getThemeStyles(theme, {
      dark: "bg-slate-800/60 border-slate-700/40 backdrop-blur-sm",
      light: "bg-white/80 border-slate-200/60 backdrop-blur-sm shadow-sm"
    }),
    sectionBg: getThemeStyles(theme, {
      dark: "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/30",
      light: "bg-gradient-to-br from-slate-50/80 to-white/80 border-slate-200/50 shadow-sm"
    }),
    iconBg: getThemeStyles(theme, {
      dark: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/30',
      light: 'bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-200/50'
    }),
    closeBtn: getThemeStyles(theme, {
      dark: 'bg-slate-800/60 hover:bg-slate-700/70 text-slate-400 hover:text-slate-200 border-slate-700/40',
      light: 'bg-slate-100/60 hover:bg-slate-200/70 text-slate-600 hover:text-slate-800 border-slate-200/40'
    }),
    titleText: getThemeStyles(theme, text.primary),
    mutedText: getThemeStyles(theme, text.muted),
    secondaryText: getThemeStyles(theme, text.secondary),
    divider: getThemeStyles(theme, {
      dark: 'bg-gradient-to-r from-transparent via-slate-700/60 to-transparent',
      light: 'bg-gradient-to-r from-transparent via-slate-300/60 to-transparent'
    })
  }), [theme]);

  // Memoized scoring data
  const scoringData = useMemo(() => ({
    basicPoints: [
      { points: 5, name: 'Correct winner', description: 'Predict the right match winner (home win, away win, or draw).', icon: StarIcon, color: 'emerald' },
      { points: 7, name: 'Correct draw prediction', description: 'Successfully predict that the match will end in a draw.', icon: CheckIcon, color: 'blue' },
      { points: 10, name: 'Exact scoreline', description: 'Predict the precise final score of the match.', icon: StarIcon, color: 'purple' },
      { points: 15, name: 'Exact scoreline with scorers', description: 'Predict both the correct score and all goalscorers correctly - the ultimate prediction!', icon: StarIcon, color: 'amber' },
      { points: 2, name: 'Correct goalscorer', description: 'Each correctly predicted player who scores in the match.', icon: CheckIcon, color: 'green' },
      { points: 4, name: 'Correct own goal prediction', description: 'Successfully predict an own goal occurrence in the match.', icon: ExclamationTriangleIcon, color: 'orange' },
      { points: -1, name: 'Incorrect prediction (2+ goal difference)', description: 'Penalty applied when your prediction is significantly off target.', icon: ExclamationTriangleIcon, color: 'red' }
    ],
    bonusPoints: [
      { points: '1.5x', name: 'Derby match multiplier', description: 'All points are multiplied by 1.5x for predictions involving traditional rivalries and high-profile matches.', icon: StarIcon, color: 'amber' },
      { points: '+10', name: 'Clean sheet bonus', description: 'Additional 10 points when you correctly predict a team will keep a clean sheet (not concede any goals).', icon: StarIcon, color: 'blue' }
    ],
    gameRules: [
      { 
        rule: 'Six Matches Per Gameweek', 
        description: 'Players predict results for 6 matches each gameweek involving the Premier League\'s "Big Six" teams (Arsenal, Chelsea, Liverpool, Manchester City, Manchester United, Tottenham).', 
        icon: CalendarIcon,
        color: 'blue'
      },
      { 
        rule: 'Submission Deadline', 
        description: 'All predictions must be submitted at least 45 minutes before the kickoff time of each individual match.', 
        icon: ClockIcon,
        color: 'amber'
      },
      { 
        rule: 'League Standings', 
        description: 'Your position in both global and private league standings is determined by your total accumulated points across all gameweeks.', 
        icon: StarIcon,
        color: 'emerald'
      },
      { 
        rule: 'Private Leagues', 
        description: 'Create or join private leagues using invite codes to compete with friends, family, and colleagues in smaller, more personal competitions.', 
        icon: InfoCircledIcon,
        color: 'purple'
      }
    ]
  }), []);
  
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className={`${themeStyles.modalBg} rounded-xl sm:rounded-3xl max-w-[92vw] sm:max-w-6xl w-full max-h-[92vh] overflow-hidden shadow-2xl border backdrop-blur-xl relative text-sm sm:text-base`}
      >
        {/* Animated background gradients */}
        <div className="absolute inset-0 opacity-30">
          <div className={`absolute top-0 right-0 w-96 h-96 ${getThemeStyles(theme, { 
            dark: 'bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent', 
            light: 'bg-gradient-to-bl from-blue-200/20 via-indigo-200/10 to-transparent' 
          })} rounded-full blur-3xl transform rotate-12`} />
          <div className={`absolute bottom-0 left-0 w-80 h-80 ${getThemeStyles(theme, { 
            dark: 'bg-gradient-to-tr from-emerald-500/8 via-teal-500/5 to-transparent', 
            light: 'bg-gradient-to-tr from-emerald-200/15 via-teal-200/8 to-transparent' 
          })} rounded-full blur-3xl transform -rotate-12`} />
        </div>

        {/* Header */}
        <div className={`${themeStyles.headerBg} p-3 sm:p-8 border-b relative z-10`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${themeStyles.iconBg} border shadow-lg`}>
                <StarIcon className={`w-7 h-7 ${getThemeStyles(theme, { dark: 'text-blue-300', light: 'text-blue-600' })}`} />
              </div>
              <div>
                <h3 className={`${themeStyles.titleText} text-3xl font-bold font-outfit mb-1`}>
                  Rules & Scoring System
                </h3>
                <p className={`${themeStyles.mutedText} text-sm font-outfit flex items-center gap-2`}>
                  <InfoCircledIcon className="w-4 h-4" />
                  Complete guide to PredictionsLeague rules and scoring mechanics
                </p>
              </div>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-10 h-10 rounded-xl ${themeStyles.closeBtn} flex items-center justify-center transition-all duration-200 border shadow-sm`}
            >
              <Cross2Icon className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-8 overflow-y-auto max-h-[calc(92vh-140px)] relative z-10">
          <div className="space-y-10">
            
            {/* Game Rules Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${themeStyles.sectionBg} rounded-2xl p-8 border relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${getThemeStyles(theme, { 
                dark: 'bg-gradient-to-bl from-blue-500/8 to-transparent', 
                light: 'bg-gradient-to-bl from-blue-200/15 to-transparent' 
              })} rounded-full blur-2xl`} />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl ${getThemeStyles(theme, { dark: 'bg-blue-500/20 border-blue-400/30', light: 'bg-blue-200/60 border-blue-300/50' })} flex items-center justify-center border shadow-sm`}>
                    <CalendarIcon className={`w-5 h-5 ${getThemeStyles(theme, { dark: 'text-blue-300', light: 'text-blue-600' })}`} />
                  </div>
                  <h4 className={`${themeStyles.titleText} text-2xl font-bold font-outfit`}>
                    Game Rules
                  </h4>
                </div>
                <div className={`h-0.5 ${themeStyles.divider} mb-6`}></div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {scoringData.gameRules.map((rule, index) => {
                    const IconComponent = rule.icon;
                    const colorStyles = {
                      blue: getThemeStyles(theme, { dark: 'bg-blue-500/20 text-blue-300 border-blue-500/30', light: 'bg-blue-200/60 text-blue-700 border-blue-300/50' }),
                      amber: getThemeStyles(theme, { dark: 'bg-amber-500/20 text-amber-300 border-amber-500/30', light: 'bg-amber-200/60 text-amber-700 border-amber-300/50' }),
                      emerald: getThemeStyles(theme, { dark: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', light: 'bg-emerald-200/60 text-emerald-700 border-emerald-300/50' }),
                      purple: getThemeStyles(theme, { dark: 'bg-purple-500/20 text-purple-300 border-purple-500/30', light: 'bg-purple-200/60 text-purple-700 border-purple-300/50' }),
                    };
                    
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className={`flex items-start gap-4 p-5 rounded-xl border ${themeStyles.cardBg} hover:shadow-lg transition-all duration-300 group`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0 border shadow-sm ${colorStyles[rule.color]}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h5 className={`${themeStyles.titleText} font-bold font-outfit mb-2 text-lg group-hover:${colorStyles[rule.color].split(' ')[2]} transition-colors`}>
                            {rule.rule}
                          </h5>
                          <p className={`${themeStyles.secondaryText} text-sm leading-relaxed font-outfit`}>
                            {rule.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Basic Points Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`${themeStyles.sectionBg} rounded-2xl p-8 border relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${getThemeStyles(theme, { 
                dark: 'bg-gradient-to-bl from-emerald-500/8 to-transparent', 
                light: 'bg-gradient-to-bl from-emerald-200/15 to-transparent' 
              })} rounded-full blur-2xl`} />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl ${getThemeStyles(theme, { dark: 'bg-emerald-500/20 border-emerald-400/30', light: 'bg-emerald-200/60 border-emerald-300/50' })} flex items-center justify-center border shadow-sm`}>
                    <StarIcon className={`w-5 h-5 ${getThemeStyles(theme, { dark: 'text-emerald-300', light: 'text-emerald-600' })}`} />
                  </div>
                  <h4 className={`${themeStyles.titleText} text-2xl font-bold font-outfit`}>
                    Point Values
                  </h4>
                </div>
                <div className={`h-0.5 ${themeStyles.divider} mb-6`}></div>
                
                <div className="space-y-4">
                  {scoringData.basicPoints.map((item, index) => {
                    const IconComponent = item.icon;
                    const colorStyles = {
                      emerald: { bg: getThemeStyles(theme, { dark: 'bg-emerald-500/20', light: 'bg-emerald-100' }), text: getThemeStyles(theme, { dark: 'text-emerald-300', light: 'text-emerald-700' }), border: getThemeStyles(theme, { dark: 'border-emerald-500/30', light: 'border-emerald-300/50' }) },
                      blue: { bg: getThemeStyles(theme, { dark: 'bg-blue-500/20', light: 'bg-blue-100' }), text: getThemeStyles(theme, { dark: 'text-blue-300', light: 'text-blue-700' }), border: getThemeStyles(theme, { dark: 'border-blue-500/30', light: 'border-blue-300/50' }) },
                      purple: { bg: getThemeStyles(theme, { dark: 'bg-purple-500/20', light: 'bg-purple-100' }), text: getThemeStyles(theme, { dark: 'text-purple-300', light: 'text-purple-700' }), border: getThemeStyles(theme, { dark: 'border-purple-500/30', light: 'border-purple-300/50' }) },
                      amber: { bg: getThemeStyles(theme, { dark: 'bg-amber-500/20', light: 'bg-amber-100' }), text: getThemeStyles(theme, { dark: 'text-amber-300', light: 'text-amber-700' }), border: getThemeStyles(theme, { dark: 'border-amber-500/30', light: 'border-amber-300/50' }) },
                      green: { bg: getThemeStyles(theme, { dark: 'bg-green-500/20', light: 'bg-green-100' }), text: getThemeStyles(theme, { dark: 'text-green-300', light: 'text-green-700' }), border: getThemeStyles(theme, { dark: 'border-green-500/30', light: 'border-green-300/50' }) },
                      orange: { bg: getThemeStyles(theme, { dark: 'bg-orange-500/20', light: 'bg-orange-100' }), text: getThemeStyles(theme, { dark: 'text-orange-300', light: 'text-orange-700' }), border: getThemeStyles(theme, { dark: 'border-orange-500/30', light: 'border-orange-300/50' }) },
                      red: { bg: getThemeStyles(theme, { dark: 'bg-red-500/20', light: 'bg-red-100' }), text: getThemeStyles(theme, { dark: 'text-red-300', light: 'text-red-700' }), border: getThemeStyles(theme, { dark: 'border-red-500/30', light: 'border-red-300/50' }) }
                    };
                    
                    const colorStyle = colorStyles[item.color];
                    
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className={`flex items-center gap-4 p-5 rounded-xl ${themeStyles.cardBg} border hover:shadow-lg transition-all duration-300 group`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${colorStyle.bg} ${colorStyle.border}`}>
                          <IconComponent className={`w-6 h-6 ${colorStyle.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h5 className={`${themeStyles.titleText} font-bold font-outfit text-lg group-hover:${colorStyle.text} transition-colors`}>
                              {item.name}
                            </h5>
                            <div className={`px-3 py-1 rounded-lg ${colorStyle.bg} ${colorStyle.border} border`}>
                              <span className={`text-sm font-bold font-outfit ${colorStyle.text}`}>
                                {item.points > 0 ? '+' : ''}{item.points}
                              </span>
                            </div>
                          </div>
                          <p className={`${themeStyles.secondaryText} text-sm leading-relaxed font-outfit`}>
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Bonus Points Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={`${themeStyles.sectionBg} rounded-2xl p-8 border relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${getThemeStyles(theme, { 
                dark: 'bg-gradient-to-bl from-amber-500/8 to-transparent', 
                light: 'bg-gradient-to-bl from-amber-200/15 to-transparent' 
              })} rounded-full blur-2xl`} />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl ${getThemeStyles(theme, { dark: 'bg-amber-500/20 border-amber-400/30', light: 'bg-amber-200/60 border-amber-300/50' })} flex items-center justify-center border shadow-sm`}>
                    <StarIcon className={`w-5 h-5 ${getThemeStyles(theme, { dark: 'text-amber-300', light: 'text-amber-600' })}`} />
                  </div>
                  <h4 className={`${themeStyles.titleText} text-2xl font-bold font-outfit`}>
                    Bonus Points & Multipliers
                  </h4>
                </div>
                <div className={`h-0.5 ${themeStyles.divider} mb-6`}></div>
                
                <div className="space-y-4">
                  {scoringData.bonusPoints.map((item, index) => {
                    const IconComponent = item.icon;
                    const colorStyles = {
                      amber: { bg: getThemeStyles(theme, { dark: 'bg-amber-500/20', light: 'bg-amber-100' }), text: getThemeStyles(theme, { dark: 'text-amber-300', light: 'text-amber-700' }), border: getThemeStyles(theme, { dark: 'border-amber-500/30', light: 'border-amber-300/50' }) },
                      blue: { bg: getThemeStyles(theme, { dark: 'bg-blue-500/20', light: 'bg-blue-100' }), text: getThemeStyles(theme, { dark: 'text-blue-300', light: 'text-blue-700' }), border: getThemeStyles(theme, { dark: 'border-blue-500/30', light: 'border-blue-300/50' }) }
                    };
                    
                    const colorStyle = colorStyles[item.color];
                    
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className={`flex items-center gap-4 p-5 rounded-xl ${themeStyles.cardBg} border hover:shadow-lg transition-all duration-300 group`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${colorStyle.bg} ${colorStyle.border}`}>
                          <IconComponent className={`w-6 h-6 ${colorStyle.text}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h5 className={`${themeStyles.titleText} font-bold font-outfit text-lg group-hover:${colorStyle.text} transition-colors`}>
                              {item.name}
                            </h5>
                            <div className={`px-3 py-1 rounded-lg ${colorStyle.bg} ${colorStyle.border} border`}>
                              <span className={`text-sm font-bold font-outfit ${colorStyle.text}`}>
                                {item.points}
                              </span>
                            </div>
                          </div>
                          <p className={`${themeStyles.secondaryText} text-sm leading-relaxed font-outfit`}>
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Example Calculation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className={`${themeStyles.sectionBg} rounded-2xl p-8 border relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${getThemeStyles(theme, { 
                dark: 'bg-gradient-to-bl from-green-500/8 to-transparent', 
                light: 'bg-gradient-to-bl from-green-200/15 to-transparent' 
              })} rounded-full blur-2xl`} />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl ${getThemeStyles(theme, { dark: 'bg-green-500/20 border-green-400/30', light: 'bg-green-200/60 border-green-300/50' })} flex items-center justify-center border shadow-sm`}>
                    <CheckIcon className={`w-5 h-5 ${getThemeStyles(theme, { dark: 'text-green-300', light: 'text-green-600' })}`} />
                  </div>
                  <h4 className={`${themeStyles.titleText} text-2xl font-bold font-outfit`}>
                    Scoring Example
                  </h4>
                </div>
                <div className={`h-0.5 ${themeStyles.divider} mb-6`}></div>
                
                <div className={`p-6 rounded-xl border ${getThemeStyles(theme, { dark: 'bg-green-900/20 border-green-700/30', light: 'bg-green-50/80 border-green-200/60' })} backdrop-blur-sm`}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <h6 className={`${themeStyles.titleText} font-bold font-outfit text-sm mb-1 uppercase tracking-wider`}>Scenario</h6>
                        <p className={`${themeStyles.secondaryText} text-sm font-outfit`}>Manchester United vs Liverpool (Derby Match)</p>
                      </div>
                      <div>
                        <h6 className={`${themeStyles.titleText} font-bold font-outfit text-sm mb-1 uppercase tracking-wider`}>Your Prediction</h6>
                        <p className={`${themeStyles.secondaryText} text-sm font-outfit`}>Man United 2-1, Rashford scoring</p>
                      </div>
                      <div>
                        <h6 className={`${themeStyles.titleText} font-bold font-outfit text-sm mb-1 uppercase tracking-wider`}>Actual Result</h6>
                        <p className={`${themeStyles.secondaryText} text-sm font-outfit`}>Man United 2-1, Rashford scores</p>
                      </div>
                    </div>
                    
                    <div className={`border-t ${getThemeStyles(theme, { dark: 'border-green-700/30', light: 'border-green-200/60' })} pt-4`}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className={`${themeStyles.secondaryText} flex items-center gap-2 font-outfit`}>
                            <CheckIcon className="w-4 h-4" />
                            Exact scoreline prediction
                          </span>
                          <span className={`${themeStyles.titleText} font-semibold font-outfit`}>+10 points</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className={`${themeStyles.secondaryText} flex items-center gap-2 font-outfit`}>
                            <CheckIcon className="w-4 h-4" />
                            Correct goalscorer (Rashford)
                          </span>
                          <span className={`${themeStyles.titleText} font-semibold font-outfit`}>+2 points</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className={`${themeStyles.secondaryText} flex items-center gap-2 font-outfit`}>
                            <StarIcon className="w-4 h-4" />
                            Derby match multiplier
                          </span>
                          <span className={`${themeStyles.titleText} font-semibold font-outfit`}>12 × 1.5x</span>
                        </div>
                        <div className={`flex justify-between items-center pt-3 border-t ${getThemeStyles(theme, { dark: 'border-green-700/30', light: 'border-green-200/60' })}`}>
                          <span className={`${themeStyles.titleText} font-bold text-base flex items-center gap-2 font-outfit`}>
                            <StarIcon className="w-5 h-5" />
                            Final Total
                          </span>
                          <span className={`font-bold text-lg font-outfit ${getThemeStyles(theme, { dark: 'text-green-300', light: 'text-green-600' })}`}>18 points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

RulesAndPointsModal.displayName = 'RulesAndPointsModal';

export default RulesAndPointsModal;