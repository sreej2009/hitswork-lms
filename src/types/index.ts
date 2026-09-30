import type { LucideIcon } from 'lucide-react';

export type AccentKey =
  | 'blue'
  | 'green'
  | 'pink'
  | 'orange'
  | 'purple'
  | 'cyan'
  | 'indigo'
  | 'teal'
  | 'rose';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export type CourseBadge = 'Bestseller' | 'Top Rated' | 'Hot & New';

export interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  rating: number;
  reviews: number;
  students: number;
  hours: number;
  level: CourseLevel;
  price: number;
  originalPrice: number;
  image: string;
  imageAlt: string;
  badge?: CourseBadge;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  accent: AccentKey;
  courseCount: number;
  topics: string[];
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: AccentKey;
}

export interface Stat {
  value: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

// ---------------------------------------------------------------------------
// Course details
// ---------------------------------------------------------------------------

export interface Lecture {
  title: string;
  /** "mm:ss" or "h:mm:ss" */
  duration: string;
  /** Free preview lecture */
  preview?: boolean;
}

export interface CurriculumSection {
  title: string;
  lectureCount: number;
  minutes: number;
  /** A representative subset of the section's lectures */
  lectures: Lecture[];
}

export interface CourseReview {
  name: string;
  rating: number;
  /** ISO date, e.g. "2026-09-12" */
  date: string;
  text: string;
}

/** Long-form content for a course page. Keyed by the course id in `data/courses.ts`. */
export interface CourseDetail {
  /** Topic shown as the last breadcrumb, e.g. "Web Development" */
  subcategory: string;
  tagline: string;
  /** ISO month, e.g. "2026-09" */
  lastUpdated: string;
  language: string;
  totals: { sections: number; lectures: number };
  learn: string[];
  requirements: string[];
  audience: string[];
  description: string[];
  curriculum: CurriculumSection[];
  reviews: CourseReview[];
}

export interface InstructorProfile {
  name: string;
  title: string;
  rating: number;
  students: number;
  courses: number;
  reviews: number;
}

// ---------------------------------------------------------------------------
// Checkout
// ---------------------------------------------------------------------------

export type PaymentMethodId = 'card' | 'upi' | 'netbanking' | 'wallet';

export interface Order {
  /** e.g. "HIT-2026-7KQ4M" */
  id: string;
  /** ISO timestamp */
  placedAt: string;
  courseIds: string[];
  original: number;
  discount: number;
  couponCode: string | null;
  couponDiscount: number;
  total: number;
  paymentMethod: PaymentMethodId;
}

// ---------------------------------------------------------------------------
// Learning
// ---------------------------------------------------------------------------

export interface LearningRecord {
  courseId: string;
  /** ISO timestamps */
  enrolledAt: string;
  lastAccessedAt?: string;
  completedAt?: string;
  completedLessonIds: string[];
  /** Lesson the learner last opened */
  currentLessonId?: string;
}

export interface Certificate {
  /** e.g. "HW-2026-7K4Q-M2PX" */
  id: string;
  courseId: string;
  recipientName: string;
  /** ISO timestamp */
  issuedAt: string;
}

export type NotificationKind = 'lesson' | 'completed' | 'certificate' | 'streak' | 'enrolled';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  message: string;
  /** ISO timestamp */
  createdAt: string;
  read: boolean;
  href?: string;
}

// ---------------------------------------------------------------------------
// Course player
// ---------------------------------------------------------------------------

export type { PlanLesson as Lesson, PlanSection as Section } from '../lib/lessonPlan';

/** Per-lesson state, stored in `hitswork_lesson_progress`. */
export interface LessonProgress {
  completed: boolean;
  /** Resume point in the video, in seconds */
  positionSeconds: number;
  /** ISO timestamp */
  updatedAt: string;
}

/** Per-course summary, stored in `hitswork_course_progress` (derived from `hitswork_learning`). */
export interface CourseProgress {
  percent: number;
  completedLessons: number;
  totalLessons: number;
  status: 'not-started' | 'in-progress' | 'completed';
  currentLessonId?: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  body: string;
  /** ISO timestamps */
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  kind: 'pdf' | 'zip' | 'link';
  description: string;
  /** e.g. "1.2 MB" for downloads */
  size?: string;
  /** For links: internal path or external URL */
  href?: string;
}

export interface Announcement {
  id: string;
  message: string;
  instructor: string;
  daysAgo: number;
}
