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
    <div className={`rounded-xl p-4 font-outfit ${getThemeStyles(theme, {
      dark: 'bg-slate-800/50 border border-slate-700/60',
      light: 'bg-slate-50 border border-slate-200'
    })}`}>
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    currentStep >= step.number
                      ? step.color === "emerald"
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                        : step.color === "blue"
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                      : getThemeStyles(theme, {
                          dark: "bg-slate-700/70 text-slate-400",
                          light: "bg-slate-200 text-slate-500"
                        })
                  }`}
                >
                  {step.number}
                </div>
                <div
                  className={`text-sm ml-3 transition-colors ${
                    currentStep === step.number
                      ? step.color === "emerald"
                        ? getThemeStyles(theme, {
                            dark: "text-emerald-300 font-medium",
                            light: "text-emerald-700 font-medium"
                          })
                        : step.color === "blue"
                        ? getThemeStyles(theme, {
                            dark: "text-blue-300 font-medium",
                            light: "text-blue-700 font-medium"
                          })
                        : getThemeStyles(theme, {
                            dark: "text-purple-300 font-medium",
                            light: "text-purple-700 font-medium"
                          })
                      : getThemeStyles(theme, text.muted)
                  }`}
                >
                  {step.title}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 rounded-full mx-3 transition-colors ${
                    currentStep > step.number 
                      ? step.color === "emerald"
                        ? "bg-emerald-500/70"
                        : step.color === "blue"
                        ? "bg-blue-500/70"
                        : "bg-purple-500/70"
                      : getThemeStyles(theme, {
                          dark: "bg-slate-600/50",
                          light: "bg-slate-300/50"
                        })
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
