import { motion } from "framer-motion";
import {
  StarIcon,
  LightningBoltIcon,
  TargetIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { useContext, useMemo, memo } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";
import { CHIP_CONFIG } from "../../utils/chipManager";
import InfoSheet from "../common/InfoSheet";

// ─── Compact color helper ──────────────────────────────────
const CHIP_ACCENT = {
  teal: { dark: "bg-teal-500/15 text-teal-300 border-teal-500/25", light: "bg-teal-50 text-teal-700 border-teal-200" },
  purple: { dark: "bg-purple-500/15 text-purple-300 border-purple-500/25", light: "bg-purple-50 text-purple-700 border-purple-200" },
  green: { dark: "bg-green-500/15 text-green-300 border-green-500/25", light: "bg-green-50 text-green-700 border-green-200" },
  blue: { dark: "bg-blue-500/15 text-blue-300 border-blue-500/25", light: "bg-blue-50 text-blue-700 border-blue-200" },
  red: { dark: "bg-red-500/15 text-red-300 border-red-500/25", light: "bg-red-50 text-red-700 border-red-200" },
  emerald: { dark: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25", light: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  amber: { dark: "bg-amber-500/15 text-amber-300 border-amber-500/25", light: "bg-amber-50 text-amber-700 border-amber-200" },
};

const ICON_COLORS = {
  teal: { dark: "bg-teal-500/10 text-teal-400", light: "bg-teal-50 text-teal-600" },
  emerald: { dark: "bg-emerald-500/10 text-emerald-400", light: "bg-emerald-50 text-emerald-600" },
  blue: { dark: "bg-blue-500/10 text-blue-400", light: "bg-blue-50 text-blue-600" },
  purple: { dark: "bg-purple-500/10 text-purple-400", light: "bg-purple-50 text-purple-600" },
};

// ─── Component ─────────────────────────────────────────────
const ChipStrategyModal = memo(({ isOpen, onClose }) => {
  const { theme } = useContext(ThemeContext);

  // Strategy tips for each chip
  const chipTips = useMemo(
    () => ({
      doubleDown: "Ideal for high-confidence predictions, especially exact scorelines. Available every gameweek!",
      wildcard: "Reserve for your most confident predictions. 7 gameweek cooldown means you can only use it a few times per season!",
      scorerFocus: "Perfect for matches featuring prolific goalscorers or high-scoring games. Research form to maximize effectiveness.",
      defensePlusPlus: "Best used when strong defensive teams face weaker attacking sides. +5 per correctly predicted clean sheet.",
      allInWeek: "Use when extremely confident across all matches. Ideal for predictable gameweeks. Negative points are also doubled!",
    }),
    []
  );

  // Generate chip data from CHIP_CONFIG
  const chipData = useMemo(() => {
    const matchChips = Object.values(CHIP_CONFIG)
      .filter((chip) => chip.scope === "match")
      .map((chip) => ({
        id: chip.id,
        icon: chip.icon,
        name: chip.name,
        cooldown:
          chip.cooldown === 0
            ? "Available every gameweek"
            : `Cooldown: ${chip.cooldown} gameweeks`,
        description: chip.description,
        color: chip.color,
        tip: chipTips[chip.id],
      }));

    const gameweekChips = Object.values(CHIP_CONFIG)
      .filter((chip) => chip.scope === "gameweek")
      .map((chip) => ({
        id: chip.id,
        icon: chip.icon,
        name: chip.name,
        usage: chip.seasonLimit
          ? `Limited: ${chip.seasonLimit} per season`
          : chip.cooldown > 0
          ? `Cooldown: ${chip.cooldown} gameweeks`
          : "Available every gameweek",
        description: chip.description,
        color: chip.color,
        tip: chipTips[chip.id],
      }));

    return { matchChips, gameweekChips };
  }, [chipTips]);

  const guidelines = [
    "Gameweek chips apply retroactively to all pending predictions in that gameweek — apply them anytime!",
    "Match chips are limited to 2 per prediction, but gameweek chips have no limits.",
    "Once a chip is applied to a prediction, it cannot be removed (immutable).",
    "Defense++ applies only to predictions with clean sheets (0 goals conceded).",
    "All-In Week applies to all pending predictions automatically when activated.",
    "Strategic timing and fixture analysis are key to maximizing chip effectiveness.",
  ];

  const cardBg =
    theme === "dark"
      ? "border-slate-700/40 bg-slate-800/40"
      : "border-slate-200 bg-white shadow-sm";

  // ─── Inline sub-components ──────────────────────────────
  const SectionHeader = ({ icon: Icon, title, color = "teal" }) => {
    const accent = ICON_COLORS[color] || ICON_COLORS.teal;
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

  const ChipCard = ({ chip, index, baseDelay = 0 }) => {
    const accent = CHIP_ACCENT[chip.color] || CHIP_ACCENT.teal;
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: baseDelay + index * 0.06 }}
        className={`p-4 rounded-lg border ${
          theme === "dark"
            ? "border-slate-700/30 bg-slate-700/20"
            : "border-slate-200/60 bg-slate-50/80"
        }`}
      >
        {/* Header row: icon + name + cooldown */}
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${accent[theme]}`}>
            <span className={`text-sm ${typeof chip.icon === "string" && chip.icon.length > 2 ? "text-xs" : "font-bold"} font-outfit`}>
              {chip.icon}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`${text.primary[theme]} font-outfit font-semibold text-sm`}>
              {chip.name}
            </p>
            <p className={`text-2xs font-outfit font-medium ${accent[theme].split(" ").slice(1, 2).join(" ")}`}>
              {chip.cooldown || chip.usage}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className={`${text.secondary[theme]} font-outfit text-xs leading-relaxed mb-3`}>
          {chip.description}
        </p>

        {/* Strategy tip */}
        {chip.tip && (
          <div className={`flex items-start gap-2 pt-2.5 border-t ${
            theme === "dark" ? "border-slate-600/30" : "border-slate-200/60"
          }`}>
            <StarIcon className={`w-3 h-3 mt-0.5 shrink-0 ${
              theme === "dark" ? "text-amber-400/70" : "text-amber-500"
            }`} />
            <p className={`${text.secondary[theme]} font-outfit text-xs leading-relaxed italic`}>
              {chip.tip}
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  if (!isOpen) return null;

  return (
    <InfoSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Chip Strategy Guide"
      subtitle="Master strategic chip usage to maximize your points"
      icon={RocketIcon}
      accentColor="teal"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* ═══ Match Chips ═══ */}
        <motion.div
          className={`backdrop-blur-sm rounded-xl p-4 sm:p-5 border ${cardBg}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SectionHeader icon={TargetIcon} title="Match Chips" color="emerald" />
          <p className={`${text.secondary[theme]} font-outfit text-xs sm:text-sm mb-4 -mt-2`}>
            Apply during individual match predictions for targeted impact
          </p>
          <div className="space-y-3">
            {chipData.matchChips.map((chip, index) => (
              <ChipCard key={chip.id} chip={chip} index={index} baseDelay={0.15} />
            ))}
          </div>
        </motion.div>

        {/* ═══ Gameweek Chips ═══ */}
        <motion.div
          className={`backdrop-blur-sm rounded-xl p-4 sm:p-5 border ${cardBg}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionHeader icon={LightningBoltIcon} title="Gameweek Chips" color="blue" />
          <p className={`${text.secondary[theme]} font-outfit text-xs sm:text-sm mb-4 -mt-2`}>
            Affects all your predictions in the entire gameweek
          </p>
          <div className="space-y-3">
            {chipData.gameweekChips.map((chip, index) => (
              <ChipCard key={chip.id} chip={chip} index={index} baseDelay={0.35} />
            ))}
          </div>
        </motion.div>

        {/* ═══ Strategic Guidelines ═══ */}
        <motion.div
          className={`backdrop-blur-sm rounded-xl p-4 sm:p-5 border ${cardBg}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SectionHeader icon={LightningBoltIcon} title="Strategic Guidelines" color="purple" />
          <div className="space-y-2.5">
            {guidelines.map((guideline, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + index * 0.04 }}
                className="flex items-start gap-3"
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    theme === "dark" ? "bg-purple-400" : "bg-purple-500"
                  }`}
                />
                <p className={`${text.secondary[theme]} font-outfit text-xs sm:text-sm leading-relaxed`}>
                  {guideline}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </InfoSheet>
  );
});

ChipStrategyModal.displayName = "ChipStrategyModal";

export default ChipStrategyModal;
