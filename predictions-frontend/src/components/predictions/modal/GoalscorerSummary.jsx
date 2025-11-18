import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";  
import { getThemeStyles } from "../../../utils/themeUtils";
import TeamLogo from "../../ui/TeamLogo";
import { LOGO_SIZES } from "../../../utils/teamLogos";
import { TargetIcon } from "@radix-ui/react-icons";

export default function GoalscorerSummary({ 
  fixture, 
  homeScore, 
  awayScore, 
  homeScorers, 
  awayScorers 
}) {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`${getThemeStyles(theme, {
        dark: "bg-slate-800/50 border-slate-700/60",
        light: "bg-slate-50/50 border-slate-200/60",
      })} border rounded-xl p-4 mb-4 font-outfit`}
    >
      <h4
        className={`${getThemeStyles(theme, {
          dark: "text-slate-200",
          light: "text-slate-800",
        })} text-sm font-medium mb-3 flex items-center`}
      >
        <TargetIcon className="mr-2 w-4 h-4 text-emerald-400" />
        Predicted Goalscorers
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {homeScore > 0 && (
          <div className="space-y-2">
            <div
              className={`text-xs font-medium mb-2 flex items-center ${getThemeStyles(theme, {
                dark: "text-emerald-300",
                light: "text-emerald-700",
              })}`}
            >
              <div className="mr-1.5">
                <TeamLogo
                  teamName={fixture.homeTeam}
                  size={LOGO_SIZES.xs}
                  theme={theme}
                  className="flex-shrink-0"
                />
              </div>
              {fixture.homeTeam}
            </div>
            {homeScorers.map((scorer, index) => (
              <div
                key={index}
                className={`flex items-center ${getThemeStyles(theme, {
                  dark: "bg-slate-700/40",
                  light: "bg-slate-100/40",
                })} border border-emerald-500/20 rounded-lg px-3 py-2`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center bg-emerald-500/20 border border-emerald-500/30 mr-2 text-xs font-medium ${getThemeStyles(theme, {
                    dark: "text-emerald-300",
                    light: "text-emerald-700",
                  })}`}
                >
                  {index + 1}
                </div>
                <span
                  className={`${getThemeStyles(theme, {
                    dark: "text-slate-200",
                    light: "text-slate-800",
                  })} text-sm font-medium`}
                >
                  {scorer}
                </span>
              </div>
            ))}
          </div>
        )}

        {awayScore > 0 && (
          <div className="space-y-2">
            <div
              className={`text-xs font-medium mb-2 flex items-center ${getThemeStyles(theme, {
                dark: "text-blue-300",
                light: "text-blue-700",
              })}`}
            >
              <div className="mr-1.5">
                <TeamLogo
                  teamName={fixture.awayTeam}
                  size={LOGO_SIZES.xs}
                  theme={theme}
                  className="flex-shrink-0"
                />
              </div>
              {fixture.awayTeam}
            </div>
            {awayScorers.map((scorer, index) => (
              <div
                key={index}
                className={`flex items-center ${getThemeStyles(theme, {
                  dark: "bg-slate-700/40",
                  light: "bg-slate-100/40",
                })} border border-blue-500/20 rounded-lg px-3 py-2`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center bg-blue-500/20 border border-blue-500/30 mr-2 text-xs font-medium ${getThemeStyles(theme, {
                    dark: "text-blue-300",
                    light: "text-blue-700",
                  })}`}
                >
                  {index + 1}
                </div>
                <span
                  className={`${getThemeStyles(theme, {
                    dark: "text-slate-200",
                    light: "text-slate-800",
                  })} text-sm font-medium`}
                >
                  {scorer}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
