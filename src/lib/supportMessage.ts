import { validateEmail } from './auth';
import { clearSubmission, createReferenceId, loadSubmission, storeSubmission } from './demoSubmission';

export type SupportMessageForm = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export interface SupportTicket extends SupportMessageForm {
  id: string;
  submittedAt: string;
}

export type SupportField = keyof SupportMessageForm;

export const SUPPORT_MESSAGE_MIN_LENGTH = 20;
export const SUPPORT_MESSAGE_MAX_LENGTH = 1500;

export const supportFieldOrder: SupportField[] = ['name', 'email', 'topic', 'message'];

export function validateSupportMessage(v: SupportMessageForm): Partial<Record<SupportField, string>> {
  const message = v.message.trim();
  return {
    name: v.name.trim().length < 2 ? (v.name.trim() ? 'Enter your full name' : 'Full name is required') : undefined,
    email: validateEmail(v.email),
    topic: v.topic ? undefined : 'Choose a topic',
    message: !message
      ? 'Tell us how we can help'
      : message.length < SUPPORT_MESSAGE_MIN_LENGTH
        ? `Please add a little more detail (at least ${SUPPORT_MESSAGE_MIN_LENGTH} characters)`
        : undefined,
  };
}

const STORAGE_KEY = 'hitswork_support_ticket';

export const loadTicket = () => loadSubmission<SupportTicket>(STORAGE_KEY);
export const clearTicket = () => clearSubmission(STORAGE_KEY);

export function saveTicket(form: SupportMessageForm): SupportTicket {
  return storeSubmission<SupportTicket>(STORAGE_KEY, {
    name: form.name.trim(),
    email: form.email.trim(),
    topic: form.topic,
    message: form.message.trim(),
    id: createReferenceId('HIT-SUP'),
    submittedAt: new Date().toISOString(),
  });
}
