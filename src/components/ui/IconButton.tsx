import { forwardRef, type ButtonHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { AppLink } from './AppLink';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  /** Numeric badge; `true` renders a dot */
  badge?: number | boolean;
}

const baseClass =
  'relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-body transition-colors duration-200 hover:bg-canvas hover:text-ink';

function Adornments({ icon: Icon, badge }: { icon: LucideIcon; badge?: number | boolean }) {
  return (
    <>
      <Icon aria-hidden className="size-5" strokeWidth={1.9} />
      {typeof badge === 'number' && badge > 0 && (
        <span className="absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand-gradient px-1 text-[10px] leading-none font-bold text-white ring-2 ring-white">
          {badge}
        </span>
      )}
      {badge === true && (
        <span aria-hidden className="absolute top-2 right-2.5 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
      )}
    </>
  );
}

const accessibleName = (label: string, badge?: number | boolean) =>
  typeof badge === 'number' && badge > 0 ? `${label} (${badge})` : label;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, badge, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} aria-label={accessibleName(label, badge)} className={cn(baseClass, className)} {...rest}>
      <Adornments icon={icon} badge={badge} />
    </button>
  );
});

/** Same look as IconButton, but navigates. */
export function IconLink({
  href,
  icon,
  label,
  badge,
  className,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number | boolean;
  className?: string;
}) {
  return (
    <AppLink href={href} aria-label={accessibleName(label, badge)} className={cn(baseClass, className)}>
      <Adornments icon={icon} badge={badge} />
    </AppLink>
  );
}
