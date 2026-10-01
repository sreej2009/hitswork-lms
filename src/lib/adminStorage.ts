import type { AdminCourse } from '../types/admin';
import type { Instructor, InstructorCourse, InstructorNotification } from '../types/instructor';
import { COURSES_KEY, INSTRUCTOR_KEY, NOTIFICATIONS_KEY, readMap, writeEntry } from './instructorStorage';

/*
 * Admin demo persistence. Each key holds one collection; replace these functions with API calls later.
 *   hitswork_admin               AdminUser (profile + platform settings)
 *   hitswork_admin_courses       AdminCourse[] (catalog + sample submissions; builder courses are read live)
 *   hitswork_admin_instructors   AdminInstructor[]
 *   hitswork_admin_students      AdminStudent[]
 *   hitswork_admin_orders        AdminOrder[]
 *   hitswork_admin_categories    AdminCategory[]
 *   hitswork_admin_notifications AdminNotification[]
 *   hitswork_admin_applications  AdminApplication[]
 */
export const ADMIN_KEYS = {
  admin: 'hitswork_admin',
  courses: 'hitswork_admin_courses',
  instructors: 'hitswork_admin_instructors',
  students: 'hitswork_admin_students',
  orders: 'hitswork_admin_orders',
  categories: 'hitswork_admin_categories',
  notifications: 'hitswork_admin_notifications',
  applications: 'hitswork_admin_applications',
} as const;

export function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked: changes last for this session only.
  }
}

/** Reads a collection, creating it from `seed` the first time. */
export function loadOrSeed<T>(key: string, seed: () => T): T {
  const stored = readJson<T>(key);
  if (stored !== null) return stored;
  const value = seed();
  writeJson(key, value);
  return value;
}

/* ------------------------------------------------------------------ */
/*  Courses built by instructors (shared with the instructor area)     */
/* ------------------------------------------------------------------ */

export interface OwnedCourse {
  email: string;
  instructorName: string;
  course: InstructorCourse;
}

/**
 * Every course created in the course builder, across all instructor accounts in this browser.
 * Sample dashboard courses (without `createdAt`) are left out — they mirror catalog courses.
 */
export function builderCourses(): OwnedCourse[] {
  const courses = readMap<InstructorCourse[]>(COURSES_KEY);
  const profiles = readMap<Instructor>(INSTRUCTOR_KEY);
  return Object.entries(courses).flatMap(([email, list]) =>
    (list ?? [])
      .filter((course) => !!course.createdAt)
      .map((course) => ({ email, instructorName: profiles[email]?.name ?? email, course })),
  );
}

export const findBuilderCourse = (id: string) => builderCourses().find((owned) => owned.course.id === id);

export function toAdminCourse({ email, instructorName, course }: OwnedCourse): AdminCourse {
  return {
    id: course.id,
    source: 'instructor',
    title: course.title || 'Untitled course',
    instructor: instructorName,
    instructorEmail: email,
    category: course.category || 'Uncategorised',
    level: course.level,
    status: course.status,
    students: course.students,
    rating: course.rating,
    price: course.pricing === 'free' ? 0 : (course.price ?? 0),
    revenue: course.revenue,
    image: course.thumbnail ?? course.image,
    submittedAt: course.submittedAt,
    updatedAt: course.updatedAt,
    reviewNote: course.reviewNote,
  };
}

/** Applies an admin decision to a builder course and tells its instructor. */
export function updateBuilderCourse(email: string, id: string, patch: Partial<InstructorCourse>, message?: string) {
  const list = readMap<InstructorCourse[]>(COURSES_KEY)[email] ?? [];
  writeEntry(
    COURSES_KEY,
    email,
    list.map((course) => (course.id === id ? { ...course, ...patch, updatedAt: new Date().toISOString() } : course)),
  );
  if (message) {
    const notifications = readMap<InstructorNotification[]>(NOTIFICATIONS_KEY)[email] ?? [];
    writeEntry(NOTIFICATIONS_KEY, email, [
      {
        id: `in-${Date.now().toString(36)}`,
        kind: patch.status === 'Published' ? 'approved' : 'submitted',
        message,
        createdAt: new Date().toISOString(),
        read: false,
        href: `/instructor/course/${id}/edit`,
      } satisfies InstructorNotification,
      ...notifications,
    ]);
  }
}

export function deleteBuilderCourse(email: string, id: string) {
  const list = readMap<InstructorCourse[]>(COURSES_KEY)[email] ?? [];
  writeEntry(
    COURSES_KEY,
    email,
    list.filter((course) => course.id !== id),
  );
}

/** Platform settings, readable outside the admin area (e.g. "Require Course Approval" in the builder). */
export function requiresCourseApproval(): boolean {
  return (
    readJson<{ settings?: { requireCourseApproval?: boolean } }>(ADMIN_KEYS.admin)?.settings?.requireCourseApproval ??
    true
  );
}
