import { motion } from "framer-motion";
import { InfoCircledIcon, StarIcon, LightningBoltIcon, TargetIcon, RocketIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useContext, useMemo, memo } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { backgrounds, text, getThemeStyles } from "../../utils/themeUtils";
import { CHIP_CONFIG } from "../../utils/chipManager";

const ChipStrategyModal = memo(({ isOpen, onClose }) => {
  const { theme } = useContext(ThemeContext);
  
  // Memoize all theme-related styles to prevent recalculation
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
      dark: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
      light: 'bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-200/50'
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

  // Generate chip data from CHIP_CONFIG with UI enhancements
  const chipData = useMemo(() => {
    // Strategy tips for each chip
    const chipTips = {
      doubleDown: 'Ideal for high-confidence predictions, especially exact scorelines or when you\'ve predicted multiple correct goalscorers. Use freely - available every gameweek!',
      wildcard: 'Reserve for your most confident predictions. Use strategically - 7 gameweek cooldown means you can only use it a few times per season!',
      scorerFocus: 'Perfect for matches featuring prolific goalscorers or games expected to be high-scoring. Research team news and recent form to maximize effectiveness.',
      defensePlusPlus: 'Analyze defensive statistics and upcoming fixtures. Best used when strong defensive teams face weaker attacking sides. Must get ALL clean sheet predictions correct to earn the bonus.',
      allInWeek: 'Use when extremely confident across all matches in the gameweek. Ideal for gameweeks with many predictable fixtures. Be careful - negative points are also doubled!'
    };

    // Hover colors for each chip color
    const hoverColors = {
      teal: 'teal-500/30',
      purple: 'purple-500/30',
      green: 'green-500/30',
      blue: 'blue-500/30',
      red: 'red-500/30'
    };

    // Generate match chips (scope: match)
    const matchChips = Object.values(CHIP_CONFIG)
      .filter(chip => chip.scope === 'match')
      .map(chip => ({
        id: chip.id,
        icon: chip.icon,
        name: chip.name,
        cooldown: chip.cooldown === 0 ? 'Available every gameweek' : `Cooldown: ${chip.cooldown} gameweeks between uses`,
        description: chip.description,
        bgColor: chip.color,
        hoverColor: hoverColors[chip.color],
        tipTitle: 'Strategic Usage:',
        tip: chipTips[chip.id]
      }));

    // Generate gameweek chips (scope: gameweek)
    const gameweekChips = Object.values(CHIP_CONFIG)
      .filter(chip => chip.scope === 'gameweek')
      .map(chip => ({
        id: chip.id,
        icon: chip.icon,
        name: chip.name,
        usage: chip.seasonLimit 
          ? `Limited use: ${chip.seasonLimit} per season`
          : chip.cooldown > 0 
            ? `Cooldown: ${chip.cooldown} gameweeks between uses`
            : 'Available every gameweek',
        description: chip.description,
        bgColor: chip.color,
        hoverColor: hoverColors[chip.color],
        tipTitle: 'Strategic Usage:',
        tip: chipTips[chip.id]
      }));

    return { matchChips, gameweekChips };
  }, []);
  
  // Memoized chip card component to prevent unnecessary re-renders
  const ChipCard = memo(({ chip, type = 'match' }) => {
    const colorMap = {
      emerald: { 
        bg: getThemeStyles(theme, { dark: 'bg-gradient-to-br from-emerald-900/60 to-emerald-800/40', light: 'bg-gradient-to-br from-emerald-50 to-emerald-100' }), 
        border: getThemeStyles(theme, { dark: 'border-emerald-600/40', light: 'border-emerald-200/60' }), 
        text: getThemeStyles(theme, { dark: 'text-emerald-300', light: 'text-emerald-700' }), 
        tip: getThemeStyles(theme, { dark: 'text-emerald-200', light: 'text-emerald-600' }),
        iconBg: getThemeStyles(theme, { dark: 'bg-emerald-500/25 border-emerald-400/30', light: 'bg-emerald-200/60 border-emerald-300/50' }),
        shadow: 'shadow-emerald-500/10'
      },
      purple: { 
        bg: getThemeStyles(theme, { dark: 'bg-gradient-to-br from-purple-900/60 to-purple-800/40', light: 'bg-gradient-to-br from-purple-50 to-purple-100' }), 
        border: getThemeStyles(theme, { dark: 'border-purple-600/40', light: 'border-purple-200/60' }), 
        text: getThemeStyles(theme, { dark: 'text-purple-300', light: 'text-purple-700' }), 
        tip: getThemeStyles(theme, { dark: 'text-purple-200', light: 'text-purple-600' }),
        iconBg: getThemeStyles(theme, { dark: 'bg-purple-500/25 border-purple-400/30', light: 'bg-purple-200/60 border-purple-300/50' }),
        shadow: 'shadow-purple-500/10'
      },
      sky: { 
        bg: getThemeStyles(theme, { dark: 'bg-gradient-to-br from-sky-900/60 to-sky-800/40', light: 'bg-gradient-to-br from-sky-50 to-sky-100' }), 
        border: getThemeStyles(theme, { dark: 'border-sky-600/40', light: 'border-sky-200/60' }), 
        text: getThemeStyles(theme, { dark: 'text-sky-300', light: 'text-sky-700' }), 
        tip: getThemeStyles(theme, { dark: 'text-sky-200', light: 'text-sky-600' }),
        iconBg: getThemeStyles(theme, { dark: 'bg-sky-500/25 border-sky-400/30', light: 'bg-sky-200/60 border-sky-300/50' }),
        shadow: 'shadow-sky-500/10'
      },
      green: { 
        bg: getThemeStyles(theme, { dark: 'bg-gradient-to-br from-green-900/60 to-green-800/40', light: 'bg-gradient-to-br from-green-50 to-green-100' }), 
        border: getThemeStyles(theme, { dark: 'border-green-600/40', light: 'border-green-200/60' }), 
        text: getThemeStyles(theme, { dark: 'text-green-300', light: 'text-green-700' }), 
        tip: getThemeStyles(theme, { dark: 'text-green-200', light: 'text-green-600' }),
        iconBg: getThemeStyles(theme, { dark: 'bg-green-500/25 border-green-400/30', light: 'bg-green-200/60 border-green-300/50' }),
        shadow: 'shadow-green-500/10'
      },
      amber: { 
        bg: getThemeStyles(theme, { dark: 'bg-gradient-to-br from-amber-900/60 to-amber-800/40', light: 'bg-gradient-to-br from-amber-50 to-amber-100' }), 
        border: getThemeStyles(theme, { dark: 'border-amber-600/40', light: 'border-amber-200/60' }), 
        text: getThemeStyles(theme, { dark: 'text-amber-300', light: 'text-amber-700' }), 
        tip: getThemeStyles(theme, { dark: 'text-amber-200', light: 'text-amber-600' }),
        iconBg: getThemeStyles(theme, { dark: 'bg-amber-500/25 border-amber-400/30', light: 'bg-amber-200/60 border-amber-300/50' }),
        shadow: 'shadow-amber-500/10'
      },
      blue: { 
        bg: getThemeStyles(theme, { dark: 'bg-gradient-to-br from-blue-900/60 to-blue-800/40', light: 'bg-gradient-to-br from-blue-50 to-blue-100' }), 
        border: getThemeStyles(theme, { dark: 'border-blue-600/40', light: 'border-blue-200/60' }), 
        text: getThemeStyles(theme, { dark: 'text-blue-300', light: 'text-blue-700' }), 
        tip: getThemeStyles(theme, { dark: 'text-blue-200', light: 'text-blue-600' }),
        iconBg: getThemeStyles(theme, { dark: 'bg-blue-500/25 border-blue-400/30', light: 'bg-blue-200/60 border-blue-300/50' }),
        shadow: 'shadow-blue-500/10'
      },
      red: { 
        bg: getThemeStyles(theme, { dark: 'bg-gradient-to-br from-red-900/60 to-red-800/40', light: 'bg-gradient-to-br from-red-50 to-red-100' }), 
        border: getThemeStyles(theme, { dark: 'border-red-600/40', light: 'border-red-200/60' }), 
        text: getThemeStyles(theme, { dark: 'text-red-300', light: 'text-red-700' }), 
        tip: getThemeStyles(theme, { dark: 'text-red-200', light: 'text-red-600' }),
        iconBg: getThemeStyles(theme, { dark: 'bg-red-500/25 border-red-400/30', light: 'bg-red-200/60 border-red-300/50' }),
        shadow: 'shadow-red-500/10'
      }
    };
    
    const colors = colorMap[chip.bgColor] || colorMap.emerald;
    
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`${themeStyles.cardBg} rounded-xl p-6 border transition-all duration-300 hover:shadow-lg ${colors.shadow} group overflow-hidden relative`}
      >
        {/* Subtle background pattern */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colors.bg}`} />
        
        <div className="relative">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center border shadow-sm`}>
              <span className={`${colors.text} text-xl ${typeof chip.icon === 'string' && chip.icon.length > 2 ? 'text-base' : 'font-bold'} font-outfit`}>
                {chip.icon}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h5 className={`${themeStyles.titleText} text-lg font-bold font-outfit mb-1 group-hover:${colors.text} transition-colors`}>
                {chip.name}
              </h5>
              <div className={`text-xs font-medium font-outfit px-2 py-1 rounded-md ${colors.iconBg} ${colors.tip} inline-block`}>
                {chip.cooldown || chip.usage}
              </div>
            </div>
          </div>

          <p className={`${themeStyles.secondaryText} text-sm mb-5 leading-relaxed font-outfit`}>
            {chip.description}
          </p>

          <div className={`${colors.bg} rounded-xl p-4 border ${colors.border} backdrop-blur-sm`}>
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-lg ${colors.iconBg} flex items-center justify-center mt-0.5 shrink-0`}>
                <StarIcon className={`w-3.5 h-3.5 ${colors.text}`} />
              </div>
              <div className="flex-1">
                <h6 className={`text-xs font-bold mb-2 font-outfit ${colors.text} uppercase tracking-wider`}>
                  {chip.tipTitle}
                </h6>
                <p className={`${colors.tip} text-xs leading-relaxed font-outfit`}>
                  {chip.tip}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  });
  
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
            dark: 'bg-gradient-to-bl from-emerald-500/10 via-teal-500/5 to-transparent', 
            light: 'bg-gradient-to-bl from-emerald-200/20 via-teal-200/10 to-transparent' 
          })} rounded-full blur-3xl transform rotate-12`} />
          <div className={`absolute bottom-0 left-0 w-80 h-80 ${getThemeStyles(theme, { 
            dark: 'bg-gradient-to-tr from-blue-500/8 via-purple-500/5 to-transparent', 
            light: 'bg-gradient-to-tr from-blue-200/15 via-purple-200/8 to-transparent' 
          })} rounded-full blur-3xl transform -rotate-12`} />
        </div>

        {/* Header */}
        <div className={`${themeStyles.headerBg} p-3 sm:p-8 border-b relative z-10`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${themeStyles.iconBg} border shadow-lg`}>
                <RocketIcon className={`w-7 h-7 ${getThemeStyles(theme, { dark: 'text-emerald-300', light: 'text-emerald-600' })}`} />
              </div>
              <div>
                <h3 className={`${themeStyles.titleText} text-3xl font-bold font-outfit mb-1`}>
                  Chip Strategy Guide
                </h3>
                <p className={`${themeStyles.mutedText} text-sm font-outfit flex items-center gap-2`}>
                  <InfoCircledIcon className="w-4 h-4" />
                  Master the art of strategic chip usage to maximize your points
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
          {/* Introduction */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${themeStyles.sectionBg} rounded-2xl p-6 mb-8 border relative overflow-hidden`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 ${getThemeStyles(theme, { 
              dark: 'bg-gradient-to-bl from-emerald-500/10 to-transparent', 
              light: 'bg-gradient-to-bl from-emerald-200/20 to-transparent' 
            })} rounded-full blur-xl`} />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg ${themeStyles.iconBg} flex items-center justify-center border`}>
                  <InfoCircledIcon className={`w-4 h-4 ${getThemeStyles(theme, { dark: 'text-emerald-300', light: 'text-emerald-600' })}`} />
                </div>
                <h4 className={`${themeStyles.titleText} text-lg font-bold font-outfit`}>
                  Strategic Overview
                </h4>
              </div>
              <p className={`${themeStyles.secondaryText} text-sm leading-relaxed font-outfit`}>
                Strategic chip usage can dramatically improve your position in the league. Each chip has unique timing and application strategies that can maximize your points when used effectively. Plan your chip usage carefully to gain the maximum advantage over your competition.
              </p>
            </div>
          </motion.div>

          <div className="space-y-10">
            {/* Match-Specific Chips Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`${themeStyles.sectionBg} rounded-2xl p-8 border relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${getThemeStyles(theme, { 
                dark: 'bg-gradient-to-bl from-emerald-500/8 to-transparent', 
                light: 'bg-gradient-to-bl from-emerald-200/15 to-transparent' 
              })} rounded-full blur-2xl`} />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl ${getThemeStyles(theme, { dark: 'bg-emerald-500/20 border-emerald-400/30', light: 'bg-emerald-200/60 border-emerald-300/50' })} flex items-center justify-center border shadow-sm`}>
                    <RocketIcon className={`w-5 h-5 ${getThemeStyles(theme, { dark: 'text-emerald-300', light: 'text-emerald-600' })}`} />
                  </div>
                  <h4 className={`${themeStyles.titleText} text-2xl font-bold font-outfit`}>
                    Match Chips
                  </h4>
                </div>
                <div className={`h-0.5 ${themeStyles.divider} mb-2`}></div>
                <p className={`${themeStyles.mutedText} text-sm font-outfit mb-6 flex items-center gap-2`}>
                  <TargetIcon className="w-4 h-4" />
                  Apply during individual match predictions for targeted impact
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {chipData.matchChips.map((chip, index) => (
                    <motion.div
                      key={chip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <ChipCard chip={chip} type="match" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Gameweek Chips Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`${themeStyles.sectionBg} rounded-2xl p-8 border relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${getThemeStyles(theme, { 
                dark: 'bg-gradient-to-bl from-blue-500/8 to-transparent', 
                light: 'bg-gradient-to-bl from-blue-200/15 to-transparent' 
              })} rounded-full blur-2xl`} />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl ${getThemeStyles(theme, { dark: 'bg-blue-500/20 border-blue-400/30', light: 'bg-blue-200/60 border-blue-300/50' })} flex items-center justify-center border shadow-sm`}>
                    <TargetIcon className={`w-5 h-5 ${getThemeStyles(theme, { dark: 'text-blue-300', light: 'text-blue-600' })}`} />
                  </div>
                  <h4 className={`${themeStyles.titleText} text-2xl font-bold font-outfit`}>
                    Gameweek Chips
                  </h4>
                </div>
                <div className={`h-0.5 ${themeStyles.divider} mb-2`}></div>
                <p className={`${themeStyles.mutedText} text-sm font-outfit mb-6 flex items-center gap-2`}>
                  <LightningBoltIcon className="w-4 h-4" />
                  Affects all your predictions in the entire gameweek
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {chipData.gameweekChips.map((chip, index) => (
                    <motion.div
                      key={chip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <ChipCard chip={chip} type="gameweek" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Chip Management Guidelines */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`${themeStyles.sectionBg} rounded-2xl p-8 border relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${getThemeStyles(theme, { 
                dark: 'bg-gradient-to-bl from-purple-500/8 to-transparent', 
                light: 'bg-gradient-to-bl from-purple-200/15 to-transparent' 
              })} rounded-full blur-2xl`} />
              
              <div className="relative">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-10 h-10 rounded-xl ${getThemeStyles(theme, { dark: 'bg-purple-500/20 border-purple-400/30', light: 'bg-purple-200/60 border-purple-300/50' })} flex items-center justify-center border shadow-sm mt-1`}>
                    <LightningBoltIcon className={`w-5 h-5 ${getThemeStyles(theme, { dark: 'text-purple-300', light: 'text-purple-600' })}`} />
                  </div>
                  <div>
                    <h4 className={`${themeStyles.titleText} text-2xl font-bold font-outfit mb-2`}>
                      Strategic Guidelines
                    </h4>
                    <div className={`h-0.5 ${themeStyles.divider} mb-3`}></div>
                    <p className={`${themeStyles.mutedText} text-sm font-outfit`}>
                      Essential principles for maximizing your chip effectiveness
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    {[
                      "Gameweek chips apply retroactively to all pending predictions in that gameweek - apply them anytime!",
                      "Match chips are limited to 2 per prediction, but gameweek chips have no limits",
                      "Once a chip is applied to a prediction, it cannot be removed (immutable)"
                    ].map((guideline, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-opacity-50 transition-colors"
                      >
                        <div className={`w-6 h-6 rounded-lg ${getThemeStyles(theme, { dark: 'bg-emerald-500/20', light: 'bg-emerald-200/50' })} flex items-center justify-center mt-0.5 shrink-0`}>
                          <div className={`w-2 h-2 rounded-full ${getThemeStyles(theme, { dark: 'bg-emerald-400', light: 'bg-emerald-600' })}`}></div>
                        </div>
                        <span className={`${themeStyles.secondaryText} text-sm font-outfit leading-relaxed`}>
                          {guideline}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      "Defense++ applies only to predictions with clean sheets (0 goals conceded)",
                      "All-In Week applies to all pending predictions automatically when activated",
                      "Strategic timing and fixture analysis are key to maximizing chip effectiveness"
                    ].map((guideline, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-opacity-50 transition-colors"
                      >
                        <div className={`w-6 h-6 rounded-lg ${getThemeStyles(theme, { dark: 'bg-emerald-500/20', light: 'bg-emerald-200/50' })} flex items-center justify-center mt-0.5 shrink-0`}>
                          <div className={`w-2 h-2 rounded-full ${getThemeStyles(theme, { dark: 'bg-emerald-400', light: 'bg-emerald-600' })}`}></div>
                        </div>
                        <span className={`${themeStyles.secondaryText} text-sm font-outfit leading-relaxed`}>
                          {guideline}
                        </span>
                      </motion.div>
                    ))}
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

ChipStrategyModal.displayName = 'ChipStrategyModal';

export default ChipStrategyModal;