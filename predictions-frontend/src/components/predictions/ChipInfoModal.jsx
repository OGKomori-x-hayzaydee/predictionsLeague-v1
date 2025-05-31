import { motion } from "framer-motion";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { backgrounds, text, buttons, status, getThemeStyles } from "../../utils/themeUtils";
import {
  Cross2Icon,
  LightningBoltIcon,
  StarIcon,
  InfoCircledIcon,
  RocketIcon,
  TargetIcon,
} from "@radix-ui/react-icons";

const ChipInfoModal = ({ onClose }) => {
  const { theme } = useContext(ThemeContext);

  return (    <motion.div
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-lg z-50 flex items-center justify-center overflow-y-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 15 }}        className={`${getThemeStyles(theme, {
          dark: "bg-slate-900/95 border-slate-700/60",
          light: "bg-white/95 border-slate-200/60"
        })} border rounded-xl p-6 max-w-4xl w-full font-outfit max-h-[90vh] overflow-y-auto shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        {/* Status indicator bar */}
        <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 mb-6 rounded-full"></div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <LightningBoltIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>              <h3
                className={`${getThemeStyles(theme, text.primary)} text-2xl font-bold`}
              >
                Chip Strategy Guide
              </h3>
              <p
                className={`${getThemeStyles(theme, text.muted)} text-sm`}
              >
                Master the art of strategic chip usage to maximize your points
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}            className={`p-2 rounded-lg ${getThemeStyles(theme, buttons.outline)} transition-all duration-200 border`}
          >
            <Cross2Icon className="w-5 h-5" />
          </motion.button>
        </div>
        {/* Chip Categories */}
        <div className="space-y-6">
          {/* Match Chips Section */}
          <div>
            {" "}
            <div className="flex items-center gap-2 mb-4">
              <RocketIcon className="w-5 h-5 text-emerald-400" />
              <h4
                className={`${
                  theme === "dark" ? "text-slate-100" : "text-slate-900"
                } text-xl font-bold`}
              >
                Match Chips
              </h4>
              <div
                className={`flex-1 h-px ${
                  theme === "dark" ? "bg-slate-700/50" : "bg-slate-300/50"
                }`}
              ></div>
              <span
                className={`${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                } text-sm`}
              >
                Apply during predictions
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {" "}
              {/* Double Down Chip */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`${
                  theme === "dark"
                    ? "bg-slate-800/40 border-slate-700/50 hover:border-emerald-500/30"
                    : "bg-slate-50/40 border-slate-200/50 hover:border-emerald-500/30"
                } rounded-lg p-5 border transition-all duration-200`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-900/40 rounded-lg flex items-center justify-center border border-emerald-700/30">
                    <span className="text-emerald-400 text-lg font-bold">
                      2x
                    </span>
                  </div>
                  <div>
                    <h5
                      className={`${
                        theme === "dark" ? "text-slate-100" : "text-slate-900"
                      } text-lg font-semibold`}
                    >
                      Double Down
                    </h5>
                    <div className="text-emerald-300/70 text-xs font-medium">
                      2 gameweek cooldown
                    </div>
                  </div>
                </div>

                <p
                  className={`${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  } text-sm mb-4 leading-relaxed`}
                >
                  Double all points earned from one selected match prediction.
                </p>

                <div className="bg-emerald-900/20 rounded-md p-3 border border-emerald-700/20">
                  <div className="flex items-start gap-2">
                    <StarIcon className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                    <div>
                      <h6 className="text-emerald-300 text-xs font-medium mb-1">
                        Strategy Tip:
                      </h6>
                      <p
                        className={`${
                          theme === "dark" ? "text-slate-300" : "text-slate-700"
                        } text-xs leading-relaxed`}
                      >
                        Best used on matches where you have high confidence,
                        especially if you've predicted goalscorers correctly.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>{" "}
              {/* Wildcard Chip */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`${
                  theme === "dark"
                    ? "bg-slate-800/40 border-slate-700/50 hover:border-purple-500/30"
                    : "bg-slate-50/40 border-slate-200/50 hover:border-purple-500/30"
                } rounded-lg p-5 border transition-all duration-200`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-900/40 rounded-lg flex items-center justify-center border border-purple-700/30">
                    <span className="text-purple-400 text-lg font-bold">
                      3x
                    </span>
                  </div>
                  <div>
                    <h5
                      className={`${
                        theme === "dark" ? "text-slate-100" : "text-slate-900"
                      } text-lg font-semibold`}
                    >
                      Wildcard
                    </h5>
                    <div className="text-purple-300/70 text-xs font-medium">
                      7 gameweek cooldown
                    </div>
                  </div>
                </div>

                <p
                  className={`${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  } text-sm mb-4 leading-relaxed`}
                >
                  Triple all points earned from one selected match prediction.
                </p>

                <div className="bg-purple-900/20 rounded-md p-3 border border-purple-700/20">
                  <div className="flex items-start gap-2">
                    <StarIcon className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                    <div>
                      <h6 className="text-purple-300 text-xs font-medium mb-1">
                        Strategy Tip:
                      </h6>
                      <p
                        className={`${
                          theme === "dark" ? "text-slate-300" : "text-slate-700"
                        } text-xs leading-relaxed`}
                      >
                        Save for matches where you're extremely confident, or
                        derby matches with existing point multipliers.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>{" "}
              {/* Scorer Focus Chip */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`${
                  theme === "dark"
                    ? "bg-slate-800/40 border-slate-700/50 hover:border-sky-500/30"
                    : "bg-slate-50/40 border-slate-200/50 hover:border-sky-500/30"
                } rounded-lg p-5 border transition-all duration-200`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-sky-900/40 rounded-lg flex items-center justify-center border border-sky-700/30">
                    <span className="text-sky-400 text-lg">⚽</span>
                  </div>
                  <div>
                    <h5
                      className={`${
                        theme === "dark" ? "text-slate-100" : "text-slate-900"
                      } text-lg font-semibold`}
                    >
                      Scorer Focus
                    </h5>
                    <div className="text-sky-300/70 text-xs font-medium">
                      3 gameweek cooldown
                    </div>
                  </div>
                </div>

                <p
                  className={`${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  } text-sm mb-4 leading-relaxed`}
                >
                  Double all points from goalscorer predictions in one match.
                </p>

                <div className="bg-sky-900/20 rounded-md p-3 border border-sky-700/20">
                  <div className="flex items-start gap-2">
                    <StarIcon className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <h6 className="text-sky-300 text-xs font-medium mb-1">
                        Strategy Tip:
                      </h6>
                      <p className="text-sky-300 text-xs leading-relaxed">
                        Best used in high-scoring matches where you're confident
                        about multiple goalscorers.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>{" "}
              {/* Opportunist Chip */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`${
                  theme === "dark"
                    ? "bg-slate-800/40 border-slate-700/50 hover:border-yellow-500/30"
                    : "bg-slate-50/40 border-slate-200/50 hover:border-yellow-500/30"
                } rounded-lg p-5 border transition-all duration-200`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-900/40 rounded-lg flex items-center justify-center border border-yellow-700/30">
                    <span className="text-yellow-400 text-lg">🎭</span>
                  </div>
                  <div>
                    <h5
                      className={`${
                        theme === "dark" ? "text-slate-100" : "text-slate-900"
                      } text-lg font-semibold`}
                    >
                      Opportunist
                    </h5>
                    <div className="text-yellow-300/70 text-xs font-medium">
                      2 gameweek cooldown
                    </div>
                  </div>
                </div>

                <p
                  className={`${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  } text-sm mb-4 leading-relaxed`}
                >
                  Score points even if goalscorer prediction is partially
                  correct.
                </p>

                <div className="bg-yellow-900/20 rounded-md p-3 border border-yellow-700/20">
                  <div className="flex items-start gap-2">
                    <StarIcon className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                    <div>
                      <h6 className="text-yellow-300 text-xs font-medium mb-1">
                        Strategy Tip:
                      </h6>
                      <p
                        className={`${
                          theme === "dark" ? "text-slate-300" : "text-slate-700"
                        } text-xs leading-relaxed`}
                      >
                        Use when late team news impacts your predictions, such
                        as key players being injured or rested.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Gameweek Chips Section */}
          <div>
            {" "}
            <div className="flex items-center gap-2 mb-4">
              <TargetIcon className="w-5 h-5 text-blue-400" />
              <h4
                className={`${
                  theme === "dark" ? "text-slate-100" : "text-slate-900"
                } text-xl font-bold`}
              >
                Gameweek Chips
              </h4>
              <div
                className={`flex-1 h-px ${
                  theme === "dark" ? "bg-slate-700/50" : "bg-slate-300/50"
                }`}
              ></div>
              <span
                className={`${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                } text-sm`}
              >
                Affects all predictions
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {" "}
              {/* Defense++ Chip */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`${
                  theme === "dark"
                    ? "bg-slate-800/40 border-slate-700/50 hover:border-blue-500/30"
                    : "bg-slate-50/40 border-slate-200/50 hover:border-blue-500/30"
                } rounded-lg p-5 border transition-all duration-200`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-900/40 rounded-lg flex items-center justify-center border border-blue-700/30">
                    <span className="text-blue-400 text-lg">🛡️</span>
                  </div>
                  <div>
                    <h5
                      className={`${
                        theme === "dark" ? "text-slate-100" : "text-slate-900"
                      } text-lg font-semibold`}
                    >
                      Defense++
                    </h5>
                    <div className="text-blue-300/70 text-xs font-medium">
                      5 gameweek cooldown
                    </div>
                  </div>
                </div>

                <p
                  className={`${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  } text-sm mb-4 leading-relaxed`}
                >
                  Earn +10 bonus points for each match where you correctly
                  predict a clean sheet.
                </p>

                <div className="bg-blue-900/20 rounded-md p-3 border border-blue-700/20">
                  <div className="flex items-start gap-2">
                    <StarIcon className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                    <div>
                      <h6 className="text-blue-300 text-xs font-medium mb-1">
                        Strategy Tip:
                      </h6>
                      <p
                        className={`${
                          theme === "dark" ? "text-slate-300" : "text-slate-700"
                        } text-xs leading-relaxed`}
                      >
                        Best used when several defensive teams are playing
                        against weaker attacking sides.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>{" "}
              {/* All-In Week Chip */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`${
                  theme === "dark"
                    ? "bg-slate-800/40 border-slate-700/50 hover:border-red-500/30"
                    : "bg-slate-50/40 border-slate-200/50 hover:border-red-500/30"
                } rounded-lg p-5 border transition-all duration-200`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-900/40 rounded-lg flex items-center justify-center border border-red-700/30">
                    <span className="text-red-400 text-lg">🎯</span>
                  </div>
                  <div>
                    <h5
                      className={`${
                        theme === "dark" ? "text-slate-100" : "text-slate-900"
                      } text-lg font-semibold`}
                    >
                      All-In Week
                    </h5>
                    <div className="text-red-300/70 text-xs font-medium">
                      2 uses per season
                    </div>
                  </div>
                </div>

                <p
                  className={`${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  } text-sm mb-4 leading-relaxed`}
                >
                  Doubles all points earned this gameweek (including
                  deductions).
                </p>

                <div className="bg-red-900/20 rounded-md p-3 border border-red-700/20">
                  <div className="flex items-start gap-2">
                    <StarIcon className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                    <div>
                      <h6 className="text-red-300 text-xs font-medium mb-1">
                        Strategy Tip:
                      </h6>
                      <p
                        className={`${
                          theme === "dark" ? "text-slate-300" : "text-slate-700"
                        } text-xs leading-relaxed`}
                      >
                        Use when confident across all matches, but be careful as
                        negative points are also doubled.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>{" "}
        {/* Chip Management Guidelines */}
        <div
          className={`${
            theme === "dark"
              ? "bg-slate-800/50 border-slate-700/50"
              : "bg-slate-50/50 border-slate-200/50"
          } rounded-lg p-5 border mt-6`}
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mt-0.5">
              <LightningBoltIcon className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-emerald-300 text-lg font-semibold">
              Chip Management Guidelines
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul
              className={`space-y-3 ${
                theme === "dark" ? "text-slate-300" : "text-slate-700"
              } text-sm`}
            >
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                <span>
                  You can use multiple chips every gameweek based on
                  availability and cooldowns
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                <span>
                  Each chip has unique cooldown periods or season usage limits
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                <span>
                  Gameweek chips apply to all your predictions in that gameweek
                </span>
              </li>
            </ul>
            <ul
              className={`space-y-3 ${
                theme === "dark" ? "text-slate-300" : "text-slate-700"
              } text-sm`}
            >
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                <span>
                  Match chips must be selected during individual match
                  predictions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                <span>
                  Strategic timing and fixture analysis are key to maximizing
                  chip effectiveness
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                <span>
                  Monitor community trends but trust your own analysis for
                  optimal results
                </span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChipInfoModal;
