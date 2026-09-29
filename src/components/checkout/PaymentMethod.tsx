import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Info, Landmark, LockKeyhole, Smartphone, Wallet, type LucideIcon } from 'lucide-react';
import type { PaymentMethodId } from '../../types';
import { banks, wallets } from '../../data/checkout';
import { detectCardBrand, digitsOnly, formatCardNumber, formatExpiry, type CardBrand } from '../../lib/checkout';
import { cn } from '../../lib/cn';
import { Field, SelectInput, TextInput, fieldDescribedBy } from '../ui/Form';
import { CheckoutSectionShell, fieldId, type CheckoutSectionProps } from './CheckoutSection';

const methods: { id: PaymentMethodId; label: string; icon: LucideIcon }[] = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'netbanking', label: 'Net Banking', icon: Landmark },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
];

// Simple text/shape marks — not official logos.
const brandBadges: Record<CardBrand, { label: string; mark: ReactNode }> = {
  visa: {
    label: 'Visa',
    mark: <span className="text-[11px] font-black tracking-tight text-[#1a1f71] italic">VISA</span>,
  },
  mastercard: {
    label: 'Mastercard',
    mark: (
      <span className="flex">
        <span className="size-3.5 rounded-full bg-[#eb001b]" />
        <span className="-ml-1.5 size-3.5 rounded-full bg-[#f79e1b] mix-blend-multiply" />
      </span>
    ),
  },
  amex: {
    label: 'American Express',
    mark: <span className="rounded-sm bg-[#2e77bc] px-1 text-[9px] font-bold tracking-wide text-white">AMEX</span>,
  },
  rupay: {
    label: 'RuPay',
    mark: (
      <span className="text-[10px] font-extrabold text-[#1b3f8b] italic">
        Ru<span className="text-[#f47920]">Pay</span>
      </span>
    ),
  },
};

function CardBrands({ active }: { active: CardBrand | null }) {
  return (
    <span className="flex items-center gap-1" aria-hidden>
      {(Object.keys(brandBadges) as CardBrand[]).map((brand) => (
        <span
          key={brand}
          className={cn(
            'grid h-6 w-9 place-items-center rounded-md border bg-white transition-opacity',
            active && active !== brand ? 'opacity-25 max-sm:hidden' : 'opacity-100',
            !active && 'max-sm:hidden',
            active === brand ? 'border-brand-300' : 'border-line',
          )}
        >
          {brandBadges[brand].mark}
        </span>
      ))}
    </span>
  );
}

export function PaymentMethod({ values, errors, onChange, onBlur }: CheckoutSectionProps) {
  const brand = detectCardBrand(values.cardNumber);

  return (
    <CheckoutSectionShell step={3} title="Payment Method" description="All transactions are secure and encrypted.">
      <fieldset>
        <legend className="sr-only">Choose a payment method</legend>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {methods.map(({ id, label, icon: Icon }) => (
            <label key={id} className="relative cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value={id}
                checked={values.method === id}
                onChange={() => onChange('method', id)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'flex h-full min-h-[88px] flex-col items-start justify-between gap-3 rounded-2xl border bg-white p-4 text-sm font-semibold transition-all duration-200',
                  'peer-focus-visible:ring-4 peer-focus-visible:ring-brand-200',
                  values.method === id
                    ? 'border-brand-500 bg-brand-50/60 text-brand-800 shadow-[0_0_0_1px_var(--color-brand-500)]'
                    : 'border-line-strong text-ink hover:border-brand-200 hover:bg-canvas',
                )}
              >
                <span
                  className={cn(
                    'grid size-9 place-items-center rounded-xl transition-colors',
                    values.method === id ? 'bg-brand-gradient text-white' : 'bg-canvas text-muted',
                  )}
                >
                  <Icon aria-hidden className="size-[18px]" strokeWidth={2} />
                </span>
                {label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={values.method}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="mt-6"
        >
          {values.method === 'card' && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id={fieldId('cardNumber')}
                label="Card Number"
                error={errors.cardNumber}
                hint="Demo: use 4242 4242 4242 4242 with any future date"
                className="sm:col-span-2"
              >
                <TextInput
                  id={fieldId('cardNumber')}
                  name="cardNumber"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  value={values.cardNumber}
                  onChange={(e) => onChange('cardNumber', formatCardNumber(e.target.value))}
                  onBlur={() => onBlur('cardNumber')}
                  invalid={!!errors.cardNumber}
                  aria-describedby={fieldDescribedBy(fieldId('cardNumber'), errors.cardNumber, true)}
                  trailing={<CardBrands active={brand} />}
                  padding="pl-4 pr-16 sm:pr-44"
                  className="tracking-wide tabular-nums"
                />
              </Field>
              <Field id={fieldId('cardExpiry')} label="Expiry (MM / YY)" error={errors.cardExpiry}>
                <TextInput
                  id={fieldId('cardExpiry')}
                  name="cardExpiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM / YY"
                  value={values.cardExpiry}
                  onChange={(e) => onChange('cardExpiry', formatExpiry(e.target.value))}
                  onBlur={() => onBlur('cardExpiry')}
                  invalid={!!errors.cardExpiry}
                  aria-describedby={fieldDescribedBy(fieldId('cardExpiry'), errors.cardExpiry)}
                  className="tabular-nums"
                />
              </Field>
              <Field id={fieldId('cardCvv')} label="CVV" error={errors.cardCvv}>
                <TextInput
                  id={fieldId('cardCvv')}
                  name="cardCvv"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder={brand === 'amex' ? '4 digits' : '3 digits'}
                  value={values.cardCvv}
                  onChange={(e) => onChange('cardCvv', digitsOnly(e.target.value).slice(0, brand === 'amex' ? 4 : 3))}
                  onBlur={() => onBlur('cardCvv')}
                  invalid={!!errors.cardCvv}
                  aria-describedby={fieldDescribedBy(fieldId('cardCvv'), errors.cardCvv)}
                />
              </Field>
              <Field id={fieldId('cardName')} label="Name on Card" error={errors.cardName} className="sm:col-span-2">
                <TextInput
                  id={fieldId('cardName')}
                  name="cardName"
                  autoComplete="cc-name"
                  value={values.cardName}
                  onChange={(e) => onChange('cardName', e.target.value)}
                  onBlur={() => onBlur('cardName')}
                  invalid={!!errors.cardName}
                  aria-describedby={fieldDescribedBy(fieldId('cardName'), errors.cardName)}
                />
              </Field>
            </div>
          )}

          {values.method === 'upi' && (
            <Field
              id={fieldId('upiId')}
              label="UPI ID"
              error={errors.upiId}
              hint="You’ll approve the payment in your UPI app"
              className="max-w-md"
            >
              <TextInput
                id={fieldId('upiId')}
                name="upiId"
                autoComplete="off"
                autoCapitalize="none"
                placeholder="example@upi"
                value={values.upiId}
                onChange={(e) => onChange('upiId', e.target.value.trim())}
                onBlur={() => onBlur('upiId')}
                invalid={!!errors.upiId}
                aria-describedby={fieldDescribedBy(fieldId('upiId'), errors.upiId, true)}
              />
            </Field>
          )}

          {values.method === 'netbanking' && (
            <Field
              id={fieldId('bank')}
              label="Select Bank"
              error={errors.bank}
              hint="You’ll be redirected to your bank to complete the payment"
              className="max-w-md"
            >
              <SelectInput
                id={fieldId('bank')}
                name="bank"
                placeholder="Choose your bank"
                options={banks}
                value={values.bank}
                onChange={(e) => onChange('bank', e.target.value)}
                onBlur={() => onBlur('bank')}
                invalid={!!errors.bank}
                aria-describedby={fieldDescribedBy(fieldId('bank'), errors.bank, true)}
              />
            </Field>
          )}

          {values.method === 'wallet' && (
            <Field id={fieldId('wallet')} label="Select Wallet" error={errors.wallet} className="max-w-md">
              <SelectInput
                id={fieldId('wallet')}
                name="wallet"
                placeholder="Choose a wallet"
                options={wallets}
                value={values.wallet}
                onChange={(e) => onChange('wallet', e.target.value)}
                onBlur={() => onBlur('wallet')}
                invalid={!!errors.wallet}
                aria-describedby={fieldDescribedBy(fieldId('wallet'), errors.wallet)}
              />
            </Field>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-xs">
          <LockKeyhole aria-hidden className="size-[18px]" strokeWidth={2} />
        </span>
        <div>
          <p className="text-sm font-semibold text-emerald-900">Secure &amp; encrypted payment</p>
          <p className="mt-0.5 text-sm text-emerald-800/80">
            Your payment information is protected using industry-standard security.
          </p>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-muted">
        <Info aria-hidden className="size-3.5 shrink-0" strokeWidth={2.2} />
        This is a demo checkout — no real payment is taken.
      </p>
    </CheckoutSectionShell>
  );
}
