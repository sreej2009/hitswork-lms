import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { Container } from './Container';
import { Reveal } from './Reveal';

export interface CTAAction {
  label: string;
  href: string;
  /** Trailing arrow; on by default for the primary action */
  arrow?: boolean;
}

interface GradientCTAProps {
  id: string;
  title: ReactNode;
  text: ReactNode;
  primary: CTAAction;
  secondary?: CTAAction;
}

/** Centred brand-gradient call to action that closes a page. */
export function GradientCTA({ id, title, text, primary, secondary }: GradientCTAProps) {
  const reduceMotion = useReducedMotion();
  const drift = (x: number, y: number, duration: number) =>
    reduceMotion
      ? {}
      : {
          animate: { x: [0, x, 0], y: [0, y, 0] },
          transition: { duration, repeat: Infinity, ease: 'easeInOut' as const },
        };

  return (
    <section aria-labelledby={id} className="pb-16 sm:pb-20 lg:pb-24">
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
              id={id}
              className="mx-auto max-w-2xl text-[2rem] leading-[1.08] font-extrabold tracking-[-0.028em] text-white sm:text-5xl lg:text-[3.25rem]"
            >
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80">{text}</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                variant="white"
                size="lg"
                arrow={primary.arrow ?? true}
                href={primary.href}
                className="w-full sm:w-auto"
              >
                {primary.label}
              </Button>
              {secondary && (
                <Button
                  size="lg"
                  variant="outline-white"
                  arrow={secondary.arrow}
                  href={secondary.href}
                  className="w-full sm:w-auto"
                >
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
