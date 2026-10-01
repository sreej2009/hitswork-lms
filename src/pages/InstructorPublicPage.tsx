import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Star, UserX, Users } from 'lucide-react';
import type { Instructor, InstructorCourse } from '../types/instructor';
import { courses as catalog } from '../data/courses';
import { getInstructor, instructorSlug } from '../data/instructors';
import { useInstructor } from '../context/InstructorContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { findInstructorBySlug } from '../lib/instructorStorage';
import { formatNumber } from '../lib/format';
import { InstructorProfileCard, instructorProfileSlug } from '../components/instructor/InstructorProfileCard';
import { AppLink } from '../components/ui/AppLink';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { SmartImage } from '../components/ui/SmartImage';

/** Catalog instructors (linked from course pages) get a profile built from their catalog courses. */
function catalogInstructor(slug: string): { instructor: Instructor; courses: InstructorCourse[] } | null {
  const taught = catalog.filter((course) => instructorSlug(course.instructor) === slug);
  if (!taught.length) return null;
  const profile = getInstructor(taught[0].instructor);
  const categories = [...new Set(taught.map((course) => course.category))];
  return {
    instructor: {
      email: '',
      name: profile.name,
      headline: profile.title,
      bio: `${profile.name} teaches ${categories.join(', ')} on Hitswork.`,
      website: '',
      linkedin: '',
      specializations: categories,
      rating: profile.rating,
      students: profile.students,
      joinedAt: '',
      payout: { method: 'bank', accountName: '', bankLast4: '', ifsc: '', upiId: '' },
    },
    courses: taught.map((course) => ({
      id: course.id,
      title: course.title,
      category: course.category,
      level: course.level,
      status: 'Published',
      image: course.image,
      students: course.students,
      rating: course.rating,
      reviews: course.reviews,
      revenue: 0,
      views: 0,
      enrollments: 0,
      completionRate: 0,
      lessons: 0,
      updatedAt: '',
      catalogId: course.id,
    })),
  };
}

/**
 * Public instructor profile (/instructors/:slug): dashboard instructors from this browser's demo data,
 * otherwise catalog instructors.
 */
export function InstructorPublicPage() {
  const { slug = '' } = useParams();
  // Re-read when the signed-in instructor edits their profile.
  const { instructor: current, courses: currentCourses } = useInstructor();
  const found = useMemo(
    () => findInstructorBySlug(slug, instructorProfileSlug) ?? catalogInstructor(slug),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slug, current, currentCourses],
  );
  const isOwner = !!current && !!found?.instructor.email && found.instructor.email === current.email;

  usePageMeta(
    found ? `${found.instructor.name} — Hitswork Instructor` : 'Instructor not found — Hitswork',
    found ? found.instructor.headline : 'This instructor profile could not be found.',
  );

  if (!found) {
    return (
      <Container className="flex flex-col items-center py-24 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <UserX aria-hidden className="size-7" />
        </span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.025em]">Instructor not found</h1>
        <p className="mt-3 max-w-md text-[17px] text-body">This profile doesn’t exist or isn’t public yet.</p>
        <Button href="/courses" arrow className="mt-8">
          Browse Courses
        </Button>
      </Container>
    );
  }

  const { instructor, courses } = found;

  return (
    <section className="relative isolate">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-brand-50/80 to-white" />
      <Container className="py-10 sm:py-14">
        {isOwner && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm shadow-xs ring-1 ring-line">
            <span className="text-body">This is how learners see your profile.</span>
            <AppLink href="/instructor/profile" className="font-semibold text-brand-600 hover:text-brand-700">
              Edit profile
            </AppLink>
          </div>
        )}
        <h1 className="sr-only">{instructor.name}</h1>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <InstructorProfileCard
            profile={instructor}
            courseCount={courses.length}
            className="lg:sticky lg:top-24 lg:self-start"
          />

          <div>
            <h2 className="text-2xl font-bold tracking-[-0.02em]">
              Courses by {instructor.name} <span className="text-muted">({courses.length})</span>
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2">
              {courses.map((course) => {
                const body = (
                  <>
                    <div className="aspect-[16/9] overflow-hidden bg-brand-50">
                      <SmartImage
                        photoId={course.thumbnail ?? course.image}
                        alt=""
                        width={480}
                        ratio={16 / 9}
                        widths={[360, 480, 720]}
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                        className="size-full"
                      />
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-2 font-semibold text-ink">{course.title}</p>
                      <p className="mt-1 text-xs text-muted">
                        {course.category} · {course.level}
                      </p>
                      <p className="mt-3 flex flex-wrap items-center gap-x-4 text-sm text-body">
                        <span className="inline-flex items-center gap-1">
                          <Star aria-hidden className="size-4 text-amber-400" fill="currentColor" strokeWidth={0} />
                          <span className="font-semibold text-ink">{course.rating?.toFixed(1) ?? '—'}</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users aria-hidden className="size-4 text-subtle" />
                          {formatNumber(course.students)} students
                        </span>
                      </p>
                    </div>
                  </>
                );
                const cardClass =
                  'block h-full overflow-hidden rounded-[20px] border border-line bg-white shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft';
                return (
                  <li key={course.id}>
                    {course.catalogId ? (
                      <AppLink
                        href={`/course/${course.catalogId}`}
                        className={`${cardClass} hover:-translate-y-1 hover:shadow-card-hover`}
                      >
                        {body}
                      </AppLink>
                    ) : (
                      <div className={cardClass}>{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            {courses.length === 0 && <p className="mt-6 text-body">No published courses yet.</p>}
          </div>
        </div>
      </Container>
    </section>
  );
}
