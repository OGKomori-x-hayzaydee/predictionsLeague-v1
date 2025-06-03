import { useContext } from "react";
import { motion } from "framer-motion";
import { format, addMinutes, parseISO } from "date-fns";
import { ThemeContext } from "../../../context/ThemeContext";
import { getThemeStyles, backgrounds, text, buttons, status } from "../../../utils/themeUtils";
import { Cross2Icon, TargetIcon, ClockIcon } from "@radix-ui/react-icons";

export default function ModalHeader({ fixture, onClose, isEditing = false }) {
  const { theme } = useContext(ThemeContext);
  
  const modalTitle = isEditing ? "Edit Prediction" : "Make Prediction";
  const matchDate = parseISO(fixture.date);
  const formattedDate = format(matchDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(matchDate, "h:mm a");
  const deadlineTime = addMinutes(matchDate, -45);

  return (
    <div className={`p-4 ${getThemeStyles(theme, backgrounds.secondary)} border-b relative`}>
      {/* Close button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className={`absolute top-4 right-4 p-2 rounded-lg ${getThemeStyles(
          theme,
          buttons.outline
        )} transition-all duration-200 border`}
        aria-label="Close"
      >
        <Cross2Icon className="w-4 h-4" />
      </motion.button>

      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-12 h-12 rounded-xl ${getThemeStyles(
            theme,
            status.info.bg
          )} flex items-center justify-center border ${getThemeStyles(
            theme,
            status.info.border
          )}`}
        >
          <TargetIcon
            className={`w-6 h-6 ${getThemeStyles(theme, status.info.text)}`}
          />
        </div>
        <div>
          <h2
            className={`${getThemeStyles(
              theme,
              text.primary
            )} text-2xl font-bold font-outfit`}
          >
            {modalTitle}
          </h2>
          <p
            className={`${getThemeStyles(
              theme,
              text.muted
            )} text-sm font-outfit`}
          >
            {formattedDate} • {formattedTime}
          </p>
        </div>
      </div>

      <div className="bg-amber-500/20 text-amber-300 text-xs rounded-lg px-3 py-2 flex items-center border border-amber-500/30 font-outfit">
        <ClockIcon className="mr-2 w-4 h-4" />
        Prediction deadline: {format(deadlineTime, "MMM d, h:mm a")}
      </div>
    </div>
  );
}
