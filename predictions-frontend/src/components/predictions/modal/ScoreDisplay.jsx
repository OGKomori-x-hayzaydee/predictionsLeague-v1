import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { getThemeStyles } from "../../../utils/themeUtils";
import { getTeamLogo } from "../../../data/sampleData";

export default function ScoreDisplay({ 
  fixture, 
  homeScore, 
  awayScore, 
  variant = "summary", // "summary", "review"
  className = ""
}) {
  const { theme } = useContext(ThemeContext);
  
  const getVariantStyles = () => {
    switch (variant) {
      case "review":
        return {
          container: "bg-purple-500/20 border border-purple-500/30 rounded-lg px-3",
          scoreBox: theme === "dark" ? "bg-slate-800/60" : "bg-slate-100/60",
          homeColor: "text-purple-300",
          awayColor: "text-purple-300"
        };
      default: // "summary"
        return {
          container: "bg-blue-500/20 border border-blue-500/30 rounded-lg px-3",
          scoreBox: theme === "dark" ? "bg-slate-800/60" : "bg-slate-200/60",
          homeColor: theme === "dark" ? "text-emerald-300" : "text-emerald-700",
          awayColor: theme === "dark" ? "text-blue-300" : "text-blue-700"
        };
    }
  };
  
  const styles = getVariantStyles();

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-slate-700/30 border border-slate-600/50 flex items-center justify-center mr-2">
          <img
            src={getTeamLogo(fixture.homeTeam)}
            alt={fixture.homeTeam}
            className="w-6 h-6 object-contain"
          />
        </div>
        <span
          className={`${getThemeStyles(theme, {
            dark: "text-slate-200",
            light: "text-slate-800",
          })} font-outfit text-sm mr-2 font-medium`}
        >
          {fixture.homeTeam}
        </span>
      </div>

      <div className={`flex items-center justify-center ${styles.container}`}>
        <span className={`${styles.scoreBox} rounded-l-md py-2 px-4 text-2xl font-bold ${styles.homeColor}`}>
          {homeScore}
        </span>
        <span
          className={`px-2 ${getThemeStyles(theme, {
            dark: "text-slate-400",
            light: "text-slate-600",
          })}`}
        >
          -
        </span>
        <span className={`${styles.scoreBox} rounded-r-md py-2 px-4 text-2xl font-bold ${styles.awayColor}`}>
          {awayScore}
        </span>
      </div>

      <div className="flex items-center ml-3">
        <span
          className={`${getThemeStyles(theme, {
            dark: "text-slate-200",
            light: "text-slate-800",
          })} font-outfit text-sm mr-2 font-medium`}
        >
          {fixture.awayTeam}
        </span>
        <div className="w-8 h-8 rounded-full bg-slate-700/30 border border-slate-600/50 flex items-center justify-center">
          <img
            src={getTeamLogo(fixture.awayTeam)}
            alt={fixture.awayTeam}
            className="w-6 h-6 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
