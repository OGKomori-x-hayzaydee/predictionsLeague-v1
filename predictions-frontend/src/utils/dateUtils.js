import { format, parseISO, isValid, addMinutes } from 'date-fns';
import { MATCH_STATUS, isLiveMatch, isFinishedMatch } from './fixtureUtils';

/** Filing locks 45 minutes before kickoff (How to Play). */
export const FILING_LOCK_MINUTES = 45;

export const formatDate = (dateString, formatStr) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'N/A';
    return format(date, formatStr);
  } catch {
    return 'N/A';
  }
};

/** Parse a fixture timestamp; naive ISO (no Z/offset) is treated as UTC. */
export function parseFixtureDate(fixtureDate) {
  if (!fixtureDate) return null;
  if (fixtureDate instanceof Date) {
    return Number.isNaN(fixtureDate.getTime()) ? null : fixtureDate;
  }
  try {
    let dateString = String(fixtureDate);
    if (!dateString.endsWith('Z') && !dateString.match(/[+-]\d{2}:\d{2}$/)) {
      dateString = `${dateString}Z`;
    }
    const matchDate = parseISO(dateString);
    return isValid(matchDate) ? matchDate : null;
  } catch {
    return null;
  }
}

export function fixtureDeadline(fixtureDate) {
  const matchDate = parseFixtureDate(fixtureDate);
  if (!matchDate) return null;
  return addMinutes(matchDate, -FILING_LOCK_MINUTES);
}

export function formatFixtureDeadline(fixtureDate) {
  const deadline = fixtureDeadline(fixtureDate);
  if (!deadline) return '';
  return format(deadline, 'EEE HH:mm');
}

/** Day-before (18:00) and morning-of (08:00) fire times for the first fixture. */
export function reminderWindows(firstFixtureDate) {
  const kick = parseFixtureDate(firstFixtureDate);
  const deadline = fixtureDeadline(firstFixtureDate);
  if (!kick || !deadline) return null;
  const dayStart = new Date(kick);
  dayStart.setHours(0, 0, 0, 0);
  const dayBefore = new Date(dayStart);
  dayBefore.setDate(dayBefore.getDate() - 1);
  dayBefore.setHours(18, 0, 0, 0);
  const morningOf = new Date(dayStart);
  morningOf.setHours(8, 0, 0, 0);
  return { kick, deadline, dayBefore, morningOf };
}

export const isPredictionDeadlinePassed = (fixtureDate) => {
  const deadline = fixtureDeadline(fixtureDate);
  if (!deadline) return false;
  return Date.now() > deadline.getTime();
};

export function isFilingLocked(status, date) {
  if (isLiveMatch(status) || isFinishedMatch(status)) return true;
  if (status === MATCH_STATUS.SUSPENDED) return true;
  return isPredictionDeadlinePassed(date);
}

export const getDeadlineStatus = (deadlineString) => {
  try {
    const deadline = parseISO(deadlineString);
    if (!isValid(deadline)) return { status: 'unknown', text: '' };

    const now = new Date();
    const hoursDiff = (deadline - now) / (1000 * 60 * 60);

    if (hoursDiff < 0) return { status: 'closed', text: 'Closed' };
    if (hoursDiff < 3) return { status: 'urgent', text: 'Closing soon' };
    if (hoursDiff < 12) return { status: 'soon', text: 'Today' };
    if (hoursDiff < 24) return { status: 'upcoming', text: 'Tomorrow' };
    return { status: 'open', text: formatDate(deadlineString, 'EEE, MMM d') };
  } catch {
    return { status: 'unknown', text: '' };
  }
};
