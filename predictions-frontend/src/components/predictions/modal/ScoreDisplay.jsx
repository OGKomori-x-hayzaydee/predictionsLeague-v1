import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { getThemeStyles } from "../../../utils/themeUtils";
import TeamLogo from "../../ui/TeamLogo";
import { LOGO_SIZES } from "../../../utils/teamLogos";

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
          container: getThemeStyles(theme, {
            dark: "bg-purple-500/20 border border-purple-500/30",
            light: "bg-purple-100 border border-purple-200"
          }) + " rounded-lg px-3",
          scoreBox: getThemeStyles(theme, {
            dark: "bg-slate-800/60",
            light: "bg-white/60"
          }),
          homeColor: getThemeStyles(theme, {
            dark: "text-purple-300",
            light: "text-purple-700"
          }),
          awayColor: getThemeStyles(theme, {
            dark: "text-purple-300",
            light: "text-purple-700"
          })
        };
      default: // "summary"
        return {
          container: getThemeStyles(theme, {
            dark: "bg-blue-500/20 border border-blue-500/30",
            light: "bg-blue-100 border border-blue-200"
          }) + " rounded-lg px-3",
          scoreBox: getThemeStyles(theme, {
            dark: "bg-slate-800/60",
            light: "bg-white/60"
          }),
          homeColor: getThemeStyles(theme, {
            dark: "text-emerald-300",
            light: "text-emerald-700"
          }),
          awayColor: getThemeStyles(theme, {
            dark: "text-blue-300",
            light: "text-blue-700"
          })
        };
    }
  };
  
  const styles = getVariantStyles();

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="flex items-center">
        <div className="mr-2">
          <TeamLogo
            teamName={fixture.homeTeam}
            size={LOGO_SIZES.sm}
            theme={theme}
            className="flex-shrink-0"
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
        <div className="ml-2">
          <TeamLogo
            teamName={fixture.awayTeam}
            size={LOGO_SIZES.sm}
            theme={theme}
            className="flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
