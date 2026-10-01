import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Plus, Search } from 'lucide-react';
import type { AdminCourse, AdminCourseStatus } from '../../types/admin';
import { COURSE_CATEGORY_OPTIONS, COURSE_LEVEL_OPTIONS } from '../../data/instructor';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { cn } from '../../lib/cn';
import { digitsOnly } from '../../lib/checkout';
import { formatNumber, formatPrice, formatRelative } from '../../lib/format';
import { AdminHeader, RatingText, StatusPill } from '../../components/admin/AdminChrome';
import { useCourseDecisions, type CourseDecision } from '../../components/admin/CourseDecisions';
import { DataTable, RowAction } from '../../components/admin/DataTable';
import { CourseThumb } from '../../components/instructor/CourseList';
import { Panel } from '../../components/instructor/InstructorChrome';
import { Button } from '../../components/ui/Button';
import { Field, SelectInput, TextInput } from '../../components/ui/Form';
import { Modal } from '../../components/ui/Modal';

type Filter = 'All' | AdminCourseStatus;
const FILTERS: Filter[] = ['All', 'Published', 'Draft', 'Pending Review', 'Changes Requested', 'Rejected'];
const SORTS = ['Newest', 'Most Enrolled', 'Highest Rated', 'Revenue'] as const;
type Sort = (typeof SORTS)[number];

const sorters: Record<Sort, (a: AdminCourse, b: AdminCourse) => number> = {
  Newest: (a, b) => (b.submittedAt ?? b.updatedAt).localeCompare(a.submittedAt ?? a.updatedAt),
  'Most Enrolled': (a, b) => b.students - a.students,
  'Highest Rated': (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  Revenue: (a, b) => b.revenue - a.revenue,
};

/** Add (no course) or edit the basics of a course. */
function CourseFormDialog({
  open,
  course,
  onClose,
}: {
  open: boolean;
  course: AdminCourse | null;
  onClose: () => void;
}) {
  const { addCourse, updateCourse } = useAdmin();
  const { notify } = useStore();
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [category, setCategory] = useState('Development');
  const [level, setLevel] = useState<AdminCourse['level']>('Beginner');
  const [price, setPrice] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(course?.title ?? '');
    setInstructor(course?.instructor ?? '');
    setCategory(course?.category ?? 'Development');
    setLevel(course?.level ?? 'Beginner');
    setPrice(course ? String(course.price) : '');
    setSubmitted(false);
  }, [open, course]);

  const errors = {
    title: title.trim().length < 5 ? 'Enter a course title (at least 5 characters)' : undefined,
    instructor: !course && instructor.trim().length < 2 ? 'Enter the instructor’s name' : undefined,
  };

  const save = () => {
    setSubmitted(true);
    if (errors.title || errors.instructor) return;
    const values = { title: title.trim(), category, level, price: Number(price) || 0 };
    if (course) {
      updateCourse(course.id, values);
      notify('Course updated');
    } else {
      addCourse({ ...values, instructor: instructor.trim() });
      notify('Course added as a draft');
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={course ? 'Edit Course' : 'Add Course'}
      description={
        course ? course.title : 'Creates a draft course. Content is added by the instructor in the course builder.'
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>{course ? 'Save Changes' : 'Add Course'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field id="admin-course-title" label="Course title" error={submitted ? errors.title : undefined}>
          <TextInput
            id="admin-course-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            invalid={submitted && !!errors.title}
          />
        </Field>
        {!course && (
          <Field id="admin-course-instructor" label="Instructor" error={submitted ? errors.instructor : undefined}>
            <TextInput
              id="admin-course-instructor"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              invalid={submitted && !!errors.instructor}
            />
          </Field>
        )}
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="admin-course-category" label="Category">
            <SelectInput
              id="admin-course-category"
              options={COURSE_CATEGORY_OPTIONS}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Field>
          <Field id="admin-course-level" label="Level">
            <SelectInput
              id="admin-course-level"
              options={COURSE_LEVEL_OPTIONS}
              value={level}
              onChange={(e) => setLevel(e.target.value as AdminCourse['level'])}
            />
          </Field>
          <Field id="admin-course-price" label="Price (₹)">
            <TextInput
              id="admin-course-price"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(digitsOnly(e.target.value).slice(0, 6))}
            />
          </Field>
        </div>
      </div>
    </Modal>
  );
}

function CourseActions({
  course,
  decide,
  onEdit,
}: {
  course: AdminCourse;
  decide: (d: CourseDecision, c: AdminCourse) => void;
  onEdit: () => void;
}) {
  const viewHref = course.status === 'Published' ? `/course/${course.id}` : `/admin/courses/${course.id}/review`;
  return (
    <div className="flex flex-wrap justify-end gap-1">
      <RowAction href={viewHref} label={`View ${course.title}`}>
        View
      </RowAction>
      <RowAction onClick={onEdit} label={`Edit ${course.title}`}>
        Edit
      </RowAction>
      {course.status === 'Pending Review' && (
        <RowAction tone="primary" href={`/admin/courses/${course.id}/review`} label={`Review ${course.title}`}>
          Review
        </RowAction>
      )}
      {course.status === 'Published' ? (
        <RowAction onClick={() => decide('unpublish', course)} label={`Unpublish ${course.title}`}>
          Unpublish
        </RowAction>
      ) : (
        course.status !== 'Pending Review' && (
          <RowAction tone="primary" onClick={() => decide('publish', course)} label={`Publish ${course.title}`}>
            Publish
          </RowAction>
        )
      )}
      <RowAction tone="danger" onClick={() => decide('delete', course)} label={`Delete ${course.title}`}>
        Delete
      </RowAction>
    </div>
  );
}

export function AdminCoursesPage({ pendingOnly = false }: { pendingOnly?: boolean }) {
  usePageMeta(
    pendingOnly ? 'Pending Reviews — Hitswork Admin' : 'Courses — Hitswork Admin',
    'Manage Hitswork courses.',
  );
  const { courses } = useAdmin();
  const { decide, dialogs } = useCourseDecisions();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('Newest');
  const filter: Filter = pendingOnly ? 'Pending Review' : ((params.get('status') as Filter | null) ?? 'All');
  const [editing, setEditing] = useState<AdminCourse | null>(null);
  const [formOpen, setFormOpen] = useState(params.get('new') === '1');

  const counts = useMemo(() => {
    const result = Object.fromEntries(FILTERS.map((f) => [f, 0])) as Record<Filter, number>;
    result.All = courses.length;
    for (const c of courses) result[c.status] += 1;
    return result;
  }, [courses]);

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return courses
      .filter((c) => filter === 'All' || c.status === filter)
      .filter((c) => !term || `${c.title} ${c.instructor} ${c.category}`.toLowerCase().includes(term))
      .sort(sorters[sort]);
  }, [courses, filter, query, sort]);

  const openForm = (course: AdminCourse | null) => {
    setEditing(course);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    if (params.get('new'))
      setParams(
        (p) => {
          p.delete('new');
          return p;
        },
        { replace: true },
      );
  };

  return (
    <>
      <AdminHeader
        title={pendingOnly ? 'Pending Reviews' : 'Courses'}
        subtitle={
          pendingOnly ? 'Courses submitted by instructors and waiting for a decision.' : 'Every course on the platform.'
        }
        primaryAction={
          <Button icon={Plus} onClick={() => openForm(null)}>
            Add Course
          </Button>
        }
      />

      <Panel flush>
        <div className="space-y-4 border-b border-line px-5 py-4 sm:px-6">
          {!pendingOnly && (
            <div
              role="tablist"
              aria-label="Filter by status"
              className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:px-0"
            >
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  onClick={() =>
                    setParams(f === 'All' ? {} : { status: f }, { replace: true, preventScrollReset: true })
                  }
                  className={cn(
                    'inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-sm font-semibold whitespace-nowrap transition-colors',
                    filter === f ? 'bg-ink text-white' : 'text-body hover:bg-canvas hover:text-ink',
                  )}
                >
                  {f}
                  <span
                    className={cn(
                      'rounded-full px-1.5 text-[11px] tabular-nums',
                      filter === f ? 'bg-white/20' : 'bg-canvas text-muted ring-1 ring-line',
                    )}
                  >
                    {counts[f]}
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <label htmlFor="admin-course-search" className="sr-only">
                Search courses
              </label>
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-subtle"
              />
              <input
                id="admin-course-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses..."
                className="h-11 w-full rounded-xl border border-line-strong bg-white pr-4 pl-10 text-[15px] text-ink outline-none placeholder:text-subtle focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
              />
            </div>
            <div className="sm:w-52">
              <label htmlFor="admin-course-sort" className="sr-only">
                Sort
              </label>
              <SelectInput
                id="admin-course-sort"
                options={SORTS}
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-11"
              />
            </div>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {rows.length} courses shown
        </p>

        <DataTable
          rows={rows.slice(0, 60)}
          rowKey={(c) => c.id}
          caption="Courses"
          empty={<p className="px-6 py-12 text-center text-sm text-muted">No courses match.</p>}
          columns={[
            {
              key: 'course',
              header: 'Course',
              render: (c) => (
                <div className="flex items-center gap-3">
                  <CourseThumb course={c} className="h-10 w-16" />
                  <span className="line-clamp-2 max-w-[16rem] font-semibold text-ink">{c.title}</span>
                </div>
              ),
            },
            {
              key: 'instructor',
              header: 'Instructor',
              render: (c) => <span className="whitespace-nowrap">{c.instructor}</span>,
            },
            { key: 'category', header: 'Category', render: (c) => c.category },
            {
              key: 'students',
              header: 'Students',
              align: 'right',
              render: (c) => <span className="tabular-nums">{formatNumber(c.students)}</span>,
            },
            { key: 'rating', header: 'Rating', align: 'right', render: (c) => <RatingText rating={c.rating} /> },
            { key: 'status', header: 'Status', render: (c) => <StatusPill status={c.status} /> },
            {
              key: 'updated',
              header: 'Updated',
              render: (c) => <span className="whitespace-nowrap text-muted">{formatRelative(c.updatedAt)}</span>,
            },
            {
              key: 'actions',
              header: <span className="sr-only">Actions</span>,
              align: 'right',
              render: (c) => <CourseActions course={c} decide={decide} onEdit={() => openForm(c)} />,
            },
          ]}
          card={(c) => (
            <div>
              <div className="flex gap-3">
                <CourseThumb course={c} className="h-12 w-20" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 font-semibold text-ink">{c.title}</p>
                  <p className="text-xs text-muted">
                    {c.instructor} · {c.category}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                    <StatusPill status={c.status} />
                    <span>{formatNumber(c.students)} students</span>
                    <span>{c.price ? formatPrice(c.price) : 'Free'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2.5 [&>div]:justify-start">
                <CourseActions course={c} decide={decide} onEdit={() => openForm(c)} />
              </div>
            </div>
          )}
        />
        {rows.length > 60 && (
          <p className="border-t border-line px-6 py-3 text-xs text-muted">
            Showing 60 of {rows.length}. Refine your search to see more.
          </p>
        )}
      </Panel>

      <CourseFormDialog open={formOpen} course={editing} onClose={closeForm} />
      {dialogs}
    </>
  );
}

export function AdminPendingPage() {
  return <AdminCoursesPage pendingOnly />;
}
