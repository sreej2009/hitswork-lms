import { Loader2, LockKeyhole } from 'lucide-react';
import type { Course } from '../../types';
import type { PriceSummary } from '../../lib/pricing';
import { formatPrice } from '../../lib/format';
import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Form';
import { SmartImage } from '../ui/SmartImage';
import { CouponInput } from './CouponInput';
import { Guarantees } from './Guarantees';
import { PriceBreakdown } from './PriceBreakdown';

interface OrderSummaryProps {
  items: Course[];
  summary: PriceSummary;
  /** id of the <form> the Pay button submits */
  formId: string;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
  processing: boolean;
}

export function OrderSummary({ items, summary, formId, termsAccepted, onTermsChange, processing }: OrderSummaryProps) {
  return (
    <section aria-labelledby="order-summary-title" className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="order-summary-title" className="text-xl font-bold tracking-[-0.01em]">
          Order Summary
        </h2>
        <span className="text-sm text-muted">
          {items.length} {items.length === 1 ? 'course' : 'courses'}
        </span>
      </div>

      <ul className="mt-5 space-y-4">
        {items.map((course) => (
          <li key={course.id} className="flex gap-3.5">
            <div className="aspect-[16/10] w-20 shrink-0 overflow-hidden rounded-lg bg-brand-50">
              <SmartImage photoId={course.image} alt="" width={160} ratio={16 / 10} className="size-full" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm leading-snug font-semibold text-ink">{course.title}</p>
              <p className="mt-1 flex items-baseline gap-2 text-sm">
                <span className="font-semibold text-ink">{formatPrice(course.price)}</span>
                {course.originalPrice > course.price && (
                  <span className="text-xs text-subtle line-through">{formatPrice(course.originalPrice)}</span>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-line pt-6">
        <PriceBreakdown summary={summary} originalLabel="Subtotal" />
      </div>

      {summary.savings > 0 && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-center text-sm font-semibold text-emerald-700">
          You save {formatPrice(summary.savings)}
        </p>
      )}

      <div className="mt-5">
        <CouponInput savings={summary.couponDiscount} />
      </div>

      <div className="mt-6 border-t border-line pt-6">
        <Checkbox checked={termsAccepted} onChange={(e) => onTermsChange(e.target.checked)}>
          I agree to the{' '}
          <AppLink href="/terms" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
            Terms of Use
          </AppLink>{' '}
          and{' '}
          <AppLink href="/privacy" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
            Privacy Policy
          </AppLink>
          .
        </Checkbox>

        <Button
          type="submit"
          form={formId}
          size="lg"
          fullWidth
          arrow={!processing}
          disabled={!termsAccepted || processing}
          aria-busy={processing}
          className="mt-5"
        >
          {processing ? (
            <>
              <Loader2 aria-hidden className="size-[18px] animate-spin" />
              Processing payment…
            </>
          ) : (
            <>Pay {formatPrice(summary.total)}</>
          )}
        </Button>
        {!termsAccepted && (
          <p className="mt-2.5 text-center text-xs text-muted">Accept the terms to continue</p>
        )}
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
          <LockKeyhole aria-hidden className="size-3.5" strokeWidth={2.2} />
          Secure &amp; encrypted payment
        </p>
      </div>

      <Guarantees show={['refund', 'lifetime', 'certificate']} className="mt-6 border-t border-line pt-6" />
    </section>
  );
}
