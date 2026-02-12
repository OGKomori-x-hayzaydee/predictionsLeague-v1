import React, { useContext } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";
import InfoSheet from "./InfoSheet";

const INSIGHT_TIPS = {
  home_away_pattern: [
    "Consider analyzing why you're better at home/away predictions",
    "Look for patterns in team travel fatigue or home crowd advantages",
    "Use this strength when making future predictions",
  ],
  team_specialist: [
    "You have deep knowledge of this team's playing style",
    "Consider following their transfer news and tactical changes",
    "Your expertise here could be valuable in league competitions",
  ],
  timing_pattern: [
    "Weekend matches often have different dynamics than weekday games",
    "Player rotation and fatigue levels can vary by day",
    "Consider team schedules when making predictions",
  ],
  clutch_performer: [
    "Big matches often have unique pressure dynamics",
    "Your understanding of high-stakes football is exceptional",
    "Use this skill in knockout competitions and title deciders",
  ],
  underdog_expert: [
    "You spot value in matches others might overlook",
    "Smaller teams often play with different motivations",
    "This skill is valuable for finding betting value",
  ],
  bold_predictor: [
    "Your confident predictions show good risk assessment",
    "High-margin predictions require strong conviction",
    "Balance bold calls with safer predictions for consistency",
  ],
  safe_predictor: [
    "Consistent accuracy is the foundation of good prediction",
    "Your conservative approach minimizes big losses",
    "Consider mixing in some higher-risk, higher-reward predictions",
  ],
};

const DEFAULT_TIPS = [
  "Keep analyzing your prediction patterns",
  "Consistency is key to long-term success",
  "Use insights to improve your prediction strategy",
];

const InsightDetailModal = ({ insight, isOpen, onClose }) => {
  const { theme } = useContext(ThemeContext);

  if (!insight || !isOpen) return null;

  const tips = INSIGHT_TIPS[insight.id] || DEFAULT_TIPS;

  return (
    <InfoSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Insight Details"
      icon={InfoCircledIcon}
      accentColor="blue"
      maxWidth="sm"
    >
      <div className="space-y-5">
        {/* Insight summary card */}
        <div
          className={`rounded-xl p-4 border ${
            theme === "dark"
              ? "border-slate-700/40 bg-slate-800/40"
              : "border-slate-200 bg-white shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className={`${text.primary[theme]} font-outfit font-semibold text-sm`}>
              {insight.title}
            </h4>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold font-outfit ${
                theme === "dark"
                  ? "bg-blue-500/15 text-blue-300 border border-blue-500/25"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              {insight.value}
            </span>
          </div>
          <p className={`${text.secondary[theme]} font-outfit text-xs sm:text-sm leading-relaxed`}>
            {insight.description}
          </p>
        </div>

        {/* Tips */}
        <div>
          <h4 className={`${text.primary[theme]} font-outfit font-semibold text-sm mb-3`}>
            Tips to leverage this insight:
          </h4>
          <ul className="space-y-2.5">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    theme === "dark" ? "bg-blue-400" : "bg-blue-500"
                  }`}
                />
                <span className={`${text.secondary[theme]} font-outfit text-xs sm:text-sm leading-relaxed`}>
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </InfoSheet>
  );
};

export default InsightDetailModal;
