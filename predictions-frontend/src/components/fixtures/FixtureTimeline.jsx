import React, { useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { format, parseISO, differenceInDays, isSameDay } from "date-fns";
import EmptyFixtureState from "./EmptyFixtureState";
import { ThemeContext } from "../../context/ThemeContext";

function FixtureTimeline({ fixtures, onFixtureSelect, searchQuery = "" }) {
  const timelineRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  
  // Filter fixtures based on search query
  const filteredFixtures = fixtures.filter(fixture => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return fixture.homeTeam.toLowerCase().includes(query) ||
           fixture.awayTeam.toLowerCase().includes(query) ||
           fixture.venue.toLowerCase().includes(query) ||
           fixture.competition.toLowerCase().includes(query);
  });
  // Sort fixtures by date
  const sortedFixtures = [...filteredFixtures].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );
  
  // Group fixtures by date (similar to PredictionsTimeline)
  const groupedFixtures = sortedFixtures.reduce((groups, fixture) => {
    const date = format(parseISO(fixture.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(fixture);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedFixtures).sort((a, b) => 
    new Date(a) - new Date(b) // Chronological order
  );
    // Scroll to today's fixture on load
  useEffect(() => {
    if (timelineRef.current) {
      const todayElement = timelineRef.current.querySelector('[data-today="true"]');
      if (todayElement) {
        todayElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, []);

  if (sortedFixtures.length === 0) {
    return <EmptyFixtureState searchQuery={searchQuery} />;
  }

  return (
    <div className={`${
      theme === "dark"
        ? "bg-slate-800/40 border-slate-700/50"
        : "bg-white border-slate-200 shadow-sm"
    } backdrop-blur-sm rounded-xl p-6 border`} ref={timelineRef}>
      <h3 className={`${
        theme === "dark" ? "text-teal-200" : "text-teal-700"
      } text-xl font-semibold mb-6 font-outfit`}>
        Match Timeline
      </h3>
      
      <div className="space-y-8">
        {sortedDates.map((dateKey, dateIndex) => {
          const dateFixtures = groupedFixtures[dateKey];
          const date = parseISO(dateKey);
          const today = new Date();
          const isToday = isSameDay(date, today);
          const daysFromNow = differenceInDays(date, today);
          
          let status = "upcoming";
          if (daysFromNow < 0) status = "past";
          if (daysFromNow === 0) status = "today";
          
          return (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: dateIndex * 0.1 }}
              className="relative"
              data-today={status === 'today'}
            >
              {/* Timeline line - only show if not the last group */}
              {dateIndex < sortedDates.length - 1 && (
                <div 
                  className={`absolute left-6 top-16 w-0.5 h-full ${
                    theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                  }`}
                  style={{ height: 'calc(100% + 2rem)' }}
                />
              )}

              {/* Date header with timeline dot */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center ${
                  theme === "dark" ? "bg-slate-800 border-2 border-slate-600" : "bg-white border-2 border-slate-300 shadow-sm"
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    status === 'past' ? 
                      theme === "dark" ? "bg-slate-500" : "bg-slate-400" :
                    status === 'today' ? 
                      theme === "dark" ? "bg-teal-400" : "bg-teal-500" :
                      theme === "dark" ? "bg-indigo-400" : "bg-indigo-500"
                  }`} />
                </div>
                
                <div>
                  <h3 className={`font-semibold text-lg ${
                    theme === "dark" ? "text-white" : "text-slate-800"
                  } font-outfit`}>
                    {format(date, 'EEEE, MMMM do, yyyy')}
                  </h3>
                  <p className={`text-sm ${
                    theme === "dark" ? "text-slate-400" : "text-slate-500"
                  } font-outfit`}>
                    {dateFixtures.length} fixture{dateFixtures.length > 1 ? 's' : ''} • {
                      status === 'past' ? 'Completed' :
                      status === 'today' ? 'Today' :
                      `In ${daysFromNow} day${daysFromNow !== 1 ? 's' : ''}`
                    }
                  </p>
                </div>
              </div>

              {/* Fixtures for this date */}
              <div className="ml-16 space-y-3">
                {dateFixtures.map((fixture, fixtureIndex) => (
                  <motion.div
                    key={fixture.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: dateIndex * 0.1 + fixtureIndex * 0.05 
                    }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                      status === 'past' 
                        ? theme === "dark"
                          ? 'border-slate-600/30 bg-slate-700/20 opacity-70'
                          : 'border-slate-300/50 bg-slate-50 opacity-70'
                        : status === 'today' 
                        ? theme === "dark"
                          ? 'border-teal-500/40 bg-teal-900/20'
                          : 'border-teal-400/40 bg-teal-50'
                        : theme === "dark"
                          ? 'border-indigo-500/30 bg-indigo-900/10 hover:border-indigo-500/50'
                          : 'border-indigo-300/50 bg-indigo-50/50 hover:border-indigo-400/50'
                    }`}
                    onClick={() => onFixtureSelect(fixture)}
                  >
                    {/* Status badge */}
                    <div className="flex justify-between items-start mb-3">
                      <div className={`text-xs inline-block px-2.5 py-1 rounded-full font-medium ${
                        status === 'past' 
                          ? theme === "dark" 
                            ? 'bg-slate-700/40 text-slate-400' 
                            : 'bg-slate-200 text-slate-600'
                          : status === 'today' 
                          ? theme === "dark"
                            ? 'bg-teal-900/40 text-teal-300' 
                            : 'bg-teal-100 text-teal-700'
                          : theme === "dark"
                            ? 'bg-indigo-900/40 text-indigo-300'
                            : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {status === 'past' ? 'Completed' :
                         status === 'today' ? 'Today' :
                         `In ${differenceInDays(parseISO(fixture.date), today)} day${differenceInDays(parseISO(fixture.date), today) !== 1 ? 's' : ''}`}
                      </div>
                      
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        theme === "dark" ? "bg-slate-700/40 text-slate-400" : "bg-slate-200 text-slate-600"
                      }`}>
                        GW {fixture.gameweek}
                      </div>
                    </div>
                    
                    {/* Match details */}
                    <div className={`text-lg font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-slate-800"
                    } font-outfit`}>
                      {fixture.homeTeam} <span className={`${
                        theme === "dark" ? "text-slate-400" : "text-slate-500"
                      } font-normal`}>vs</span> {fixture.awayTeam}
                    </div>
                    
                    <div className={`text-sm ${
                      theme === "dark" ? "text-slate-400" : "text-slate-600"
                    } font-outfit mb-3`}>
                      {format(parseISO(fixture.date), 'h:mm a')} • {fixture.venue}
                    </div>
                    
                    {/* Competition and prediction status */}
                    <div className="flex justify-between items-center">
                      <div className={`text-xs px-2 py-1 rounded ${
                        theme === "dark" ? "bg-slate-700/30 text-slate-400" : "bg-slate-100 text-slate-600"
                      }`}>
                        {fixture.competition || "Premier League"}
                      </div>
                      
                      <div className={`text-xs px-2 py-1 rounded font-medium ${
                        fixture.predicted
                          ? theme === "dark"
                            ? "bg-emerald-900/30 text-emerald-300"
                            : "bg-emerald-100 text-emerald-700"
                          : theme === "dark"
                            ? "bg-amber-900/30 text-amber-300"
                            : "bg-amber-100 text-amber-700"
                      }`}>
                        {fixture.predicted ? "Predicted" : "Not Predicted"}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default FixtureTimeline;