import type { PaymentMethodId } from '../types';

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  billingSameAsContact: boolean;
  billingName: string;
  billingEmail: string;
  method: PaymentMethodId;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardName: string;
  upiId: string;
  bank: string;
  wallet: string;
}

export type CheckoutField = keyof CheckoutForm;
export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

export const initialCheckoutForm: CheckoutForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: 'India',
  state: '',
  city: '',
  postalCode: '',
  billingSameAsContact: true,
  billingName: '',
  billingEmail: '',
  method: 'card',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
  cardName: '',
  upiId: '',
  bank: '',
  wallet: '',
};

/** Field order on screen; used to focus the first invalid field after a failed submit. */
export const fieldOrder: CheckoutField[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'country',
  'state',
  'city',
  'postalCode',
  'billingName',
  'billingEmail',
  'cardNumber',
  'cardExpiry',
  'cardCvv',
  'cardName',
  'upiId',
  'bank',
  'wallet',
];

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'rupay';

export const digitsOnly = (value: string) => value.replace(/\D/g, '');

export function detectCardBrand(value: string): CardBrand | null {
  const digits = digitsOnly(value);
  if (/^4/.test(digits)) return 'visa';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return 'mastercard';
  if (/^(60|65|81|82|508)/.test(digits)) return 'rupay';
  return null;
}

/** Luhn checksum — catches typos in card numbers. */
export function passesLuhn(digits: string) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return digits.length > 0 && sum % 10 === 0;
}

/** "4242424242424242" → "4242 4242 4242 4242"; Amex uses 4-6-5 grouping. */
export function formatCardNumber(value: string) {
  const digits = digitsOnly(value);
  if (detectCardBrand(digits) === 'amex') {
    const d = digits.slice(0, 15);
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10)].filter(Boolean).join(' ');
  }
  return digits
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();
}

/** "1228" → "12 / 28" */
export function formatExpiry(value: string) {
  const digits = digitsOnly(value).slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UPI = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;

export function validateCheckout(form: CheckoutForm, now = new Date()): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const required = (field: CheckoutField, label: string) => {
    if (!String(form[field]).trim()) errors[field] = `${label} is required`;
  };
  const india = form.country === 'India';

  // Contact
  required('firstName', 'First name');
  required('lastName', 'Last name');
  if (!form.email.trim()) errors.email = 'Email address is required';
  else if (!EMAIL.test(form.email.trim())) errors.email = 'Enter a valid email address';
  const phone = digitsOnly(form.phone);
  if (!phone) errors.phone = 'Phone number is required';
  else if (india ? !/^[6-9]\d{9}$/.test(phone) : phone.length < 7 || phone.length > 15)
    errors.phone = india ? 'Enter a valid 10-digit mobile number' : 'Enter a valid phone number';

  // Billing
  required('country', 'Country');
  required('state', 'State');
  required('city', 'City');
  if (!form.postalCode.trim()) errors.postalCode = 'Postal code is required';
  else if (india ? !/^[1-9]\d{5}$/.test(form.postalCode) : !/^[A-Za-z0-9 -]{3,10}$/.test(form.postalCode.trim()))
    errors.postalCode = india ? 'Enter a valid 6-digit PIN code' : 'Enter a valid postal code';
  if (!form.billingSameAsContact) {
    required('billingName', 'Billing name');
    if (!form.billingEmail.trim()) errors.billingEmail = 'Billing email is required';
    else if (!EMAIL.test(form.billingEmail.trim())) errors.billingEmail = 'Enter a valid email address';
  }

  // Payment
  switch (form.method) {
    case 'card': {
      const number = digitsOnly(form.cardNumber);
      const brand = detectCardBrand(number);
      if (!number) errors.cardNumber = 'Card number is required';
      else if (number.length < 13 || number.length > 19 || !passesLuhn(number))
        errors.cardNumber = 'Enter a valid card number';

      const [mm, yy] = form.cardExpiry.split('/').map((part) => Number(part.trim()));
      if (!form.cardExpiry) errors.cardExpiry = 'Expiry date is required';
      else if (!mm || mm > 12 || !Number.isFinite(yy) || digitsOnly(form.cardExpiry).length !== 4)
        errors.cardExpiry = 'Use MM / YY';
      else {
        // A card is valid until the end of its expiry month.
        const expiresAt = new Date(2000 + yy, mm, 1);
        if (expiresAt <= now) errors.cardExpiry = 'This card has expired';
      }

      const cvvLength = brand === 'amex' ? 4 : 3;
      if (!form.cardCvv) errors.cardCvv = 'CVV is required';
      else if (form.cardCvv.length !== cvvLength) errors.cardCvv = `Enter the ${cvvLength}-digit CVV`;
      required('cardName', 'Name on card');
      break;
    }
    case 'upi':
      if (!form.upiId.trim()) errors.upiId = 'UPI ID is required';
      else if (!UPI.test(form.upiId.trim())) errors.upiId = 'Enter a valid UPI ID, e.g. name@upi';
      break;
    case 'netbanking':
      if (!form.bank) errors.bank = 'Select your bank';
      break;
    case 'wallet':
      if (!form.wallet) errors.wallet = 'Select a wallet';
      break;
  }
  return errors;
}
