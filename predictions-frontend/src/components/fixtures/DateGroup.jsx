import { useContext } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { hasUnpredictedFixture } from "../../utils/fixtureUtils";
import FixtureCard from "./FixtureCardOption2";

const DateGroup = ({ date, fixtures, selectedFixture, onFixtureClick, teamLogos }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div id={`date-${date}`} className="w-[min(400px,80vw)]">
      <div className={`rounded-lg border p-3 h-full ${
        theme === "dark" 
          ? "bg-slate-800/50 border-slate-700/50 backdrop-blur-md" 
          : "bg-white border-slate-200"
      }`}>
        {/* Date header with improved layout */}
        <div className="flex items-center justify-between mb-3">
          <div className={`text-xs rounded-full px-2 py-1 flex items-center ${
            theme === "dark" 
              ? "bg-teal-800/30 text-teal-300" 
              : "bg-teal-50 text-teal-700"
          }`}>
            <CalendarIcon className="mr-1 w-3 h-3" />
            {format(parseISO(date), "EEE, MMM d")}
          </div>
          <div className="flex items-center space-x-1">
            <div className={`text-xs px-2 py-0.5 rounded-full ${
              theme === "dark" 
                ? "bg-slate-700/50 text-slate-300" 
                : "bg-slate-100 text-slate-700"
            }`}>
              GW {fixtures[0].gameweek}
            </div>
            {hasUnpredictedFixture(fixtures) && (
              <div className={`text-xs px-2 py-0.5 rounded-full flex items-center ${
                theme === "dark" 
                  ? "bg-indigo-800/30 text-indigo-300" 
                  : "bg-indigo-50 text-indigo-700"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                  theme === "dark" ? "bg-indigo-400" : "bg-indigo-500"
                }`}></span>
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