import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ChartColumnIncreasing, Globe, PenTool, Rocket, type LucideIcon } from 'lucide-react';
import { heroImage, heroStats, learnerAvatars } from '../data/home';
import type { AccentKey } from '../types';
import { accents } from '../lib/accents';
import { cn } from '../lib/cn';
import { unsplash } from '../lib/images';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { easeOutSoft } from '../components/ui/Reveal';
import { SmartImage } from '../components/ui/SmartImage';

const copyVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutSoft } },
};

/** Arch: half-width radius on top, soft corners at the bottom (works for a 4:5 box). */
const archShape = 'rounded-[50%_50%_2.25rem_2.25rem/40%_40%_2.25rem_2.25rem]';

function HeroCopy() {
  return (
    <motion.div variants={copyVariants} initial="hidden" animate="visible" className="max-w-[40rem]">
      <motion.div variants={itemVariants}>
        <Badge eyebrow tone="outline">
          <span aria-hidden className="size-1.5 rounded-full bg-brand-gradient" />
          Online Learning Platform
        </Badge>
      </motion.div>

      <motion.h1
        variants={itemVariants}
        id="hero-title"
        className="mt-6 text-[2.625rem] leading-[1.04] font-extrabold tracking-[-0.032em] sm:text-6xl lg:text-[3.75rem] xl:text-[4.5rem]"
      >
        Learn Without <br className="hidden sm:block" />
        <span className="text-gradient pr-1">Limits</span>
      </motion.h1>

      <motion.p variants={itemVariants} className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-body sm:text-lg">
        Start, switch, or advance your career with thousands of courses, Professional Certificates, and degrees from
        world-class universities and companies.
      </motion.p>

      <motion.div variants={itemVariants} className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" arrow href="/courses">
          Explore Courses
        </Button>
        <Button size="lg" variant="secondary" href="/teach">
          Start Teaching
        </Button>
      </motion.div>

      <motion.dl
        variants={itemVariants}
        className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-line pt-8 sm:grid-cols-4 sm:gap-x-0"
      >
        {heroStats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn('flex flex-col-reverse gap-1', index > 0 && 'sm:border-l sm:border-line sm:pl-6', index < 3 && 'sm:pr-4')}
          >
            <dt className="text-sm leading-snug text-muted">{stat.label}</dt>
            <dd className="font-display text-[1.75rem] leading-none font-extrabold tracking-[-0.03em] text-ink">
              {stat.value}
            </dd>
          </div>
        ))}
      </motion.dl>
    </motion.div>
  );
}

interface FloatingProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
}

/** Enters once, then drifts gently up and down. */
function Floating({ children, className, delay = 0, duration = 6, distance = 8 }: FloatingProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={cn('absolute z-10', className)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.55 + delay, ease: easeOutSoft }}
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -distance, 0] }}
        transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function TopicCard({ icon: Icon, accent, title, meta }: { icon: LucideIcon; accent: AccentKey; title: string; meta: string }) {
  const style = accents[accent];
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-2.5 pr-4 shadow-float backdrop-blur-md sm:p-3 sm:pr-5">
      <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl sm:size-10', style.soft, style.text)}>
        <Icon aria-hidden className="size-[18px] sm:size-5" strokeWidth={2} />
      </span>
      <div className="leading-tight">
        <p className="font-display text-[13px] font-bold whitespace-nowrap text-ink sm:text-sm">{title}</p>
        <p className="mt-0.5 text-[11px] whitespace-nowrap text-muted sm:text-xs">{meta}</p>
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.15, ease: easeOutSoft }}
      className="relative mx-auto w-full max-w-[400px] sm:max-w-[520px] lg:mr-0 lg:ml-auto"
    >
      {/* Soft lavender glow and orbit ring behind the portrait */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(129_140_248/0.30),rgb(196_181_253/0.16)_55%,transparent)]"
      />
      <div aria-hidden className="absolute inset-[4%] -z-10 rounded-full border border-dashed border-brand-200" />

      <div className="relative mx-auto aspect-[4/5] w-[74%]">
        <div
          aria-hidden
          className={cn('absolute inset-0 translate-x-3 translate-y-3 bg-linear-to-br from-brand-200 to-grape-100 sm:translate-x-4 sm:translate-y-4', archShape)}
        />
        <div className={cn('relative size-full overflow-hidden bg-brand-50 shadow-float ring-1 ring-white', archShape)}>
          <SmartImage
            photoId={heroImage.id}
            alt={heroImage.alt}
            width={520}
            ratio={4 / 5}
            widths={[360, 520, 780, 1040]}
            sizes="(min-width: 640px) 385px, 74vw"
            crop="faces"
            priority
            className="size-full"
          />
        </div>
      </div>

      <Floating className="top-[13%] -left-1 sm:left-0" duration={6.5}>
        <TopicCard icon={PenTool} accent="pink" title="UI/UX Design" meta="120+ Courses" />
      </Floating>

      <Floating className="top-[42%] -right-1 max-[359px]:hidden sm:right-0" delay={0.4} duration={7}>
        <TopicCard icon={ChartColumnIncreasing} accent="blue" title="Data Science" meta="200+ Courses" />
      </Floating>

      <Floating className="bottom-[20%] left-[2%] hidden sm:block" delay={0.8} duration={6}>
        <TopicCard icon={Globe} accent="green" title="Web Science" meta="90+ Courses" />
      </Floating>

      <Floating className="right-[4%] bottom-[1%] sm:right-[6%]" delay={1.2} duration={7.5} distance={6}>
        <div className="flex items-center gap-3 rounded-2xl bg-brand-gradient p-2.5 pr-4 text-white shadow-[0_18px_40px_-14px_rgb(79_70_229/0.6)] sm:p-3 sm:pr-5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25 sm:size-10">
            <Rocket aria-hidden className="size-[18px] sm:size-5" strokeWidth={2} />
          </span>
          <div className="leading-tight">
            <p className="font-display text-[13px] font-bold whitespace-nowrap sm:text-sm">Build a Brighter Future</p>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {learnerAvatars.slice(0, 3).map((avatar) => (
                  <img
                    key={avatar.id}
                    src={unsplash(avatar.id, { width: 48, height: 48, crop: 'faces' })}
                    alt=""
                    width={20}
                    height={20}
                    className="size-5 rounded-full object-cover ring-2 ring-brand-600"
                  />
                ))}
              </div>
              <span className="text-[11px] whitespace-nowrap text-white/80 sm:text-xs">50K+ learners</span>
            </div>
          </div>
        </div>
      </Floating>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-brand-50/70 via-white to-white" />
        <div className="absolute inset-0 bg-dots opacity-50 [mask-image:radial-gradient(ellipse_60%_55%_at_75%_40%,black,transparent)]" />
      </div>

      <Container className="grid items-center gap-14 pt-12 pb-20 sm:pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:pt-20 lg:pb-28">
        <HeroCopy />
        <HeroVisual />
      </Container>
    </section>
  );
}
