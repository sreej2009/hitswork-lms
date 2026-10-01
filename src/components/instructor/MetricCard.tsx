import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { easeOutSoft } from '../ui/Reveal';

interface MetricCardProps {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  /** Tile colours, e.g. "bg-brand-50 text-brand-600" */
  tone?: string;
  /** e.g. "+12.4%" or "+1 this month" */
  trend?: string;
  /** Direction of the trend; up by default */
  trendDirection?: 'up' | 'down';
  /** Small text after the trend, e.g. "vs last month" */
  caption?: string;
  index?: number;
}

/** Headline number with an icon tile and an optional trend chip. */
export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = 'bg-brand-50 text-brand-600',
  trend,
  trendDirection = 'up',
  caption,
  index = 0,
}: MetricCardProps) {
  const TrendIcon = trendDirection === 'up' ? TrendingUp : TrendingDown;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: easeOutSoft }}
      className="min-w-0 rounded-[20px] border border-line bg-white p-4 shadow-card transition-shadow duration-300 hover:shadow-card-hover sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', tone)}>
          <Icon aria-hidden className="size-5" strokeWidth={1.9} />
        </span>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap',
              trendDirection === 'up' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700',
            )}
          >
            <TrendIcon aria-hidden className="size-3" strokeWidth={2.4} />
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 truncate font-display text-2xl leading-none font-extrabold tracking-[-0.02em] text-ink sm:text-[1.75rem]">
        {value}
      </p>
      <p className="mt-2 truncate text-sm text-muted">
        {label}
        {caption && <span className="text-subtle"> · {caption}</span>}
      </p>
    </motion.div>
  );
}
