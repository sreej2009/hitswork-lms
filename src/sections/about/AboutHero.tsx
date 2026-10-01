import { motion, type Variants } from 'framer-motion';
import { Award, Check, Flame, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/cn';
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

const pathSteps = [
  { title: 'Foundations', meta: '8 lessons', state: 'done' },
  { title: 'Hands-on Projects', meta: '6 lessons', state: 'done' },
  { title: 'Advanced Concepts', meta: '4 of 7 lessons', state: 'current' },
  { title: 'Certificate', meta: 'Unlocks at 100%', state: 'locked' },
] as const;

/** Abstract product composition: a learning path with achievement cards around it. */
function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease: easeOutSoft }}
      className="relative mx-auto w-full max-w-[480px] px-4 py-14 sm:px-10 lg:mr-0 lg:ml-auto"
      aria-hidden
    >
      <div className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(129_140_248/0.28),rgb(196_181_253/0.14)_55%,transparent)]" />
      <div className="absolute inset-[8%] -z-10 rounded-full border border-dashed border-brand-200" />

      <div className="rounded-3xl border border-line bg-white p-5 shadow-float sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted">Your learning path</p>
            <p className="truncate font-display text-base font-bold text-ink">UI/UX Design Career Track</p>
          </div>
          <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">68%</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-brand-50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '68%' }}
            transition={{ duration: 1.2, delay: 0.6, ease: easeOutSoft }}
            className="h-full rounded-full bg-brand-gradient"
          />
        </div>

        <ol className="relative mt-6 space-y-4">
          <span className="absolute top-4 bottom-4 left-[15px] w-px bg-line" />
          {pathSteps.map((step) => (
            <li key={step.title} className="relative flex items-center gap-3.5">
              <span
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-white',
                  step.state === 'done' && 'bg-emerald-500 text-white',
                  step.state === 'current' && 'bg-brand-gradient text-white shadow-brand',
                  step.state === 'locked' && 'bg-canvas text-subtle ring-1 ring-line',
                )}
              >
                {step.state === 'done' && <Check className="size-4" strokeWidth={3} />}
                {step.state === 'current' && <span className="size-2 rounded-full bg-white" />}
                {step.state === 'locked' && <Lock className="size-3.5" strokeWidth={2.2} />}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn('truncate text-sm font-semibold', step.state === 'locked' ? 'text-muted' : 'text-ink')}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted">{step.meta}</p>
              </div>
              {step.state === 'current' && (
                <span className="shrink-0 rounded-lg bg-brand-gradient px-2.5 py-1 text-[11px] font-semibold text-white">
                  Continue
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <Floating className="top-0 right-0" duration={6.5}>
        <div className="flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/95 p-2.5 pr-4 shadow-float backdrop-blur-md">
          <span className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-500">
            <Flame className="size-[18px]" strokeWidth={2.2} />
          </span>
          <div className="leading-tight">
            <p className="text-[13px] font-bold whitespace-nowrap text-ink">12-day streak</p>
            <p className="text-[11px] whitespace-nowrap text-muted">Keep it going!</p>
          </div>
        </div>
      </Floating>

      <Floating className="top-0 left-0 hidden min-[400px]:block" delay={0.4} duration={7}>
        <div className="rounded-2xl border border-white/80 bg-white/95 p-3 shadow-float backdrop-blur-md">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
            <Sparkles className="size-3.5 text-brand-500" />
            Skills gained
          </p>
          <div className="mt-2 flex gap-1.5">
            {['Figma', 'Research', 'Prototyping'].map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-brand-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </Floating>

      <Floating className="right-0 bottom-0 sm:right-4" delay={0.8} duration={7.5} distance={6}>
        <div className="flex items-center gap-2.5 rounded-2xl bg-brand-gradient px-4 py-3 text-white shadow-[0_18px_40px_-14px_rgb(79_70_229/0.6)]">
          <Award className="size-5" strokeWidth={2} />
          <div className="leading-tight">
            <p className="text-[13px] font-bold whitespace-nowrap">Certificate earned</p>
            <p className="text-[11px] whitespace-nowrap text-white/75">JavaScript Algorithms</p>
          </div>
        </div>
      </Floating>
    </motion.div>
  );
}

export function AboutHero() {
  const { isAuthenticated } = useAuth();
  return (
    <section aria-labelledby="about-hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-brand-50/80 via-grape-50/30 to-white" />
        <div className="absolute inset-0 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_55%_55%_at_75%_40%,black,transparent)]" />
      </div>

      <Container className="grid grid-cols-[minmax(0,1fr)] items-center gap-14 pt-12 pb-20 sm:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 lg:pt-20 lg:pb-28">
        <motion.div variants={copyVariants} initial="hidden" animate="visible" className="max-w-[40rem]">
          <motion.div variants={itemVariants}>
            <Badge eyebrow tone="outline">
              <span aria-hidden className="size-1.5 rounded-full bg-brand-gradient" />
              About Hitswork
            </Badge>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            id="about-hero-title"
            className="mt-6 text-[2.5rem] leading-[1.06] font-extrabold tracking-[-0.032em] sm:text-[3.5rem] xl:text-[4.25rem]"
          >
            Learning Should <span className="text-gradient pr-1">Move You Forward.</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-body sm:text-lg"
          >
            Hitswork is a modern learning platform designed to help people build practical skills, discover new
            opportunities, and keep growing throughout their careers.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" arrow href="/courses">
              Explore Courses
            </Button>
            {isAuthenticated ? (
              <Button size="lg" variant="secondary" arrow href="/dashboard">
                Go to Dashboard
              </Button>
            ) : (
              <Button size="lg" variant="secondary" arrow href="/register">
                Join Hitswork
              </Button>
            )}
          </motion.div>
        </motion.div>
        <HeroVisual />
      </Container>
    </section>
  );
}
