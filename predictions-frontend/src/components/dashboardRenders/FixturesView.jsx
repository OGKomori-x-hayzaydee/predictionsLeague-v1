import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameweekChipsPanel from "../panels/GameweekChipsPanel";
import { fixtures } from "../../data/sampleData";
import ViewToggleBar from "../ui/ViewToggleBar";
import ActiveChipsBanner from "../ui/ActiveChipsBanner";
import ContentView from "../fixtures/ContentView";

const FixturesView = ({ handleFixtureSelect, toggleChipInfoModal }) => {
  const [currentGameweek, setCurrentGameweek] = useState(36);
  const [activeGameweekChips, setActiveGameweekChips] = useState([]);
  const [viewMode, setViewMode] = useState("carousel");
  const [searchQuery, setSearchQuery] = useState("");

  // Handle applying gameweek chips
  const handleApplyGameweekChip = (chipId, gameweek, isRemoval = false) => {
    if (isRemoval) {
      setActiveGameweekChips((prev) => prev.filter((id) => id !== chipId));
    } else {
      setActiveGameweekChips((prev) => [...prev, chipId]);
    }

    // In a real app, you'd make an API call here to update the user's chip selections
    console.log(
      `${
        isRemoval ? "Removed" : "Applied"
      } gameweek chip ${chipId} for gameweek ${gameweek}`
    );
  };

  // fixture
  const onFixtureSelect = (fixture) => {
    handleFixtureSelect(fixture, activeGameweekChips);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-teal-100 text-3xl font-bold font-dmSerif">
            Fixtures
          </h1>
          <p className="text-white/70 font-outfit">
            View and predict upcoming fixtures
          </p>
        </div>

        {/* View toggle controls */}
        <ViewToggleBar viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {/* Collapsible Gameweek Chips Panel */}
      <motion.div
        initial={{ height: "auto" }}
        animate={{ height: "auto" }}
        transition={{ duration: 0.3 }}
      >
        <GameweekChipsPanel
          currentGameweek={currentGameweek}
          onApplyChip={handleApplyGameweekChip}
          toggleChipInfoModal={toggleChipInfoModal}
          activeMatchChips={[]}
          upcomingFixtures={[]}
        />
      </motion.div>

      {/* Content container with active chips banner */}
      <div className="backdrop-blur-md rounded-lg border border-primary-400/20 p-5 font-outfit">
        {/* Active gameweek chips banner */}
        <AnimatePresence>
          <ActiveChipsBanner
            activeGameweekChips={activeGameweekChips}
            currentGameweek={currentGameweek}
          />
        </AnimatePresence>

        {/* Content view */}
        <ContentView
          viewMode={viewMode}
          fixtures={fixtures}
          onFixtureSelect={onFixtureSelect}
          activeGameweekChips={activeGameweekChips}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default FixturesView;
