import type { Instructor, InstructorCourse } from '../types/instructor';

/*
 * Demo instructor state, persisted per account (keyed by normalised email):
 *   hitswork_instructor               email → Instructor profile (presence = instructor status)
 *   hitswork_instructor_courses       email → InstructorCourse[]
 *   hitswork_instructor_notifications email → InstructorNotification[]
 * Replace with API calls when a backend exists.
 */
export const INSTRUCTOR_KEY = 'hitswork_instructor';
export const COURSES_KEY = 'hitswork_instructor_courses';
export const NOTIFICATIONS_KEY = 'hitswork_instructor_notifications';

type ByEmail<T> = Record<string, T>;

export function readMap<T>(key: string): ByEmail<T> {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as ByEmail<T>) : {};
  } catch {
    return {};
  }
}

export function writeEntry<T>(key: string, email: string, value: T | undefined) {
  try {
    const map = readMap<T>(key);
    if (value === undefined) delete map[email];
    else map[email] = value;
    window.localStorage.setItem(key, JSON.stringify(map));
  } catch {
    // Storage full or blocked: changes last for this session only.
  }
}

/** Public profile lookup: an instructor (and their published courses) by profile slug. */
export function findInstructorBySlug(
  slug: string,
  toSlug: (name: string) => string,
): { instructor: Instructor; courses: InstructorCourse[] } | null {
  const profiles = readMap<Instructor>(INSTRUCTOR_KEY);
  const entry = Object.entries(profiles).find(([, profile]) => toSlug(profile.name) === slug);
  if (!entry) return null;
  const [email, instructor] = entry;
  const courses = (readMap<InstructorCourse[]>(COURSES_KEY)[email] ?? []).filter((c) => c.status === 'Published');
  return { instructor, courses };
}
