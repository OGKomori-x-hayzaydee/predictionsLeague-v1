import { useContext } from "react";
import { motion } from "framer-motion";
import { format, addMinutes, parseISO } from "date-fns";
import { ThemeContext } from "../../../context/ThemeContext";
import { getThemeStyles, backgrounds, text, buttons, status } from "../../../utils/themeUtils";
import { Cross2Icon, CalendarIcon, ClockIcon } from "@radix-ui/react-icons";

export default function ModalHeader({ title, fixture, onClose, deadline }) {
  const { theme } = useContext(ThemeContext);

  // Determine if editing based on title or use passed title
  const isEditing = title?.includes('Edit');
  const modalTitle = title || "Make Prediction";
  const matchDate = parseISO(fixture.date);
  const formattedDate = format(matchDate, "MMM dd, HH:mm");
  const deadlineTime = deadline?.timeLeft ? new Date(Date.now() + deadline.timeLeft) : addMinutes(matchDate, -30);

  return (
    <div className={`p-3 sm:p-4 md:p-6 border-b ${getThemeStyles(theme, {
      dark: 'border-slate-700/60',
      light: 'border-slate-200'
    })}`}>
      {/* Close button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className={`absolute top-2 right-2 sm:top-4 sm:right-4 p-2.5 sm:p-2 rounded-lg transition-colors z-10 ${getThemeStyles(theme, {
          dark: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
          light: 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
        })}`}
        aria-label="Close"
      >
        <Cross2Icon className="w-4 h-4 sm:w-4 sm:h-4" />
      </motion.button>

      {/* Rich Card Style Header */}
      <div className={`rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 ${getThemeStyles(theme, {
        dark: 'bg-slate-800/50 border border-slate-700/60',
        light: 'bg-slate-50 border border-slate-200'
      })}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${getThemeStyles(theme, {
              dark: 'bg-blue-500/20',
              light: 'bg-blue-100'
            })}`}>
              <CalendarIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${getThemeStyles(theme, {
                dark: 'text-blue-400',
                light: 'text-blue-600'
              })}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-sm sm:text-base font-semibold font-outfit truncate ${getThemeStyles(theme, text.primary)}`}>
                {fixture.homeTeam} vs {fixture.awayTeam}
              </p>
              <p className={`text-2xs sm:text-xs font-outfit ${getThemeStyles(theme, text.muted)}`}>
                GW{fixture.gameweek} • {formattedDate}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right ml-9 sm:ml-0 flex-shrink-0">
            <div className={`text-sm sm:text-lg font-bold font-outfit ${getThemeStyles(theme, text.primary)}`}>
              {modalTitle}
            </div>
            <div className={`text-2xs sm:text-xs font-medium font-outfit ${getThemeStyles(theme, {
              dark: 'text-blue-400',
              light: 'text-blue-600'
            })}`}>
              {isEditing ? 'Updating' : 'Creating'}
            </div>
          </div>
        </div>

        {/* Deadline Warning */}
        <div className={`rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center ${getThemeStyles(theme, {
          dark: 'bg-amber-500/10 border border-amber-500/20',
          light: 'bg-amber-50 border border-amber-200'
        })}`}>
          <ClockIcon className={`mr-1.5 sm:mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${getThemeStyles(theme, {
            dark: 'text-amber-400',
            light: 'text-amber-600'
          })}`} />
          <span className={`text-2xs sm:text-xs font-outfit ${getThemeStyles(theme, {
            dark: 'text-amber-300',
            light: 'text-amber-700'
          })}`}>
            Deadline: {format(deadlineTime, "MMM d, h:mm a")}
          </span>
        </div>
      </div>
    </div>
  );
}
