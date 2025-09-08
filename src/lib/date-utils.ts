import { format, parse, startOfYear, endOfYear, eachDayOfInterval, isValid, getDay } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const parseTwitterDate = (twitterDate: string): Date => {
  // Twitter dates are in format: "Wed Oct 05 20:18:36 +0000 2011"
  // or sometimes ISO format
  try {
    // Try parsing as ISO date first
    const isoDate = new Date(twitterDate);
    if (isValid(isoDate)) {
      return isoDate;
    }
    
    // Try parsing Twitter's custom format
    const parsed = parse(twitterDate, 'EEE MMM dd HH:mm:ss xxxx yyyy', new Date());
    if (isValid(parsed)) {
      return parsed;
    }
    
    // Fallback: try direct Date constructor
    return new Date(twitterDate);
  } catch (error) {
    console.warn('Failed to parse date:', twitterDate);
    return new Date();
  }
};

export const getYearDates = (year: number): Date[] => {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(new Date(year, 0, 1));
  return eachDayOfInterval({ start, end });
};

export const getActivityLevel = (count: number, maxCount: number): number => {
  if (count === 0) return 0;
  if (maxCount === 0) return 0;
  
  const percentage = count / maxCount;
  if (percentage <= 0.25) return 1;
  if (percentage <= 0.5) return 2;
  if (percentage <= 0.75) return 3;
  return 4;
};

export const getDayOfWeekName = (dayIndex: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex] || 'Unknown';
};

export const calculateStreak = (activities: Array<{ date: string; count: number }>): { current: number; longest: number } => {
  if (activities.length === 0) return { current: 0, longest: 0 };
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Sort activities by date
  const sortedActivities = activities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate longest streak
  for (const activity of sortedActivities) {
    if (activity.count > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  // Calculate current streak (from the end)
  for (let i = sortedActivities.length - 1; i >= 0; i--) {
    if (sortedActivities[i].count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  return { current: currentStreak, longest: longestStreak };
};