import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { getPredictionStats } from "../../utils/fixtureUtils";
import FixtureCard from "./FixtureCard";
import { normalizeTeamName, getTeamLogo } from "../../utils/teamUtils";
import { getLogoUrl } from "../../utils/logoCache";
import { teamLogos } from "../../data/sampleData";
import { ThemeContext } from "../../context/ThemeContext";

const TeamPanel = ({
  team,
  fixtures,
  isExpanded,
  onToggle,
  onFixtureSelect,
}) => {
  const { theme } = useContext(ThemeContext);
  const stats = getPredictionStats(fixtures);

  // Handle team logo with better caching and fallbacks
  const getTeamLogoSrc = (teamName) => {
    // Use the getLogoUrl helper first to try all variants with context logos
    if (teamLogos) {
      const logoUrl = getLogoUrl(teamName, teamLogos, normalizeTeamName);

      // If we got a non-placeholder logo, use it
      if (!logoUrl.includes("placeholder")) {
        return logoUrl;
      }
    }

    // Fall back to the utility function which uses local assets
    const logo = getTeamLogo(teamName);

    // Debug logging
    if (logo.includes("placeholder")) {
      console.log(
        `No logo found for ${teamName} in either context or local assets`
      );
      if (teamLogos) {
        console.log(
          "Available logo team names:",
          Object.keys(teamLogos).sort().join(", ")
        );
      }
    }

    return logo;
  };
  return (
    <div
      className={`rounded-lg border overflow-hidden ${
        theme === "dark"
          ? "bg-primary-800/30 border-primary-700/30"
          : "bg-white border-gray-200 shadow-sm"
      }`}
    >
      {/* Team header - clickable */}
      <div
        className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
          theme === "dark" ? "hover:bg-primary-700/30" : "hover:bg-gray-50"
        }`}
        onClick={() => onToggle(team)}
      >
        <div className="flex items-center">
          <img
            src={getTeamLogoSrc(team)}
            alt={team}
            className="w-8 h-8 object-contain mr-3"
          />
          <div>
            <h3
              className={`font-medium ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {team}
            </h3>
            <div
              className={`text-xs ${
                theme === "dark" ? "text-white/60" : "text-gray-500"
              }`}
            >
              {fixtures.length} upcoming fixture
              {fixtures.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div
            className={`w-20 rounded-full h-1.5 overflow-hidden ${
              theme === "dark" ? "bg-primary-700/30" : "bg-gray-200"
            }`}
          >
            <div
              className="bg-teal-500 h-full"
              style={{ width: `${stats.percentage}%` }}
            ></div>
          </div>
          <div
            className={`text-xs ${
              theme === "dark" ? "text-white/70" : "text-gray-600"
            }`}
          >
            {stats.predicted}/{stats.total} predicted
          </div>
          {isExpanded ? (
            <MinusIcon
              className={theme === "dark" ? "text-white/60" : "text-gray-400"}
            />
          ) : (
            <PlusIcon
              className={theme === "dark" ? "text-white/60" : "text-gray-400"}
            />
          )}
        </div>
      </div>

      {/* Team fixtures - collapsible */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`border-t overflow-hidden ${
              theme === "dark" ? "border-primary-700/30" : "border-gray-200"
            }`}
          >
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fixtures.map((fixture) => (
                  <FixtureCard
                    key={fixture.id}
                    fixture={fixture}
                    onClick={onFixtureSelect}
                    teamLogos={teamLogos}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamPanel;
