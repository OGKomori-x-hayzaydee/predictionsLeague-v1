import React, { useState } from "react";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { groupFixturesByDate, filterFixturesByQuery } from "../../utils/fixtureUtils";
import EmptyFixtureState from "./EmptyFixtureState";

function FixtureCalendar({ fixtures, onFixtureSelect, searchQuery = "" }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Filter fixtures based on search query - using the common utility function
  const filteredFixtures = filterFixturesByQuery(fixtures, searchQuery);

  // Functions for navigating months
  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  // Get calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get day of week for the first day to determine offset
  const startOffset = monthStart.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Group fixtures by date - using the common utility function
  const fixturesByDate = groupFixturesByDate(filteredFixtures);
  
  // Handle date selection
  const handleDateClick = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setSelectedDate(isSameDay(selectedDate, date) ? null : date);
    
    // If there's only one fixture on this day, select it directly
    if (fixturesByDate[dateStr] && fixturesByDate[dateStr].length === 1) {
      onFixtureSelect(fixturesByDate[dateStr][0]);
    }
  };
  // Check if we have any fixtures to display
  const hasFixtures = filteredFixtures.length > 0;

  return (
    <div className="bg-primary-800/30 rounded-lg border border-primary-700/30 p-4">
      {hasFixtures ? (
        <>
          {/* Calendar header */}
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={prevMonth}
              className="p-1 rounded hover:bg-primary-700/40"
            >
              <ChevronLeftIcon className="w-5 h-5 text-teal-300" />
            </button>
            <h2 className="text-teal-100 text-lg font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button 
              onClick={nextMonth}
              className="p-1 rounded hover:bg-primary-700/40"
            >
              <ChevronRightIcon className="w-5 h-5 text-teal-300" />
            </button>
          </div>
          
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2 text-center">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-white/60 text-sm py-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 border border-transparent"></div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map(day => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayFixtures = fixturesByDate[dateStr] || [];
              const hasFixtures = dayFixtures.length > 0;
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              
              return (
                <div 
                  key={dateStr}
                  onClick={() => handleDateClick(day)}
                  className={`h-16 border rounded-md p-1 overflow-hidden transition-all ${
                    hasFixtures 
                      ? isSelected
                        ? "border-teal-500 bg-teal-900/20 cursor-pointer"
                        : "border-primary-600/30 bg-primary-700/20 hover:border-primary-500/40 cursor-pointer" 
                      : "border-transparent hover:border-primary-800/50"
                  }`}
                >
                  <div className="text-right mb-1">
                    <span className={`inline-block rounded-full w-5 h-5 text-xs leading-5 text-center ${
                      hasFixtures ? "bg-teal-900/40 text-teal-300" : "text-white/60"
                    }`}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  
                  {/* Show fixtures indicator */}
                  {hasFixtures && (
                    <div className="text-xs text-white/70">
                      {dayFixtures.length} {dayFixtures.length === 1 ? 'match' : 'matches'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Selected date fixtures */}
          {selectedDate && (
            <div className="mt-4 border-t border-primary-700/30 pt-4">
              <h3 className="text-teal-200 text-md font-medium mb-2">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              
              {fixturesByDate[format(selectedDate, 'yyyy-MM-dd')] ? (
                <div className="space-y-2">
                  {fixturesByDate[format(selectedDate, 'yyyy-MM-dd')].map(fixture => (
                    <div 
                      key={fixture.id}
                      onClick={() => onFixtureSelect(fixture)}
                      className="p-2 bg-primary-700/30 border border-primary-600/30 rounded-md hover:bg-primary-600/30 cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <span className="text-white font-medium">{fixture.homeTeam} vs {fixture.awayTeam}</span>
                        <div className="text-white/60 text-xs">{fixture.venue}</div>
                      </div>
                      <div className="text-white/70 text-sm">
                        {format(parseISO(fixture.date), 'h:mm a')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white/50">No fixtures on this date</div>
              )}
            </div>
          )}
        </>
      ) : (
        <EmptyFixtureState searchQuery={searchQuery} />
      )}
    </div>
  );
}

export default FixtureCalendar;