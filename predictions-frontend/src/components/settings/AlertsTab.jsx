import { useUserPreferences } from '../../context/UserPreferencesContext';
import SettingsRow from './SettingsRow';
import SegmentedControl from '../ui/SegmentedControl';
import KickerLabel from '../ui/KickerLabel';

const TOGGLES = [
  { key: 'deadlineReminders', label: 'Deadline reminders', detail: 'A nudge the day before and morning of the first fixture' },
  { key: 'rivalActivity', label: 'Rival activity', detail: 'Tell me when someone above me finishes their sheet' },
  { key: 'resultsSettled', label: 'Results settled', detail: 'When a gameweek scores and the table moves' },
  { key: 'chipExpiryWarnings', label: 'Chip expiry warnings', detail: 'Six weeks out from a chip going unplayed' },
  { key: 'weeklySummaryEmail', label: 'Weekly summary email', detail: "Sunday night: your week, the room's week, what shifted" },
];

const FREQUENCY = [
  { id: 'dayBefore', label: 'DAY BEFORE' },
  { id: 'morningOf', label: 'MORNING OF' },
  { id: 'both', label: 'BOTH' },
];

export default function AlertsTab() {
  const { preferences, updateNestedPreference } = useUserPreferences();
  const notifications = preferences.notifications || {};
  const frequency = notifications.reminderFrequency || 'both';

  return (
    <div className="flex flex-col gap-6">
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

      <div className="flex flex-col gap-3">
        <KickerLabel>Reminder frequency</KickerLabel>
        <p className="text-sm text-text-muted-2">
          When deadline reminders and chip-plan nudges fire — the day before the first fixture, the morning of, or both.
        </p>
        <SegmentedControl
          grow
          value={frequency}
          onChange={(id) => updateNestedPreference('notifications', 'reminderFrequency', id)}
          options={FREQUENCY}
        />
      </div>
    </div>
  );
}
