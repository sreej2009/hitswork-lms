import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { easeOutSoft } from '../ui/Reveal';
import { labelIndexes, niceMax, phoneHiddenLabels, ticksFor, type ChartDatum } from './chartUtils';

interface AreaChartProps {
  data: ChartDatum[];
  /** Formats values for the axis, tooltip and screen-reader table */
  format: (value: number) => string;
  /** Shorter format for axis ticks (defaults to `format`) */
  formatTick?: (value: number) => string;
  /** Accessible summary of the chart */
  label: string;
  /** Name of the series in the tooltip and table */
  seriesName: string;
  className?: string;
}

/**
 * Responsive line + area chart. The SVG stretches to its box; dots, labels and the tooltip are HTML so
 * they never distort. Hover or focus a column to read its value.
 */
export function AreaChart({ data, format, formatTick = format, label, seriesName, className }: AreaChartProps) {
  const clipId = useId().replace(/:/g, '');
  const [active, setActive] = useState<number | null>(null);
  const max = niceMax(Math.max(...data.map((d) => d.value)) * 1.08);
  const ticks = ticksFor(max);
  const shown = labelIndexes(data.length);
  const phoneHidden = phoneHiddenLabels(shown);

  const x = (i: number) => (data.length === 1 ? 50 : (i / (data.length - 1)) * 100);
  const y = (v: number) => 100 - (v / max) * 100;
  const line = data.map((d, i) => `${x(i).toFixed(2)},${y(d.value).toFixed(2)}`).join(' ');
  const activePoint = active === null ? null : data[active];

  return (
    <figure className={cn('w-full', className)}>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
        {/* Y axis */}
        <div aria-hidden className="flex h-56 flex-col justify-between py-0 text-right text-[11px] text-subtle sm:h-64">
          {ticks.map((tick) => (
            <span key={tick} className="-translate-y-1/2 leading-none first:translate-y-0 last:translate-y-0">
              {formatTick(tick)}
            </span>
          ))}
        </div>

        <div
          className="relative h-56 sm:h-64"
          onPointerMove={(event) => {
            const box = event.currentTarget.getBoundingClientRect();
            const ratio = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
            setActive(Math.round(ratio * (data.length - 1)));
          }}
          onPointerLeave={() => setActive(null)}
        >
          {/* Grid */}
          <div aria-hidden className="absolute inset-0 flex flex-col justify-between">
            {ticks.map((tick, i) => (
              <span key={tick} className={cn('h-px', i === ticks.length - 1 ? 'bg-line-strong' : 'bg-line')} />
            ))}
          </div>

          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
          >
            <defs>
              <linearGradient id={`${clipId}-fill`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
              {/* Reveal left to right; pathLength dashes break on a stretched viewBox. */}
              <clipPath id={`${clipId}-clip`}>
                <motion.rect
                  x="-2"
                  y="-10"
                  height="120"
                  initial={{ width: 0 }}
                  whileInView={{ width: 104 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.1, ease: easeOutSoft }}
                />
              </clipPath>
            </defs>
            <g clipPath={`url(#${clipId}-clip)`}>
              <polygon points={`0,100 ${line} 100,100`} fill={`url(#${clipId}-fill)`} />
              <polyline
                points={line}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2.25"
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </svg>

          {/* Active guide + dot */}
          {activePoint && active !== null && (
            <>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-px bg-brand-200"
                style={{ left: `${x(active)}%` }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-[3px] ring-brand-600"
                style={{ left: `${x(active)}%`, top: `${y(activePoint.value)}%` }}
              />
              <span
                aria-hidden
                className={cn(
                  'pointer-events-none absolute top-0 z-10 rounded-xl bg-ink px-3 py-2 text-xs whitespace-nowrap text-white shadow-float',
                  x(active) > 60 ? '-translate-x-full -ml-3' : 'ml-3',
                )}
                style={{ left: `${x(active)}%` }}
              >
                <span className="block text-white/60">{activePoint.label}</span>
                <span className="mt-0.5 block font-semibold">
                  {seriesName}: {format(activePoint.value)}
                </span>
              </span>
            </>
          )}
        </div>

        {/* X axis: labels sit under their points; the end labels align to the edges */}
        <span aria-hidden />
        <div aria-hidden className="relative h-4 text-[11px] text-muted">
          {data.map((d, i) =>
            shown.has(i) ? (
              <span
                key={`${d.label}-${i}`}
                className={cn(
                  'absolute top-0 whitespace-nowrap',
                  phoneHidden.has(i) && 'max-sm:hidden',
                  i === 0 ? '' : i === data.length - 1 ? '-translate-x-full' : '-translate-x-1/2',
                )}
                style={{ left: `${x(i)}%` }}
              >
                {d.label}
              </span>
            ) : null,
          )}
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
