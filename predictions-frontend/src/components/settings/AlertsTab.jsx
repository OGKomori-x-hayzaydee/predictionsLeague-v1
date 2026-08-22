import { useUserPreferences } from '../../context/UserPreferencesContext';
import SettingsRow from './SettingsRow';

// Spine.dc.html buildSettings() notifications tab rows (script ~line 5302) —
// tab id is "notifications" (matches this app's preferences.notifications
// shape); the prototype only abbreviates the label to "ALERTS" on the mobile
// pill tab strip, see SettingsPage.jsx TABS.
const TOGGLES = [
  { key: 'deadlineReminders', label: 'Deadline reminders', detail: 'A nudge four hours before filing closes' },
  { key: 'rivalActivity', label: 'Rival activity', detail: 'Tell me when someone above me finishes their sheet' },
  { key: 'resultsSettled', label: 'Results settled', detail: 'When a gameweek scores and the table moves' },
  { key: 'chipExpiryWarnings', label: 'Chip expiry warnings', detail: 'Six weeks out from a chip going unplayed' },
  { key: 'weeklySummaryEmail', label: 'Weekly summary email', detail: "Sunday night: your week, the room's week, what shifted" },
];

export default function AlertsTab() {
  const { preferences, updateNestedPreference } = useUserPreferences();
  const notifications = preferences.notifications || {};

  return (
    <div className="flex flex-col gap-3">
      {TOGGLES.map(({ key, label, detail }) => (
        <SettingsRow
          key={key}
          size="lg"
          label={label}
          detail={detail}
          kind="toggle"
          checked={!!notifications[key]}
          onToggle={(v) => updateNestedPreference('notifications', key, v)}
        />
      ))}
    </div>
  );
}
