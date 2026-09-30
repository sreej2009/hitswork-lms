import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  BarChart3,
  BookOpenCheck,
  Building2,
  Clock3,
  LayoutDashboard,
  Route,
  Search,
  Settings,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  businessDepartments,
  dashboardFeatures,
  demoEmployees,
  employeeStatuses,
  type EmployeeStatus,
} from '../../data/business';
import { cn } from '../../lib/cn';
import { unsplash } from '../../lib/images';
import { Reveal, RevealGroup, RevealItem, easeOutSoft } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';

/* ------------------------------------------------------------------ */
/*  Enterprise dashboard preview                                       */
/* ------------------------------------------------------------------ */

const overviewKpis = [
  { label: 'Employees', value: '1,248', icon: Users, tone: 'bg-brand-50 text-brand-600' },
  { label: 'Active Learners', value: '892', icon: UserCheck, tone: 'bg-cyan-50 text-cyan-600' },
  { label: 'Courses Completed', value: '8,420', icon: BookOpenCheck, tone: 'bg-emerald-50 text-emerald-600' },
  { label: 'Learning Hours', value: '24,680', icon: Clock3, tone: 'bg-amber-50 text-amber-600' },
  { label: 'Completion Rate', value: '86%', icon: TrendingUp, tone: 'bg-violet-50 text-violet-600' },
];

const monthlyHours = [1420, 1580, 1510, 1790, 1860, 2040, 1980, 2210, 2350, 2290, 2560, 2780];
const monthLabels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const departments = [
  { name: 'Engineering', people: 486, progress: 88, bar: 'bg-brand-gradient' },
  { name: 'Design', people: 124, progress: 91, bar: 'bg-linear-to-r from-pink-500 to-fuchsia-500' },
  { name: 'Marketing', people: 212, progress: 76, bar: 'bg-linear-to-r from-orange-400 to-rose-500' },
  { name: 'HR', people: 58, progress: 83, bar: 'bg-linear-to-r from-emerald-500 to-teal-500' },
];

const recentActivity = [
  { who: demoEmployees[1], text: 'completed Advanced Figma Systems', time: '12m' },
  { who: demoEmployees[0], text: 'started Kubernetes for Developers', time: '1h' },
  { who: demoEmployees[3], text: 'earned a Leadership certificate', time: '3h' },
];

function HoursChart() {
  const min = 1200;
  const max = 2900;
  const points = monthlyHours.map((v, i) => [
    (i / (monthlyHours.length - 1)) * 100,
    56 - ((v - min) / (max - min)) * 50,
  ]);
  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return (
    <div className="rounded-2xl border border-line p-3.5 @lg:p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-ink">Learning hours</p>
          <p className="text-[10px] text-muted">Monthly, all departments</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">+18%</span>
      </div>
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="mt-3 h-28 w-full overflow-visible @lg:h-32">
        <defs>
          <linearGradient id="biz-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[14, 28, 42].map((y) => (
          <line
            key={y}
            x1="0"
            x2="100"
            y1={y}
            y2={y}
            stroke="#e8eaf2"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <motion.polygon
          points={`0,60 ${line} 100,60`}
          fill="url(#biz-area)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        <motion.polyline
          points={line}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: easeOutSoft }}
        />
      </svg>
      <div className="mt-2 flex justify-between text-[9px] text-subtle">
        {monthLabels.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function EnterpriseDashboardMockup() {
  return (
    <div className="@container overflow-hidden rounded-3xl border border-line bg-white shadow-float">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-16 shrink-0 flex-col items-center gap-3 bg-night py-5 @xl:flex">
          <span className="mb-2 grid size-9 place-items-center rounded-xl bg-brand-gradient font-display text-sm font-extrabold text-white">
            H
          </span>
          {[LayoutDashboard, Users, Route, BarChart3, Award, Settings].map((Icon, i) => (
            <span
              key={i}
              className={cn(
                'grid size-9 place-items-center rounded-xl',
                i === 0 ? 'bg-white/10 text-white' : 'text-white/45',
              )}
            >
              <Icon className="size-4" strokeWidth={2} />
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1 space-y-3.5 p-3.5 @lg:space-y-4 @lg:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-muted">Acme Corp · Admin</p>
              <p className="font-display text-lg font-bold text-ink">Overview</p>
            </div>
            <span className="hidden items-center gap-2 rounded-xl bg-canvas px-3 py-2 text-[11px] text-subtle ring-1 ring-line @md:flex">
              <Search className="size-3.5" />
              Search employees…
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 @lg:grid-cols-5 @lg:gap-2.5">
            {overviewKpis.map(({ label, value, icon: Icon, tone }, index) => (
              <div
                key={label}
                className={cn(
                  'min-w-0 rounded-2xl border border-line p-2.5 @lg:p-3',
                  index === overviewKpis.length - 1 && '@max-lg:col-span-2',
                )}
              >
                <span className={cn('grid size-7 place-items-center rounded-lg', tone)}>
                  <Icon className="size-3.5" strokeWidth={2.2} />
                </span>
                <p className="mt-2 truncate font-display text-base font-extrabold text-ink @2xl:text-lg">{value}</p>
                <p className="truncate text-[10px] text-muted @2xl:text-[11px]">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 @2xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <HoursChart />

            <div className="rounded-2xl border border-line p-3.5 @lg:p-4">
              <p className="text-xs font-semibold text-ink">Departments</p>
              <ul className="mt-3 space-y-3">
                {departments.map((department) => (
                  <li key={department.name}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 font-medium text-ink">
                        <Building2 className="size-3 text-subtle" />
                        {department.name}
                        <span className="text-subtle">· {department.people}</span>
                      </span>
                      <span className="font-semibold text-ink tabular-nums">{department.progress}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-canvas ring-1 ring-line">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${department.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: easeOutSoft }}
                        className={cn('h-full rounded-full', department.bar)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-line p-3.5 @lg:p-4">
            <p className="text-xs font-semibold text-ink">Recent activity</p>
            <ul className="mt-2.5 divide-y divide-line">
              {recentActivity.map(({ who, text, time }) => (
                <li key={text} className="flex items-center gap-2.5 py-2">
                  <img
                    src={unsplash(who.photoId, { width: 56, height: 56, crop: 'faces' })}
                    alt=""
                    width={24}
                    height={24}
                    loading="lazy"
                    className="size-6 shrink-0 rounded-full object-cover"
                  />
                  <p className="min-w-0 flex-1 truncate text-[11px] text-body">
                    <span className="font-semibold text-ink">{who.name}</span> {text}
                  </p>
                  <span className="shrink-0 text-[10px] text-subtle">{time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardPreview() {
  return (
    <Section labelledBy="dashboard-title" className="overflow-hidden border-y border-line bg-canvas">
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-14">
        <div>
          <Reveal>
            <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">Admin Dashboard</p>
            <h2
              id="dashboard-title"
              className="text-[1.75rem] leading-[1.15] font-bold tracking-[-0.022em] sm:text-4xl lg:text-[2.5rem]"
            >
              See What Your Team Is Learning
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-body sm:text-lg">
              Get a clear view of learning activity across your organization.
            </p>
          </Reveal>
          <RevealGroup className="mt-8 space-y-4">
            {dashboardFeatures.map(({ label, description, icon: Icon }) => (
              <RevealItem key={label} className="flex items-start gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-xs ring-1 ring-line">
                  <Icon aria-hidden className="size-5" strokeWidth={1.9} />
                </span>
                <div>
                  <h3 className="font-sans text-[15px] font-semibold text-ink">{label}</h3>
                  <p className="text-sm text-body">{description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal delay={0.1} y={32} className="relative">
          <div
            aria-hidden
            className="absolute -inset-8 -z-10 bg-[radial-gradient(closest-side,rgb(129_140_248/0.22),transparent)]"
          />
          <p className="sr-only">
            Preview of the admin overview: 1,248 employees, 892 active learners, 8,420 courses completed, 24,680
            learning hours and an 86% completion rate, with a monthly learning-hours chart, department progress and
            recent activity.
          </p>
          <div aria-hidden>
            <EnterpriseDashboardMockup />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Team management preview                                            */
/* ------------------------------------------------------------------ */

const statusStyles: Record<EmployeeStatus, string> = {
  Active: 'bg-brand-50 text-brand-700 ring-brand-100',
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  'At Risk': 'bg-rose-50 text-rose-700 ring-rose-100',
};

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'h-9 shrink-0 rounded-full px-3.5 text-[13px] font-semibold whitespace-nowrap transition-colors',
        active ? 'bg-ink text-white' : 'bg-white text-body ring-1 ring-line hover:text-ink hover:ring-line-strong',
      )}
    >
      {children}
    </button>
  );
}

export function TeamManagement() {
  const [department, setDepartment] = useState<string>('All Departments');
  const [status, setStatus] = useState<EmployeeStatus | 'All'>('All');

  const rows = useMemo(
    () =>
      demoEmployees.filter(
        (employee) =>
          (department === 'All Departments' || employee.department === department) &&
          (status === 'All' || employee.status === status),
      ),
    [department, status],
  );

  return (
    <Section labelledBy="team-title">
      <Reveal>
        <SectionHeader
          id="team-title"
          align="center"
          eyebrow="Team Management"
          title="Manage Learning Across Your Organization"
          subtitle="Filter by department or status to see who’s progressing and who needs a nudge."
        />
      </Reveal>

      <Reveal delay={0.08} y={32} className="mt-12">
        <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-card">
          <div className="space-y-3 border-b border-line bg-canvas/60 p-4 sm:p-5">
            <div
              role="group"
              aria-label="Filter by department"
              className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
            >
              {['All Departments', ...businessDepartments].map((name) => (
                <FilterButton key={name} active={department === name} onClick={() => setDepartment(name)}>
                  {name}
                </FilterButton>
              ))}
            </div>
            <div role="group" aria-label="Filter by status" className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium text-muted">Status</span>
              {(['All', ...employeeStatuses] as const).map((name) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={status === name}
                  onClick={() => setStatus(name)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 transition-colors',
                    status === name
                      ? 'bg-white text-brand-700 shadow-xs ring-brand-200'
                      : 'text-muted ring-transparent hover:text-ink',
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Employee learning table">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Sample employee learning progress</caption>
              <thead>
                <tr className="border-b border-line text-xs text-muted">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Employee
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Department
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Learning Progress
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Courses
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {rows.map((employee) => (
                    <motion.tr
                      key={employee.name}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-b border-line last:border-b-0"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={unsplash(employee.photoId, { width: 72, height: 72, crop: 'faces' })}
                            alt=""
                            width={36}
                            height={36}
                            loading="lazy"
                            className="size-9 shrink-0 rounded-full object-cover"
                          />
                          <div className="min-w-0 leading-tight">
                            <p className="font-semibold whitespace-nowrap text-ink">{employee.name}</p>
                            <p className="text-xs whitespace-nowrap text-muted">{employee.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-body">{employee.department}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-28 overflow-hidden rounded-full bg-brand-50">
                            <div
                              className={cn(
                                'h-full rounded-full',
                                employee.status === 'At Risk' ? 'bg-rose-400' : 'bg-brand-gradient',
                              )}
                              style={{ width: `${employee.progress}%` }}
                            />
                          </div>
                          <span className="w-9 text-xs font-semibold text-ink tabular-nums">{employee.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap text-body">{employee.courses} Courses</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ring-1',
                            statusStyles[employee.status],
                          )}
                        >
                          {employee.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-muted">
                      No employees match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="border-t border-line bg-canvas/60 px-5 py-3 text-xs text-muted">
            Product preview with sample employees — {rows.length} of {demoEmployees.length} shown.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
