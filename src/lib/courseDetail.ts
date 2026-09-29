import type { Course } from '../types';
import { categories } from '../data/categories';
import { courseDetails } from '../data/courseDetails';
import { courses } from '../data/courses';

export function getCourse(id: string | undefined) {
  const course = courses.find((c) => c.id === id);
  if (!course) return null;
  return { course, detail: courseDetails[course.id] ?? null };
}

/** Category id for linking back to the filtered catalog; null for labels without a category page. */
export const categoryIdFor = (course: Course) => categories.find((c) => c.name === course.category)?.id ?? null;

/** Same-category courses first (most popular first), then top sellers from other categories. */
export function relatedCourses(course: Course, count = 4): Course[] {
  const others = courses.filter((c) => c.id !== course.id).sort((a, b) => b.students - a.students);
  const sameCategory = others.filter((c) => c.category === course.category);
  const rest = others.filter((c) => c.category !== course.category);
  return [...sameCategory, ...rest].slice(0, count);
}

/**
 * Plausible 5→1 star percentages whose weighted mean equals `rating`.
 * The tail (3, 2 and 1 stars) is fixed by rating band; 5 and 4 stars are solved from the mean.
 */
export function ratingDistribution(rating: number): [number, number, number, number, number] {
  const [p3, p2, p1] = rating >= 4.5 ? [3, 1, 1] : rating >= 4 ? [6, 2, 1] : [15, 3, 2];
  const top = 100 - p3 - p2 - p1;
  // 5·p5 + 4·p4 = 100·rating − (3·p3 + 2·p2 + p1), with p5 + p4 = top
  const p5 = Math.max(0, Math.min(top, Math.round(100 * rating - (3 * p3 + 2 * p2 + p1) - 4 * top)));
  return [p5, top - p5, p3, p2, p1];
}
