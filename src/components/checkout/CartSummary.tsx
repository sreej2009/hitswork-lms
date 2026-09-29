import type { PriceSummary } from '../../lib/pricing';
import { formatPrice } from '../../lib/format';
import { Button } from '../ui/Button';
import { CouponInput } from './CouponInput';
import { Guarantees } from './Guarantees';
import { PriceBreakdown } from './PriceBreakdown';

export function CartSummary({ summary, itemCount }: { summary: PriceSummary; itemCount: number }) {
  return (
    <section aria-labelledby="cart-summary-title" className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-7">
      <h2 id="cart-summary-title" className="text-xl font-bold tracking-[-0.01em]">
        Order Summary
      </h2>
      <p className="mt-1 text-sm text-muted">
        {itemCount} {itemCount === 1 ? 'course' : 'courses'}
      </p>

      <div className="mt-6">
        <PriceBreakdown summary={summary} />
      </div>

      {summary.savings > 0 && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-center text-sm font-semibold text-emerald-700">
          You save {formatPrice(summary.savings)} on this order
        </p>
      )}

      <Button href="/checkout" size="lg" arrow fullWidth className="mt-6">
        Proceed to Checkout
      </Button>

      <div className="mt-6 border-t border-line pt-6">
        <CouponInput savings={summary.couponDiscount} />
      </div>

      <Guarantees show={['refund', 'secure', 'lifetime']} className="mt-6 border-t border-line pt-6" />
    </section>
  );
}
