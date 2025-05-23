/**
 * Checks if a given date is today
 * @param date - The date to check
 * @returns true if the date is today, false otherwise
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Checks if a given date is yesterday
 * @param date - The date to check
 * @returns true if the date is yesterday, false otherwise
 */
export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Checks if a given date is tomorrow
 * @param date - The date to check
 * @returns true if the date is tomorrow, false otherwise
 */
export const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

/**
 * Gets a human-readable relative date string
 * @param date - The date to format
 * @returns A string like "today", "yesterday", "tomorrow", or the weekday name
 */
export const getRelativeDateString = (date: Date): string => {
  if (isToday(date)) {
    return 'today';
  } else if (isYesterday(date)) {
    return 'yesterday';
  } else if (isTomorrow(date)) {
    return 'tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }
};

/**
 * Checks if two dates are on the same day
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if both dates are on the same day, false otherwise
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};
