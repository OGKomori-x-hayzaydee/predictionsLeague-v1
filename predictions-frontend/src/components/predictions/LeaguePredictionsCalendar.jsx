import React, { useContext, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  PersonIcon,
  CalendarIcon,
  TargetIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@radix-ui/react-icons";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from "date-fns";
import { ThemeContext } from "../../context/ThemeContext";
import TeamLogo from "../ui/TeamLogo";
import { LOGO_SIZES } from "../../utils/teamLogos";
import PredictionCard from "./PredictionCard";

const LeaguePredictionsCalendar = ({
  predictions,
  onPredictionSelect,
  teamLogos = {},
  searchQuery = "",
  cardStyle = "normal"
}) => {
  const { theme } = useContext(ThemeContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Filter predictions based on search query
  const filteredPredictions = predictions.filter(prediction => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      prediction.userDisplayName?.toLowerCase().includes(searchLower) ||
      prediction.homeTeam.toLowerCase().includes(searchLower) ||
      prediction.awayTeam.toLowerCase().includes(searchLower) ||
      `${prediction.homeTeam} vs ${prediction.awayTeam}`.toLowerCase().includes(searchLower)
    );
  });

  // Group predictions by date
  const predictionsByDate = useMemo(() => {
    const groups = {};
    filteredPredictions.forEach(prediction => {
      if (prediction.date) {
        const dateKey = format(parseISO(prediction.date), 'yyyy-MM-dd');
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(prediction);
      }
    });
    return groups;
  }, [filteredPredictions]);

  // Get calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get start of week (Sunday) for the first week
  const calendarStart = new Date(monthStart);
  calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay());

  // Get end of week (Saturday) for the last week
  const calendarEnd = new Date(monthEnd);
  calendarEnd.setDate(calendarEnd.getDate() + (6 - calendarEnd.getDay()));

  // Generate all calendar days including previous/next month padding
  const allCalendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });



  const formatPrediction = (prediction) => {
    if (prediction.homeScore !== null && prediction.awayScore !== null) {
      return `${prediction.homeScore}-${prediction.awayScore}`;
    }
    return "No prediction";
  };

  const getDatePredictions = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return predictionsByDate[dateKey] || [];
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    const predictions = getDatePredictions(date);
    if (predictions.length > 0) {
      setSelectedDate(selectedDate && isSameDay(selectedDate, date) ? null : date);
    }
  };

  const selectedDatePredictions = selectedDate ? getDatePredictions(selectedDate) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`${
          theme === 'dark'
            ? 'text-slate-300'
            : 'text-slate-600'
        } text-sm font-medium`}>
          {filteredPredictions.length} prediction{filteredPredictions.length !== 1 ? 's' : ''} found
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={handlePreviousMonth}
            className={`p-2 rounded-lg ${
              theme === 'dark'
                ? 'hover:bg-slate-700 text-slate-400'
                : 'hover:bg-slate-100 text-slate-600'
            } transition-colors`}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <h3 className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
          }`}>
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          
          <button
            onClick={handleNextMonth}
            className={`p-2 rounded-lg ${
              theme === 'dark'
                ? 'hover:bg-slate-700 text-slate-400'
                : 'hover:bg-slate-100 text-slate-600'
            } transition-colors`}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className={`${
        theme === 'dark'
          ? 'bg-slate-800/50 border-slate-700'
          : 'bg-white border-slate-200'
      } rounded-xl border overflow-hidden`}>
        {/* Days of week header */}
        <div className="grid grid-cols-7">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className={`p-3 text-center text-sm font-medium ${
                theme === 'dark'
                  ? 'bg-slate-900/50 text-slate-400 border-slate-700'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              } border-b border-r last:border-r-0`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {allCalendarDays.map((date, index) => {
            const dayPredictions = getDatePredictions(date);
            const isCurrentMonth = isSameMonth(date, currentDate);
            const isSelected = selectedDate && isSameDay(selectedDate, date);
            const isCurrentDay = isToday(date);
            const hasPredictions = dayPredictions.length > 0;

            return (
              <div
                key={index}
                className={`p-2 min-h-[80px] border-r border-b last:border-r-0 ${
                  theme === 'dark' ? 'border-slate-700' : 'border-slate-200'
                } ${
                  hasPredictions ? 'cursor-pointer hover:bg-opacity-50' : ''
                } ${
                  isSelected ? (
                    theme === 'dark' ? 'bg-teal-500/20' : 'bg-teal-100'
                  ) : hasPredictions ? (
                    theme === 'dark' ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'
                  ) : ''
                } transition-colors`}
                onClick={() => handleDateClick(date)}
              >
                <div className={`text-sm font-medium mb-1 ${
                  !isCurrentMonth ? (
                    theme === 'dark' ? 'text-slate-600' : 'text-slate-300'
                  ) : isCurrentDay ? (
                    theme === 'dark' ? 'text-teal-400' : 'text-teal-600'
                  ) : (
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                  )
                }`}>
                  {format(date, 'd')}
                </div>
                
                {hasPredictions && (
                  <div className="space-y-1">
                    {dayPredictions.slice(0, 2).map((prediction, idx) => (
                      <div
                        key={idx}
                        className={`text-xs p-1 rounded truncate ${
                          theme === 'dark'
                            ? 'bg-teal-500/20 text-teal-300'
                            : 'bg-teal-100 text-teal-700'
                        }`}
                      >
                        {prediction.userDisplayName}
                      </div>
                    ))}
                    {dayPredictions.length > 2 && (
                      <div className={`text-xs text-center ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        +{dayPredictions.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Predictions */}
      {selectedDate && selectedDatePredictions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`${
            theme === 'dark'
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-white border-slate-200'
          } rounded-xl border p-6`}
        >
          <h4 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
          }`}>
            Predictions for {format(selectedDate, 'MMMM d, yyyy')}
          </h4>
          
          <div className="space-y-4">
            {selectedDatePredictions.map((prediction, index) => (
              <motion.div
                key={`${prediction.userId}-${prediction.fixtureId}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PredictionCard
                  prediction={prediction}
                  mode="league"
                  showMemberInfo={true}
                  onSelect={onPredictionSelect}
                  isReadonly={true}
                  size={cardStyle}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {filteredPredictions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📅</div>
          <h3 className={`text-lg font-semibold mb-2 ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}>
            No predictions found
          </h3>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
          }`}>
            {searchQuery ? 'Try adjusting your search criteria' : 'No predictions available'}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default LeaguePredictionsCalendar;
