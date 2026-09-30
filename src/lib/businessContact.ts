import { normaliseEmail, validateEmail } from './auth';
import { digitsOnly } from './checkout';
import { clearSubmission, createReferenceId, loadSubmission, storeSubmission } from './demoSubmission';

export type BusinessContactForm = {
  name: string;
  email: string;
  company: string;
  size: string;
  jobTitle: string;
  phone: string;
  goal: string;
  message: string;
};

export interface BusinessEnquiry extends BusinessContactForm {
  id: string;
  submittedAt: string;
}

export type ContactField = keyof BusinessContactForm;

export const MESSAGE_MIN_LENGTH = 20;
export const MESSAGE_MAX_LENGTH = 1000;

export const contactFieldOrder: ContactField[] = [
  'name',
  'email',
  'company',
  'size',
  'jobTitle',
  'phone',
  'goal',
  'message',
];

const personalDomains = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.in',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'icloud.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'rediffmail.com',
]);

export function validateWorkEmail(value: string): string | undefined {
  const error = validateEmail(value);
  if (error) return error === 'Email address is required' ? 'Work email is required' : error;
  const domain = normaliseEmail(value).split('@')[1];
  return personalDomains.has(domain) ? 'Please use your work email address' : undefined;
}

export function validateContact(v: BusinessContactForm): Partial<Record<ContactField, string>> {
  const phone = digitsOnly(v.phone);
  const message = v.message.trim();
  return {
    name: v.name.trim().length < 2 ? (v.name.trim() ? 'Enter your full name' : 'Full name is required') : undefined,
    email: validateWorkEmail(v.email),
    company: v.company.trim().length < 2 ? 'Company name is required' : undefined,
    size: v.size ? undefined : 'Select your company size',
    jobTitle: v.jobTitle.trim().length < 2 ? 'Job title is required' : undefined,
    phone: !phone
      ? 'Phone number is required'
      : phone.length !== 10
        ? 'Enter a valid 10-digit phone number'
        : undefined,
    goal: v.goal ? undefined : 'Select a learning goal',
    message: !message
      ? 'Tell us a little about your requirements'
      : message.length < MESSAGE_MIN_LENGTH
        ? `Please write at least ${MESSAGE_MIN_LENGTH} characters`
        : undefined,
  };
}

const STORAGE_KEY = 'hitswork_business_enquiry';

export const loadEnquiry = () => loadSubmission<BusinessEnquiry>(STORAGE_KEY);
export const clearEnquiry = () => clearSubmission(STORAGE_KEY);

export function saveEnquiry(form: BusinessContactForm): BusinessEnquiry {
  return storeSubmission<BusinessEnquiry>(STORAGE_KEY, {
    ...form,
    name: form.name.trim(),
    email: form.email.trim(),
    company: form.company.trim(),
    jobTitle: form.jobTitle.trim(),
    phone: digitsOnly(form.phone),
    message: form.message.trim(),
    id: createReferenceId('HIT-BIZ'),
    submittedAt: new Date().toISOString(),
  });
}
