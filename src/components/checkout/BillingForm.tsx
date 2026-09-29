import { AnimatePresence, motion } from 'framer-motion';
import { countries, indianStates } from '../../data/checkout';
import { digitsOnly } from '../../lib/checkout';
import { Checkbox, Field, SelectInput, TextInput, fieldDescribedBy } from '../ui/Form';
import { CheckoutSectionShell, fieldId, type CheckoutSectionProps } from './CheckoutSection';

export function BillingForm({ values, errors, onChange, onBlur }: CheckoutSectionProps) {
  const india = values.country === 'India';

  return (
    <CheckoutSectionShell step={2} title="Billing Address" description="Used for your invoice and tax calculation.">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={fieldId('country')} label="Country" error={errors.country}>
          <SelectInput
            id={fieldId('country')}
            name="country"
            autoComplete="country-name"
            options={countries}
            value={values.country}
            onChange={(e) => {
              onChange('country', e.target.value);
              // State and postal code formats depend on the country.
              onChange('state', '');
              onChange('postalCode', '');
            }}
            onBlur={() => onBlur('country')}
            invalid={!!errors.country}
            aria-describedby={fieldDescribedBy(fieldId('country'), errors.country)}
          />
        </Field>
        <Field id={fieldId('state')} label={india ? 'State' : 'State / Region'} error={errors.state}>
          {india ? (
            <SelectInput
              id={fieldId('state')}
              name="state"
              autoComplete="address-level1"
              placeholder="Select state"
              options={indianStates}
              value={values.state}
              onChange={(e) => onChange('state', e.target.value)}
              onBlur={() => onBlur('state')}
              invalid={!!errors.state}
              aria-describedby={fieldDescribedBy(fieldId('state'), errors.state)}
            />
          ) : (
            <TextInput
              id={fieldId('state')}
              name="state"
              autoComplete="address-level1"
              value={values.state}
              onChange={(e) => onChange('state', e.target.value)}
              onBlur={() => onBlur('state')}
              invalid={!!errors.state}
              aria-describedby={fieldDescribedBy(fieldId('state'), errors.state)}
            />
          )}
        </Field>
        <Field id={fieldId('city')} label="City" error={errors.city}>
          <TextInput
            id={fieldId('city')}
            name="city"
            autoComplete="address-level2"
            value={values.city}
            onChange={(e) => onChange('city', e.target.value)}
            onBlur={() => onBlur('city')}
            invalid={!!errors.city}
            aria-describedby={fieldDescribedBy(fieldId('city'), errors.city)}
          />
        </Field>
        <Field id={fieldId('postalCode')} label={india ? 'PIN Code' : 'Postal Code'} error={errors.postalCode}>
          <TextInput
            id={fieldId('postalCode')}
            name="postalCode"
            autoComplete="postal-code"
            inputMode={india ? 'numeric' : 'text'}
            placeholder={india ? '600001' : ''}
            value={values.postalCode}
            onChange={(e) => onChange('postalCode', india ? digitsOnly(e.target.value).slice(0, 6) : e.target.value.slice(0, 10))}
            onBlur={() => onBlur('postalCode')}
            invalid={!!errors.postalCode}
            aria-describedby={fieldDescribedBy(fieldId('postalCode'), errors.postalCode)}
          />
        </Field>
      </div>

      <Checkbox
        className="mt-6"
        checked={values.billingSameAsContact}
        onChange={(e) => onChange('billingSameAsContact', e.target.checked)}
      >
        Billing address is the same as contact information
      </Checkbox>

      <AnimatePresence initial={false}>
        {!values.billingSameAsContact && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid gap-5 pt-6 sm:grid-cols-2">
              <Field id={fieldId('billingName')} label="Billing Name" error={errors.billingName} hint="Name or company for the invoice">
                <TextInput
                  id={fieldId('billingName')}
                  name="billingName"
                  autoComplete="billing name"
                  value={values.billingName}
                  onChange={(e) => onChange('billingName', e.target.value)}
                  onBlur={() => onBlur('billingName')}
                  invalid={!!errors.billingName}
                  aria-describedby={fieldDescribedBy(fieldId('billingName'), errors.billingName, true)}
                />
              </Field>
              <Field id={fieldId('billingEmail')} label="Billing Email" error={errors.billingEmail}>
                <TextInput
                  id={fieldId('billingEmail')}
                  name="billingEmail"
                  type="email"
                  inputMode="email"
                  autoComplete="billing email"
                  value={values.billingEmail}
                  onChange={(e) => onChange('billingEmail', e.target.value)}
                  onBlur={() => onBlur('billingEmail')}
                  invalid={!!errors.billingEmail}
                  aria-describedby={fieldDescribedBy(fieldId('billingEmail'), errors.billingEmail)}
                />
              </Field>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CheckoutSectionShell>
  );
}
