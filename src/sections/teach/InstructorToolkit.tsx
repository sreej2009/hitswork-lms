import { motion } from 'framer-motion';
import { BarChart3, BookOpen, IndianRupee, LayoutDashboard, MessageSquare, Settings, Star, Users } from 'lucide-react';
import { toolkitFeatures } from '../../data/teach';
import { cn } from '../../lib/cn';
import { Button } from '../../components/ui/Button';
import { Reveal, RevealGroup, RevealItem, easeOutSoft } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';

const kpis = [
  { label: 'Students', value: '12,450', change: '+8.2%', icon: Users, tone: 'bg-brand-50 text-brand-600' },
  { label: 'Revenue', value: '₹2.4L', change: '+18.6%', icon: IndianRupee, tone: 'bg-emerald-50 text-emerald-600' },
  { label: 'Rating', value: '4.9', change: '+0.1', icon: Star, tone: 'bg-amber-50 text-amber-500' },
];

const enrollments = [38, 46, 42, 58, 52, 66, 61, 74, 70, 82, 78, 92];

const previewCourses = [
  { title: 'Node.js API Masterclass', students: '6,240', status: 'Published' },
  { title: 'React for Beginners', students: '4,810', status: 'Published' },
  { title: 'TypeScript Deep Dive', students: '—', status: 'Draft' },
] as const;

/** Static preview of the instructor dashboard; purely illustrative. */
function DashboardPreview() {
  // Map values (30–100) into the 100×60 viewBox, leaving a little headroom.
  const points = enrollments
    .map((v, i) => `${(i / (enrollments.length - 1)) * 100},${(56 - ((v - 30) * 52) / 70).toFixed(1)}`)
    .join(' ');
  return (
    <div
      role="img"
      aria-label="Preview of the Hitswork instructor dashboard showing students, revenue, rating, enrollments and courses"
      className="relative"
    >
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[radial-gradient(closest-side,rgb(129_140_248/0.25),transparent)]"
      />
      <div aria-hidden className="overflow-hidden rounded-3xl border border-line bg-white shadow-float">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-line bg-canvas px-4 py-3">
          <span className="size-2.5 rounded-full bg-rose-300" />
          <span className="size-2.5 rounded-full bg-amber-300" />
          <span className="size-2.5 rounded-full bg-emerald-300" />
          <span className="ml-3 truncate rounded-md bg-white px-3 py-1 text-[11px] text-muted ring-1 ring-line">
            hitswork.com/instructor/dashboard
          </span>
        </div>

        <div className="flex">
          {/* Mini sidebar */}
          <div className="hidden w-14 shrink-0 flex-col items-center gap-3 border-r border-line py-4 sm:flex">
            {[LayoutDashboard, BookOpen, BarChart3, MessageSquare, Settings].map((Icon, i) => (
              <span
                key={i}
                className={cn(
                  'grid size-9 place-items-center rounded-xl',
                  i === 0 ? 'bg-brand-gradient text-white shadow-brand' : 'text-subtle',
                )}
              >
                <Icon className="size-4" strokeWidth={2} />
              </span>
            ))}
          </div>

          <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] text-muted">Welcome back,</p>
                <p className="truncate font-display text-[15px] font-bold text-ink">Rahul’s Studio</p>
              </div>
              <span className="shrink-0 rounded-lg bg-brand-gradient px-3 py-1.5 text-[11px] font-semibold text-white">
                + New Course
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {kpis.map(({ label, value, change, icon: Icon, tone }) => (
                <div key={label} className="min-w-0 rounded-2xl border border-line p-2.5 sm:p-3">
                  <span className={cn('grid size-7 place-items-center rounded-lg', tone)}>
                    <Icon className="size-3.5" strokeWidth={2.2} />
                  </span>
                  <p className="mt-2 truncate font-display text-sm font-extrabold text-ink sm:text-base">{value}</p>
                  <p className="flex flex-wrap items-center gap-x-1 text-[10px] text-muted sm:text-[11px]">
                    {label}
                    <span className="font-semibold text-emerald-600">{change}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-line p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-ink">Enrollments</p>
                <span className="rounded-md bg-canvas px-2 py-0.5 text-[10px] text-muted ring-1 ring-line">
                  12 months
                </span>
              </div>
              <svg
                viewBox="0 0 100 60"
                preserveAspectRatio="none"
                className="mt-3 h-20 w-full overflow-visible sm:h-24"
              >
                <defs>
                  <linearGradient id="toolkit-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g>
                  <polygon points={`0,60 ${points} 100,60`} fill="url(#toolkit-area)" />
                  <motion.polyline
                    points={points}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: easeOutSoft }}
                  />
                </g>
              </svg>
            </div>

            <div className="rounded-2xl border border-line">
              {previewCourses.map((course, i) => (
                <div
                  key={course.title}
                  className={cn('flex items-center gap-3 px-3 py-2.5 sm:px-4', i > 0 && 'border-t border-line')}
                >
                  <span
                    className={cn(
                      'size-8 shrink-0 rounded-lg',
                      [
                        'bg-linear-to-br from-brand-400 to-grape-600',
                        'bg-linear-to-br from-cyan-400 to-blue-500',
                        'bg-linear-to-br from-amber-300 to-orange-400',
                      ][i],
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ink">{course.title}</p>
                    <p className="text-[10px] text-muted">{course.students} students</p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      course.status === 'Published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700',
                    )}
                  >
                    {course.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating review card */}
      <div
        aria-hidden
        className="absolute top-[44%] -left-10 hidden w-60 rounded-2xl border border-line bg-white p-3.5 shadow-float xl:block"
      >
        <div className="flex items-center gap-1 text-amber-400">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="size-3.5" fill="currentColor" strokeWidth={0} />
          ))}
          <span className="ml-1 text-[11px] font-semibold text-ink">New review</span>
        </div>
        <p className="mt-1.5 text-xs leading-snug text-body">
          “Clear explanations and great projects. Best API course I’ve taken!”
        </p>
      </div>
    </div>
  );
}

export function InstructorToolkit() {
  return (
    <Section labelledBy="toolkit-title" className="overflow-hidden">
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <Reveal>
            <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">Instructor Toolkit</p>
            <h2
              id="toolkit-title"
              className="text-[1.75rem] leading-[1.15] font-bold tracking-[-0.022em] sm:text-4xl lg:text-[2.5rem]"
            >
              Tools Built for Modern Instructors
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-body sm:text-lg">
              Plan, record, publish and improve your courses from one place — with the insight you need to keep learners
              engaged.
            </p>
          </Reveal>

          <RevealGroup className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
            {toolkitFeatures.map(({ label, icon: Icon }) => (
              <RevealItem key={label}>
                <div className="flex items-center gap-3 rounded-2xl border border-line bg-white px-3.5 py-3 shadow-xs transition-colors hover:border-brand-200">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon aria-hidden className="size-[18px]" strokeWidth={2} />
                  </span>
                  <span className="text-[15px] font-semibold text-ink">{label}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-8">
            <Button href="/teach/register" arrow>
              Start Teaching
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1} y={32}>
          <DashboardPreview />
        </Reveal>
      </div>
    </Section>
  );
}
