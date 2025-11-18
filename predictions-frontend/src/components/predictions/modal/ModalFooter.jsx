import { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../../../context/ThemeContext";
import { ChevronRightIcon, CheckIcon } from "@radix-ui/react-icons";

export default function ModalFooter({ 
  currentStep, 
  totalSteps = 3, 
  onPrevStep, 
  onNextStep, 
  onSubmit, 
  submitting = false,
  disableNext = false
}) {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`border-t ${
        theme === "dark"
          ? "border-slate-700/60 bg-slate-800/40"
          : "border-slate-200/60 bg-slate-50/40"
      } p-4`}
    >
      <div className="flex justify-between items-center">
        <motion.button
          type="button"
          onClick={onPrevStep}
          whileHover={{ scale: currentStep === 1 ? 1 : 1.02 }}
          whileTap={{ scale: currentStep === 1 ? 1 : 0.98 }}
          className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 font-outfit ${
            currentStep === 1
              ? "invisible"
              : theme === "dark"
              ? "border-slate-600/50 text-slate-300 hover:text-slate-100 hover:border-slate-500/70 hover:bg-slate-700/30"
              : "border-slate-300/50 text-slate-700 hover:text-slate-900 hover:border-slate-400/70 hover:bg-slate-100/30"
          }`}
        >
          <div className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 mr-1 rotate-180" />
            Back
          </div>
        </motion.button>

        {currentStep < totalSteps ? (
          disableNext ? (
            <div className="invisible px-6 py-2.5">
              <div className="flex items-center">
                Continue
                <ChevronRightIcon className="w-4 h-4 ml-1" />
              </div>
            </div>
          ) : (
            <motion.button
              type="button"
              onClick={onNextStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium font-outfit shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
            >
              <div className="flex items-center">
                Continue
                <ChevronRightIcon className="w-4 h-4 ml-1" />
              </div>
            </motion.button>
          )
        ) : (
          <motion.button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            className={`px-6 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium font-outfit flex items-center ${
              submitting
                ? "bg-purple-700/50 cursor-not-allowed text-purple-200"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40"
            }`}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-purple-200/30 border-t-purple-200 rounded-full animate-spin mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4 mr-2" />
                Submit Prediction
              </>
            )}
          </motion.button>
        )}
      </div>
    </div>
  );
}
