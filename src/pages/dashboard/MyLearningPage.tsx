import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronDown, Search, SearchX } from 'lucide-react';
import { useLearning, type CourseLearning, type LearningStatus } from '../../context/LearningContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { FilterPills } from '../../components/course/FilterPills';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { LearningProgressCard } from '../../components/dashboard/LearningProgressCard';
import { EmptyState } from '../../components/dashboard/Widgets';
import { Button } from '../../components/ui/Button';

type Tab = 'all' | LearningStatus;
const tabs: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'not-started', label: 'Not Started' },
];

const sorts = [
  { id: 'recent', label: 'Recently Accessed' },
  { id: 'progress', label: 'Progress' },
  { id: 'title', label: 'A–Z' },
] as const;
type SortId = (typeof sorts)[number]['id'];

const lastTouched = (c: CourseLearning) => c.record.lastAccessedAt ?? c.record.enrolledAt;

const PANEL_ID = 'my-learning-results';

export function MyLearningPage() {
  useDocumentTitle('My Learning — Hitswork');
  const { myCourses } = useLearning();
  const [params, setParams] = useSearchParams();
  const tab = (tabs.find((t) => t.id === params.get('tab'))?.id ?? 'all') as Tab;
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortId>('recent');

  const counts = useMemo(() => {
    const byStatus = (status: LearningStatus) => myCourses.filter((c) => c.status === status).length;
    return { all: myCourses.length, 'in-progress': byStatus('in-progress'), completed: byStatus('completed'), 'not-started': byStatus('not-started') };
  }, [myCourses]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = myCourses.filter(
      (c) =>
        (tab === 'all' || c.status === tab) &&
        (!q || `${c.course.title} ${c.course.instructor}`.toLowerCase().includes(q)),
    );
    return [...list].sort((a, b) =>
      sort === 'progress'
        ? b.percent - a.percent
        : sort === 'title'
          ? a.course.title.localeCompare(b.course.title)
          : lastTouched(b).localeCompare(lastTouched(a)),
    );
  }, [myCourses, tab, query, sort]);

  const setTab = (next: Tab) => setParams(next === 'all' ? {} : { tab: next }, { replace: true });

  return (
    <>
      <DashboardHeader title="My Learning" subtitle="All your courses in one place." />

      {myCourses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          text="Courses you purchase or enroll in will appear here."
          action={
            <Button href="/courses" arrow>
              Explore Courses
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <FilterPills
              options={tabs.map((t) => ({ id: t.id, label: `${t.label} (${counts[t.id]})` }))}
              value={tab}
              onChange={setTab}
              controls={PANEL_ID}
              label="Filter my courses"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="group relative sm:w-64">
                <label htmlFor="my-learning-search" className="sr-only">
                  Search my courses
                </label>
                <Search
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle group-focus-within:text-brand-600"
                  strokeWidth={2.2}
                />
                <input
                  id="my-learning-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search my courses..."
                  className="h-10 w-full rounded-xl border border-line-strong bg-white pr-3 pl-10 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-subtle hover:border-brand-200 focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="my-learning-sort" className="text-sm whitespace-nowrap text-muted">
                  Sort by
                </label>
                <div className="relative flex-1 sm:flex-none">
                  <select
                    id="my-learning-sort"
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortId)}
                    className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-line-strong bg-white pr-9 pl-3.5 text-sm font-semibold text-ink outline-none transition-[border-color,box-shadow] hover:border-brand-200 focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                  >
                    {sorts.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
                </div>
              </div>
            </div>
          </div>

          <div id={PANEL_ID} role="tabpanel" aria-labelledby={`${PANEL_ID}-tab-${tab}`} className="mt-7">
            {visible.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No courses match"
                text={query ? `Nothing in this list matches “${query}”.` : 'There are no courses in this list yet.'}
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setQuery('');
                      setTab('all');
                    }}
                  >
                    Show all courses
                  </Button>
                }
              />
            ) : (
              <motion.ul layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence initial={false}>
                  {visible.map((item) => (
                    <motion.li
                      key={item.course.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LearningProgressCard item={item} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </div>
        </>
      )}
    </>
  );
}
