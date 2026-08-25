import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './ui/Modal';
import { Button } from './ui/buttons';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { useChipManagement } from '../context/ChipManagementContext';
import { useChipPlan } from '../hooks/useChipPlan';
import { useFixtures } from '../hooks/useFixtures';
import { reminderWindows } from '../utils/dateUtils';
import { CHIP_CONFIG } from '../utils/chipManager';
import { notificationManager } from '../services/notificationService';

function wantsDayBefore(freq) {
  return freq === 'dayBefore' || freq === 'both';
}

function wantsMorningOf(freq) {
  return freq === 'morningOf' || freq === 'both';
}

function firstFixture(fixtures = []) {
  return [...fixtures].sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null;
}

/**
 * Chip-plan + deadline reminders. Toasts via notificationService; morning-of
 * confirm uses Modal only (never also toasted). Prefs stay in localStorage.
 */
export default function ReminderHost() {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const { plan, clear } = useChipPlan();
  const { currentGameweek } = useChipManagement();
  const { fixtures } = useFixtures();
  const [morningOpen, setMorningOpen] = useState(false);
  const [sessionDismissed, setSessionDismissed] = useState(false);

  const notifications = preferences?.notifications || {};
  const frequency = notifications.reminderFrequency || 'both';
  const remindersOn = !!notifications.deadlineReminders;

  const first = useMemo(() => firstFixture(fixtures), [fixtures]);
  const windows = useMemo(() => (first ? reminderWindows(first.date) : null), [first]);
  const plannedChipId = currentGameweek != null ? plan[currentGameweek] : null;
  const plannedName = plannedChipId ? CHIP_CONFIG[plannedChipId]?.name || plannedChipId : null;

  const dayId = currentGameweek != null ? `chip-plan-day-before:${currentGameweek}` : null;
  const morningId = currentGameweek != null ? `chip-plan-morning:${currentGameweek}` : null;

  useEffect(() => {
    if (!remindersOn) return undefined;
    notificationManager.requestBrowserPermission();
    return undefined;
  }, [remindersOn]);

  useEffect(() => {
    if (!remindersOn || !windows || !currentGameweek || !dayId || !morningId) return undefined;

    const tick = () => {
      const now = Date.now();
      if (now >= windows.deadline.getTime()) return;

      if (wantsDayBefore(frequency) && now >= windows.dayBefore.getTime() && !notificationManager.hasFired(dayId)) {
        const chipBit = plannedName
          ? `${plannedName} is planned for GW${currentGameweek}. `
          : '';
        notificationManager.deadlineReminder({
          id: dayId,
          message: `${chipBit}First fixture files by ${windows.deadline.toLocaleString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' })}.`,
          useBrowser: true,
        });
      }

      if (
        wantsMorningOf(frequency) &&
        plannedChipId &&
        now >= windows.morningOf.getTime() &&
        !notificationManager.hasFired(morningId) &&
        !sessionDismissed
      ) {
        setMorningOpen(true);
      }
    };

    tick();
    const id = window.setInterval(tick, 60 * 1000);
    const onVis = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [remindersOn, windows, currentGameweek, dayId, morningId, frequency, plannedChipId, plannedName, sessionDismissed]);

  const ackMorning = () => {
    if (morningId) notificationManager.markFired(morningId);
    setMorningOpen(false);
  };

  const dismissMorning = () => {
    setSessionDismissed(true);
    setMorningOpen(false);
  };

  return (
    <Modal
      open={morningOpen}
      onClose={dismissMorning}
      title="Confirm tonight's chip plan"
      footer={
        <>
          <Button
            variant="ghost"
            pill={false}
            onClick={() => {
              if (currentGameweek != null) clear(currentGameweek);
              ackMorning();
            }}
          >
            Reset plan
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              pill={false}
              onClick={() => {
                ackMorning();
                navigate('/chips');
              }}
            >
              Open Strategy
            </Button>
            <Button variant="primary" pill={false} onClick={ackMorning}>
              Confirm plan
            </Button>
          </div>
        </>
      }
    >
      <p className="text-sm leading-relaxed text-text-secondary">
        {plannedName
          ? `${plannedName} is still on the scratchpad for GW${currentGameweek}. Confirm it, reset, or open Strategy — nothing is filed until you submit a slip.`
          : `Nothing is planned for GW${currentGameweek}. Open Strategy to place a chip, or close this.`}
      </p>
    </Modal>
  );
}
