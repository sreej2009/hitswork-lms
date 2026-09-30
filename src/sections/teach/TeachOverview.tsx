import { motion } from 'framer-motion';
import { teachBenefits, teachFeatures, teachStats, teachSteps } from '../../data/teach';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { FeatureCard } from '../../components/feature/FeatureCard';
import { Container } from '../../components/ui/Container';
import { Reveal, RevealGroup, RevealItem, easeOutSoft } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';

/** Compact numbers band that overlaps the bottom of the hero. */
export function TeachStats() {
  return (
    <section aria-label="Hitswork in numbers" className="relative z-10 -mt-12 lg:-mt-16">
      <Container>
        <Reveal>
          <dl className="grid grid-cols-2 gap-y-6 rounded-3xl border border-line bg-white px-4 py-6 shadow-card sm:px-6 lg:grid-cols-4 lg:py-8">
            {teachStats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  'flex flex-col-reverse items-center gap-1 px-2 text-center',
                  index % 2 === 1 && 'border-l border-line',
                  index === 2 && 'lg:border-l lg:border-line',
                )}
              >
                <dt className="text-sm text-muted">{stat.label}</dt>
                <dd className="text-gradient font-display text-[1.875rem] leading-none font-extrabold tracking-[-0.03em] sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
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

      <div className="relative mt-14">
        {/* Connecting line: horizontal on desktop, vertical on smaller screens */}
        <motion.div
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, ease: easeOutSoft }}
          className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px origin-left bg-linear-to-r from-brand-200 via-grape-600/30 to-brand-200 lg:block"
        />
        <div
          aria-hidden
          className="absolute top-7 bottom-7 left-7 w-px bg-linear-to-b from-brand-200 via-grape-600/25 to-brand-200 lg:hidden"
        />

        <RevealGroup className="relative grid gap-8 lg:grid-cols-4 lg:gap-6">
          {teachSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <RevealItem key={step.title} className="flex gap-5 lg:flex-col lg:items-center lg:text-center">
                <span className="relative grid size-14 shrink-0 place-items-center rounded-2xl bg-white shadow-card ring-1 ring-line">
                  <Icon aria-hidden className="size-6 text-brand-600" strokeWidth={1.9} />
                  <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-brand-gradient font-display text-[11px] font-bold text-white ring-2 ring-canvas">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </span>
                <div className="min-w-0 pt-1 lg:max-w-[16rem] lg:pt-2">
                  <p className="font-display text-xs font-bold tracking-[0.14em] text-brand-600 uppercase">
                    Step {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-1.5 text-lg font-bold tracking-[-0.01em]">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">{step.description}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
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
