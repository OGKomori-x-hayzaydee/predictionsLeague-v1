import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { getThemeStyles, text, status } from "../../../utils/themeUtils";

export default function StepIndicator({ currentStep }) {
  const { theme } = useContext(ThemeContext);

  const steps = [
    { number: 1, title: "Score Prediction", color: "emerald" },
    { number: 2, title: "Goalscorers & Chips", color: "blue" },
    { number: 3, title: "Review & Submit", color: "purple" }
  ];

  return (
    <div
      className={`px-4 py-3 ${getThemeStyles(theme, {
        dark: "bg-slate-800/30 border-slate-700/60",
        light: "bg-slate-50/30 border-slate-200/60",
      })} border-b font-outfit`}
    >
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    currentStep >= step.number
                      ? `bg-${step.color}-500 text-slate-900 shadow-lg shadow-${step.color}-500/25`
                      : "bg-slate-700/70 text-slate-400"
                  }`}
                >
                  {step.number}
                </div>
                <div
                  className={`text-sm ml-3 transition-colors ${
                    currentStep === step.number
                      ? step.color === "emerald"
                        ? getThemeStyles(theme, status.success.text) + " font-medium"
                        : step.color === "blue"
                        ? getThemeStyles(theme, status.info.text) + " font-medium"
                        : "text-purple-300 font-medium"
                      : getThemeStyles(theme, text.muted)
                  }`}
                >
                  {step.title}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 rounded-full transition-colors ${
                    currentStep > step.number ? `bg-${step.color}-500/70` : "bg-slate-600/50"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
