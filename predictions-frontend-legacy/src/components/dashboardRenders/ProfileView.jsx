import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { notificationManager } from "../../services/notificationService";
import { text } from "../../utils/themeUtils";
import userAPI from "../../services/api/userAPI";
import dashboardAPI from "../../services/api/dashboardAPI";
import leagueAPI from "../../services/api/leagueAPI";
import { useChipStatus } from "../../hooks/useChips";
import { useRecentActivity } from "../../hooks/useNotifications";
import StatCardOption3 from "../common/StatCardOption3";
import ProfileHero from "../profile/ProfileHero";
import ProfileLeagues from "../profile/ProfileLeagues";
import ProfileChipArsenal from "../profile/ProfileChipArsenal";
import LoadingState from "../common/LoadingState";
import { SecondaryButton } from "../ui/buttons";
import {
  BarChartIcon,
  TargetIcon,
  LightningBoltIcon,
  PersonIcon,
  ActivityLogIcon,
  MagicWandIcon,
  BadgeIcon,
  StarIcon,
  CalendarIcon,
  LockClosedIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Pencil1Icon,
  CheckIcon,
  Cross2Icon,
  ExclamationTriangleIcon,
  TrashIcon,
  RocketIcon,
  DoubleArrowUpIcon,
} from "@radix-ui/react-icons";

// ─── Section Card ───────────────────────────────────────────
const SectionCard = ({
  title,
  description,
  icon: Icon,
  children,
  accentColor = "teal",
}) => {
  const { theme } = useContext(ThemeContext);

  const iconColors = {
    teal:
      theme === "dark"
        ? "bg-teal-500/10 text-teal-400"
        : "bg-teal-50 text-teal-600",
    blue:
      theme === "dark"
        ? "bg-blue-500/10 text-blue-400"
        : "bg-blue-50 text-blue-600",
    purple:
      theme === "dark"
        ? "bg-purple-500/10 text-purple-400"
        : "bg-purple-50 text-purple-600",
    amber:
      theme === "dark"
        ? "bg-amber-500/10 text-amber-400"
        : "bg-amber-50 text-amber-600",
    indigo:
      theme === "dark"
        ? "bg-indigo-500/10 text-indigo-400"
        : "bg-indigo-50 text-indigo-600",
  };

  return (
    <motion.div
      className={`backdrop-blur-sm rounded-xl p-5 sm:p-6 border transition-all duration-200 ${
        theme === "dark"
          ? "border-slate-700/50 bg-slate-800/40"
          : "border-slate-200 bg-white shadow-sm"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div
              className={`p-2 rounded-lg ${
                iconColors[accentColor] || iconColors.teal
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          )}
          <div>
            <h3
              className={`${text.primary[theme]} font-outfit font-semibold text-base sm:text-lg`}
            >
              {title}
            </h3>
            {description && (
              <p
                className={`${text.secondary[theme]} text-xs sm:text-sm mt-0.5 font-outfit`}
              >
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      {children}
    </motion.div>
  );
};

// ─── Highlight Mini Card ────────────────────────────────────
const HighlightCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "teal",
}) => {
  const { theme } = useContext(ThemeContext);

  const colorClasses = {
    teal:
      theme === "dark"
        ? "bg-teal-500/10 border-teal-500/30 text-teal-400"
        : "bg-teal-50 border-teal-200 text-teal-600",
    blue:
      theme === "dark"
        ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
        : "bg-blue-50 border-blue-200 text-blue-600",
    purple:
      theme === "dark"
        ? "bg-purple-500/10 border-purple-500/30 text-purple-400"
        : "bg-purple-50 border-purple-200 text-purple-600",
    amber:
      theme === "dark"
        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
        : "bg-amber-50 border-amber-200 text-amber-600",
  };

  return (
    <div
      className={`rounded-lg p-3 sm:p-4 border transition-all duration-200 ${
        colorClasses[color] || colorClasses.teal
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4" />}
        <span className="text-xs sm:text-sm font-medium font-outfit">
          {title}
        </span>
      </div>
      <div
        className={`text-lg sm:text-xl font-bold font-dmSerif ${text.primary[theme]} mb-0.5`}
      >
        {value}
      </div>
      {subtitle && (
        <div className="text-xs font-outfit opacity-80">{subtitle}</div>
      )}
    </div>
  );
};

// ─── Main ProfileView ───────────────────────────────────────
const ProfileView = ({ navigateToSection }) => {
  const { theme } = useContext(ThemeContext);
  const { user: authUser, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const recentActivities = useRecentActivity();

  // ── Data states ──
  const [userProfile, setUserProfile] = useState(null);
  const [essentialData, setEssentialData] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [highlights, setHighlights] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [teamStats, setTeamStats] = useState(null);

  // ── Loading states ──
  const [profileLoading, setProfileLoading] = useState(true);
  const [essentialLoading, setEssentialLoading] = useState(true);
  const [leaguesLoading, setLeaguesLoading] = useState(true);
  const [highlightsLoading, setHighlightsLoading] = useState(true);
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);

  // ── Chip status via React Query ──
  const { data: chipData, isLoading: chipsLoading } = useChipStatus();

  // ── Account settings state ──
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteErrors, setDeleteErrors] = useState({});
  const [deleteSaving, setDeleteSaving] = useState(false);

  // ── Edit profile state ──
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    favoriteTeam: "",
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editErrors, setEditErrors] = useState({});

  const accountRef = useRef(null);

  // ── Fetch all data in parallel on mount ──
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        if (response.success) setUserProfile(response.user);
      } catch (err) {
        if (authUser) setUserProfile(authUser);
      } finally {
        setProfileLoading(false);
      }
    };

    const fetchEssentials = async () => {
      try {
        const response = await dashboardAPI.getEssentialData();
        setEssentialData(response);
      } catch (err) {
        console.warn("Failed to load essential data:", err);
      } finally {
        setEssentialLoading(false);
      }
    };

    const fetchLeagues = async () => {
      try {
        const result = await leagueAPI.getUserLeagues();
        setLeagues(Array.isArray(result) ? result : []);
      } catch (err) {
        console.warn("Failed to load leagues:", err);
      } finally {
        setLeaguesLoading(false);
      }
    };

    const fetchHighlights = async () => {
      try {
        const response = await userAPI.getStatisticsHighlights();
        if (response.success && response.data) setHighlights(response.data);
      } catch (err) {
        console.warn("Failed to load highlights:", err);
      } finally {
        setHighlightsLoading(false);
      }
    };

    const fetchMonthly = async () => {
      try {
        const response = await userAPI.getMonthlyPerformance();
        if (response.success && response.data) {
          const data = response.data.data;
          setMonthlyStats(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.warn("Failed to load monthly stats:", err);
      } finally {
        setMonthlyLoading(false);
      }
    };

    const fetchTeamPerf = async () => {
      try {
        const response = await userAPI.getTeamPerformance();
        if (response.success && response.data) {
          const data = response.data.data;
          setTeamStats(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.warn("Failed to load team stats:", err);
      } finally {
        setTeamLoading(false);
      }
    };

    fetchProfile();
    fetchEssentials();
    fetchLeagues();
    fetchHighlights();
    fetchMonthly();
    fetchTeamPerf();
  }, [authUser]);

  // ── Initialize edit form when profile loads ──
  useEffect(() => {
    if (userProfile) {
      setEditFormData({
        username: userProfile.username || "",
        email: userProfile.email || "",
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        favoriteTeam:
          formatTeamName(
            userProfile.favouriteTeam || userProfile.favoriteTeam
          ) || "",
      });
    }
  }, [userProfile]);

  // ── Helpers ──
  const stats = essentialData?.stats;
  const chips = chipData?.chips || [];

  function formatTeamName(teamName) {
    if (!teamName) return "";
    return teamName
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // ── Edit handlers ──
  const handleEditClick = () => {
    setShowAccountSettings(true);
    setIsEditing(true);
    setTimeout(() => {
      accountRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  };

  const handleSaveEdit = async () => {
    setEditSaving(true);
    setEditErrors({});
    try {
      const response = await updateUser(editFormData);
      if (response.success) {
        setUserProfile(response.user || { ...userProfile, ...editFormData });
        setIsEditing(false);
      }
    } catch (err) {
      setEditErrors({
        general: "Failed to update profile. Please try again.",
      });
    } finally {
      setEditSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (userProfile) {
      setEditFormData({
        username: userProfile.username || "",
        email: userProfile.email || "",
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        favoriteTeam:
          formatTeamName(
            userProfile.favouriteTeam || userProfile.favoriteTeam
          ) || "",
      });
    }
  };

  // ── Password handlers ──
  const handlePasswordChange = async () => {
    setPasswordSaving(true);
    setPasswordErrors({});
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordErrors({ confirmPassword: "Passwords do not match" });
        return;
      }
      if (passwordData.newPassword.length < 8) {
        setPasswordErrors({
          newPassword: "Password must be at least 8 characters",
        });
        return;
      }
      const response = await userAPI.changePassword(passwordData);
      if (response.success) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordSection(false);
      }
    } catch (err) {
      setPasswordErrors({ general: "Failed to change password." });
    } finally {
      setPasswordSaving(false);
    }
  };

  // ── Delete handlers ──
  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== "delete my account") {
      setDeleteErrors({
        confirm: 'Please type "delete my account" to confirm',
      });
      return;
    }
    setDeleteSaving(true);
    setDeleteErrors({});
    try {
      const response = await userAPI.deleteAccount();
      if (response.success) {
        notificationManager.profile.accountDeleted();
        await logout();
        navigate("/");
        return;
      }
    } catch (err) {
      setDeleteErrors({ general: "Failed to delete account. Please try again." });
    } finally {
      setDeleteSaving(false);
    }
  };

  // ── Team options ──
  const teamOptions = [
    { value: "", label: "Select a team" },
    { value: "Arsenal", label: "Arsenal" },
    { value: "Chelsea", label: "Chelsea" },
    { value: "Liverpool", label: "Liverpool" },
    { value: "Manchester City", label: "Manchester City" },
    { value: "Manchester United", label: "Manchester United" },
    { value: "Tottenham", label: "Tottenham" },
    { value: "Newcastle United", label: "Newcastle United" },
    { value: "Brighton", label: "Brighton" },
    { value: "West Ham United", label: "West Ham United" },
    { value: "Aston Villa", label: "Aston Villa" },
  ];

  const maxTeamPoints = teamStats
    ? Math.max(...teamStats.map((t) => t.points), 1)
    : 1;

  // ── Early loading state ──
  if (profileLoading && !authUser) {
    return <LoadingState message="Loading profile..." />;
  }

  const displayUser = userProfile || authUser || {};

  return (
    <div className="space-y-6">
      {/* ═══ Page Header ═══ */}
      <div>
        <h1
          className={`${
            theme === "dark" ? "text-teal-100" : "text-teal-700"
          } text-2xl sm:text-3xl font-bold font-dmSerif`}
        >
          My Profile
        </h1>
        <p className={`${text.secondary[theme]} font-outfit text-sm`}>
          Your prediction hub — stats, leagues, chips, and account settings
        </p>
      </div>

      {/* ═══ Hero Card ═══ */}
      <ProfileHero user={displayUser} onEditClick={handleEditClick} />

      {/* ═══ Stats Strip ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCardOption3
          title="Total Points"
          value={
            essentialLoading ? "..." : (essentialData?.user?.points ?? "—")
          }
          subtitle={
            essentialLoading
              ? "Loading..."
              : `${essentialData?.user?.predictions || 0} predictions made`
          }
          icon={<RocketIcon className="w-full h-full" />}
          accentColor="teal"
          badge={
            stats?.globalRank
              ? {
                  text: `Top ${stats.globalRank.percentile || "—"}%`,
                  type: "success",
                }
              : null
          }
        />
        <StatCardOption3
          title="Accuracy Rate"
          value={
            essentialLoading
              ? "..."
              : `${stats?.accuracyRate?.percentage != null ? Number(stats.accuracyRate.percentage).toFixed(2) : "—"}%`
          }
          subtitle={
            essentialLoading
              ? "Loading..."
              : `${stats?.accuracyRate?.correct || 0} correct predictions`
          }
          icon={<TargetIcon className="w-full h-full" />}
          accentColor="purple"
        />
        <StatCardOption3
          title="Global Rank"
          value={
            essentialLoading
              ? "..."
              : `#${stats?.globalRank?.value ?? "—"}`
          }
          subtitle={
            essentialLoading
              ? "Loading..."
              : `Top ${stats?.globalRank?.percentile || "—"}%`
          }
          icon={<DoubleArrowUpIcon className="w-full h-full" />}
          accentColor="blue"
          trend={
            stats?.weeklyPoints?.difference
              ? {
                  direction:
                    stats.weeklyPoints.difference > 0 ? "up" : "down",
                  value: `${Math.abs(stats.weeklyPoints.difference)}`,
                }
              : null
          }
        />
        <StatCardOption3
          title="Weekly Points"
          value={
            essentialLoading ? "..." : (stats?.weeklyPoints?.value ?? "—")
          }
          subtitle={
            essentialLoading
              ? "Loading..."
              : `Rank #${stats?.weeklyPoints?.rank || "—"} this week`
          }
          icon={<LightningBoltIcon className="w-full h-full" />}
          accentColor="amber"
        />
      </div>

      {/* ═══ Main Content Grid ═══ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6">
        {/* ── Left Column (2/3) ── */}
        <div className="xl:col-span-2 space-y-5 sm:space-y-6">
          {/* Season Form — Monthly Performance */}
          <SectionCard
            title="Season Form"
            description="Monthly prediction accuracy"
            icon={BarChartIcon}
          >
            {monthlyLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div
                      className={`h-20 ${
                        theme === "dark" ? "bg-slate-700/50" : "bg-slate-200"
                      } rounded-lg`}
                    />
                  </div>
                ))}
              </div>
            ) : monthlyStats && monthlyStats.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {monthlyStats.map((month, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className={`p-3 rounded-lg border ${
                      theme === "dark"
                        ? "bg-slate-700/20 border-slate-600/20"
                        : "bg-slate-50/50 border-slate-200/50"
                    }`}
                  >
                    <div className="text-center">
                      <p
                        className={`${text.primary[theme]} font-outfit font-bold text-lg`}
                      >
                        {month.accuracy}%
                      </p>
                      <p
                        className={`${text.muted[theme]} font-outfit text-xs mb-1`}
                      >
                        {month.month}
                      </p>
                      <p
                        className={`${text.muted[theme]} font-outfit text-2xs mb-2`}
                      >
                        {month.predictions} pred · {month.points} pts
                      </p>
                      <div
                        className={`w-full rounded-full h-1.5 ${
                          theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                        }`}
                      >
                        <div
                          className={`h-1.5 rounded-full bg-gradient-to-r ${
                            theme === "dark"
                              ? "from-teal-500 to-indigo-500"
                              : "from-teal-600 to-indigo-600"
                          }`}
                          style={{ width: `${month.accuracy}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p
                className={`${text.muted[theme]} font-outfit text-sm text-center py-4`}
              >
                No monthly data available yet
              </p>
            )}
          </SectionCard>

          {/* Performance Highlights */}
          <SectionCard
            title="Performance Highlights"
            description="Your best prediction achievements"
            icon={MagicWandIcon}
            accentColor="amber"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <HighlightCard
                title="Best Gameweek"
                value={
                  highlightsLoading
                    ? "..."
                    : (highlights?.bestGameweek?.gameweek || "N/A")
                }
                subtitle={
                  highlightsLoading
                    ? "Loading..."
                    : `${highlights?.bestGameweek?.points || 0} points scored`
                }
                icon={BadgeIcon}
                color="amber"
              />
              <HighlightCard
                title="Favorite Fixture"
                value={
                  highlightsLoading
                    ? "..."
                    : (highlights?.favoriteFixture?.fixture || "N/A")
                }
                subtitle={
                  highlightsLoading
                    ? "Loading..."
                    : `${highlights?.favoriteFixture?.accuracy || 0}% accuracy`
                }
                icon={StarIcon}
                color="purple"
              />
              <HighlightCard
                title="Most Active Day"
                value={
                  highlightsLoading
                    ? "..."
                    : (highlights?.mostActiveDay?.day || "N/A")
                }
                subtitle={
                  highlightsLoading
                    ? "Loading..."
                    : `${highlights?.mostActiveDay?.percentage || 0}% of predictions`
                }
                icon={CalendarIcon}
                color="blue"
              />
            </div>
          </SectionCard>

          {/* Team Performance */}
          <SectionCard
            title="Team Performance"
            description="Prediction success by team"
            icon={TargetIcon}
            accentColor="purple"
          >
            {teamLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center justify-between p-3 rounded-lg"
                  >
                    <div
                      className={`h-4 ${
                        theme === "dark" ? "bg-slate-600" : "bg-slate-200"
                      } rounded w-1/3`}
                    />
                    <div
                      className={`h-4 ${
                        theme === "dark" ? "bg-slate-600" : "bg-slate-200"
                      } rounded w-16`}
                    />
                  </div>
                ))}
              </div>
            ) : teamStats && teamStats.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {teamStats.map((team, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`p-3 rounded-lg border ${
                      theme === "dark"
                        ? "bg-slate-700/20 border-slate-600/20"
                        : "bg-slate-50/50 border-slate-200/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p
                          className={`${text.primary[theme]} font-outfit font-medium text-sm truncate`}
                        >
                          {formatTeamName(team.team || team.teamName)}
                        </p>
                        <p
                          className={`${text.muted[theme]} font-outfit text-xs`}
                        >
                          {team.predictions} pred · {team.accuracy}% acc
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p
                          className={`${text.primary[theme]} font-dmSerif font-bold`}
                        >
                          {team.points} pts
                        </p>
                        <div
                          className={`w-14 rounded-full h-1 mt-1 ${
                            theme === "dark" ? "bg-slate-700" : "bg-slate-200"
                          }`}
                        >
                          <div
                            className={`h-1 rounded-full bg-gradient-to-r ${
                              theme === "dark"
                                ? "from-teal-500 to-indigo-500"
                                : "from-teal-600 to-indigo-600"
                            }`}
                            style={{
                              width: `${(team.points / maxTeamPoints) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p
                className={`${text.muted[theme]} font-outfit text-sm text-center py-4`}
              >
                No team performance data yet
              </p>
            )}
          </SectionCard>
        </div>

        {/* ── Right Column (1/3) ── */}
        <div className="space-y-5 sm:space-y-6">
          {/* My Leagues */}
          <SectionCard title="My Leagues" icon={PersonIcon} accentColor="indigo">
            <ProfileLeagues
              leagues={leagues}
              isLoading={leaguesLoading}
              onViewAll={
                navigateToSection
                  ? () => navigateToSection("leagues")
                  : undefined
              }
            />
          </SectionCard>

          {/* Chip Arsenal */}
          <SectionCard
            title="Chip Arsenal"
            icon={LightningBoltIcon}
            accentColor="amber"
          >
            <ProfileChipArsenal chips={chips} isLoading={chipsLoading} />
          </SectionCard>

          {/* Recent Activity */}
          <SectionCard title="Recent Activity" icon={ActivityLogIcon}>
            {recentActivities && recentActivities.length > 0 ? (
              <div className="space-y-2">
                {recentActivities.slice(0, 5).map((activity) => (
                  <div
                    key={activity.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      theme === "dark"
                        ? "bg-slate-700/20 border-slate-600/30"
                        : "bg-slate-50/50 border-slate-200/50"
                    }`}
                  >
                    <p
                      className={`${text.primary[theme]} font-outfit text-sm mb-1`}
                    >
                      {activity.message}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`${text.muted[theme]} font-outfit text-xs`}
                      >
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                      {activity.metadata?.homeTeam &&
                        activity.metadata?.awayTeam && (
                          <span className={`${text.muted[theme]} text-xs`}>
                            · {activity.metadata.homeTeam} vs{" "}
                            {activity.metadata.awayTeam}
                          </span>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-6 ${text.muted[theme]}`}>
                <ActivityLogIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="font-outfit text-sm">No recent activity</p>
                <p className="font-outfit text-xs mt-1">
                  Start making predictions to see activity here
                </p>
              </div>
            )}
          </SectionCard>
        </div>
      </div>

      {/* ═══ Account & Security (Collapsible) ═══ */}
      <div ref={accountRef}>
        <motion.div
          className={`backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-200 ${
            theme === "dark"
              ? "border-slate-700/50 bg-slate-800/40"
              : "border-slate-200 bg-white shadow-sm"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Toggle Header */}
          <button
            onClick={() => setShowAccountSettings(!showAccountSettings)}
            className={`w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors ${
              theme === "dark" ? "hover:bg-slate-700/20" : "hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-teal-500/10 text-teal-400"
                    : "bg-teal-50 text-teal-600"
                }`}
              >
                <LockClosedIcon className="w-5 h-5" />
              </div>
              <div>
                <h3
                  className={`${text.primary[theme]} font-outfit font-semibold text-base sm:text-lg`}
                >
                  Account & Security
                </h3>
                <p
                  className={`${text.secondary[theme]} text-xs sm:text-sm font-outfit`}
                >
                  Edit profile, change password, manage account
                </p>
              </div>
            </div>
            {showAccountSettings ? (
              <ChevronUpIcon className={`w-5 h-5 ${text.muted[theme]}`} />
            ) : (
              <ChevronDownIcon className={`w-5 h-5 ${text.muted[theme]}`} />
            )}
          </button>

          <AnimatePresence>
            {showAccountSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className={`px-5 sm:px-6 pb-5 sm:pb-6 space-y-6 border-t ${
                    theme === "dark"
                      ? "border-slate-700/50"
                      : "border-slate-200"
                  }`}
                >
                  {/* ── Edit Profile Section ── */}
                  <div className="pt-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Pencil1Icon
                          className={`w-4 h-4 ${
                            theme === "dark"
                              ? "text-teal-400"
                              : "text-teal-600"
                          }`}
                        />
                        <h4
                          className={`${text.primary[theme]} font-outfit font-semibold`}
                        >
                          Edit Profile
                        </h4>
                      </div>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <SecondaryButton
                            variant="outline"
                            size="sm"
                            onClick={handleSaveEdit}
                            disabled={editSaving}
                          >
                            <CheckIcon className="w-3.5 h-3.5 mr-1" />
                            {editSaving ? "Saving..." : "Save"}
                          </SecondaryButton>
                          <SecondaryButton
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            <Cross2Icon className="w-3.5 h-3.5 mr-1" />
                            Cancel
                          </SecondaryButton>
                        </div>
                      ) : (
                        <SecondaryButton
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          <Pencil1Icon className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </SecondaryButton>
                      )}
                    </div>

                    {editErrors.general && (
                      <p className="text-red-400 text-sm font-outfit mb-3">
                        {editErrors.general}
                      </p>
                    )}

                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            {
                              label: "Username",
                              field: "username",
                              placeholder: "Enter username",
                            },
                            {
                              label: "Email",
                              field: "email",
                              placeholder: "Enter email",
                              type: "email",
                            },
                            {
                              label: "First Name",
                              field: "firstName",
                              placeholder: "Enter first name",
                            },
                            {
                              label: "Last Name",
                              field: "lastName",
                              placeholder: "Enter last name",
                            },
                          ].map(({ label, field, placeholder, type }) => (
                            <div key={field} className="space-y-1.5">
                              <label
                                className={`${text.primary[theme]} text-sm font-medium font-outfit block`}
                              >
                                {label}
                              </label>
                              <input
                                type={type || "text"}
                                value={editFormData[field]}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    [field]: e.target.value,
                                  }))
                                }
                                placeholder={placeholder}
                                className={`w-full px-3 py-2.5 rounded-lg border font-outfit text-sm transition-colors ${
                                  theme === "dark"
                                    ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20"
                                    : "bg-white border-slate-200 text-slate-800 placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1.5">
                          <label
                            className={`${text.primary[theme]} text-sm font-medium font-outfit block`}
                          >
                            Favorite Team
                          </label>
                          <select
                            value={editFormData.favoriteTeam}
                            onChange={(e) =>
                              setEditFormData((prev) => ({
                                ...prev,
                                favoriteTeam: e.target.value,
                              }))
                            }
                            className={`w-full sm:w-1/2 px-3 py-2.5 rounded-lg border font-outfit text-sm transition-colors ${
                              theme === "dark"
                                ? "bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20"
                                : "bg-white border-slate-200 text-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
                            }`}
                          >
                            {teamOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                        {[
                          {
                            label: "Username",
                            value: displayUser.username,
                          },
                          {
                            label: "Email",
                            value: displayUser.email,
                          },
                          {
                            label: "Name",
                            value: [
                              displayUser.firstName,
                              displayUser.lastName,
                            ]
                              .filter(Boolean)
                              .join(" "),
                          },
                          {
                            label: "Favorite Team",
                            value: formatTeamName(
                              displayUser.favouriteTeam ||
                                displayUser.favoriteTeam
                            ),
                          },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className={`flex justify-between items-center py-2.5 border-b ${
                              theme === "dark"
                                ? "border-slate-700/50"
                                : "border-slate-200/50"
                            }`}
                          >
                            <span
                              className={`${text.muted[theme]} font-outfit text-sm`}
                            >
                              {label}
                            </span>
                            <span
                              className={`${text.primary[theme]} font-outfit text-sm`}
                            >
                              {value || "Not set"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── Change Password Section ── */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <LockClosedIcon
                          className={`w-4 h-4 ${
                            theme === "dark"
                              ? "text-teal-400"
                              : "text-teal-600"
                          }`}
                        />
                        <h4
                          className={`${text.primary[theme]} font-outfit font-semibold`}
                        >
                          Change Password
                        </h4>
                      </div>
                      <SecondaryButton
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setShowPasswordSection(!showPasswordSection)
                        }
                      >
                        {showPasswordSection ? "Cancel" : "Change"}
                      </SecondaryButton>
                    </div>

                    <AnimatePresence>
                      {showPasswordSection && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                              {
                                label: "Current Password",
                                field: "currentPassword",
                              },
                              {
                                label: "New Password",
                                field: "newPassword",
                                error: passwordErrors.newPassword,
                              },
                              {
                                label: "Confirm Password",
                                field: "confirmPassword",
                                error: passwordErrors.confirmPassword,
                              },
                            ].map(({ label, field, error }) => (
                              <div key={field} className="space-y-1.5">
                                <label
                                  className={`${text.primary[theme]} text-sm font-medium font-outfit block`}
                                >
                                  {label}
                                </label>
                                <input
                                  type="password"
                                  value={passwordData[field]}
                                  onChange={(e) =>
                                    setPasswordData((prev) => ({
                                      ...prev,
                                      [field]: e.target.value,
                                    }))
                                  }
                                  placeholder={label}
                                  className={`w-full px-3 py-2.5 rounded-lg border font-outfit text-sm transition-colors ${
                                    error
                                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                                      : theme === "dark"
                                        ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-teal-500/50"
                                        : "bg-white border-slate-200 text-slate-800 placeholder-slate-500 focus:border-teal-500"
                                  }`}
                                />
                                {error && (
                                  <p className="text-red-400 text-xs font-outfit">
                                    {error}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                          {passwordErrors.general && (
                            <p className="text-red-400 text-sm font-outfit">
                              {passwordErrors.general}
                            </p>
                          )}
                          <SecondaryButton
                            onClick={handlePasswordChange}
                            disabled={
                              passwordSaving ||
                              !passwordData.currentPassword ||
                              !passwordData.newPassword ||
                              !passwordData.confirmPassword
                            }
                          >
                            {passwordSaving
                              ? "Updating..."
                              : "Update Password"}
                          </SecondaryButton>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── Danger Zone ── */}
                  <div
                    className={`p-4 rounded-xl border ${
                      theme === "dark"
                        ? "bg-red-500/5 border-red-500/20"
                        : "bg-red-50/50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <ExclamationTriangleIcon
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          theme === "dark" ? "text-red-400" : "text-red-600"
                        }`}
                      />
                      <div className="flex-1">
                        <h4
                          className={`${
                            theme === "dark" ? "text-red-400" : "text-red-600"
                          } font-outfit font-semibold mb-1`}
                        >
                          Delete Account
                        </h4>
                        <p
                          className={`${
                            theme === "dark"
                              ? "text-red-300/80"
                              : "text-red-600/80"
                          } text-sm font-outfit mb-3`}
                        >
                          Permanently delete your account, predictions, and all
                          associated data. This cannot be undone.
                        </p>

                        {!showDeleteConfirm ? (
                          <SecondaryButton
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <TrashIcon className="w-3.5 h-3.5 mr-1" />
                            Delete Account
                          </SecondaryButton>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-3"
                          >
                            <div className="space-y-1.5">
                              <label
                                className={`text-sm font-medium font-outfit block ${
                                  theme === "dark"
                                    ? "text-red-300"
                                    : "text-red-600"
                                }`}
                              >
                                Type &quot;delete my account&quot; to confirm
                              </label>
                              <input
                                value={deleteConfirmText}
                                onChange={(e) =>
                                  setDeleteConfirmText(e.target.value)
                                }
                                placeholder="delete my account"
                                className={`w-full sm:w-1/2 px-3 py-2.5 rounded-lg border font-outfit text-sm ${
                                  theme === "dark"
                                    ? "bg-slate-700/50 border-red-500/30 text-white placeholder-slate-400"
                                    : "bg-white border-red-200 text-slate-800 placeholder-slate-500"
                                }`}
                              />
                              {deleteErrors.confirm && (
                                <p className="text-red-400 text-xs font-outfit">
                                  {deleteErrors.confirm}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <SecondaryButton
                                onClick={handleDeleteAccount}
                                disabled={
                                  deleteSaving ||
                                  deleteConfirmText.toLowerCase() !==
                                    "delete my account"
                                }
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
                              >
                                {deleteSaving
                                  ? "Deleting..."
                                  : "Confirm Deletion"}
                              </SecondaryButton>
                              <SecondaryButton
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setShowDeleteConfirm(false);
                                  setDeleteConfirmText("");
                                  setDeleteErrors({});
                                }}
                              >
                                Cancel
                              </SecondaryButton>
                            </div>
                            {deleteErrors.general && (
                              <p className="text-red-400 text-sm font-outfit">
                                {deleteErrors.general}
                              </p>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileView;
