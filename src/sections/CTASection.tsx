import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';
import { learnerAvatars } from '../data/home';
import { unsplash } from '../lib/images';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Reveal } from '../components/ui/Reveal';

export function CTASection() {
  const reduceMotion = useReducedMotion();
  const drift = (x: number, y: number, duration: number) =>
    reduceMotion ? {} : { animate: { x: [0, x, 0], y: [0, y, 0] }, transition: { duration, repeat: Infinity, ease: 'easeInOut' as const } };

  return (
    <section aria-labelledby="cta-title" className="pb-16 sm:pb-20 lg:pb-24">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-panel bg-brand-gradient px-6 py-14 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            {/* Decorative light */}
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
              className="absolute inset-0 -z-10 bg-[linear-gradient(rgb(255_255_255/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.07)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_90%_at_80%_50%,black,transparent)]"
            />

            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2
                  id="cta-title"
                  className="text-[2rem] leading-[1.08] font-extrabold tracking-[-0.028em] text-white sm:text-5xl lg:text-[3.25rem]"
                >
                  Ready to Start Learning?
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
                  Join over 50,000+ students and start building your future today.
                </p>
              </div>

              <div className="flex flex-col gap-5 sm:items-start lg:items-end">
                <Button variant="white" size="lg" arrow href="/signup" className="w-full sm:w-auto">
                  Get Started Now
                </Button>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {learnerAvatars.map((avatar) => (
                      <img
                        key={avatar.id}
                        src={unsplash(avatar.id, { width: 64, height: 64, crop: 'faces' })}
                        alt=""
                        width={32}
                        height={32}
                        loading="lazy"
                        className="size-8 rounded-full object-cover ring-2 ring-[#5b4ff0]"
                      />
                    ))}
                  </div>
                  <div className="text-sm leading-tight text-white/85">
                    <p className="flex items-center gap-1 font-semibold text-white">
                      <Star aria-hidden className="size-3.5 text-amber-300" fill="currentColor" strokeWidth={0} />
                      4.8 average rating
                    </p>
                    <p className="text-white/70">from 1M+ course reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
