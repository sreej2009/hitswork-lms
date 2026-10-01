import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronDown,
  FileText,
  FileVideo,
  MessageSquareWarning,
  XCircle,
} from 'lucide-react';
import { courseDetails } from '../../data/courseDetails';
import { submissionContent } from '../../data/admin';
import { lessonTypeMeta } from '../../data/courseBuilder';
import type { CourseLesson, CourseSection } from '../../types/instructor';
import { useAdmin } from '../../context/AdminContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { findBuilderCourse } from '../../lib/adminStorage';
import { lessonMeta, toDraft } from '../../lib/courseBuilder';
import { formatBytes, formatClock } from '../../lib/courseMedia';
import { cn } from '../../lib/cn';
import { formatNumber, formatPrice, formatRelative } from '../../lib/format';
import { AdminHeader, RatingText, StatusPill } from '../../components/admin/AdminChrome';
import { useCourseDecisions } from '../../components/admin/CourseDecisions';
import { CourseThumb } from '../../components/instructor/CourseList';
import { Panel } from '../../components/instructor/InstructorChrome';
import { AppLink } from '../../components/ui/AppLink';
import { Button } from '../../components/ui/Button';

interface ReviewContent {
  subtitle: string;
  descriptionHtml: string;
  objectives: string[];
  requirements: string[];
  sections: CourseSection[];
}

/** Normalises the three course sources into what the review page shows. */
function useReviewContent(id: string, source: string | undefined): ReviewContent | null {
  return useMemo(() => {
    if (source === 'instructor') {
      const owned = findBuilderCourse(id);
      if (!owned) return null;
      const d = toDraft(owned.course);
      return {
        subtitle: d.subtitle,
        descriptionHtml: d.description,
        objectives: d.objectives.filter(Boolean),
        requirements: d.requirements.filter(Boolean),
        sections: d.sections,
      };
    }
    if (source === 'submission') {
      const content = submissionContent(id);
      return content
        ? { ...content, descriptionHtml: content.description }
        : { subtitle: '', descriptionHtml: '', objectives: [], requirements: [], sections: [] };
    }
    const detail = courseDetails[id];
    if (!detail) return { subtitle: '', descriptionHtml: '', objectives: [], requirements: [], sections: [] };
    return {
      subtitle: detail.tagline,
      descriptionHtml: detail.description.map((p) => `<p>${p}</p>`).join(''),
      objectives: detail.learn,
      requirements: detail.requirements,
      sections: detail.curriculum.map((s, si) => ({
        id: `cat-${si}`,
        title: s.title,
        description: '',
        lessons: s.lectures.map((l, li) => ({
          id: `cat-${si}-${li}`,
          type: 'video' as const,
          title: l.title,
          description: '',
          freePreview: !!l.preview,
          resources: [],
          video: {
            name: `${l.title}.mp4`,
            size: 0,
            type: 'video/mp4',
            durationSeconds: l.duration.split(':').reduce((t, part) => t * 60 + Number(part), 0),
          },
        })),
      })),
    };
  }, [id, source]);
}

function LessonDetail({ lesson }: { lesson: CourseLesson }) {
  switch (lesson.type) {
    case 'video':
      return (
        <div className="space-y-2 text-sm">
          {lesson.video ? (
            <p className="flex items-center gap-2 text-ink">
              <FileVideo aria-hidden className="size-4 text-brand-600" />
              {lesson.video.name} · {formatClock(lesson.video.durationSeconds)}
              {lesson.video.size > 0 && ` · ${formatBytes(lesson.video.size)}`}
            </p>
          ) : (
            <p className="flex items-center gap-2 text-amber-700">
              <AlertTriangle aria-hidden className="size-4" />
              No video uploaded
            </p>
          )}
          {lesson.description && <p className="text-body">{lesson.description}</p>}
        </div>
      );
    case 'article':
      // Stored sanitised by the course builder.
      return <div className="rich-text text-sm text-body" dangerouslySetInnerHTML={{ __html: lesson.content ?? '' }} />;
    case 'quiz':
      return (
        <div className="space-y-3 text-sm">
          <p className="text-muted">
            Pass mark {lesson.quiz?.passingScore}% ·{' '}
            {lesson.quiz?.attempts ? `${lesson.quiz.attempts} attempts` : 'Unlimited attempts'}
          </p>
          <ol className="space-y-3">
            {lesson.quiz?.questions.map((q, i) => (
              <li key={q.id}>
                <p className="font-semibold text-ink">
                  {i + 1}. {q.text}
                </p>
                <ul className="mt-1.5 space-y-1">
                  {q.options.map((o) => (
                    <li
                      key={o.id}
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-2.5 py-1.5',
                        o.id === q.correctOptionId ? 'bg-emerald-50 font-medium text-emerald-800' : 'text-body',
                      )}
                    >
                      {o.id === q.correctOptionId ? (
                        <Check aria-hidden className="size-3.5" strokeWidth={3} />
                      ) : (
                        <span className="size-3.5" />
                      )}
                      {o.text}
                      {o.id === q.correctOptionId && <span className="sr-only">(correct answer)</span>}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      );
    case 'assignment':
      return (
        <div className="space-y-2 text-sm">
          <p className="whitespace-pre-line text-body">{lesson.assignment?.instructions}</p>
          <p className="text-muted">
            Submission: {lesson.assignment?.submissionType} · Max score {lesson.assignment?.maxScore}
          </p>
        </div>
      );
    default:
      return lesson.description ? <p className="text-sm text-body">{lesson.description}</p> : null;
  }
}

function CurriculumInspector({ sections }: { sections: CourseSection[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!sections.length) return <p className="text-sm text-muted">No curriculum has been added.</p>;
  return (
    <ol className="space-y-4">
      {sections.map((section, si) => (
        <li key={section.id} className="rounded-2xl border border-line">
          <div className="border-b border-line px-4 py-3 sm:px-5">
            <p className="text-xs font-bold tracking-[0.12em] text-brand-600 uppercase">
              Section {String(si + 1).padStart(2, '0')}
            </p>
            <p className="font-semibold text-ink">{section.title}</p>
            {section.description && <p className="text-sm text-muted">{section.description}</p>}
          </div>
          <ul className="divide-y divide-line">
            {section.lessons.map((lesson) => {
              const meta = lessonTypeMeta(lesson.type);
              const Icon = meta.icon;
              const isOpen = open === lesson.id;
              return (
                <li key={lesson.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : lesson.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-canvas sm:px-5"
                  >
                    <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', meta.tone)}>
                      <Icon aria-hidden className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">{lesson.title}</span>
                      <span className="block text-xs text-muted">
                        {lessonMeta(lesson)}
                        {lesson.freePreview && ' · Free preview'}
                        {lesson.resources.length > 0 && ` · ${lesson.resources.length} resources`}
                      </span>
                    </span>
                    <ChevronDown
                      aria-hidden
                      className={cn('size-4 shrink-0 text-muted transition-transform', isOpen && 'rotate-180')}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 bg-canvas/60 px-4 py-4 sm:px-5 sm:pl-16">
                          <LessonDetail lesson={lesson} />
                          {lesson.resources.length > 0 && (
                            <ul className="space-y-1 text-sm">
                              {lesson.resources.map((file) => (
                                <li key={file.name} className="flex items-center gap-2 text-body">
                                  <FileText aria-hidden className="size-4 text-brand-600" />
                                  {file.name} · {formatBytes(file.size)}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export function AdminCourseReviewPage() {
  const { courseId = '' } = useParams();
  const navigate = useNavigate();
  const { getCourse } = useAdmin();
  const course = getCourse(courseId);
  const content = useReviewContent(courseId, course?.source);
  const { decide, dialogs } = useCourseDecisions((decision) => {
    if (decision === 'delete') navigate('/admin/courses');
  });
  usePageMeta(
    course ? `Review: ${course.title} — Hitswork Admin` : 'Course not found — Hitswork Admin',
    'Course review.',
  );

  if (!course) {
    return (
      <>
        <AdminHeader title="Course not found" />
        <Panel>
          <p className="text-body">This course doesn’t exist or was deleted.</p>
          <Button href="/admin/courses" variant="secondary" className="mt-5">
            Back to Courses
          </Button>
        </Panel>
      </>
    );
  }

  const pending = course.status === 'Pending Review';
  const facts = [
    { label: 'Instructor', value: course.instructor },
    { label: 'Category', value: course.category },
    { label: 'Level', value: course.level },
    { label: 'Price', value: course.price ? formatPrice(course.price) : 'Free' },
    { label: 'Rating', value: <RatingText rating={course.rating} /> },
    { label: 'Students', value: formatNumber(course.students) },
  ];

  return (
    <>
      <AdminHeader
        eyebrow={
          <AppLink
            href={pending ? '/admin/courses/pending' : '/admin/courses'}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-4" />
            {pending ? 'Pending Reviews' : 'Courses'}
          </AppLink>
        }
        title="Course Review"
        subtitle={
          course.submittedAt
            ? `Submitted ${formatRelative(course.submittedAt)}`
            : `Updated ${formatRelative(course.updatedAt)}`
        }
      />

      {course.reviewNote && (course.status === 'Changes Requested' || course.status === 'Rejected') && (
        <p className="mb-6 flex items-start gap-2.5 rounded-2xl bg-orange-50 px-4 py-3 text-sm text-orange-900 ring-1 ring-orange-100">
          <MessageSquareWarning aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span>
            <span className="font-semibold">
              {course.status === 'Rejected' ? 'Rejection reason:' : 'Feedback sent:'}
            </span>{' '}
            {course.reviewNote}
          </span>
        </p>
      )}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <Panel>
            <div className="flex flex-col gap-5 sm:flex-row">
              <CourseThumb course={course} className="aspect-video w-full sm:w-64" />
              <div className="min-w-0">
                <StatusPill status={course.status} />
                <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em]">{course.title}</h2>
                {content?.subtitle && <p className="mt-1 text-body">{content.subtitle}</p>}
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="rounded-xl bg-canvas px-3.5 py-2.5 ring-1 ring-line">
                  <dt className="text-xs text-muted">{f.label}</dt>
                  <dd className="mt-0.5 truncate text-sm font-semibold text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="Course Description" titleId="review-description">
            {content?.descriptionHtml ? (
              <div
                className="rich-text text-[15px] text-body"
                dangerouslySetInnerHTML={{ __html: content.descriptionHtml }}
              />
            ) : (
              <p className="text-sm text-muted">No description.</p>
            )}
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="What Students Learn" titleId="review-learn">
              <ul className="space-y-2 text-sm text-body">
                {content?.objectives.length ? (
                  content.objectives.map((o) => (
                    <li key={o} className="flex gap-2">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-600" />
                      {o}
                    </li>
                  ))
                ) : (
                  <li className="text-muted">None listed.</li>
                )}
              </ul>
            </Panel>
            <Panel title="Requirements" titleId="review-requirements">
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-body">
                {content?.requirements.length ? (
                  content.requirements.map((r) => <li key={r}>{r}</li>)
                ) : (
                  <li className="list-none text-muted">None listed.</li>
                )}
              </ul>
            </Panel>
          </div>

          <Panel title="Curriculum" titleId="review-curriculum" description="Open any lesson to inspect it.">
            <CurriculumInspector sections={content?.sections ?? []} />
          </Panel>
        </div>

        <aside aria-label="Review decision" className="xl:sticky xl:top-6 xl:self-start">
          <Panel title="Decision" titleId="decision-title">
            {pending ? (
              <div className="space-y-2.5">
                <Button icon={Check} fullWidth onClick={() => decide('approve', course)}>
                  Approve Course
                </Button>
                <Button
                  variant="secondary"
                  icon={MessageSquareWarning}
                  fullWidth
                  onClick={() => decide('changes', course)}
                >
                  Request Changes
                </Button>
                <Button
                  variant="ghost"
                  icon={XCircle}
                  fullWidth
                  onClick={() => decide('reject', course)}
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  Reject Course
                </Button>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-body">
                <p>
                  This course is <span className="font-semibold text-ink">{course.status}</span>.
                </p>
                {course.status === 'Published' ? (
                  <Button variant="secondary" fullWidth onClick={() => decide('unpublish', course)}>
                    Unpublish
                  </Button>
                ) : (
                  <Button fullWidth onClick={() => decide('publish', course)}>
                    Publish
                  </Button>
                )}
                {course.status === 'Published' && (
                  <Button href={`/course/${course.id}`} variant="ghost" fullWidth>
                    View public page
                  </Button>
                )}
              </div>
            )}
          </Panel>
        </aside>
      </div>
      {dialogs}
    </>
  );
}
