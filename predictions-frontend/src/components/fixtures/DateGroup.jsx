import React from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { hasUnpredictedFixture } from "../../utils/fixtureUtils";
import FixtureCard from "./FixtureCard";

const DateGroup = ({ date, fixtures, selectedFixture, onFixtureClick, teamLogos }) => {
  return (
    <div id={`date-${date}`} className="w-[min(400px,80vw)]">
      <div className="backdrop-blur-md rounded-lg border border-primary-400/20 p-3 h-full">
        {/* Date header with improved layout */}
        <div className="flex items-center justify-between mb-3">
          <div className="bg-teal-700/20 text-teal-300 text-xs rounded-full px-2 py-1 flex items-center">
            <CalendarIcon className="mr-1 w-3 h-3" />
            {format(parseISO(date), "EEE, MMM d")}
          </div>
          <div className="flex items-center space-x-1">
            <div className="text-white/50 text-xs bg-primary-700/40 px-2 py-0.5 rounded-full">
              GW {fixtures[0].gameweek}
            </div>
            {hasUnpredictedFixture(fixtures) && (
              <div className="bg-indigo-900/40 text-indigo-300 text-xs px-2 py-0.5 rounded-full flex items-center">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-1"></span>
                New
              </div>
            )}
          </div>
        </div>

        {/* Fixtures list with visual enhancements */}
        <div className="space-y-3">
          {fixtures.map((fixture) => (
            <FixtureCard
              key={fixture.id}
              fixture={fixture}
              selected={selectedFixture && selectedFixture.id === fixture.id}
              onClick={onFixtureClick}
              teamLogos={teamLogos}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateGroup;