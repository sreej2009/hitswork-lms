import { motion } from 'framer-motion';
import { BookOpenCheck, Clock3, Star, UserCheck, type LucideIcon } from 'lucide-react';
import { businessMetrics, learningActivity } from '../../data/business';
import { cn } from '../../lib/cn';
import { CountUp } from '../../components/ui/CountUp';
import { Reveal, RevealGroup, RevealItem, easeOutSoft } from '../../components/ui/Reveal';
import { Section } from '../../components/ui/Section';
import { SectionHeader } from '../../components/ui/SectionHeader';

const metricIcons: LucideIcon[] = [BookOpenCheck, UserCheck, Clock3, Star];
const metricTones = [
  'bg-brand-50 text-brand-600',
  'bg-cyan-50 text-cyan-600',
  'bg-amber-50 text-amber-600',
  'bg-violet-50 text-violet-600',
];

function ActivityChart() {
  const maxHours = 5000;
  const maxCompletions = 2000;
  const n = learningActivity.length;
  // Line points sit at the centre of each month's column (x in 0–100, y in 0–100 of the plot area).
  const line = learningActivity
    .map((m, i) => `${(((i + 0.5) / n) * 100).toFixed(2)},${(100 - (m.completions / maxCompletions) * 100).toFixed(2)}`)
    .join(' ');

  return (
    <figure className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <figcaption className="font-display text-lg font-bold text-ink">Learning activity</figcaption>
          <p className="mt-0.5 text-sm text-muted">January – June · sample organization</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-body">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-2.5 rounded-sm bg-brand-200" />
            Learning hours
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-0.5 w-4 rounded-full bg-grape-600" />
            Course completions
          </span>
          <span className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-700 ring-1 ring-amber-100">
            Demo data
          </span>
        </div>
      </div>

      <div className="no-scrollbar -mx-5 mt-8 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3">
            {/* Y axis */}
            <div aria-hidden className="flex h-56 flex-col justify-between text-right text-[11px] text-subtle sm:h-64">
              {['5K', '4K', '3K', '2K', '1K', '0'].map((tick) => (
                <span key={tick} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">
                  {tick}
                </span>
              ))}
            </div>

            <div className="relative h-56 sm:h-64">
              <div aria-hidden className="absolute inset-0 flex flex-col justify-between">
                {Array.from({ length: 6 }, (_, i) => (
                  <span key={i} className={cn('h-px', i === 5 ? 'bg-line-strong' : 'bg-line')} />
                ))}
              </div>

              <div className="absolute inset-0 grid grid-cols-6">
                {learningActivity.map((month, index) => (
                  <div key={month.month} className="flex items-end justify-center px-[18%]">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.8, delay: index * 0.07, ease: easeOutSoft }}
                      style={{ height: `${(month.hours / maxHours) * 100}%` }}
                      title={`${month.month}: ${month.hours.toLocaleString('en-US')} hours`}
                      className={cn(
                        'w-full origin-bottom rounded-t-lg',
                        index === learningActivity.length - 1 ? 'bg-brand-gradient' : 'bg-brand-200',
                      )}
                    />
                  </div>
                ))}
              </div>

              <svg
                aria-hidden
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 size-full overflow-visible"
              >
                {/* Revealed left-to-right with a clip: pathLength dashes break on a stretched viewBox. */}
                <defs>
                  <clipPath id="activity-reveal">
                    <motion.rect
                      x="0"
                      y="-10"
                      height="120"
                      initial={{ width: 0 }}
                      whileInView={{ width: 100 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 1.2, delay: 0.5, ease: easeOutSoft }}
                    />
                  </clipPath>
                </defs>
                <polyline
                  points={line}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  clipPath="url(#activity-reveal)"
                />
              </svg>
            </div>
          </div>
          <div aria-hidden className="mt-3 grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3">
            <span />
            <div className="grid grid-cols-6 text-center text-xs font-medium text-muted">
              {learningActivity.map((month) => (
                <span key={month.month}>{month.month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tables ignore a 1px width, so the wrapper does the visual hiding. */}
      <div className="sr-only">
        <table>
          <caption>Sample learning activity, January to June</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Learning hours</th>
              <th scope="col">Course completions</th>
            </tr>
          </thead>
          <tbody>
            {learningActivity.map((month) => (
              <tr key={month.month}>
                <th scope="row">{month.month}</th>
                <td>{month.hours}</td>
                <td>{month.completions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export function BusinessAnalytics() {
  return (
    <Section labelledBy="analytics-title" className="border-t border-line bg-canvas">
      <Reveal>
        <SectionHeader
          id="analytics-title"
          align="center"
          eyebrow="Analytics"
          title="Measure Learning That Matters"
          subtitle="Clear reporting on completion, engagement and time invested — shown here with sample data."
        />
      </Reveal>

      <RevealGroup className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {businessMetrics.map((metric, index) => {
          const Icon = metricIcons[index];
          return (
            <RevealItem key={metric.label} className="h-full">
              <div className="h-full rounded-3xl border border-line bg-white p-4 shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-card-hover sm:p-6">
                <span className={cn('grid size-10 place-items-center rounded-xl', metricTones[index])}>
                  <Icon aria-hidden className="size-5" strokeWidth={1.9} />
                </span>
                <CountUp
                  value={metric.value}
                  decimals={metric.decimals}
                  suffix={metric.suffix}
                  className="mt-5 block font-display text-[1.75rem] leading-none font-extrabold tracking-[-0.03em] text-ink sm:text-[2.5rem]"
                />
                <p className="mt-2 text-sm text-muted">{metric.label}</p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>

      <Reveal delay={0.1} className="mt-6">
        <ActivityChart />
      </Reveal>
      <p className="mt-4 text-center text-xs text-muted">
        Figures are illustrative sample data, not statistics from Hitswork customers.
      </p>
    </Section>
  );
}
