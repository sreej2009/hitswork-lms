import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { RevealGroup, RevealItem, easeOutSoft } from './Reveal';

export interface ProcessStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

// Written out in full so Tailwind can detect the classes.
const columns: Record<number, string> = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
};

/**
 * Numbered steps joined by a line: horizontal from `lg`, vertical (stacked) below.
 * Supports 3–5 steps.
 */
export function ProcessSteps({ steps, className }: { steps: ProcessStep[]; className?: string }) {
  // The horizontal line runs between the centres of the first and last columns.
  const inset = `${50 / steps.length}%`;
  return (
    <div className={cn('relative', className)}>
      <motion.div
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, ease: easeOutSoft }}
        style={{ left: inset, right: inset }}
        className="absolute top-7 hidden h-px origin-left bg-linear-to-r from-brand-200 via-grape-600/30 to-brand-200 lg:block"
      />
      <div
        aria-hidden
        className="absolute top-7 bottom-7 left-7 w-px bg-linear-to-b from-brand-200 via-grape-600/25 to-brand-200 lg:hidden"
      />

      <RevealGroup className={cn('relative grid gap-8 lg:gap-6', columns[steps.length])}>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const number = String(index + 1).padStart(2, '0');
          return (
            <RevealItem key={step.title} className="flex gap-5 lg:flex-col lg:items-center lg:text-center">
              <span className="relative grid size-14 shrink-0 place-items-center rounded-2xl bg-white shadow-card ring-1 ring-line">
                <Icon aria-hidden className="size-6 text-brand-600" strokeWidth={1.9} />
                <span className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-brand-gradient font-display text-[11px] font-bold text-white ring-2 ring-canvas">
                  {number}
                </span>
              </span>
              <div className="min-w-0 pt-1 lg:max-w-[16rem] lg:pt-2">
                <p className="font-display text-xs font-bold tracking-[0.14em] text-brand-600 uppercase">
                  Step {number}
                </p>
                <h3 className="mt-1.5 text-lg font-bold tracking-[-0.01em]">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-body">{step.description}</p>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </div>
  );
}
