import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'white';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  /** Adds a trailing arrow that nudges forward on hover */
  arrow?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

type AnchorProps = BaseProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps>;
type NativeButtonProps = BaseProps & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof BaseProps
  >;
export type ButtonProps = AnchorProps | NativeButtonProps;

const base =
  'group/btn inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold ' +
  'transition-[transform,background-color,border-color,color,box-shadow,filter] duration-200 ease-out-soft ' +
  'disabled:pointer-events-none disabled:opacity-50';

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-12 px-6 text-[15px] sm:h-[52px] sm:px-7',
};

const variants: Record<Variant, string> = {
  primary: 'bg-brand-gradient text-white shadow-brand hover:-translate-y-px hover:brightness-110 active:translate-y-0',
  secondary:
    'border border-line-strong bg-white text-ink shadow-xs hover:border-brand-200 hover:bg-brand-50/60 hover:text-brand-700',
  ghost: 'text-ink hover:bg-canvas hover:text-brand-700',
  soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
  white: 'bg-white text-brand-700 shadow-float hover:-translate-y-px hover:bg-brand-50 active:translate-y-0',
};

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', icon: Icon, arrow, fullWidth, className, children, ...rest } = props;
  const classes = cn(base, sizes[size], variants[variant], fullWidth && 'w-full', className);
  const content = (
    <>
      {Icon && <Icon aria-hidden className="size-[18px]" strokeWidth={2} />}
      {children}
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-[18px] transition-transform duration-200 group-hover/btn:translate-x-0.5"
          strokeWidth={2.2}
        />
      )}
    </>
  );

  if (props.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }

  const { type = 'button', ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
