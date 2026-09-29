import type { ReactNode } from 'react';
import type { CheckoutErrors, CheckoutField, CheckoutForm } from '../../lib/checkout';

/** Props shared by the checkout form sections. */
export interface CheckoutSectionProps {
  values: CheckoutForm;
  /** Errors that should currently be displayed */
  errors: CheckoutErrors;
  onChange: <K extends CheckoutField>(field: K, value: CheckoutForm[K]) => void;
  onBlur: (field: CheckoutField) => void;
}

/** DOM id for a checkout field, so the page can focus the first invalid one. */
export const fieldId = (field: CheckoutField) => `checkout-${field}`;

interface CheckoutSectionShellProps {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}

export function CheckoutSectionShell({ step, title, description, children }: CheckoutSectionShellProps) {
  const headingId = `checkout-step-${step}`;
  return (
    <section aria-labelledby={headingId} className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
      <div className="flex items-start gap-3.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 font-display text-sm font-bold text-brand-700">
          {step}
        </span>
        <div>
          <h2 id={headingId} className="text-lg leading-8 font-bold tracking-[-0.01em] sm:text-xl">
            {title}
          </h2>
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
