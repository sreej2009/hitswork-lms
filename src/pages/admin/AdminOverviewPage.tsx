import { useMemo, useState } from 'react';
import {
  BookOpen,
  Building2,
  CircleCheck,
  ClipboardCheck,
  GraduationCap,
  IndianRupee,
  Plus,
  Presentation,
  ReceiptText,
  TrendingUp,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { adminActivity, platformMetrics } from '../../data/admin';
import { RANGE_OPTIONS, buildAnalytics } from '../../data/instructor';
import type { AdminActivityKind } from '../../types/admin';
import type { AnalyticsRange } from '../../types/instructor';
import { useAdmin } from '../../context/AdminContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { cn } from '../../lib/cn';
import { formatNumber, formatPrice, formatPriceCompact, formatRelative } from '../../lib/format';
import { greeting, sumPoints } from '../../lib/instructorStats';
import { AdminHeader, SampleNote, StatusPill } from '../../components/admin/AdminChrome';
import { useCourseDecisions } from '../../components/admin/CourseDecisions';
import { DataTable, RowAction } from '../../components/admin/DataTable';
import { AreaChart } from '../../components/charts/AreaChart';
import { CourseThumb } from '../../components/instructor/CourseList';
import { DemoDataBadge, Panel } from '../../components/instructor/InstructorChrome';
import { MetricCard } from '../../components/instructor/MetricCard';
import { Button } from '../../components/ui/Button';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { TextLink } from '../../components/ui/TextLink';

type GrowthMetric = 'students' | 'enrollments' | 'revenue';
const metricOptions: { value: GrowthMetric; label: string }[] = [
  { value: 'students', label: 'Students' },
  { value: 'enrollments', label: 'Enrollments' },
  { value: 'revenue', label: 'Revenue' },
];

/** Platform-wide numbers are the instructor sample series scaled up. */
const PLATFORM_SCALE = 9;

function PlatformGrowth() {
  const [metric, setMetric] = useState<GrowthMetric>('students');
  const [range, setRange] = useState<AnalyticsRange>('30d');
  const { points } = useMemo(() => buildAnalytics(range, PLATFORM_SCALE), [range]);
  const isRevenue = metric === 'revenue';
  const format = isRevenue ? formatPrice : formatNumber;
  const label = metricOptions.find((m) => m.value === metric)!.label;
  return (
    <Panel
      title="Platform Growth"
      titleId="growth-title"
      description={`${label} across Hitswork`}
      action={<SegmentedControl label="Date range" options={RANGE_OPTIONS} value={range} onChange={setRange} />}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[1.75rem] leading-none font-extrabold tracking-[-0.02em] text-ink">
            {format(sumPoints(points, metric))}
          </p>
          <p className="mt-1.5 text-sm text-muted">Total for the selected period</p>
        </div>
        <SegmentedControl label="Chart metric" options={metricOptions} value={metric} onChange={setMetric} />
      </div>
      <AreaChart
        key={`${metric}-${range}`}
        className="mt-6"
        data={points.map((p) => ({ label: p.label, value: p[metric] }))}
        format={format}
        formatTick={isRevenue ? formatPriceCompact : (v) => formatNumber(Math.round(v))}
        seriesName={label}
        label={`Platform ${label.toLowerCase()} per period (sample data)`}
      />
    </Panel>
  );
}

const activityIcons: Record<AdminActivityKind, { icon: LucideIcon; className: string }> = {
  application: { icon: UserPlus, className: 'bg-indigo-50 text-indigo-600' },
  submitted: { icon: ClipboardCheck, className: 'bg-amber-50 text-amber-600' },
  published: { icon: CircleCheck, className: 'bg-emerald-50 text-emerald-600' },
  registered: { icon: GraduationCap, className: 'bg-sky-50 text-sky-600' },
  refund: { icon: ReceiptText, className: 'bg-rose-50 text-rose-600' },
  enterprise: { icon: Building2, className: 'bg-cyan-50 text-cyan-600' },
};

function RecentActivity() {
  const items = useMemo(() => adminActivity(), []);
  return (
    <Panel title="Recent Activity" titleId="admin-activity-title" className="h-full">
      <ol className="relative space-y-5">
        <span aria-hidden className="absolute top-2 bottom-2 left-[17px] w-px bg-line" />
        {items.map((item) => {
          const { icon: Icon, className } = activityIcons[item.kind];
          return (
            <li key={item.id} className="relative flex gap-3.5">
              <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl ring-4 ring-white', className)}>
                <Icon aria-hidden className="size-4" strokeWidth={2.1} />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-sm leading-snug text-ink">{item.message}</p>
                <p className="mt-1 text-xs text-muted">{formatRelative(item.createdAt)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}

export function AdminOverviewPage() {
  usePageMeta('Admin — Hitswork', 'Platform management for Hitswork.');
  const { pendingCourses } = useAdmin();
  const { decide, dialogs } = useCourseDecisions();
  const queue = pendingCourses.slice(0, 6);

  return (
    <>
      <AdminHeader
        title={`${greeting()}, Admin 👋`}
        subtitle={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            Here’s what’s happening across Hitswork.
            <DemoDataBadge />
          </span>
        }
        primaryAction={
          <Button href="/admin/courses?new=1" icon={Plus}>
            Add Course
          </Button>
        }
      />

      <section
        aria-label="Platform metrics"
        className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 xl:grid-cols-3"
      >
        <MetricCard
          index={0}
          label="Total Students"
          value={formatNumber(platformMetrics.students)}
          icon={GraduationCap}
          trend="+12.4%"
        />
        <MetricCard
          index={1}
          label="Active Instructors"
          value={formatNumber(platformMetrics.instructors)}
          icon={Presentation}
          tone="bg-cyan-50 text-cyan-600"
          trend="+8.2%"
        />
        <MetricCard
          index={2}
          label="Published Courses"
          value={formatNumber(platformMetrics.publishedCourses)}
          icon={BookOpen}
          tone="bg-violet-50 text-violet-600"
          trend="+5.6%"
        />
        <MetricCard
          index={3}
          label="Pending Reviews"
          value={pendingCourses.length}
          icon={ClipboardCheck}
          tone="bg-amber-50 text-amber-600"
        />
        <MetricCard
          index={4}
          label="Total Revenue"
          value={formatPriceCompact(platformMetrics.revenue)}
          icon={IndianRupee}
          tone="bg-emerald-50 text-emerald-600"
          trend="+18.6%"
        />
        <MetricCard
          index={5}
          label="Monthly Enrollments"
          value={formatNumber(platformMetrics.monthlyEnrollments)}
          icon={TrendingUp}
          tone="bg-pink-50 text-pink-600"
          trend="+9.1%"
        />
      </section>
      <SampleNote />

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
        <PlatformGrowth />
        <RecentActivity />
      </div>

      <Panel
        className="mt-6"
        title="Courses Awaiting Review"
        titleId="awaiting-title"
        description={`${pendingCourses.length} ${pendingCourses.length === 1 ? 'course' : 'courses'} in the queue`}
        action={<TextLink href="/admin/courses/pending">View all</TextLink>}
        flush
      >
        <DataTable
          rows={queue}
          rowKey={(c) => c.id}
          caption="Courses awaiting review"
          empty={<p className="px-6 py-10 text-center text-sm text-muted">The review queue is empty. 🎉</p>}
          columns={[
            {
              key: 'course',
              header: 'Course',
              render: (c) => (
                <div className="flex items-center gap-3">
                  <CourseThumb course={c} className="h-10 w-16" />
                  <span className="line-clamp-2 max-w-xs font-semibold text-ink">{c.title}</span>
                </div>
              ),
            },
            { key: 'instructor', header: 'Instructor', render: (c) => c.instructor },
            { key: 'category', header: 'Category', render: (c) => c.category },
            {
              key: 'submitted',
              header: 'Submitted',
              render: (c) => (c.submittedAt ? formatRelative(c.submittedAt) : '—'),
            },
            { key: 'status', header: 'Status', render: () => <StatusPill status="Pending" /> },
            {
              key: 'actions',
              header: <span className="sr-only">Actions</span>,
              align: 'right',
              render: (c) => (
                <div className="flex justify-end gap-1">
                  <RowAction href={`/admin/courses/${c.id}/review`}>Review</RowAction>
                  <RowAction tone="primary" onClick={() => decide('approve', c)}>
                    Approve
                  </RowAction>
                  <RowAction tone="danger" onClick={() => decide('reject', c)}>
                    Reject
                  </RowAction>
                </div>
              ),
            },
          ]}
          card={(c) => (
            <div>
              <div className="flex gap-3">
                <CourseThumb course={c} className="h-12 w-20" />
                <div className="min-w-0">
                  <p className="line-clamp-2 font-semibold text-ink">{c.title}</p>
                  <p className="text-xs text-muted">
                    {c.instructor} · {c.category} · {c.submittedAt ? formatRelative(c.submittedAt) : ''}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <RowAction href={`/admin/courses/${c.id}/review`}>Review</RowAction>
                <RowAction tone="primary" onClick={() => decide('approve', c)}>
                  Approve
                </RowAction>
                <RowAction tone="danger" onClick={() => decide('reject', c)}>
                  Reject
                </RowAction>
              </div>
            </div>
          )}
        />
      </Panel>
      {dialogs}
    </>
  );
}
