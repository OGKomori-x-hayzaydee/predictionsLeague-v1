import { format, parseISO, isValid, addMinutes } from 'date-fns';

// Format date helper
export const formatDate = (dateString, formatStr) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return 'N/A';
    return format(date, formatStr);
  } catch {
    return 'N/A';
  }
};

// Check if prediction deadline has passed
// Deadline is 30 minutes before kickoff
export const isPredictionDeadlinePassed = (fixtureDate) => {
  if (!fixtureDate) return false;
  
  try {
    const now = new Date();
    
    // Fix for backend sending date without timezone indicator
    // If date doesn't end with 'Z' or have timezone offset, assume it's UTC
    let dateString = fixtureDate;
    if (!dateString.endsWith('Z') && !dateString.match(/[+-]\d{2}:\d{2}$/)) {
      dateString = dateString + 'Z'; // Treat as UTC
    }
    
    const matchDate = parseISO(dateString);
    if (!isValid(matchDate)) return false;
    
    const deadline = addMinutes(matchDate, -30); // 30 minutes before kickoff
    
    return now > deadline;
  } catch (error) {
    console.error('Error checking prediction deadline:', error);
    return false;
  }
};

// Get fixture deadline status
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
  } catch (error) {
    return { status: 'unknown', text: '' };
  }
};