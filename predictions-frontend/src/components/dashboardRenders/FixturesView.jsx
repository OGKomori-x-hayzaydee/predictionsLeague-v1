import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameweekChipsPanel from "../panels/GameweekChipsPanel";
import ViewToggleBar from "../ui/ViewToggleBar";
import ActiveChipsBanner from "../ui/ActiveChipsBanner";
import ContentView from "../fixtures/ContentView";
import { fixtures, gameweeks, upcomingMatches } from "../../data/sampleData";

const FixturesView = ({ handleFixtureSelect, toggleChipInfoModal }) => {
  const [currentGameweek, setCurrentGameweek] = useState(
    gameweeks?.[0]?.id || 36
  );
  const [activeGameweekChips, setActiveGameweekChips] = useState([]);
  const [viewMode, setViewMode] = useState("teams");
  const [searchQuery, setSearchQuery] = useState("");

  // Handle applying gameweek chips
  const handleApplyGameweekChip = (chipId, gameweek, isRemoval = false) => {
    if (isRemoval) {
      setActiveGameweekChips((prev) => prev.filter((id) => id !== chipId));
    } else {
      setActiveGameweekChips((prev) => [...prev, chipId]);
    }

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
          upcomingFixtures={upcomingMatches || []}
        />
      </motion.div>
      {/* Content container with active chips banner */}
      <div className="backdrop-blur-md rounded-lg border border-primary-400/20 p-5 font-outfit">
        {/* Content view */}
        <>
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
        </>
      </div>
    </div>
  );
};

export default FixturesView;
