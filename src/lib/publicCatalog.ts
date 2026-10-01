import type { Course, CourseDetail, InstructorProfile } from '../types';
import type { AdminCourse } from '../types/admin';
import type { Instructor } from '../types/instructor';
import { courseDetails } from '../data/courseDetails';
import { courses as catalog } from '../data/courses';
import { ADMIN_KEYS, builderCourses, readJson } from './adminStorage';
import { toCatalogPreview, toDraft } from './courseBuilder';
import { readMap, INSTRUCTOR_KEY } from './instructorStorage';

/**
 * What learners can see. Catalog courses are public unless an admin unpublished or deleted them;
 * builder courses are public once an admin approved them. Drafts, pending and rejected courses never
 * appear in /courses, search or course pages.
 */

export interface PublicCourse {
  course: Course;
  detail: CourseDetail | null;
  /** Builder courses: rich-text description and instructor card data */
  builder?: { descriptionHtml: string; instructor: InstructorProfile };
}

function catalogStatus(): Map<string, AdminCourse['status']> | null {
  const stored = readJson<AdminCourse[]>(ADMIN_KEYS.courses);
  if (!stored) return null;
  return new Map(stored.filter((c) => c.source === 'catalog').map((c) => [c.id, c.status]));
}

function publishedBuilderCourses(): PublicCourse[] {
  const profiles = readMap<Instructor>(INSTRUCTOR_KEY);
  return builderCourses()
    .filter(({ course }) => course.status === 'Published')
    .map(({ email, course }) => {
      const profile = profiles[email];
      const instructor: Instructor = profile ?? {
        email,
        name: email,
        headline: 'Hitswork Instructor',
        bio: '',
        website: '',
        linkedin: '',
        specializations: [],
        rating: 0,
        students: 0,
        joinedAt: '',
        payout: { method: 'bank', accountName: '', bankLast4: '', ifsc: '', upiId: '' },
      };
      const draft = toDraft(course);
      const preview = toCatalogPreview(draft, instructor);
      return {
        course: { ...preview.course, id: course.id },
        detail: preview.detail,
        builder: {
          descriptionHtml: draft.description,
          instructor: {
            name: instructor.name,
            title: instructor.headline,
            rating: instructor.rating,
            students: instructor.students,
            courses: 1,
            reviews: 0,
          },
        },
      };
    });
}

/** Courses listed in /courses, newest builder courses first. */
export function publicCourses(): Course[] {
  const statuses = catalogStatus();
  // Once the admin store exists, a catalog course must be listed there as Published (deleted ones are absent).
  const visibleCatalog = catalog.filter((course) => !statuses || statuses.get(course.id) === 'Published');
  return [...publishedBuilderCourses().map((p) => p.course), ...visibleCatalog];
}

/** A public course page's data, or null when the course isn't visible to learners. */
export function findPublicCourse(id: string | undefined): PublicCourse | null {
  if (!id) return null;
  const statuses = catalogStatus();
  const course = catalog.find((c) => c.id === id);
  if (course) {
    const status = statuses?.get(id) ?? (statuses ? undefined : 'Published');
    if (status !== 'Published') return null;
    return { course, detail: courseDetails[course.id] ?? null };
  }
  return publishedBuilderCourses().find((p) => p.course.id === id) ?? null;
}
