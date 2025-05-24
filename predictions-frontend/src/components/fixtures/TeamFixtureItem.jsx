import React from "react";
import { format, parseISO } from "date-fns";
import { ClockIcon } from "@radix-ui/react-icons";
import { getTeamLogo } from "../../data/sampleData";

const TeamFixtureItem = ({ fixture, team, onFixtureSelect }) => {
  return (
    <div
      className="p-3 hover:bg-primary-700/20 cursor-pointer transition-colors"
      onClick={() => onFixtureSelect(fixture)}
    >
      <div className="flex justify-between items-center mb-1">
        <div className="text-xs text-white/50">
          {format(parseISO(fixture.date), "EEEE, MMM d")}
        </div>
        <div className="flex items-center text-xs text-white/60">
          <ClockIcon className="mr-1 w-3 h-3" />
          {format(parseISO(fixture.date), "h:mm a")}
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center flex-1 justify-end">
          <span className={`text-sm font-medium ${fixture.homeTeam === team ? "text-teal-300" : "text-white/80"}`}>
            {fixture.homeTeam}
          </span>
          <img 
            src={getTeamLogo(fixture.homeTeam)}
            alt={fixture.homeTeam}
            className="w-5 h-5 object-contain mx-1"
          />
        </div>
        
        <div className="px-2 text-xs text-white/40 mx-2">vs</div>
        
        <div className="flex items-center flex-1">
          <img 
            src={getTeamLogo(fixture.awayTeam)}
            alt={fixture.awayTeam}
            className="w-5 h-5 object-contain mx-1"
          />
          <span className={`text-sm font-medium ${fixture.awayTeam === team ? "text-teal-300" : "text-white/80"}`}>
            {fixture.awayTeam}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-1">
        <div className="text-xs text-white/50">
          {fixture.venue}
        </div>
        <div className={`text-xs px-2 py-0.5 rounded ${
          fixture.predicted
            ? "bg-indigo-900/30 text-indigo-300"
            : "bg-teal-900/30 text-teal-300"
        }`}>
          {fixture.predicted ? "Predicted" : "Prediction Required"}
        </div>
      </div>
    </div>
  );
};

export default TeamFixtureItem;