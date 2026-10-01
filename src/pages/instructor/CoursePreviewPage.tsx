import { useLocation, useParams } from 'react-router';
import { ArrowLeft, Eye } from 'lucide-react';
import { useInstructor } from '../../context/InstructorContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { toCatalogPreview, toDraft } from '../../lib/courseBuilder';
import { CourseStatusBadge } from '../../components/instructor/CourseList';
import { Footer } from '../../components/layout/Footer';
import { Navbar } from '../../components/layout/Navbar';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';
import { CourseDetailsView } from '../CourseDetailsPage';

/** The learner-facing course page, rendered from a draft. Purchasing is disabled. */
export function CoursePreviewPage() {
  const { courseId = '' } = useParams();
  const location = useLocation();
  const { getCourse, instructor, courses } = useInstructor();
  const stored = getCourse(courseId);
  const backHref = (location.state as { from?: string } | null)?.from ?? `/instructor/course/${courseId}/edit`;
  usePageMeta(
    stored ? `Preview: ${stored.title || 'Untitled course'} — Hitswork` : 'Course not found — Hitswork',
    'Preview of a course before it is published.',
  );

  if (!stored || !instructor) {
    return (
      <div className="grid min-h-dvh place-items-center bg-canvas px-4">
        <div className="max-w-md rounded-3xl border border-line bg-white p-8 text-center shadow-card">
          <h1 className="text-2xl font-extrabold">Course not found</h1>
          <Button href="/instructor/courses" className="mt-6">
            Back to My Courses
          </Button>
        </div>
      </div>
    );
  }

  const draft = toDraft(stored);
  const { course, detail } = toCatalogPreview(draft, instructor);
  const published = courses.filter((c) => c.status === 'Published');

  return (
    <>
      <Navbar />
      <div className="border-b border-brand-100 bg-brand-50">
        <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
          <p className="flex flex-wrap items-center gap-2 text-sm text-ink">
            <Eye aria-hidden className="size-4 text-brand-600" />
            <span className="font-semibold">Preview</span>
            <span className="text-body">— this is how learners will see your course.</span>
            <CourseStatusBadge status={stored.status} />
          </p>
          <Button href={backHref} size="sm" icon={ArrowLeft}>
            Back to Editing
          </Button>
        </Container>
      </div>
      <main id="main" tabIndex={-1} className="outline-none">
        <CourseDetailsView
          course={course}
          detail={detail}
          preview={{
            descriptionHtml: draft.description,
            instructor: {
              name: instructor.name,
              title: instructor.headline,
              rating: instructor.rating,
              students: instructor.students,
              courses: published.length,
              reviews: published.reduce((n, c) => n + c.reviews, 0),
            },
          }}
        />
      </main>
      <Footer />
    </>
  );
}
