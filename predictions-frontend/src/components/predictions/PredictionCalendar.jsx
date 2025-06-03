import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  parseISO,
  addMonths,
  subMonths
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import SimplePredictionCard from "./SimplePredictionCard";
import EmptyState from "../common/EmptyState";
import { ThemeContext } from "../../context/ThemeContext";

const PredictionCalendar = ({
  predictions,
  onPredictionSelect,
  onEditClick,
  teamLogos,
  searchQuery,
}) => {
  const { theme } = useContext(ThemeContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  if (predictions.length === 0) {
    return <EmptyState />;
  }

  // Group predictions by date
  const predictionsByDate = predictions.reduce((groups, prediction) => {
    const dateKey = format(parseISO(prediction.date), 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(prediction);
    return groups;
  }, {});

  // Get calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDate(null);
  };

  const handleDateClick = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    if (predictionsByDate[dateKey]) {
      setSelectedDate(date);
    }
  };

  const getDatePredictions = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return predictionsByDate[dateKey] || [];
  };

  const selectedDatePredictions = selectedDate ? getDatePredictions(selectedDate) : [];  return (
    <div className="space-y-5">
      {/* Calendar header */}
      <div className="flex items-center justify-between">
        <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
          <div className="flex items-center gap-1.5">
          <button
            onClick={handlePreviousMonth}
            className={`p-2 rounded-md transition-colors ${
              theme === "dark"
                ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700/70"
                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleNextMonth}
            className={`p-2 rounded-md transition-colors ${
              theme === "dark"
                ? "bg-slate-700/50 text-slate-300 hover:bg-slate-700/70"
                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
            }`}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Calendar grid */}
        <div className="lg:col-span-2">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div
                key={day}
                className={`text-center text-sm font-medium py-1.5 ${
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {day}
              </div>
            ))}
          </div>          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dayPredictions = getDatePredictions(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const hasPredictions = dayPredictions.length > 0;

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.01 }}
                  onClick={() => handleDateClick(day)}
                  disabled={!hasPredictions}
                  className={`relative w-10 h-10 p-1.5 rounded-lg transition-all ${
                    !isCurrentMonth
                      ? theme === "dark" ? "text-slate-600" : "text-slate-300"
                      : hasPredictions
                        ? isSelected
                          ? theme === "dark" 
                            ? "bg-teal-600 text-white" 
                            : "bg-teal-500 text-white"
                          : theme === "dark"
                            ? "bg-slate-700/50 text-white hover:bg-slate-700/70"
                            : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                        : theme === "dark" 
                          ? "text-slate-400" 
                          : "text-slate-500"
                  } ${hasPredictions ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <span className="text-sm font-medium">
                    {format(day, 'd')}
                  </span>
                  
                  {/* Prediction indicator */}
                  {hasPredictions && (
                    <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      isSelected 
                        ? "bg-white" 
                        : theme === "dark" ? "bg-teal-400" : "bg-teal-500"
                    }`} />
                  )}
                  
                  {/* Multiple predictions indicator */}
                  {dayPredictions.length > 1 && (
                    <div className={`absolute top-0 right-0 text-sm font-bold ${
                      isSelected 
                        ? "text-white" 
                        : theme === "dark" ? "text-teal-400" : "text-teal-600"
                    }`}>
                      {dayPredictions.length}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>{/* Selected date predictions */}
        <div className="lg:col-span-2">
          {selectedDate ? (
            <div>
              <h4 className={`font-semibold mb-4 text-base ${theme === "dark" ? "text-white" : "text-slate-800"}`}>
                {format(selectedDate, 'EEEE, MMMM do')}
              </h4>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedDatePredictions.map((prediction, index) => (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <SimplePredictionCard
                      prediction={prediction}
                      teamLogos={teamLogos}
                      onClick={onPredictionSelect}
                      onEditClick={onEditClick}
                    />
                  </motion.div>
                ))}
              </div>
            </div>          ) : (            <div className={`text-center py-8 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
              <p className="text-sm">Click on a date with predictions to view them</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionCalendar;
