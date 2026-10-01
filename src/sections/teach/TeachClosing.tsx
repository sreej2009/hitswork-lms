import { Mail } from 'lucide-react';
import { teachFaqs } from '../../data/teach';
import { FaqAccordion } from '../../components/ui/FaqAccordion';
import { GradientCTA } from '../../components/ui/GradientCTA';
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
  return (
    <GradientCTA
      id="teach-cta-title"
      title="Ready to Start Teaching?"
      text="Turn your knowledge into something thousands of learners can benefit from."
      primary={{ label: 'Become an Instructor', href: '/teach/register' }}
      secondary={{ label: 'Explore Courses', href: '/courses' }}
    />
  );
}
