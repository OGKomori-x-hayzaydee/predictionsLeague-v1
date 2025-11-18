import { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../../context/ThemeContext";
import { getThemeStyles, backgrounds, text } from "../../../utils/themeUtils";
import { RocketIcon } from "@radix-ui/react-icons";

export default function ScorePredictionStep({ 
  fixture, 
  homeScore, 
  awayScore, 
  onHomeScoreChange, 
  onAwayScoreChange,
  disabled = false
}) {
  const { theme } = useContext(ThemeContext);

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="pb-4"
    >
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <RocketIcon
              className={`w-5 h-5 ${getThemeStyles(theme, {
                dark: "text-emerald-400",
                light: "text-emerald-600",
              })}`}
            />
          </div>
          <h3
            className={`${getThemeStyles(
              theme,
              text.primary
            )} text-xl font-bold font-outfit`}
          >
            Predict the scoreline
          </h3>
        </div>

        {/* Rich Card Style Score Prediction */}
        <div className={`rounded-xl p-6 ${getThemeStyles(theme, {
          dark: 'bg-slate-800/50 border border-slate-700/60',
          light: 'bg-slate-50 border border-slate-200'
        })}`}>
          {/* Match Info Header */}
          <div className={`text-xs font-medium mb-4 font-outfit ${getThemeStyles(theme, text.muted)}`}>
            Premier League • GW{fixture.gameweek} • {fixture.venue}
          </div>

          {/* Score Input Section */}
          <div className={`rounded-lg p-6 ${getThemeStyles(theme, {
            dark: 'bg-slate-900/50 border border-slate-700/30',
            light: 'bg-white border border-slate-200'
          })}`}>
            <div className={`text-xs font-medium mb-4 font-outfit ${getThemeStyles(theme, text.muted)}`}>
              Enter Score Prediction
            </div>
            
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center flex-1">
                <div className={`text-sm font-medium font-outfit mb-2 truncate ${getThemeStyles(theme, text.secondary)}`}>
                  {fixture.homeTeam}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={homeScore === 0 ? "" : homeScore}
                    onChange={(e) => {
                      if (disabled) return;
                      const val = e.target.value;
                      onHomeScoreChange(
                        val === ""
                          ? 0
                          : Math.min(9, Math.max(0, parseInt(val) || 0))
                      );
                    }}
                    disabled={disabled}
                    className={`appearance-none rounded-lg w-20 h-16 text-3xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none font-outfit font-bold ${
                      disabled 
                        ? getThemeStyles(theme, {
                            dark: 'bg-slate-900/50 border border-slate-700/30 text-slate-600 cursor-not-allowed',
                            light: 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                          })
                        : getThemeStyles(theme, {
                            dark: 'bg-slate-800/80 border border-slate-600/50 text-slate-100',
                            light: 'bg-slate-50 border border-slate-300 text-slate-900'
                          })
                    }`}
                    aria-label={`${fixture.homeTeam} score`}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className={`text-lg font-bold font-outfit ${getThemeStyles(theme, text.muted)}`}>
                —
              </div>
              
              <div className="text-center flex-1">
                <div className={`text-sm font-medium font-outfit mb-2 truncate ${getThemeStyles(theme, text.secondary)}`}>
                  {fixture.awayTeam}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="9"
                    value={awayScore === 0 ? "" : awayScore}
                    onChange={(e) => {
                      if (disabled) return;
                      const val = e.target.value;
                      onAwayScoreChange(
                        val === ""
                          ? 0
                          : Math.min(9, Math.max(0, parseInt(val) || 0))
                      );
                    }}
                    disabled={disabled}
                    className={`appearance-none rounded-lg w-20 h-16 text-3xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none font-outfit font-bold ${
                      disabled 
                        ? getThemeStyles(theme, {
                            dark: 'bg-slate-900/50 border border-slate-700/30 text-slate-600 cursor-not-allowed',
                            light: 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                          })
                        : getThemeStyles(theme, {
                            dark: 'bg-slate-800/80 border border-slate-600/50 text-slate-100',
                            light: 'bg-slate-50 border border-slate-300 text-slate-900'
                          })
                    }`}
                    aria-label={`${fixture.awayTeam} score`}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
