import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  StarIcon, 
  LightningBoltIcon, 
  PersonIcon,
  CalendarIcon,
  TargetIcon,
  ActivityLogIcon,
  RocketIcon,
  GearIcon,
  MagicWandIcon,
  DoubleArrowUpIcon,
  BadgeIcon,
  Pencil1Icon,
  CheckIcon,
  Cross2Icon
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import userAPI from "../../services/api/userAPI";
import { backgrounds, text, status } from "../../utils/themeUtils";
import StatCard from "../common/StatCard";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";

const ProfileOverview = () => {
  const { theme } = useContext(ThemeContext);
  const { user, updateUser, isLoading: authLoading } = useAuth();
  
  // State for user profile data and editing
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    favoriteTeam: '',
    bio: '',
  });

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("🔄 ProfileOverview: Fetching user profile...");
      
      const response = await userAPI.getProfile();
      if (response.success) {
        console.log("✅ ProfileOverview: User profile fetched:", response.user);
        setUserProfile(response.user);
      } else {
        throw new Error(response.error || 'Failed to fetch user profile');
      }
    } catch (err) {
      console.error("❌ ProfileOverview: Error fetching profile:", err);
      setError(err.message);
      // Fallback to auth context user data if available
      if (user) {
        console.log("🔄 ProfileOverview: Using auth context user as fallback");
        setUserProfile(user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Initialize form data when user profile data is available
  useEffect(() => {
    if (userProfile) {
      setEditFormData({
        username: userProfile.username || '',
        email: userProfile.email || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        favoriteTeam: userProfile.favoriteTeam || '',
        bio: userProfile.bio || '',
      });
    }
  }, [userProfile]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (userProfile) {
      setEditFormData({
        username: userProfile.username || '',
        email: userProfile.email || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        favoriteTeam: userProfile.favoriteTeam || '',
        bio: userProfile.bio || '',
      });
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await updateProfile(editFormData);
      if (response.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Show loading state while updating
  if (isLoading) {
    return <LoadingState message="Loading profile..." />;
  }

  // Show error state if there's an error and no fallback data
  if (error && !userProfile) {
    return <ErrorState message={`Failed to load profile: ${error}`} />;
  }

  // Use user data from temp auth context
  const displayUser = userProfile || {};
  const displayStats = user?.statistics || {};

  // Sample achievements and activity (would come from API in real app)
  const achievements = [
    { name: "Premier Predictor", icon: <StarIcon className="w-3 h-3" />, color: "teal" },
    { name: "3-Week Streak", icon: <LightningBoltIcon className="w-3 h-3" />, color: "indigo" },
    { name: "Big Six Expert", icon: <BadgeIcon className="w-3 h-3" />, color: "amber" },
    { name: "Century Club", icon: <TargetIcon className="w-3 h-3" />, color: "emerald" }
  ];

  const recentActivity = [
    { action: "Predicted Arsenal 2-1 Man City", time: "2 hours ago", points: 12 },
    { action: "Joined Office Rivalry league", time: "1 day ago", points: null },
    { action: "Used Double Down chip", time: "3 days ago", points: 24 },
    { action: "Achieved 3-week streak", time: "1 week ago", points: null }
  ];

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
      {/* Profile Header Card */}
      <motion.div
        variants={itemVariants}
        className={`${
          theme === "dark"
            ? "bg-slate-800/40 border-slate-700/50"
            : "bg-white border-slate-200 shadow-sm"
        } backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 relative overflow-hidden`}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${
          theme === "dark"
            ? "from-teal-500/5 to-indigo-500/5"
            : "from-teal-50 to-indigo-50"
        }`} />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 bg-gradient-to-br from-teal-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold font-dmSerif shadow-lg">
              {displayUser.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 ${
              theme === 'dark' ? 'bg-emerald-500 border-slate-800' : 'bg-emerald-500 border-white'
            } flex items-center justify-center`}>
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-2xl font-dmSerif`}>
                {displayUser.username || 'User'}
              </h2>
              {!isEditing && (
                <button
                  onClick={handleEditClick}
                  className={`p-1.5 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-slate-700/50 text-slate-400 hover:text-slate-300'
                      : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
                  }`}
                  title="Edit profile"
                >
                  <Pencil1Icon className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className={`${text.secondary[theme]} font-outfit mb-4`}>
              Member since {displayUser.memberSince || 'Recently'} • Global Rank #{displayStats.currentRank || 0}
            </p>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement, index) => (
                <span 
                  key={index}
                  className={`${
                    achievement.color === 'teal' 
                      ? theme === 'dark' ? 'bg-teal-700/20 text-teal-300' : 'bg-teal-100 text-teal-700'
                      : achievement.color === 'indigo'
                      ? theme === 'dark' ? 'bg-indigo-700/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                      : achievement.color === 'amber'
                      ? theme === 'dark' ? 'bg-amber-700/20 text-amber-300' : 'bg-amber-100 text-amber-700'
                      : theme === 'dark' ? 'bg-emerald-700/20 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                  } text-xs font-medium py-1 px-2 rounded-full flex items-center gap-1`}
                >
                  {achievement.icon} {achievement.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <div className={`${
          theme === "dark"
            ? "bg-slate-800/40 border-slate-700/50"
            : "bg-white border-slate-200 shadow-sm"
        } backdrop-blur-sm rounded-xl p-5 border transition-all duration-200`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg border ${
                theme === "dark"
                  ? "bg-teal-500/10 border-teal-500/20"
                  : "bg-teal-50 border-teal-200"
              }`}>
                <PersonIcon className={`w-4 h-4 ${
                  theme === "dark" ? "text-teal-400" : "text-teal-600"
                }`} />
              </div>
              <h3 className={`${theme === 'dark' ? 'text-teal-200' : 'text-teal-700'} font-outfit font-semibold text-base`}>
                Account Information
              </h3>
            </div>
            {isEditing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={isLoading}
                  className={`p-1.5 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  } disabled:opacity-50`}
                  title="Save changes"
                >
                  <CheckIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={`p-1.5 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-slate-600 hover:bg-slate-700 text-white'
                      : 'bg-slate-600 hover:bg-slate-700 text-white'
                  }`}
                  title="Cancel"
                >
                  <Cross2Icon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Username Field */}
            <div className="flex justify-between items-center">
              <span className={`${text.muted[theme]} text-sm font-outfit`}>Username</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editFormData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`px-2 py-1 rounded text-sm border ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  } font-outfit font-medium`}
                />
              ) : (
                <span className={`${text.primary[theme]} font-outfit font-medium`}>
                  {displayUser.username || 'Not set'}
                </span>
              )}
            </div>
            
            {/* Email Field */}
            <div className="flex justify-between items-center">
              <span className={`${text.muted[theme]} text-sm font-outfit`}>Email</span>
              {isEditing ? (
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`px-2 py-1 rounded text-sm border ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  } font-outfit font-medium`}
                />
              ) : (
                <span className={`${text.primary[theme]} font-outfit font-medium`}>
                  {displayUser.email || 'Not set'}
                </span>
              )}
            </div>
            
            {/* First Name Field */}
            <div className="flex justify-between items-center">
              <span className={`${text.muted[theme]} text-sm font-outfit`}>First Name</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editFormData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`px-2 py-1 rounded text-sm border ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  } font-outfit font-medium`}
                />
              ) : (
                <span className={`${text.primary[theme]} font-outfit font-medium`}>
                  {displayUser.firstName || 'Not set'}
                </span>
              )}
            </div>
            
            {/* Last Name Field */}
            <div className="flex justify-between items-center">
              <span className={`${text.muted[theme]} text-sm font-outfit`}>Last Name</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editFormData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`px-2 py-1 rounded text-sm border ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  } font-outfit font-medium`}
                />
              ) : (
                <span className={`${text.primary[theme]} font-outfit font-medium`}>
                  {displayUser.lastName || 'Not set'}
                </span>
              )}
            </div>
            
            {/* Favorite Team Field */}
            <div className="flex justify-between items-center">
              <span className={`${text.muted[theme]} text-sm font-outfit`}>Favorite Team</span>
              {isEditing ? (
                <select
                  value={editFormData.favoriteTeam}
                  onChange={(e) => handleInputChange('favoriteTeam', e.target.value)}
                  className={`px-2 py-1 rounded text-sm border ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-900'
                  } font-outfit font-medium`}
                >
                  <option value="">Select a team</option>
                  <option value="Arsenal">Arsenal</option>
                  <option value="Chelsea">Chelsea</option>
                  <option value="Liverpool">Liverpool</option>
                  <option value="Manchester City">Manchester City</option>
                  <option value="Manchester United">Manchester United</option>
                  <option value="Tottenham">Tottenham</option>
                </select>
              ) : (
                <div className="flex items-center gap-2">
                  <span className={`${text.primary[theme]} font-outfit font-medium`}>
                    {displayUser.favoriteTeam || 'Not set'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`${
          theme === "dark"
            ? "bg-slate-800/40 border-slate-700/50"
            : "bg-white border-slate-200 shadow-sm"
        } backdrop-blur-sm rounded-xl p-5 border transition-all duration-200`}>
          <div className="flex items-center gap-2 mb-4">
            <div className={`p-1.5 rounded-lg border ${
              theme === "dark"
                ? "bg-teal-500/10 border-teal-500/20"
                : "bg-teal-50 border-teal-200"
            }`}>
              <ActivityLogIcon className={`w-4 h-4 ${
                theme === "dark" ? "text-teal-400" : "text-teal-600"
              }`} />
            </div>
            <h3 className={`${theme === 'dark' ? 'text-teal-200' : 'text-teal-700'} font-outfit font-semibold text-base`}>
              Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            {(displayUser.recentActivity || []).map((activity, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                theme === "dark"
                  ? "bg-slate-700/20 border-slate-600/20"
                  : "bg-slate-50/50 border-slate-200/50"
              } border`}>
                <div className="flex-1">
                  <p className={`${text.primary[theme]} font-outfit text-sm font-medium`}>
                    {activity.action}
                  </p>
                  <p className={`${text.muted[theme]} font-outfit text-xs`}>
                    {activity.time}
                  </p>
                </div>
                {activity.points && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    theme === "dark"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-emerald-50 text-emerald-600"
                  }`}>
                    <DoubleArrowUpIcon className="w-3 h-3" />
                    +{activity.points}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Performance Highlights */}
      <motion.div variants={itemVariants} className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } backdrop-blur-sm rounded-xl p-5 border transition-all duration-200`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg border ${
            theme === "dark"
              ? "bg-teal-500/10 border-teal-500/20"
              : "bg-teal-50 border-teal-200"
          }`}>
            <MagicWandIcon className={`w-4 h-4 ${
              theme === "dark" ? "text-teal-400" : "text-teal-600"
            }`} />
          </div>
          <h3 className={`${theme === 'dark' ? 'text-teal-200' : 'text-teal-700'} font-outfit font-semibold text-base`}>
            Performance Highlights
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${
            theme === "dark"
              ? "bg-slate-700/20 border-slate-600/20"
              : "bg-slate-50/50 border-slate-200/50"
          } border`}>
            <div className="flex items-center gap-2 mb-2">
              <BadgeIcon className={`w-4 h-4 ${
                theme === "dark" ? "text-amber-400" : "text-amber-600"
              }`} />
              <span className={`${text.primary[theme]} font-outfit font-medium text-sm`}>
                Best Gameweek
              </span>
            </div>
            <p className={`${text.primary[theme]} font-dmSerif text-2xl font-bold`}>
              GW{displayUser.bestGameweek?.week || 0}
            </p>
            <p className={`${text.muted[theme]} font-outfit text-xs`}>
              {displayUser.bestGameweek?.points || 0} points scored
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            theme === "dark"
              ? "bg-slate-700/20 border-slate-600/20"
              : "bg-slate-50/50 border-slate-200/50"
          } border`}>
            <div className="flex items-center gap-2 mb-2">
              <StarIcon className={`w-4 h-4 ${
                theme === "dark" ? "text-indigo-400" : "text-indigo-600"
              }`} />
              <span className={`${text.primary[theme]} font-outfit font-medium text-sm`}>
                Favorite Fixture
              </span>
            </div>
            <p className={`${text.primary[theme]} font-dmSerif text-lg font-bold`}>
              Arsenal vs Spurs
            </p>
            <p className={`${text.muted[theme]} font-outfit text-xs`}>
              85% prediction accuracy
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            theme === "dark"
              ? "bg-slate-700/20 border-slate-600/20"
              : "bg-slate-50/50 border-slate-200/50"
          } border`}>
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className={`w-4 h-4 ${
                theme === "dark" ? "text-emerald-400" : "text-emerald-600"
              }`} />
              <span className={`${text.primary[theme]} font-outfit font-medium text-sm`}>
                Most Active Day
              </span>
            </div>
            <p className={`${text.primary[theme]} font-dmSerif text-lg font-bold`}>
              Saturday
            </p>
            <p className={`${text.muted[theme]} font-outfit text-xs`}>
              67% of predictions made
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileOverview;
