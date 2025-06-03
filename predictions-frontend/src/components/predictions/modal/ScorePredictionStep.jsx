import { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../../context/ThemeContext";
import { getThemeStyles, backgrounds, text } from "../../../utils/themeUtils";
import { getTeamLogo } from "../../../data/sampleData";
import { RocketIcon } from "@radix-ui/react-icons";
import CommunityInsights from "./CommunityInsights";

export default function ScorePredictionStep({ 
  fixture, 
  homeScore, 
  awayScore, 
  onHomeScoreChange, 
  onAwayScoreChange 
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

        {/* Match details */}
        <div
          className={`${getThemeStyles(theme, {
            dark: "bg-slate-800/50 border-slate-700/60",
            light: "bg-slate-50/50 border-slate-200/60",
          })} border rounded-xl p-5`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`${getThemeStyles(
                theme,
                text.muted
              )} text-xs font-outfit`}
            >
              Premier League • GW{fixture.gameweek}
            </div>
            <div
              className={`${getThemeStyles(
                theme,
                text.muted
              )} text-xs font-outfit`}
            >
              {fixture.venue}
            </div>
          </div>

          {/* Score prediction section */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center w-5/12">
              <div className="w-16 h-16 p-1 bg-slate-700/30 border border-slate-600/50 rounded-full mb-3 flex items-center justify-center">
                <img
                  src={getTeamLogo(fixture.homeTeam)}
                  alt={fixture.homeTeam}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <span
                className={`${getThemeStyles(theme, {
                  dark: "text-slate-200",
                  light: "text-slate-800",
                })} font-outfit text-sm text-center mb-3 font-medium`}
              >
                {fixture.homeTeam}
              </span>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={homeScore === 0 ? "" : homeScore}
                  onChange={(e) => {
                    const val = e.target.value;
                    onHomeScoreChange(
                      val === ""
                        ? 0
                        : Math.min(9, Math.max(0, parseInt(val) || 0))
                    );
                  }}
                  className={`appearance-none ${getThemeStyles(theme, {
                    dark: "bg-slate-800/80 border-slate-600/50 text-slate-100",
                    light: "bg-white/80 border-slate-300/50 text-slate-900",
                  })} border rounded-lg w-16 h-14 text-2xl text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  aria-label={`${fixture.homeTeam} score`}
                  placeholder="0"
                />
              </div>
            </div>

            <div
              className={`${getThemeStyles(
                theme,
                text.muted
              )} text-base font-outfit font-medium`}
            >
              vs
            </div>

            <div className="flex flex-col items-center w-5/12">
              <div className="w-16 h-16 p-1 bg-slate-700/30 border border-slate-600/50 rounded-full mb-3 flex items-center justify-center">
                <img
                  src={getTeamLogo(fixture.awayTeam)}
                  alt={fixture.awayTeam}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <span
                className={`${getThemeStyles(theme, {
                  dark: "text-slate-200",
                  light: "text-slate-800",
                })} font-outfit text-sm text-center mb-3 font-medium`}
              >
                {fixture.awayTeam}
              </span>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={awayScore === 0 ? "" : awayScore}
                  onChange={(e) => {
                    const val = e.target.value;
                    onAwayScoreChange(
                      val === ""
                        ? 0
                        : Math.min(9, Math.max(0, parseInt(val) || 0))
                    );
                  }}
                  className={`appearance-none ${getThemeStyles(theme, {
                    dark: "bg-slate-800/80 border-slate-600/50 text-slate-100",
                    light: "bg-white/80 border-slate-300/50 text-slate-900",
                  })} border rounded-lg w-16 h-14 text-2xl text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                  aria-label={`${fixture.awayTeam} score`}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community insights */}
      <CommunityInsights fixture={fixture} />
    </motion.div>
  );
}
