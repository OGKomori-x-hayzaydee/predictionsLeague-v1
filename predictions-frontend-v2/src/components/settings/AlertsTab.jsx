import { useUserPreferences } from '../../context/UserPreferencesContext';
import Card from '../ui/Card';

const TOGGLES = [
  { key: 'deadlineReminders', label: 'Deadline reminders', note: '4 hours before filing closes.' },
  { key: 'rivalActivity', label: 'Rival activity', note: 'When someone in your leagues files a slip.' },
  { key: 'resultsSettled', label: 'Results settled', note: "When a gameweek's points are finalised." },
  { key: 'chipExpiryWarnings', label: 'Chip expiry warnings', note: 'Six weeks out from a chip going unplayed.' },
  { key: 'weeklySummaryEmail', label: 'Weekly summary email', note: 'A recap of your gameweek, once a week.' },
];

export default function AlertsTab() {
  const { preferences, updateNestedPreference } = useUserPreferences();
  const notifications = preferences.notifications || {};

  return (
    <Card className="divide-y divide-border-base p-0">
      {TOGGLES.map(({ key, label, note }) => (
        <label key={key} className="flex items-center justify-between gap-4 px-5 py-4">
          <span className="text-sm text-text-primary">
            {label}
            <span className="block text-xs text-text-muted-2">{note}</span>
          </span>
          <input
            type="checkbox"
            checked={!!notifications[key]}
            onChange={(e) => updateNestedPreference('notifications', key, e.target.checked)}
            className="h-5 w-5 shrink-0 accent-brand-teal"
          />
        </label>
      ))}
    </Card>
  );
}
