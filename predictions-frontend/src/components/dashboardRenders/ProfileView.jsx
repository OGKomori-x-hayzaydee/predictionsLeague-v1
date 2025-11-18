import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { text } from "../../utils/themeUtils";
import { SecondaryButton } from "../ui/buttons";
import userAPI from "../../services/api/userAPI";
import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import ProfileOverview from "../profile/ProfileOverview";
import ProfileAchievements from "../profile/ProfileAchievements";
import ProfileStatistics from "../profile/ProfileStatistics";
import {
  PersonIcon,
  BadgeIcon,
  BarChartIcon,
  GearIcon,
  Pencil1Icon,
  CheckIcon,
  Cross2Icon,
  CalendarIcon,
  TargetIcon,
  StarIcon,
  ActivityLogIcon,
  RocketIcon,
  LightningBoltIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";

const ProfileView = () => {
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: <PersonIcon className="w-4 h-4" /> },
    { id: "achievements", label: "Achievements", icon: <BadgeIcon className="w-4 h-4" /> },
    { id: "statistics", label: "Statistics", icon: <BarChartIcon className="w-4 h-4" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileOverview />;
      case "achievements":
        return <ProfileAchievements />;
      case "statistics":
        return <ProfileStatistics />;
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with title and tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className={`${theme === 'dark' ? 'text-teal-100' : 'text-teal-700'} text-3xl font-bold font-dmSerif`}>
            My Profile
          </h1>
          <p className={`${text.secondary[theme]} font-outfit`}>
            Manage your account, view achievements, and track your performance
          </p>
        </div>

        {/* Tab Navigation - Modern SettingsView Style */}
        <div className={`backdrop-blur-sm rounded-xl p-1 border transition-all duration-200 ${
          theme === "dark"
            ? "border-slate-700/50 bg-slate-800/40"
            : "border-slate-200 bg-white shadow-sm"
        }`}>
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-shrink-0 font-outfit ${
                  activeTab === tab.id
                    ? theme === 'dark'
                      ? 'bg-teal-600 text-white shadow-lg'
                      : 'bg-teal-600 text-white shadow-lg'
                    : theme === 'dark'
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100/70'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content with Animation */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default ProfileView;
