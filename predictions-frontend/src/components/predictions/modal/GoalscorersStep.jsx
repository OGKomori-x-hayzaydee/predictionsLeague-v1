import { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../../context/ThemeContext";
import { getThemeStyles } from "../../../utils/themeUtils";
import { TargetIcon } from "@radix-ui/react-icons";
import ScoreDisplay from "./ScoreDisplay";
import GoalscorerSelector from "./GoalscorerSelector";
import ChipSelector from "./ChipSelector";

export default function GoalscorersStep({ 
  fixture, 
  homeScore, 
  awayScore, 
  homeScorers, 
  awayScorers, 
  onHomeScorerChange, 
  onAwayScorerChange, 
  selectedChips, 
  onToggleChip, 
  toggleChipInfoModal, 
  errors 
}) {
  const { theme } = useContext(ThemeContext);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Score summary */}
      <div
        className={`${getThemeStyles(theme, {
          dark: "bg-slate-800/50 border-slate-700/60",
          light: "bg-slate-50/50 border-slate-200/60",
        })} border rounded-xl p-4 mb-6 font-outfit`}
      >
        <div
          className={`${getThemeStyles(theme, {
            dark: "text-slate-300",
            light: "text-slate-700",
          })} text-sm font-medium mb-3 text-center`}
        >
          Your predicted score
        </div>
        <ScoreDisplay 
          fixture={fixture} 
          homeScore={homeScore} 
          awayScore={awayScore} 
          variant="summary" 
        />
      </div>

      {/* Goalscorers section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <TargetIcon className="w-5 h-5 text-blue-400" />
          </div>
          <h3
            className={`${getThemeStyles(theme, {
              dark: "text-slate-100",
              light: "text-slate-900",
            })} text-xl font-bold font-outfit`}
          >
            Goalscorers
          </h3>
        </div>

        {homeScore > 0 || awayScore > 0 ? (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Home team scorers */}
              {homeScore > 0 && (
                <GoalscorerSelector
                  team={fixture.homeTeam}
                  teamType="home"
                  score={homeScore}
                  scorers={homeScorers}
                  onScorerChange={onHomeScorerChange}
                  error={errors.homeScorers}
                />
              )}

              {/* Away team scorers */}
              {awayScore > 0 && (
                <GoalscorerSelector
                  team={fixture.awayTeam}
                  teamType="away"
                  score={awayScore}
                  scorers={awayScorers}
                  onScorerChange={onAwayScorerChange}
                  error={errors.awayScorers}
                />
              )}
            </div>
          </div>
        ) : (
          <div
            className={`font-outfit rounded-xl py-4 px-5 text-center border border-dashed ${getThemeStyles(theme, {
              dark: "border-slate-600/50 bg-slate-800/30",
              light: "border-slate-300/50 bg-slate-50/30",
            })} flex flex-col items-center mt-4`}
          >
            <p
              className={`${getThemeStyles(theme, {
                dark: "text-slate-200",
                light: "text-slate-800",
              })} text-md font-medium`}
            >
              Scoreless draw predicted
            </p>
            <p
              className={`${getThemeStyles(theme, {
                dark: "text-slate-400",
                light: "text-slate-600",
              })} text-sm mt-1`}
            >
              No goalscorers needed
            </p>
          </div>
        )}
      </div>

      {/* Chips section */}
      <ChipSelector
        selectedChips={selectedChips}
        onToggleChip={onToggleChip}
        toggleChipInfoModal={toggleChipInfoModal}
      />
    </motion.div>
  );
}
