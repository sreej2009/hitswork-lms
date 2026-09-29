import { useId, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgePercent, CheckCircle2, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { findCoupon } from '../../lib/pricing';
import { cn } from '../../lib/cn';
import { formatPrice } from '../../lib/format';

/** Demo coupon entry. Codes are checked on the client; HITS20 is the demo code. */
export function CouponInput({ savings }: { savings: number }) {
  const { coupon, applyCoupon, removeCoupon } = useStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const applied = findCoupon(coupon);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = code.trim();
    if (!value) {
      setError('Enter a coupon code');
      return;
    }
    if (applyCoupon(value)) {
      setError(null);
      setCode('');
    } else {
      setError(`“${value.toUpperCase()}” isn’t a valid coupon`);
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait" initial={false}>
        {applied ? (
          <motion.div
            key="applied"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
            role="status"
          >
            <CheckCircle2 aria-hidden className="size-5 shrink-0 text-emerald-600" strokeWidth={2.2} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-emerald-800">{applied.code} applied</p>
              <p className="text-xs text-emerald-700">
                {applied.label}
                {savings > 0 && <> · you save {formatPrice(savings)}</>}
              </p>
            </div>
            <button
              type="button"
              onClick={removeCoupon}
              aria-label={`Remove coupon ${applied.code}`}
              className="grid size-8 shrink-0 place-items-center rounded-full text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              <X aria-hidden className="size-4" strokeWidth={2.4} />
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onSubmit={onSubmit}
            noValidate
          >
            <label htmlFor={inputId} className="flex items-center gap-2 text-sm font-semibold text-ink">
              <BadgePercent aria-hidden className="size-4 text-brand-600" strokeWidth={2.2} />
              Have a coupon?
            </label>
            <div className="mt-2.5 flex gap-2">
              <input
                id={inputId}
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setError(null);
                }}
                placeholder="Enter coupon code"
                autoComplete="off"
                aria-invalid={error ? true : undefined}
                aria-describedby={`${inputId}-msg`}
                className={cn(
                  'h-11 min-w-0 flex-1 rounded-xl border bg-white px-4 text-sm font-medium tracking-wide text-ink uppercase outline-none transition-[border-color,box-shadow] placeholder:font-normal placeholder:tracking-normal placeholder:normal-case placeholder:text-subtle',
                  error
                    ? 'border-rose-300 focus:ring-4 focus:ring-rose-100'
                    : 'border-line-strong hover:border-brand-200 focus:border-brand-300 focus:ring-4 focus:ring-brand-100',
                )}
              />
              <button
                type="submit"
                className="h-11 shrink-0 rounded-xl bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Apply
              </button>
            </div>
            <p id={`${inputId}-msg`} className={cn('mt-2 text-xs', error ? 'font-medium text-rose-600' : 'text-muted')}>
              {error ?? (
                <>
                  Demo code: <span className="font-semibold text-ink">HITS20</span>
                </>
              )}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
