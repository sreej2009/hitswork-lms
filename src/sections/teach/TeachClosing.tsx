import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, Mail, Sparkles } from 'lucide-react';
import { teachFaqs } from '../../data/teach';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';
import { FaqAccordion } from '../../components/ui/FaqAccordion';
import { Reveal } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';

export function TeachFaq() {
  return (
    <Section labelledBy="faq-title">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">FAQ</p>
          <h2
            id="faq-title"
            className="text-[1.75rem] leading-[1.15] font-bold tracking-[-0.022em] sm:text-4xl lg:text-[2.5rem]"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-body sm:text-lg">
            Everything you need to know before creating your first course.
          </p>
          <div className="mt-8 flex max-w-md items-start gap-4 rounded-2xl border border-line bg-canvas p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-xs ring-1 ring-line">
              <Mail aria-hidden className="size-5" strokeWidth={1.9} />
            </span>
            <div className="text-sm">
              <p className="font-semibold text-ink">Still have questions?</p>
              <p className="mt-1 leading-relaxed text-body">
                Our instructor team is happy to help at{' '}
                <a
                  href="mailto:instructors@hitswork.com"
                  className="font-semibold whitespace-nowrap text-brand-600 hover:text-brand-700"
                >
                  instructors@hitswork.com
                </a>
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <FaqAccordion items={teachFaqs} />
        </Reveal>
      </div>
    </Section>
  );
}

export function TeachCTA() {
  const reduceMotion = useReducedMotion();
  const drift = (x: number, y: number, duration: number) =>
    reduceMotion
      ? {}
      : {
          animate: { x: [0, x, 0], y: [0, y, 0] },
          transition: { duration, repeat: Infinity, ease: 'easeInOut' as const },
        };

  return (
    <section aria-labelledby="teach-cta-title" className="pb-16 sm:pb-20 lg:pb-24">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-panel bg-brand-gradient px-6 py-14 text-center sm:px-12 sm:py-16 lg:py-20">
            <motion.div
              aria-hidden
              {...drift(40, 24, 18)}
              className="absolute -top-32 -left-24 -z-10 size-96 rounded-full bg-orchid-500/45 blur-3xl"
            />
            <motion.div
              aria-hidden
              {...drift(-36, -20, 22)}
              className="absolute -right-16 -bottom-40 -z-10 size-[28rem] rounded-full bg-sky-400/30 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[linear-gradient(rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.07)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,black,transparent)]"
            />
            {/* Decorative shapes */}
            <div
              aria-hidden
              className="absolute top-10 left-[8%] -z-10 hidden size-16 rotate-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20 sm:grid"
            >
              <GraduationCap className="size-7 text-white/70" strokeWidth={1.8} />
            </div>
            <div
              aria-hidden
              className="absolute right-[9%] bottom-10 -z-10 hidden size-14 -rotate-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 sm:grid"
            >
              <Sparkles className="size-6 text-white/70" strokeWidth={1.8} />
            </div>
            <div
              aria-hidden
              className="absolute top-1/2 right-[5%] -z-10 hidden size-24 rounded-full border border-dashed border-white/25 lg:block"
            />

            <h2
              id="teach-cta-title"
              className="mx-auto max-w-2xl text-[2rem] leading-[1.08] font-extrabold tracking-[-0.028em] text-white sm:text-5xl lg:text-[3.25rem]"
            >
              Ready to Start Teaching?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80">
              Turn your knowledge into something thousands of learners can benefit from.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="white" size="lg" arrow href="/teach/register" className="w-full sm:w-auto">
                Become an Instructor
              </Button>
              <Button size="lg" variant="outline-white" href="/courses" className="w-full sm:w-auto">
                Explore Courses
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
