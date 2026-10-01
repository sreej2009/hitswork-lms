import { Building2, GraduationCap, Presentation } from 'lucide-react';
import { learnerJourney, missionPillars, platformHighlights, storyParagraphs, values } from '../../data/about';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { FeatureCard } from '../../components/feature/FeatureCard';
import { Button } from '../../components/ui/Button';
import { ProcessSteps } from '../../components/ui/ProcessSteps';
import { Reveal, RevealGroup, RevealItem } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatsStrip } from '../../components/ui/StatsStrip';

export function OurMission() {
  return (
    <Section labelledBy="mission-title" className="border-t border-line">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <h2
            id="mission-title"
            className="text-[1.75rem] leading-[1.15] font-bold tracking-[-0.022em] sm:text-4xl lg:text-[2.5rem]"
          >
            Our Mission
          </h2>
          <p className="mt-6 font-display text-[1.375rem] leading-[1.35] font-semibold tracking-[-0.015em] text-ink sm:text-[1.75rem]">
            We believe quality learning should be <span className="text-gradient">accessible, practical</span>, and
            designed around the way people actually learn.
          </p>
        </Reveal>

        <RevealGroup className="divide-y divide-line border-y border-line">
          {missionPillars.map((pillar, index) => {
            const accent = accents[pillar.accent];
            const Icon = pillar.icon;
            return (
              <RevealItem key={pillar.title} className="flex gap-5 py-7 sm:gap-6 sm:py-8">
                <span className={cn('grid size-12 shrink-0 place-items-center rounded-2xl', accent.soft)}>
                  <Icon aria-hidden className={cn('size-[22px]', accent.text)} strokeWidth={1.9} />
                </span>
                <div>
                  <p className="font-display text-xs font-bold text-subtle">0{index + 1}</p>
                  <h3 className="mt-1 text-xl font-bold tracking-[-0.015em]">{pillar.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body sm:text-base">{pillar.description}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </Section>
  );
}

const audiences = [
  { icon: GraduationCap, label: 'Learners', text: 'build skills at their own pace' },
  { icon: Presentation, label: 'Instructors', text: 'share what they know' },
  { icon: Building2, label: 'Organizations', text: 'grow their teams' },
];

export function OurStory() {
  return (
    <Section labelledBy="story-title" className="bg-canvas">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <Reveal>
          <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">Our Story</p>
          <h2
            id="story-title"
            className="text-[1.75rem] leading-[1.15] font-bold tracking-[-0.022em] sm:text-4xl lg:text-[2.75rem]"
          >
            Why Hitswork Exists
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="space-y-5 text-base leading-[1.8] text-body sm:text-[17px]">
            {storyParagraphs.map((paragraph, index) => (
              <p key={index} className={index === 0 ? 'text-lg leading-relaxed text-ink sm:text-xl' : undefined}>
                {paragraph}
              </p>
            ))}
          </div>
          <ul className="mt-9 grid gap-3 sm:grid-cols-3">
            {audiences.map(({ icon: Icon, label, text }) => (
              <li key={label} className="rounded-2xl border border-line bg-white p-4 shadow-xs">
                <Icon aria-hidden className="size-5 text-brand-600" strokeWidth={1.9} />
                <p className="mt-3 font-semibold text-ink">{label}</p>
                <p className="mt-0.5 text-sm text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

export function OurValues() {
  return (
    <Section labelledBy="values-title">
      <Reveal>
        <SectionHeader
          id="values-title"
          align="center"
          eyebrow="Our Values"
          title="What We Believe In"
          subtitle="The principles behind every course, feature and decision we make."
        />
      </Reveal>
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {values.map((value, index) => (
          <RevealItem key={value.title} className="h-full">
            <FeatureCard feature={value} index={index} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

export function PlatformHighlights() {
  return (
    <StatsStrip
      stats={platformHighlights}
      label="Platform Highlights"
      heading
      subtitle="A snapshot of the Hitswork platform."
      note="Platform highlight figures shown for this demo."
      className="pb-16 sm:pb-20 lg:pb-24"
    />
  );
}

export function LearnerJourney() {
  return (
    <Section labelledBy="journey-title" className="border-y border-line bg-canvas">
      <Reveal>
        <SectionHeader
          id="journey-title"
          align="center"
          eyebrow="Learner Experience"
          title="From Curiosity to Career Growth"
          subtitle="Every step on Hitswork is designed to keep you moving toward your goal."
        />
      </Reveal>
      <ProcessSteps steps={learnerJourney} className="mt-14" />
    </Section>
  );
}

export function Ecosystem() {
  return (
    <Section labelledBy="ecosystem-title">
      <Reveal>
        <SectionHeader
          id="ecosystem-title"
          align="center"
          eyebrow="One Platform"
          title="Built for Learners and Instructors"
          subtitle="Hitswork brings people who want to learn together with people who love to teach."
        />
      </Reveal>
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-2">
        <RevealItem className="h-full">
          <article className="relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-brand-100 bg-linear-to-br from-brand-50 via-white to-grape-50 p-8 sm:p-10">
            <div
              aria-hidden
              className="absolute -top-20 -right-20 -z-10 size-64 rounded-full bg-brand-200/40 blur-3xl"
            />
            <span className="grid size-14 place-items-center rounded-2xl bg-white text-brand-600 shadow-card">
              <GraduationCap aria-hidden className="size-7" strokeWidth={1.8} />
            </span>
            <h3 className="mt-7 text-2xl font-bold tracking-[-0.02em] sm:text-[1.75rem]">For Learners</h3>
            <p className="mt-3 max-w-md flex-1 text-base leading-relaxed text-body sm:text-lg">
              Discover courses and build skills at your own pace.
            </p>
            <Button href="/courses" arrow className="mt-8 self-start max-sm:w-full">
              Explore Courses
            </Button>
          </article>
        </RevealItem>
        <RevealItem className="h-full">
          <article className="relative isolate flex h-full flex-col overflow-hidden rounded-3xl bg-night p-8 sm:p-10">
            <div
              aria-hidden
              className="absolute -right-20 -bottom-24 -z-10 size-72 rounded-full bg-grape-600/30 blur-3xl"
            />
            <span className="grid size-14 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
              <Presentation aria-hidden className="size-7" strokeWidth={1.8} />
            </span>
            <h3 className="mt-7 text-2xl font-bold tracking-[-0.02em] text-white sm:text-[1.75rem]">For Instructors</h3>
            <p className="mt-3 max-w-md flex-1 text-base leading-relaxed text-slate-300 sm:text-lg">
              Share your expertise and create courses for learners around the world.
            </p>
            <Button href="/teach" variant="white" arrow className="mt-8 self-start max-sm:w-full">
              Teach on Hitswork
            </Button>
          </article>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}
