import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  EnterIcon,
  PersonIcon,
  StarIcon,
  CalendarIcon,
  EyeOpenIcon,
  GearIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

import useLeagues from "../../hooks/useLeagues";
import { showToast } from "../../services/notificationService";
import CreateLeagueForm from "../leagues/CreateLeagueForm";
import JoinLeagueForm from "../leagues/JoinLeagueForm";
import Modal from "../ui/Modal";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import SearchInput from "../common/SearchInput";
import { ThemeContext } from "../../context/ThemeContext";
import { text, backgrounds, buttons } from "../../utils/themeUtils";

const LeaguesView = ({ onViewLeague, onManageLeague }) => {
  const [activeTab, setActiveTab] = useState("my-leagues");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joiningLeague, setJoiningLeague] = useState(false);
  const [leagueCode, setLeagueCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Get theme context
  const { theme } = useContext(ThemeContext);

  // Use our custom hook to get league data and functions
  const {
    myLeagues,
    featuredLeagues,
    isLoading,
    error,
    joinLeague,
    joinFeaturedLeague,
  } = useLeagues();

  // Filter leagues based on search query
  const filteredMyLeagues = myLeagues.filter(
    (league) =>
      league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      league.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeaturedLeagues = featuredLeagues.filter(
    (league) =>
      league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      league.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle joining a league with code
  const handleJoinWithCode = async () => {
    if (!leagueCode.trim()) {
      showToast("Please enter a league code", "warning");
      return;
    }

    setJoiningLeague(true);

    const result = await joinLeague(leagueCode);

    if (result.success) {
      showToast(result.message, "success");
      setLeagueCode("");
      setShowJoinModal(false);
      setActiveTab("my-leagues");
    } else {
      showToast(result.message, "error");
    }

    setJoiningLeague(false);
  };

  // Handle joining a featured league
  const handleJoinFeaturedLeague = async (leagueId) => {
    setJoiningLeague(true);

    const result = await joinFeaturedLeague(leagueId);

    if (result.success) {
      showToast(result.message, "success");
      setActiveTab("my-leagues");
    } else {
      showToast(result.message, "warning");
    }

    setJoiningLeague(false);
  };

  // Handle viewing league details
  const handleViewLeague = (leagueId) => {
    onViewLeague(leagueId);
  };

  // Handle managing a league
  const handleManageLeague = (league) => {
    onManageLeague(league.id);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Loading state
  if (isLoading && activeTab === "my-leagues") {
    return <LoadingState message="Loading your leagues..." />;
  }

  // Error state
  if (error && activeTab === "my-leagues") {
    return (
      <ErrorState error={error} onRetry={() => window.location.reload()} />
    );
  }
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center">
            <h1
              className={`${
                theme === "dark" ? "text-teal-100" : "text-teal-700"
              } text-3xl font-bold font-dmSerif`}
            >
              My Leagues
            </h1>
            <div
              className={`ml-3 mt-1 ${
                theme === "dark"
                  ? "bg-teal-900/30 text-teal-300"
                  : "bg-teal-100 text-teal-700"
              } text-xs px-2.5 py-1 rounded-full`}
            >
              {myLeagues.length} {myLeagues.length === 1 ? "League" : "Leagues"}
            </div>
          </div>
          <p className={`${text.secondary[theme]} font-outfit mt-1`}>
            Manage your leagues, check rankings, and join competitions
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowJoinModal(true)}
            className={`px-3 py-1.5 ${
              theme === "dark"
                ? "bg-slate-700/60 hover:bg-slate-700/80 border-slate-500/30"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200"
            } border rounded-md transition-colors flex items-center ${
              text.primary[theme]
            } text-sm font-outfit`}
          >
            <EnterIcon className="mr-1.5 w-3.5 h-3.5" />
            Join League
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreateModal(true)}
            className={`${buttons.primary[theme]} px-3 py-1.5 rounded-md transition-colors flex items-center text-white text-sm font-medium font-outfit`}
          >
            <PlusCircledIcon className="mr-1.5 w-3.5 h-3.5" />
            Create League
          </motion.button>
        </div>
      </div>
      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search leagues..."
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Tab Navigation */}
          <div
            className={`flex ${
              theme === "dark"
                ? "bg-slate-800/50 border-slate-700/30"
                : "bg-slate-100 border-slate-200"
            } rounded-xl p-1 border`}
          >
            <button
              onClick={() => setActiveTab("my-leagues")}
              className={`px-4 py-2 rounded-lg text-sm font-medium font-outfit transition-all duration-200 ${
                activeTab === "my-leagues"
                  ? `bg-teal-600 text-white shadow-lg ${
                      theme === "dark"
                        ? "shadow-teal-600/20"
                        : "shadow-teal-600/10"
                    }`
                  : `${
                      theme === "dark"
                        ? "text-slate-300 hover:text-white hover:bg-slate-700/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                    }`
              }`}
            >
              My Leagues
            </button>
            <button
              onClick={() => setActiveTab("discover")}
              className={`px-4 py-2 rounded-lg text-sm font-medium font-outfit transition-all duration-200 ${
                activeTab === "discover"
                  ? `bg-teal-600 text-white shadow-lg ${
                      theme === "dark"
                        ? "shadow-teal-600/20"
                        : "shadow-teal-600/10"
                    }`
                  : `${
                      theme === "dark"
                        ? "text-slate-300 hover:text-white hover:bg-slate-700/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                    }`
              }`}
            >
              Discover
            </button>
          </div>
        </div>
      </motion.div>
      {/* Content Section */}
      <AnimatePresence mode="wait">
        {activeTab === "my-leagues" ? (
          <MyLeaguesContent
            leagues={filteredMyLeagues}
            isLoading={isLoading}
            onViewLeague={handleViewLeague}
            onManageLeague={handleManageLeague}
            onCreateLeague={() => setShowCreateModal(true)}
            onJoinLeague={() => setShowJoinModal(true)}
          />
        ) : (
          <DiscoverContent
            leagues={filteredFeaturedLeagues}
            isLoading={isLoading}
            onJoinLeague={handleJoinFeaturedLeague}
            isJoining={joiningLeague}
          />
        )}
      </AnimatePresence>{" "}
      {/* Create League Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <Modal onClose={() => setShowCreateModal(false)}>
            <CreateLeagueForm
              onCancel={() => setShowCreateModal(false)}
              onSuccess={() => {
                setShowCreateModal(false);
                showToast("League created successfully!", "success");
                setActiveTab("my-leagues");
              }}
            />
          </Modal>
        )}
      </AnimatePresence>
      {/* Join League Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <Modal onClose={() => setShowJoinModal(false)}>
            <JoinLeagueForm
              leagueCode={leagueCode}
              onLeagueCodeChange={setLeagueCode}
              onCancel={() => setShowJoinModal(false)}
              onSubmit={handleJoinWithCode}
              isLoading={joiningLeague}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

// My Leagues Content Component
const MyLeaguesContent = ({
  leagues,
  isLoading,
  onViewLeague,
  onManageLeague,
  onCreateLeague,
  onJoinLeague,
}) => {
  const { theme } = useContext(ThemeContext);

  if (isLoading) {
    return <LoadingState message="Loading your leagues..." />;
  }

  if (leagues.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="max-w-md mx-auto">
          <h3
            className={`text-xl font-semibold ${text.primary[theme]} mb-2 font-outfit`}
          >
            No Leagues Yet
          </h3>
          <p className={`${text.secondary[theme]} mb-6 font-outfit`}>
            Create your first league or join an existing one to start competing!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onCreateLeague}
              className={`flex items-center justify-center gap-2 px-6 py-3 ${
                buttons.primary[theme]
              } rounded-xl text-white font-medium font-outfit transition-all duration-200 shadow-lg ${
                theme === "dark" ? "shadow-teal-600/20" : "shadow-teal-600/10"
              }`}
            >
              <PlusIcon className="w-4 h-4" />
              Create League
            </button>
            <button
              onClick={onJoinLeague}
              className={`flex items-center justify-center gap-2 px-6 py-3 ${
                theme === "dark"
                  ? "bg-slate-700/60 hover:bg-slate-700/80 border-slate-600/40"
                  : "bg-slate-100 hover:bg-slate-200 border-slate-200"
              } border rounded-xl ${
                text.primary[theme]
              } font-medium font-outfit transition-all duration-200`}
            >
              <EnterIcon className="w-4 h-4" />
              Join League
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {leagues.map((league, index) => (
        <LeagueCard
          key={league.id}
          league={league}
          index={index}
          onView={() => onViewLeague(league.id)}
          onManage={() => onManageLeague(league)}
        />
      ))}
    </motion.div>
  );
};

// Discover Content Component
const DiscoverContent = ({ leagues, isLoading, onJoinLeague, isJoining }) => {
  if (isLoading) {
    return <LoadingState message="Discovering leagues..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {leagues.map((league, index) => (
        <FeaturedLeagueCard
          key={league.id}
          league={league}
          index={index}
          onJoin={() => onJoinLeague(league.id)}
          isJoining={isJoining}
        />
      ))}
    </motion.div>
  );
};

// League Card Component
const LeagueCard = ({ league, index, onView, onManage }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative ${
        theme === "dark"
          ? "bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50"
          : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
      } backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 overflow-hidden font-outfit`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-gradient-to-br from-teal-500/5 to-indigo-500/5"
            : "bg-gradient-to-br from-teal-500/3 to-indigo-500/3"
        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Admin badge */}
      {league.isAdmin && (
        <div
          className={`absolute top-4 right-4 px-2 py-1 ${
            theme === "dark"
              ? "bg-amber-500/10 border-amber-500/20"
              : "bg-amber-50 border-amber-200"
          } border rounded-lg`}
        >
          <span
            className={`text-xs font-medium ${
              theme === "dark" ? "text-amber-400" : "text-amber-600"
            }`}
          >
            Admin
          </span>
        </div>
      )}

      <div className="relative">
        {/* League Header */}
        <div className="mb-4">
          <h3
            className={`text-lg font-medium ${
              theme === "dark" ? "text-teal-200" : "text-teal-700"
            } mb-2 line-clamp-1 font-outfit`}
          >
            {league.name}
          </h3>
          <p
            className={`text-sm ${text.secondary[theme]} line-clamp-2 font-outfit`}
          >
            {league.description}
          </p>
        </div>

        {/* League Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <PersonIcon className={`w-4 h-4 ${text.muted[theme]}`} />
              <span
                className={`text-lg font-bold ${text.primary[theme]} font-outfit`}
              >
                {league.members}
              </span>
            </div>
            <span className={`text-xs ${text.muted[theme]} font-outfit`}>
              Members
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CalendarIcon className={`w-4 h-4 ${text.muted[theme]}`} />
              <span
                className={`text-lg font-bold ${text.primary[theme]} font-outfit`}
              >
                #{league.position || "N/A"}
              </span>
            </div>
            <span className={`text-xs ${text.muted[theme]} font-outfit`}>
              Position
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onView}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 ${
              theme === "dark"
                ? "bg-slate-700/60 hover:bg-slate-700/80 border-slate-600/40"
                : "bg-slate-100 hover:bg-slate-200 border-slate-200"
            } border rounded-xl ${
              text.primary[theme]
            } text-sm font-medium font-outfit transition-all duration-200`}
          >
            <EyeOpenIcon className="w-4 h-4" />
            View
          </button>
          {league.isAdmin && (
            <button
              onClick={onManage}
              className={`flex items-center justify-center px-4 py-2.5 ${
                theme === "dark"
                  ? "bg-teal-600/20 hover:bg-teal-600/30 border-teal-500/30 text-teal-400"
                  : "bg-teal-100 hover:bg-teal-200 border-teal-200 text-teal-600"
              } border rounded-xl text-sm font-medium font-outfit transition-all duration-200`}
            >
              <GearIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Featured League Card Component
const FeaturedLeagueCard = ({ league, index, onJoin, isJoining }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative ${
        theme === "dark"
          ? "bg-slate-800/30 border-slate-700/50 hover:border-slate-600/60"
          : "bg-white border-slate-200 shadow-sm hover:border-slate-300"
      } backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 overflow-hidden font-outfit`}
    >
      {/* Background gradient */}
      <div
        className={`absolute inset-0 ${
          theme === "dark"
            ? "bg-gradient-to-br from-indigo-500/5 to-purple-500/5"
            : "bg-gradient-to-br from-indigo-500/3 to-purple-500/3"
        } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="relative">
        {/* League Header */}
        <div className="mb-4">
          <h3
            className={`text-lg font-semibold ${text.primary[theme]} mb-2 line-clamp-1 font-outfit`}
          >
            {league.name}
          </h3>
          <p
            className={`text-sm ${text.secondary[theme]} line-clamp-2 font-outfit`}
          >
            {league.description}
          </p>
        </div>

        {/* League Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <PersonIcon className={`w-4 h-4 ${text.muted[theme]}`} />
              <span
                className={`text-sm font-bold ${text.primary[theme]} font-outfit`}
              >
                {league.members}
              </span>
            </div>
            <span className={`text-xs ${text.muted[theme]} font-outfit`}>
              Members
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <StarIcon className={`w-4 h-4 ${text.muted[theme]}`} />
              <span
                className={`text-sm font-bold ${text.primary[theme]} font-outfit`}
              >
                {league.rating || "4.8"}
              </span>
            </div>
            <span className={`text-xs ${text.muted[theme]} font-outfit`}>
              Rating
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <span
                className={`text-sm font-bold ${text.primary[theme]} font-outfit`}
              >
                {league.prize || "Free"}
              </span>
            </div>
            <span className={`text-xs ${text.muted[theme]} font-outfit`}>
              Prize
            </span>
          </div>
        </div>

        {/* Join Button */}
        <button
          onClick={onJoin}
          disabled={isJoining}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 ${
            buttons.primary[theme]
          } disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white text-sm font-medium font-outfit transition-all duration-200 shadow-lg ${
            theme === "dark" ? "shadow-indigo-600/20" : "shadow-indigo-600/10"
          }`}
        >
          {isJoining ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Joining...
            </>
          ) : (
            <>
              <EnterIcon className="w-4 h-4" />
              Join League
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default LeaguesView;
