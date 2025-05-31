import { motion } from "framer-motion";
import { useContext } from "react";
import {
  InfoCircledIcon,
  DoubleArrowUpIcon,
  LightningBoltIcon,
  TargetIcon,
  CalendarIcon,
  ChevronRightIcon,
  MagicWandIcon,
  PersonIcon,
  RocketIcon,
  ActivityLogIcon,
} from "@radix-ui/react-icons";
import StatCard from "../common/StatCard";
import UpcomingMatchesPanel from "../panels/UpcomingMatchesPanel";
import RecentPredictionsPanel from "../panels/RecentPredictionsPanel";
import LeaguesTable from "../tables/LeaguesTable";
import { ThemeContext } from "../../context/ThemeContext";
import { backgrounds, text, status } from "../../utils/themeUtils";

const DashboardView = ({
  upcomingMatches,
  recentPredictions,
  leagues,
  goToPredictions,
  navigateToSection,
}) => {
  // Helper function to format match data for the predictions modal
  const formatMatchForPrediction = (match) => {
    return {
      id: match.id,
      homeTeam: match.home,
      awayTeam: match.away,
      date: match.date,
      venue: match.venue || "Stadium",
      gameweek: match.gameweek || 36,
      competition: match.competition || "Premier League",
    };
  };

  // Get theme context
  const { theme } = useContext(ThemeContext);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/*Header */}
      <motion.div variants={itemVariants} className="relative">
        <div className="flex items-center justify-between mb-3">
          {" "}
          <div>
            <h1
              className={`${
                theme === "dark" ? "text-teal-100" : "text-teal-700"
              } text-3xl font-bold font-dmSerif mb-1.5`}
            >
              Welcome back
            </h1>
            <p className={`${text.secondary[theme]} font-outfit text-base`}>
              Let's check your performance and make some predictions
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon
                className={`w-3 h-3 ${
                  theme === "dark" ? "text-teal-400" : "text-teal-500"
                }`}
              />
              <span
                className={`${text.primary[theme]} text-xs font-medium font-outfit`}
              >
                Gameweek 36
              </span>
            </div>
            <div className={`${text.muted[theme]} text-xs font-outfit`}>
              Deadline: Sun 15:00
            </div>
          </div>
        </div>
        {/* Progress indicator */}
        <div
          className={`${
            theme === "dark"
              ? "bg-slate-800/30 border-slate-700/50"
              : "bg-white border-slate-200 shadow-sm"
          } rounded-xl p-3 border backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={`${
                theme === "dark" ? "text-white/80" : "text-slate-700"
              } text-xs font-medium font-outfit`}
            >
              Season Progress
            </span>
            <span
              className={`${
                theme === "dark" ? "text-teal-400" : "text-teal-600"
              } text-xs font-semibold`}
            >
              GW 36 of 38
            </span>
          </div>
          <div
            className={`w-full ${
              theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
            } rounded-full h-1.5`}
          >
            <div
              className="bg-gradient-to-r from-teal-500 to-indigo-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: "94.7%" }}
            />
          </div>
        </div>
      </motion.div>{" "}
      {/* Enhanced Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <StatCard
          title="Weekly Points"
          value="76"
          subtitle="Rank: 1,245 this week"
          badge={{
            text: "+18 from GW35",
            type: "success",
          }}
          icon={<MagicWandIcon className="w-4 h-4" />}
          trend={{ value: "+12%", direction: "up" }}
        />

        <StatCard
          title="Accuracy Rate"
          value="68%"
          subtitle="41 correct predictions"
          badge={{
            text: "Last 10 GWs",
            type: "info",
          }}
          icon={<TargetIcon className="w-4 h-4" />}
          trend={{ value: "+5%", direction: "up" }}
        />

        <StatCard
          title="Available Chips"
          value="4"
          subtitle="Double Down ready to use"
          badge={{
            icon: <InfoCircledIcon />,
            type: "neutral",
          }}
          icon={<LightningBoltIcon className="w-4 h-4" />}
        />

        <StatCard
          title="Global Rank"
          value="12.8K"
          subtitle="Top 15% worldwide"
          badge={{
            text: "↗ +2.1K",
            type: "success",
          }}
          icon={<PersonIcon className="w-4 h-4" />}
          trend={{ value: "+15%", direction: "up" }}
        />
      </motion.div>{" "}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Main Content - 2/3 width on xl screens */}
        <div className="xl:col-span-2 space-y-5">
          {/* Upcoming Matches Panel */}
          <motion.div variants={itemVariants}>
            <UpcomingMatchesPanel
              matches={upcomingMatches}
              onViewAll={() => navigateToSection("fixtures")}
              onPredictMatch={(match) =>
                goToPredictions(formatMatchForPrediction(match))
              }
            />
          </motion.div>

          {/* Recent Predictions Panel */}
          <motion.div variants={itemVariants}>
            <RecentPredictionsPanel
              predictions={recentPredictions}
              onViewAll={() => navigateToSection("predictions")}
            />
          </motion.div>
        </div>

        {/* Sidebar - 1/3 width on xl screens */}
        <div className="space-y-5">
          {/* My Leagues */}
          <motion.div variants={itemVariants}>
            <LeaguesTable
              leagues={leagues}
              onViewAll={() => navigateToSection("leagues")}
              onViewLeague={(leagueId) =>
                navigateToSection("leagues", { leagueId })
              }
            />
          </motion.div>
          {/* Performance Insights */}{" "}
          <motion.div variants={itemVariants}>
            <div
              className={`${
                theme === "dark"
                  ? "bg-slate-800/30 border-slate-700/50"
                  : "bg-white border-slate-200 shadow-sm"
              } backdrop-blur-sm rounded-xl p-5 border font-outfit`}
            >
              <div className="flex items-center gap-2 mb-3">
                <RocketIcon
                  className={`w-4 h-4 ${
                    theme === "dark" ? "text-amber-400" : "text-amber-500"
                  }`}
                />
                <h3
                  className={`${
                    theme === "dark" ? "text-teal-200" : "text-teal-700"
                  } font-semibold font-outfit text-md`}
                >
                  Performance Insights
                </h3>
              </div>
              <div className="space-y-3">
                <div
                  className={`flex items-center justify-between p-2.5 ${
                    theme === "dark" ? "bg-slate-700/30" : "bg-slate-100"
                  } rounded-lg`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span
                      className={`${
                        theme === "dark" ? "text-white/80" : "text-slate-700"
                      } text-xs`}
                    >
                      Strong home predictions
                    </span>
                  </div>
                  <span
                    className={`${
                      theme === "dark" ? "text-green-400" : "text-green-600"
                    } text-xs font-medium`}
                  >
                    +23%
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between p-2.5 ${
                    theme === "dark" ? "bg-slate-700/30" : "bg-slate-100"
                  } rounded-lg`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span
                      className={`${
                        theme === "dark" ? "text-white/80" : "text-slate-700"
                      } text-xs`}
                    >
                      Top 6 match expert
                    </span>
                  </div>
                  <span
                    className={`${
                      theme === "dark" ? "text-blue-400" : "text-blue-600"
                    } text-xs font-medium`}
                  >
                    72%
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between p-2.5 ${
                    theme === "dark" ? "bg-slate-700/30" : "bg-slate-100"
                  } rounded-lg`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                    <span
                      className={`${
                        theme === "dark" ? "text-white/80" : "text-slate-700"
                      } text-xs`}
                    >
                      Weekend warrior
                    </span>
                  </div>
                  <span
                    className={`${
                      theme === "dark" ? "text-amber-400" : "text-amber-600"
                    } text-xs font-medium`}
                  >
                    +18%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardView;
