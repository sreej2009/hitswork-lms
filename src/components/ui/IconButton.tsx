import { forwardRef, type ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  /** Numeric badge; `true` renders a dot */
  badge?: number | boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon: Icon, label, badge, className, type = 'button', ...rest },
  ref,
) {
  const showCount = typeof badge === 'number' && badge > 0;
  return (
    <button
      ref={ref}
      type={type}
      aria-label={showCount ? `${label} (${badge})` : label}
      className={cn(
        'relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-body transition-colors duration-200 hover:bg-canvas hover:text-ink',
        className,
      )}
      {...rest}
    >
      <Icon aria-hidden className="size-5" strokeWidth={1.9} />
      {showCount && (
        <span className="absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand-gradient px-1 text-[10px] leading-none font-bold text-white ring-2 ring-white">
          {badge}
        </span>
      )}
      {badge === true && (
        <span aria-hidden className="absolute top-2 right-2.5 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
      )}
    </button>
  );
});
