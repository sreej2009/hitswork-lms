/**
 * Sample learning history loaded the first time a user opens their dashboard, so the demo has
 * realistic progress to show. Settings → "Reset sample data" restores it.
 */

export interface LearningSeed {
  courseId: string;
  /** 0–1 share of lessons completed */
  progress: number;
  enrolledDaysAgo: number;
  lastAccessedHoursAgo: number;
  /** Set for completed courses */
  completedDaysAgo?: number;
}

export const sampleLearning: LearningSeed[] = [
  // In progress
  { courseId: 'web-development', progress: 0.76, enrolledDaysAgo: 48, lastAccessedHoursAgo: 2 },
  { courseId: 'javascript-algorithms', progress: 0.91, enrolledDaysAgo: 60, lastAccessedHoursAgo: 5 },
  { courseId: 'react-typescript-production', progress: 0.68, enrolledDaysAgo: 30, lastAccessedHoursAgo: 26 },
  { courseId: 'ui-ux', progress: 0.42, enrolledDaysAgo: 21, lastAccessedHoursAgo: 74 },
  // Completed
  { courseId: 'html-css-crash-course', progress: 1, enrolledDaysAgo: 120, lastAccessedHoursAgo: 900, completedDaysAgo: 40 },
  { courseId: 'python-automation', progress: 1, enrolledDaysAgo: 110, lastAccessedHoursAgo: 700, completedDaysAgo: 31 },
  { courseId: 'business', progress: 1, enrolledDaysAgo: 100, lastAccessedHoursAgo: 520, completedDaysAgo: 24 },
  { courseId: 'excel-for-business', progress: 1, enrolledDaysAgo: 90, lastAccessedHoursAgo: 400, completedDaysAgo: 18 },
  { courseId: 'digital-marketing-strategy', progress: 1, enrolledDaysAgo: 75, lastAccessedHoursAgo: 260, completedDaysAgo: 11 },
  { courseId: 'smartphone-photography', progress: 1, enrolledDaysAgo: 40, lastAccessedHoursAgo: 150, completedDaysAgo: 6 },
];

/** Consecutive days with learning activity. */
export const learningStreakDays = 7;

/** Minutes learned on each of the last seven days, oldest first (the last entry is today). */
export const lastSevenDaysMinutes = [45, 70, 30, 85, 60, 55, 45];

/** Weekly goal in minutes, and minutes logged so far this week. */
export const weeklyGoal = { targetMinutes: 600, completedMinutes: 390 };
