import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckIcon,
  Cross2Icon,
  QuestionMarkCircledIcon,
  ChevronDownIcon,
  LightningBoltIcon,
  RocketIcon,
  StarIcon,
  TargetIcon,
  InfoCircledIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { useChipManagement } from "../../context/ChipManagementContext";
import {
  getThemeStyles,
  backgrounds,
  text,
  buttons,
} from "../../utils/themeUtils";
import { padding, textScale } from "../../utils/mobileScaleUtils";
import { userPredictionsAPI } from "../../services/api/userPredictionsAPI";
import { showToast } from "../../services/notificationService";
import { isGameweekChip } from "../../utils/chipManager";
import { getChipInfo } from "../../utils/chipUtils";
import { isChipApplicableToPrediction } from "../../utils/chipValidation";
import { CHIP_MAPPING } from "../../utils/backendMappings";

const GameweekChipsPanel = ({
  currentGameweek,
  onApplyChip,
  activeMatchChips = [],
  toggleChipInfoModal,
  userPredictions = [], // Array of user's predictions for retroactive application
  refetchPredictions, // Function to refetch fresh prediction data before applying chips
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedChip, setSelectedChip] = useState(null);
  const [selectedTab, setSelectedTab] = useState("gameweek");
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [applyProgress, setApplyProgress] = useState({ current: 0, total: 0 });

  // Get theme context
  const { theme } = useContext(ThemeContext);

  // Get chip management context
  const {
    availableChips,
    getMatchChips,
    getGameweekChips,
    currentGameweek: contextGameweek,
    activeGameweekChips, // Get active gameweek chips from backend
    refreshChips,
  } = useChipManagement();

  // Use context gameweek if currentGameweek prop not provided
  const activeGameweek = currentGameweek || contextGameweek;

  // Get chips from context
  const gameweekChips = getGameweekChips().map((chip) => ({
    ...chip,
    // Map display properties
    cooldownRemaining: chip.remainingGameweeks || 0,
    // Calculate remaining uses: seasonLimit - usageCount
    remainingUses: chip.seasonLimit
      ? chip.seasonLimit - (chip.usageCount || 0)
      : null,
  }));

  const matchChips = getMatchChips().map((chip) => ({
    ...chip,
    // Map display properties
    cooldownRemaining: chip.remainingGameweeks || 0,
    // Calculate remaining uses: seasonLimit - usageCount
    remainingUses: chip.seasonLimit
      ? chip.seasonLimit - (chip.usageCount || 0)
      : null,
  }));

  // Combined chips for display
  const allChips = [...gameweekChips, ...matchChips];

  // Apply gameweek chip with retroactive application to all pending predictions
  const handleApplyGameweekChip = async (chipId) => {
    setIsApplying(true);
    setApplyProgress({ current: 0, total: 0 });

    try {
      // Refetch predictions to ensure we have the latest chip data
      let freshPredictions = userPredictions;
      
      if (refetchPredictions) {
        const refetchResult = await refetchPredictions();
        freshPredictions = refetchResult.data || userPredictions;
      }

      // Filter pending predictions in current gameweek using fresh data
      const pendingPredictions = freshPredictions.filter(pred => {
        const gameweekMatch = pred.gameweek === activeGameweek;
        const isPending = pred.status === 'pending';
        return gameweekMatch && isPending;
      });

      // CHIP-SPECIFIC FILTERING: Use centralized isChipApplicableToPrediction()
      const applicablePredictions = pendingPredictions.filter(pred =>
        isChipApplicableToPrediction(chipId, pred).applicable
      );

      if (applicablePredictions.length === 0) {
        const chipName = getChipInfo(chipId)?.name || chipId;
        showToast(`No eligible predictions for ${chipName}`, 'info');
        setIsApplying(false);
        return;
      }

      setApplyProgress({ current: 0, total: applicablePredictions.length });

      // Update each prediction with the new chip
      const results = [];
      for (let i = 0; i < applicablePredictions.length; i++) {
        const prediction = applicablePredictions[i];

        // 🔧 DEFENSIVE: Ensure chips are in frontend format (camelCase)
        // Backend should send camelCase, but add transformation as safety net
        const existingChips = (prediction.chips || []).map(chip => {
          // If already camelCase (starts with lowercase), return as-is
          if (chip && chip[0] === chip[0].toLowerCase()) {
            return chip;
          }
          // If UPPER_CASE, try to transform (defensive coding)
          const transformed = Object.keys(CHIP_MAPPING).find(
            key => CHIP_MAPPING[key] === chip
          );
          if (transformed) {
            console.warn('⚠️ [CHIP FORMAT] Found backend-format chip, transforming:', {
              original: chip,
              transformed,
              match: `${prediction.homeTeam} vs ${prediction.awayTeam}`
            });
            return transformed;
          }
          return chip; // Fallback to original
        });

        console.log('🔍 [CHIP MERGE] Before merge:', {
          matchId: prediction.matchId,
          match: `${prediction.homeTeam} vs ${prediction.awayTeam}`,
          existingChips,
          chipToAdd: chipId
        });

        const updatedChips = [...existingChips];

        if (!updatedChips.includes(chipId)) {
          updatedChips.push(chipId);
        }

        console.log('🔍 [CHIP MERGE] After merge:', {
          matchId: prediction.matchId,
          updatedChips,
          count: updatedChips.length
        });

        // Create updated prediction payload
        const updatedPrediction = {
          homeScore: prediction.homeScore,
          awayScore: prediction.awayScore,
          homeScorers: prediction.homeScorers || [],
          awayScorers: prediction.awayScorers || [],
          chips: updatedChips
        };

        // Create fixture object for API call
        const fixture = {
          id: prediction.matchId,
          homeTeam: prediction.homeTeam,
          awayTeam: prediction.awayTeam,
          date: prediction.matchDate,
          gameweek: prediction.gameweek
        };

        try {
          const result = await userPredictionsAPI.makePrediction(
            updatedPrediction,
            fixture,
            true // isEditing = true
          );

          results.push({ success: result.success, match: `${prediction.homeTeam} vs ${prediction.awayTeam}` });
          setApplyProgress({ current: i + 1, total: pendingPredictions.length });
        } catch (error) {
          console.error(`❌ Failed to update prediction:`, error);
          results.push({ success: false, match: `${prediction.homeTeam} vs ${prediction.awayTeam}`, error: error.message });
        }
      }

      // Count successes and failures
      const successes = results.filter(r => r.success).length;
      const failures = results.filter(r => !r.success).length;
      const chipName = getChipInfo(chipId)?.name || chipId;

      if (successes > 0) {
        showToast(
          `${chipName} applied to ${successes} prediction${successes > 1 ? 's' : ''}${failures > 0 ? ` (${failures} failed)` : ''}`,
          failures > 0 ? 'warning' : 'success'
        );
      } else {
        showToast(`Failed to apply ${chipName} to predictions`, 'error');
      }

      // Refresh chip status from backend
      await refreshChips();

      // Call parent callback if provided
      if (onApplyChip) {
        onApplyChip(chipId, activeGameweek);
      }

    } catch (error) {
      console.error('❌ Error applying gameweek chip:', error);
      showToast(`Failed to apply chip: ${error.message}`, 'error');
    } finally {
      setIsApplying(false);
      setApplyProgress({ current: 0, total: 0 });
      setShowConfirmModal(false);
      setSelectedChip(null);
    }
  };

  // Toggle chip selection
  const selectChipForConfirmation = (chipId) => {
    // Check if this is a gameweek chip
    if (!isGameweekChip(chipId)) {
      console.warn('⚠️ Only gameweek chips can be applied from this panel');
      return;
    }

    // Check if already active (from backend)
    const alreadyActive = activeGameweekChips?.includes(chipId);

    if (alreadyActive) {
      // Cannot remove gameweek chips once applied (immutability)
      showToast('Gameweek chips cannot be removed once applied', 'error');
      return;
    }

    const chip = allChips.find((c) => c.id === chipId);
    if (!chip || !chip.available) return;

    setSelectedChip(chip);
    setShowConfirmModal(true);
  };

  // Handle chip application after confirmation
  const confirmChipApplication = () => {
    if (!selectedChip) return;
    handleApplyGameweekChip(selectedChip.id);
  };

  // Format fixture name helper
  const formatFixture = (fixture) => {
    if (!fixture || !fixture.homeTeam || !fixture.awayTeam) {
      return "Unknown fixture";
    }
    return `${fixture.homeTeam} vs ${fixture.awayTeam}`;
  };

  // Get count of active chips (for the header)
  const activeChipsCount = (activeGameweekChips?.length || 0) + activeMatchChips.length;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`backdrop-blur-xl rounded-xl border mb-5 overflow-hidden font-outfit ${getThemeStyles(
        theme,
        {
          dark: "border-slate-700/50 bg-slate-900/60",
          light: "border-slate-200 bg-white/80",
        }
      )}`}
    >
      {/* Status indicator bar */}
      <div className="h-0.5 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500"></div>
      {/* Header - OPTIMIZED FOR MOBILE */}
      <div
        className={`px-4 sm:px-5 py-3 sm:py-4 border-b ${getThemeStyles(theme, {
          dark: "border-slate-700/50",
          light: "border-slate-200",
        })}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
              <LightningBoltIcon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className={`text-base sm:text-lg font-semibold ${getThemeStyles(
                  theme,
                  text.primary
                )}`}
              >
                Chip Strategy
              </h3>
              {/* Subtitle hidden on mobile */}
              <p
                className={`hidden sm:block text-xs sm:text-sm ${getThemeStyles(
                  theme,
                  text.secondary
                )}`}
              >
                Enhance your predictions with strategic chip usage
              </p>
            </div>
          </div>
          {/* Right: Badges + Collapse button */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Active chips count - show on all screens */}
            {activeChipsCount > 0 && (
              <div
                className={`rounded-full px-2.5 sm:px-3 py-1 flex items-center font-outfit border ${getThemeStyles(
                  theme,
                  {
                    dark: "bg-teal-900/40 border-teal-700/30 text-teal-300",
                    light: "bg-teal-100 border-teal-200 text-teal-700",
                  }
                )}`}
              >
                <span className="text-xs sm:text-sm font-medium">
                  {activeChipsCount}
                </span>
                <span className="text-xs sm:text-sm ml-0.5"> active</span>
              </div>
            )}

            {/* Gameweek badge - consistent sizing */}
            <div
              className={`rounded-full px-2.5 sm:px-3 py-1 flex items-center font-outfit border ${getThemeStyles(
                theme,
                {
                  dark: "bg-blue-900/40 border-blue-700/30 text-blue-300",
                  light: "bg-blue-100 border-blue-200 text-blue-700",
                }
              )}`}
            >
              <span
                className={`text-xs sm:text-sm ${getThemeStyles(theme, {
                  dark: "text-blue-200/70",
                  light: "text-blue-600/70",
                })}`}
              >
                GW
              </span>
              <span className="font-medium text-xs sm:text-sm ml-0.5 sm:ml-1">
                {activeGameweek}
              </span>
            </div>

            {/* Collapse button - increased mobile size */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 border ${getThemeStyles(
                theme,
                {
                  dark: "bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-slate-200 border-slate-600/50 hover:border-slate-500/50",
                  light:
                    "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-700 border-slate-300 hover:border-slate-400",
                }
              )}`}
            >
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-200 ${
                  isPanelCollapsed ? "rotate-180" : ""
                }`}
              />
            </motion.button>
          </div>
        </div>
      </div>
      {/* Collapsible content */}
      <AnimatePresence>
        {!isPanelCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {" "}
            <div className="p-3">
              {" "}
              {/* Tab navigation */}
              <div
                className={`mb-3 border-b ${getThemeStyles(theme, {
                  dark: "border-slate-700/50",
                  light: "border-slate-200",
                })}`}
              >
                <div className="flex">
                  {" "}
                  <button
                    onClick={() => setSelectedTab("gameweek")}
                    className={`py-2 px-4 text-sm relative transition-colors ${
                      selectedTab === "gameweek"
                        ? getThemeStyles(theme, {
                            dark: "text-teal-300",
                            light: "text-teal-600",
                          })
                        : getThemeStyles(theme, {
                            dark: "text-slate-400 hover:text-slate-300",
                            light: "text-slate-500 hover:text-slate-700",
                          })
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <TargetIcon className="w-3.5 h-3.5" />
                      Gameweek Chips
                    </div>
                    {selectedTab === "gameweek" && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
                        layoutId="tabIndicator"
                      />
                    )}
                  </button>{" "}
                  <button
                    onClick={() => setSelectedTab("match")}
                    className={`py-2 px-4 text-sm relative transition-colors ${
                      selectedTab === "match"
                        ? getThemeStyles(theme, {
                            dark: "text-teal-300",
                            light: "text-teal-600",
                          })
                        : getThemeStyles(theme, {
                            dark: "text-slate-400 hover:text-slate-300",
                            light: "text-slate-500 hover:text-slate-700",
                          })
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <RocketIcon className="w-3.5 h-3.5" />
                      Match Chips
                    </div>
                    {selectedTab === "match" && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500"
                        layoutId="tabIndicator"
                      />
                    )}
                  </button>
                </div>
              </div>
              {/* Tab content */}
              <AnimatePresence mode="wait">
                {selectedTab === "gameweek" ? (
                  <motion.div
                    key="gameweek"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {" "}
                    <div>
                      <div className="p-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
                          {gameweekChips.map((chip) => {
                            const isActive = activeGameweekChips?.includes(chip.id);
                            const isAvailable = chip.available && !isActive;

                            return (
                              <motion.div
                                key={chip.id}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                                className={`relative flex flex-col rounded-md overflow-hidden border font-outfit ${
                                  isActive
                                    ? getThemeStyles(theme, {
                                        dark: "border-teal-500/40 bg-teal-900/20",
                                        light: "border-teal-400 bg-teal-50",
                                      })
                                    : !isAvailable
                                    ? getThemeStyles(theme, {
                                        dark: "opacity-70 border-slate-600/30 bg-slate-800/20",
                                        light:
                                          "opacity-70 border-slate-300 bg-slate-100",
                                      })
                                    : getThemeStyles(theme, {
                                        dark: "border-slate-600/50 bg-slate-800/30 hover:border-slate-500/50",
                                        light:
                                          "border-slate-300 bg-white hover:border-slate-400",
                                      })
                                }`}
                              >
                                {" "}
                                {/* Chip header with icon and status */}{" "}
                                <div
                                  className={`flex items-center p-2 ${getThemeStyles(
                                    theme,
                                    {
                                      dark: "bg-slate-700/30",
                                      light: "bg-slate-50",
                                    }
                                  )}`}
                                >
                                  <div
                                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mr-2 ${getThemeStyles(
                                      theme,
                                      {
                                        dark: "bg-slate-600/50",
                                        light: "bg-slate-200",
                                      }
                                    )}`}
                                  >
                                    <span className="text-sm">{chip.icon}</span>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    {" "}
                                    <div className="flex items-center justify-between">
                                      <div
                                        className={`text-sm font-semibold ${getThemeStyles(
                                          theme,
                                          text.primary
                                        )}`}
                                      >
                                        {chip.name}
                                      </div>{" "}
                                      {isActive && (
                                        <div
                                          className={`flex items-center text-2xs px-1.5 py-0.5 rounded ${getThemeStyles(
                                            theme,
                                            {
                                              dark: "bg-teal-700/30 text-teal-300",
                                              light:
                                                "bg-teal-100 text-teal-700",
                                            }
                                          )}`}
                                        >
                                          <CheckIcon className="w-2.5 h-2.5 mr-0.5" />
                                          <span>Active</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {/* Status indicators */}{" "}
                                <div className="px-2 py-1">
                                  {" "}
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex gap-1">
                                      {(chip.cooldown > 0 ||
                                        (chip.cooldown === 0 &&
                                          !chip.seasonLimit)) && (
                                        <div
                                          className={`px-1.5 py-0.5 rounded ${getThemeStyles(
                                            theme,
                                            {
                                              dark: "bg-slate-700/50 text-slate-300",
                                              light:
                                                "bg-slate-200 text-slate-600",
                                            }
                                          )}`}
                                        >
                                          {chip.cooldown === 0 &&
                                          !chip.seasonLimit
                                            ? "Always available"
                                            : `${chip.cooldown} GW`}
                                        </div>
                                      )}
                                      {chip.seasonLimit && (
                                        <div
                                          className={`px-1.5 py-0.5 rounded ${getThemeStyles(
                                            theme,
                                            {
                                              dark: "bg-slate-700/50 text-slate-300",
                                              light:
                                                "bg-slate-200 text-slate-600",
                                            }
                                          )}`}
                                        >
                                          {chip.remainingUses}/
                                          {chip.seasonLimit} left
                                        </div>
                                      )}
                                    </div>
                                    {!isActive &&
                                      chip.cooldownRemaining > 0 && (
                                        <div className="bg-red-900/30 text-red-300 px-1.5 py-0.5 rounded">
                                          {chip.cooldownRemaining} GW
                                        </div>
                                      )}
                                  </div>
                                </div>{" "}
                                {/* Apply/Locked button */}{" "}
                                <div
                                  className={`mt-auto border-t ${getThemeStyles(
                                    theme,
                                    {
                                      dark: "border-slate-600/30",
                                      light: "border-slate-200",
                                    }
                                  )}`}
                                >
                                  {isActive ? (
                                    <div
                                      className={`w-full text-xs py-1.5 transition-all duration-200 flex items-center justify-center ${getThemeStyles(
                                        theme,
                                        {
                                          dark: "text-teal-300 bg-teal-900/20",
                                          light: "text-teal-700 bg-teal-100",
                                        }
                                      )}`}
                                      title="Gameweek chips cannot be removed once applied"
                                    >
                                      🔒 Active (Locked)
                                    </div>
                                  ) : isAvailable ? (
                                    <motion.button
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      onClick={() =>
                                        selectChipForConfirmation(chip.id)
                                      }
                                      disabled={isApplying}
                                      className="w-full bg-indigo-600/60 hover:bg-indigo-600/80 text-white text-xs py-1.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {isApplying ? 'Applying...' : 'Apply'}
                                    </motion.button>
                                  ) : (
                                    <div
                                      className={`w-full text-center text-xs py-1.5 ${getThemeStyles(
                                        theme,
                                        {
                                          dark: "text-slate-500",
                                          light: "text-slate-400",
                                        }
                                      )}`}
                                    >
                                      Not Available
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="match"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {" "}
                    <div>
                      <div className="p-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 font-outfit">
                          {matchChips.map((chip) => {
                            const usages = activeMatchChips.filter(
                              (usage) => usage.chipId === chip.id
                            );
                            const usageCount = usages.length;

                            return (
                              <motion.div
                                key={chip.id}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                                className={`relative flex flex-col rounded-md overflow-hidden border ${
                                  chip.available
                                    ? getThemeStyles(theme, {
                                        dark: "border-slate-600/50 bg-slate-800/30 hover:border-slate-500/50",
                                        light:
                                          "border-slate-300 bg-white hover:border-slate-400",
                                      })
                                    : getThemeStyles(theme, {
                                        dark: "opacity-70 border-slate-600/30 bg-slate-800/20",
                                        light:
                                          "opacity-70 border-slate-300 bg-slate-100",
                                      })
                                }`}
                              >
                                {" "}
                                {/* Chip header - With icon and usage count */}{" "}
                                <div
                                  className={`flex items-center p-2 ${getThemeStyles(
                                    theme,
                                    {
                                      dark: "bg-slate-700/30",
                                      light: "bg-slate-50",
                                    }
                                  )}`}
                                >
                                  <div
                                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mr-2 ${
                                      chip.icon === "2x"
                                        ? "bg-teal-900/40 text-teal-400"
                                        : chip.icon === "3x"
                                        ? "bg-purple-900/40 text-purple-400"
                                        : chip.icon === "⚽"
                                        ? "bg-cyan-900/40 text-cyan-400"
                                        : "bg-amber-700/50 text-amber-300"
                                    }`}
                                  >
                                    <span className="text-xs font-bold">
                                      {chip.icon}
                                    </span>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    {" "}
                                    <div className="flex items-center justify-between">
                                      <div
                                        className={`text-xs font-semibold ${getThemeStyles(
                                          theme,
                                          text.primary
                                        )}`}
                                      >
                                        {chip.name}
                                      </div>

                                      {usageCount > 0 && (
                                        <div className="bg-blue-700/30 text-blue-300 text-xs px-1.5 py-0.5 rounded">
                                          {usageCount} used
                                        </div>
                                      )}

                                      {usageCount === 0 &&
                                        chip.cooldownRemaining > 0 && (
                                          <div className="bg-red-900/30 text-red-300 text-xs px-1.5 py-0.5 rounded">
                                            {chip.cooldownRemaining} GW
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                                {/* Limits and strategy section */}{" "}
                                <div className="px-2 py-1">
                                  {" "}
                                  <div className="flex items-center justify-between text-xs mb-1">
                                    <div className="flex gap-1">
                                      {chip.cooldown && (
                                        <div
                                          className={`px-1.5 py-0.5 rounded ${getThemeStyles(
                                            theme,
                                            {
                                              dark: "bg-slate-700/50 text-slate-300",
                                              light:
                                                "bg-slate-200 text-slate-600",
                                            }
                                          )}`}
                                        >
                                          {chip.cooldown} GW
                                        </div>
                                      )}{" "}
                                      {chip.seasonLimit && (
                                        <div
                                          className={`px-1.5 py-0.5 rounded ${getThemeStyles(
                                            theme,
                                            {
                                              dark: "bg-slate-700/50 text-slate-300",
                                              light:
                                                "bg-slate-200 text-slate-600",
                                            }
                                          )}`}
                                        >
                                          {chip.remainingUses}/
                                          {chip.seasonLimit}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {/* {chip.strategyTip && (
                                    <div className="bg-slate-700/30 rounded-md p-2 border border-slate-600/30">
                                      <div className="flex items-start gap-2">
                                        <StarIcon className="w-3 h-3 text-yellow-400 mt-0.5 shrink-0" />
                                        <p className="text-slate-300 text-xs leading-relaxed">
                                          {chip.strategyTip}
                                        </p>
                                      </div>
                                    </div>
                                  )} */}
                                </div>{" "}
                                {/* Usage tags - Only shown if used */}{" "}
                                {usageCount > 0 && usages.length > 0 && (
                                  <div className="px-2 pb-1">
                                    <div
                                      className={`text-2xs mb-0.5 ${getThemeStyles(
                                        theme,
                                        {
                                          dark: "text-slate-400",
                                          light: "text-slate-500",
                                        }
                                      )}`}
                                    >
                                      Used on:
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {usages.slice(0, 1).map((usage, idx) => (
                                        <div
                                          key={idx}
                                          className={`rounded px-1.5 py-0.5 text-2xs truncate max-w-full ${getThemeStyles(
                                            theme,
                                            {
                                              dark: "bg-slate-700/50 text-slate-300",
                                              light:
                                                "bg-slate-200 text-slate-600",
                                            }
                                          )}`}
                                        >
                                          {formatFixture(usage.fixture)}
                                        </div>
                                      ))}
                                      {usages.length > 1 && (
                                        <div
                                          className={`rounded px-1.5 py-0.5 text-2xs ${getThemeStyles(
                                            theme,
                                            {
                                              dark: "bg-slate-700/30 text-slate-400",
                                              light:
                                                "bg-slate-100 text-slate-500",
                                            }
                                          )}`}
                                        >
                                          +{usages.length - 1} more
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}{" "}
                                {/* Apply during match prediction button */}{" "}
                                <div
                                  className={`mt-auto border-t ${getThemeStyles(
                                    theme,
                                    {
                                      dark: "border-slate-600/30",
                                      light: "border-slate-200",
                                    }
                                  )}`}
                                >
                                  {chip.available ? (
                                    <div
                                      className={`text-center text-xs px-2 py-1.5 ${getThemeStyles(
                                        theme,
                                        {
                                          dark: "text-slate-400",
                                          light: "text-slate-500",
                                        }
                                      )}`}
                                    >
                                      <span>Use in prediction</span>
                                    </div>
                                  ) : (
                                    <div
                                      className={`text-center text-xs py-1.5 ${getThemeStyles(
                                        theme,
                                        {
                                          dark: "text-slate-500",
                                          light: "text-slate-400",
                                        }
                                      )}`}
                                    >
                                      Not Available
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>{" "}
              {/* Learn more button */}{" "}
              <div className="mt-2 px-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleChipInfoModal();
                  }}
                  className={`ml-auto flex items-center transition-colors font-medium text-sm ${getThemeStyles(
                    theme,
                    {
                      dark: "text-indigo-300 hover:text-indigo-200",
                      light: "text-indigo-600 hover:text-indigo-800",
                    }
                  )}`}
                >
                  <InfoCircledIcon className="mr-1.5 w-4 h-4" />
                  Learn more about chips
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Confirmation Modal with Progress */}
      <AnimatePresence>
        {showConfirmModal && selectedChip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 backdrop-blur-lg z-50 flex items-center justify-center p-4 ${getThemeStyles(
              theme,
              {
                dark: "bg-slate-950/85",
                light: "bg-white/85",
              }
            )}`}
            onClick={() => !isApplying && setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 15 }}
              className={`rounded-xl p-4 max-w-[320px] w-full font-outfit shadow-xl border ${getThemeStyles(
                theme,
                {
                  dark: "bg-gradient-to-b from-slate-800 to-slate-900 border-slate-600/50",
                  light: "bg-white border-slate-200",
                }
              )}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center mb-3">
                <div
                  className={`w-11 h-11 rounded-lg bg-${selectedChip.color}-500/20 flex items-center justify-center mr-2 border border-${selectedChip.color}-500/30`}
                >
                  <span className="text-xl">{selectedChip.icon}</span>
                </div>{" "}
                <div>
                  <h3
                    className={`text-lg font-semibold ${getThemeStyles(
                      theme,
                      text.primary
                    )}`}
                  >
                    Apply {selectedChip.name}?
                  </h3>
                  <p
                    className={`text-sm ${getThemeStyles(
                      theme,
                      text.secondary
                    )}`}
                  >
                    Gameweek {activeGameweek}
                  </p>
                </div>
              </div>{" "}
              
              {/* Description */}
              <div
                className={`rounded-lg p-3 mb-3 border ${getThemeStyles(theme, {
                  dark: "bg-slate-800/60 border-slate-700/50",
                  light: "bg-slate-50 border-slate-200",
                })}`}
              >
                <p
                  className={`text-sm leading-relaxed mb-1.5 ${getThemeStyles(
                    theme,
                    text.secondary
                  )}`}
                >
                  This will apply to{" "}
                  <span
                    className={`font-medium ${getThemeStyles(theme, {
                      dark: "text-teal-300",
                      light: "text-teal-600",
                    })}`}
                  >
                    all pending predictions
                  </span>{" "}
                  in this gameweek.
                </p>
                <p
                  className={`text-xs ${getThemeStyles(theme, {
                    dark: "text-amber-400",
                    light: "text-amber-700",
                  })}`}
                >
                  ⚠️ Cannot be removed once applied
                </p>
              </div>{" "}
              
              {/* Progress indicator */}
              {isApplying && (
                <div
                  className={`rounded-lg p-3 mb-3 border ${getThemeStyles(theme, {
                    dark: "bg-blue-900/20 border-blue-700/30",
                    light: "bg-blue-50 border-blue-200",
                  })}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <UpdateIcon className="w-4 h-4 animate-spin text-blue-400" />
                    <span
                      className={`text-sm font-medium ${getThemeStyles(theme, {
                        dark: "text-blue-300",
                        light: "text-blue-700",
                      })}`}
                    >
                      Applying chip...
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500"
                      initial={{ width: '0%' }}
                      animate={{ 
                        width: applyProgress.total > 0 
                          ? `${(applyProgress.current / applyProgress.total) * 100}%` 
                          : '0%' 
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p
                    className={`text-xs mt-1 text-center ${getThemeStyles(theme, {
                      dark: "text-blue-400",
                      light: "text-blue-600",
                    })}`}
                  >
                    {applyProgress.current} / {applyProgress.total} predictions
                  </p>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isApplying}
                  className={`flex-1 px-3 py-2 border rounded-lg transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${getThemeStyles(
                    theme,
                    {
                      dark: "border-slate-600/50 text-slate-300 hover:text-slate-100 hover:bg-slate-700/30 hover:border-slate-500/50",
                      light:
                        "border-slate-300 text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:border-slate-400",
                    }
                  )}`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmChipApplication}
                  disabled={isApplying}
                  className="flex-1 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all duration-200 text-sm flex items-center justify-center font-medium border border-teal-500/50 hover:border-teal-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplying ? (
                    <>
                      <UpdateIcon className="mr-1.5 w-4 h-4 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="mr-1.5 w-4 h-4" />
                      Apply
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GameweekChipsPanel;
