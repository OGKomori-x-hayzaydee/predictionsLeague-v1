import React, { useState } from "react";
import { motion } from "framer-motion";

// Import components
import PredictionFilters from "../predictions/PredictionFilters";
import PotentialPointsSummary from "../predictions/PotentialPointsSummary";
import PredictionCard from "../predictions/PredictionCard";
import EmptyState from "../common/EmptyState";

// Import data and utilities
import { predictions, teamLogos } from "../../data/sampleData";

const PredictionsView = ({ handleEditPrediction }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [gameweekFilter, setGameweekFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [filterTeam, setFilterTeam] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

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

  // The edit button handler passes the prediction to the parent
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
      <PredictionFilters
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        gameweekFilter={gameweekFilter}
        setGameweekFilter={setGameweekFilter}
        filterTeam={filterTeam}
        setFilterTeam={setFilterTeam}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {/* Potential Points Summary - Only shown when viewing pending predictions */}
      {activeFilter === "pending" && filteredPredictions.length > 0 && (
        <PotentialPointsSummary
          predictions={filteredPredictions}
          teamLogos={teamLogos}
        />
      )}

      {/* Prediction list */}
      <div className="space-y-4 font-outfit">
        {sortedPredictions.length === 0 ? (
          <EmptyState />
        ) : (
          sortedPredictions.map((prediction) => (
            <PredictionCard
              key={prediction.id}
              prediction={prediction}
              teamLogos={teamLogos}
              onEditClick={onEditClick}
            />
          ))
        )}
      </div>
    </>
  );
};

export default PredictionsView;
