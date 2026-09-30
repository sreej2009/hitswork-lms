import { motion, useReducedMotion } from 'framer-motion';
import { Headset } from 'lucide-react';
import { businessFaqs } from '../../data/business';
import { AppLink } from '../../components/ui/AppLink';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';
import { FaqAccordion } from '../../components/ui/FaqAccordion';
import { Reveal } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';

export function BusinessFaq() {
  return (
    <Section labelledBy="business-faq-title">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">FAQ</p>
          <h2
            id="business-faq-title"
            className="text-[1.75rem] leading-[1.15] font-bold tracking-[-0.022em] sm:text-4xl lg:text-[2.5rem]"
          >
            Questions From Business Teams
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-body sm:text-lg">
            Everything you need to know about rolling out Hitswork across your organization.
          </p>
          <div className="mt-8 flex max-w-md items-start gap-4 rounded-2xl border border-line bg-canvas p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-xs ring-1 ring-line">
              <Headset aria-hidden className="size-5" strokeWidth={1.9} />
            </span>
            <div className="text-sm">
              <p className="font-semibold text-ink">Need something specific?</p>
              <p className="mt-1 leading-relaxed text-body">
                <AppLink href="/business/contact" className="font-semibold text-brand-600 hover:text-brand-700">
                  Talk to our team
                </AppLink>{' '}
                about SSO, integrations or custom content.
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <FaqAccordion items={businessFaqs} />
        </Reveal>
      </div>
    </Section>
  );
}

export function BusinessCTA() {
  const reduceMotion = useReducedMotion();
  const drift = (x: number, y: number, duration: number) =>
    reduceMotion
      ? {}
      : {
          animate: { x: [0, x, 0], y: [0, y, 0] },
          transition: { duration, repeat: Infinity, ease: 'easeInOut' as const },
        };

  return (
    <section aria-labelledby="business-cta-title" className="pb-16 sm:pb-20 lg:pb-24">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-panel bg-[linear-gradient(125deg,#0b1220_0%,#1e1b4b_55%,#4c1d95_100%)] px-6 py-14 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <motion.div
              aria-hidden
              {...drift(-30, 20, 20)}
              className="absolute -top-36 -right-24 -z-10 size-[26rem] rounded-full bg-brand-500/30 blur-3xl"
            />
            <motion.div
              aria-hidden
              {...drift(30, -16, 24)}
              className="absolute -bottom-40 -left-24 -z-10 size-96 rounded-full bg-grape-600/25 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[linear-gradient(rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_90%_at_85%_50%,black,transparent)]"
            />

            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2
                  id="business-cta-title"
                  className="text-[2rem] leading-[1.08] font-extrabold tracking-[-0.028em] text-white sm:text-5xl lg:text-[3.25rem]"
                >
                  Ready to Build a More Skilled Team?
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-300">
                  Talk to our team and discover how Hitswork can support learning across your organization.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button variant="white" size="lg" arrow href="/business/contact" className="w-full sm:w-auto">
                  Talk to Our Team
                </Button>
                <Button variant="outline-white" size="lg" href="/courses" className="w-full sm:w-auto">
                  Explore Courses
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
