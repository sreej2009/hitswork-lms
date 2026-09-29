import type { InstructorProfile } from '../types';
import { courses } from './courses';

/** Hand-written instructor profiles. Instructors not listed here get stats derived from the catalog. */
const profiles: Record<string, Omit<InstructorProfile, 'name'>> = {
  'Dr. Angela Yu': {
    title: 'Developer & Lead Instructor',
    rating: 4.8,
    students: 1_200_000,
    courses: 12,
    reviews: 450_000,
  },
};

export function getInstructor(name: string): InstructorProfile {
  const profile = profiles[name];
  if (profile) return { name, ...profile };

  const taught = courses.filter((course) => course.instructor === name);
  const reviews = taught.reduce((sum, course) => sum + course.reviews, 0);
  // Review-weighted average, so a popular course counts for more than a niche one.
  const rating = reviews
    ? taught.reduce((sum, course) => sum + course.rating * course.reviews, 0) / reviews
    : 0;
  return {
    name,
    title: `${taught[0]?.category ?? 'Hitswork'} Instructor`,
    rating: Math.round(rating * 10) / 10,
    students: taught.reduce((sum, course) => sum + course.students, 0),
    courses: taught.length,
    reviews,
  };
}

/** URL-safe slug, e.g. "Dr. Angela Yu" → "dr-angela-yu". */
export const instructorSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
