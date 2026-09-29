import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/cn';

export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700',
        className,
      )}
    >
      {children}
      <ArrowRight
        aria-hidden
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        strokeWidth={2.2}
      />
    </a>
  );
}
