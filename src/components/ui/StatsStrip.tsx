import type { ReactNode } from 'react';
import type { Stat } from '../../types';
import { cn } from '../../lib/cn';
import { Container } from './Container';
import { Reveal } from './Reveal';

interface StatsStripProps {
  stats: Stat[];
  /** Accessible name; also the visible heading when `heading` is set */
  label: string;
  /** Show `label` as a centred heading, with optional supporting text */
  heading?: boolean;
  subtitle?: ReactNode;
  /** Pull the band up so it overlaps the bottom of the section above */
  overlap?: boolean;
  /** Small caption under the figures, e.g. a note that they are demo values */
  note?: string;
  className?: string;
}

/** Four headline figures in a white card, two per row on phones. */
export function StatsStrip({
  stats,
  label,
  heading = false,
  subtitle,
  overlap = false,
  note,
  className,
}: StatsStripProps) {
  const headingId = `${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-title`;
  return (
    <section
      aria-label={heading ? undefined : label}
      aria-labelledby={heading ? headingId : undefined}
      className={cn('relative z-10', overlap && '-mt-12 lg:-mt-16', className)}
    >
      <Container>
        <Reveal>
          {heading && (
            <div className="mb-10 text-center">
              <h2
                id={headingId}
                className="text-[1.75rem] leading-[1.15] font-bold tracking-[-0.022em] sm:text-4xl lg:text-[2.5rem]"
              >
                {label}
              </h2>
              {subtitle && (
                <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-body sm:text-lg">{subtitle}</p>
              )}
            </div>
          )}
          <dl className="grid grid-cols-2 gap-y-6 rounded-3xl border border-line bg-white px-4 py-6 shadow-card sm:px-6 lg:grid-cols-4 lg:py-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  'flex flex-col-reverse items-center gap-1 px-2 text-center',
                  index % 2 === 1 && 'border-l border-line',
                  index === 2 && 'lg:border-l lg:border-line',
                )}
              >
                <dt className="text-sm text-muted">{stat.label}</dt>
                <dd className="text-gradient font-display text-[1.875rem] leading-none font-extrabold tracking-[-0.03em] sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
          {note && <p className="mt-3 text-center text-xs text-muted">{note}</p>}
        </Reveal>
      </Container>
    </section>
  );
}
