import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, addMinutes } from "date-fns";
import { ThemeContext } from "../../context/ThemeContext";
import { backgrounds, text, getThemeStyles } from "../../utils/themeUtils";
import { InfoCircledIcon, ClockIcon, ExclamationTriangleIcon, CheckIcon } from "@radix-ui/react-icons";
import { userPredictionsAPI } from "../../services/api/userPredictionsAPI";
import { showToast } from "../../services/notificationService";
import { transformChipsFromBackend } from "../../utils/backendMappings";
import { useChipManagement } from "../../context/ChipManagementContext";
import { CHIP_CONFIG } from "../../utils/chipManager";
import { isChipApplicableToPrediction } from "../../utils/chipValidation";

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
  userPredictions = [], // For validating gameweek-limited chips like Double Down
}) {
  const { theme } = useContext(ThemeContext);
  
  // Chip management - only need refreshChips since backend handles recording
  const { 
    refreshChips,
    isChipUsedInGameweek
  } = useChipManagement();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [homeScore, setHomeScore] = useState(initialValues?.homeScore || 0);
  const [awayScore, setAwayScore] = useState(initialValues?.awayScore || 0);
  const [homeScorers, setHomeScorers] = useState(initialValues?.homeScorers || []);
  const [awayScorers, setAwayScorers] = useState(initialValues?.awayScorers || []);

  // 🔧 FIX: selectedChips should ONLY contain MATCH-SCOPED chips
  // Gameweek chips are applied retroactively and merged at submission time
  // This prevents gameweek chips from counting toward the 2-match-chip limit
  const initialMatchChips = (initialValues?.chips || []).filter(chipId => {
    const chipConfig = CHIP_CONFIG[chipId];
    return chipConfig?.scope === 'match';
  });
  const [selectedChips, setSelectedChips] = useState(initialMatchChips);

  // Chip immutability: Track which MATCH chips were already applied (cannot be removed)
  const lockedChips = isEditing ? initialMatchChips : [];
  
  // Check if a specific chip is locked (already applied, cannot be removed)
  const isChipLocked = (chipId) => lockedChips.includes(chipId);
  
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
    
    // Fix for backend sending date without timezone indicator
    // If date doesn't end with 'Z' or have timezone offset, assume it's UTC
    let dateString = fixture.date;
    if (!dateString.endsWith('Z') && !dateString.match(/[+-]\d{2}:\d{2}$/)) {
      dateString = dateString + 'Z'; // Treat as UTC
    }
    
    const matchDate = parseISO(dateString);
    const deadline = addMinutes(matchDate, -30); // 30 minutes before kickoff
    
    return {
      isPast: now > deadline,
      timeLeft: deadline.getTime() - now.getTime(),
    };
  };

  // Update scorer arrays when scores change
  // BUT preserve existing scorers when editing (only resize arrays if needed)
  useEffect(() => {
    if (isEditing) {
      // When editing, only adjust array size if score changed
      setHomeScorers(prev => {
        if (prev.length === homeScore) return prev; // No change needed
        if (homeScore > prev.length) {
          // Score increased, add empty slots
          return [...prev, ...Array(homeScore - prev.length).fill("")];
        } else {
          // Score decreased, trim array
          return prev.slice(0, homeScore);
        }
      });
      
      setAwayScorers(prev => {
        if (prev.length === awayScore) return prev; // No change needed
        if (awayScore > prev.length) {
          // Score increased, add empty slots
          return [...prev, ...Array(awayScore - prev.length).fill("")];
        } else {
          // Score decreased, trim array
          return prev.slice(0, awayScore);
        }
      });
    } else {
      // When creating new prediction, reset arrays completely
      setHomeScorers(Array(homeScore).fill(""));
      setAwayScorers(Array(awayScore).fill(""));
    }
  }, [homeScore, awayScore, isEditing]);

  // Step navigation
  const nextStep = () => {
    if (Object.keys(errors).length === 0) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(1, prevStep - 1));
  };

  // Form submission with 3-step chip integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Block if deadline has passed (for both creating and editing)
    const currentDeadline = deadlineStatus();
    if (currentDeadline.isPast) {
      showToast(
        `Deadline has passed - cannot ${isEditing ? 'edit' : 'submit'} prediction`, 
        'error'
      );
      onClose();
      return;
    }
    
    setSubmitting(true);

    // Filter activeGameweekChips to only include chips applicable to this prediction
    // Uses centralized isChipApplicableToPrediction() for consistency
    const predictionData = { homeScore, awayScore };
    const applicableGameweekChips = activeGameweekChips.filter(chipId =>
      isChipApplicableToPrediction(chipId, predictionData).applicable
    );

    // 🔄 MERGE CHIPS: Combine match chips (from selection) + gameweek chips (from context)
    // - selectedChips: Only MATCH-SCOPED chips (user selected in this modal)
    // - applicableGameweekChips: Only GAMEWEEK-SCOPED chips (applied retroactively)
    // - This separation ensures gameweek chips don't count toward the 2-match-chip limit
    // - Both arrays are already in frontend format (camelCase) - no transformation needed
    const allChips = [...new Set([...selectedChips, ...applicableGameweekChips])];

    console.log('🔄 [CHIP MERGE] Merging match and gameweek chips:', {
      matchChips: selectedChips,
      gameweekChips: applicableGameweekChips,
      mergedChips: allChips,
      counts: {
        match: selectedChips.length,
        gameweek: applicableGameweekChips.length,
        total: allChips.length
      }
    });

    const frontendPrediction = {
      homeScore,
      awayScore,
      homeScorers,
      awayScorers,
      chips: allChips // Include chips in prediction payload for backend
    };

    try {
      console.log('🎯 Submitting prediction:', {
        fixture: fixture.id,
        prediction: frontendPrediction,
        matchChips: selectedChips,
        gameweekChips: activeGameweekChips,
        allChips: allChips,
        teams: `${fixture.homeTeam} vs ${fixture.awayTeam}`
      });

      // Submit prediction to backend (backend will validate chips automatically)
      // If chips are invalid, backend will return an error
      const result = await userPredictionsAPI.makePrediction(frontendPrediction, fixture, isEditing);
      
      if (!result.success) {
        throw new Error(result.error?.message || `Failed to ${isEditing ? 'update' : 'submit'} prediction`);
      }

      console.log(`✅ Prediction ${isEditing ? 'updated' : 'submitted'} successfully`);
      const predictionId = result.data?.id;

      // STEP 3: Refresh chip status after prediction submission
      // Backend automatically records chip usage and updates cooldowns
      // We just need to refresh the frontend cache
      if (allChips.length > 0) {
        console.log('� Refreshing chip status after prediction submission...', {
          isNewPrediction: !isEditing,
          chipsUsed: allChips
        });
        
        try {
          await refreshChips();
          console.log('✅ Chip status refreshed - cooldowns updated');
        } catch (chipError) {
          // Chip refresh failed, but prediction was saved
          // User can manually refresh later
          console.error('⚠️ Chip status refresh failed:', chipError.message);
        }
      }

      // Success!
      showToast(
        isEditing ? 'Prediction updated successfully!' : 'Prediction submitted successfully!', 
        'success'
      );
      
      // Call onSave if provided (for parent component updates)
      if (onSave) {
        onSave(frontendPrediction);
      }
      
      setShowConfirmation(true);

      // Close modal after showing confirmation
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);

    } catch (error) {
      console.error('❌ Prediction submission failed:', error.message);
      showToast(
        `Failed to ${isEditing ? 'update' : 'submit'} prediction: ${error.message}`, 
        'error'
      );
    } finally {
      setSubmitting(false);
    }
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
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-2 sm:p-4 ${getThemeStyles(theme, {
        dark: 'bg-slate-950/90',
        light: 'bg-slate-200/80'
      })} backdrop-blur-lg`}
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
        className={`w-full max-w-[92vw] sm:max-w-2xl max-h-[90vh] flex flex-col relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl text-sm sm:text-base ${getThemeStyles(theme, {
          dark: "bg-slate-900 border border-slate-700/60",
          light: "bg-white border border-slate-200",
        })}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Deadline warning */}
        {deadline.isPast && (
          <div className={`p-2 sm:p-4 border-b text-xs sm:text-sm ${getThemeStyles(theme, {
            dark: 'bg-red-900/20 border-red-700/30',
            light: 'bg-red-50 border-red-200'
          })}`}>
            <div className={`flex items-center text-sm font-outfit ${getThemeStyles(theme, {
              dark: 'text-red-300',
              light: 'text-red-700'
            })}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${getThemeStyles(theme, {
                dark: 'bg-red-500/20',
                light: 'bg-red-100'
              })}`}>
                <ExclamationTriangleIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium mb-1">Deadline Passed</div>
                <div className={`text-xs ${getThemeStyles(theme, {
                  dark: 'text-red-400',
                  light: 'text-red-600'
                })}`}>
                  The prediction deadline for this match has passed. You can no longer make or edit predictions.
                </div>
              </div>
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
        <div className={`p-3 sm:p-6 pb-2 sm:pb-4 border-b ${getThemeStyles(theme, {
          dark: 'border-slate-700/60',
          light: 'border-slate-200'
        })}`}>
          <StepIndicator currentStep={currentStep} totalSteps={3} />
        </div>

        {/* Content area */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-6">
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
                  disabled={deadline.isPast && isEditing}
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
                    // Check if this chip is locked (already applied to original prediction)
                    if (isChipLocked(chipId)) {
                      console.log('⚠️ Cannot remove locked chip:', chipId);
                      showToast('This chip cannot be removed once applied', 'error');
                      return;
                    }
                    
                    // FRONTEND VALIDATION: Check gameweek limits for MATCH-SCOPED chips
                    // (e.g., Double Down can only be used on ONE match per gameweek)
                    // Gameweek-scoped chips (Defense++, All-In Week) should apply to ALL predictions
                    if (!selectedChips.includes(chipId)) {
                      const chipConfig = CHIP_CONFIG[chipId];
                      const isMatchScopedWithLimit = chipConfig?.scope === 'match' && chipConfig?.gameweekLimit;
                      
                      if (isMatchScopedWithLimit) {
                        const alreadyUsed = isChipUsedInGameweek(
                          chipId, 
                          fixture.gameweek, 
                          userPredictions,
                          fixture.id // Exclude current match if editing
                        );
                        
                        if (alreadyUsed) {
                          console.log('🚫 Match-scoped chip already used in this gameweek:', chipId);
                          showToast(
                            `${chipConfig.name} can only be used on one match per gameweek`, 
                            'error'
                          );
                          return;
                        }
                      }
                    }
                    
                    // Toggle chip selection
                    setSelectedChips(prev => 
                      prev.includes(chipId) 
                        ? prev.filter(id => id !== chipId)
                        : [...prev, chipId]
                    );
                  }}
                  toggleChipInfoModal={toggleChipInfoModal}
                  errors={errors}
                  isEditing={isEditing}
                  lockedChips={lockedChips}
                  userPredictions={userPredictions}
                  gameweek={fixture.gameweek}
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
          disableNext={deadline.isPast && isEditing && currentStep === 1}
        />

        {/* Success confirmation overlay */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10 ${getThemeStyles(theme, {
                dark: 'bg-slate-900/95',
                light: 'bg-white/95'
              })}`}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center p-8"
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ${getThemeStyles(theme, {
                  dark: 'bg-emerald-500/20 border border-emerald-500/30',
                  light: 'bg-emerald-100 border border-emerald-200'
                })}`}>
                  <CheckIcon className={`w-10 h-10 ${getThemeStyles(theme, {
                    dark: 'text-emerald-400',
                    light: 'text-emerald-600'
                  })}`} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 font-outfit ${getThemeStyles(theme, text.primary)}`}>
                  {isEditing ? "Prediction Updated!" : "Prediction Submitted!"}
                </h3>
                <p className={`font-outfit ${getThemeStyles(theme, text.secondary)}`}>
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
