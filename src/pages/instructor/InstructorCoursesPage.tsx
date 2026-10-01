import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { BookPlus, Search, SearchX, X } from 'lucide-react';
import type { InstructorCourse, InstructorCourseStatus } from '../../types/instructor';
import { useInstructor } from '../../context/InstructorContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { cn } from '../../lib/cn';
import { CourseList } from '../../components/instructor/CourseList';
import { CreateCourseButton, InstructorHeader, Panel } from '../../components/instructor/InstructorChrome';
import { Button } from '../../components/ui/Button';
import { SelectInput } from '../../components/ui/Form';

type StatusFilter = 'All' | InstructorCourseStatus;

const sortOptions = ['Recently Updated', 'Most Students', 'Highest Rated', 'Revenue'] as const;
type SortOption = (typeof sortOptions)[number];

const sorters: Record<SortOption, (a: InstructorCourse, b: InstructorCourse) => number> = {
  'Recently Updated': (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  'Most Students': (a, b) => b.students - a.students,
  'Highest Rated': (a, b) => (b.rating ?? -1) - (a.rating ?? -1) || b.reviews - a.reviews,
  Revenue: (a, b) => b.revenue - a.revenue,
};

export function InstructorCoursesPage() {
  usePageMeta('My Courses — Hitswork Instructor', 'Manage, edit and publish your Hitswork courses.');
  const { courses } = useInstructor();
  const [params, setParams] = useSearchParams();

  const status = (params.get('status') as StatusFilter | null) ?? 'All';
  const query = params.get('q') ?? '';
  const sort: SortOption = sortOptions.find((option) => option === params.get('sort')) ?? 'Recently Updated';

  const update = (key: string, value: string, fallback: string) =>
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (!value || value === fallback) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true, preventScrollReset: true },
    );

  const counts = useMemo(() => {
    const result: Record<StatusFilter, number> = {
      All: courses.length,
      Published: 0,
      Draft: 0,
      'Pending Review': 0,
      'Changes Requested': 0,
      Rejected: 0,
    };
    for (const course of courses) result[course.status] += 1;
    return result;
  }, [courses]);

  // Rejected only gets its own tab when there is something in it.
  const tabs: StatusFilter[] = [
    'All',
    'Published',
    'Draft',
    'Pending Review',
    ...(counts['Changes Requested'] ? (['Changes Requested'] as const) : []),
    ...(counts.Rejected ? (['Rejected'] as const) : []),
  ];

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return courses
      .filter((course) => status === 'All' || course.status === status)
      .filter((course) => !term || `${course.title} ${course.category}`.toLowerCase().includes(term))
      .sort(sorters[sort]);
  }, [courses, status, query, sort]);

  return (
    <>
      <InstructorHeader
        title="My Courses"
        subtitle="Create, update and publish your courses."
        primaryAction={<CreateCourseButton />}
      />

      <Panel flush>
        <div className="space-y-4 border-b border-line px-5 py-4 sm:px-6">
          <div
            role="tablist"
            aria-label="Filter by status"
            className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 sm:mx-0 sm:px-0"
          >
            {tabs.map((tab) => {
              const selected = status === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => update('status', tab, 'All')}
                  className={cn(
                    'inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-sm font-semibold whitespace-nowrap transition-colors',
                    selected ? 'bg-ink text-white' : 'text-body hover:bg-canvas hover:text-ink',
                  )}
                >
                  {tab}
                  <span
                    className={cn(
                      'rounded-full px-1.5 text-[11px] tabular-nums',
                      selected ? 'bg-white/20 text-white' : 'bg-canvas text-muted ring-1 ring-line',
                    )}
                  >
                    {counts[tab]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <label htmlFor="course-search" className="sr-only">
                Search your courses
              </label>
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-subtle"
              />
              <input
                id="course-search"
                type="search"
                value={query}
                onChange={(e) => update('q', e.target.value, '')}
                placeholder="Search your courses..."
                className="h-11 w-full rounded-xl border border-line-strong bg-white pr-10 pl-10 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-subtle hover:border-brand-200 focus:border-brand-300 focus:ring-4 focus:ring-brand-100 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => update('q', '', '')}
                  className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
                >
                  <X aria-hidden className="size-4" />
                </button>
              )}
            </div>
            <div className="sm:w-56">
              <label htmlFor="course-sort" className="sr-only">
                Sort courses
              </label>
              <SelectInput
                id="course-sort"
                options={sortOptions}
                value={sort}
                onChange={(e) => update('sort', e.target.value, 'Recently Updated')}
                className="h-11"
              />
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'course' : 'courses'} shown
        </p>

        <CourseList
          courses={visible}
          emptyState={
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                {courses.length ? (
                  <SearchX aria-hidden className="size-6" />
                ) : (
                  <BookPlus aria-hidden className="size-6" />
                )}
              </span>
              <p className="mt-5 text-lg font-bold text-ink">
                {courses.length ? 'No courses match your filters' : 'You haven’t created a course yet'}
              </p>
              <p className="mt-1.5 max-w-sm text-[15px] text-body">
                {courses.length
                  ? 'Try another status or search term.'
                  : 'Create your first course and start sharing what you know.'}
              </p>
              {courses.length ? (
                <Button
                  variant="secondary"
                  className="mt-6"
                  onClick={() => setParams({}, { replace: true, preventScrollReset: true })}
                >
                  Clear filters
                </Button>
              ) : (
                <CreateCourseButton className="mt-6" />
              )}
            </div>
          }
        />
      </Panel>
    </>
  );
}
