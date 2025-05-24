import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, addMinutes } from "date-fns";
import {
  StarIcon,
  InfoCircledIcon,
  ClockIcon,
  ChevronRightIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import { getTeamLogo} from "../../data/sampleData";

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
      <div className="bg-primary-600/40 backdrop-blur-md rounded-lg border border-primary-400/20 p-5">
        <div className="text-center p-8">
          <InfoCircledIcon className="mx-auto mb-4 text-white/50 w-8 h-8" />
          <p className="text-white/80">No fixture selected</p>
        </div>
      </div>
    );
  }

  const matchDate = parseISO(fixture.date);
  const formattedDate = format(matchDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(matchDate, "h:mm a");
  const deadlineTime = addMinutes(matchDate, -45);
  
  return (
    <div className="bg-primary-600/40 backdrop-blur-md rounded-lg border border-primary-400/20 relative max-h-[85vh] md:max-h-[90vh] md:max-w-3xl mx-auto flex flex-col overflow-hidden">
      {/* Confirmation overlay */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            className="absolute inset-0 bg-primary-600/95 backdrop-blur-md rounded-lg flex flex-col justify-center items-center text-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="rounded-full bg-gradient-to-br from-teal-500/40 to-teal-700/40 p-3 mb-4">
              <CheckIcon className="w-8 h-8 text-teal-400" />
            </div>
            <h3 className="text-teal-200 text-5xl font-dmSerif mb-2">
              Prediction Submitted!
            </h3>
            <p className="text-white/70 font-outfit">
              Your prediction for {fixture.homeTeam} vs {fixture.awayTeam} has
              been recorded
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section - fixed at top */}
      <div className="p-4 border-b border-primary-400/20 relative bg-primary-700/30 text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="text-teal-100 text-4xl font-dmSerif mb-3">
          {modalTitle}
        </h2>
        <div className="flex flex-wrap justify-between items-center">
          <div className="text-white/70 font-outfit text-sm">
            {formattedDate} • {formattedTime}
          </div>
          <div className="bg-teal-700/20 text-teal-300 text-xs rounded-full px-2 py-0.5 flex items-center mt-1 sm:mt-0 font-outfit">
            <ClockIcon className="mr-1 w-3 h-3" />
            Prediction deadline: {format(deadlineTime, "MMM d, h:mm a")}
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="px-4 py-2 bg-primary-800/30 border-b border-primary-400/20 font-outfit">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentStep >= 1 
                    ? "bg-teal-500 text-primary-900" 
                    : "bg-primary-700/70 text-white/60"
                }`}
              >
                1
              </div>
              <div className={`text-xs ml-2 ${currentStep === 1 ? "text-teal-300" : "text-white/60"}`}>
                Score
              </div>
            </div>
            
            <div className={`w-8 h-0.5 ${currentStep > 1 ? "bg-teal-500/70" : "bg-primary-600/50"}`}></div>
            
            <div className="flex items-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentStep >= 2 
                    ? "bg-teal-500 text-primary-900" 
                    : "bg-primary-700/70 text-white/60"
                }`}
              >
                2
              </div>
              <div className={`text-xs ml-2 ${currentStep === 2 ? "text-teal-300" : "text-white/60"}`}>
                Goalscorers
              </div>
            </div>
            
            <div className={`w-8 h-0.5 ${currentStep > 2 ? "bg-teal-500/70" : "bg-primary-600/50"}`}></div>
            
            <div className="flex items-center">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentStep >= 3 
                    ? "bg-teal-500 text-primary-900" 
                    : "bg-primary-700/70 text-white/60"
                }`}
              >
                3
              </div>
              <div className={`text-xs ml-2 ${currentStep === 3 ? "text-teal-300" : "text-white/60"}`}>
                Review
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
                <div className="mb-5">
                  <h3 className="text-teal-200 text-lg font-outfit mb-3">
                    Predict the scoreline
                  </h3>

                  {/* Match details */}
                  <div className="bg-primary-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-white/50 text-xs">
                        Premier League • GW{fixture.gameweek}
                      </div>
                      <div className="text-white/50 text-xs">
                        {fixture.venue}
                      </div>
                    </div>

                    {/* Score prediction section */}
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col items-center w-5/12">
                        <div className="w-16 h-16 p-1 bg-white/5 rounded-full mb-2 flex items-center justify-center">
                          <img
                            src={getTeamLogo(fixture.homeTeam)}
                            alt={fixture.homeTeam}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <span className="text-white font-outfit text-sm text-center mb-2">
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
                                  : Math.min(9, Math.max(0, parseInt(val) || 0))
                              );
                            }}
                            className="appearance-none bg-primary-800/80 border border-primary-400/50 rounded-md w-16 h-14 text-white text-2xl text-center focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            aria-label={`${fixture.homeTeam} score`}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="text-white/50 text-base font-dmSerif">
                        vs
                      </div>

                      <div className="flex flex-col items-center w-5/12">
                        <div className="w-16 h-16 p-1 bg-white/5 rounded-full mb-2 flex items-center justify-center">
                          <img
                            src={getTeamLogo(fixture.awayTeam)}
                            alt={fixture.awayTeam}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <span className="text-white font-outfit text-sm text-center mb-2">
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
                                  : Math.min(9, Math.max(0, parseInt(val) || 0))
                              );
                            }}
                            className="appearance-none bg-primary-800/80 border border-primary-400/50 rounded-md w-16 h-14 text-white text-2xl text-center focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            aria-label={`${fixture.awayTeam} score`}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Community insights */}
                <div className="bg-primary-700/20 rounded-lg p-3 mb-5 font-outfit">
                  <h3 className="text-white/80 text-sm  mb-2 flex items-center">
                    <StarIcon className="mr-2 text-indigo-300" /> Community
                    Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                    <div className="flex flex-col">
                      <span className="text-white/50 text-xs mb-1">
                        Most predicted score
                      </span>
                      <span className="text-white font-outfit font-medium">
                        2-1
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white/50 text-xs mb-1">
                        Community sentiment
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="bg-primary-800/40 h-2 rounded-full flex-1">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "75%" }}
                          ></div>
                        </div>
                        <span className="text-white font-outfit text-sm">
                          75%
                        </span>
                      </div>
                      <span className="text-white/70 text-xs mt-1">
                        {fixture.homeTeam} win
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white/50 text-xs mb-1">
                        Popular goalscorers
                      </span>
                      <span className="text-white font-outfit text-sm">
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
                {/* Add scoreline summary */}
                <div className="bg-primary-700/30 rounded-lg p-3 mb-4 font-outfit">
                  <div className="text-white/70 text-sm font-medium mb-2 text-center ">
                    Your predicted score
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-2">
                        <img
                          src={getTeamLogo(fixture.homeTeam)}
                          alt={fixture.homeTeam}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <span className="text-white font-outfit text-sm mr-3">
                        {fixture.homeTeam}
                      </span>
                    </div>
                    <div className="flex items-center justify-center bg-teal-900/30 rounded-lg px-2">
                      <span className="bg-primary-800/60 rounded-l-md py-1 px-3 text-teal-200 text-2xl">
                        {homeScore}
                      </span>
                      <span className="px-1 text-white/50">-</span>
                      <span className="bg-primary-800/60 rounded-r-md py-1 px-3 text-teal-200 text-2xl">
                        {awayScore}
                      </span>
                    </div>
                    <div className="flex items-center ml-3">
                      <span className="text-white font-outfit text-sm mr-2">
                        {fixture.awayTeam}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
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
                <div className="mb-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-teal-200 text-lg font-outfit flex items-center">
                        Goalscorers
                      </h3>
                    </div>
                    
                    {(homeScore > 0 || awayScore > 0) ? (
                      <div className="mt-4">
                        {/* Use grid to place home and away side-by-side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Home team scorers */}
                          {homeScore > 0 && (
                            <div
                              className={`bg-gradient-to-br from-primary-700/20 to-primary-800/20 rounded-md overflow-hidden transition-all font-outfit ${
                                errors.homeScorers
                                  ? "border border-red-500/70 ring-1 ring-red-500/30"
                                  : "border border-teal-500/20"
                              }`}
                            >
                              {/* Home team scorer content (unchanged) */}
                              <div className="px-2.5 py-1.5 bg-teal-800/10 border-b border-teal-600/20 flex items-center">
                                <div className="w-5 h-5 rounded-full bg-teal-700/30 p-0.5 flex items-center justify-center mr-2">
                                  <img
                                    src={getTeamLogo(fixture.homeTeam)}
                                    alt={fixture.homeTeam}
                                    className="w-4 h-4 object-contain"
                                  />
                                </div>
                                <div className="text-teal-200 text-xs font-medium">
                                  {fixture.homeTeam}
                                </div>
                              </div>

                              {errors.homeScorers && (
                                <div className="bg-red-900/20 px-2.5 py-1 text-xs text-red-200 flex items-center">
                                  <ExclamationTriangleIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                                  <span>{errors.homeScorers}</span>
                                </div>
                              )}

                              <div className="p-2.5 space-y-1.5">
                                {homeScorers.map((scorer, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1.5"
                                  >
                                    <div
                                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                                        scorer
                                          ? "bg-teal-600/70 text-white shadow-sm shadow-teal-700/30"
                                          : "bg-primary-700/40 text-white/60"
                                      }`}
                                    >
                                      {index + 1}
                                    </div>

                                    <div className="relative flex-1">
                                      <select
                                        value={scorer}
                                        onChange={(e) =>
                                          updateHomeScorer(index, e.target.value)
                                        }
                                        className={`appearance-none w-full rounded-md text-xs px-2 py-1.5 pr-7 focus:outline-none transition-all ${
                                          scorer
                                            ? "bg-primary-700/50 border border-teal-500/40 text-white"
                                            : "bg-primary-800/50 border border-red-500/30 text-white/70"
                                        }`}
                                      >
                                        <option
                                          value=""
                                          className="bg-teal-900"
                                        >
                                          Select player...
                                        </option>
                                        {teamPlayers[fixture.homeTeam]?.map(
                                          (player) => (
                                            <option
                                              key={player}
                                              value={player}
                                              className="bg-teal-900"
                                            >
                                              {player}
                                            </option>
                                          )
                                        )}
                                      </select>
                                      <ChevronRightIcon className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 w-3.5 h-3.5 text-white/60" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Away team scorers */}
                          {awayScore > 0 && (
                            <div
                              className={`bg-gradient-to-br from-primary-700/20 to-primary-800/20 rounded-md overflow-hidden transition-all font-outfit ${
                                errors.awayScorers
                                  ? "border border-red-500/70 ring-1 ring-red-500/30"
                                  : "border border-indigo-500/20"
                              }`}
                            >
                              {/* Away team scorer content (unchanged) */}
                              <div className="px-2.5 py-1.5 bg-indigo-800/10 border-b border-indigo-600/20 flex items-center">
                                <div className="w-5 h-5 rounded-full bg-indigo-700/30 p-0.5 flex items-center justify-center mr-2">
                                  <img
                                    src={getTeamLogo(fixture.awayTeam)}
                                    alt={fixture.awayTeam}
                                    className="w-4 h-4 object-contain"
                                  />
                                </div>
                                <div className="text-indigo-200 text-xs font-medium">
                                  {fixture.awayTeam}
                                </div>
                              </div>

                              {errors.awayScorers && (
                                <div className="bg-red-900/20 px-2.5 py-1 text-xs text-red-200 flex items-center">
                                  <ExclamationTriangleIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                                  <span>{errors.awayScorers}</span>
                                </div>
                              )}

                              <div className="p-2.5 space-y-1.5">
                                {awayScorers.map((scorer, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1.5"
                                  >
                                    <div
                                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                                        scorer
                                          ? "bg-indigo-600/70 text-white shadow-sm shadow-indigo-700/30"
                                          : "bg-primary-700/40 text-white/60"
                                      }`}
                                    >
                                      {index + 1}
                                    </div>

                                    <div className="relative flex-1">
                                      <select
                                        value={scorer}
                                        onChange={(e) =>
                                          updateAwayScorer(index, e.target.value)
                                        }
                                        className={`appearance-none w-full rounded-md text-xs px-2 py-1.5 pr-7 focus:outline-none transition-all ${
                                          scorer
                                            ? "bg-primary-700/50 border border-indigo-500/40 text-white"
                                            : "bg-primary-800/50 border border-red-500/30 text-white/70"
                                        }`}
                                      >
                                        <option
                                          value=""
                                          className="bg-indigo-950"
                                        >
                                          Select player...
                                        </option>
                                        {teamPlayers[fixture.awayTeam]?.map(
                                          (player) => (
                                            <option
                                              key={player}
                                              value={player}
                                              className="bg-indigo-950"
                                            >
                                              {player}
                                            </option>
                                          )
                                        )}
                                      </select>
                                      <ChevronRightIcon className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 w-3.5 h-3.5 text-white/60" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="font-outfit rounded-md py-3 px-4 text-center border border-dashed border-primary-400/20 flex flex-col items-center mt-4 ">
                        <p className="text-white text-md font-medium">
                          Scoreless draw predicted
                        </p>
                        <p className="text-white/50 text-sm mt-0.5">
                          No goalscorers needed
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chips section */}
                <div className="">
                  <div className="">
                    <div className="flex items-center justify-between">
                      <h3 className="text-teal-200 text-lg font-outfit flex items-center">
                        Match Chips
                      </h3>
                      <span className="text-indigo-300 text-xs bg-indigo-800/40 rounded-full px-2 py-0.5">
                        {selectedChips.length}/2
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {availableChips.map((chip) => {
                        // Define chip colors
                        const chipColors = {
                          doubleDown: "teal",
                          wildcard: "purple",
                          opportunist: "amber",
                          scorerFocus: "green",
                        };
                        const color = chipColors[chip.id] || "indigo";

                        return (
                          <button
                            key={chip.id}
                            type="button"
                            onClick={() => toggleChip(chip.id)}
                            disabled={
                              !selectedChips.includes(chip.id) &&
                              selectedChips.length >= 2
                            }
                            className={`relative flex items-center rounded-md border p-2 transition-all ${
                              selectedChips.includes(chip.id)
                                ? `border-${color}-400/50 bg-${color}-900/30`
                                : selectedChips.length >= 2
                                ? "border-primary-400/10 bg-primary-700/10 opacity-50 cursor-not-allowed"
                                : "border-primary-400/20 bg-primary-700/20 hover:bg-primary-700/30"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded flex items-center justify-center mr-2 ${
                                selectedChips.includes(chip.id)
                                  ? `bg-${color}-700/50 text-${color}-300`
                                  : "bg-primary-600/40 text-white/70"
                              }`}
                            >
                              <span className="text-lg">{chip.icon}</span>
                            </div>

                            <div className="flex-1 text-left">
                              <div
                                className={`text-sm font-medium ${
                                  selectedChips.includes(chip.id)
                                    ? `text-${color}-300`
                                    : "text-white"
                                }`}
                              >
                                {chip.name}
                              </div>
                              <div className="text-white/60 text-xs">
                                {chip.description}
                              </div>
                            </div>

                            {selectedChips.includes(chip.id) && (
                              <div
                                className={`w-5 h-5 rounded-full bg-${color}-700/50 flex items-center justify-center ml-2`}
                              >
                                <CheckIcon
                                  className={`w-3 h-3 text-${color}-300`}
                                />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex items-center p-2 bg-primary-800/30 rounded-md text-xs text-white/60">
                      <InfoCircledIcon className="mr-1.5 w-3.5 h-3.5 text-indigo-300 flex-shrink-0" />
                      <span>
                        Match chips only apply to this specific prediction
                      </span>
                    </div>

                    {/* Learn More About Chips link - Add this after the chips grid */}
                    <div className="mt-3">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleChipInfoModal();
                        }}
                        className="text-indigo-300 text-xs hover:text-indigo-200 flex items-center transition-colors"
                      >
                        <InfoCircledIcon className="mr-1 w-3 h-3" />
                        Learn more about all available chips
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="pb-4"
              >
                <h3 className="text-teal-200 text-lg font-outfit mb-4">
                  Review
                </h3>

                {/* Score summary */}
                <div className="bg-primary-700/30 rounded-lg p-3 mb-4 font-outfit">
                  <div className="text-white/70 text-sm font-medium mb-2 text-center ">
                    Your predicted score
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-2">
                        <img
                          src={getTeamLogo(fixture.homeTeam)}
                          alt={fixture.homeTeam}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <span className="text-white font-outfit text-sm mr-3">
                        {fixture.homeTeam}
                      </span>
                    </div>
                    <div className="flex items-center justify-center bg-teal-900/30 rounded-lg px-2">
                      <span className="bg-primary-800/60 rounded-l-md py-1 px-3 text-teal-200 text-2xl">
                        {homeScore}
                      </span>
                      <span className="px-1 text-white/50">-</span>
                      <span className="bg-primary-800/60 rounded-r-md py-1 px-3 text-teal-200 text-2xl">
                        {awayScore}
                      </span>
                    </div>
                    <div className="flex items-center ml-3">
                      <span className="text-white font-outfit text-sm mr-2">
                        {fixture.awayTeam}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <img
                          src={getTeamLogo(fixture.awayTeam)}
                          alt={fixture.awayTeam}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Goalscorers summary */}
                {(homeScore > 0 || awayScore > 0) && (
                  <div className="bg-primary-700/20 rounded-lg p-4 mb-4 font-outfit">
                    <h4 className="text-white/80 text-sm  mb-3">
                      Predicted Goalscorers
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
                      {homeScore > 0 && (
                        <div className="space-y-1">
                          <div className="text-white/50 text-xs text">
                            {fixture.homeTeam}
                          </div>
                          {homeScorers.map((scorer, index) => (
                            <div
                              key={index}
                              className="flex items-center bg-primary-800/30 rounded-md px-2 py-1.5"
                            >
                              <div className="w-5 h-5 rounded-full flex items-center justify-center bg-teal-700/20 mr-2 text-xs text-teal-300">
                                {index + 1}
                              </div>
                              <span className="text-white text-xs">
                                {scorer}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {awayScore > 0 && (
                        <div className="space-y-1">
                          <div className="text-white/50 text-xs ">
                            {fixture.awayTeam}
                          </div>
                          {awayScorers.map((scorer, index) => (
                            <div
                              key={index}
                              className="flex text-center bg-primary-800/30 rounded-md px-2 py-1.5"
                            >
                              <div className="w-5 h-5 rounded-full flex items-center justify-center bg-indigo-700/20 mr-2 text-xs text-indigo-300">
                                {index + 1}
                              </div>
                              <span className="text-white text-xs">
                                {scorer}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Selected chips summary */}
                <div className="bg-primary-700/20 rounded-lg p-4 mb-4 font-outfit">
                  <h4 className="text-white/80 text-sm  mb-3">
                    Selected Chips
                  </h4>

                  {selectedChips.length === 0 ? (
                    <div className="text-white/50 text-xs py-1">
                      No chips selected
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedChips.map((chipId) => {
                        const chip = availableChips.find(
                          (c) => c.id === chipId
                        );
                        return (
                          <div
                            key={chipId}
                            className="flex items-center bg-primary-800/30 rounded-md px-2 py-1.5"
                          >
                            <div className="w-6 h-6 rounded flex items-center justify-center bg-teal-700/20 mr-2 text-base">
                              {chip?.icon}
                            </div>
                            <div>
                              <div className="text-white text-xs font-medium">
                                {chip?.name}
                              </div>
                              <div className="text-white/60 text-xs">
                                {chip?.description}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Gameweek chips section */}
                {activeGameweekChips.length > 0 && (
                  <div className="bg-primary-700/20 rounded-lg p-4 mb-4 font-outfit">
                    <h4 className="text-white/80 text-sm  mb-3">
                      Active Gameweek Chips
                    </h4>

                    <div className="space-y-2">
                      {activeGameweekChips.includes("defensePlusPlus") && (
                        <div className="flex items-center bg-primary-800/30 rounded-md px-3 py-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center bg-blue-700/20 mr-2 text-base">
                            🛡️
                          </div>
                          <div>
                            <div className="text-blue-300 text-xs font-medium">
                              Defense++
                            </div>
                            <div className="text-white/60 text-xs">
                              Applied to all predictions this gameweek
                            </div>
                          </div>
                        </div>
                      )}

                      {activeGameweekChips.includes("allInWeek") && (
                        <div className="flex items-center bg-primary-800/30 rounded-md px-3 py-2">
                          <div className="w-6 h-6 rounded flex items-center justify-center bg-red-700/20 mr-2 text-base">
                            🎯
                          </div>
                          <div>
                            <div className="text-red-300 text-xs font-medium">
                              All-In Week
                            </div>
                            <div className="text-white/60 text-xs">
                              All gameweek points doubled
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Points potential */}
                <div className="bg-primary-700/20 rounded-lg font-outfit p-4">
                  <h4 className="text-white/80 text-sm  mb-3">
                    Points Potential
                  </h4>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70">Correct outcome</span>
                      <span className="text-white">5 points</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70">Exact scoreline</span>
                      <span className="text-white">10 points</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/70">Correct goalscorers</span>
                      <span className="text-white">
                        Up to {(homeScore + awayScore) * 2} points
                      </span>
                    </div>

                    {selectedChips.includes("doubleDown") && (
                      <div className="flex justify-between text-xs">
                        <span className="text-teal-300 flex items-center">
                          <span className="mr-1">2x</span> Double Down bonus
                        </span>
                        <span className="text-teal-300">2x points</span>
                      </div>
                    )}

                    {selectedChips.includes("wildcard") && (
                      <div className="flex justify-between text-xs">
                        <span className="text-purple-300 flex items-center">
                          <span className="mr-1">3x</span> Wildcard bonus
                        </span>
                        <span className="text-purple-300">3x points</span>
                      </div>
                    )}

                    {selectedChips.includes("defensePlusPlus") && (
                      <div className="flex justify-between text-xs">
                        <span className="text-blue-300 flex items-center">
                          <span className="mr-1">🛡️</span> Defense++ bonus
                        </span>
                        <span className="text-blue-300">+10 points</span>
                      </div>
                    )}

                    {selectedChips.includes("scorerFocus") && (
                      <div className="flex justify-between text-xs">
                        <span className="text-green-300 flex items-center">
                          <span className="mr-1">⚽</span> Scorer Focus bonus
                        </span>
                        <span className="text-green-300">2x scorer points</span>
                      </div>
                    )}

                    {activeGameweekChips.includes("defensePlusPlus") &&
                      (homeScore === 0 || awayScore === 0 ? (
                        <div className="flex justify-between text-xs">
                          <span className="text-blue-300 flex items-center">
                            <span className="mr-1">🛡️</span> Defense++ bonus
                            (potential)
                          </span>
                          <span className="text-blue-300">+10 points</span>
                        </div>
                      ) : null)}

                    {activeGameweekChips.includes("allInWeek") && (
                      <div className="flex justify-between text-xs">
                        <span className="text-red-300 flex items-center">
                          <span className="mr-1">🎯</span> All-In Week bonus
                        </span>
                        <span className="text-red-300">2x all points</span>
                      </div>
                    )}

                    <div className="border-t border-primary-600/50 pt-2 mt-3">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-white">Maximum potential</span>
                        <span className="text-white">
                          {(() => {
                            // Base points calculation
                            let max = 10 + (homeScore + awayScore) * 2;

                            // Apply match chip effects
                            if (selectedChips.includes("defensePlusPlus"))
                              max += 10;
                            if (selectedChips.includes("scorerFocus"))
                              max += (homeScore + awayScore) * 2;
                            if (selectedChips.includes("doubleDown")) max *= 2;
                            if (selectedChips.includes("wildcard")) max *= 3;

                            // Apply gameweek-wide chip effects
                            if (
                              activeGameweekChips.includes("defensePlusPlus") &&
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
      </div>

      {/* Footer with action buttons - fixed at bottom */}
      <div className="border-t border-primary-400/20 p-4 bg-primary-700/30">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className={`px-4 py-1.5 rounded-md border border-primary-400/30 text-white/70 hover:text-white transition-colors text-sm ${
              currentStep === 1 ? "invisible" : ""
            }`}
          >
            Back
          </button>

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors text-sm"
            >
              Continue
            </button>
          ) : (
            <button
              type="button" // Changed to button type to handle submission with the handler
              onClick={handleSubmit}
              disabled={submitting}
              className={`${
                submitting
                  ? "bg-indigo-700/50 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white px-6 py-1.5 rounded-md transition-colors flex items-center text-sm`}
            >
              {submitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Prediction"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
