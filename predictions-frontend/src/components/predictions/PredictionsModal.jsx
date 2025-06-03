import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, addMinutes } from "date-fns";
import { ThemeContext } from "../../context/ThemeContext";
import { backgrounds, text, getThemeStyles } from "../../utils/themeUtils";
import { InfoCircledIcon, ClockIcon, ExclamationTriangleIcon, CheckIcon } from "@radix-ui/react-icons";

// Import modular components
import ModalHeader from "./modal/ModalHeader";
import StepIndicator from "./modal/StepIndicator";
import ScorePredictionStep from "./modal/ScorePredictionStep";
import GoalscorersStep from "./modal/GoalscorersStep";
import ReviewStep from "./modal/ReviewStep";
import ModalFooter from "./modal/ModalFooter";

export default function PredictionsModal({
  fixture,
  onClose,
  onSave,
  activeGameweekChips = [],
  initialValues = null,
  isEditing = false,
  toggleChipInfoModal,
}) {
  const { theme } = useContext(ThemeContext);
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [homeScore, setHomeScore] = useState(initialValues?.homeScore || 0);
  const [awayScore, setAwayScore] = useState(initialValues?.awayScore || 0);
  const [homeScorers, setHomeScorers] = useState(initialValues?.homeScorers || []);
  const [awayScorers, setAwayScorers] = useState(initialValues?.awayScorers || []);
  const [selectedChips, setSelectedChips] = useState(initialValues?.chips || []);
  
  // UI state
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Validation on step change
  useEffect(() => {
    const newErrors = {};

    if (currentStep === 2) {
      // Validate scorers are selected if there are scores
      if (homeScore > 0) {
        const missingHomeScorers = homeScorers.some((scorer) => !scorer);
        if (missingHomeScorers) {
          newErrors.homeScorers = "Please select all goalscorers";
        }
      }
      if (awayScore > 0) {
        const missingAwayScorers = awayScorers.some((scorer) => !scorer);
        if (missingAwayScorers) {
          newErrors.awayScorers = "Please select all goalscorers";
        }
      }
    }

    setErrors(newErrors);
  }, [currentStep, homeScore, awayScore, homeScorers, awayScorers]);

  // Calculate deadline status
  const deadlineStatus = () => {
    if (!fixture?.date) return { isPast: false, timeLeft: null };
    
    const now = new Date();
    const matchDate = parseISO(fixture.date);
    const deadline = addMinutes(matchDate, -30); // 30 minutes before kickoff
    
    return {
      isPast: now > deadline,
      timeLeft: deadline.getTime() - now.getTime(),
    };
  };

  // Update scorer arrays when scores change
  useEffect(() => {
    setHomeScorers(Array(homeScore).fill(""));
    setAwayScorers(Array(awayScore).fill(""));
  }, [homeScore, awayScore]);

  // Step navigation
  const nextStep = () => {
    if (Object.keys(errors).length === 0) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(1, prevStep - 1));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const updatedPrediction = {
      homeScore,
      awayScore,
      homeScorers,
      awayScorers,
      chips: selectedChips,
    };

    // Simulate API call
    setTimeout(() => {
      if (isEditing && onSave) {
        onSave(updatedPrediction);
      } else {
        console.log({
          fixture: fixture.id,
          prediction: updatedPrediction,
        });
      }

      setSubmitting(false);
      setShowConfirmation(true);

      // Close modal after showing confirmation
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    }, 1000);
  };

  // Handle no fixture case
  if (!fixture) {
    return (
      <div
        className={`${getThemeStyles(
          theme,
          backgrounds.card
        )} backdrop-blur-lg rounded-xl border p-6`}
      >
        <div className="text-center p-8">
          <InfoCircledIcon
            className={`mx-auto mb-4 w-8 h-8 ${getThemeStyles(
              theme,
              text.muted
            )}`}
          />
          <p className={`${getThemeStyles(theme, text.primary)} font-outfit`}>
            No fixture selected
          </p>
        </div>
      </div>
    );
  }

  const deadline = deadlineStatus();
  const modalTitle = isEditing ? "Edit Prediction" : "Make Prediction";

  return (
    <motion.div
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
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`${getThemeStyles(theme, {
          dark: "bg-slate-900/95 border-slate-700/60",
          light: "bg-white border-slate-200",
        })} backdrop-blur-lg rounded-xl border w-full max-w-2xl max-h-[90vh] flex flex-col relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Deadline warning */}
        {deadline.isPast && (
          <div className="bg-red-500/10 border-b border-red-500/20 p-3">
            <div className="flex items-center text-red-400 text-sm">
              <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
              <span>
                The prediction deadline for this match has passed. You can no
                longer make or edit predictions.
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <ModalHeader 
          title={modalTitle}
          fixture={fixture}
          onClose={onClose}
          deadline={deadline}
        />

        {/* Step indicator */}
        <div className="p-4 pb-0">
          <StepIndicator currentStep={currentStep} totalSteps={3} />
        </div>

        {/* Content area */}
        <div className="overflow-y-auto flex-1 p-4">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Score Prediction */}
              {currentStep === 1 && (
                <ScorePredictionStep
                  fixture={fixture}
                  homeScore={homeScore}
                  awayScore={awayScore}
                  onHomeScoreChange={setHomeScore}
                  onAwayScoreChange={setAwayScore}
                />
              )}              {/* Step 2: Goalscorers & Chips */}
              {currentStep === 2 && (
                <GoalscorersStep
                  fixture={fixture}
                  homeScore={homeScore}
                  awayScore={awayScore}
                  homeScorers={homeScorers}
                  awayScorers={awayScorers}
                  selectedChips={selectedChips}
                  onHomeScorerChange={(index, value) => {
                    const newScorers = [...homeScorers];
                    newScorers[index] = value;
                    setHomeScorers(newScorers);
                  }}
                  onAwayScorerChange={(index, value) => {
                    const newScorers = [...awayScorers];
                    newScorers[index] = value;
                    setAwayScorers(newScorers);
                  }}
                  onToggleChip={(chipId) => {
                    setSelectedChips(prev => 
                      prev.includes(chipId) 
                        ? prev.filter(id => id !== chipId)
                        : [...prev, chipId]
                    );
                  }}
                  toggleChipInfoModal={toggleChipInfoModal}
                  errors={errors}
                />
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <ReviewStep
                  fixture={fixture}
                  homeScore={homeScore}
                  awayScore={awayScore}
                  homeScorers={homeScorers}
                  awayScorers={awayScorers}
                  selectedChips={selectedChips}
                  activeGameweekChips={activeGameweekChips}
                />
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Footer */}
        <ModalFooter
          currentStep={currentStep}
          totalSteps={3}
          onPrevStep={prevStep}
          onNextStep={nextStep}
          onSubmit={handleSubmit}
          submitting={submitting}
        />

        {/* Success confirmation overlay */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckIcon className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-slate-100 text-xl font-bold mb-2 font-outfit">
                  {isEditing ? "Prediction Updated!" : "Prediction Submitted!"}
                </h3>
                <p className="text-slate-300 text-sm">
                  {isEditing 
                    ? "Your prediction has been successfully updated."
                    : "Your prediction has been successfully submitted."
                  }
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
