import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  IndianRupee,
  LayoutList,
  Plus,
  Send,
  Star,
  TrendingUp,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { RANGE_OPTIONS, buildAnalytics, instructorActivity } from '../../data/instructor';
import type { AnalyticsRange, InstructorActivity } from '../../types/instructor';
import { useInstructor } from '../../context/InstructorContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { firstName } from '../../lib/auth';
import { cn } from '../../lib/cn';
import { formatNumber, formatPrice, formatPriceCompact, formatRelative } from '../../lib/format';
import { courseTotals, greeting, sumPoints, topCourses } from '../../lib/instructorStats';
import { AreaChart } from '../../components/charts/AreaChart';
import { CourseList, CourseThumb } from '../../components/instructor/CourseList';
import {
  CreateCourseButton,
  DemoDataBadge,
  InstructorHeader,
  Panel,
} from '../../components/instructor/InstructorChrome';
import { MetricCard } from '../../components/instructor/MetricCard';
import { AppLink } from '../../components/ui/AppLink';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { TextLink } from '../../components/ui/TextLink';

type PerformanceMetric = 'students' | 'revenue' | 'enrollments';

const metricOptions: { value: PerformanceMetric; label: string }[] = [
  { value: 'students', label: 'Students' },
  { value: 'revenue', label: 'Revenue' },
  { value: 'enrollments', label: 'Enrollments' },
];

const rangeLabel: Record<AnalyticsRange, string> = {
  '7d': 'last 7 days',
  '30d': 'last 30 days',
  '3m': 'last 3 months',
  '1y': 'last 12 months',
};

function CoursePerformance() {
  const [metric, setMetric] = useState<PerformanceMetric>('students');
  const [range, setRange] = useState<AnalyticsRange>('30d');
  const { points } = useMemo(() => buildAnalytics(range), [range]);
  const isRevenue = metric === 'revenue';
  const format = isRevenue ? formatPrice : formatNumber;
  const total = sumPoints(points, metric);
  const name = metricOptions.find((option) => option.value === metric)!.label;

  return (
    <Panel
      title="Course Performance"
      titleId="performance-title"
      description={`${name} across all courses, ${rangeLabel[range]}`}
      action={<SegmentedControl label="Date range" options={RANGE_OPTIONS} value={range} onChange={setRange} />}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[1.75rem] leading-none font-extrabold tracking-[-0.02em] text-ink">
            {format(total)}
          </p>
          <p className="mt-1.5 text-sm text-muted">
            {isRevenue ? 'Revenue' : metric === 'students' ? 'New students' : 'Enrollments'} in the {rangeLabel[range]}
          </p>
        </div>
        <SegmentedControl label="Chart metric" options={metricOptions} value={metric} onChange={setMetric} />
      </div>
      <AreaChart
        key={`${metric}-${range}`}
        className="mt-6"
        data={points.map((point) => ({ label: point.label, value: point[metric] }))}
        format={format}
        formatTick={isRevenue ? formatPriceCompact : (v) => formatNumber(Math.round(v))}
        seriesName={name}
        label={`${name} per period over the ${rangeLabel[range]} (sample data)`}
      />
    </Panel>
  );
}

const activityStyles: Record<InstructorActivity['kind'], { icon: LucideIcon; className: string }> = {
  enrollment: { icon: UserPlus, className: 'bg-indigo-50 text-indigo-600' },
  review: { icon: Star, className: 'bg-amber-50 text-amber-600' },
  lesson: { icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-600' },
  revenue: { icon: TrendingUp, className: 'bg-violet-50 text-violet-600' },
  submitted: { icon: Send, className: 'bg-sky-50 text-sky-600' },
};

function RecentActivity() {
  return (
    <Panel title="Recent Activity" titleId="activity-title" className="h-full">
      <ol className="relative space-y-5">
        <span aria-hidden className="absolute top-2 bottom-2 left-[17px] w-px bg-line" />
        {instructorActivity.map((activity) => {
          const { icon: Icon, className } = activityStyles[activity.kind];
          return (
            <li key={activity.id} className="relative flex gap-3.5">
              <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl ring-4 ring-white', className)}>
                <Icon aria-hidden className="size-4" strokeWidth={2.1} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-sm leading-snug text-ink">{activity.message}</p>
                <p className="mt-1 text-xs text-muted">
                  <time dateTime={activity.createdAt}>{formatRelative(activity.createdAt)}</time>
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}

function TopPerforming() {
  const { courses } = useInstructor();
  const ranked = topCourses(courses);
  return (
    <Panel
      title="Top Performing Courses"
      titleId="top-title"
      description="Published courses ranked by revenue"
      action={<TextLink href="/instructor/analytics">Full analytics</TextLink>}
      flush
    >
      <ol className="divide-y divide-line">
        {ranked.map((course, index) => (
          <li key={course.id} className="flex items-center gap-3 px-5 py-3 sm:gap-4 sm:px-6">
            <span className="w-5 shrink-0 text-center font-display text-sm font-bold text-subtle tabular-nums">
              {index + 1}
            </span>
            <CourseThumb course={course} className="hidden h-10 w-16 min-[420px]:block" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{course.title}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <Users aria-hidden className="size-3" />
                  {formatNumber(course.students)} students
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star aria-hidden className="size-3 text-amber-400" fill="currentColor" strokeWidth={0} />
                  {course.rating?.toFixed(1)}
                </span>
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-ink tabular-nums">{formatPrice(course.revenue)}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

const quickActions: { label: string; description: string; href: string; icon: LucideIcon }[] = [
  { label: 'Create Course', description: 'Start a new draft', href: '/instructor/course/create', icon: Plus },
  { label: 'Manage Courses', description: 'Edit and publish', href: '/instructor/courses', icon: LayoutList },
  { label: 'View Students', description: 'Progress and activity', href: '/instructor/students', icon: Users },
  { label: 'View Analytics', description: 'Views and completion', href: '/instructor/analytics', icon: BarChart3 },
];

function QuickActions() {
  return (
    <Panel title="Quick Actions" titleId="quick-title" className="h-full">
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 min-[1440px]:grid-cols-2">
        {quickActions.map(({ label, description, href, icon: Icon }) => (
          <li key={label}>
            <AppLink
              href={href}
              className="group flex h-full items-center gap-3 rounded-2xl border border-line p-3.5 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/40"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-gradient group-hover:text-white">
                <Icon aria-hidden className="size-5" strokeWidth={1.9} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{label}</span>
                <span className="block truncate text-xs text-muted">{description}</span>
              </span>
            </AppLink>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function InstructorOverviewPage() {
  usePageMeta('Instructor Dashboard — Hitswork', 'Track your courses, students, analytics and earnings on Hitswork.');
  const { instructor, courses } = useInstructor();
  const totals = courseTotals(courses);
  const name = firstName(instructor?.name ?? '');

  return (
    <>
      <InstructorHeader
        title={`${greeting()}, ${name} 👋`}
        subtitle={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            Here’s what’s happening with your courses.
            <DemoDataBadge />
          </span>
        }
        primaryAction={<CreateCourseButton />}
      />

      <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          index={0}
          label="Total Students"
          value={formatNumber(instructor?.students ?? 0)}
          icon={Users}
          trend="+12.4%"
          caption="30 days"
        />
        <MetricCard
          index={1}
          label="Published Courses"
          value={totals.published}
          icon={BookOpen}
          tone="bg-cyan-50 text-cyan-600"
          trend="+1 new"
          caption="this month"
        />
        <MetricCard
          index={2}
          label="Total Revenue"
          value={formatPrice(totals.revenue)}
          icon={IndianRupee}
          tone="bg-emerald-50 text-emerald-600"
          trend="+18.6%"
          caption="30 days"
        />
        <MetricCard
          index={3}
          label="Average Rating"
          value={totals.rating ? totals.rating.toFixed(1) : '—'}
          icon={Star}
          tone="bg-amber-50 text-amber-500"
          trend="+0.1"
          caption="90 days"
        />
      </section>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
        <CoursePerformance />
        <RecentActivity />
      </div>

      <Panel
        className="mt-6"
        title="Your Courses"
        titleId="your-courses-title"
        description={`${courses.length} courses · showing the most recently updated`}
        action={
          <AppLink
            href="/instructor/courses"
            className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            View All
            <ArrowRight aria-hidden className="size-4" strokeWidth={2.2} />
          </AppLink>
        }
        flush
      >
        <CourseList compact courses={[...courses].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4)} />
      </Panel>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <TopPerforming />
        <QuickActions />
      </div>
    </>
  );
}
