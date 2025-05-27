import React from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { ClockIcon } from "@radix-ui/react-icons";
import { getTeamLogo } from "../../utils/teamUtils";

const FixtureCard = ({ 
  fixture, 
  selected = false, 
  onClick,
  teamLogos = {},
}) => {
  // Use getTeamLogo utility with fallback to context logos
  const getLogoSrc = (teamName) => {
    return teamLogos[teamName] || getTeamLogo(teamName);
  };
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(fixture)}
      className={`border rounded-lg p-3 hover:border-primary-600/40 transition-all ${
        selected ? "ring-2 ring-teal-400" : ""
      }`}
    >
      <div className="flex justify-between items-center text-xs text-white/60 mb-2">
        <span>{fixture.competition}</span>
        <span className="flex items-center">
          <ClockIcon className="mr-1 w-3 h-3" />
          {format(parseISO(fixture.date), "h:mm a")}
        </span>
      </div>
        <div className="flex items-center">
        <img
          src={getLogoSrc(fixture.homeTeam)}
          alt={fixture.homeTeam}
          className="w-10 h-10 object-contain"
        />        <div className="mx-2 flex-grow">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">{fixture.homeTeam}</span>
            <span className="text-slate-400 font-outfit">vs</span>
            <span className="text-white font-medium">{fixture.awayTeam}</span>
          </div>

        </div>
        <img
          src={getLogoSrc(fixture.awayTeam)}
          alt={fixture.awayTeam}
          className="w-10 h-10 object-contain"
        />
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-white/60">
          {fixture.venue}
        </div>
        <div
          className={`text-xs py-1 px-2 rounded ${
            fixture.predicted
              ? "bg-indigo-900/30 text-indigo-300"
              : "bg-teal-900/30 text-teal-300"
          }`}
        >
          {fixture.predicted ? "Prediction Made" : "Prediction Required"}
        </div>
      </div>
    </motion.div>
  );
};

export default FixtureCard;