import { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../../context/ThemeContext";
import { getThemeStyles } from "../../../utils/themeUtils";
import { TargetIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
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
  gameweek,
  chipWarning,
  errors,
  isEditing = false,
  lockedChips = [], // Array of chips that cannot be removed (already applied)
  userPredictions = [] // For validating gameweek-limited chips
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
      <div className={`rounded-xl p-6 mb-6 ${getThemeStyles(theme, {
        dark: 'bg-slate-800/50 border border-slate-700/60',
        light: 'bg-slate-50 border border-slate-200'
      })}`}>
        <div className={`text-xs font-medium mb-3 font-outfit text-center ${getThemeStyles(theme, {
          dark: 'text-slate-400',
          light: 'text-slate-600'
        })}`}>
          Your Predicted Score
        </div>
        <ScoreDisplay 
          fixture={fixture} 
          homeScore={homeScore} 
          awayScore={awayScore} 
          variant="summary" 
        />
      </div>

      {/* Goalscorers section */}
      <div className={`rounded-xl p-6 mb-6 ${getThemeStyles(theme, {
        dark: 'bg-slate-800/50 border border-slate-700/60',
        light: 'bg-slate-50 border border-slate-200'
      })}`}>
        <div className="flex items-center space-x-2 mb-4">
          <TargetIcon className={`w-5 h-5 ${getThemeStyles(theme, {
            dark: 'text-blue-400',
            light: 'text-blue-600'
          })}`} />
          <h3 className={`text-lg font-semibold font-outfit ${getThemeStyles(theme, {
            dark: 'text-slate-200',
            light: 'text-slate-800'
          })}`}>
            Select Goalscorers
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
                  players={fixture.homePlayers || []}
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
                  players={fixture.awayPlayers || []}
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
        gameweek={gameweek}
        lockedChips={lockedChips}
        userPredictions={userPredictions}
        currentMatchId={fixture?.id}
      />

      {/* Chip warning banner */}
      {chipWarning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 rounded-xl p-4 border flex items-start gap-3 ${getThemeStyles(theme, {
            dark: 'bg-amber-500/10 border-amber-500/30',
            light: 'bg-amber-50 border-amber-300'
          })}`}
        >
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className={`text-sm font-medium font-outfit ${getThemeStyles(theme, {
              dark: 'text-amber-300',
              light: 'text-amber-700'
            })}`}>
              Chip Availability Warning
            </p>
            <p className={`text-xs mt-1 ${getThemeStyles(theme, {
              dark: 'text-amber-200/80',
              light: 'text-amber-600'
            })}`}>
              {chipWarning}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
