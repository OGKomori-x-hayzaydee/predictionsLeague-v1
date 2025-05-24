import React from "react";
import { CalendarIcon, LightningBoltIcon, PlusIcon } from "@radix-ui/react-icons";

const UpcomingMatchesPanel = ({ matches, onViewAll, onPredictMatch }) => {
  return (
    <div className="bg-primary-600/40 rounded-lg p-5 border border-primary-400/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-teal-200 font-outfit font-medium text-lg">
          Upcoming Matches
        </h3>
        <button 
          onClick={onViewAll}
          className="text-indigo-300 text-sm flex items-center hover:text-indigo-200 transition-colors"
        >
          View all <CalendarIcon className="ml-1" />
        </button>
      </div>

      <div className="space-y-3">
        {matches.map((match) => {
          const matchDate = new Date(match.date);
          const formattedDate = `${matchDate.toLocaleDateString("en-GB", {
            weekday: "short",
          })} ${matchDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })}`;
          const formattedTime = matchDate
            .toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })
            .toLowerCase();

          return (
            <div
              key={match.id}
              className="flex items-center justify-between py-3 border-b border-primary-500/60 last:border-0"
            >
              <div>
                <div className="text-white font-outfit font-medium">
                  {match.home} vs {match.away}
                </div>
                <div className="text-white/60 text-xs">
                  {formattedDate} • {formattedTime}
                </div>
              </div>
              {match.predicted ? (
                <div className="bg-teal-700/20 text-teal-300 text-xs font-medium py-1 px-3 rounded-full flex items-center">
                  <LightningBoltIcon className="mr-1" /> Predicted
                </div>
              ) : (
                <button 
                  onClick={() => onPredictMatch(match)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-1 px-3 rounded-full flex items-center transition-colors"
                >
                  <PlusIcon className="mr-1" /> Predict Now
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingMatchesPanel;