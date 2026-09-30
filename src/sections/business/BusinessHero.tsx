import { motion, type Variants } from 'framer-motion';
import { BookOpenCheck, Clock3, Route, ShieldCheck, Users } from 'lucide-react';
import { demoEmployees } from '../../data/business';
import { cn } from '../../lib/cn';
import { unsplash } from '../../lib/images';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';
import { Floating } from '../../components/ui/Floating';
import { easeOutSoft } from '../../components/ui/Reveal';

const copyVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutSoft } },
};

const heroKpis = [
  { label: 'Team Learning', value: '1,248', unit: 'Employees', icon: Users, tone: 'bg-brand-50 text-brand-600' },
  {
    label: 'Courses Completed',
    value: '8,420',
    unit: 'This year',
    icon: BookOpenCheck,
    tone: 'bg-emerald-50 text-emerald-600',
  },
  { label: 'Learning Hours', value: '24,680h', unit: 'Across teams', icon: Clock3, tone: 'bg-amber-50 text-amber-600' },
];

const weekly = [42, 55, 48, 63, 58, 72, 80];

/** Completion ring drawn with SVG; the stroke animates to the percentage on load. */
function CompletionRing({ percent }: { percent: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="relative size-24 shrink-0">
      <svg viewBox="0 0 80 80" className="size-full -rotate-90">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="var(--color-brand-50)" strokeWidth="8" />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="url(#hero-ring)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percent / 100) }}
          transition={{ duration: 1.4, delay: 0.5, ease: easeOutSoft }}
        />
        <defs>
          <linearGradient id="hero-ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-xl font-extrabold text-ink">
        {percent}%
      </span>
    </div>
  );
}

function HeroDashboard() {
  const max = Math.max(...weekly);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease: easeOutSoft }}
      className="relative mx-auto w-full max-w-[540px] lg:mr-0 lg:ml-auto"
    >
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(129_140_248/0.28),rgb(196_181_253/0.14)_55%,transparent)]"
      />

      <div
        role="img"
        aria-label="Hitswork for Business dashboard: 1,248 employees learning, 8,420 courses completed, 24,680 learning hours and an 86% completion rate"
        className="rounded-3xl border border-line bg-white p-4 shadow-float sm:p-6"
      >
        <div aria-hidden>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-muted">Organization overview</p>
              <p className="truncate font-display text-base font-bold text-ink">Team Learning</p>
            </div>
            <span className="shrink-0 rounded-lg bg-canvas px-2.5 py-1 text-[11px] font-medium text-muted ring-1 ring-line">
              Last 12 months
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
            {heroKpis.map(({ label, value, unit, icon: Icon, tone }) => (
              <div key={label} className="min-w-0 rounded-2xl border border-line p-2.5 sm:p-3.5">
                <span className={cn('grid size-8 place-items-center rounded-lg', tone)}>
                  <Icon className="size-4" strokeWidth={2.1} />
                </span>
                <p className="mt-2.5 truncate text-[10px] font-medium text-muted sm:text-[11px]">{label}</p>
                <p className="truncate font-display text-[15px] font-extrabold tracking-[-0.01em] text-ink sm:text-xl">
                  {value}
                </p>
                <p className="truncate text-[10px] text-subtle sm:text-[11px]">{unit}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-2xl border border-line p-3.5 sm:gap-6 sm:p-4">
            <CompletionRing percent={86} />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ink">Completion Rate</p>
              <p className="mt-0.5 text-[11px] text-muted">Weekly active learners</p>
              <div className="mt-3 flex h-16 items-end gap-1.5 sm:gap-2">
                {weekly.map((v, i) => (
                  <motion.span
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.7, delay: 0.6 + i * 0.05, ease: easeOutSoft }}
                    style={{ height: `${(v / max) * 100}%` }}
                    className={cn(
                      'flex-1 origin-bottom rounded-t-md',
                      i === weekly.length - 1 ? 'bg-brand-gradient' : 'bg-brand-100',
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Floating className="-top-6 -left-2 hidden min-[420px]:block sm:-left-8" duration={6.5}>
        <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-2.5 pr-4 shadow-float backdrop-blur-md">
          <div className="flex -space-x-2">
            {demoEmployees.slice(0, 4).map((employee) => (
              <img
                key={employee.name}
                src={unsplash(employee.photoId, { width: 64, height: 64, crop: 'faces' })}
                alt=""
                width={28}
                height={28}
                className="size-7 rounded-full object-cover ring-2 ring-white"
              />
            ))}
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-bold whitespace-nowrap text-ink">Design team</p>
            <p className="text-[11px] whitespace-nowrap text-muted">12 learning now</p>
          </div>
        </div>
      </Floating>

      <Floating className="-right-2 -bottom-7 sm:-right-6" delay={0.5} duration={7} distance={6}>
        <div className="flex items-center gap-3 rounded-2xl bg-night p-2.5 pr-4 text-white shadow-[0_18px_40px_-14px_rgb(11_18_32/0.6)]">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <Route aria-hidden className="size-[18px]" strokeWidth={2} />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-bold whitespace-nowrap">Path assigned</p>
            <p className="text-[11px] whitespace-nowrap text-white/65">Leadership Essentials · 24 people</p>
          </div>
        </div>
      </Floating>
    </motion.div>
  );
}

export function BusinessHero() {
  return (
    <section aria-labelledby="business-hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-brand-50/70 via-canvas to-white" />
        <div className="absolute -top-48 right-0 size-[38rem] rounded-full bg-brand-200/35 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgb(79_70_229/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(79_70_229/0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_60%_at_70%_35%,black,transparent)]" />
      </div>

      <Container className="grid grid-cols-[minmax(0,1fr)] items-center gap-16 pt-12 pb-20 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 lg:pt-20 lg:pb-28">
        <motion.div variants={copyVariants} initial="hidden" animate="visible" className="max-w-[40rem]">
          <motion.div variants={itemVariants}>
            <Badge eyebrow tone="outline">
              <span aria-hidden className="size-1.5 rounded-full bg-brand-gradient" />
              Hitswork for Business
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            id="business-hero-title"
            className="mt-6 text-[2.5rem] leading-[1.06] font-extrabold tracking-[-0.032em] sm:text-[3.5rem] xl:text-[4rem]"
          >
            Build a Smarter, <span className="text-gradient block pr-1 pb-1">More Skilled Workforce.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-body sm:text-lg"
          >
            Give your teams the skills they need to perform, adapt, and grow with flexible learning built for modern
            businesses.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" arrow href="/business/contact">
              Talk to Our Team
            </Button>
            <Button size="lg" variant="secondary" href="#solutions">
              Explore Business Plans
            </Button>
          </motion.div>

          <motion.p variants={itemVariants} className="mt-8 flex items-center gap-2 text-sm text-muted">
            <ShieldCheck aria-hidden className="size-4 shrink-0 text-brand-500" strokeWidth={2.2} />
            Role-based access, department reports and dedicated support for L&amp;D teams.
          </motion.p>
        </motion.div>

        <HeroDashboard />
      </Container>
    </section>
  );
}
