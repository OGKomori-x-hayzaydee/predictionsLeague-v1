import { motion } from "framer-motion";
import {
  InfoCircledIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { useContext, useMemo, memo } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";
import InfoSheet from "./InfoSheet";

// ─── Color helpers ─────────────────────────────────────────
const ICON_COLORS = {
  blue: { dark: "bg-blue-500/15 text-blue-400", light: "bg-blue-50 text-blue-600" },
  emerald: { dark: "bg-emerald-500/15 text-emerald-400", light: "bg-emerald-50 text-emerald-600" },
  amber: { dark: "bg-amber-500/15 text-amber-400", light: "bg-amber-50 text-amber-600" },
  purple: { dark: "bg-purple-500/15 text-purple-400", light: "bg-purple-50 text-purple-600" },
  green: { dark: "bg-green-500/15 text-green-400", light: "bg-green-50 text-green-600" },
  red: { dark: "bg-red-500/15 text-red-400", light: "bg-red-50 text-red-600" },
};

const BADGE_COLORS = {
  emerald: { dark: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25", light: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  blue: { dark: "bg-blue-500/15 text-blue-300 border-blue-500/25", light: "bg-blue-50 text-blue-700 border-blue-200" },
  purple: { dark: "bg-purple-500/15 text-purple-300 border-purple-500/25", light: "bg-purple-50 text-purple-700 border-purple-200" },
  amber: { dark: "bg-amber-500/15 text-amber-300 border-amber-500/25", light: "bg-amber-50 text-amber-700 border-amber-200" },
  green: { dark: "bg-green-500/15 text-green-300 border-green-500/25", light: "bg-green-50 text-green-700 border-green-200" },
  red: { dark: "bg-red-500/15 text-red-300 border-red-500/25", light: "bg-red-50 text-red-700 border-red-200" },
};

// ─── Component ─────────────────────────────────────────────
const RulesAndPointsModal = memo(({ isOpen, onClose }) => {
  const { theme } = useContext(ThemeContext);

  const scoringData = useMemo(
    () => ({
      basicPoints: [
        { points: 5, name: "Correct winner", description: "Predict the right match winner (home win or away win).", icon: StarIcon, color: "emerald" },
        { points: 7, name: "Correct draw prediction", description: "Successfully predict that the match will end in a draw (even if the exact score is wrong).", icon: CheckIcon, color: "blue" },
        { points: 10, name: "Exact scoreline", description: "Predict the precise final score of the match.", icon: StarIcon, color: "purple" },
        { points: 15, name: "Perfect prediction", description: "Predict both the correct score and all goalscorers exactly — the ultimate prediction!", icon: StarIcon, color: "amber" },
        { points: 2, name: "Correct goalscorer", description: "Each correctly predicted player who scores in the match (+2 per scorer, or +4 with Scorer Focus chip).", icon: CheckIcon, color: "green" },
        { points: "-X", name: "Goal difference penalty", description: "If your predicted total goals are 3+ away from the actual total, you lose (difference - 2) points.", icon: ExclamationTriangleIcon, color: "red" },
      ],
      bonusPoints: [
        { points: "+5", name: "Defense++ clean sheet", description: "+5 bonus points per correctly predicted clean sheet when the Defense++ chip is active.", icon: StarIcon, color: "blue" },
      ],
      gameRules: [
        { rule: "Six Matches Per Gameweek", description: 'Predict results for 6 matches each gameweek involving the Premier League\'s "Big Six" teams.', icon: CalendarIcon, color: "blue" },
        { rule: "Submission Deadline", description: "All predictions must be submitted at least 45 minutes before each match's kickoff time.", icon: ClockIcon, color: "amber" },
        { rule: "League Standings", description: "Your position in global and private leagues is determined by total accumulated points across all gameweeks.", icon: StarIcon, color: "emerald" },
        { rule: "Private Leagues", description: "Create or join private leagues using invite codes to compete with friends and colleagues.", icon: InfoCircledIcon, color: "purple" },
      ],
    }),
    []
  );

  const cardBg =
    theme === "dark"
      ? "border-slate-700/40 bg-slate-800/40"
      : "border-slate-200 bg-white shadow-sm";

  const sectionDivider =
    theme === "dark" ? "border-slate-700/40" : "border-slate-200";

  // ─── Inline sub-components ──────────────────────────────
  const SectionHeader = ({ icon: Icon, title, color = "teal" }) => {
    const accent = ICON_COLORS[color] || ICON_COLORS.blue;
    return (
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${accent[theme]}`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <h3 className={`${text.primary[theme]} font-outfit font-semibold text-base sm:text-lg`}>
          {title}
        </h3>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <InfoSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Rules & Scoring"
      subtitle="Complete guide to predictions and point values"
      icon={StarIcon}
      accentColor="blue"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* ═══ Game Rules ═══ */}
        <motion.div
          className={`backdrop-blur-sm rounded-xl p-4 sm:p-5 border ${cardBg}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SectionHeader icon={CalendarIcon} title="Game Rules" color="blue" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {scoringData.gameRules.map((rule, index) => {
              const RuleIcon = rule.icon;
              const accent = ICON_COLORS[rule.color] || ICON_COLORS.blue;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    theme === "dark" ? "bg-slate-700/20" : "bg-slate-50/80"
                  }`}
                >
                  <div className={`p-1.5 rounded-md shrink-0 mt-0.5 ${accent[theme]}`}>
                    <RuleIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className={`${text.primary[theme]} font-outfit font-medium text-sm`}>
                      {rule.rule}
                    </p>
                    <p className={`${text.secondary[theme]} font-outfit text-xs mt-0.5 leading-relaxed`}>
                      {rule.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ Point Values ═══ */}
        <motion.div
          className={`backdrop-blur-sm rounded-xl p-4 sm:p-5 border ${cardBg}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <SectionHeader icon={StarIcon} title="Point Values" color="emerald" />
          <div className="space-y-2">
            {scoringData.basicPoints.map((item, index) => {
              const badge = BADGE_COLORS[item.color] || BADGE_COLORS.emerald;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.04 }}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${
                    theme === "dark" ? "hover:bg-slate-700/20" : "hover:bg-slate-50"
                  } transition-colors`}
                >
                  {/* Point badge */}
                  <div
                    className={`px-2.5 py-1 rounded-md border text-xs font-bold font-outfit shrink-0 min-w-[44px] text-center ${badge[theme]}`}
                  >
                    {typeof item.points === "number" && item.points > 0
                      ? `+${item.points}`
                      : item.points}
                  </div>
                  {/* Name + description */}
                  <div className="min-w-0 flex-1">
                    <p className={`${text.primary[theme]} font-outfit font-medium text-sm`}>
                      {item.name}
                    </p>
                    <p className={`${text.secondary[theme]} font-outfit text-xs mt-0.5 leading-relaxed`}>
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Divider */}
            <div className={`border-t my-1 ${sectionDivider}`} />

            {/* Bonus points */}
            {scoringData.bonusPoints.map((item, index) => {
              const badge = BADGE_COLORS[item.color] || BADGE_COLORS.blue;
              return (
                <div
                  key={`bonus-${index}`}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-lg`}
                >
                  <div
                    className={`px-2.5 py-1 rounded-md border text-xs font-bold font-outfit shrink-0 min-w-[44px] text-center ${badge[theme]}`}
                  >
                    {item.points}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`${text.primary[theme]} font-outfit font-medium text-sm`}>
                      {item.name}
                    </p>
                    <p className={`${text.secondary[theme]} font-outfit text-xs mt-0.5 leading-relaxed`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ Scoring Example ═══ */}
        <motion.div
          className={`backdrop-blur-sm rounded-xl p-4 sm:p-5 border ${cardBg}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <SectionHeader icon={CheckIcon} title="Scoring Example" color="green" />

          {/* Scenario */}
          <div
            className={`rounded-lg p-4 ${
              theme === "dark"
                ? "bg-slate-700/20 border border-slate-700/30"
                : "bg-slate-50 border border-slate-200"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div>
                <p className={`${text.secondary[theme]} text-2xs font-outfit font-medium uppercase tracking-wider mb-1`}>
                  Match
                </p>
                <p className={`${text.primary[theme]} font-outfit font-medium text-sm`}>
                  Arsenal vs Chelsea
                </p>
              </div>
              <div>
                <p className={`${text.secondary[theme]} text-2xs font-outfit font-medium uppercase tracking-wider mb-1`}>
                  Your Prediction
                </p>
                <p className={`${text.primary[theme]} font-outfit font-medium text-sm`}>
                  2-1 (Saka, Havertz)
                </p>
              </div>
              <div>
                <p className={`${text.secondary[theme]} text-2xs font-outfit font-medium uppercase tracking-wider mb-1`}>
                  Actual Result
                </p>
                <p className={`${text.primary[theme]} font-outfit font-medium text-sm`}>
                  2-1 (Saka, Havertz)
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div className={`border-t pt-3 space-y-2 ${sectionDivider}`}>
              <div className="flex justify-between items-center text-sm font-outfit">
                <span className={`${text.secondary[theme]} flex items-center gap-2`}>
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  Perfect prediction (score + all scorers)
                </span>
                <span className={`${text.primary[theme]} font-semibold`}>+15</span>
              </div>
              <div className="flex justify-between items-center text-sm font-outfit">
                <span className={`${text.secondary[theme]} flex items-center gap-2`}>
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                  Correct goalscorers (Saka + Havertz)
                </span>
                <span className={`${text.primary[theme]} font-semibold`}>+4</span>
              </div>
              <div className={`flex justify-between items-center pt-2 border-t ${sectionDivider}`}>
                <span className={`${text.primary[theme]} font-outfit font-bold text-sm`}>
                  Total
                </span>
                <span
                  className={`font-bold font-outfit text-base ${
                    theme === "dark" ? "text-emerald-400" : "text-emerald-600"
                  }`}
                >
                  19 points
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </InfoSheet>
  );
});

RulesAndPointsModal.displayName = "RulesAndPointsModal";

export default RulesAndPointsModal;
