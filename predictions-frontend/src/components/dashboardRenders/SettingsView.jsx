import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { backgrounds, text } from "../../utils/themeUtils";
import { ToggleButton, SecondaryButton } from "../ui/buttons";
import {
  BellIcon,
  GearIcon,
  SunIcon,
  MoonIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  ResetIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import RulesAndPointsModal from "../common/RulesAndPointsModal";
import ChipStrategyModal from "../predictions/ChipStrategyModal";

const SettingsView = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { preferences, updatePreference, updateNestedPreference, resetPreferences } =
    useUserPreferences();

  const [showSuccess, setShowSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showChipStrategyModal, setShowChipStrategyModal] = useState(false);

  // Show success message
  const showSuccessMessage = (message) => {
    setShowSuccess(message);
    setTimeout(() => setShowSuccess(""), 3000);
  };

  // Handle preferences reset
  const handleResetPreferences = () => {
    if (window.confirm("Are you sure you want to reset all preferences to default values?")) {
      resetPreferences();
      showSuccessMessage("Preferences reset to defaults!");
    }
  };

  const SettingCard = ({ children, title, description, icon: Icon }) => (
    <motion.div
      className={`${backgrounds.card[theme]} rounded-xl p-6 border ${
        theme === "dark" 
          ? "border-slate-700/50 bg-slate-800/30" 
          : "border-slate-200 bg-white shadow-sm"
      }`}
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
          <h3
            className={`${text.primary[theme]} font-outfit font-semibold text-lg`}
          >
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



  const SelectField = ({ label, value, onChange, options }) => (
    <div className="space-y-2">
      <label className={`${text.primary[theme]} text-sm font-medium font-outfit block`}>
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 rounded-lg border font-outfit text-sm transition-colors ${
          theme === "dark"
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
    </div>
  );

  const ToggleRow = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-200/10 last:border-b-0">
      <div>
        <p className={`${text.primary[theme]} font-outfit font-medium`}>
          {label}
        </p>
        {description && (
          <p className={`${text.secondary[theme]} text-sm font-outfit mt-1`}>
            {description}
          </p>
        )}
      </div>
      <ToggleButton
        active={checked}
        onClick={() => onChange(!checked)}
        variant="chip"
        size="sm"
      />
    </div>
  );
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`${
            theme === "dark" ? "text-teal-100" : "text-teal-700"
          } text-3xl font-bold font-dmSerif`}>
            Settings
          </h1>
          <p className={`${text.secondary[theme]} font-outfit mt-2`}>
            Customize your experience and manage preferences
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleResetPreferences}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            theme === "dark"
              ? "bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/50"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
          }`}
        >
          <ResetIcon className="w-4 h-4" />
          Reset All
        </motion.button>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3"
          >
            <CheckIcon className="w-5 h-5 text-emerald-400" />
            <p className="text-emerald-400 font-outfit">{showSuccess}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
        >
          <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
          <p className="text-red-400 font-outfit">{errors.general}</p>
        </motion.div>
      )}

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Appearance & Theme */}
        <SettingCard
          title="Appearance"
          description="Customize how the app looks"
          icon={theme === "dark" ? MoonIcon : SunIcon}
        >
          <div className="space-y-4">
            <ToggleRow
              label="Dark Mode"
              description="Switch between light and dark themes"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
          </div>
        </SettingCard>

        {/* Interface Preferences */}
        <SettingCard
          title="Interface"
          description="Customize your app experience"
          icon={GearIcon}
        >
          <div className="space-y-4">
            <SelectField
              label="Default Dashboard View"
              value={preferences.defaultDashboardView}
              onChange={(e) => updatePreference("defaultDashboardView", e.target.value)}
              options={[
                { value: "fixtures", label: "Fixtures" },
                { value: "predictions", label: "Predictions" },
                { value: "leagues", label: "My Leagues" },
                { value: "profile", label: "Profile" },
              ]}
            />
            <SelectField
              label="Default Fixtures View"
              value={preferences.defaultFixturesView}
              onChange={(e) => updatePreference("defaultFixturesView", e.target.value)}
              options={[
                { value: "carousel", label: "Carousel View" },
                { value: "teams", label: "By Teams" },
                { value: "stack", label: "Stack View" },
                { value: "calendar", label: "Calendar View" },
                { value: "table", label: "Table View" },
                { value: "list", label: "Grid View" },
              ]}
            />
            <SelectField
              label="Default Predictions View"
              value={preferences.defaultPredictionsView}
              onChange={(e) => updatePreference("defaultPredictionsView", e.target.value)}
              options={[
                { value: "list", label: "Grid View" },
                { value: "table", label: "Table View" },
                { value: "calendar", label: "Calendar View" },
                { value: "stack", label: "Stack View" },
                { value: "carousel", label: "Carousel View" },
                { value: "teams", label: "By Teams" },
              ]}
            />
            <SelectField
              label="Default League Predictions View"
              value={preferences.defaultLeaguePredictionsView}
              onChange={(e) => updatePreference("defaultLeaguePredictionsView", e.target.value)}
              options={[
                { value: "teams", label: "By Members" },
                { value: "list", label: "Grid View" },
                { value: "table", label: "Table View" },
                { value: "stack", label: "Stack View" },
                { value: "calendar", label: "Calendar View" },
                { value: "carousel", label: "Carousel View" },
              ]}
            />
            <ToggleRow
              label="Show Button Labels"
              description="Display text on navigation buttons"
              checked={preferences.showButtonTitles}
              onChange={(value) => updatePreference("showButtonTitles", value)}
            />
          </div>
        </SettingCard>

        {/* Notifications */}
        <SettingCard
          title="Notifications"
          description="Manage what you get notified about"
          icon={BellIcon}
        >
          <div className="space-y-4">
            <ToggleRow
              label="Email Notifications"
              description="Get updates via email"
              checked={preferences.notifications.emailAlerts}
              onChange={(value) => updateNestedPreference("notifications", "emailAlerts", value)}
            />
            <ToggleRow
              label="Prediction Reminders"
              description="Reminders before deadlines"
              checked={preferences.notifications.predictionReminders}
              onChange={(value) => updateNestedPreference("notifications", "predictionReminders", value)}
            />
            <ToggleRow
              label="League Updates"
              description="Notifications for league activity"
              checked={preferences.notifications.leagueInvitations}
              onChange={(value) => updateNestedPreference("notifications", "leagueInvitations", value)}
            />
          </div>
        </SettingCard>

        {/* Help & Support */}
        <SettingCard
          title="Help & Support"
          description="Get help and learn more"
          icon={InfoCircledIcon}
        >
          <div className="space-y-3">
            <SecondaryButton
              variant="outline"
              className="w-full justify-center"
              onClick={() => setShowRulesModal(true)}
            >
              <InfoCircledIcon className="mr-2 h-4 w-4" />
              View Rules & Points System
            </SecondaryButton>
            <SecondaryButton
              variant="outline"
              className="w-full justify-center"
              onClick={() => setShowChipStrategyModal(true)}
            >
              <LightningBoltIcon className="mr-2 h-4 w-4" />
              Chip Strategy Guide
            </SecondaryButton>
            <SecondaryButton
              variant="outline"
              className="w-full justify-center"
              onClick={() => window.open("mailto:support@predictionsleague.com")}
            >
              Contact Support
            </SecondaryButton>
          </div>
        </SettingCard>
      </div>
      
      {/* Rules Modal */}
      <RulesAndPointsModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />
      
      {/* Chip Strategy Modal */}
      <ChipStrategyModal
        isOpen={showChipStrategyModal}
        onClose={() => setShowChipStrategyModal(false)}
      />
    </div>
  );
};

export default SettingsView;
