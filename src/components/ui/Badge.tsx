import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'amber' | 'brand' | 'rose' | 'emerald' | 'white' | 'outline';

const tones: Record<Tone, string> = {
  amber: 'bg-amber-100 text-amber-900',
  brand: 'bg-brand-50 text-brand-700',
  rose: 'bg-rose-100 text-rose-800',
  emerald: 'bg-emerald-50 text-emerald-700',
  white: 'bg-white text-brand-700 shadow-xs',
  outline: 'bg-white/80 text-brand-700 ring-1 ring-brand-100 backdrop-blur-sm',
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  /** Uppercase tracked label style, used for eyebrows */
  eyebrow?: boolean;
  className?: string;
}

export function Badge({ children, tone = 'brand', eyebrow, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap',
        eyebrow ? 'px-3.5 py-1.5 text-[11px] tracking-[0.14em] uppercase' : 'px-2.5 py-1 text-[11px] leading-none',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
