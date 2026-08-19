import { useContext, useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { ChevronRightIcon, ChevronDownIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import TeamLogo from "../../ui/TeamLogo";
import { LOGO_SIZES } from "../../../utils/teamLogos";
import { getSquadByPosition, PLAYER_POSITIONS } from "../../../utils/fixtureUtils";

// Helper functions for team colors
const getTeamColorStyles = (teamType) => {
  const styles = {
    home: {
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
      borderHeader: "border-blue-500/20",
      bgIcon: "bg-blue-500/20",
      borderIcon: "border-blue-500/30",
      textDark: "text-blue-300",
      textLight: "text-blue-700",
      bgScorer: "bg-blue-500/70",
      shadowScorer: "shadow-blue-500/30",
      borderSelect: "border-blue-500/40"
    },
    away: {
      border: "border-red-500/30",
      bg: "bg-red-500/10", 
      borderHeader: "border-red-500/20",
      bgIcon: "bg-red-500/20",
      borderIcon: "border-red-500/30",
      textDark: "text-red-300",
      textLight: "text-red-700",
      bgScorer: "bg-red-500/70",
      shadowScorer: "shadow-red-500/30",
      borderSelect: "border-red-500/40"
    }
  };
  return styles[teamType] || styles.home;
};

// Position display configuration
const POSITION_CONFIG = {
  [PLAYER_POSITIONS.FORWARD]: {
    label: 'ATTACKERS',
    icon: '⚽',
    order: 1
  },
  [PLAYER_POSITIONS.MIDFIELDER]: {
    label: 'MIDFIELDERS', 
    icon: '🎯',
    order: 2
  },
  [PLAYER_POSITIONS.DEFENDER]: {
    label: 'DEFENDERS',
    icon: '🛡️',
    order: 3
  },
  [PLAYER_POSITIONS.GOALKEEPER]: {
    label: 'GOALKEEPERS',
    icon: '🧤',
    order: 4
  }
};

export default function GoalscorerSelector({ 
  team, 
  teamType, 
  score, 
  scorers, 
  onScorerChange,
  players = [], // NEW: Accept players array from fixture
  error 
}) {
  const { theme } = useContext(ThemeContext);
  const [expandedPositions, setExpandedPositions] = useState({
    [PLAYER_POSITIONS.FORWARD]: true,
    [PLAYER_POSITIONS.MIDFIELDER]: false,
    [PLAYER_POSITIONS.DEFENDER]: false,
    [PLAYER_POSITIONS.GOALKEEPER]: false
  });

  const colorStyles = getTeamColorStyles(teamType);

  // Group players by position using utility function
  const squadByPosition = getSquadByPosition(players);

  // Toggle position expansion
  const togglePosition = (position) => {
    setExpandedPositions(prev => ({
      ...prev,
      [position]: !prev[position]
    }));
  };

  if (score === 0) {
    return null;
  }

  // Check if we have player data
  const hasPlayerData = players && players.length > 0;

  return (
    <div
      className={`${
        theme === "dark" ? "bg-slate-800/50" : "bg-slate-50/50"
      } border rounded-xl overflow-hidden transition-all font-outfit ${
        error
          ? "border-red-500/70 ring-1 ring-red-500/30"
          : colorStyles.border
      }`}
    >
      {/* Team header */}
      <div className={`px-3 py-2 ${colorStyles.bg} border-b ${colorStyles.borderHeader} flex items-center`}>
        <div className="mr-2">
          <TeamLogo
            teamName={team}
            size={LOGO_SIZES.xs}
            theme={theme}
            className="flex-shrink-0"
          />
        </div>
        <div
          className={`text-sm font-medium ${
            theme === "dark"
              ? colorStyles.textDark
              : colorStyles.textLight
          }`}
        >
          {team}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className={`${
          theme === "dark" ? "bg-red-900/20 text-red-300" : "bg-red-50 text-red-600"
        } px-3 py-2 text-xs flex items-center`}>
          <ExclamationTriangleIcon className="w-3 h-3 mr-1 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Scorer selections */}
      <div className="p-3 space-y-2">
        {scorers.map((scorer, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                scorer
                  ? `${colorStyles.bgScorer} text-slate-900 shadow-sm ${colorStyles.shadowScorer}`
                  : theme === "dark"
                  ? "bg-slate-700/40 text-slate-400"
                  : "bg-slate-200/40 text-slate-600"
              }`}
            >
              {index + 1}
            </div>

            <div className="relative flex-1">
              {hasPlayerData ? (
                // NEW: Categorized player selection
                <select
                  value={scorer}
                  onChange={(e) => onScorerChange(index, e.target.value)}
                  className={`appearance-none w-full rounded-lg text-sm px-3 py-2 pr-8 focus:outline-none transition-all ${
                    scorer
                      ? theme === "dark"
                        ? `bg-slate-700/50 border ${colorStyles.borderSelect} text-slate-200`
                        : `bg-slate-50/50 border ${colorStyles.borderSelect} text-slate-800`
                      : theme === "dark"
                      ? "bg-slate-800/50 border border-red-500/30 text-slate-400"
                      : "bg-slate-100/50 border border-red-500/30 text-slate-600"
                  }`}
                >
                  <option
                    value=""
                    className={`${
                      theme === "dark" ? "bg-slate-800" : "bg-white"
                    }`}
                  >
                    Select player...
                  </option>

                  {/* Attackers/Forwards */}
                  {squadByPosition.forwards.length > 0 && (
                    <optgroup 
                      label={`⚽ ${POSITION_CONFIG[PLAYER_POSITIONS.FORWARD].label}`}
                      className={`${theme === "dark" ? "bg-slate-800" : "bg-white"} font-semibold`}
                    >
                      {squadByPosition.forwards.map((player) => (
                        <option
                          key={player.name}
                          value={player.name}
                          className={`${
                            theme === "dark" ? "bg-slate-800" : "bg-white"
                          } pl-4`}
                        >
                          {player.name}
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* Midfielders */}
                  {squadByPosition.midfielders.length > 0 && (
                    <optgroup 
                      label={`🎯 ${POSITION_CONFIG[PLAYER_POSITIONS.MIDFIELDER].label}`}
                      className={`${theme === "dark" ? "bg-slate-800" : "bg-white"} font-semibold`}
                    >
                      {squadByPosition.midfielders.map((player) => (
                        <option
                          key={player.name}
                          value={player.name}
                          className={`${
                            theme === "dark" ? "bg-slate-800" : "bg-white"
                          } pl-4`}
                        >
                          {player.name}
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* Defenders */}
                  {squadByPosition.defenders.length > 0 && (
                    <optgroup 
                      label={`🛡️ ${POSITION_CONFIG[PLAYER_POSITIONS.DEFENDER].label}`}
                      className={`${theme === "dark" ? "bg-slate-800" : "bg-white"} font-semibold`}
                    >
                      {squadByPosition.defenders.map((player) => (
                        <option
                          key={player.name}
                          value={player.name}
                          className={`${
                            theme === "dark" ? "bg-slate-800" : "bg-white"
                          } pl-4`}
                        >
                          {player.name}
                        </option>
                      ))}
                    </optgroup>
                  )}

                  {/* Goalkeepers (rare but possible) */}
                  {squadByPosition.goalkeepers.length > 0 && (
                    <optgroup 
                      label={`🧤 ${POSITION_CONFIG[PLAYER_POSITIONS.GOALKEEPER].label}`}
                      className={`${theme === "dark" ? "bg-slate-800" : "bg-white"} font-semibold`}
                    >
                      {squadByPosition.goalkeepers.map((player) => (
                        <option
                          key={player.name}
                          value={player.name}
                          className={`${
                            theme === "dark" ? "bg-slate-800" : "bg-white"
                          } pl-4`}
                        >
                          {player.name}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              ) : (
                // Fallback: Simple text input if no player data
                <input
                  type="text"
                  value={scorer}
                  onChange={(e) => onScorerChange(index, e.target.value)}
                  placeholder="Enter player name..."
                  className={`appearance-none w-full rounded-lg text-sm px-3 py-2 focus:outline-none transition-all ${
                    scorer
                      ? theme === "dark"
                        ? `bg-slate-700/50 border ${colorStyles.borderSelect} text-slate-200`
                        : `bg-slate-50/50 border ${colorStyles.borderSelect} text-slate-800`
                      : theme === "dark"
                      ? "bg-slate-800/50 border border-red-500/30 text-slate-400"
                      : "bg-slate-100/50 border border-red-500/30 text-slate-600"
                  }`}
                />
              )}
              <ChevronRightIcon
                className={`pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* No player data warning */}
      {!hasPlayerData && (
        <div className={`px-3 pb-3 ${
          theme === "dark" ? "text-slate-500" : "text-slate-600"
        } text-xs`}>
          ℹ️ Squad data not available - enter names manually
        </div>
      )}
    </div>
  );
}