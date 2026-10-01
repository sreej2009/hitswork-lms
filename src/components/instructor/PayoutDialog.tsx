import { useRef, useState, type FormEvent, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Landmark, Smartphone, X } from 'lucide-react';
import type { PayoutMethod, PayoutSettings } from '../../types/instructor';
import { useModalDialog } from '../../hooks/useModalDialog';
import { digitsOnly } from '../../lib/checkout';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { Field, TextInput, fieldDescribedBy } from '../ui/Form';
import { IconButton } from '../ui/IconButton';
import { easeOutSoft } from '../ui/Reveal';

const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const UPI = /^[\w.-]{2,}@[a-zA-Z]{2,}$/;

interface PayoutDialogProps {
  open: boolean;
  settings: PayoutSettings;
  onClose: () => void;
  onSave: (settings: PayoutSettings) => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}

type Errors = Partial<Record<'accountName' | 'accountNumber' | 'ifsc' | 'upiId', string>>;

/** Demo payout form. Only the last four digits of an account number are kept. */
function PayoutForm({ settings, onClose, onSave }: Omit<PayoutDialogProps, 'open' | 'returnFocusRef'>) {
  const [method, setMethod] = useState<PayoutMethod>(settings.method);
  const [accountName, setAccountName] = useState(settings.accountName);
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState(settings.ifsc);
  const [upiId, setUpiId] = useState(settings.upiId);
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {};
    if (method === 'bank') {
      if (accountName.trim().length < 2) next.accountName = 'Enter the account holder’s name';
      // Keeping the saved account is fine; a new number must look like one.
      if (accountNumber && (accountNumber.length < 9 || accountNumber.length > 18))
        next.accountNumber = 'Account numbers have 9–18 digits';
      if (!accountNumber && !settings.bankLast4) next.accountNumber = 'Enter your account number';
      if (!IFSC.test(ifsc)) next.ifsc = 'Enter a valid IFSC, e.g. HDFC0001234';
    } else if (!UPI.test(upiId.trim())) {
      next.upiId = 'Enter a valid UPI ID, e.g. name@okhdfc';
    }
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`payout-${first}`)?.focus();
      return;
    }
    onSave({
      method,
      accountName: accountName.trim(),
      bankLast4: accountNumber ? accountNumber.slice(-4) : settings.bankLast4,
      ifsc,
      upiId: upiId.trim(),
    });
  };

  const methods: { value: PayoutMethod; label: string; hint: string; icon: typeof Landmark }[] = [
    { value: 'bank', label: 'Bank Account', hint: 'NEFT / IMPS transfer', icon: Landmark },
    { value: 'upi', label: 'UPI', hint: 'Paid to your UPI ID', icon: Smartphone },
  ];

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 px-5 py-6 sm:px-6">
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">Payment method</legend>
        <div className="grid grid-cols-2 gap-3">
          {methods.map(({ value, label, hint, icon: Icon }) => (
            <label
              key={value}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100',
                method === value ? 'border-brand-300 bg-brand-50/60' : 'border-line hover:border-brand-200',
              )}
            >
              <input
                type="radio"
                name="payout-method"
                value={value}
                checked={method === value}
                onChange={() => setMethod(value)}
                className="sr-only"
              />
              <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-600" strokeWidth={1.9} />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{label}</span>
                <span className="block text-xs text-muted">{hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {method === 'bank' ? (
        <>
          <Field id="payout-accountName" label="Account holder name" error={errors.accountName}>
            <TextInput
              id="payout-accountName"
              autoComplete="name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              invalid={!!errors.accountName}
              aria-describedby={fieldDescribedBy('payout-accountName', errors.accountName)}
            />
          </Field>
          <Field
            id="payout-accountNumber"
            label="Account number"
            error={errors.accountNumber}
            hint={settings.bankLast4 ? `Leave blank to keep the account ending ${settings.bankLast4}.` : undefined}
          >
            <TextInput
              id="payout-accountNumber"
              inputMode="numeric"
              autoComplete="off"
              placeholder={settings.bankLast4 ? `•••• ${settings.bankLast4}` : 'Account number'}
              value={accountNumber}
              onChange={(e) => setAccountNumber(digitsOnly(e.target.value).slice(0, 18))}
              invalid={!!errors.accountNumber}
              aria-describedby={fieldDescribedBy('payout-accountNumber', errors.accountNumber, !!settings.bankLast4)}
            />
          </Field>
          <Field id="payout-ifsc" label="IFSC" error={errors.ifsc}>
            <TextInput
              id="payout-ifsc"
              autoComplete="off"
              placeholder="HDFC0001234"
              value={ifsc}
              onChange={(e) =>
                setIfsc(
                  e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, '')
                    .slice(0, 11),
                )
              }
              invalid={!!errors.ifsc}
              aria-describedby={fieldDescribedBy('payout-ifsc', errors.ifsc)}
            />
          </Field>
        </>
      ) : (
        <Field id="payout-upiId" label="UPI ID" error={errors.upiId}>
          <TextInput
            id="payout-upiId"
            autoComplete="off"
            placeholder="name@okhdfc"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            invalid={!!errors.upiId}
            aria-describedby={fieldDescribedBy('payout-upiId', errors.upiId)}
          />
        </Field>
      )}

      <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900 ring-1 ring-amber-100">
        Demo only — no payment provider is connected and no money will be sent.
      </p>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Payout Settings</Button>
      </div>
    </form>
  );
}

export function PayoutDialog({ open, settings, onClose, onSave, returnFocusRef }: PayoutDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useModalDialog({ open, onClose, panelRef, initialFocusRef: closeRef, returnFocusRef });

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] grid place-items-end sm:place-items-center sm:p-6">
          <motion.div
            aria-hidden
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="payout-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.28, ease: easeOutSoft }}
            className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-lg sm:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <h2 id="payout-title" className="text-lg font-bold">
                Payout Settings
              </h2>
              <IconButton ref={closeRef} icon={X} label="Close" onClick={onClose} />
            </div>
            <PayoutForm settings={settings} onClose={onClose} onSave={onSave} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
