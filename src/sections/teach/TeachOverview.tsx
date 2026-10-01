import { teachBenefits, teachFeatures, teachStats, teachSteps } from '../../data/teach';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { FeatureCard } from '../../components/feature/FeatureCard';
import { ProcessSteps } from '../../components/ui/ProcessSteps';
import { Reveal, RevealGroup, RevealItem } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { StatsStrip } from '../../components/ui/StatsStrip';

export function TeachStats() {
  return <StatsStrip stats={teachStats} label="Hitswork in numbers" overlap />;
}

export function WhyTeach() {
  return (
    <Section labelledBy="why-teach-title">
      <Reveal>
        <SectionHeader
          id="why-teach-title"
          align="center"
          eyebrow="Why Teach on Hitswork"
          title="Everything You Need to Teach Online"
          subtitle="Focus on what you do best — teaching. We’ll help you reach the right learners."
        />
      </Reveal>
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {teachFeatures.map((feature, index) => (
          <RevealItem key={feature.title} className="h-full">
            <FeatureCard feature={feature} index={index} />
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}

export function HowItWorks() {
  return (
    <Section id="how-it-works" labelledBy="how-title" className="border-y border-line bg-canvas">
      <Reveal>
        <SectionHeader
          id="how-title"
          align="center"
          eyebrow="How It Works"
          title="Start Teaching in 4 Simple Steps"
          subtitle="From your first idea to your first enrollment — we guide you at every step."
        />
      </Reveal>

      <ProcessSteps steps={teachSteps} className="mt-14" />
    </Section>
  );
}

export function TeachBenefits() {
  return (
    <Section labelledBy="benefits-title" className="border-t border-line bg-canvas">
      <Reveal>
        <SectionHeader
          id="benefits-title"
          align="center"
          eyebrow="Instructor Benefits"
          title="Built to Help You Succeed"
          subtitle="Everything around your course — payments, reach and engagement — is taken care of."
        />
      </Reveal>
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {teachBenefits.map((benefit) => {
          const accent = accents[benefit.accent];
          const Icon = benefit.icon;
          return (
            <RevealItem key={benefit.title} className="h-full">
              <div className="flex h-full gap-4 rounded-[20px] border border-line bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out-soft hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-card-hover">
                <span className={cn('grid size-11 shrink-0 place-items-center rounded-2xl', accent.soft)}>
                  <Icon aria-hidden className={cn('size-5', accent.text)} strokeWidth={1.9} />
                </span>
                <div>
                  <h3 className="text-base font-bold tracking-[-0.01em]">{benefit.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-body">{benefit.description}</p>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}
