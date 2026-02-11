import { motion, AnimatePresence } from "framer-motion";
import PredictionsByMember from "./PredictionsByMember";
import PredictionGrid from "./PredictionGrid";
import PredictionTable from "./PredictionTable";
import PredictionStack from "./PredictionStack";
import PredictionCalendar from "./PredictionCalendar";

const LeaguePredictionContentView = ({ 
  viewMode, 
  predictions, 
  onPredictionSelect, 
  searchQuery,
  currentGameweek,
  cardStyle = 'normal'
}) => {
  // Filter predictions based on search query if provided
  const filteredPredictions = searchQuery 
    ? predictions.filter(prediction => 
        prediction.userDisplayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prediction.homeTeam?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prediction.awayTeam?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : predictions;
  return (
    <AnimatePresence mode="wait">
      {viewMode === "teams" && (
        <motion.div
          key="teams"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PredictionsByMember
            predictions={filteredPredictions}
            onPredictionSelect={onPredictionSelect}
            currentGameweek={currentGameweek}
            mode="league"
            searchQuery={searchQuery}
            cardStyle={cardStyle}
          />
        </motion.div>
      )}

      {viewMode === "list" && (
        <motion.div
          key="list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PredictionGrid
            mode="league"
            predictions={filteredPredictions}
            onPredictionSelect={onPredictionSelect}
            searchQuery={searchQuery}
            cardStyle={cardStyle}
          />
        </motion.div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <motion.div
          key="table"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PredictionTable
            predictions={filteredPredictions}
            onPredictionSelect={onPredictionSelect}
            searchQuery={searchQuery}
            mode="league"
            cardStyle={cardStyle}
          />
        </motion.div>
      )}

      {/* Stack View */}
      {viewMode === "stack" && (
        <motion.div
          key="stack"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PredictionStack
            predictions={filteredPredictions}
            onPredictionSelect={onPredictionSelect}
            searchQuery={searchQuery}
            cardStyle={cardStyle}
            mode="league"
            showMemberInfo={true}
            isReadonly={true}
          />
        </motion.div>
      )}

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <motion.div
          key="calendar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PredictionCalendar
            predictions={filteredPredictions}
            onPredictionSelect={onPredictionSelect}
            searchQuery={searchQuery}
            cardStyle={cardStyle}
            mode="league"
            showMemberInfo={true}
            isReadonly={true}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeaguePredictionContentView;
