import { format, parseISO, isValid } from 'date-fns';

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