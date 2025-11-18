import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChartIcon, 
  CalendarIcon, 
  TargetIcon,
  RocketIcon,
  LightningBoltIcon,
  MagicWandIcon,
  BadgeIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";
import { userAPI } from "../../services/api/userAPI";

// Modern Setting Card Component
const SettingCard = ({ title, description, icon: Icon, children, className = "" }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <motion.div
      className={`backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 ${
        theme === "dark"
          ? "border-slate-700/50 bg-slate-800/40"
          : "border-slate-200 bg-white shadow-sm"
      } ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className={`p-2 rounded-lg ${
            theme === "dark" 
              ? "bg-teal-500/10 text-teal-400" 
              : "bg-teal-50 text-teal-600"
          }`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h3 className={`${text.primary[theme]} font-outfit font-semibold text-lg`}>
            {title}
          </h3>
          {description && (
            <p className={`${text.secondary[theme]} text-sm mt-1 font-outfit`}>
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </motion.div>
  );
};

// Modern Stat Card Component
const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "teal" }) => {
  const { theme } = useContext(ThemeContext);
  
  const colorClasses = {
    teal: theme === "dark" ? "bg-teal-500/10 border-teal-500/30 text-teal-400" : "bg-teal-50 border-teal-200 text-teal-600",
    blue: theme === "dark" ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-600",
    purple: theme === "dark" ? "bg-purple-500/10 border-purple-500/30 text-purple-400" : "bg-purple-50 border-purple-200 text-purple-600",
    emerald: theme === "dark" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600",
    amber: theme === "dark" ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600",
  };

  return (
    <motion.div
      className={`rounded-lg p-4 border transition-all duration-200 hover:scale-[1.02] ${colorClasses[color] || colorClasses.teal}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          <span className="text-sm font-medium font-outfit">
            {title}
          </span>
        </div>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            trend > 0
              ? theme === "dark" ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"
              : theme === "dark" ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-700"
          }`}>
            {trend > 0 ? `+${trend}%` : `${trend}%`}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-outfit mb-1">
        {value}
      </div>
      {subtitle && (
        <div className="text-xs font-outfit opacity-80">
          {subtitle}
        </div>
      )}
    </motion.div>
  );
};

const ProfileStatistics = () => {
  const { theme } = useContext(ThemeContext);
  
  // State for API data
  const [highlights, setHighlights] = useState(null);
  const [isLoadingHighlights, setIsLoadingHighlights] = useState(true);
  const [teamStats, setTeamStats] = useState(null);
  const [isLoadingTeamStats, setIsLoadingTeamStats] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [isLoadingMonthlyStats, setIsLoadingMonthlyStats] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Utility function to generate highlight descriptions
  const generateDescription = (type, data) => {
    if (!data) return 'No data available';
    
    switch (type) {
      case 'bestGameweek':
        return data.points !== undefined ? `${data.points} points scored` : 'No data available';
      case 'favoriteFixture':
        return data.accuracy !== undefined ? `${data.accuracy}% prediction accuracy` : 'No data available';
      case 'mostActiveDay':
        return data.percentage !== undefined ? `${data.percentage}% of predictions made` : 'No data available';
      default:
        return 'No data available';
    }
  };

  // Utility function to format team names
  const formatTeamName = (teamName) => {
    if (!teamName) return 'Unknown Team';
    
    // Handle special cases
    const specialCases = {
      'MANCITY': 'Manchester City',
      'MANUNITED': 'Manchester United',
      'SPURS': 'Tottenham'
    };
    
    if (specialCases[teamName]) {
      return specialCases[teamName];
    }
    
    // Convert to lowercase then capitalize first letter of each word
    return teamName
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Load highlights data
  useEffect(() => {
    const loadHighlights = async () => {
      try {
        setIsLoadingHighlights(true);
        const response = await userAPI.getStatisticsHighlights();
        
        if (response.success && response.data) {
          setHighlights(response.data);
        }
      } catch (error) {
        console.error('Failed to load highlights:', error);
      } finally {
        setIsLoadingHighlights(false);
      }
    };

    loadHighlights();
  }, []);

  // Load team performance data
  useEffect(() => {
    const loadTeamStats = async () => {
      try {
        setIsLoadingTeamStats(true);
        const response = await userAPI.getTeamPerformance();
        
        if (response.success && response.data) {
          // The API returns { data: { data: [...] } }
          const teamData = response.data.data;
          if (Array.isArray(teamData)) {
            // Process team data - show all teams, even with 0 predictions for now
            const processedTeamStats = teamData.map(team => ({
              ...team,
              // Use 'team' field as teamName for consistency with formatTeamName function
              teamName: team.team,
              displayName: formatTeamName(team.team)
            }));
            
            setTeamStats(processedTeamStats);
          } else {
            setTeamStats([]);
          }
        } else {
          setTeamStats([]);
        }
      } catch (error) {
        console.error('Failed to load team stats:', error);
      } finally {
        setIsLoadingTeamStats(false);
      }
    };

    loadTeamStats();
  }, []);

  // Load monthly performance data
  useEffect(() => {
    const loadMonthlyStats = async () => {
      try {
        setIsLoadingMonthlyStats(true);
        const response = await userAPI.getMonthlyPerformance();
        
        if (response.success && response.data) {
          // The API returns { data: { data: [...] } }
          const monthlyData = response.data.data;
          if (Array.isArray(monthlyData)) {
            setMonthlyStats(monthlyData);
          } else {
            setMonthlyStats([]);
          }
        } else {
          setMonthlyStats([]);
        }
      } catch (error) {
        console.error('Failed to load monthly stats:', error);
      } finally {
        setIsLoadingMonthlyStats(false);
      }
    };

    loadMonthlyStats();
  }, []);

  const maxTeamPoints = teamStats ? Math.max(...teamStats.map(t => t.points)) : 0;

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Performance Highlights */}
      <SettingCard 
        title="Performance Highlights" 
        description="Your best prediction achievements"
        icon={MagicWandIcon}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Best Gameweek */}
          <StatCard
            title="Best Gameweek"
            value={isLoadingHighlights ? "..." : highlights?.bestGameweek?.gameweek || 'N/A'}
            subtitle={isLoadingHighlights ? "Loading..." : `${highlights?.bestGameweek?.points || 0} points scored`}
            icon={BadgeIcon}
            color="amber"
          />

          {/* Favorite Fixture */}
          <StatCard
            title="Favorite Fixture"
            value={isLoadingHighlights ? "..." : highlights?.favoriteFixture?.fixture || 'N/A'}
            subtitle={isLoadingHighlights ? "Loading..." : `${highlights?.favoriteFixture?.accuracy || 0}% accuracy`}
            icon={StarIcon}
            color="purple"
          />

          {/* Most Active Day */}
          <StatCard
            title="Most Active Day"
            value={isLoadingHighlights ? "..." : highlights?.mostActiveDay?.day || 'N/A'}
            subtitle={isLoadingHighlights ? "Loading..." : `${highlights?.mostActiveDay?.percentage || 0}% of predictions`}
            icon={CalendarIcon}
            color="blue"
          />
        </div>
      </SettingCard>

      {/* Monthly Performance Chart */}
      <SettingCard 
        title="Monthly Performance" 
        description="Your prediction accuracy over time"
        icon={BarChartIcon}
      >
        <div className="space-y-4">
          {isLoadingMonthlyStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className={`h-20 ${theme === "dark" ? "bg-slate-600" : "bg-slate-200"} rounded-lg mb-2`}></div>
                  <div className={`h-3 ${theme === "dark" ? "bg-slate-600" : "bg-slate-200"} rounded w-3/4 mx-auto`}></div>
                </div>
              ))}
            </div>
          ) : monthlyStats && monthlyStats.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {monthlyStats.map((month, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  theme === "dark" 
                    ? "bg-slate-700/20 border-slate-600/20" 
                    : "bg-slate-50/50 border-slate-200/50"
                }`}>
                  <div className="text-center">
                    <p className={`${text.primary[theme]} font-outfit font-bold text-lg`}>
                      {month.accuracy}%
                    </p>
                    <p className={`${text.muted[theme]} font-outfit text-xs mb-1`}>
                      {month.month}
                    </p>
                    <p className={`${text.muted[theme]} font-outfit text-xs mb-2`}>
                      {month.predictions} predictions • {month.points} pts
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-2 dark:bg-slate-700">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${
                          theme === "dark" 
                            ? "from-teal-500 to-indigo-500" 
                            : "from-teal-600 to-indigo-600"
                        }`}
                        style={{ width: `${month.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`${text.muted[theme]} font-outfit text-sm text-center py-4`}>
              No monthly performance data available
            </div>
          )}
        </div>
      </SettingCard>

      {/* Team Performance */}
      <SettingCard 
        title="Team Performance" 
        description="Your prediction success by team"
        icon={TargetIcon}
      >
        <div className="space-y-4">
          {isLoadingTeamStats ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between p-3 rounded-lg">
                  <div className={`h-4 ${theme === "dark" ? "bg-slate-600" : "bg-slate-200"} rounded w-1/3`}></div>
                  <div className={`h-4 ${theme === "dark" ? "bg-slate-600" : "bg-slate-200"} rounded w-16`}></div>
                </div>
              ))}
            </div>
          ) : teamStats && teamStats.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {teamStats.map((team, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  theme === "dark" 
                    ? "bg-slate-700/20 border-slate-600/20" 
                    : "bg-slate-50/50 border-slate-200/50"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${text.primary[theme]} font-outfit font-medium text-sm`}>
                        {formatTeamName(team.teamName)}
                      </p>
                      <p className={`${text.muted[theme]} font-outfit text-xs`}>
                        {team.predictions} predictions • {team.accuracy}% accuracy
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`${text.primary[theme]} font-dmSerif font-bold`}>
                        {team.points} pts
                      </p>
                      <p className={`${text.muted[theme]} font-outfit text-xs`}>
                        {team.correct}/{team.predictions}
                      </p>
                      <div className="w-16 bg-slate-200 rounded-full h-1 dark:bg-slate-700 mt-1">
                        <div 
                          className={`h-1 rounded-full bg-gradient-to-r ${
                            theme === "dark" 
                              ? "from-teal-500 to-indigo-500" 
                              : "from-teal-600 to-indigo-600"
                          }`}
                          style={{ width: `${maxTeamPoints > 0 ? (team.points / maxTeamPoints) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`${text.muted[theme]} font-outfit text-sm text-center py-4`}>
              No team performance data available
            </div>
          )}
        </div>
      </SettingCard>

    </motion.div>
  );
};

export default ProfileStatistics;