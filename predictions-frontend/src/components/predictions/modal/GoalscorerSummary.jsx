import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { getThemeStyles } from "../../../utils/themeUtils";
import { getTeamLogo } from "../../../data/sampleData";
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
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 p-0.5 flex items-center justify-center mr-1.5">
                <img
                  src={getTeamLogo(fixture.homeTeam)}
                  alt={fixture.homeTeam}
                  className="w-2.5 h-2.5 object-contain"
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
              <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/30 p-0.5 flex items-center justify-center mr-1.5">
                <img
                  src={getTeamLogo(fixture.awayTeam)}
                  alt={fixture.awayTeam}
                  className="w-2.5 h-2.5 object-contain"
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
