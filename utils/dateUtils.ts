import * as chrono from 'chrono-node';
import { Time } from 'components/Todos/types/Time';

/**
 * Checks if a given date is today
 * @param date - The date to check
 * @returns true if the date is today, false otherwise
 */
export const isToday = (date: Date): boolean => {
  console.log('isToday', date);
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
export const getRelativeDateString = (date: Date, weekday: boolean = true): string => {
  if (isToday(date)) {
    return 'today';
  } else if (isYesterday(date)) {
    return 'yesterday';
  } else if (isTomorrow(date)) {
    return 'tomorrow';
  } else {
    if (weekday) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return '';
    }
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

export const parseNaturalDate = (dateString: string | null) => {
  if (!dateString) return null;
  try {
    // Remove 'Date(' and ')' wrapper if present
    const cleanDateString = dateString.replace(/^Date\(/, '').replace(/\)$/, '');

    // Try to parse with Chrono first for natural language dates
    const chronoParsed = chrono.parseDate(cleanDateString);

    let date: Date;
    if (chronoParsed) {
      date = chronoParsed;
    } else {
      // Fallback to regular Date constructor
      date = new Date(cleanDateString);
    }
    return date;
  } catch {
    return null;
  }
};

export function timeBetween(date1: Date, date2: Date): Time {
  return new Time({
    minutes: (date2.getTime() - date1.getTime()) / 1000 / 60,
  });
}
