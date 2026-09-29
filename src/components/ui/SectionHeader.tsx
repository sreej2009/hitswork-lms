import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface SectionHeaderProps {
  id?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: string;
  /** Right-aligned slot, e.g. a "View all" link or carousel controls */
  action?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({ id, title, subtitle, eyebrow, action, align = 'left', className }: SectionHeaderProps) {
  const centered = align === 'center';
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        centered ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'mx-auto')}>
        {eyebrow && <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-brand-600 uppercase">{eyebrow}</p>}
        <h2
          id={id}
          className="text-[1.75rem] leading-[1.15] font-bold tracking-[-0.022em] sm:text-4xl lg:text-[2.5rem]"
        >
          {title}
        </h2>
        {subtitle && <p className="mt-3 text-base leading-relaxed text-body sm:text-lg">{subtitle}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
    </div>
  );
}
