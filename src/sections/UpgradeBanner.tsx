import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { upgradeHighlights, upgradeImage } from '../data/home';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Reveal, easeOutSoft } from '../components/ui/Reveal';
import { SmartImage } from '../components/ui/SmartImage';

const PROGRESS = 76;
const SEGMENTS = 10;

function ProgressCard() {
  const filled = Math.round((PROGRESS / 100) * SEGMENTS);
  return (
    <div className="w-[212px] rounded-2xl border border-white bg-white/95 p-4 shadow-float backdrop-blur sm:w-[232px]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">Your Progress</p>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">+12%</span>
      </div>
      <p className="mt-2 font-display text-[2rem] leading-none font-extrabold tracking-[-0.03em] text-ink">{PROGRESS}%</p>
      <div
        role="progressbar"
        aria-label="Course progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={PROGRESS}
        className="mt-3.5 flex gap-1"
      >
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scaleY: 0.4 }}
            whileInView={{ opacity: 1, scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.06, duration: 0.4, ease: easeOutSoft }}
            className="h-2 flex-1 rounded-full"
            style={{
              background:
                i < filled
                  ? `color-mix(in oklab, #4F46E5 ${100 - (i / (filled - 1)) * 100}%, #A855F7)`
                  : 'var(--color-brand-100)',
            }}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        <span className="font-medium text-ink">UI/UX Design Essentials</span> · 18/24 lessons
      </p>
    </div>
  );
}

export function UpgradeBanner() {
  return (
    <section aria-labelledby="upgrade-title">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-panel border border-brand-100 bg-linear-to-br from-grape-50 via-brand-50 to-[#e4e9ff] px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-dots opacity-60 [mask-image:radial-gradient(ellipse_50%_70%_at_80%_50%,black,transparent)]"
            />
            <div aria-hidden className="absolute -top-24 -left-24 -z-10 size-72 rounded-full bg-white/70 blur-3xl" />

            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <Badge eyebrow tone="white">
                  <Zap aria-hidden className="size-3.5" strokeWidth={2.4} fill="currentColor" />
                  Start Today
                </Badge>
                <h2
                  id="upgrade-title"
                  className="mt-5 text-[2rem] leading-[1.08] font-extrabold tracking-[-0.028em] sm:text-5xl lg:text-[3.25rem]"
                >
                  Upgrade Your Skills <br className="hidden sm:block" />
                  From Anywhere
                </h2>
                <p className="mt-5 max-w-md text-[17px] leading-relaxed text-body">
                  Join thousands of learners who are achieving their goals with Hitswork. Learn at your own pace, on
                  your schedule.
                </p>

                <ul className="mt-8 flex flex-wrap gap-2.5">
                  {upgradeHighlights.map(({ label, icon: Icon }) => (
                    <li
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full bg-white py-2 pr-4 pl-2 text-sm font-semibold text-ink shadow-xs ring-1 ring-brand-100"
                    >
                      <span className="grid size-7 place-items-center rounded-full bg-brand-gradient text-white">
                        <Icon aria-hidden className="size-3.5" strokeWidth={2.4} />
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>

                <Button size="lg" arrow href="/courses" className="mt-9">
                  Explore All Courses
                </Button>
              </div>

              <div className="relative mx-auto w-full max-w-[460px]">
                <div
                  aria-hidden
                  className="absolute top-1/2 left-1/2 aspect-square w-[96%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#c7d2fe,#ddd6fe_50%,#ede9fe_78%)]"
                />
                <div
                  aria-hidden
                  className="absolute top-1/2 left-1/2 aspect-square w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80"
                />
                <div className="relative mx-auto aspect-[10/11] w-[80%] overflow-hidden rounded-[28px] bg-brand-50 shadow-float ring-[6px] ring-white">
                  <SmartImage
                    photoId={upgradeImage.id}
                    alt={upgradeImage.alt}
                    width={440}
                    ratio={10 / 11}
                    widths={[340, 440, 680]}
                    sizes="(min-width: 1024px) 350px, 70vw"
                    crop="faces"
                    className="size-full"
                  />
                </div>
                <motion.div
                  className="absolute bottom-[6%] -left-1 sm:left-0"
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ProgressCard />
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
