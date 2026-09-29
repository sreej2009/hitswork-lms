import { useCallback, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { LayoutGrid, Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import { categories } from '../data/categories';
import { courses } from '../data/courses';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  PAGE_SIZE,
  activeFilterCount,
  defaultQuery,
  facetCounts,
  filterCourses,
  parseQuery,
  sortCourses,
  toParams,
  type CatalogQuery,
} from '../lib/catalog';
import { formatNumber } from '../lib/format';
import { ActiveFilters } from '../components/catalog/ActiveFilters';
import { FilterPanel } from '../components/catalog/FilterPanel';
import { FilterSheet } from '../components/catalog/FilterSheet';
import { Pagination } from '../components/catalog/Pagination';
import { SortSelect } from '../components/catalog/SortSelect';
import { CourseCard } from '../components/course/CourseCard';
import { FilterPills, type FilterOption } from '../components/course/FilterPills';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';

const RESULTS_ID = 'course-results';

/** Category tabs shown under the search bar. */
const TAB_CATEGORY_IDS = ['development', 'business', 'design', 'marketing', 'photography', 'music', 'it-software'];

function categoryTabs(active: string): FilterOption<string>[] {
  const ids = TAB_CATEGORY_IDS.includes(active) || active === 'all' ? TAB_CATEGORY_IDS : [...TAB_CATEGORY_IDS, active];
  return [
    { id: 'all', label: 'All', icon: LayoutGrid },
    ...ids.map((id) => {
      const category = categories.find((c) => c.id === id)!;
      return { id, label: category.name, icon: category.icon };
    }),
  ];
}

export function CoursesPage() {
  useDocumentTitle('All Courses — Hitswork');
  const [params, setParams] = useSearchParams();
  const query = useMemo(() => parseQuery(params), [params]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  /** Any filter change goes back to page 1; the URL is the single source of truth. */
  const update = useCallback(
    (patch: Partial<CatalogQuery>) => setParams(toParams({ ...query, page: 1, ...patch }), { replace: true }),
    [query, setParams],
  );

  const clearFilters = useCallback(
    () => update({ levels: [], prices: [], rating: null, durations: [] }),
    [update],
  );
  const clearEverything = useCallback(() => setParams(toParams(defaultQuery), { replace: true }), [setParams]);

  const results = useMemo(() => sortCourses(filterCourses(courses, query), query.sort), [query]);
  const counts = useMemo(() => facetCounts(courses, query), [query]);
  const activeCount = activeFilterCount(query);

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(query.page, pageCount);
  const start = (page - 1) * PAGE_SIZE;
  const visible = results.slice(start, start + PAGE_SIZE);

  const goToPage = (next: number) => {
    setParams(toParams({ ...query, page: next }));
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filterPanel = (variant: 'card' | 'plain') => (
    <FilterPanel
      query={query}
      counts={counts}
      onChange={update}
      onClear={clearFilters}
      activeCount={activeCount}
      variant={variant}
    />
  );

  return (
    <>
      {/* Header */}
      <section aria-labelledby="courses-title" className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-brand-50/80 via-grape-50/30 to-white" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-dots opacity-50 [mask-image:radial-gradient(ellipse_45%_80%_at_85%_10%,black,transparent)]"
        />
        <Container className="pt-10 pb-8 sm:pt-14 lg:pt-16">
          <Badge eyebrow tone="outline">
            <span aria-hidden className="size-1.5 rounded-full bg-brand-gradient" />
            Courses
          </Badge>
          <h1
            id="courses-title"
            className="mt-5 text-[2.5rem] leading-[1.06] font-extrabold tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]"
          >
            All Courses
          </h1>
          <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-body sm:text-lg">
            Explore thousands of courses and learn something new today.
          </p>

          <form role="search" onSubmit={(event) => event.preventDefault()} className="group relative mt-7 max-w-2xl">
            <label htmlFor="course-search" className="sr-only">
              Search courses
            </label>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-subtle transition-colors group-focus-within:text-brand-600"
              strokeWidth={2}
            />
            <input
              id="course-search"
              type="search"
              autoComplete="off"
              value={query.q}
              onChange={(event) => update({ q: event.target.value })}
              placeholder="Search courses..."
              className="h-14 w-full rounded-2xl border border-line bg-white pr-12 pl-13 text-base text-ink shadow-card outline-none transition-[border-color,box-shadow] placeholder:text-subtle hover:border-line-strong focus:border-brand-300 focus:ring-4 focus:ring-brand-100 [&::-webkit-search-cancel-button]:hidden"
            />
            {query.q && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => update({ q: '' })}
                className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-ink"
              >
                <X aria-hidden className="size-4" strokeWidth={2.2} />
              </button>
            )}
          </form>

          <div className="mt-7">
            <FilterPills
              options={categoryTabs(query.category)}
              value={query.category}
              onChange={(category) => update({ category })}
              controls={RESULTS_ID}
              label="Course categories"
            />
          </div>
        </Container>
      </section>

      {/* Catalog */}
      <Container className="py-10 lg:py-12">
        <div className="lg:grid lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-8 xl:gap-10">
          <aside aria-label="Course filters" className="hidden lg:block">
            <div className="no-scrollbar sticky top-24 max-h-[calc(100vh-7.5rem)] overflow-y-auto rounded-2xl">
              {filterPanel('card')}
            </div>
          </aside>

          <section aria-labelledby="results-count" className="min-w-0">
            <div
              ref={resultsRef}
              id="results-top"
              className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3"
            >
              <div aria-live="polite">
                <h2 id="results-count" className="font-display text-xl font-bold tracking-[-0.01em] sm:text-2xl">
                  {formatNumber(results.length)} {results.length === 1 ? 'Course' : 'Courses'}
                </h2>
                <p className="mt-0.5 text-sm text-muted">
                  {results.length
                    ? `Showing ${start + 1}–${start + visible.length} of ${formatNumber(results.length)}`
                    : 'No courses match your filters'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  ref={filterButtonRef}
                  variant="secondary"
                  size="sm"
                  icon={SlidersHorizontal}
                  onClick={() => setSheetOpen(true)}
                  aria-haspopup="dialog"
                  className="h-10! lg:hidden"
                >
                  Filters
                  {activeCount > 0 && (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-gradient px-1 text-[11px] text-white">
                      {activeCount}
                    </span>
                  )}
                </Button>
                <SortSelect value={query.sort} onChange={(sort) => update({ sort })} />
              </div>
            </div>

            <div className="mt-5 empty:hidden">
              <ActiveFilters query={query} onChange={update} onClearAll={clearEverything} />
            </div>

            <div id={RESULTS_ID} role="tabpanel" aria-labelledby={`${RESULTS_ID}-tab-${query.category}`} className="mt-6">
              {visible.length ? (
                <motion.ul
                  key={`${params.toString()}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3"
                >
                  {visible.map((course, index) => (
                    <li key={course.id}>
                      <CourseCard course={course} priority={index < 3} />
                    </li>
                  ))}
                </motion.ul>
              ) : (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-line-strong bg-canvas px-6 py-16 text-center">
                  <span className="grid size-14 place-items-center rounded-2xl bg-white text-brand-600 shadow-card">
                    <SearchX aria-hidden className="size-6" strokeWidth={2} />
                  </span>
                  <h3 className="mt-5 text-lg font-bold">No courses found</h3>
                  <p className="mt-1.5 max-w-sm text-sm text-body">
                    Try a different search term, choose another category or remove some filters.
                  </p>
                  <Button variant="secondary" onClick={clearEverything} className="mt-6">
                    Clear search & filters
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-12">
              <Pagination page={page} pageCount={pageCount} onChange={goToPage} />
            </div>
          </section>
        </div>
      </Container>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onClear={clearFilters}
        resultCount={results.length}
        activeCount={activeCount}
        returnFocusRef={filterButtonRef}
      >
        {filterPanel('plain')}
      </FilterSheet>
    </>
  );
}
