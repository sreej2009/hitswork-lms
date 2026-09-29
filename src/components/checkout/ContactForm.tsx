import { dialCodes, type countries } from '../../data/checkout';
import { digitsOnly } from '../../lib/checkout';
import { Field, TextInput, fieldDescribedBy } from '../ui/Form';
import { CheckoutSectionShell, fieldId, type CheckoutSectionProps } from './CheckoutSection';

export function ContactForm({ values, errors, onChange, onBlur }: CheckoutSectionProps) {
  const dialCode = dialCodes[values.country as (typeof countries)[number]] ?? '+';
  const india = values.country === 'India';

  return (
    <CheckoutSectionShell step={1} title="Contact Information" description="We’ll send your receipt and course access here.">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={fieldId('firstName')} label="First Name" error={errors.firstName}>
          <TextInput
            id={fieldId('firstName')}
            name="firstName"
            autoComplete="given-name"
            value={values.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            onBlur={() => onBlur('firstName')}
            invalid={!!errors.firstName}
            aria-describedby={fieldDescribedBy(fieldId('firstName'), errors.firstName)}
          />
        </Field>
        <Field id={fieldId('lastName')} label="Last Name" error={errors.lastName}>
          <TextInput
            id={fieldId('lastName')}
            name="lastName"
            autoComplete="family-name"
            value={values.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            onBlur={() => onBlur('lastName')}
            invalid={!!errors.lastName}
            aria-describedby={fieldDescribedBy(fieldId('lastName'), errors.lastName)}
          />
        </Field>
        <Field id={fieldId('email')} label="Email Address" error={errors.email}>
          <TextInput
            id={fieldId('email')}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => onChange('email', e.target.value)}
            onBlur={() => onBlur('email')}
            invalid={!!errors.email}
            aria-describedby={fieldDescribedBy(fieldId('email'), errors.email)}
          />
        </Field>
        <Field id={fieldId('phone')} label="Phone Number" error={errors.phone}>
          <TextInput
            id={fieldId('phone')}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            leading={dialCode}
            placeholder={india ? '98765 43210' : ''}
            value={values.phone}
            onChange={(e) => onChange('phone', digitsOnly(e.target.value).slice(0, india ? 10 : 15))}
            onBlur={() => onBlur('phone')}
            invalid={!!errors.phone}
            aria-describedby={fieldDescribedBy(fieldId('phone'), errors.phone)}
            padding={dialCode.length > 3 ? 'pl-16 pr-4' : 'pl-12 pr-4'}
          />
        </Field>
      </div>
    </CheckoutSectionShell>
  );
}
