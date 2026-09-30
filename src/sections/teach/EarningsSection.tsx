import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { earningPoints, revenueSeries } from '../../data/teach';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { formatPrice } from '../../lib/format';
import { Reveal, RevealGroup, RevealItem, easeOutSoft } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';

function RevenueCard() {
  const latest = revenueSeries[revenueSeries.length - 1];
  const previous = revenueSeries[revenueSeries.length - 2];
  const growth = ((latest.value - previous.value) / previous.value) * 100;
  const max = Math.max(...revenueSeries.map((point) => point.value));

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(closest-side,rgb(167_139_250/0.28),transparent)]"
      />
      <div className="rounded-3xl border border-line bg-white p-5 shadow-float sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted">Monthly Revenue</p>
            <p className="mt-1 font-display text-[2rem] leading-none font-extrabold tracking-[-0.03em] text-ink sm:text-[2.5rem]">
              {formatPrice(latest.value)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
            <TrendingUp aria-hidden className="size-4" strokeWidth={2.2} />+{growth.toFixed(1)}%
          </span>
        </div>
        <p className="mt-2 text-xs text-muted">vs. {formatPrice(previous.value)} last month</p>

        {/* Bars: each grows from the baseline once the card scrolls into view */}
        <figure className="mt-7">
          <div
            role="img"
            aria-label={`Illustrative monthly revenue over the last 12 months, rising from ${formatPrice(revenueSeries[0].value)} to ${formatPrice(latest.value)}`}
            className="flex h-44 items-end gap-1.5 border-b border-line sm:h-52 sm:gap-2.5"
          >
            {revenueSeries.map((point, index) => {
              const isLatest = index === revenueSeries.length - 1;
              return (
                <div key={point.month} aria-hidden className="flex h-full min-w-0 flex-1 flex-col justify-end">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.8, delay: index * 0.045, ease: easeOutSoft }}
                    style={{ height: `${(point.value / max) * 100}%` }}
                    className={cn(
                      'relative origin-bottom rounded-t-md sm:rounded-t-lg',
                      isLatest ? 'bg-brand-gradient shadow-brand' : 'bg-brand-100',
                    )}
                  >
                    {isLatest && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-ink px-2 py-1 text-[10px] font-semibold whitespace-nowrap text-white">
                        This month
                      </span>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
          <div aria-hidden className="mt-2 flex gap-1.5 sm:gap-2.5">
            {revenueSeries.map((point, index) => (
              <span
                key={point.month}
                className={cn(
                  'min-w-0 flex-1 text-center text-[10px] text-muted sm:text-[11px]',
                  index % 2 === 1 && 'max-sm:invisible',
                )}
              >
                {point.month}
              </span>
            ))}
          </div>
          <figcaption className="mt-5 text-xs leading-relaxed text-muted">
            Illustrative example of an established instructor. Earnings vary with your course topic, pricing, quality
            and number of enrollments.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

export function EarningsSection() {
  return (
    <Section labelledBy="earnings-title" className="overflow-hidden bg-linear-to-b from-white via-brand-50/50 to-white">
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        <Reveal y={32} className="order-2 lg:order-1">
          <RevenueCard />
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">Earn on Hitswork</p>
            <h2
              id="earnings-title"
              className="text-[1.75rem] leading-[1.15] font-bold tracking-[-0.022em] sm:text-4xl lg:text-[2.5rem]"
            >
              Turn Your Expertise Into Income
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-body sm:text-lg">
              Earn from every eligible enrollment while building a long-term audience around your expertise.
            </p>
          </Reveal>

          <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2">
            {earningPoints.map((point) => {
              const accent = accents[point.accent];
              const Icon = point.icon;
              return (
                <RevealItem key={point.title} className="flex gap-3.5">
                  <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', accent.soft)}>
                    <Icon aria-hidden className={cn('size-5', accent.text)} strokeWidth={1.9} />
                  </span>
                  <div>
                    <h3 className="text-base font-bold">{point.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-body">{point.description}</p>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}
