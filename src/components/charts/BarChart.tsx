import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { easeOutSoft } from '../ui/Reveal';
import { labelIndexes, niceMax, phoneHiddenLabels, ticksFor, type ChartDatum } from './chartUtils';

interface BarChartProps {
  data: ChartDatum[];
  format: (value: number) => string;
  formatTick?: (value: number) => string;
  label: string;
  seriesName: string;
  /** Emphasise the last bar (e.g. the current month) */
  highlightLast?: boolean;
  className?: string;
}

/** Vertical bar chart that grows from the baseline. Hover a bar to read its value. */
export function BarChart({
  data,
  format,
  formatTick = format,
  label,
  seriesName,
  highlightLast = false,
  className,
}: BarChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const max = niceMax(Math.max(...data.map((d) => d.value)) * 1.08);
  const ticks = ticksFor(max);
  const shown = labelIndexes(data.length, data.length > 12 ? 7 : 12);
  const phoneHidden = phoneHiddenLabels(shown);
  // Wide gaps read well for a dozen bars; with many bars they would swallow the bars themselves.
  const gap = data.length > 16 ? '2px' : '3%';

  return (
    <figure className={cn('w-full', className)}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
        <div aria-hidden className="flex h-56 flex-col justify-between text-right text-[11px] text-subtle sm:h-64">
          {ticks.map((tick) => (
            <span key={tick} className="-translate-y-1/2 leading-none first:translate-y-0 last:translate-y-0">
              {formatTick(tick)}
            </span>
          ))}
        </div>

        <div className="relative h-56 sm:h-64" onPointerLeave={() => setActive(null)}>
          <div aria-hidden className="absolute inset-0 flex flex-col justify-between">
            {ticks.map((tick, i) => (
              <span key={tick} className={cn('h-px', i === ticks.length - 1 ? 'bg-line-strong' : 'bg-line')} />
            ))}
          </div>

          <div className="absolute inset-0 flex items-end" style={{ gap }}>
            {data.map((d, i) => {
              const emphasised = active === i || (active === null && highlightLast && i === data.length - 1);
              return (
                <div
                  key={`${d.label}-${i}`}
                  aria-hidden
                  onPointerEnter={() => setActive(i)}
                  className="relative flex h-full min-w-0 flex-1 items-end justify-center"
                >
                  <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, delay: i * 0.03, ease: easeOutSoft }}
                    style={{ height: `${(d.value / max) * 100}%` }}
                    className={cn(
                      'w-full max-w-12 origin-bottom rounded-t-md transition-colors duration-200',
                      emphasised ? 'bg-brand-gradient' : 'bg-brand-100',
                    )}
                  />
                  {active === i && (
                    <span
                      className={cn(
                        'pointer-events-none absolute z-10 rounded-xl bg-ink px-3 py-2 text-xs whitespace-nowrap text-white shadow-float',
                        i > data.length * 0.6 ? 'right-1/2' : 'left-1/2',
                      )}
                      style={{ bottom: `calc(${(d.value / max) * 100}% + 8px)` }}
                    >
                      <span className="block text-white/60">{d.label}</span>
                      <span className="mt-0.5 block font-semibold">
                        {seriesName}: {format(d.value)}
                      </span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <span aria-hidden />
        <div aria-hidden className="flex text-[11px] text-muted" style={{ gap }}>
          {data.map((d, i) => (
            <span key={`${d.label}-${i}`} className="relative h-4 min-w-0 flex-1">
              {shown.has(i) && (
                <span
                  className={cn(
                    'absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap',
                    phoneHidden.has(i) && 'max-sm:hidden',
                  )}
                >
                  {d.label}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      <figcaption className="sr-only">{label}</figcaption>
      <div className="sr-only">
        <table>
          <caption>{label}</caption>
          <thead>
            <tr>
              <th scope="col">Period</th>
              <th scope="col">{seriesName}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={`${d.label}-${i}`}>
                <th scope="row">{d.label}</th>
                <td>{format(d.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
