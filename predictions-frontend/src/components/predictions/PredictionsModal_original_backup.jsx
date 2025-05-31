import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, addMinutes } from "date-fns";
import { ThemeContext } from "../../context/ThemeContext";
import {
  backgrounds,
  text,
  buttons,
  status,
  getThemeStyles,
} from "../../utils/themeUtils";
import {
  StarIcon,
  InfoCircledIcon,
  ClockIcon,
  ChevronRightIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  Cross2Icon,
  LightningBoltIcon,
  TargetIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

import { getTeamLogo } from "../../data/sampleData";

// Array of available player names for each team
const teamPlayers = {
  Arsenal: [
    "Bukayo Saka",
    "Martin Ødegaard",
    "Kai Havertz",
    "Leandro Trossard",
    "Gabriel Martinelli",
    "Gabriel Jesus",
  ],
  Chelsea: [
    "Cole Palmer",
    "Nicolas Jackson",
    "Christopher Nkunku",
    "Raheem Sterling",
    "Enzo Fernandez",
    "Noni Madueke",
  ],
  Liverpool: [
    "Mohamed Salah",
    "Luis Díaz",
    "Darwin Núñez",
    "Diogo Jota",
    "Cody Gakpo",
    "Dominik Szoboszlai",
  ],
  "Man. City": [
    "Erling Haaland",
    "Phil Foden",
    "Kevin De Bruyne",
    "Bernardo Silva",
    "Jack Grealish",
    "Julián Álvarez",
  ],
  "Man. United": [
    "Bruno Fernandes",
    "Marcus Rashford",
    "Rasmus Højlund",
    "Alejandro Garnacho",
    "Mason Mount",
    "Antony",
  ],
  Tottenham: [
    "Son Heung-min",
    "Richarlison",
    "Brennan Johnson",
    "James Maddison",
    "Dejan Kulusevski",
    "Timo Werner",
  ],
};

// Available chips with proper descriptions and icons
const availableChips = [
  {
    id: "doubleDown",
    name: "Double Down",
    description: "Double all points earned from this match",
    icon: "2x",
  },
  {
    id: "wildcard",
    name: "Wildcard",
    description: "Triple all points earned from this match",
    icon: "3x",
  },
  {
    id: "opportunist",
    name: "Opportunist",
    description: "Change predictions up to 30 min before kickoff",
    icon: "⏱️",
  },
  {
    id: "scorerFocus",
    name: "Scorer Focus",
    description: "Double all points from goalscorer predictions",
    icon: "⚽",
  },
];

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

  // Initialize state with initialValues if provided (editing mode)
  const [currentStep, setCurrentStep] = useState(1);
  const [homeScore, setHomeScore] = useState(initialValues?.homeScore || 0);
  const [awayScore, setAwayScore] = useState(initialValues?.awayScore || 0);
  const [homeScorers, setHomeScorers] = useState(
    initialValues?.homeScorers || []
  );
  const [awayScorers, setAwayScorers] = useState(
    initialValues?.awayScorers || []
  );
  const [selectedChips, setSelectedChips] = useState(
    initialValues?.chips || []
  );
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [homeScoreOpen, setHomeScoreOpen] = useState(false);
  const [awayScoreOpen, setAwayScoreOpen] = useState(false);

  // Validate data on step change
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

  // Update scorers arrays when scores change
  useEffect(() => {
    // Update home scorers
    if (homeScore > homeScorers.length) {
      // Add empty scorer slots if score is increased
      setHomeScorers([
        ...homeScorers,
        ...Array(homeScore - homeScorers.length).fill(""),
      ]);
    } else if (homeScore < homeScorers.length) {
      // Remove excess scorer slots if score is decreased
      setHomeScorers(homeScorers.slice(0, homeScore));
    }

    // Update away scorers
    if (awayScore > awayScorers.length) {
      setAwayScorers([
        ...awayScorers,
        ...Array(awayScore - awayScorers.length).fill(""),
      ]);
    } else if (awayScore < awayScorers.length) {
      setAwayScorers(awayScorers.slice(0, awayScore));
    }
  }, [homeScore, awayScore]);

  // handle closing dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Create references to the dropdown buttons if needed
      const homeScoreButton = document.getElementById("home-score-button");
      const awayScoreButton = document.getElementById("away-score-button");

      // Check if click is outside relevant elements
      if (
        homeScoreOpen &&
        event.target !== homeScoreButton &&
        !event.target.closest(".home-score-dropdown")
      ) {
        setHomeScoreOpen(false);
      }

      if (
        awayScoreOpen &&
        event.target !== awayScoreButton &&
        !event.target.closest(".away-score-dropdown")
      ) {
        setAwayScoreOpen(false);
      }
    };

    // Add event listener only if dropdowns are open
    if (homeScoreOpen || awayScoreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [homeScoreOpen, awayScoreOpen]);

  // Toggle chip selection
  const toggleChip = (chipId) => {
    if (selectedChips.includes(chipId)) {
      setSelectedChips(selectedChips.filter((id) => id !== chipId));
    } else {
      // Only allow up to 2 chips
      if (selectedChips.length < 2) {
        setSelectedChips([...selectedChips, chipId]);
      }
    }
  };

  // Update scorer at specific index
  const updateHomeScorer = (index, name) => {
    const newScorers = [...homeScorers];
    newScorers[index] = name;
    setHomeScorers(newScorers);

    // Clear error if all scorers are filled
    if (!newScorers.some((scorer) => !scorer)) {
      setErrors({ ...errors, homeScorers: undefined });
    }
  };

  const updateAwayScorer = (index, name) => {
    const newScorers = [...awayScorers];
    newScorers[index] = name;
    setAwayScorers(newScorers);

    // Clear error if all scorers are filled
    if (!newScorers.some((scorer) => !scorer)) {
      setErrors({ ...errors, awayScorers: undefined });
    }
  };

  // Navigate to next step if validation passes
  const nextStep = () => {
    if (currentStep === 2) {
      // Validate before moving to step 3
      const newErrors = {};

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

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setCurrentStep((prevStep) => prevStep + 1);
  };

  // Go back to previous step
  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(1, prevStep - 1));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Create the updated prediction object
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
        // In a real app, would submit to backend here
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

  const modalTitle = isEditing ? "Edit Prediction" : "Make Prediction";
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
          <p className={`${getThemeStyles(theme, text.secondary)} font-outfit`}>
            No fixture selected
          </p>
        </div>
      </div>
    );
  }

  const matchDate = parseISO(fixture.date);
  const formattedDate = format(matchDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(matchDate, "h:mm a");
  const deadlineTime = addMinutes(matchDate, -45);
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
        transition={{ type: "spring", damping: 15 }}
        className={`${getThemeStyles(theme, {
          dark: "bg-slate-900/95 border-slate-700/60",
          light: "bg-white/95 border-slate-200/60",
        })} border rounded-xl relative max-h-[85vh] md:max-h-[90vh] md:max-w-3xl mx-auto flex flex-col overflow-hidden shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        {/* Status indicator bar */}
        <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full"></div>{" "}
        {/* Confirmation overlay */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              className={`absolute inset-0 ${getThemeStyles(
                theme,
                backgrounds.card
              )} backdrop-blur-lg rounded-xl flex flex-col justify-center items-center text-center z-20`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {" "}
              <div
                className={`rounded-full ${getThemeStyles(
                  theme,
                  status.success.bg
                )} border ${getThemeStyles(
                  theme,
                  status.success.border
                )} p-4 mb-4`}
              >
                <CheckIcon
                  className={`w-8 h-8 ${getThemeStyles(
                    theme,
                    status.success.text
                  )}`}
                />
              </div>
              <h3
                className={`${getThemeStyles(
                  theme,
                  text.primary
                )} text-4xl font-bold mb-2 font-outfit`}
              >
                Prediction Submitted!
              </h3>
              <p className={`${getThemeStyles(theme, text.muted)} font-outfit`}>
                Your prediction for {fixture.homeTeam} vs {fixture.awayTeam} has
                been recorded
              </p>
            </motion.div>
          )}
        </AnimatePresence>{" "}
        {/* Header section - fixed at top */}
        <div
          className={`p-4 ${getThemeStyles(
            theme,
            backgrounds.secondary
          )} border-b relative`}
        >
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-lg ${getThemeStyles(
              theme,
              buttons.outline
            )} transition-all duration-200 border`}
            aria-label="Close"
          >
            <Cross2Icon className="w-4 h-4" />
          </motion.button>

          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-12 h-12 rounded-xl ${getThemeStyles(
                theme,
                status.info.bg
              )} flex items-center justify-center border ${getThemeStyles(
                theme,
                status.info.border
              )}`}
            >
              <TargetIcon
                className={`w-6 h-6 ${getThemeStyles(theme, status.info.text)}`}
              />
            </div>{" "}
            <div>
              <h2
                className={`${getThemeStyles(
                  theme,
                  text.primary
                )} text-2xl font-bold font-outfit`}
              >
                {modalTitle}
              </h2>
              <p
                className={`${getThemeStyles(
                  theme,
                  text.muted
                )} text-sm font-outfit`}
              >
                {formattedDate} • {formattedTime}
              </p>
            </div>
          </div>

          <div className="bg-amber-500/20 text-amber-300 text-xs rounded-lg px-3 py-2 flex items-center border border-amber-500/30 font-outfit">
            <ClockIcon className="mr-2 w-4 h-4" />
            Prediction deadline: {format(deadlineTime, "MMM d, h:mm a")}
          </div>
        </div>{" "}
        {/* Step indicator */}
        <div
          className={`px-4 py-3 ${getThemeStyles(theme, {
            dark: "bg-slate-800/30 border-slate-700/60",
            light: "bg-slate-50/30 border-slate-200/60",
          })} border-b font-outfit`}
        >
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    currentStep >= 1
                      ? "bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/25"
                      : "bg-slate-700/70 text-slate-400"
                  }`}
                >
                  1
                </div>{" "}
                <div
                  className={`text-sm ml-3 transition-colors ${
                    currentStep === 1
                      ? getThemeStyles(theme, status.success.text) +
                        " font-medium"
                      : getThemeStyles(theme, text.muted)
                  }`}
                >
                  Score Prediction
                </div>
              </div>

              <div
                className={`w-12 h-0.5 rounded-full transition-colors ${
                  currentStep > 1 ? "bg-emerald-500/70" : "bg-slate-600/50"
                }`}
              ></div>

              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    currentStep >= 2
                      ? "bg-blue-500 text-slate-900 shadow-lg shadow-blue-500/25"
                      : "bg-slate-700/70 text-slate-400"
                  }`}
                >
                  2
                </div>{" "}
                <div
                  className={`text-sm ml-3 transition-colors ${
                    currentStep === 2
                      ? getThemeStyles(theme, status.info.text) + " font-medium"
                      : getThemeStyles(theme, text.muted)
                  }`}
                >
                  Goalscorers & Chips
                </div>
              </div>

              <div
                className={`w-12 h-0.5 rounded-full transition-colors ${
                  currentStep > 2 ? "bg-blue-500/70" : "bg-slate-600/50"
                }`}
              ></div>

              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    currentStep >= 3
                      ? "bg-purple-500 text-slate-900 shadow-lg shadow-purple-500/25"
                      : "bg-slate-700/70 text-slate-400"
                  }`}
                >
                  3
                </div>
                <div
                  className={`text-sm ml-3 transition-colors ${
                    currentStep === 3
                      ? "text-purple-300 font-medium"
                      : "text-slate-400"
                  }`}
                >
                  Review & Submit
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Scrollable content area */}
        <div className="overflow-y-auto flex-1 p-4">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Score */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="pb-4"
                >
                  {" "}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      {" "}
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                        <RocketIcon
                          className={`w-5 h-5 ${getThemeStyles(theme, {
                            dark: "text-emerald-400",
                            light: "text-emerald-600",
                          })}`}
                        />
                      </div>{" "}
                      <h3
                        className={`${getThemeStyles(
                          theme,
                          text.primary
                        )} text-xl font-bold font-outfit`}
                      >
                        Predict the scoreline
                      </h3>
                    </div>{" "}
                    {/* Match details */}{" "}
                    <div
                      className={`${getThemeStyles(theme, {
                        dark: "bg-slate-800/50 border-slate-700/60",
                        light: "bg-slate-50/50 border-slate-200/60",
                      })} border rounded-xl p-5`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        {" "}
                        <div
                          className={`${getThemeStyles(
                            theme,
                            text.muted
                          )} text-xs font-outfit`}
                        >
                          Premier League • GW{fixture.gameweek}
                        </div>{" "}
                        <div
                          className={`${getThemeStyles(
                            theme,
                            text.muted
                          )} text-xs font-outfit`}
                        >
                          {fixture.venue}
                        </div>
                      </div>

                      {/* Score prediction section */}
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col items-center w-5/12">
                          <div className="w-16 h-16 p-1 bg-slate-700/30 border border-slate-600/50 rounded-full mb-3 flex items-center justify-center">
                            <img
                              src={getTeamLogo(fixture.homeTeam)}
                              alt={fixture.homeTeam}
                              className="w-12 h-12 object-contain"
                            />
                          </div>{" "}
                          <span
                            className={`${getThemeStyles(theme, {
                              dark: "text-slate-200",
                              light: "text-slate-800",
                            })} font-outfit text-sm text-center mb-3 font-medium`}
                          >
                            {fixture.homeTeam}
                          </span>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max="9"
                              value={homeScore === 0 ? "" : homeScore}
                              onChange={(e) => {
                                const val = e.target.value;
                                // If empty, set to 0, otherwise set to the parsed integer
                                setHomeScore(
                                  val === ""
                                    ? 0
                                    : Math.min(
                                        9,
                                        Math.max(0, parseInt(val) || 0)
                                      )
                                );
                              }}
                              className={`appearance-none ${getThemeStyles(
                                theme,
                                {
                                  dark: "bg-slate-800/80 border-slate-600/50 text-slate-100",
                                  light:
                                    "bg-white/80 border-slate-300/50 text-slate-900",
                                }
                              )} border rounded-lg w-16 h-14 text-2xl text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                              aria-label={`${fixture.homeTeam} score`}
                              placeholder="0"
                            />
                          </div>
                        </div>{" "}
                        <div
                          className={`${getThemeStyles(
                            theme,
                            text.muted
                          )} text-base font-outfit font-medium`}
                        >
                          vs
                        </div>
                        <div className="flex flex-col items-center w-5/12">
                          <div className="w-16 h-16 p-1 bg-slate-700/30 border border-slate-600/50 rounded-full mb-3 flex items-center justify-center">
                            <img
                              src={getTeamLogo(fixture.awayTeam)}
                              alt={fixture.awayTeam}
                              className="w-12 h-12 object-contain"
                            />
                          </div>{" "}
                          <span
                            className={`${getThemeStyles(theme, {
                              dark: "text-slate-200",
                              light: "text-slate-800",
                            })} font-outfit text-sm text-center mb-3 font-medium`}
                          >
                            {fixture.awayTeam}
                          </span>
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              max="9"
                              value={awayScore === 0 ? "" : awayScore}
                              onChange={(e) => {
                                const val = e.target.value;
                                // If empty, set to 0, otherwise set to the parsed integer
                                setAwayScore(
                                  val === ""
                                    ? 0
                                    : Math.min(
                                        9,
                                        Math.max(0, parseInt(val) || 0)
                                      )
                                );
                              }}
                              className={`appearance-none ${getThemeStyles(
                                theme,
                                {
                                  dark: "bg-slate-800/80 border-slate-600/50 text-slate-100",
                                  light:
                                    "bg-white/80 border-slate-300/50 text-slate-900",
                                }
                              )} border rounded-lg w-16 h-14 text-2xl text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                              aria-label={`${fixture.awayTeam} score`}
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  {/* Community insights */}{" "}
                  <div
                    className={`${getThemeStyles(theme, {
                      dark: "bg-slate-800/40 border-slate-700/60",
                      light: "bg-slate-50/40 border-slate-200/60",
                    })} border rounded-xl p-4 mb-6 font-outfit`}
                  >
                    {" "}
                    <h3
                      className={`${getThemeStyles(theme, {
                        dark: "text-slate-200",
                        light: "text-slate-800",
                      })} text-sm font-medium mb-3 flex items-center`}
                    >
                      <StarIcon className="mr-2 text-purple-400" /> Community
                      Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="flex flex-col">
                        {" "}
                        <span
                          className={`${getThemeStyles(
                            theme,
                            text.muted
                          )} text-xs mb-1`}
                        >
                          Most predicted score
                        </span>{" "}
                        <span
                          className={`${getThemeStyles(theme, {
                            dark: "text-slate-200",
                            light: "text-slate-800",
                          })} font-outfit font-medium`}
                        >
                          2-1
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-slate-600"
                          } text-xs mb-1`}
                        >
                          Community sentiment
                        </span>{" "}
                        <div className="flex items-center gap-2">
                          <div
                            className={`${
                              theme === "dark"
                                ? "bg-slate-700/40"
                                : "bg-slate-200/40"
                            } h-2 rounded-full flex-1`}
                          >
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: "75%" }}
                            ></div>
                          </div>
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-slate-200"
                                : "text-slate-800"
                            } font-outfit text-sm`}
                          >
                            75%
                          </span>
                        </div>
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-slate-300"
                              : "text-slate-700"
                          } text-xs mt-1`}
                        >
                          {fixture.homeTeam} win
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-slate-600"
                          } text-xs mb-1`}
                        >
                          Popular goalscorers
                        </span>
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-slate-200"
                              : "text-slate-800"
                          } font-outfit text-sm`}
                        >
                          Saka, Kane
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {/* Step 2: Goalscorers */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {" "}
                  {/* Add scoreline summary */}
                  <div
                    className={`${
                      theme === "dark"
                        ? "bg-slate-800/50 border-slate-700/60"
                        : "bg-slate-50/50 border-slate-200/60"
                    } border rounded-xl p-4 mb-6 font-outfit`}
                  >
                    <div
                      className={`${
                        theme === "dark" ? "text-slate-300" : "text-slate-700"
                      } text-sm font-medium mb-3 text-center`}
                    >
                      Your predicted score
                    </div>
                    <div className="flex justify-center items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-700/30 border border-slate-600/50 flex items-center justify-center mr-2">
                          <img
                            src={getTeamLogo(fixture.homeTeam)}
                            alt={fixture.homeTeam}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-slate-200"
                              : "text-slate-800"
                          } font-outfit text-sm mr-2 font-medium`}
                        >
                          {fixture.homeTeam}
                        </span>
                      </div>{" "}
                      <div className="flex items-center justify-center bg-blue-500/20 border border-blue-500/30 rounded-lg px-3">
                        {" "}
                        <span
                          className={`${
                            theme === "dark"
                              ? "bg-slate-800/60"
                              : "bg-slate-200/60"
                          } rounded-l-md py-2 px-4 text-2xl font-bold ${
                            theme === "dark"
                              ? "text-emerald-300"
                              : "text-emerald-700"
                          }`}
                        >
                          {homeScore}
                        </span>
                        <span
                          className={`px-2 ${
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-slate-600"
                          }`}
                        >
                          -
                        </span>{" "}
                        <span
                          className={`${
                            theme === "dark"
                              ? "bg-slate-800/60"
                              : "bg-slate-200/60"
                          } rounded-r-md py-2 px-4 text-2xl font-bold ${
                            theme === "dark" ? "text-blue-300" : "text-blue-700"
                          }`}
                        >
                          {awayScore}
                        </span>
                      </div>
                      <div className="flex items-center ml-3">
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-slate-200"
                              : "text-slate-800"
                          } font-outfit text-sm mr-2 font-medium`}
                        >
                          {fixture.awayTeam}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-700/30 border border-slate-600/50 flex items-center justify-center">
                          <img
                            src={getTeamLogo(fixture.awayTeam)}
                            alt={fixture.awayTeam}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Rest of step 2 content */}
                  <div className="mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                          <TargetIcon className="w-5 h-5 text-blue-400" />
                        </div>{" "}
                        <h3
                          className={`${
                            theme === "dark"
                              ? "text-slate-100"
                              : "text-slate-900"
                          } text-xl font-bold font-outfit`}
                        >
                          Goalscorers
                        </h3>
                      </div>

                      {homeScore > 0 || awayScore > 0 ? (
                        <div className="mt-4">
                          {/* Use grid to place home and away side-by-side */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {" "}
                            {/* Home team scorers */}
                            {homeScore > 0 && (
                              <div
                                className={`${
                                  theme === "dark"
                                    ? "bg-slate-800/50"
                                    : "bg-slate-50/50"
                                } border rounded-xl overflow-hidden transition-all font-outfit ${
                                  errors.homeScorers
                                    ? "border-red-500/70 ring-1 ring-red-500/30"
                                    : "border-emerald-500/30"
                                }`}
                              >
                                {/* Home team scorer content (unchanged) */}
                                <div className="px-3 py-2 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center">
                                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 p-0.5 flex items-center justify-center mr-2">
                                    <img
                                      src={getTeamLogo(fixture.homeTeam)}
                                      alt={fixture.homeTeam}
                                      className="w-4 h-4 object-contain"
                                    />
                                  </div>{" "}
                                  <div
                                    className={`text-sm font-medium ${
                                      theme === "dark"
                                        ? "text-emerald-300"
                                        : "text-emerald-700"
                                    }`}
                                  >
                                    {fixture.homeTeam}
                                  </div>
                                </div>

                                {errors.homeScorers && (
                                  <div className="bg-red-900/20 px-3 py-2 text-xs text-red-300 flex items-center">
                                    <ExclamationTriangleIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                                    <span>{errors.homeScorers}</span>
                                  </div>
                                )}

                                <div className="p-3 space-y-2">
                                  {homeScorers.map((scorer, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2"
                                    >
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                                          scorer
                                            ? "bg-emerald-500/70 text-slate-900 shadow-sm shadow-emerald-500/30"
                                            : "bg-slate-700/40 text-slate-400"
                                        }`}
                                      >
                                        {index + 1}
                                      </div>

                                      <div className="relative flex-1">
                                        <select
                                          value={scorer}
                                          onChange={(e) =>
                                            updateHomeScorer(
                                              index,
                                              e.target.value
                                            )
                                          }
                                          className={`appearance-none w-full rounded-lg text-sm px-3 py-2 pr-8 focus:outline-none transition-all ${
                                            scorer
                                              ? theme === "dark"
                                                ? "bg-slate-700/50 border border-emerald-500/40 text-slate-200"
                                                : "bg-slate-50/50 border border-emerald-500/40 text-slate-800"
                                              : theme === "dark"
                                              ? "bg-slate-800/50 border border-red-500/30 text-slate-400"
                                              : "bg-slate-100/50 border border-red-500/30 text-slate-600"
                                          }`}
                                        >
                                          <option
                                            value=""
                                            className={`${
                                              theme === "dark"
                                                ? "bg-slate-800"
                                                : "bg-white"
                                            }`}
                                          >
                                            Select player...
                                          </option>
                                          {teamPlayers[fixture.homeTeam]?.map(
                                            (player) => (
                                              <option
                                                key={player}
                                                value={player}
                                                className={`${
                                                  theme === "dark"
                                                    ? "bg-slate-800"
                                                    : "bg-white"
                                                }`}
                                              >
                                                {player}
                                              </option>
                                            )
                                          )}
                                        </select>
                                        <ChevronRightIcon
                                          className={`pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 ${
                                            theme === "dark"
                                              ? "text-slate-400"
                                              : "text-slate-600"
                                          }`}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* Away team scorers */}
                            {awayScore > 0 && (
                              <div
                                className={`${
                                  theme === "dark"
                                    ? "bg-slate-800/50"
                                    : "bg-slate-50/50"
                                } border rounded-xl overflow-hidden transition-all font-outfit ${
                                  errors.awayScorers
                                    ? "border-red-500/70 ring-1 ring-red-500/30"
                                    : "border-blue-500/30"
                                }`}
                              >
                                {/* Away team scorer content (unchanged) */}
                                <div className="px-3 py-2 bg-blue-500/10 border-b border-blue-500/20 flex items-center">
                                  <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 p-0.5 flex items-center justify-center mr-2">
                                    <img
                                      src={getTeamLogo(fixture.awayTeam)}
                                      alt={fixture.awayTeam}
                                      className="w-4 h-4 object-contain"
                                    />
                                  </div>{" "}
                                  <div
                                    className={`text-sm font-medium ${
                                      theme === "dark"
                                        ? "text-blue-300"
                                        : "text-blue-700"
                                    }`}
                                  >
                                    {fixture.awayTeam}
                                  </div>
                                </div>

                                {errors.awayScorers && (
                                  <div
                                    className={`${
                                      theme === "dark"
                                        ? "bg-red-900/20 text-red-300"
                                        : "bg-red-50 text-red-600"
                                    } px-3 py-2 text-xs flex items-center`}
                                  >
                                    <ExclamationTriangleIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                                    <span>{errors.awayScorers}</span>
                                  </div>
                                )}

                                <div className="p-3 space-y-2">
                                  {awayScorers.map((scorer, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2"
                                    >
                                      {" "}
                                      <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                                          scorer
                                            ? "bg-blue-500/70 text-slate-900 shadow-sm shadow-blue-500/30"
                                            : theme === "dark"
                                            ? "bg-slate-700/40 text-slate-400"
                                            : "bg-slate-200/40 text-slate-600"
                                        }`}
                                      >
                                        {index + 1}
                                      </div>
                                      <div className="relative flex-1">
                                        {" "}
                                        <select
                                          value={scorer}
                                          onChange={(e) =>
                                            updateAwayScorer(
                                              index,
                                              e.target.value
                                            )
                                          }
                                          className={`appearance-none w-full rounded-lg text-sm px-3 py-2 pr-8 focus:outline-none transition-all ${
                                            scorer
                                              ? theme === "dark"
                                                ? "bg-slate-700/50 border border-blue-500/40 text-slate-200"
                                                : "bg-slate-50/50 border border-blue-500/40 text-slate-800"
                                              : theme === "dark"
                                              ? "bg-slate-800/50 border border-red-500/30 text-slate-400"
                                              : "bg-slate-100/50 border border-red-500/30 text-slate-600"
                                          }`}
                                        >
                                          <option
                                            value=""
                                            className={`${
                                              theme === "dark"
                                                ? "bg-slate-800"
                                                : "bg-white"
                                            }`}
                                          >
                                            Select player...
                                          </option>{" "}
                                          {teamPlayers[fixture.awayTeam]?.map(
                                            (player) => (
                                              <option
                                                key={player}
                                                value={player}
                                                className={`${
                                                  theme === "dark"
                                                    ? "bg-slate-800"
                                                    : "bg-white"
                                                }`}
                                              >
                                                {player}
                                              </option>
                                            )
                                          )}
                                        </select>
                                        <ChevronRightIcon
                                          className={`pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 ${
                                            theme === "dark"
                                              ? "text-slate-400"
                                              : "text-slate-600"
                                          }`}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`font-outfit rounded-xl py-4 px-5 text-center border border-dashed ${
                            theme === "dark"
                              ? "border-slate-600/50 bg-slate-800/30"
                              : "border-slate-300/50 bg-slate-50/30"
                          } flex flex-col items-center mt-4`}
                        >
                          <p
                            className={`${
                              theme === "dark"
                                ? "text-slate-200"
                                : "text-slate-800"
                            } text-md font-medium`}
                          >
                            Scoreless draw predicted
                          </p>
                          <p
                            className={`${
                              theme === "dark"
                                ? "text-slate-400"
                                : "text-slate-600"
                            } text-sm mt-1`}
                          >
                            No goalscorers needed
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Chips section */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                        <LightningBoltIcon className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex items-center justify-between w-full">
                        {" "}
                        <h3
                          className={`${
                            theme === "dark"
                              ? "text-slate-100"
                              : "text-slate-900"
                          } text-xl font-bold font-outfit`}
                        >
                          Match Chips
                        </h3>
                        <span className="text-purple-300 text-xs bg-purple-500/20 border border-purple-500/30 rounded-full px-3 py-1 font-medium">
                          {selectedChips.length}/2
                        </span>
                      </div>
                    </div>{" "}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {availableChips.map((chip) => {
                        // Define chip colors with modern styling
                        const chipColors = {
                          doubleDown: {
                            bg: "emerald",
                            border: "emerald",
                            text: "emerald",
                          },
                          wildcard: {
                            bg: "purple",
                            border: "purple",
                            text: "purple",
                          },
                          opportunist: {
                            bg: "amber",
                            border: "amber",
                            text: "amber",
                          },
                          scorerFocus: {
                            bg: "cyan",
                            border: "cyan",
                            text: "cyan",
                          },
                        };
                        const colors = chipColors[chip.id];

                        return (
                          <motion.button
                            key={chip.id}
                            type="button"
                            onClick={() => toggleChip(chip.id)}
                            disabled={
                              !selectedChips.includes(chip.id) &&
                              selectedChips.length >= 2
                            }
                            whileHover={{
                              scale:
                                selectedChips.length >= 2 &&
                                !selectedChips.includes(chip.id)
                                  ? 1
                                  : 1.02,
                            }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative flex items-center rounded-xl border p-3 transition-all duration-200 ${
                              selectedChips.includes(chip.id)
                                ? `border-${colors.border}-400/60 bg-${colors.bg}-500/10 shadow-lg shadow-${colors.bg}-500/10`
                                : selectedChips.length >= 2
                                ? theme === "dark"
                                  ? "border-slate-600/30 bg-slate-800/20 opacity-50 cursor-not-allowed"
                                  : "border-slate-300/30 bg-slate-100/20 opacity-50 cursor-not-allowed"
                                : theme === "dark"
                                ? "border-slate-600/40 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500/60"
                                : "border-slate-300/40 bg-slate-50/30 hover:bg-slate-100/50 hover:border-slate-400/60"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 border ${
                                selectedChips.includes(chip.id)
                                  ? `bg-${colors.bg}-500/20 text-${colors.text}-300 border-${colors.border}-500/30`
                                  : theme === "dark"
                                  ? "bg-slate-700/30 text-slate-400 border-slate-600/40"
                                  : "bg-slate-200/30 text-slate-600 border-slate-300/40"
                              }`}
                            >
                              <span className="text-lg">{chip.icon}</span>
                            </div>

                            <div className="flex-1 text-left">
                              <div
                                className={`text-sm font-medium transition-colors ${
                                  selectedChips.includes(chip.id)
                                    ? `text-${colors.text}-300`
                                    : theme === "dark"
                                    ? "text-slate-200"
                                    : "text-slate-800"
                                }`}
                              >
                                {chip.name}
                              </div>
                            </div>

                            {selectedChips.includes(chip.id) && (
                              <div
                                className={`w-6 h-6 rounded-full bg-${colors.bg}-500/20 border border-${colors.border}-500/30 flex items-center justify-center ml-2`}
                              >
                                <CheckIcon
                                  className={`w-3 h-3 text-${colors.text}-300`}
                                />
                              </div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                    {/* <div className="flex items-center p-3 bg-slate-800/40 border border-slate-700/60 rounded-lg text-xs text-slate-300 mb-4">
                      <InfoCircledIcon className="mr-2 w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span>
                        Match chips only apply to this specific prediction
                      </span>
                    </div> */}
                    {/* Learn More About Chips link - Add this after the chips grid */}
                    <div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleChipInfoModal();
                        }}
                        className={`${
                          theme === "dark"
                            ? "text-purple-300 hover:text-purple-200"
                            : "text-purple-600 hover:text-purple-700"
                        } text-sm flex items-center transition-colors font-medium`}
                      >
                        <InfoCircledIcon className="mr-2 w-4 h-4" />
                        Learn more about all available chips
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}{" "}
              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pb-4"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                      <CheckIcon className="w-5 h-5 text-purple-400" />
                    </div>{" "}
                    <h3
                      className={`${
                        theme === "dark" ? "text-slate-100" : "text-slate-900"
                      } text-xl font-bold font-outfit`}
                    >
                      Review & Submit
                    </h3>
                  </div>{" "}
                  {/* Score summary */}
                  <div
                    className={`${
                      theme === "dark"
                        ? "bg-slate-800/50 border-slate-700/60"
                        : "bg-slate-50/50 border-slate-200/60"
                    } border rounded-xl p-4 mb-4 font-outfit`}
                  >
                    <div
                      className={`${
                        theme === "dark" ? "text-slate-300" : "text-slate-700"
                      } text-sm font-medium mb-3 text-center`}
                    >
                      Your predicted score
                    </div>{" "}
                    <div className="flex justify-center items-center">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full ${
                            theme === "dark"
                              ? "bg-slate-700/30 border-slate-600/50"
                              : "bg-slate-200/30 border-slate-300/50"
                          } border flex items-center justify-center mr-2`}
                        >
                          <img
                            src={getTeamLogo(fixture.homeTeam)}
                            alt={fixture.homeTeam}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-slate-200"
                              : "text-slate-800"
                          } font-outfit text-sm mr-3 font-medium`}
                        >
                          {fixture.homeTeam}
                        </span>
                      </div>
                      <div className="flex items-center justify-center bg-purple-500/20 border border-purple-500/30 rounded-lg px-3">
                        <span
                          className={`${
                            theme === "dark"
                              ? "bg-slate-800/60"
                              : "bg-slate-100/60"
                          } rounded-l-md py-2 px-4 text-purple-300 text-2xl font-bold`}
                        >
                          {homeScore}
                        </span>
                        <span
                          className={`px-2 ${
                            theme === "dark"
                              ? "text-slate-400"
                              : "text-slate-600"
                          }`}
                        >
                          -
                        </span>
                        <span
                          className={`${
                            theme === "dark"
                              ? "bg-slate-800/60"
                              : "bg-slate-100/60"
                          } rounded-r-md py-2 px-4 text-purple-300 text-2xl font-bold`}
                        >
                          {awayScore}
                        </span>
                      </div>
                      <div className="flex items-center ml-3">
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-slate-200"
                              : "text-slate-800"
                          } font-outfit text-sm mr-2 font-medium`}
                        >
                          {fixture.awayTeam}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-full ${
                            theme === "dark"
                              ? "bg-slate-700/30 border-slate-600/50"
                              : "bg-slate-200/30 border-slate-300/50"
                          } border flex items-center justify-center`}
                        >
                          <img
                            src={getTeamLogo(fixture.awayTeam)}
                            alt={fixture.awayTeam}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                  {/* Goalscorers summary */}{" "}
                  {(homeScore > 0 || awayScore > 0) && (
                    <div
                      className={`${
                        theme === "dark"
                          ? "bg-slate-800/50 border-slate-700/60"
                          : "bg-slate-50/50 border-slate-200/60"
                      } border rounded-xl p-4 mb-4 font-outfit`}
                    >
                      <h4
                        className={`${
                          theme === "dark" ? "text-slate-200" : "text-slate-800"
                        } text-sm font-medium mb-3 flex items-center`}
                      >
                        <TargetIcon className="mr-2 w-4 h-4 text-emerald-400" />
                        Predicted Goalscorers
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homeScore > 0 && (
                          <div className="space-y-2">
                            <div
                              className={`text-xs font-medium mb-2 flex items-center ${
                                theme === "dark"
                                  ? "text-emerald-300"
                                  : "text-emerald-700"
                              }`}
                            >
                              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 p-0.5 flex items-center justify-center mr-1.5">
                                <img
                                  src={getTeamLogo(fixture.homeTeam)}
                                  alt={fixture.homeTeam}
                                  className="w-2.5 h-2.5 object-contain"
                                />
                              </div>
                              {fixture.homeTeam}
                            </div>{" "}
                            {homeScorers.map((scorer, index) => (
                              <div
                                key={index}
                                className={`flex items-center ${
                                  theme === "dark"
                                    ? "bg-slate-700/40"
                                    : "bg-slate-100/40"
                                } border border-emerald-500/20 rounded-lg px-3 py-2`}
                              >
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center bg-emerald-500/20 border border-emerald-500/30 mr-2 text-xs font-medium ${
                                    theme === "dark"
                                      ? "text-emerald-300"
                                      : "text-emerald-700"
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                <span
                                  className={`${
                                    theme === "dark"
                                      ? "text-slate-200"
                                      : "text-slate-800"
                                  } text-sm font-medium`}
                                >
                                  {scorer}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {awayScore > 0 && (
                          <div className="space-y-2">
                            <div
                              className={`text-xs font-medium mb-2 flex items-center ${
                                theme === "dark"
                                  ? "text-blue-300"
                                  : "text-blue-700"
                              }`}
                            >
                              <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-500/30 p-0.5 flex items-center justify-center mr-1.5">
                                <img
                                  src={getTeamLogo(fixture.awayTeam)}
                                  alt={fixture.awayTeam}
                                  className="w-2.5 h-2.5 object-contain"
                                />
                              </div>
                              {fixture.awayTeam}
                            </div>{" "}
                            {awayScorers.map((scorer, index) => (
                              <div
                                key={index}
                                className={`flex items-center ${
                                  theme === "dark"
                                    ? "bg-slate-700/40"
                                    : "bg-slate-100/40"
                                } border border-blue-500/20 rounded-lg px-3 py-2`}
                              >
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center bg-blue-500/20 border border-blue-500/30 mr-2 text-xs font-medium ${
                                    theme === "dark"
                                      ? "text-blue-300"
                                      : "text-blue-700"
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                <span
                                  className={`${
                                    theme === "dark"
                                      ? "text-slate-200"
                                      : "text-slate-800"
                                  } text-sm font-medium`}
                                >
                                  {scorer}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}{" "}
                  {/* Selected chips summary */}{" "}
                  <div
                    className={`${
                      theme === "dark"
                        ? "bg-slate-800/50 border-slate-700/60"
                        : "bg-slate-50/50 border-slate-200/60"
                    } border rounded-xl p-4 mb-4 font-outfit`}
                  >
                    <h4
                      className={`${
                        theme === "dark" ? "text-slate-200" : "text-slate-800"
                      } text-sm font-medium mb-3 flex items-center`}
                    >
                      <LightningBoltIcon className="mr-2 w-4 h-4 text-purple-400" />
                      Selected Match Chips
                    </h4>

                    {selectedChips.length === 0 ? (
                      <div
                        className={`${
                          theme === "dark"
                            ? "text-slate-400 bg-slate-700/30"
                            : "text-slate-600 bg-slate-100/30"
                        } text-sm py-2 px-3 rounded-lg text-center`}
                      >
                        No chips selected for this match
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedChips.map((chipId) => {
                          const chip = availableChips.find(
                            (c) => c.id === chipId
                          ); // Define chip colors
                          const chipColors = {
                            doubleDown: { bg: "emerald", text: "emerald" },
                            wildcard: { bg: "purple", text: "purple" },
                            opportunist: { bg: "amber", text: "amber" },
                            scorerFocus: { bg: "sky", text: "sky" },
                          };
                          const colors = chipColors[chipId] || {
                            bg: "blue",
                            text: "blue",
                          };

                          return (
                            <div
                              key={chipId}
                              className={`flex items-center ${
                                theme === "dark"
                                  ? "bg-slate-700/40"
                                  : "bg-slate-100/40"
                              } border border-${
                                colors.bg
                              }-500/20 rounded-lg px-3 py-2.5`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${colors.bg}-500/20 border border-${colors.bg}-500/30 mr-3 text-lg`}
                              >
                                {chip?.icon}
                              </div>
                              <div className="flex-1">
                                <div
                                  className={`text-${colors.text}-300 text-sm font-medium`}
                                >
                                  {chip?.name}
                                </div>
                                <div
                                  className={`${
                                    theme === "dark"
                                      ? "text-slate-400"
                                      : "text-slate-600"
                                  } text-xs leading-relaxed`}
                                >
                                  {chip?.description}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>{" "}
                  {/* Gameweek chips section */}{" "}
                  {activeGameweekChips.length > 0 && (
                    <div
                      className={`${
                        theme === "dark"
                          ? "bg-slate-800/50 border-slate-700/60"
                          : "bg-slate-50/50 border-slate-200/60"
                      } border rounded-xl p-4 mb-4 font-outfit`}
                    >
                      <h4
                        className={`${
                          theme === "dark" ? "text-slate-200" : "text-slate-800"
                        } text-sm font-medium mb-3 flex items-center`}
                      >
                        <RocketIcon className="mr-2 w-4 h-4 text-blue-400" />
                        Active Gameweek Chips
                      </h4>

                      <div className="space-y-2">
                        {activeGameweekChips.includes("defensePlusPlus") && (
                          <div
                            className={`flex items-center ${
                              theme === "dark"
                                ? "bg-slate-700/40"
                                : "bg-slate-100/40"
                            } border border-blue-500/20 rounded-lg px-3 py-2.5`}
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/20 border border-blue-500/30 mr-3 text-lg">
                              🛡️
                            </div>
                            <div className="flex-1">
                              {" "}
                              <div
                                className={`text-sm font-medium ${
                                  theme === "dark"
                                    ? "text-blue-300"
                                    : "text-blue-700"
                                }`}
                              >
                                Defense++
                              </div>
                              <div
                                className={`${
                                  theme === "dark"
                                    ? "text-slate-400"
                                    : "text-slate-600"
                                } text-xs leading-relaxed`}
                              >
                                Applied to all predictions this gameweek
                              </div>
                            </div>
                          </div>
                        )}

                        {activeGameweekChips.includes("allInWeek") && (
                          <div
                            className={`flex items-center ${
                              theme === "dark"
                                ? "bg-slate-700/40"
                                : "bg-slate-100/40"
                            } border border-red-500/20 rounded-lg px-3 py-2.5`}
                          >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/20 border border-red-500/30 mr-3 text-lg">
                              🎯
                            </div>
                            <div className="flex-1">
                              <div className="text-red-300 text-sm font-medium">
                                All-In Week
                              </div>
                              <div
                                className={`${
                                  theme === "dark"
                                    ? "text-slate-400"
                                    : "text-slate-600"
                                } text-xs leading-relaxed`}
                              >
                                All gameweek points doubled
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}{" "}
                  {/* Points potential */}{" "}
                  <div
                    className={`${
                      theme === "dark"
                        ? "bg-slate-800/50 border-slate-700/60"
                        : "bg-slate-50/50 border-slate-200/60"
                    } border rounded-xl p-4 font-outfit`}
                  >
                    <h4
                      className={`${
                        theme === "dark" ? "text-slate-200" : "text-slate-800"
                      } text-sm font-medium mb-4 flex items-center`}
                    >
                      <StarIcon className="mr-2 w-4 h-4 text-amber-400" />
                      Points Potential
                    </h4>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-slate-300"
                              : "text-slate-700"
                          } flex items-center`}
                        >
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                          Correct outcome
                        </span>
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-slate-200"
                              : "text-slate-800"
                          } font-medium`}
                        >
                          5 points
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-slate-300"
                              : "text-slate-700"
                          } flex items-center`}
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Exact scoreline
                        </span>
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-slate-200"
                              : "text-slate-800"
                          } font-medium`}
                        >
                          10 points
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-slate-300"
                              : "text-slate-700"
                          } flex items-center`}
                        >
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          Correct goalscorers
                        </span>
                        <span
                          className={`${
                            theme === "dark"
                              ? "text-slate-200"
                              : "text-slate-800"
                          } font-medium`}
                        >
                          Up to {(homeScore + awayScore) * 2} points
                        </span>
                      </div>
                      {selectedChips.includes("doubleDown") && (
                        <div className="flex justify-between items-center text-sm">
                          <span
                            className={`flex items-center ${
                              theme === "dark"
                                ? "text-emerald-300"
                                : "text-emerald-700"
                            }`}
                          >
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                            <span className="mr-1">2x</span> Double Down bonus
                          </span>
                          <span
                            className={`font-medium ${
                              theme === "dark"
                                ? "text-emerald-300"
                                : "text-emerald-700"
                            }`}
                          >
                            2x points
                          </span>
                        </div>
                      )}
                      {selectedChips.includes("wildcard") && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-purple-300 flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                            <span className="mr-1">3x</span> Wildcard bonus
                          </span>
                          <span className="text-purple-300 font-medium">
                            3x points
                          </span>
                        </div>
                      )}
                      {selectedChips.includes("opportunist") && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-amber-300 flex items-center">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                            <span className="mr-1">💰</span> Opportunist bonus
                          </span>
                          <span className="text-amber-300 font-medium">
                            +15 points
                          </span>
                        </div>
                      )}
                      {selectedChips.includes("scorerFocus") && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-green-300 flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="mr-1">⚽</span> Scorer Focus bonus
                          </span>
                          <span className="text-green-300 font-medium">
                            2x scorer points
                          </span>
                        </div>
                      )}
                      {activeGameweekChips.includes("defensePlusPlus") &&
                        (homeScore === 0 || awayScore === 0 ? (
                          <div className="flex justify-between items-center text-sm">
                            <span
                              className={`flex items-center ${
                                theme === "dark"
                                  ? "text-blue-300"
                                  : "text-blue-700"
                              }`}
                            >
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                              <span className="mr-1">🛡️</span> Defense++ bonus
                              (potential)
                            </span>
                            <span
                              className={`font-medium ${
                                theme === "dark"
                                  ? "text-blue-300"
                                  : "text-blue-700"
                              }`}
                            >
                              +10 points
                            </span>
                          </div>
                        ) : null)}
                      {activeGameweekChips.includes("allInWeek") && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-red-300 flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            <span className="mr-1">🎯</span> All-In Week bonus
                          </span>
                          <span className="text-red-300 font-medium">
                            2x all points
                          </span>
                        </div>
                      )}{" "}
                      <div
                        className={`border-t ${
                          theme === "dark"
                            ? "border-slate-600/50"
                            : "border-slate-300/50"
                        } pt-3 mt-4`}
                      >
                        <div className="flex justify-between items-center text-sm">
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-slate-100"
                                : "text-slate-900"
                            } font-medium`}
                          >
                            Maximum potential
                          </span>
                          <span
                            className={`${
                              theme === "dark"
                                ? "text-slate-100"
                                : "text-slate-900"
                            } font-bold text-base`}
                          >
                            {(() => {
                              // Base points calculation
                              let max = 10 + (homeScore + awayScore) * 2;

                              // Apply match chip effects
                              if (selectedChips.includes("opportunist"))
                                max += 15;
                              if (selectedChips.includes("scorerFocus"))
                                max += (homeScore + awayScore) * 2;
                              if (selectedChips.includes("doubleDown"))
                                max *= 2;
                              if (selectedChips.includes("wildcard")) max *= 3;

                              // Apply gameweek-wide chip effects
                              if (
                                activeGameweekChips.includes(
                                  "defensePlusPlus"
                                ) &&
                                (homeScore === 0 || awayScore === 0)
                              ) {
                                max += 10; // Potential clean sheet bonus
                              }

                              if (activeGameweekChips.includes("allInWeek")) {
                                max *= 2; // Double all points
                              }

                              return `${max} points`;
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>{" "}
        {/* Footer with action buttons - fixed at bottom */}{" "}
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
              onClick={prevStep}
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

            {currentStep < 3 ? (
              <motion.button
                type="button"
                onClick={nextStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium font-outfit shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
              >
                <div className="flex items-center">
                  Continue
                  <ChevronRightIcon className="w-4 h-4 ml-1" />
                </div>
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={handleSubmit}
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
      </motion.div>
    </motion.div>
  );
}
