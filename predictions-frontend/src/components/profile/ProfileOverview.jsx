import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PersonIcon,
  ActivityLogIcon,
  DoubleArrowUpIcon,
  Pencil1Icon,
  CheckIcon,
  Cross2Icon,
  LockClosedIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  GearIcon,
  InfoCircledIcon
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { useNotifications, useRecentActivity } from "../../hooks/useNotifications";
import userAPI from "../../services/api/userAPI";
import { text } from "../../utils/themeUtils";
import { SecondaryButton } from "../ui/buttons";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";

// Modern Setting Card Component
const SettingCard = ({ title, description, icon: Icon, children, variant = "default" }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <motion.div
      className={`backdrop-blur-sm rounded-xl p-6 border transition-all duration-200 ${
        variant === "danger"
          ? theme === "dark"
            ? "border-red-500/30 bg-red-500/5"
            : "border-red-200 bg-red-50/50"
          : theme === "dark"
            ? "border-slate-700/50 bg-slate-800/40"
            : "border-slate-200 bg-white shadow-sm"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className={`p-2 rounded-lg ${
            variant === "danger"
              ? theme === "dark" 
                ? "bg-red-500/10 text-red-400" 
                : "bg-red-100 text-red-600"
              : theme === "dark" 
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

// Helper Components
const InputField = ({ label, value, onChange, type = "text", placeholder, error }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="space-y-2">
      <label className={`${text.primary[theme]} text-sm font-medium font-outfit block`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 rounded-lg border font-outfit text-sm transition-colors ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
            : theme === "dark"
            ? "bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20"
            : "bg-white border-slate-200 text-slate-800 placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
        }`}
      />
      {error && (
        <p className="text-red-400 text-xs font-outfit">{error}</p>
      )}
    </div>
  );
};

const SelectField = ({ label, value, onChange, options, error }) => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className="space-y-2">
      <label className={`${text.primary[theme]} text-sm font-medium font-outfit block`}>
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2.5 rounded-lg border font-outfit text-sm transition-colors ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
            : theme === "dark"
            ? "bg-slate-700/50 border-slate-600/50 text-white focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20"
            : "bg-white border-slate-200 text-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-400 text-xs font-outfit">{error}</p>
      )}
    </div>
  );
};

const ProfileOverview = () => {
  const { theme } = useContext(ThemeContext);
  const { user, updateUser, isLoading: authLoading } = useAuth();
  const { preferences, updateNestedPreference } = useUserPreferences();
  const { profile: notifications } = useNotifications();
  const recentActivities = useRecentActivity();
  
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

  // Password management state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Account deletion state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteErrors, setDeleteErrors] = useState({});

  // Error messages
  const [generalErrors, setGeneralErrors] = useState({});

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userAPI.getProfile();
      if (response.success) {
        setUserProfile(response.user);
      } else {
        throw new Error(response.error || 'Failed to fetch user profile');
      }
    } catch (err) {
      setError(err.message);
      // Fallback to auth context user data if available
      if (user) {
        setUserProfile(user);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize form data when user profile data is available
  useEffect(() => {
    if (userProfile) {
      const mappedUser = {
        username: userProfile.username || '',
        email: userProfile.email || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        favoriteTeam: formatTeamName(userProfile.favouriteTeam || userProfile.favoriteTeam) || '',
        bio: userProfile.bio || '',
      };
      setEditFormData(mappedUser);
    }
  }, [userProfile]);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (userProfile) {
      const mappedUser = {
        username: userProfile.username || '',
        email: userProfile.email || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        favoriteTeam: formatTeamName(userProfile.favouriteTeam || userProfile.favoriteTeam) || '',
        bio: userProfile.bio || '',
      };
      setEditFormData(mappedUser);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await updateUser(editFormData);
      if (response.success) {
        setIsEditing(false);
        notifications.updateSuccess();
      }
    } catch (error) {
      setGeneralErrors({ profile: "Failed to update profile. Please try again." });
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Password management handlers
  const handlePasswordChange = async () => {
    setIsLoading(true);
    setPasswordErrors({});
    setGeneralErrors({});

    try {
      // Basic validation
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordErrors({ confirmPassword: "Passwords do not match" });
        return;
      }

      if (passwordData.newPassword.length < 8) {
        setPasswordErrors({ newPassword: "Password must be at least 8 characters" });
        return;
      }

      const response = await userAPI.changePassword(passwordData);
      if (response.success) {
        notifications.passwordChanged();
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordSection(false);
      }
    } catch (error) {
      setGeneralErrors({ password: "Failed to change password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Account deletion handlers
  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== "delete my account") {
      setDeleteErrors({ deleteConfirm: 'Please type "delete my account" to confirm' });
      return;
    }

    setIsLoading(true);
    setDeleteErrors({});

    try {
      const response = await userAPI.deleteAccount(passwordData.currentPassword);
      if (response.success) {
        console.log("Account deletion processed...");
        // Redirect to login or landing page after deletion
      }
    } catch (error) {
      setDeleteErrors({ general: "Failed to delete account. Please try again." });
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmText("");
    }
  };

  // Utility function to format team names
  const formatTeamName = (teamName) => {
    if (!teamName) return 'Not set';
    return teamName
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Utility function to format member since date
  const formatMemberSince = (user) => {
    const possibleDateFields = [
      user?.memberSince,
      user?.joinedAt,
      user?.createdAt,
      user?.registrationDate,
      user?.created_at,
      user?.joined_at
    ];

    const memberDate = possibleDateFields.find(date => date != null);
    
    if (memberDate) {
      const date = new Date(memberDate);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });
      }
    }
    
    return 'Recently';
  };

  // Show loading state while updating
  if (isLoading && !userProfile) {
    return <LoadingState message="Loading profile..." />;
  }

  // Show error state if there's an error and no fallback data
  if (error && !userProfile) {
    return <ErrorState message={`Failed to load profile: ${error}`} />;
  }

  // Use user data from API response, with proper field mapping
  const displayUser = userProfile || {};

  // Map API fields to display fields for consistency
  const mappedDisplayUser = {
    ...displayUser,
    favoriteTeam: formatTeamName(displayUser.favouriteTeam || displayUser.favoriteTeam),
    email: displayUser.email || 'Not provided',
    memberSince: formatMemberSince(displayUser),
  };

  // Format recent activities for display
  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Team options for dropdown
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

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <SettingCard
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-20 w-20 bg-gradient-to-br from-teal-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold font-dmSerif shadow-lg">
              {mappedDisplayUser.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 ${
              theme === 'dark' ? 'bg-emerald-500 border-slate-800' : 'bg-emerald-500 border-white'
            } flex items-center justify-center`}>
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`${text.primary[theme]} text-xl font-semibold font-outfit`}>
                {mappedDisplayUser.username || 'User'}
              </span>
              {!isEditing && (
                <SecondaryButton
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                >
                  <Pencil1Icon className="w-4 h-4 mr-2" />
                  Edit Profile
                </SecondaryButton>
              )}
            </div>
            <div className={`${text.secondary[theme]} text-sm font-outfit`}>
              {mappedDisplayUser.email || 'No email set'}
            </div>
          </div>
        </div>
      </SettingCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Account Information */}
        <SettingCard
          title="Account Information"
          description="Manage your personal details"
          icon={GearIcon}
        >
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div className="flex items-center justify-end mb-4">
                  <div className="flex gap-2">
                    <SecondaryButton
                      variant="outline"
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={isLoading}
                    >
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Save Changes
                    </SecondaryButton>
                    <SecondaryButton
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <Cross2Icon className="w-4 h-4 mr-2" />
                      Cancel
                    </SecondaryButton>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Username"
                    value={editFormData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Enter username"
                  />
                  <InputField
                    label="Email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    value={editFormData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                  />
                  <InputField
                    label="Last Name"
                    value={editFormData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
                
                <SelectField
                  label="Favorite Team"
                  value={editFormData.favoriteTeam}
                  onChange={(e) => handleInputChange('favoriteTeam', e.target.value)}
                  options={teamOptions}
                />
                
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-200/50 dark:border-slate-700/50">
                  <span className={`${text.secondary[theme]} font-medium font-outfit`}>Username</span>
                  <span className={`${text.primary[theme]} font-outfit`}>
                    {mappedDisplayUser.username || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200/50 dark:border-slate-700/50">
                  <span className={`${text.secondary[theme]} font-medium font-outfit`}>Email</span>
                  <span className={`${text.primary[theme]} font-outfit`}>
                    {mappedDisplayUser.email || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200/50 dark:border-slate-700/50">
                  <span className={`${text.secondary[theme]} font-medium font-outfit`}>Name</span>
                  <span className={`${text.primary[theme]} font-outfit`}>
                    {[editFormData.firstName, editFormData.lastName].filter(Boolean).join(' ') || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200/50 dark:border-slate-700/50">
                  <span className={`${text.secondary[theme]} font-medium font-outfit`}>Favorite Team</span>
                  <span className={`${text.primary[theme]} font-outfit`}>
                    {mappedDisplayUser.favoriteTeam || 'Not set'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </SettingCard>

        {/* Recent Activity */}
        <SettingCard
          title="Recent Activity"
          description="Your latest predictions and achievements"
          icon={ActivityLogIcon}
        >
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    theme === "dark"
                      ? "bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50"
                      : "bg-slate-50/50 border-slate-200/50 hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className={`${text.primary[theme]} font-outfit font-medium text-sm mb-1`}>
                        {activity.message}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className={`${text.muted[theme]} font-outfit text-xs`}>
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                        {activity.metadata && (
                          <>
                            {activity.metadata.homeTeam && activity.metadata.awayTeam && (
                              <span className={`${text.muted[theme]} text-xs`}>
                                • {activity.metadata.homeTeam} vs {activity.metadata.awayTeam}
                              </span>
                            )}
                            {activity.metadata.leagueName && (
                              <span className={`${text.muted[theme]} text-xs`}>
                                • {activity.metadata.leagueName}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      theme === "dark"
                        ? "bg-slate-600/50 text-slate-300"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {activity.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 ${
              theme === "dark" ? "text-slate-400" : "text-slate-500"
            }`}>
              <ActivityLogIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-outfit">No recent activity</p>
              <p className="text-sm mt-1">
                Start making predictions or updating your profile to see activity here
              </p>
            </div>
          )}
        </SettingCard>
      </div>

      {/* Password Management */}
      <SettingCard
        title="Password & Security"
        description="Manage your account security"
        icon={LockClosedIcon}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`${text.primary[theme]} font-outfit font-medium`}>Change Password</h4>
              <p className={`${text.secondary[theme]} text-sm font-outfit`}>
                Update your password to keep your account secure
              </p>
            </div>
            <SecondaryButton
              variant="outline"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
            >
              {showPasswordSection ? 'Cancel' : 'Change Password'}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Current Password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                  />
                  <InputField
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                    error={passwordErrors.newPassword}
                  />
                  <InputField
                    label="Confirm Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    error={passwordErrors.confirmPassword}
                  />
                </div>
                <div className="flex gap-3">
                  <SecondaryButton
                    onClick={handlePasswordChange}
                    disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </SecondaryButton>
                </div>
                {generalErrors.password && (
                  <p className="text-red-400 text-sm font-outfit">{generalErrors.password}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SettingCard>

      {/* Account Deletion */}
      <SettingCard
        title="Danger Zone"
        description="Irreversible account actions"
        icon={TrashIcon}
        variant="danger"
      >
        <div className="space-y-4">
          <div className={`p-4 rounded-lg border flex items-start gap-3 ${
            theme === "dark"
              ? "bg-red-500/10 border-red-500/20"
              : "bg-red-50 border-red-200"
          }`}>
            <ExclamationTriangleIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`} />
            <div>
              <h4 className={`${theme === "dark" ? "text-red-400" : "text-red-600"} font-outfit font-semibold mb-2`}>
                Delete Account
              </h4>
              <p className={`${theme === "dark" ? "text-red-300" : "text-red-600"} text-sm font-outfit mb-3`}>
                This will permanently delete your account, predictions, leagues, and all associated data. This action cannot be undone.
              </p>
              
              {!showDeleteConfirm ? (
                <SecondaryButton
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  Delete Account
                </SecondaryButton>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  <InputField
                    label="Type 'delete my account' to confirm"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="delete my account"
                    error={deleteErrors.deleteConfirm}
                  />
                  <div className="flex gap-3">
                    <SecondaryButton
                      onClick={handleDeleteAccount}
                      disabled={isLoading || deleteConfirmText.toLowerCase() !== "delete my account"}
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50"
                    >
                      {isLoading ? 'Deleting...' : 'Confirm Deletion'}
                    </SecondaryButton>
                    <SecondaryButton
                      variant="outline"
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
                    <p className="text-red-400 text-sm font-outfit">{deleteErrors.general}</p>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </SettingCard>
    </div>
  );
};

export default ProfileOverview;