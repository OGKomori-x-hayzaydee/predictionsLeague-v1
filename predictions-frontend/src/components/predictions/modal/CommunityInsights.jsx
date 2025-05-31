import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { getThemeStyles } from "../../../utils/themeUtils";
import { StarIcon } from "@radix-ui/react-icons";

export default function CommunityInsights({ fixture }) {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`${getThemeStyles(theme, {
        dark: "bg-slate-800/40 border-slate-700/60",
        light: "bg-slate-50/40 border-slate-200/60",
      })} border rounded-xl p-4 mb-6 font-outfit`}
    >
      <h3
        className={`${getThemeStyles(theme, {
          dark: "text-slate-200",
          light: "text-slate-800",
        })} text-sm font-medium mb-3 flex items-center`}
      >
        <StarIcon className="mr-2 text-purple-400" /> Community Insights
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="flex flex-col">
          <span
            className={`${getThemeStyles(theme, {
              dark: "text-slate-400",
              light: "text-slate-600",
            })} text-xs mb-1`}
          >
            Most predicted score
          </span>
          <span
            className={`${getThemeStyles(theme, {
              dark: "text-slate-200",
              light: "text-slate-800",
            })} font-outfit font-medium`}
          >
            2-1
          </span>
        </div>
        
        <div className="flex flex-col">
          <span
            className={`${getThemeStyles(theme, {
              dark: "text-slate-400",
              light: "text-slate-600",
            })} text-xs mb-1`}
          >
            Community sentiment
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`${getThemeStyles(theme, {
                dark: "bg-slate-700/40",
                light: "bg-slate-200/40",
              })} h-2 rounded-full flex-1`}
            >
              <div
                className="bg-emerald-500 h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <span
              className={`${getThemeStyles(theme, {
                dark: "text-slate-200",
                light: "text-slate-800",
              })} font-outfit text-sm`}
            >
              75%
            </span>
          </div>
          <span
            className={`${getThemeStyles(theme, {
              dark: "text-slate-300",
              light: "text-slate-700",
            })} text-xs mt-1`}
          >
            {fixture.homeTeam} win
          </span>
        </div>
        
        <div className="flex flex-col">
          <span
            className={`${getThemeStyles(theme, {
              dark: "text-slate-400",
              light: "text-slate-600",
            })} text-xs mb-1`}
          >
            Popular goalscorers
          </span>
          <span
            className={`${getThemeStyles(theme, {
              dark: "text-slate-200",
              light: "text-slate-800",
            })} font-outfit text-sm`}
          >
            Saka, Kane
          </span>
        </div>
      </div>
    </div>
  );
}
