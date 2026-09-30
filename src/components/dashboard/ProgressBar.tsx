import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { easeOutSoft } from '../ui/Reveal';

interface ProgressBarProps {
  /** 0–100 */
  value: number;
  label: string;
  tone?: 'brand' | 'success';
  size?: 'sm' | 'md';
  /** Lighter track for dark backgrounds */
  onDark?: boolean;
  className?: string;
}

/** Progress bar that fills when it scrolls into view. */
export function ProgressBar({ value, label, tone = 'brand', size = 'md', onDark = false, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn('overflow-hidden rounded-full', onDark ? 'bg-white/15' : 'bg-brand-50', size === 'sm' ? 'h-1.5' : 'h-2', className)}
    >
      <motion.div
        className={cn('h-full rounded-full', tone === 'success' ? 'bg-emerald-500' : 'bg-brand-gradient')}
        initial={{ width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: easeOutSoft }}
      />
    </div>
  );
}
