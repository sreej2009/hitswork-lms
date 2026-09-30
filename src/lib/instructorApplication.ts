import { validateEmail } from './auth';
import { digitsOnly } from './checkout';
import { clearSubmission, createReferenceId, loadSubmission, storeSubmission } from './demoSubmission';

export type InstructorApplicationForm = {
  name: string;
  email: string;
  phone: string;
  expertise: string;
  experience: string;
  category: string;
  about: string;
  terms: boolean;
};

export interface InstructorApplication extends Omit<InstructorApplicationForm, 'terms'> {
  id: string;
  submittedAt: string;
  status: 'under-review';
}

export type ApplicationField = keyof InstructorApplicationForm;

export const ABOUT_MIN_LENGTH = 50;
export const ABOUT_MAX_LENGTH = 1000;

export const applicationFieldOrder: ApplicationField[] = [
  'name',
  'email',
  'phone',
  'expertise',
  'experience',
  'category',
  'about',
  'terms',
];

export function validateApplication(v: InstructorApplicationForm): Partial<Record<ApplicationField, string>> {
  const phone = digitsOnly(v.phone);
  const about = v.about.trim();
  return {
    name: v.name.trim().length < 2 ? (v.name.trim() ? 'Enter your full name' : 'Full name is required') : undefined,
    email: validateEmail(v.email),
    phone: !phone
      ? 'Phone number is required'
      : phone.length !== 10
        ? 'Enter a valid 10-digit mobile number'
        : undefined,
    expertise: v.expertise.trim().length < 2 ? 'Tell us your area of expertise' : undefined,
    experience: v.experience ? undefined : 'Select your years of experience',
    category: v.category ? undefined : 'Select a teaching category',
    about: !about
      ? 'Tell us a little about your expertise'
      : about.length < ABOUT_MIN_LENGTH
        ? `Please write at least ${ABOUT_MIN_LENGTH} characters (${about.length}/${ABOUT_MIN_LENGTH})`
        : undefined,
    terms: v.terms ? undefined : 'Please accept the Instructor Terms to continue',
  };
}

const STORAGE_KEY = 'hitswork_instructor_application';

export const loadApplication = () => loadSubmission<InstructorApplication>(STORAGE_KEY);
export const clearApplication = () => clearSubmission(STORAGE_KEY);

export function saveApplication(form: InstructorApplicationForm): InstructorApplication {
  const { terms: _terms, ...details } = form;
  return storeSubmission<InstructorApplication>(STORAGE_KEY, {
    ...details,
    name: details.name.trim(),
    email: details.email.trim(),
    phone: digitsOnly(details.phone),
    expertise: details.expertise.trim(),
    about: details.about.trim(),
    id: createReferenceId('HIT-INS'),
    submittedAt: new Date().toISOString(),
    status: 'under-review',
  });
}
