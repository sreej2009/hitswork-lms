import { Fragment } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';
import { AppLink } from '../ui/AppLink';

const steps = [
  { label: 'Cart', href: '/cart' },
  { label: 'Checkout', href: '/checkout' },
  { label: 'Confirmation' },
] as const;

/** 1-based index of the current step; `complete` marks every step done (confirmation page). */
export function CheckoutSteps({ current, complete = false }: { current: 1 | 2 | 3; complete?: boolean }) {
  return (
    <nav aria-label="Checkout progress">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const number = index + 1;
          const done = complete || number < current;
          const active = !complete && number === current;
          const bubble = (
            <span
              className={cn(
                'grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors',
                done && 'bg-brand-gradient text-white',
                active && 'bg-brand-gradient text-white ring-4 ring-brand-100',
                !done && !active && 'border border-line-strong bg-white text-muted',
              )}
            >
              {done ? <Check aria-hidden className="size-4" strokeWidth={3} /> : number}
            </span>
          );
          const label = (
            // On phones only the current step keeps a visible label, so the row fits in 320px.
            <span className={cn('text-sm font-semibold', done || active ? 'text-ink' : 'text-muted', !active && 'max-sm:sr-only')}>
              {step.label}
              {done && <span className="sr-only"> (completed)</span>}
            </span>
          );
          const linkable = done && !complete && 'href' in step;
          return (
            <Fragment key={step.label}>
              {index > 0 && (
                <li aria-hidden className="mx-2 h-0.5 max-w-16 min-w-5 flex-1 rounded-full sm:mx-4 sm:max-w-24">
                  <span className={cn('block h-full rounded-full', number <= current || complete ? 'bg-brand-500' : 'bg-line-strong')} />
                </li>
              )}
              <li aria-current={active ? 'step' : undefined} className="flex items-center">
                {linkable ? (
                  <AppLink href={step.href} className="flex items-center gap-2.5 rounded-full pr-1 transition-opacity hover:opacity-80">
                    {bubble}
                    {label}
                  </AppLink>
                ) : (
                  <span className="flex items-center gap-2.5">
                    {bubble}
                    {label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
