import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { CalendarCheck, ChevronRight, Loader2, Lock, MessagesSquare, Presentation } from 'lucide-react';
import { businessSolutions, companySizes, learningGoals, planCompanySize, trustedCompanies } from '../../data/business';
import { useAuth } from '../../context/AuthContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useForm } from '../../hooks/useForm';
import { simulateRequest } from '../../lib/auth';
import {
  MESSAGE_MAX_LENGTH,
  MESSAGE_MIN_LENGTH,
  clearEnquiry,
  contactFieldOrder,
  loadEnquiry,
  saveEnquiry,
  validateContact,
  type BusinessContactForm,
  type BusinessEnquiry,
  type ContactField,
} from '../../lib/businessContact';
import { digitsOnly } from '../../lib/checkout';
import { cn } from '../../lib/cn';
import { formatDate } from '../../lib/format';
import { AppLink } from '../../components/ui/AppLink';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';
import { Field, SelectInput, TextArea, TextInput, fieldDescribedBy } from '../../components/ui/Form';
import { PendingStatus, SubmissionSuccess } from '../../components/ui/SubmissionSuccess';

const idFor = (field: ContactField) => `business-${field}`;

const expectations = [
  {
    icon: MessagesSquare,
    title: 'A quick discovery call',
    text: 'We learn about your teams, goals and current training.',
  },
  {
    icon: Presentation,
    title: 'A tailored demo',
    text: 'See the admin dashboard, learning paths and reports in action.',
  },
  {
    icon: CalendarCheck,
    title: 'A plan that fits',
    text: 'Get a proposal matched to your team size and requirements.',
  },
];

function ContactForm({ onSubmitted }: { onSubmitted: (enquiry: BusinessEnquiry) => void }) {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const plan = businessSolutions.find((solution) => solution.id === params.get('plan'));

  const { values, setValue, touch, visibleErrors, attemptSubmit } = useForm<BusinessContactForm>(
    {
      name: user?.name ?? '',
      email: '',
      company: '',
      size: plan ? planCompanySize[plan.id] : '',
      jobTitle: '',
      phone: '',
      goal: '',
      message: '',
    },
    validateContact,
  );
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending || !attemptSubmit(contactFieldOrder, idFor)) return;
    setPending(true);
    await simulateRequest(900);
    onSubmitted(saveEnquiry(values));
  };

  const text = (field: 'name' | 'email' | 'company' | 'jobTitle') => ({
    id: idFor(field),
    value: values[field],
    onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(field, e.target.value),
    onBlur: () => touch(field),
    invalid: !!visibleErrors[field],
    'aria-describedby': fieldDescribedBy(idFor(field), visibleErrors[field]),
  });

  const select = (field: 'size' | 'goal') => ({
    id: idFor(field),
    value: values[field],
    onChange: (e: ChangeEvent<HTMLSelectElement>) => {
      setValue(field, e.target.value);
      touch(field);
    },
    onBlur: () => touch(field),
    invalid: !!visibleErrors[field],
    'aria-describedby': fieldDescribedBy(idFor(field), visibleErrors[field]),
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Request a demo"
      className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-[-0.015em]">Tell us about your organization</h2>
          <p className="mt-1 text-sm text-muted">All fields are required. It takes about 2 minutes.</p>
        </div>
        {plan && (
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
            Interested in: {plan.title}
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id={idFor('name')} label="Full Name" error={visibleErrors.name}>
          <TextInput {...text('name')} autoComplete="name" placeholder="Meera Krishnan" />
        </Field>
        <Field id={idFor('email')} label="Work Email" error={visibleErrors.email}>
          <TextInput
            {...text('email')}
            type="email"
            inputMode="email"
            autoComplete="work email"
            placeholder="you@company.com"
          />
        </Field>
        <Field id={idFor('company')} label="Company Name" error={visibleErrors.company}>
          <TextInput {...text('company')} autoComplete="organization" placeholder="Acme Corp" />
        </Field>
        <Field id={idFor('size')} label="Company Size" error={visibleErrors.size}>
          <SelectInput {...select('size')} placeholder="Select company size" options={companySizes} />
        </Field>
        <Field id={idFor('jobTitle')} label="Job Title" error={visibleErrors.jobTitle}>
          <TextInput {...text('jobTitle')} autoComplete="organization-title" placeholder="Head of L&D" />
        </Field>
        <Field id={idFor('phone')} label="Phone Number" error={visibleErrors.phone}>
          <TextInput
            id={idFor('phone')}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            leading="+91"
            placeholder="98765 43210"
            value={values.phone}
            onChange={(e) => setValue('phone', digitsOnly(e.target.value).slice(0, 10))}
            onBlur={() => touch('phone')}
            invalid={!!visibleErrors.phone}
            aria-describedby={fieldDescribedBy(idFor('phone'), visibleErrors.phone)}
          />
        </Field>
        <Field id={idFor('goal')} label="Learning Goal" error={visibleErrors.goal} className="sm:col-span-2">
          <SelectInput {...select('goal')} placeholder="What would you like to achieve?" options={learningGoals} />
        </Field>
        <Field
          id={idFor('message')}
          label="Message"
          error={visibleErrors.message}
          hint="Team size to train, skills you’re focusing on, timelines…"
          className="sm:col-span-2"
        >
          <TextArea
            id={idFor('message')}
            rows={5}
            maxLength={MESSAGE_MAX_LENGTH}
            placeholder="Tell us about your learning requirements..."
            value={values.message}
            onChange={(e) => setValue('message', e.target.value)}
            onBlur={() => touch('message')}
            invalid={!!visibleErrors.message}
            aria-describedby={fieldDescribedBy(idFor('message'), visibleErrors.message, true)}
          />
          <p
            aria-hidden
            className={cn(
              'mt-1.5 text-right text-xs tabular-nums',
              values.message.trim().length >= MESSAGE_MIN_LENGTH ? 'text-emerald-600' : 'text-muted',
            )}
          >
            {values.message.length} / {MESSAGE_MAX_LENGTH}
          </p>
        </Field>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-muted sm:max-w-xs">
          <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          Demo form — your details stay in this browser and aren’t sent anywhere.
        </p>
        <Button
          type="submit"
          size="lg"
          arrow={!pending}
          disabled={pending}
          aria-busy={pending}
          className="max-sm:w-full"
        >
          {pending ? (
            <>
              <Loader2 aria-hidden className="size-[18px] animate-spin" />
              Sending…
            </>
          ) : (
            'Request a Demo'
          )}
        </Button>
      </div>
    </form>
  );
}

function ContactAside() {
  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <div className="relative isolate overflow-hidden rounded-3xl bg-night p-6 text-white">
        <div aria-hidden className="absolute -top-20 -right-16 -z-10 size-56 rounded-full bg-brand-600/35 blur-3xl" />
        <h2 className="text-lg font-bold text-white">What to expect</h2>
        <ol className="mt-5 space-y-5">
          {expectations.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-200 ring-1 ring-white/15">
                <Icon aria-hidden className="size-5" strokeWidth={1.9} />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-slate-300">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 border-t border-white/10 pt-5 text-sm text-slate-300">
          We usually reply within <span className="font-semibold text-white">1 business day</span>.
        </p>
      </div>

      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <p className="text-sm font-medium text-muted">Trusted by teams building the future</p>
        <ul className="mt-4 grid grid-cols-3 gap-x-4 gap-y-3">
          {trustedCompanies.map((company) => (
            <li key={company.name} className={cn('text-[15px] whitespace-nowrap text-slate-400', company.style)}>
              {company.name}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function BusinessContactPage() {
  usePageMeta(
    'Talk to Our Team — Hitswork for Business',
    'Request a demo of Hitswork for Business and find out how we can support learning across your organization.',
  );
  const [enquiry, setEnquiry] = useState<BusinessEnquiry | null>(loadEnquiry);

  const onSubmitted = (submitted: BusinessEnquiry) => {
    setEnquiry(submitted);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const onReset = () => {
    clearEnquiry();
    setEnquiry(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (enquiry) {
    return (
      <SubmissionSuccess
        title="Thanks for reaching out!"
        message="Our team will review your request and get back to you."
        referenceLabel="Demo Request ID"
        referenceId={enquiry.id}
        details={[
          { label: 'Company', value: enquiry.company },
          { label: 'Team Size', value: enquiry.size },
          { label: 'Submitted', value: formatDate(enquiry.submittedAt.slice(0, 10)) },
          { label: 'Status', value: <PendingStatus>In review</PendingStatus> },
        ]}
        note={
          <>
            We’ll contact <span className="font-semibold break-all text-ink">{enquiry.email}</span> about your{' '}
            {enquiry.goal.toLowerCase()} goals, usually within 1 business day.
          </>
        }
        resetLabel="Submit another request"
        onReset={onReset}
      />
    );
  }

  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-brand-50/80 via-grape-50/30 to-white" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_40%_90%_at_90%_0%,black,transparent)]"
        />
        <Container className="py-8 sm:py-10">
          <nav aria-label="Breadcrumb" className="mb-5 text-sm">
            <ol className="flex items-center gap-1.5 text-muted">
              <li>
                <AppLink href="/business" className="rounded-sm transition-colors hover:text-brand-700">
                  Hitswork for Business
                </AppLink>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="font-medium text-ink">
                Contact
              </li>
            </ol>
          </nav>
          <h1 className="text-[2rem] leading-[1.1] font-extrabold tracking-[-0.03em] sm:text-[2.5rem]">
            Let’s Talk About Your Team
          </h1>
          <p className="mt-2.5 max-w-xl text-[16px] leading-relaxed text-body sm:text-[17px]">
            Share a few details and we’ll set up a demo tailored to your organization’s learning goals.
          </p>
        </Container>
      </header>

      <Container className="grid gap-8 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <ContactForm onSubmitted={onSubmitted} />
        <ContactAside />
      </Container>
    </>
  );
}
