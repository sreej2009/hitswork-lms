import type { PriceSummary } from '../../lib/pricing';
import { formatPrice } from '../../lib/format';

interface PriceBreakdownProps {
  summary: PriceSummary;
  /** Label for the list-price total: "Original Price" in the cart, "Subtotal" at checkout */
  originalLabel?: string;
}

export function PriceBreakdown({ summary, originalLabel = 'Original Price' }: PriceBreakdownProps) {
  return (
    <dl className="space-y-3 text-[15px]">
      <div className="flex justify-between gap-4">
        <dt className="text-body">{originalLabel}</dt>
        <dd className="text-ink tabular-nums">{formatPrice(summary.original)}</dd>
      </div>
      {summary.discount > 0 && (
        <div className="flex justify-between gap-4">
          <dt className="text-body">Discount</dt>
          <dd className="font-medium text-emerald-600 tabular-nums">−{formatPrice(summary.discount)}</dd>
        </div>
      )}
      {summary.coupon && (
        <div className="flex justify-between gap-4">
          <dt className="text-body">
            Coupon Discount{' '}
            <span className="ml-1 rounded-md bg-brand-50 px-1.5 py-0.5 text-[11px] font-semibold text-brand-700">
              {summary.coupon.code}
            </span>
          </dt>
          <dd className="font-medium text-emerald-600 tabular-nums">−{formatPrice(summary.couponDiscount)}</dd>
        </div>
      )}
      <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
        <dt className="font-semibold text-ink">Total</dt>
        <dd className="font-display text-2xl font-extrabold tracking-tight text-ink tabular-nums">
          {formatPrice(summary.total)}
        </dd>
      </div>
    </dl>
  );
}
