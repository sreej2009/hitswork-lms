import type { AnalyticsPoint, InstructorCourse } from '../types/instructor';

/** Headline numbers derived from the instructor's courses. */
export function courseTotals(courses: InstructorCourse[]) {
  const published = courses.filter((course) => course.status === 'Published');
  const rated = courses.filter((course) => course.rating !== null && course.reviews > 0);
  const reviews = rated.reduce((sum, course) => sum + course.reviews, 0);
  const sum = (key: 'revenue' | 'students' | 'views' | 'enrollments') =>
    courses.reduce((total, course) => total + course[key], 0);
  return {
    published: published.length,
    revenue: sum('revenue'),
    enrollments: sum('enrollments'),
    views: sum('views'),
    /** Review-weighted, so a course with many reviews counts for more */
    rating: reviews ? rated.reduce((total, course) => total + (course.rating ?? 0) * course.reviews, 0) / reviews : 0,
    /** Enrollment-weighted completion across published courses */
    completion: (() => {
      const enrolled = published.reduce((total, course) => total + course.enrollments, 0);
      return enrolled
        ? published.reduce((total, course) => total + course.completionRate * course.enrollments, 0) / enrolled
        : 0;
    })(),
  };
}

/** Published courses ranked by revenue (ties broken by students). */
export const topCourses = (courses: InstructorCourse[], limit = 5) =>
  courses
    .filter((course) => course.status === 'Published')
    .sort((a, b) => b.revenue - a.revenue || b.students - a.students)
    .slice(0, limit);

export const sumPoints = (points: AnalyticsPoint[], key: keyof Omit<AnalyticsPoint, 'label'>) =>
  points.reduce((total, point) => total + point[key], 0);

/** "Good morning" / "Good afternoon" / "Good evening" for the local time. */
export function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
