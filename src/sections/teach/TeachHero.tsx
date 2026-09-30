import type { ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { CircleCheck, IndianRupee, Star, Users, Video } from 'lucide-react';
import { teachHeroImage } from '../../data/teach';
import { cn } from '../../lib/cn';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';
import { Floating } from '../../components/ui/Floating';
import { easeOutSoft } from '../../components/ui/Reveal';
import { SmartImage } from '../../components/ui/SmartImage';

const copyVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutSoft } },
};

function StatChip({
  icon,
  iconClass,
  value,
  label,
}: {
  icon: ReactNode;
  iconClass: string;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-2.5 pr-4 shadow-float backdrop-blur-md sm:p-3 sm:pr-5">
      <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl sm:size-10', iconClass)}>{icon}</span>
      <div className="leading-tight">
        <p className="font-display text-[15px] font-extrabold tracking-[-0.01em] whitespace-nowrap text-ink sm:text-base">
          {value}
        </p>
        <p className="mt-0.5 text-[11px] whitespace-nowrap text-muted sm:text-xs">{label}</p>
      </div>
    </div>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease: easeOutSoft }}
      className="relative mx-auto w-full max-w-[420px] px-6 sm:max-w-[500px] sm:px-10 lg:mr-0 lg:ml-auto"
    >
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -z-10 aspect-square w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(129_140_248/0.32),rgb(196_181_253/0.18)_55%,transparent)]"
      />

      <div className="relative">
        <div
          aria-hidden
          className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] bg-linear-to-br from-brand-200 to-grape-100 sm:translate-x-4 sm:translate-y-4"
        />
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-50 shadow-float ring-1 ring-white">
          <SmartImage
            photoId={teachHeroImage.id}
            alt={teachHeroImage.alt}
            width={440}
            ratio={4 / 5}
            widths={[320, 440, 660, 880]}
            sizes="(min-width: 640px) 420px, 80vw"
            crop="faces"
            priority
            className="size-full"
          />
          {/* Studio overlay — reads as "recording a lesson" */}
          <span
            aria-hidden
            className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-xs"
          >
            <span className="size-1.5 rounded-full bg-white motion-safe:animate-pulse" />
            REC
          </span>
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-night/55 to-transparent" />
          <div
            aria-hidden
            className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl bg-white/15 p-2.5 text-white ring-1 ring-white/25 backdrop-blur-md sm:inset-x-4 sm:bottom-4"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/20">
              <Video className="size-4" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[13px] font-semibold">Lesson 04 · Building APIs</p>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/25">
                <div className="h-full w-[62%] rounded-full bg-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Floating className="top-[8%] -left-1 sm:left-0" duration={6.5}>
        <StatChip
          icon={<Users aria-hidden className="size-[18px] sm:size-5" strokeWidth={2} />}
          iconClass="bg-brand-50 text-brand-600"
          value="12,450"
          label="Students"
        />
      </Floating>

      <Floating className="top-[30%] -right-1 sm:right-0" delay={0.35} duration={7}>
        <StatChip
          icon={<Star aria-hidden className="size-[18px] sm:size-5" fill="currentColor" strokeWidth={0} />}
          iconClass="bg-amber-50 text-amber-500"
          value="4.9"
          label="Instructor Rating"
        />
      </Floating>

      <Floating className="bottom-[26%] -left-1 hidden min-[400px]:block sm:left-0" delay={0.7} duration={6}>
        <StatChip
          icon={<IndianRupee aria-hidden className="size-[18px] sm:size-5" strokeWidth={2.2} />}
          iconClass="bg-emerald-50 text-emerald-600"
          value="₹2.4L"
          label="This Month"
        />
      </Floating>

      <Floating className="-right-1 -bottom-4 sm:right-2" delay={1.05} duration={7.5} distance={6}>
        <div className="flex items-center gap-2.5 rounded-2xl bg-brand-gradient px-4 py-3 text-white shadow-[0_18px_40px_-14px_rgb(79_70_229/0.6)]">
          <CircleCheck aria-hidden className="size-5" strokeWidth={2.2} />
          <span className="font-display text-sm font-bold whitespace-nowrap">Course Published</span>
        </div>
      </Floating>
    </motion.div>
  );
}

export function TeachHero() {
  return (
    <section aria-labelledby="teach-hero-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-brand-50/80 via-grape-50/40 to-white" />
        <div className="absolute -top-40 -right-32 size-[36rem] rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute top-40 -left-40 size-[28rem] rounded-full bg-grape-100/70 blur-3xl" />
        <div className="absolute inset-0 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_55%_55%_at_75%_40%,black,transparent)]" />
      </div>

      <Container className="grid items-center gap-16 pt-12 pb-24 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pt-20 lg:pb-32">
        <motion.div variants={copyVariants} initial="hidden" animate="visible" className="max-w-[40rem]">
          <motion.div variants={itemVariants}>
            <Badge eyebrow tone="outline">
              <span aria-hidden className="size-1.5 rounded-full bg-brand-gradient" />
              Teach the World
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            id="teach-hero-title"
            className="mt-6 text-[2.5rem] leading-[1.06] font-extrabold tracking-[-0.032em] sm:text-[3.5rem] xl:text-[4.25rem]"
          >
            Share What You Know. <span className="text-gradient block pr-1 pb-1">Build Your Future.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-body sm:text-lg"
          >
            Create engaging courses, reach thousands of learners, and grow your teaching business with Hitswork.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" arrow href="/teach/register">
              Start Teaching
            </Button>
            <Button size="lg" variant="secondary" href="#how-it-works">
              See How It Works
            </Button>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted"
          >
            {['Free to publish', 'No monthly fees', 'Keep full ownership'].map((point) => (
              <span key={point} className="inline-flex items-center gap-1.5">
                <CircleCheck aria-hidden className="size-4 text-emerald-500" strokeWidth={2.2} />
                {point}
              </span>
            ))}
          </motion.p>
        </motion.div>

        <HeroVisual />
      </Container>
    </section>
  );
}
