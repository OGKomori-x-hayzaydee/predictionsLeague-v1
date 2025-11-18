import React, { useState, useContext } from "react";
import {
  filterPredictionsByQuery,
  groupPredictionsByTeam,
} from "../../utils/predictionUtils";
import PredictionTeamPanel from "./PredictionTeamPanel";
import EmptyState from "../common/EmptyState";
import { normalizeTeamName } from "../../utils/teamUtils";
import { ThemeContext } from "../../context/ThemeContext";

function PredictionsByTeam({ predictions = [], onPredictionSelect, onPredictionEdit, searchQuery = "", cardStyle = "normal" }) {
  const { theme } = useContext(ThemeContext);
  const [expandedTeam, setExpandedTeam] = useState(null);

  // Use provided predictions
  const predictionsToUse = predictions;

  // Define the Big Six teams with their standardized names
  const bigSixTeams = [
    "Arsenal",
    "Chelsea",
    "Liverpool",
    "Man City",
    "Man United",
    "Spurs",
  ];

  // Filter predictions based on search query - using common utility function
  const filteredPredictions = filterPredictionsByQuery(predictionsToUse, searchQuery);

  // Normalize the team names in predictions using our centralized utility function
  const normalizedPredictions = filteredPredictions.map((prediction) => ({
    ...prediction,
    homeTeam: normalizeTeamName(prediction.homeTeam),
    awayTeam: normalizeTeamName(prediction.awayTeam),  }));

  // Group predictions by team - but only for Big Six teams
  const predictionsByTeam = groupPredictionsByTeam(normalizedPredictions, bigSixTeams);

  // Toggle team expansion
  const toggleTeam = (team) => {
    setExpandedTeam(expandedTeam === team ? null : team);
  };

  // Check if we have any predictions for Big Six teams with a more robust check
  const hasPredictions =
    filteredPredictions &&
    filteredPredictions.length > 0 &&
    bigSixTeams.some(
      (team) =>
        predictionsByTeam[team] &&
        Array.isArray(predictionsByTeam[team]) &&
        predictionsByTeam[team].length > 0
    );

  return (
    <div className="space-y-3">
      {hasPredictions ? (
        // Filter out null values after mapping
        bigSixTeams
          .map((team) => {
            // Only create panels for teams that have predictions
            if (predictionsByTeam[team] && predictionsByTeam[team].length > 0) {
              return (
                <PredictionTeamPanel
                  key={team}
                  team={team}
                  predictions={predictionsByTeam[team]}
                  isExpanded={expandedTeam === team}
                  onToggle={toggleTeam}
                  onPredictionSelect={onPredictionSelect}
                  onPredictionEdit={onPredictionEdit}
                  cardStyle={cardStyle}
                />
              );
            }
            return null;
          })
          .filter((panel) => panel !== null) // Filter out null values
      ) : (
        <EmptyState/>
      )}
    </div>
  );
}

export default PredictionsByTeam;
