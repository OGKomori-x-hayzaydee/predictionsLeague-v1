import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "../../context/ThemeContext";
import { useUserPreferences } from "../../context/UserPreferencesContext";
import { text } from "../../utils/themeUtils";
import { ToggleButton } from "../ui/buttons";
import {
  BellIcon,
  SunIcon,
  MoonIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
  ResetIcon,
  LightningBoltIcon,
  ChevronRightIcon,
  MixerHorizontalIcon,
  EnvelopeClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import RulesAndPointsModal from "../common/RulesAndPointsModal";
import ChipStrategyModal from "../predictions/ChipStrategyModal";

const SettingsView = ({ navigateToSection }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const {
    preferences,
    updatePreference,
    updateNestedPreference,
    resetPreferences,
  } = useUserPreferences();

  const [showSuccess, setShowSuccess] = useState("");
  const [errors, setErrors] = useState({});
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showChipStrategyModal, setShowChipStrategyModal] = useState(false);

  const showSuccessMessage = (message) => {
    setShowSuccess(message);
    setTimeout(() => setShowSuccess(""), 3000);
  };

  const handleResetPreferences = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all preferences to default values?"
      )
    ) {
      resetPreferences();
      showSuccessMessage("Preferences reset to defaults!");
    }
  };

  // ─── Inline Sub-components ─────────────────────────────────

  const SectionCard = ({ children, title, description, icon: Icon, accentColor = "teal" }) => {
    const iconColors = {
      teal:
        theme === "dark"
          ? "bg-teal-500/10 text-teal-400"
          : "bg-teal-50 text-teal-600",
      blue:
        theme === "dark"
          ? "bg-blue-500/10 text-blue-400"
          : "bg-blue-50 text-blue-600",
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
                  className={`${text.secondary[theme]} text-xs sm:text-sm font-outfit mt-0.5`}
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

  const SelectField = ({ label, value, onChange, options }) => (
    <div className="space-y-1.5">
      <label
        className={`${text.primary[theme]} text-sm font-medium font-outfit block`}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2.5 rounded-lg border font-outfit text-sm transition-colors ${
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
    <div
      className={`flex items-center justify-between py-3.5 border-b last:border-b-0 ${
        theme === "dark" ? "border-slate-700/40" : "border-slate-200/60"
      }`}
    >
      <div>
        <p className={`${text.primary[theme]} font-outfit font-medium text-sm`}>
          {label}
        </p>
        {description && (
          <p
            className={`${text.secondary[theme]} text-xs sm:text-sm font-outfit mt-0.5`}
          >
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

  const HelpRow = ({ label, description, onClick, icon: Icon }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between py-3.5 border-b last:border-b-0 text-left transition-colors group ${
        theme === "dark"
          ? "border-slate-700/40 hover:bg-slate-700/20"
          : "border-slate-200/60 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <Icon
            className={`w-4 h-4 ${
              theme === "dark" ? "text-slate-400" : "text-slate-500"
            }`}
          />
        )}
        <div>
          <p
            className={`${text.primary[theme]} font-outfit font-medium text-sm`}
          >
            {label}
          </p>
          {description && (
            <p
              className={`${text.secondary[theme]} text-xs font-outfit mt-0.5`}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      <ChevronRightIcon
        className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
          theme === "dark" ? "text-slate-500" : "text-slate-400"
        }`}
      />
    </button>
  );

  // ─── Render ────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1
          className={`${
            theme === "dark" ? "text-teal-100" : "text-teal-700"
          } text-3xl font-bold font-dmSerif`}
        >
          Settings
        </h1>
        <p className={`${text.secondary[theme]} font-outfit mt-2`}>
          Customize your experience and manage preferences
        </p>
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

      {/* ═══ Section 1: Appearance & Display ═══ */}
      <SectionCard
        title="Appearance & Display"
        description="Theme, layout, and view preferences"
        icon={theme === "dark" ? MoonIcon : SunIcon}
      >
        {/* Toggles */}
        <div>
          <ToggleRow
            label="Dark Mode"
            description="Switch between light and dark themes"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <ToggleRow
            label="Show Button Labels"
            description="Display text on navigation buttons"
            checked={preferences.showButtonTitles}
            onChange={(value) => updatePreference("showButtonTitles", value)}
          />
        </div>

        {/* Default Views sub-group */}
        <div className="mt-5">
          <p
            className={`${text.secondary[theme]} text-xs font-outfit font-medium uppercase tracking-wider mb-3`}
          >
            Default Views
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="Dashboard"
              value={preferences.defaultDashboardView}
              onChange={(e) =>
                updatePreference("defaultDashboardView", e.target.value)
              }
              options={[
                { value: "fixtures", label: "Fixtures" },
                { value: "predictions", label: "Predictions" },
                { value: "leagues", label: "My Leagues" },
                { value: "profile", label: "Profile" },
              ]}
            />
            <SelectField
              label="Fixtures"
              value={preferences.defaultFixturesView}
              onChange={(e) =>
                updatePreference("defaultFixturesView", e.target.value)
              }
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
              label="Predictions"
              value={preferences.defaultPredictionsView}
              onChange={(e) =>
                updatePreference("defaultPredictionsView", e.target.value)
              }
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
              label="League Predictions"
              value={preferences.defaultLeaguePredictionsView}
              onChange={(e) =>
                updatePreference(
                  "defaultLeaguePredictionsView",
                  e.target.value
                )
              }
              options={[
                { value: "teams", label: "By Members" },
                { value: "list", label: "Grid View" },
                { value: "table", label: "Table View" },
                { value: "stack", label: "Stack View" },
                { value: "calendar", label: "Calendar View" },
                { value: "carousel", label: "Carousel View" },
              ]}
            />
          </div>
        </div>
      </SectionCard>

      {/* ═══ Section 2: Notifications ═══ */}
      <SectionCard
        title="Notifications"
        description="Manage what you get notified about"
        icon={BellIcon}
        accentColor="blue"
      >
        <div>
          <ToggleRow
            label="Email Notifications"
            description="Get updates via email"
            checked={preferences.notifications.emailAlerts}
            onChange={(value) =>
              updateNestedPreference("notifications", "emailAlerts", value)
            }
          />
          <ToggleRow
            label="Prediction Reminders"
            description="Reminders before deadlines"
            checked={preferences.notifications.predictionReminders}
            onChange={(value) =>
              updateNestedPreference(
                "notifications",
                "predictionReminders",
                value
              )
            }
          />
          <ToggleRow
            label="League Updates"
            description="Notifications for league activity"
            checked={preferences.notifications.leagueInvitations}
            onChange={(value) =>
              updateNestedPreference(
                "notifications",
                "leagueInvitations",
                value
              )
            }
          />
        </div>
      </SectionCard>

      {/* ═══ Section 3: Help & Resources ═══ */}
      <SectionCard
        title="Help & Resources"
        description="Learn the rules, get support"
        icon={InfoCircledIcon}
        accentColor="indigo"
      >
        <div>
          <HelpRow
            label="Rules & Points System"
            description="How scoring and predictions work"
            icon={InfoCircledIcon}
            onClick={() => setShowRulesModal(true)}
          />
          <HelpRow
            label="Chip Strategy Guide"
            description="Learn how to use your chips effectively"
            icon={LightningBoltIcon}
            onClick={() => setShowChipStrategyModal(true)}
          />
          <HelpRow
            label="Contact Support"
            description="Get in touch with our team"
            icon={EnvelopeClosedIcon}
            onClick={() =>
              window.open("mailto:support@predictionsleague.com")
            }
          />
          {navigateToSection && (
            <HelpRow
              label="Account Settings"
              description="Edit profile, change password, manage account"
              icon={PersonIcon}
              onClick={() => navigateToSection("profile")}
            />
          )}
        </div>
      </SectionCard>

      {/* ═══ Reset Footer ═══ */}
      <motion.div
        className={`rounded-xl p-4 sm:p-5 border flex items-center justify-between ${
          theme === "dark"
            ? "border-slate-700/30 bg-slate-800/20"
            : "border-slate-200/60 bg-slate-50/50"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <p
            className={`${text.primary[theme]} font-outfit font-medium text-sm`}
          >
            Reset Preferences
          </p>
          <p
            className={`${text.secondary[theme]} text-xs font-outfit mt-0.5`}
          >
            Restore all settings to their default values
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleResetPreferences}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium font-outfit transition-colors ${
            theme === "dark"
              ? "bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/50"
              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
          }`}
        >
          <ResetIcon className="w-4 h-4" />
          Reset All
        </motion.button>
      </motion.div>

      {/* Modals */}
      <RulesAndPointsModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />
      <ChipStrategyModal
        isOpen={showChipStrategyModal}
        onClose={() => setShowChipStrategyModal(false)}
      />
    </div>
  );
};

export default SettingsView;
