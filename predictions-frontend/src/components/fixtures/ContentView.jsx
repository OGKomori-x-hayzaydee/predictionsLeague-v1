import { motion, AnimatePresence } from "framer-motion";
import FixtureCarousel from "./FixtureCarousel";
import FixtureList from "./FixtureList";
import FixtureCalendar from "./FixtureCalendar";
import FixtureTimeline from "./FixtureTimeline";
import FixturesByTeam from "./FixturesByTeam";
import FixtureTable from "./FixtureTable";
import FixtureStack from "./FixtureStack";

const ContentView = ({ 
  viewMode, 
  fixtures, 
  onFixtureSelect, 
  activeGameweekChips, 
  searchQuery 
}) => {
  return (
    <AnimatePresence mode="wait">
      {viewMode === "carousel" && (
        <motion.div
          key="carousel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <FixtureCarousel
            fixtures={fixtures}
            onFixtureSelect={onFixtureSelect}
            activeGameweekChips={activeGameweekChips}
            searchQuery={searchQuery}
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
          <FixturesByTeam
            fixtures={fixtures}
            onFixtureSelect={onFixtureSelect}
            searchQuery={searchQuery}
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
          <FixtureStack
            fixtures={fixtures}
            onFixtureSelect={onFixtureSelect}
            searchQuery={searchQuery}
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
          <FixtureCalendar
            fixtures={fixtures}
            onFixtureSelect={onFixtureSelect}
            searchQuery={searchQuery}
          />
        </motion.div>
      )}

      {viewMode === "timeline" && (
        <motion.div
          key="timeline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <FixtureTimeline
            fixtures={fixtures}
            onFixtureSelect={onFixtureSelect}
            searchQuery={searchQuery}
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
          <FixtureTable
            fixtures={fixtures}
            onFixtureSelect={onFixtureSelect}
            searchQuery={searchQuery}
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
          <FixtureList
            fixtures={fixtures}
            onFixtureSelect={onFixtureSelect}
            activeGameweekChips={activeGameweekChips}
            searchQuery={searchQuery}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContentView;