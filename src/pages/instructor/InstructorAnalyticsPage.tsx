import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Eye, GraduationCap, IndianRupee, UserPlus, X } from 'lucide-react';
import { RANGE_OPTIONS, buildAnalytics, rangeChange } from '../../data/instructor';
import type { AnalyticsRange } from '../../types/instructor';
import { useInstructor } from '../../context/InstructorContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { formatChange, formatNumber, formatPrice, formatPriceCompact } from '../../lib/format';
import { courseTotals, sumPoints, topCourses } from '../../lib/instructorStats';
import { AreaChart } from '../../components/charts/AreaChart';
import { BarChart } from '../../components/charts/BarChart';
import { ProgressBar } from '../../components/dashboard/ProgressBar';
import { CourseThumb } from '../../components/instructor/CourseList';
import { DemoDataBadge, InstructorHeader, Panel } from '../../components/instructor/InstructorChrome';
import { MetricCard } from '../../components/instructor/MetricCard';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { SelectInput } from '../../components/ui/Form';

const rangeWords: Record<AnalyticsRange, string> = {
  '7d': 'the last 7 days',
  '30d': 'the last 30 days',
  '3m': 'the last 3 months',
  '1y': 'the last 12 months',
};

export function InstructorAnalyticsPage() {
  usePageMeta('Analytics — Hitswork Instructor', 'Enrollments, views, completion and revenue for your courses.');
  const { courses } = useInstructor();
  const [params, setParams] = useSearchParams();
  const [range, setRange] = useState<AnalyticsRange>('30d');

  const published = courses.filter((course) => course.status === 'Published');
  const totals = courseTotals(courses);
  const course = published.find((c) => c.id === params.get('course'));
  // A single course's series is its share of all enrollments.
  const share = course && totals.enrollments ? course.enrollments / totals.enrollments : 1;
  const { points } = useMemo(() => buildAnalytics(range, share), [range, share]);
  const change = rangeChange[range];
  const completion = course ? course.completionRate : totals.completion;
  const scope = course ? course.title : 'all courses';

  const setCourse = (id: string) => setParams(id ? { course: id } : {}, { replace: true, preventScrollReset: true });

  return (
    <>
      <InstructorHeader
        title="Analytics"
        subtitle={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            How your courses are performing.
            <DemoDataBadge />
          </span>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl label="Date range" options={RANGE_OPTIONS} value={range} onChange={setRange} />
        <div className="flex items-center gap-2 sm:w-80">
          <label htmlFor="analytics-course" className="sr-only">
            Course
          </label>
          <SelectInput
            id="analytics-course"
            options={['All courses', ...published.map((c) => c.title)]}
            value={course?.title ?? 'All courses'}
            onChange={(e) => setCourse(published.find((c) => c.title === e.target.value)?.id ?? '')}
            className="h-11 truncate"
          />
          {course && (
            <button
              type="button"
              onClick={() => setCourse('')}
              aria-label="Show all courses"
              className="grid size-11 shrink-0 place-items-center rounded-xl text-muted ring-1 ring-line hover:bg-canvas hover:text-ink"
            >
              <X aria-hidden className="size-4" />
            </button>
          )}
        </div>
      </div>

      <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          index={0}
          label="Enrollments"
          value={formatNumber(sumPoints(points, 'enrollments'))}
          icon={UserPlus}
          trend={formatChange(change.enrollments)}
        />
        <MetricCard
          index={1}
          label="Course Views"
          value={formatNumber(sumPoints(points, 'views'))}
          icon={Eye}
          tone="bg-cyan-50 text-cyan-600"
          trend={formatChange(change.views)}
        />
        <MetricCard
          index={2}
          label="Completion Rate"
          value={`${Math.round(completion)}%`}
          icon={GraduationCap}
          tone="bg-violet-50 text-violet-600"
          trend={formatChange(change.completion)}
        />
        <MetricCard
          index={3}
          label="Revenue"
          value={formatPrice(sumPoints(points, 'revenue'))}
          icon={IndianRupee}
          tone="bg-emerald-50 text-emerald-600"
          trend={formatChange(change.revenue)}
        />
      </section>
      <p className="mt-2.5 text-xs text-muted">
        Showing {scope} for {rangeWords[range]}. Changes compare with the previous period.
      </p>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-2">
        <Panel
          title="Enrollments"
          titleId="enrollments-chart-title"
          description={`New enrollments, ${rangeWords[range]}`}
        >
          <AreaChart
            key={`enrollments-${range}-${share}`}
            data={points.map((p) => ({ label: p.label, value: p.enrollments }))}
            format={formatNumber}
            formatTick={(v) => formatNumber(Math.round(v))}
            seriesName="Enrollments"
            label={`Enrollments per period for ${scope}, ${rangeWords[range]} (sample data)`}
          />
        </Panel>
        <Panel title="Revenue" titleId="revenue-chart-title" description={`Your share of sales, ${rangeWords[range]}`}>
          <BarChart
            key={`revenue-${range}-${share}`}
            data={points.map((p) => ({ label: p.label, value: p.revenue }))}
            format={formatPrice}
            formatTick={formatPriceCompact}
            seriesName="Revenue"
            highlightLast
            label={`Revenue per period for ${scope}, ${rangeWords[range]} (sample data)`}
          />
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <Panel
          title="Course Completion"
          titleId="completion-title"
          description="Share of enrolled students who finished"
        >
          <ul className="space-y-4">
            {[...published]
              .sort((a, b) => b.completionRate - a.completionRate)
              .map((c) => (
                <li key={c.id}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-medium text-ink">{c.title}</span>
                    <span className="shrink-0 font-semibold text-ink tabular-nums">{c.completionRate}%</span>
                  </div>
                  <ProgressBar
                    value={c.completionRate}
                    label={`${c.title} completion rate`}
                    size="sm"
                    className="mt-2"
                    tone={c.id === course?.id ? 'success' : 'brand'}
                  />
                </li>
              ))}
          </ul>
        </Panel>

        <Panel
          title="Top Performing Courses"
          titleId="analytics-top-title"
          description="Published courses ranked by revenue"
          flush
        >
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-labelledby="analytics-top-title">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs text-muted">
                  <th scope="col" className="py-3 pr-4 pl-5 font-medium sm:pl-6">
                    Course
                  </th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">
                    Views
                  </th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">
                    Enrollments
                  </th>
                  <th scope="col" className="px-3 py-3 text-right font-medium">
                    Completion
                  </th>
                  <th scope="col" className="py-3 pr-5 pl-3 text-right font-medium sm:pr-6">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {topCourses(courses, 8).map((c) => (
                  <tr
                    key={c.id}
                    className={
                      c.id === course?.id
                        ? 'border-b border-line bg-brand-50/60 last:border-b-0'
                        : 'border-b border-line last:border-b-0'
                    }
                  >
                    <td className="py-3 pr-4 pl-5 sm:pl-6">
                      <div className="flex items-center gap-3">
                        <CourseThumb course={c} className="h-9 w-14" />
                        <span className="line-clamp-2 max-w-[15rem] font-medium text-ink">{c.title}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right text-body tabular-nums">{formatNumber(c.views)}</td>
                    <td className="px-3 py-3 text-right text-body tabular-nums">{formatNumber(c.enrollments)}</td>
                    <td className="px-3 py-3 text-right text-body tabular-nums">{c.completionRate}%</td>
                    <td className="py-3 pr-5 pl-3 text-right font-semibold whitespace-nowrap text-ink tabular-nums sm:pr-6">
                      {formatPrice(c.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}
