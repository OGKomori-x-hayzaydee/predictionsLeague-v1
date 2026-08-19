import React, { useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";

const ACCENT_COLORS = {
  teal: {
    dark: "bg-teal-500/10 text-teal-400",
    light: "bg-teal-50 text-teal-600",
  },
  blue: {
    dark: "bg-blue-500/10 text-blue-400",
    light: "bg-blue-50 text-blue-600",
  },
  emerald: {
    dark: "bg-emerald-500/10 text-emerald-400",
    light: "bg-emerald-50 text-emerald-600",
  },
  amber: {
    dark: "bg-amber-500/10 text-amber-400",
    light: "bg-amber-50 text-amber-600",
  },
  indigo: {
    dark: "bg-indigo-500/10 text-indigo-400",
    light: "bg-indigo-50 text-indigo-600",
  },
  purple: {
    dark: "bg-purple-500/10 text-purple-400",
    light: "bg-purple-50 text-purple-600",
  },
};

const MAX_WIDTH_MAP = {
  sm: "sm:max-w-md",
  md: "sm:max-w-2xl",
  lg: "sm:max-w-4xl",
};

const InfoSheet = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  accentColor = "teal",
  maxWidth = "md",
  children,
}) => {
  const { theme } = useContext(ThemeContext);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const accent = ACCENT_COLORS[accentColor] || ACCENT_COLORS.teal;
  const maxW = MAX_WIDTH_MAP[maxWidth] || MAX_WIDTH_MAP.md;

  const panelBg =
    theme === "dark"
      ? "bg-slate-900 border-slate-700/50"
      : "bg-white border-slate-200";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel — bottom sheet on mobile, centered modal on desktop */}
          <motion.div
            // Mobile: slide up from bottom
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 380,
            }}
            // Desktop override via CSS — sm+ gets centered modal behavior
            className={`relative w-full ${maxW} max-h-[85vh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-2xl border overflow-hidden ${panelBg} flex flex-col`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Drag handle — mobile only */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div
                className={`w-10 h-1 rounded-full ${
                  theme === "dark" ? "bg-slate-600" : "bg-slate-300"
                }`}
              />
            </div>

            {/* Header */}
            <div
              className={`flex items-start justify-between gap-3 px-4 sm:px-6 pt-3 sm:pt-6 pb-4 border-b ${
                theme === "dark"
                  ? "border-slate-700/50"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {Icon && (
                  <div
                    className={`p-2 rounded-lg shrink-0 ${accent[theme]}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <h2
                    className={`${text.primary[theme]} font-dmSerif font-bold text-lg sm:text-xl truncate`}
                  >
                    {title}
                  </h2>
                  {subtitle && (
                    <p
                      className={`${text.secondary[theme]} font-outfit text-xs sm:text-sm mt-0.5`}
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg shrink-0 transition-colors ${
                  theme === "dark"
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Cross2Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InfoSheet;
