import { Award, BookOpenCheck, Clock3, Compass, Flame, Trophy, type LucideIcon } from 'lucide-react';
import type { AccentKey } from '../types';

/** Numbers achievements are measured against. */
export interface LearnerStats {
  completedCourses: number;
  learningHours: number;
  streakDays: number;
  certificates: number;
  categoriesExplored: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: AccentKey;
  /** Current value for this achievement */
  measure: (stats: LearnerStats) => number;
  target: number;
  /** Short status shown once earned, e.g. "7 days" */
  earnedLabel: (stats: LearnerStats) => string;
}

export const achievements: Achievement[] = [
  {
    id: 'first-course',
    title: 'First Course',
    description: 'Complete your first course',
    icon: BookOpenCheck,
    accent: 'green',
    measure: (s) => s.completedCourses,
    target: 1,
    earnedLabel: () => 'Completed',
  },
  {
    id: 'streak-7',
    title: '7-Day Learning Streak',
    description: 'Learn on seven days in a row',
    icon: Flame,
    accent: 'orange',
    measure: (s) => s.streakDays,
    target: 7,
    earnedLabel: (s) => `${s.streakDays} days`,
  },
  {
    id: 'hours-100',
    title: '100 Hours Learned',
    description: 'Spend 100 hours learning on Hitswork',
    icon: Clock3,
    accent: 'blue',
    measure: (s) => s.learningHours,
    target: 100,
    earnedLabel: (s) => `${Math.floor(s.learningHours)}h`,
  },
  {
    id: 'top-learner',
    title: 'Top Learner',
    description: 'Complete five courses',
    icon: Trophy,
    accent: 'purple',
    measure: (s) => s.completedCourses,
    target: 5,
    earnedLabel: (s) => `${s.completedCourses} courses`,
  },
  {
    id: 'certified',
    title: 'Certified Professional',
    description: 'Earn ten certificates',
    icon: Award,
    accent: 'indigo',
    measure: (s) => s.certificates,
    target: 10,
    earnedLabel: (s) => `${s.certificates} certificates`,
  },
  {
    id: 'explorer',
    title: 'Curious Explorer',
    description: 'Learn in five different categories',
    icon: Compass,
    accent: 'cyan',
    measure: (s) => s.categoriesExplored,
    target: 5,
    earnedLabel: (s) => `${s.categoriesExplored} categories`,
  },
];

/** The four shown on the dashboard overview. */
export const featuredAchievementIds = ['first-course', 'streak-7', 'hours-100', 'top-learner'];
