import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Copy, Eye, MoreHorizontal, Pencil, Send, Star, Trash2, Users } from 'lucide-react';
import type { InstructorCourse, InstructorCourseStatus } from '../../types/instructor';
import { useInstructor } from '../../context/InstructorContext';
import { useStore } from '../../context/StoreContext';
import { cn } from '../../lib/cn';
import { formatNumber, formatPrice, formatRelative } from '../../lib/format';
import { AppLink } from '../ui/AppLink';
import { SmartImage } from '../ui/SmartImage';

const statusStyles: Record<InstructorCourseStatus, string> = {
  Published: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Draft: 'bg-slate-100 text-slate-700 ring-slate-200',
  'Pending Review': 'bg-amber-50 text-amber-800 ring-amber-100',
  'Changes Requested': 'bg-orange-50 text-orange-800 ring-orange-100',
  Rejected: 'bg-rose-50 text-rose-700 ring-rose-100',
};

export function CourseStatusBadge({ status }: { status: InstructorCourseStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ring-1',
        statusStyles[status],
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function CourseThumb({ course, className }: { course: { image: string; thumbnail?: string }; className?: string }) {
  return (
    <div className={cn('shrink-0 overflow-hidden rounded-xl bg-brand-50 ring-1 ring-line', className)}>
      <SmartImage
        photoId={course.thumbnail ?? course.image}
        alt=""
        width={160}
        ratio={16 / 10}
        widths={[160, 320]}
        sizes="96px"
        className="size-full"
      />
    </div>
  );
}

export const ratingText = (course: InstructorCourse) =>
  course.rating === null ? 'Not rated' : course.rating.toFixed(1);
export const revenueText = (course: InstructorCourse) => (course.revenue > 0 ? formatPrice(course.revenue) : '—');

/** "More" menu: submit for review, duplicate, delete. */
function MoreMenu({ course }: { course: InstructorCourse }) {
  const { submitForReview, duplicateCourse, deleteCourse } = useInstructor();
  const { notify } = useStore();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const canSubmit = course.status === 'Draft' || course.status === 'Rejected' || course.status === 'Changes Requested';
  const canDelete = course.status !== 'Published';

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    rootRef.current?.querySelector<HTMLElement>('[role=menuitem]')?.focus();
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const run = (action: () => void) => {
    setOpen(false);
    action();
  };

  const itemClass =
    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-body outline-none transition-colors hover:bg-canvas hover:text-ink focus-visible:bg-canvas disabled:pointer-events-none disabled:opacity-40';

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`More actions for ${course.title}`}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink',
          open && 'bg-canvas text-ink',
        )}
      >
        <MoreHorizontal aria-hidden className="size-[18px]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Course actions"
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.14 }}
            className="absolute top-full right-0 z-30 mt-1.5 w-52 origin-top-right rounded-xl border border-line bg-white p-1.5 shadow-float"
          >
            <button
              type="button"
              role="menuitem"
              disabled={!canSubmit}
              onClick={() =>
                run(() => {
                  submitForReview(course.id);
                  notify(`“${course.title}” submitted for review`);
                })
              }
              className={itemClass}
            >
              <Send aria-hidden className="size-4" />
              Submit for Review
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() =>
                run(() => {
                  duplicateCourse(course.id);
                  notify('Course duplicated as a draft');
                })
              }
              className={itemClass}
            >
              <Copy aria-hidden className="size-4" />
              Duplicate
            </button>
            <button
              type="button"
              role="menuitem"
              disabled={!canDelete}
              title={canDelete ? undefined : 'Published courses can’t be deleted'}
              onClick={() =>
                run(() => {
                  if (window.confirm(`Delete “${course.title}”? This can’t be undone.`)) {
                    deleteCourse(course.id);
                    notify('Course deleted');
                  }
                })
              }
              className={cn(itemClass, 'text-rose-600 hover:bg-rose-50 hover:text-rose-700')}
            >
              <Trash2 aria-hidden className="size-4" />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Edit · View · Analytics · More */
export function CourseActions({ course }: { course: InstructorCourse }) {
  const navigate = useNavigate();
  const iconButton =
    'grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-brand-700 aria-disabled:pointer-events-none aria-disabled:opacity-35';
  // Live courses open their public page; anything else opens the instructor preview.
  const viewHref = course.catalogId ? `/course/${course.catalogId}` : `/instructor/course/${course.id}/preview`;
  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => navigate(`/instructor/course/${course.id}/edit`)}
        aria-label={`Edit ${course.title}`}
        title="Edit"
        className={iconButton}
      >
        <Pencil aria-hidden className="size-4" />
      </button>
      <AppLink
        href={viewHref}
        aria-label={`${course.catalogId ? 'View' : 'Preview'} ${course.title}`}
        title={course.catalogId ? 'View course page' : 'Preview'}
        className={iconButton}
      >
        <Eye aria-hidden className="size-4" />
      </AppLink>
      <AppLink
        href={`/instructor/analytics?course=${course.id}`}
        aria-label={`Analytics for ${course.title}`}
        title="Analytics"
        className={iconButton}
      >
        <BarChart3 aria-hidden className="size-4" />
      </AppLink>
      <MoreMenu course={course} />
    </div>
  );
}

interface CourseListProps {
  courses: InstructorCourse[];
  /** Fewer columns, for the overview */
  compact?: boolean;
  emptyState?: ReactNode;
}

/** Wide screens: table. Narrower: one card per course (horizontal from sm). */
export function CourseList({ courses, compact = false, emptyState }: CourseListProps) {
  if (courses.length === 0) return <>{emptyState}</>;
  return (
    <>
      <div className="hidden min-[1280px]:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-muted">
              <th scope="col" className="py-3 pr-4 pl-6 font-medium">
                Course
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Students
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Rating
              </th>
              <th scope="col" className="px-4 py-3 text-right font-medium">
                Revenue
              </th>
              {!compact && (
                <th scope="col" className="px-4 py-3 font-medium">
                  Updated
                </th>
              )}
              <th scope="col" className="py-3 pr-4 pl-2 text-right font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-b border-line transition-colors last:border-b-0 hover:bg-canvas/60">
                <td className="py-3.5 pr-4 pl-6">
                  <div className="flex items-center gap-3.5">
                    <CourseThumb course={course} className="h-12 w-[4.75rem]" />
                    <div className="min-w-0">
                      <p className="line-clamp-2 max-w-sm font-semibold text-ink">{course.title}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {course.category} · {course.level}
                        {compact && <> · Updated {formatRelative(course.updatedAt)}</>}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <CourseStatusBadge status={course.status} />
                </td>
                <td className="px-4 py-3.5 text-right text-ink tabular-nums">{formatNumber(course.students)}</td>
                <td className="px-4 py-3.5 text-right whitespace-nowrap tabular-nums">
                  {course.rating === null ? (
                    <span className="text-muted">Not rated</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-semibold text-ink">
                      <Star aria-hidden className="size-3.5 text-amber-400" fill="currentColor" strokeWidth={0} />
                      {course.rating.toFixed(1)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right font-semibold whitespace-nowrap text-ink tabular-nums">
                  {revenueText(course)}
                </td>
                {!compact && (
                  <td className="px-4 py-3.5 whitespace-nowrap text-muted">{formatRelative(course.updatedAt)}</td>
                )}
                <td className="py-3.5 pr-4 pl-2">
                  <div className="flex justify-end">
                    <CourseActions course={course} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-line min-[1280px]:hidden">
        {courses.map((course) => (
          <li key={course.id} className="px-5 py-4 sm:flex sm:items-center sm:gap-5 sm:px-6">
            <div className="flex min-w-0 gap-3.5 sm:flex-1 sm:items-center">
              <CourseThumb course={course} className="h-14 w-[5.5rem]" />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-semibold text-ink">{course.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <CourseStatusBadge status={course.status} />
                  <span className="hidden text-xs text-muted sm:inline">
                    Updated {formatRelative(course.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
            <dl className="mt-3.5 grid grid-cols-3 gap-2 rounded-xl bg-canvas px-3 py-2.5 text-center ring-1 ring-line sm:mt-0 sm:w-72 sm:shrink-0">
              <div className="flex min-w-0 flex-col-reverse">
                <dt className="text-[11px] text-muted">Students</dt>
                <dd className="flex items-center justify-center gap-1 text-sm font-semibold text-ink tabular-nums">
                  <Users aria-hidden className="size-3.5 text-subtle" />
                  {formatNumber(course.students)}
                </dd>
              </div>
              <div className="flex min-w-0 flex-col-reverse">
                <dt className="text-[11px] text-muted">Rating</dt>
                <dd className="text-sm font-semibold text-ink tabular-nums">{ratingText(course)}</dd>
              </div>
              <div className="flex min-w-0 flex-col-reverse">
                <dt className="text-[11px] text-muted">Revenue</dt>
                <dd className="truncate text-sm font-semibold text-ink tabular-nums">{revenueText(course)}</dd>
              </div>
            </dl>
            <div className="mt-2.5 flex items-center justify-between gap-3 sm:mt-0 sm:shrink-0">
              <p className="text-xs text-muted sm:hidden">Updated {formatRelative(course.updatedAt)}</p>
              <CourseActions course={course} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
