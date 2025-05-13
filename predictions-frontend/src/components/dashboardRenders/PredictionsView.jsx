import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  CheckIcon,
  Cross2Icon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ChevronDownIcon,
  MixerHorizontalIcon,
  LightningBoltIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";

// Import club logos
import arsenalLogo from "../../assets/clubs/arsenal.png";
import chelseaLogo from "../../assets/clubs/chelsea.png";
import liverpoolLogo from "../../assets/clubs/liverpool.png";
import manCityLogo from "../../assets/clubs/mancity.png";
import manUtdLogo from "../../assets/clubs/manutd.png";
import tottenhamLogo from "../../assets/clubs/tottenham.png";

const PredictionsView = ({
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  gameweekFilter,
  setGameweekFilter,
  sortBy,
  setSortBy,
  filterTeam,
  setFilterTeam,
  showFilters,
  setShowFilters,
  handleEditPrediction, // Add this prop
}) => {
  const [expandedPrediction, setExpandedPrediction] = useState(null);
  const [showDetailedPointsBreakdown, setShowDetailedPointsBreakdown] =
    useState(false);

  // Sample prediction data
  const predictions = [
    {
      id: 1,
      matchId: 101,
      homeTeam: "Arsenal",
      awayTeam: "Tottenham",
      homeScore: 2,
      awayScore: 1,
      actualHomeScore: 2,
      actualAwayScore: 1,
      correct: true,
      points: 12,
      date: "2025-04-22T15:00:00",
      gameweek: 34,
      homeScorers: ["Saka", "Martinelli"],
      awayScorers: ["Son"],
      actualHomeScorers: ["Saka", "Martinelli"],
      actualAwayScorers: ["Son"],
      status: "completed",
      chips: ["wildcard"],
    },
    {
      id: 2,
      matchId: 102,
      homeTeam: "Man. United",
      awayTeam: "Liverpool",
      homeScore: 1,
      awayScore: 2,
      actualHomeScore: 0,
      actualAwayScore: 3,
      correct: false,
      points: 4,
      date: "2025-04-28T20:00:00",
      gameweek: 35,
      homeScorers: ["Rashford"],
      awayScorers: ["Salah", "Núñez"],
      actualHomeScorers: [],
      actualAwayScorers: ["Salah", "Gakpo", "Núñez"],
      status: "completed",
      chips: [],
    },
    {
      id: 3,
      matchId: 103,
      homeTeam: "Chelsea",
      awayTeam: "Man. City",
      homeScore: 1,
      awayScore: 1,
      actualHomeScore: 1,
      actualAwayScore: 2,
      correct: false,
      points: 2,
      date: "2025-05-01T19:45:00",
      gameweek: 35,
      homeScorers: ["Palmer"],
      awayScorers: ["Haaland"],
      actualHomeScorers: ["Palmer"],
      actualAwayScorers: ["Foden", "Haaland"],
      status: "completed",
      chips: ["opportunist"],
    },
    {
      id: 4,
      matchId: 104,
      homeTeam: "Man. City",
      awayTeam: "Arsenal",
      homeScore: 2,
      awayScore: 2,
      actualHomeScore: null,
      actualAwayScore: null,
      correct: null,
      points: null,
      date: "2025-05-15T20:00:00",
      gameweek: 37,
      homeScorers: ["Haaland", "De Bruyne"],
      awayScorers: ["Saka", "Havertz"],
      actualHomeScorers: null,
      actualAwayScorers: null,
      status: "pending",
      chips: ["doubleDown"],
    },
    {
      id: 5,
      matchId: 105,
      homeTeam: "Liverpool",
      awayTeam: "Chelsea",
      homeScore: 3,
      awayScore: 1,
      actualHomeScore: null,
      actualAwayScore: null,
      correct: null,
      points: null,
      date: "2025-05-18T16:30:00",
      gameweek: 38,
      homeScorers: ["Salah", "Núñez", "Gakpo"],
      awayScorers: ["Palmer"],
      actualHomeScorers: null,
      actualAwayScorers: null,
      status: "pending",
      chips: ["doubleDown"],
    },
    {
      id: 6,
      matchId: 106,
      homeTeam: "Tottenham",
      awayTeam: "Man. United",
      homeScore: 2,
      awayScore: 0,
      actualHomeScore: null,
      actualAwayScore: null,
      correct: null,
      points: null,
      date: "2025-05-19T20:00:00",
      gameweek: 38,
      homeScorers: ["Son", "Richarlison"],
      awayScorers: [],
      actualHomeScorers: null,
      actualAwayScorers: null,
      status: "pending",
      chips: ["defensePlusPlus"],
    },
    {
      id: 7,
      matchId: 107,
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      homeScore: 4,
      awayScore: 2,
      actualHomeScore: null,
      actualAwayScore: null,
      correct: null,
      points: null,
      date: "2025-06-01T17:00:00",
      gameweek: 38,
      homeScorers: ["Saka", "Havertz", "Martinelli", "Ødegaard"],
      awayScorers: ["Palmer", "Jackson"],
      actualHomeScorers: null,
      actualAwayScorers: null,
      status: "pending",
      chips: ["scorerFocus", "wildcard"],
    },
  ];

  // Filter predictions based on active filter
  const filteredPredictions = predictions.filter((prediction) => {
    // Filter by status
    if (activeFilter === "pending" && prediction.status !== "pending")
      return false;
    if (activeFilter === "completed" && prediction.status !== "completed")
      return false;

    // Filter by gameweek
    if (
      gameweekFilter !== "all" &&
      prediction.gameweek !== Number(gameweekFilter)
    )
      return false;

    // Filter by team
    if (
      filterTeam !== "all" &&
      prediction.homeTeam !== filterTeam &&
      prediction.awayTeam !== filterTeam
    )
      return false;

    // Filter by search query
    if (
      searchQuery &&
      !`${prediction.homeTeam} vs ${prediction.awayTeam}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
      return false;

    return true;
  });

  // Sort predictions
  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === "team") {
      return a.homeTeam.localeCompare(b.homeTeam);
    } else if (sortBy === "points") {
      // Handle null points (pending predictions)
      if (a.points === null && b.points !== null) return 1;
      if (a.points !== null && b.points === null) return -1;
      if (a.points === null && b.points === null) return 0;
      return b.points - a.points;
    }
    return 0;
  });

  // Toggle expanded prediction details
  const toggleExpandedPrediction = (id) => {
    if (expandedPrediction === id) {
      setExpandedPrediction(null);
    } else {
      setExpandedPrediction(id);
    }
  };

  // Get team logo function
  const getTeamLogo = (team) => {
    const teamLogos = {
      Arsenal: arsenalLogo,
      Chelsea: chelseaLogo,
      Liverpool: liverpoolLogo,
      "Man. City": manCityLogo,
      "Man. United": manUtdLogo,
      Tottenham: tottenhamLogo,
    };

    return (
      teamLogos[team] ||
      `https://via.placeholder.com/40?text=${team.substring(0, 3)}`
    );
  };

  // Get chip name and description
  const getChipInfo = (chipId) => {
    const chips = {
      doubleDown: {
        id: "doubleDown",
        name: "Double Down",
        description: "Double all points earned from this match",
        icon: "2x",
      },
      wildcard: {
        id: "wildcard",
        name: "Wildcard",
        description: "Triple all points earned from this match",
        icon: "3x",
      },
      opportunist: {
        id: "opportunist",
        name: "Opportunist",
        description: "Change predictions up to 30 min before kickoff",
        icon: "⏱️",
      },
      scorerFocus: {
        id: "scorerFocus",
        name: "Scorer Focus",
        description: "Double all points from goalscorer predictions",
        icon: "⚽",
      },
      defensePlusPlus: {
        id: "defensePlusPlus",
        name: "Defense++",
        description:
          "Earn +10 bonus points for each match where you correctly predict a clean sheet.",
        icon: "🛡️",
      },
    };

    return chips[chipId] || { name: chipId, description: "" };
  };

  // Check if scorer was correctly predicted
  const isCorrectScorer = (scorer, actualScorers) => {
    return actualScorers && actualScorers.includes(scorer);
  };

  // The edit button now calls the parent's handler directly
  const onEditClick = (prediction) => {
    handleEditPrediction(prediction);
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-teal-100 text-3xl font-bold font-dmSerif">
          My Predictions
        </h1>
        <p className="text-white/70 font-outfit">
          View and manage your predictions for past and upcoming matches
        </p>
      </div>

      {/* Filters and search */}
      <div className="bg-primary-600/40 backdrop-blur-md rounded-lg border border-primary-400/20 p-5 pb-2 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          {/* Tabs */}
          <div className="flex bg-primary-700/40 rounded-lg p-1">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 text-sm rounded-md transition ${
                activeFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("pending")}
              className={`px-4 py-2 text-sm rounded-md transition ${
                activeFilter === "pending"
                  ? "bg-indigo-600 text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveFilter("completed")}
              className={`px-4 py-2 text-sm rounded-md transition ${
                activeFilter === "completed"
                  ? "bg-indigo-600 text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Completed
            </button>
          </div>

          {/* Search and filter button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 text-white/70 hover:text-white font-outfit transition-colors mr-2 text-md"
            >
              {showFilters ? "Hide filters" : "Show filters"}
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search matches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-primary-700/40 border border-primary-400/20 rounded-md pl-10 pr-4 py-2 text-white text-sm w-full sm:w-auto min-w-[200px]"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            </div>
          </div>
        </div>

        {/* Advanced filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="pt-4 border-t border-primary-400/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Gameweek filter */}
                <div>
                  <label className="block text-white/70 text-sm mb-1">
                    Gameweek
                  </label>
                  <select
                    value={gameweekFilter}
                    onChange={(e) => setGameweekFilter(e.target.value)}
                    className=" border border-primary-400/20 rounded-md px-3 py-2 text-white text-sm w-full"
                  >
                    <option value="all" className="bg-indigo-800">
                      All Gameweeks
                    </option>
                    {Array.from({ length: 38 }, (_, i) => i + 1).map((gw) => (
                      <option key={gw} value={gw} className="bg-indigo-950">
                        Gameweek {gw}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Team filter */}
                <div>
                  <label className="block text-white/70 text-sm mb-1">
                    Team
                  </label>
                  <select
                    value={filterTeam}
                    onChange={(e) => setFilterTeam(e.target.value)}
                    className="border border-primary-400/20 rounded-md px-3 py-2 text-white text-sm w-full"
                  >
                    <option value="all" className="bg-indigo-800">
                      All Teams
                    </option>
                    <option value="Arsenal" className="bg-indigo-950">
                      Arsenal
                    </option>
                    <option value="Chelsea" className="bg-indigo-950">
                      Chelsea
                    </option>
                    <option value="Liverpool" className="bg-indigo-950">
                      Liverpool
                    </option>
                    <option value="Man. City" className="bg-indigo-950">
                      Man. City
                    </option>
                    <option value="Man. United" className="bg-indigo-950">
                      Man. United
                    </option>
                    <option value="Tottenham" className="bg-indigo-950">
                      Tottenham
                    </option>
                  </select>
                </div>

                {/* Sort by */}
                <div>
                  <label className="block text-white/70 text-sm mb-1">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-primary-700/40 border border-primary-400/20 rounded-md px-3 py-2 text-white text-sm w-full"
                  >
                    <option value="date" className="bg-indigo-800">
                      Date (newest first)
                    </option>
                    <option value="team" className="bg-indigo-950">
                      Team name
                    </option>
                    <option value="points" className="bg-indigo-950">
                      Points (highest first)
                    </option>
                  </select>
                </div>
              </div>

              {/* Reset filters button */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setGameweekFilter("all");
                    setFilterTeam("all");
                    setSortBy("date");
                    setSearchQuery("");
                    setActiveFilter("all");
                  }}
                  className="bg-primary-700/50 hover:bg-primary-700/70 text-white text-sm py-1.5 px-4 rounded-md transition-colors flex items-center"
                >
                  Reset filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Potential Points Summary - Only shown when viewing pending predictions */}
      {activeFilter === "pending" && filteredPredictions.length > 0 && (
        <div className="bg-primary-600/40 backdrop-blur-md rounded-lg border border-primary-400/20 mb-6 overflow-hidden">
          <div className="bg-primary-700/30 px-5 py-3 border-b border-primary-400/20">
            <h3 className="text-teal-100 text-lg font-dmSerif">
              Potential Points Summary
            </h3>
            <p className="text-white/60 text-sm">
              Total points you could earn from your pending predictions
            </p>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Base potential - should NOT include chip bonuses */}
              <div className="bg-primary-700/30 rounded-lg p-4 flex flex-col items-center">
                <div className="text-white/50 text-xs mb-2">Base Potential</div>
                <div className="text-3xl font-bold text-white font-dmSerif mb-1 relative z-10">
                  {filteredPredictions.reduce((total, prediction) => {
                    // Base points calculation - without any chip effects
                    const outcomePoints = 5;
                    const exactScorePoints = 10;
                    const baseGoalScorerPoints =
                      (prediction.homeScore + prediction.awayScore) * 2;

                    // Simple sum of base points - NO CHIPS APPLIED
                    const basePoints =
                      outcomePoints + exactScorePoints + baseGoalScorerPoints;

                    return total + basePoints;
                  }, 0)}
                </div>
                <div className="text-white/60 text-xs text-center">
                  Without chips applied
                </div>
              </div>

              {/* With chips potential - should include all chip bonuses */}
              <div className="bg-gradient-to-br from-indigo-900/30 to-primary-700/30 rounded-lg p-4 flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-full -translate-x-12 -translate-y-12"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-teal-600/10 rounded-full -translate-x-8 translate-y-8"></div>

                <div className="text-indigo-200 text-xs mb-2 relative z-10">
                  Maximum Potential
                </div>
                <div className="text-3xl font-bold text-white font-dmSerif mb-1 relative z-10">
                  {filteredPredictions.reduce((total, prediction) => {
                    // Base points calculation
                    const outcomePoints = 5;
                    const exactScorePoints = 10;
                    const baseGoalScorerPoints =
                      (prediction.homeScore + prediction.awayScore) * 2;

                    // Calculate clean sheet bonus
                    const isCleanSheet =
                      prediction.homeScore === 0 || prediction.awayScore === 0;
                    const defensePlusBonus =
                      prediction.chips.includes("defensePlusPlus") &&
                      isCleanSheet
                        ? 10
                        : 0;

                    // Calculate scorer focus bonus
                    const scorerFocusBonus = prediction.chips.includes(
                      "scorerFocus"
                    )
                      ? baseGoalScorerPoints
                      : 0;

                    // Calculate base points before multipliers
                    const pointsBeforeMultiplier =
                      outcomePoints +
                      exactScorePoints +
                      baseGoalScorerPoints +
                      defensePlusBonus +
                      scorerFocusBonus;

                    // Apply multipliers (Wild card has precedence over Double Down)
                    let finalPoints = pointsBeforeMultiplier;
                    if (prediction.chips.includes("wildcard")) {
                      finalPoints = pointsBeforeMultiplier * 3;
                    } else if (prediction.chips.includes("doubleDown")) {
                      finalPoints = pointsBeforeMultiplier * 2;
                    }

                    return total + finalPoints;
                  }, 0)}
                </div>
                <div className="text-indigo-200/80 text-xs text-center relative z-10">
                  With all chips applied
                </div>
              </div>

              {/* Match breakdown */}
              <div className="bg-primary-700/30 rounded-lg p-4 font-outfit">
                <div className="text-white/50 text-xs mb-3">
                  Match Breakdown
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                  {filteredPredictions.map((prediction) => {
                    const outcomePoints = 5;
                    const exactScorePoints = 10;
                    const scorerPoints =
                      (prediction.homeScore + prediction.awayScore) * 2;

                    const hasWildcard = prediction.chips.includes("wildcard");
                    const hasDoubleDown =
                      prediction.chips.includes("doubleDown");
                    const hasScorerFocus =
                      prediction.chips.includes("scorerFocus");
                    const hasDefensePlus =
                      prediction.chips.includes("defensePlusPlus");
                    const isCleanSheet =
                      prediction.homeScore === 0 || prediction.awayScore === 0;

                    let pointsBeforeMultiplier =
                      outcomePoints + exactScorePoints + scorerPoints;

                    if (hasScorerFocus) {
                      pointsBeforeMultiplier += scorerPoints;
                    }

                    if (hasDefensePlus && isCleanSheet) {
                      pointsBeforeMultiplier += 10;
                    }

                    let finalPoints = pointsBeforeMultiplier;

                    if (hasWildcard) {
                      finalPoints = pointsBeforeMultiplier * 3;
                    } else if (hasDoubleDown) {
                      finalPoints = pointsBeforeMultiplier * 2;
                    }

                    return (
                      <div
                        key={prediction.id}
                        className="flex justify-between text-xs border-b border-primary-600/30 pb-1 last:border-0"
                      >
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center mr-2">
                            <img
                              src={getTeamLogo(prediction.homeTeam)}
                              alt={prediction.homeTeam}
                              className="w-3 h-3 object-contain"
                            />
                          </div>
                          <span className="text-white/80">
                            {prediction.homeTeam} vs {prediction.awayTeam}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-white/60">
                            {pointsBeforeMultiplier}
                          </span>
                          <span>→</span>
                          <span className="text-teal-300 font-medium">
                            {finalPoints}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 pt-2 border-t border-primary-600/50">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-xs">
                      Total Fixtures
                    </span>
                    <span className="text-white text-sm font-medium">
                      {filteredPredictions.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-primary-800/30 rounded-lg p-3 border border-primary-700/50">
              <div className="flex items-start gap-2">
                <div className="bg-indigo-800/40 p-1.5 rounded-full mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-indigo-300"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-indigo-200 text-xs font-medium">
                    How points are calculated
                  </h4>
                  <p className="text-white/60 text-xs mt-0.5">
                    Base points: 5 for correct outcome, 10 for exact score, 2
                    per correct goalscorer. Chips can multiply points or add
                    bonuses.
                  </p>
                </div>
              </div>
            </div>

            {/* Toggle button for detailed view */}
            <button
              onClick={() =>
                setShowDetailedPointsBreakdown(!showDetailedPointsBreakdown)
              }
              className="mt-3 text-indigo-300 text-sm flex items-center mx-auto hover:text-indigo-200 transition-colors"
            >
              {showDetailedPointsBreakdown
                ? "Hide detailed breakdown"
                : "View detailed breakdown"}
              <ChevronDownIcon
                className={`ml-1 transition-transform ${
                  showDetailedPointsBreakdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Detailed breakdown section */}
            <AnimatePresence>
              {showDetailedPointsBreakdown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-primary-400/20"
                >
                  <h4 className="text-teal-200 text-lg font-medium mb-3 font-dmSerif">
                    Detailed Points Calculation
                  </h4>
                  <div className="space-y-4 font-outfit">
                    {filteredPredictions.map((prediction) => {
                      // Calculate potential points components
                      const outcomePoints = 5;
                      const exactScorePoints = 10;
                      const scorerPoints =
                        (prediction.homeScore + prediction.awayScore) * 2;

                      // Calculate chip effects
                      const hasWildcard = prediction.chips.includes("wildcard");
                      const hasDoubleDown =
                        prediction.chips.includes("doubleDown");
                      const hasScorerFocus =
                        prediction.chips.includes("scorerFocus");
                      const hasDefensePlus =
                        prediction.chips.includes("defensePlusPlus");
                      const isCleanSheet =
                        prediction.homeScore === 0 ||
                        prediction.awayScore === 0;

                      // Calculate bonuses first (before multipliers)
                      let pointsBeforeMultiplier =
                        outcomePoints + exactScorePoints + scorerPoints;
                      let breakdown = [];

                      breakdown.push({
                        label: "Outcome",
                        value: outcomePoints,
                        type: "base",
                      });
                      breakdown.push({
                        label: "Exact Score",
                        value: exactScorePoints,
                        type: "base",
                      });
                      breakdown.push({
                        label: "Goal Scorers",
                        value: scorerPoints,
                        type: "base",
                      });

                      if (hasScorerFocus) {
                        const scorerBonus = scorerPoints;
                        pointsBeforeMultiplier += scorerBonus;
                        breakdown.push({
                          label: "Scorer Focus",
                          value: scorerBonus,
                          type: "bonus",
                        });
                      }

                      if (hasDefensePlus && isCleanSheet) {
                        pointsBeforeMultiplier += 10;
                        breakdown.push({
                          label: "Defense++",
                          value: 10,
                          type: "bonus",
                        });
                      }

                      // Apply multipliers (wildcard has precedence)
                      let finalPoints = pointsBeforeMultiplier;

                      if (hasWildcard) {
                        const multipliedPoints = pointsBeforeMultiplier * 3;
                        breakdown.push({
                          label: "Wildcard (3x)",
                          value: multipliedPoints - pointsBeforeMultiplier,
                          type: "multiplier",
                          multiply: 3,
                        });
                        finalPoints = multipliedPoints;
                      } else if (hasDoubleDown) {
                        const multipliedPoints = pointsBeforeMultiplier * 2;
                        breakdown.push({
                          label: "Double Down (2x)",
                          value: multipliedPoints - pointsBeforeMultiplier,
                          type: "multiplier",
                          multiply: 2,
                        });
                        finalPoints = multipliedPoints;
                      }

                      return (
                        <div
                          key={prediction.id}
                          className="bg-primary-700/20 rounded-lg overflow-hidden"
                        >
                          <div className="bg-primary-800/30 px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center mr-2">
                                <img
                                  src={getTeamLogo(prediction.homeTeam)}
                                  alt={prediction.homeTeam}
                                  className="w-4 h-4 object-contain"
                                />
                              </div>
                              <span className="text-white font-medium text-sm">
                                {prediction.homeTeam} {prediction.homeScore} -{" "}
                                {prediction.awayScore} {prediction.awayTeam}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {prediction.chips.map((chip) => (
                                <span
                                  key={chip}
                                  className="bg-primary-700/60 text-white/80 text-sm py-0.5 px-2 rounded-full flex items-center"
                                  title={getChipInfo(chip).description}
                                >
                                  <LightningBoltIcon className="mr-1 w-2.5 h-2.5 text-indigo-300" />
                                  {getChipInfo(chip).name}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="p-4">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-white/50 border-b border-primary-600/30">
                                  <th className="text-left pb-2">Component</th>
                                  <th className="text-right pb-2">Points</th>
                                </tr>
                              </thead>
                              <tbody>
                                {breakdown.map((item, idx) => (
                                  <tr
                                    key={idx}
                                    className="border-b border-primary-600/10 last:border-0"
                                  >
                                    <td
                                      className={`py-2 ${
                                        item.type === "bonus"
                                          ? "text-teal-300"
                                          : item.type === "multiplier"
                                          ? "text-indigo-300"
                                          : "text-white/80"
                                      }`}
                                    >
                                      {item.label}
                                      {item.type === "multiplier" && (
                                        <span className="text-white/50 ml-1">
                                          (applies to all points above)
                                        </span>
                                      )}
                                    </td>
                                    <td
                                      className={`py-2 text-right ${
                                        item.type === "bonus"
                                          ? "text-teal-300"
                                          : item.type === "multiplier"
                                          ? "text-indigo-300"
                                          : "text-white/80"
                                      }`}
                                    >
                                      {item.type === "multiplier"
                                        ? `+${item.value}`
                                        : item.value}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-primary-700/30">
                                  <td className="py-2 text-white font-medium">
                                    Total Potential
                                  </td>
                                  <td className="py-2 text-right text-white font-medium">
                                    {finalPoints}
                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <div className="mt-3 pt-3 border-t border-primary-600/30">
                              <div className="text-xs text-white/50">
                                Predicted Goalscorers:
                              </div>
                              <div className="text-white/80 text-xs mt-1">
                                {[
                                  ...prediction.homeScorers,
                                  ...prediction.awayScorers,
                                ].join(", ")}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Prediction list */}
      <div className="space-y-4 font-outfit">
        {sortedPredictions.length === 0 ? (
          <div className="bg-primary-600/40 backdrop-blur-md rounded-lg border border-primary-400/20 p-8 text-center">
            <p className="text-white/70 text-lg mb-2 font-dmSerif">
              No predictions found
            </p>
            <p className="text-white/50 text-sm font-outfit">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          sortedPredictions.map((prediction) => {
            const isPending = prediction.status === "pending";
            const matchDate = new Date(prediction.date);
            const formattedDate = format(matchDate, "EEEE, MMM d");
            const isExpanded = expandedPrediction === prediction.id;

            return (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-primary-600/40 backdrop-blur-md rounded-lg border border-primary-400/20 overflow-hidden"
              >
                {/* Header with date and status */}
                <div className="bg-primary-700/30 px-5 py-3 flex flex-wrap md:flex-nowrap items-center justify-between">
                  <div className="flex items-center text-white/70">
                    <CalendarIcon className="mr-2" />
                    <span>
                      {formattedDate} • GW{prediction.gameweek}
                    </span>
                  </div>

                  <div className="flex items-center mt-2 md:mt-0">
                    {/* Chips used badges */}
                    {prediction.chips && prediction.chips.length > 0 && (
                      <div className="flex mr-3 gap-1">
                        {prediction.chips.map((chip) => (
                          <span
                            key={chip}
                            className="bg-primary-700/60 text-white/80 text-xs py-1 px-2 rounded-full flex items-center"
                            title={getChipInfo(chip).description}
                          >
                            <LightningBoltIcon className="mr-1 w-3 h-3 text-indigo-300" />
                            {getChipInfo(chip).name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Status badge */}
                    {isPending ? (
                      <span className="bg-indigo-700/20 text-indigo-300 text-xs font-medium py-1 px-2 rounded-full">
                        Pending
                      </span>
                    ) : prediction.correct ? (
                      <span className="bg-green-700/20 text-green-300 text-xs font-medium py-1 px-2 rounded-full flex items-center">
                        <CheckIcon className="mr-1" /> Correct
                      </span>
                    ) : (
                      <span className="bg-red-700/20 text-red-300 text-xs font-medium py-1 px-2 rounded-full flex items-center">
                        <Cross2Icon className="mr-1" /> Incorrect
                      </span>
                    )}
                  </div>
                </div>

                {/* Match details and prediction - Updated to 3-column layout */}
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column 1: Prediction */}
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-white/50 mb-2">
                        Your prediction
                      </div>
                      <div className="flex items-center justify-center w-full">
                        <div className="flex flex-col items-center">
                          <div className="w-14 h-14 p-1 bg-white/5 rounded-full mb-1 flex items-center justify-center">
                            <img
                              src={getTeamLogo(prediction.homeTeam)}
                              alt={prediction.homeTeam}
                              className="w-10 h-10 object-contain"
                            />
                          </div>
                          <span className="text-white text-xs font-outfit">
                            {prediction.homeTeam}
                          </span>
                        </div>

                        <div className="mx-4">
                          <div className="text-center mb-1">
                            <span className="bg-primary-700/50 rounded-lg px-3 py-1 text-white font-medium text-2xl font-outfit">
                              {prediction.homeScore} - {prediction.awayScore}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="w-14 h-14 p-1 bg-white/5 rounded-full mb-1 flex items-center justify-center">
                            <img
                              src={getTeamLogo(prediction.awayTeam)}
                              alt={prediction.awayTeam}
                              className="w-10 h-10 object-contain"
                            />
                          </div>
                          <span className="text-white text-xs font-outfit">
                            {prediction.awayTeam}
                          </span>
                        </div>
                      </div>

                      {/* Prediction scorers */}
                      <div className="mt-3 text-center w-full">
                        <span className="text-white/50 text-xs block mb-1">
                          Predicted scorers
                        </span>
                        <div className="text-white text-sm">
                          {[
                            ...prediction.homeScorers,
                            ...prediction.awayScorers,
                          ].length > 0 ? (
                            [
                              ...prediction.homeScorers,
                              ...prediction.awayScorers,
                            ].join(", ")
                          ) : (
                            <span className="text-white/30">
                              None predicted
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Actual Result */}
                    <div className="flex flex-col items-center">
                      {!isPending ? (
                        <>
                          <div className="text-xs text-white/50 mb-2">
                            Actual result
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="flex flex-col items-center">
                              <div className="w-14 h-14 p-1 bg-white/5 rounded-full mb-1 flex items-center justify-center">
                                <img
                                  src={getTeamLogo(prediction.homeTeam)}
                                  alt={prediction.homeTeam}
                                  className="w-10 h-10 object-contain"
                                />
                              </div>
                            </div>

                            <div className="mx-4">
                              <div className="text-center mb-1">
                                <span className="bg-teal-700/20 text-teal-300 px-3 py-1 rounded-lg font-medium text-2xl">
                                  {prediction.actualHomeScore} -{" "}
                                  {prediction.actualAwayScore}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-center">
                              <div className="w-14 h-14 p-1 bg-white/5 rounded-full mb-1 flex items-center justify-center">
                                <img
                                  src={getTeamLogo(prediction.awayTeam)}
                                  alt={prediction.awayTeam}
                                  className="w-10 h-10 object-contain"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Actual scorers */}
                          <div className="mt-3 text-center w-full">
                            <span className="text-white/50 text-xs block mb-1">
                              Actual scorers
                            </span>
                            <div className="text-white text-sm">
                              {[
                                ...prediction.actualHomeScorers,
                                ...prediction.actualAwayScorers,
                              ].length > 0 ? (
                                [
                                  ...prediction.actualHomeScorers,
                                  ...prediction.actualAwayScorers,
                                ].join(", ")
                              ) : (
                                <span className="text-white/30">
                                  No goals scored
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="bg-primary-700/30 rounded-lg py-8 px-6 text-center">
                            <div className="text-indigo-300 mb-2 text-lg">
                              Match Pending
                            </div>
                            <div className="text-white/50 text-sm">
                              Results will appear here after the match
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Column 3: Points or Chips */}
                    <div className="flex flex-col items-center justify-center">
                      {!isPending ? (
                        <>
                          <div className="text-xs text-white/50 mb-2">
                            Points earned
                          </div>
                          <div className="bg-primary-700/30 rounded-lg p-4 text-center min-w-[120px]">
                            <div className="text-3xl font-bold text-white font-dmSerif">
                              {prediction.points}
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              toggleExpandedPrediction(prediction.id)
                            }
                            className="text-indigo-300 text-sm hover:text-indigo-200 flex items-center transition-colors mt-4"
                          >
                            {isExpanded ? "Hide details" : "View details"}
                            <ChevronDownIcon
                              className={`ml-1 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="text-xs text-white/50 mb-2">
                            Applied chips
                          </div>
                          {prediction.chips && prediction.chips.length > 0 ? (
                            <div className="flex flex-wrap justify-center gap-1 mb-4">
                              {prediction.chips.map((chip) => (
                                <span
                                  key={chip}
                                  className="bg-primary-700/60 text-white/80 text-xs py-1 px-2 rounded-full flex items-center"
                                  title={getChipInfo(chip).description}
                                >
                                  <LightningBoltIcon className="mr-1 w-3 h-3 text-indigo-300" />
                                  {getChipInfo(chip).name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="text-white/50 text-sm mb-4">
                              No chips used
                            </div>
                          )}

                          <div className="flex gap-3">
                            <button
                              onClick={() =>
                                toggleExpandedPrediction(prediction.id)
                              }
                              className="text-indigo-300 text-sm hover:text-indigo-200 flex items-center transition-colors"
                            >
                              {isExpanded ? "Hide details" : "View details"}
                              <ChevronDownIcon
                                className={`ml-1 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Keep the existing AnimatePresence and expanded details section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-primary-400/20"
                      >
                        {/* Your existing expanded details content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-white/70 text-sm font-medium mb-2">
                              Prediction Details
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                              {/* Home team scorers */}
                              <div className="bg-primary-700/30 rounded-lg p-3">
                                <div className="text-white/50 text-xs mb-1">
                                  {prediction.homeTeam} Scorers
                                </div>
                                <div>
                                  <div className="text-xs uppercase text-white/40 font-medium tracking-wider mb-2">
                                    Predicted
                                  </div>
                                  <div className="text-white text-sm mb-4">
                                    {prediction.homeScorers.length > 0 ? (
                                      prediction.homeScorers.map(
                                        (scorer, i) => (
                                          <div
                                            key={i}
                                            className={`py-1 border-b border-primary-600/30 last:border-0 flex items-center ${
                                              !isPending &&
                                              isCorrectScorer(
                                                scorer,
                                                prediction.actualHomeScorers
                                              )
                                                ? "text-green-300"
                                                : ""
                                            }`}
                                          >
                                            <span className="bg-indigo-800/30 text-xs rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">
                                              {i + 1}
                                            </span>
                                            {scorer}
                                            {!isPending &&
                                              isCorrectScorer(
                                                scorer,
                                                prediction.actualHomeScorers
                                              ) && (
                                                <CheckIcon className="ml-1 text-green-300" />
                                              )}
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <span className="text-white/30">
                                        None predicted
                                      </span>
                                    )}
                                  </div>

                                  {!isPending && (
                                    <>
                                      <div className="text-xs uppercase text-white/40 font-medium tracking-wider mb-2">
                                        Actual
                                      </div>
                                      <div className="text-white text-sm">
                                        {prediction.actualHomeScorers.length >
                                        0 ? (
                                          prediction.actualHomeScorers.map(
                                            (scorer, i) => (
                                              <div
                                                key={i}
                                                className={`py-1 border-b border-primary-600/30 last:border-0 flex items-center ${
                                                  isCorrectScorer(
                                                    scorer,
                                                    prediction.homeScorers
                                                  )
                                                    ? "text-teal-300"
                                                    : ""
                                                }`}
                                              >
                                                <span className="bg-teal-800/30 text-xs rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">
                                                  {i + 1}
                                                </span>
                                                {scorer}
                                                {isCorrectScorer(
                                                  scorer,
                                                  prediction.homeScorers
                                                ) && (
                                                  <CheckIcon className="ml-1 text-teal-300" />
                                                )}
                                              </div>
                                            )
                                          )
                                        ) : (
                                          <span className="text-white/30">
                                            No goals scored
                                          </span>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Away team scorers */}
                              <div className="bg-primary-700/30 rounded-lg p-3">
                                <div className="text-white/50 text-xs mb-1">
                                  {prediction.awayTeam} Scorers
                                </div>
                                <div>
                                  <div className="text-xs uppercase text-white/40 font-medium tracking-wider mb-2">
                                    Predicted
                                  </div>
                                  <div className="text-white text-sm mb-4">
                                    {prediction.awayScorers.length > 0 ? (
                                      prediction.awayScorers.map(
                                        (scorer, i) => (
                                          <div
                                            key={i}
                                            className={`py-1 border-b border-primary-600/30 last:border-0 flex items-center ${
                                              !isPending &&
                                              isCorrectScorer(
                                                scorer,
                                                prediction.actualAwayScorers
                                              )
                                                ? "text-green-300"
                                                : ""
                                            }`}
                                          >
                                            <span className="bg-indigo-800/30 text-xs rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">
                                              {i + 1}
                                            </span>
                                            {scorer}
                                            {!isPending &&
                                              isCorrectScorer(
                                                scorer,
                                                prediction.actualAwayScorers
                                              ) && (
                                                <CheckIcon className="ml-1 text-green-300" />
                                              )}
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <span className="text-white/30">
                                        None predicted
                                      </span>
                                    )}
                                  </div>

                                  {!isPending && (
                                    <>
                                      <div className="text-xs uppercase text-white/40 font-medium tracking-wider mb-2">
                                        Actual
                                      </div>
                                      <div className="text-white text-sm">
                                        {prediction.actualAwayScorers.length >
                                        0 ? (
                                          prediction.actualAwayScorers.map(
                                            (scorer, i) => (
                                              <div
                                                key={i}
                                                className={`py-1 border-b border-primary-600/30 last:border-0 flex items-center ${
                                                  isCorrectScorer(
                                                    scorer,
                                                    prediction.awayScorers
                                                  )
                                                    ? "text-teal-300"
                                                    : ""
                                                }`}
                                              >
                                                <span className="bg-teal-800/30 text-xs rounded-full w-5 h-5 inline-flex items-center justify-center mr-2">
                                                  {i + 1}
                                                </span>
                                                {scorer}
                                                {isCorrectScorer(
                                                  scorer,
                                                  prediction.awayScorers
                                                ) && (
                                                  <CheckIcon className="ml-1 text-teal-300" />
                                                )}
                                              </div>
                                            )
                                          )
                                        ) : (
                                          <span className="text-white/30">
                                            No goals scored
                                          </span>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-white/70 text-sm font-medium mb-2">
                              Applied Chips
                            </h4>
                            {prediction.chips.length > 0 ? (
                              <div className="space-y-2">
                                {prediction.chips.map((chip) => (
                                  <div
                                    key={chip}
                                    className="bg-primary-700/30 rounded-lg p-3 flex items-start"
                                  >
                                    <div className="bg-indigo-700/50 p-2 rounded mr-2">
                                      <LightningBoltIcon className="text-indigo-300" />
                                    </div>
                                    <div>
                                      <div className="text-white text-sm font-medium">
                                        {getChipInfo(chip).name}
                                      </div>
                                      <div className="text-white/60 text-xs">
                                        {getChipInfo(chip).description}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-primary-700/30 rounded-lg p-3 text-white/50 text-sm">
                                No chips used for this prediction
                              </div>
                            )}

                            {!isPending && (
                              <>
                                <h4 className="text-white/70 text-sm font-medium mt-4 mb-2">
                                  Points Breakdown
                                </h4>
                                <div className="bg-primary-700/30 rounded-lg p-3">
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-white/70">
                                        Correct outcome
                                      </span>
                                      <span className="text-white">
                                        {prediction.correct ? "+3" : "0"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-white/70">
                                        Exact score
                                      </span>
                                      <span className="text-white">
                                        {prediction.correct &&
                                        prediction.homeScore ===
                                          prediction.actualHomeScore &&
                                        prediction.awayScore ===
                                          prediction.actualAwayScore
                                          ? "+3"
                                          : "0"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-white/70">
                                        Scorers
                                      </span>
                                      <span className="text-white">
                                        +
                                        {prediction.correct
                                          ? prediction.points - 6
                                          : prediction.points}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium border-t border-primary-600/30 pt-2 mt-2">
                                      <span className="text-white">Total</span>
                                      <span className="text-white">
                                        +{prediction.points}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Add Edit button at bottom for pending predictions */}
                  {isPending && (
                    <div className="mt-4 pt-4 border-t border-primary-400/20 flex justify-center">
                      <button
                        onClick={() => onEditClick(prediction)}
                        className="bg-teal-800/30 hover:bg-teal-700/40 text-teal-300 hover:text-teal-200 rounded-md px-4 py-2 flex items-center transition-colors font-medium"
                      >
                        <Pencil1Icon className="mr-2 w-4 h-4" />
                        Edit Prediction
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </>
  );
};

export default PredictionsView;
