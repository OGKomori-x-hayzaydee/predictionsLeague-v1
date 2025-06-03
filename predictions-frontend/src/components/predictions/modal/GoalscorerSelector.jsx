import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { getTeamLogo } from "../../../data/sampleData";
import { ChevronRightIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

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

// Team players data - could be moved to a separate data file
const teamPlayers = {
  Arsenal: [
    "Bukayo Saka",
    "Martin Ødegaard", 
    "Kai Havertz",
    "Leandro Trossard",
    "Gabriel Martinelli",
    "Gabriel Jesus",
  ],
  Chelsea: [
    "Cole Palmer",
    "Nicolas Jackson",
    "Christopher Nkunku",
    "Raheem Sterling",
    "Enzo Fernandez",
    "Noni Madueke",
  ],
  Liverpool: [
    "Mohamed Salah",
    "Luis Díaz",
    "Darwin Núñez",
    "Diogo Jota",
    "Cody Gakpo",
    "Dominik Szoboszlai",
  ],
  "Man. City": [
    "Erling Haaland",
    "Phil Foden",
    "Kevin De Bruyne",
    "Bernardo Silva",
    "Jack Grealish",
    "Julián Álvarez",
  ],
  "Man. United": [
    "Bruno Fernandes",
    "Marcus Rashford",
    "Rasmus Højlund",
    "Alejandro Garnacho",
    "Mason Mount",
    "Antony",
  ],
  Spurs: [
    "Son Heung-min",
    "Richarlison",
    "Brennan Johnson",
    "James Maddison",
    "Dejan Kulusevski",
    "Timo Werner",
  ],
};

export default function GoalscorerSelector({ 
  team, 
  teamType, 
  score, 
  scorers, 
  onScorerChange, 
  error 
}) {
  const { theme } = useContext(ThemeContext);
  const players = teamPlayers[team] || [];
  const colorStyles = getTeamColorStyles(teamType);

  if (score === 0) {
    return null;
  }

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
        <div className={`w-6 h-6 rounded-full ${colorStyles.bgIcon} border ${colorStyles.borderIcon} p-0.5 flex items-center justify-center mr-2`}>
          <img
            src={getTeamLogo(team)}
            alt={team}
            className="w-4 h-4 object-contain"
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
                {players.map((player) => (
                  <option
                    key={player}
                    value={player}
                    className={`${
                      theme === "dark" ? "bg-slate-800" : "bg-white"
                    }`}
                  >
                    {player}
                  </option>
                ))}
              </select>
              <ChevronRightIcon
                className={`pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
