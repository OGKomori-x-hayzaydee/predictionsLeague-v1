import { motion, AnimatePresence } from "framer-motion";
import PredictionGrid from "./PredictionGrid";
import PredictionTable from "./PredictionTable";
import PredictionCalendar from "./PredictionCalendar";
import PredictionStack from "./PredictionStack";
import PredictionCarousel from "./PredictionCarousel";
import PredictionsByTeam from "./PredictionsByTeam";

const PredictionContentView = ({ 
  viewMode, 
  predictions, 
  onPredictionSelect, 
  onEditClick,
  teamLogos,
  searchQuery,
  cardStyle = 'normal'
}) => {
  return (
    <AnimatePresence mode="wait">
      {viewMode === "list" && (
        <motion.div
          key="list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PredictionGrid
            predictions={predictions}
            onPredictionSelect={onPredictionSelect}
            onEditClick={onEditClick}
            teamLogos={teamLogos}
            searchQuery={searchQuery}
            cardStyle={cardStyle}
          />
        </motion.div>
      )}

      {viewMode === "table" && (
        <motion.div
          key="table"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PredictionTable
            predictions={predictions}
            onPredictionSelect={onPredictionSelect}
            onEditClick={onEditClick}
            teamLogos={teamLogos}
            searchQuery={searchQuery}
            cardStyle={cardStyle}
          />
        </motion.div>
      )}

      {viewMode === "calendar" && (
        <motion.div
          key="calendar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PredictionCalendar
            predictions={predictions}
            onPredictionSelect={onPredictionSelect}
            onEditClick={onEditClick}
            teamLogos={teamLogos}
            searchQuery={searchQuery}
            cardStyle={cardStyle}
          />
        </motion.div>
      )}

      {viewMode === "stack" && (
        <motion.div
          key="stack"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PredictionStack
            predictions={predictions}
            onPredictionSelect={onPredictionSelect}
            onEditClick={onEditClick}
            teamLogos={teamLogos}
            searchQuery={searchQuery}
            cardStyle={cardStyle}
          />
        </motion.div>
      )}      {viewMode === "carousel" && (
        <motion.div
          key="carousel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PredictionCarousel
            mode="personal"
            predictions={predictions}
            onPredictionSelect={onPredictionSelect}
            onEditClick={onEditClick}
            teamLogos={teamLogos}
            searchQuery={searchQuery}
            isReadOnly={false}
            cardStyle={cardStyle}
          />
        </motion.div>
      )}

      {viewMode === "teams" && (
        <motion.div
          key="teams"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PredictionsByTeam
            predictions={predictions}
            onPredictionSelect={onPredictionSelect}
            onPredictionEdit={onEditClick}
            searchQuery={searchQuery}
            cardStyle={cardStyle}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PredictionContentView;
