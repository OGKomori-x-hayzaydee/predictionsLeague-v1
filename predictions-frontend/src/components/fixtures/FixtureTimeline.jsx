import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { format, parseISO, differenceInDays } from "date-fns";

function FixtureTimeline({ fixtures, onFixtureSelect, searchQuery = "" }) {
  const timelineRef = useRef(null);
  
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
  
  // Create timeline data
  const today = new Date();
  const timelineData = sortedFixtures.map(fixture => {
    const fixtureDate = parseISO(fixture.date);
    const daysFromNow = differenceInDays(fixtureDate, today);
    
    let status = "upcoming";
    if (daysFromNow < 0) status = "past";
    if (daysFromNow === 0) status = "today";
    
    return {
      ...fixture,
      daysFromNow,
      status
    };
  });
  
  // Scroll to today's fixture on load
  useEffect(() => {
    if (timelineRef.current) {
      const todayElement = timelineRef.current.querySelector('[data-today="true"]');
      if (todayElement) {
        todayElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, []);

  return (
    <div className="bg-primary-800/30 rounded-lg border border-primary-700/30 p-4">
      <h3 className="text-teal-200 text-lg font-medium mb-4">Match Timeline</h3>
      
      {/* Timeline visualization */}
      <div className="relative mb-8">
        <div className="absolute top-4 left-0 right-0 h-1 bg-primary-600/30 z-0"></div>
        
        <div className="flex overflow-x-auto pb-4 hide-scrollbar" ref={timelineRef}>
          <div className="flex items-start space-x-3 px-4">
            {timelineData.map((fixture, index) => (
              <motion.div
                key={fixture.id}
                className="relative flex flex-col items-center mt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                data-today={fixture.status === 'today'}
              >
                {/* Date marker */}
                <div 
                  className={`w-3 h-3 rounded-full z-10 mb-2 ${
                    fixture.status === 'past' ? 'bg-white/40' :
                    fixture.status === 'today' ? 'bg-teal-400 ring-2 ring-teal-400/50' :
                    'bg-indigo-500'
                  }`}
                ></div>
                
                {/* Date label */}
                <div className="text-xs text-white/70 mb-1">
                  {format(parseISO(fixture.date), 'MMM d')}
                </div>
                
                {/* Fixture card */}
                <div 
                  className={`w-48 p-3 rounded-lg border cursor-pointer transform transition-all duration-200 hover:scale-105 ${
                    fixture.status === 'past' ? 'border-primary-600/30 bg-primary-700/20 opacity-70' :
                    fixture.status === 'today' ? 'border-teal-500/40 bg-teal-900/20' :
                    'border-indigo-500/30 bg-indigo-900/10'
                  }`}
                  onClick={() => onFixtureSelect(fixture)}
                >
                  <div className="text-center mb-1">
                    <div className={`text-xs inline-block px-2 py-0.5 rounded-full ${
                      fixture.status === 'past' ? 'bg-white/10 text-white/60' :
                      fixture.status === 'today' ? 'bg-teal-900/40 text-teal-300' :
                      'bg-indigo-900/40 text-indigo-300'
                    }`}>
                      {fixture.status === 'past' ? 'Completed' :
                       fixture.status === 'today' ? 'Today' :
                       `In ${fixture.daysFromNow} day${fixture.daysFromNow !== 1 ? 's' : ''}`}
                    </div>
                  </div>
                  
                  <div className="text-sm font-medium text-white mb-1">
                    {fixture.homeTeam} <span className="text-white/60">vs</span> {fixture.awayTeam}
                  </div>
                  
                  <div className="text-xs text-white/60">
                    {format(parseISO(fixture.date), 'h:mm a')} • {fixture.venue}
                  </div>
                  
                  <div className="mt-1.5 flex justify-between items-center">
                    <div className="text-[0.65rem] text-white/40">
                      GW {fixture.gameweek}
                    </div>
                    <div className={`text-[0.65rem] px-1.5 py-0.5 rounded ${
                      fixture.predicted
                        ? "bg-indigo-900/30 text-indigo-300"
                        : "bg-teal-900/30 text-teal-300"
                    }`}>
                      {fixture.predicted ? "Predicted" : "Not Predicted"}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FixtureTimeline;