import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { 
  PersonIcon,
  EnvelopeClosedIcon,
  GearIcon,
  EyeOpenIcon,
  EyeNoneIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  LockClosedIcon,
  CheckIcon
} from "@radix-ui/react-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { text } from "../../utils/themeUtils";

const ProfileSettings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    username: "alexplayer23",
    email: "alex@example.com",
    favoriteTeam: "Arsenal",
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisible: true,
      statsVisible: true,
      predictionsVisible: false
    }
  });

  const teams = [
    "Arsenal", "Chelsea", "Liverpool", 
    "Manchester City", "Manchester United", "Tottenham"
  ];

  const handleSave = () => {
    setIsEditing(false);
    // In real app, this would save to backend
    console.log("Settings saved:", settings);
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-2xl font-bold font-dmSerif mb-2`}>
            Profile Settings
          </h2>
          <p className={`${text.secondary[theme]} font-outfit`}>
            Manage your account preferences and privacy settings
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isEditing
              ? theme === 'dark'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : theme === 'dark'
              ? 'bg-teal-600 hover:bg-teal-700 text-white'
              : 'bg-teal-600 hover:bg-teal-700 text-white'
          }`}
        >
          {isEditing ? (
            <>
              <CheckIcon className="w-4 h-4" />
              Save Changes
            </>
          ) : (
            <>
              <GearIcon className="w-4 h-4" />
              Edit Profile
            </>
          )}
        </motion.button>
      </div>

      {/* Account Information */}
      <div className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } backdrop-blur-sm rounded-xl p-5 border`}>
        <div className="flex items-center gap-2 mb-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`${text.muted[theme]} text-sm font-outfit mb-2 block`}>
              Username
            </label>
            <input
              type="text"
              value={settings.username}
              onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 font-outfit ${
                theme === "dark"
                  ? "bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400"
                  : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-500"
              } ${!isEditing ? 'opacity-60' : ''}`}
            />
          </div>

          <div>
            <label className={`${text.muted[theme]} text-sm font-outfit mb-2 block`}>
              Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 font-outfit ${
                theme === "dark"
                  ? "bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400"
                  : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-500"
              } ${!isEditing ? 'opacity-60' : ''}`}
            />
          </div>

          <div>
            <label className={`${text.muted[theme]} text-sm font-outfit mb-2 block`}>
              Favorite Team
            </label>
            <select
              value={settings.favoriteTeam}
              onChange={(e) => setSettings(prev => ({ ...prev, favoriteTeam: e.target.value }))}
              disabled={!isEditing}
              className={`w-full px-3 py-2 rounded-lg border transition-all duration-200 font-outfit ${
                theme === "dark"
                  ? "bg-slate-700/50 border-slate-600/50 text-white"
                  : "bg-white border-slate-200 text-slate-800"
              } ${!isEditing ? 'opacity-60' : ''}`}
            >
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`${text.muted[theme]} text-sm font-outfit mb-2 block`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value="••••••••"
                disabled={!isEditing}
                className={`w-full px-3 py-2 pr-10 rounded-lg border transition-all duration-200 font-outfit ${
                  theme === "dark"
                    ? "bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-400"
                    : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-500"
                } ${!isEditing ? 'opacity-60' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  theme === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {showPassword ? <EyeNoneIcon className="w-4 h-4" /> : <EyeOpenIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } backdrop-blur-sm rounded-xl p-5 border`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg border ${
            theme === "dark"
              ? "bg-teal-500/10 border-teal-500/20"
              : "bg-teal-50 border-teal-200"
          }`}>
            <GearIcon className={`w-4 h-4 ${
              theme === "dark" ? "text-teal-400" : "text-teal-600"
            }`} />
          </div>
          <h3 className={`${theme === 'dark' ? 'text-teal-200' : 'text-teal-700'} font-outfit font-semibold text-base`}>
            Preferences
          </h3>
        </div>

        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <MoonIcon className={`w-5 h-5 ${text.primary[theme]}`} />
              ) : (
                <SunIcon className={`w-5 h-5 ${text.primary[theme]}`} />
              )}
              <div>
                <span className={`${text.primary[theme]} font-outfit font-medium`}>
                  Dark Mode
                </span>
                <p className={`${text.muted[theme]} text-sm font-outfit`}>
                  Switch between light and dark themes
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-teal-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } backdrop-blur-sm rounded-xl p-5 border`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg border ${
            theme === "dark"
              ? "bg-teal-500/10 border-teal-500/20"
              : "bg-teal-50 border-teal-200"
          }`}>
            <BellIcon className={`w-4 h-4 ${
              theme === "dark" ? "text-teal-400" : "text-teal-600"
            }`} />
          </div>
          <h3 className={`${theme === 'dark' ? 'text-teal-200' : 'text-teal-700'} font-outfit font-semibold text-base`}>
            Notifications
          </h3>
        </div>

        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <span className={`${text.primary[theme]} font-outfit font-medium capitalize`}>
                  {key} Notifications
                </span>
                <p className={`${text.muted[theme]} text-sm font-outfit`}>
                  Receive notifications via {key}
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('notifications', key, !value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-teal-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className={`${
        theme === "dark"
          ? "bg-slate-800/40 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      } backdrop-blur-sm rounded-xl p-5 border`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-1.5 rounded-lg border ${
            theme === "dark"
              ? "bg-teal-500/10 border-teal-500/20"
              : "bg-teal-50 border-teal-200"
          }`}>
            <LockClosedIcon className={`w-4 h-4 ${
              theme === "dark" ? "text-teal-400" : "text-teal-600"
            }`} />
          </div>
          <h3 className={`${theme === 'dark' ? 'text-teal-200' : 'text-teal-700'} font-outfit font-semibold text-base`}>
            Privacy Settings
          </h3>
        </div>

        <div className="space-y-4">
          {Object.entries(settings.privacy).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <span className={`${text.primary[theme]} font-outfit font-medium`}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <p className={`${text.muted[theme]} text-sm font-outfit`}>
                  Make your {key.replace('Visible', '').toLowerCase()} public
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('privacy', key, !value)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-teal-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
