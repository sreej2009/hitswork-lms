import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ChevronRight, CircleCheck, Loader2, Quote } from 'lucide-react';
import { applicationNextSteps, experienceOptions, featuredInstructors, teachingCategories } from '../../data/teach';
import { useAuth } from '../../context/AuthContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useForm } from '../../hooks/useForm';
import { simulateRequest } from '../../lib/auth';
import { digitsOnly } from '../../lib/checkout';
import { formatDate } from '../../lib/format';
import {
  ABOUT_MAX_LENGTH,
  ABOUT_MIN_LENGTH,
  applicationFieldOrder,
  clearApplication,
  loadApplication,
  saveApplication,
  validateApplication,
  type ApplicationField,
  type InstructorApplication,
  type InstructorApplicationForm,
} from '../../lib/instructorApplication';
import { cn } from '../../lib/cn';
import { AppLink } from '../../components/ui/AppLink';
import { Button } from '../../components/ui/Button';
import { Container } from '../../components/ui/Container';
import { Checkbox, Field, SelectInput, TextArea, TextInput, fieldDescribedBy } from '../../components/ui/Form';
import { SmartImage } from '../../components/ui/SmartImage';
import { PendingStatus, SubmissionSuccess } from '../../components/ui/SubmissionSuccess';

const idFor = (field: ApplicationField) => `instructor-${field}`;

function ApplicationForm({ onSubmitted }: { onSubmitted: (application: InstructorApplication) => void }) {
  const { user } = useAuth();
  const { values, setValue, touch, visibleErrors, attemptSubmit } = useForm<InstructorApplicationForm>(
    {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ? digitsOnly(user.phone).slice(-10) : '',
      expertise: '',
      experience: '',
      category: '',
      about: '',
      terms: false,
    },
    validateApplication,
  );
  const [pending, setPending] = useState(false);
  const aboutLength = values.about.trim().length;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending || !attemptSubmit(applicationFieldOrder, idFor)) return;
    setPending(true);
    await simulateRequest(900);
    onSubmitted(saveApplication(values));
  };

  const text = (field: 'name' | 'email' | 'expertise') => ({
    id: idFor(field),
    value: values[field],
    onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(field, e.target.value),
    onBlur: () => touch(field),
    invalid: !!visibleErrors[field],
    'aria-describedby': fieldDescribedBy(idFor(field), visibleErrors[field]),
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Instructor application"
      className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-8"
    >
      <div className="border-b border-line pb-5">
        <h2 className="text-xl font-bold tracking-[-0.015em]">Your details</h2>
        <p className="mt-1 text-sm text-muted">It takes about 3 minutes. All fields are required.</p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id={idFor('name')} label="Full Name" error={visibleErrors.name}>
          <TextInput {...text('name')} autoComplete="name" placeholder="Ananya Sharma" />
        </Field>

        <Field id={idFor('email')} label="Email" error={visibleErrors.email}>
          <TextInput
            {...text('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </Field>

        <Field id={idFor('phone')} label="Phone" error={visibleErrors.phone}>
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

        <Field id={idFor('expertise')} label="Expertise" error={visibleErrors.expertise}>
          <TextInput {...text('expertise')} placeholder="e.g. React, UI Design, SEO" />
        </Field>

        <Field id={idFor('experience')} label="Years of Experience" error={visibleErrors.experience}>
          <SelectInput
            id={idFor('experience')}
            placeholder="Select experience"
            options={experienceOptions}
            value={values.experience}
            onChange={(e) => {
              setValue('experience', e.target.value);
              touch('experience');
            }}
            onBlur={() => touch('experience')}
            invalid={!!visibleErrors.experience}
            aria-describedby={fieldDescribedBy(idFor('experience'), visibleErrors.experience)}
          />
        </Field>

        <Field id={idFor('category')} label="Primary Teaching Category" error={visibleErrors.category}>
          <SelectInput
            id={idFor('category')}
            placeholder="Select a category"
            options={teachingCategories}
            value={values.category}
            onChange={(e) => {
              setValue('category', e.target.value);
              touch('category');
            }}
            onBlur={() => touch('category')}
            invalid={!!visibleErrors.category}
            aria-describedby={fieldDescribedBy(idFor('category'), visibleErrors.category)}
          />
        </Field>

        <Field
          id={idFor('about')}
          label="About Your Expertise"
          error={visibleErrors.about}
          hint={`Share your background, what you’d like to teach and who it’s for (min. ${ABOUT_MIN_LENGTH} characters).`}
          className="sm:col-span-2"
        >
          <TextArea
            id={idFor('about')}
            rows={5}
            maxLength={ABOUT_MAX_LENGTH}
            placeholder="Tell us about your expertise..."
            value={values.about}
            onChange={(e) => setValue('about', e.target.value)}
            onBlur={() => touch('about')}
            invalid={!!visibleErrors.about}
            aria-describedby={fieldDescribedBy(idFor('about'), visibleErrors.about, true)}
          />
          <p
            aria-hidden
            className={cn(
              'mt-1.5 text-right text-xs tabular-nums',
              aboutLength >= ABOUT_MIN_LENGTH ? 'text-emerald-600' : 'text-muted',
            )}
          >
            {values.about.length} / {ABOUT_MAX_LENGTH}
          </p>
        </Field>
      </div>

      <div className="mt-6">
        <Checkbox
          id={idFor('terms')}
          checked={values.terms}
          onChange={(e) => setValue('terms', e.target.checked)}
          invalid={!!visibleErrors.terms}
          aria-describedby={visibleErrors.terms ? `${idFor('terms')}-error` : undefined}
        >
          I agree to the{' '}
          <AppLink href="/terms" className="font-semibold text-brand-600 hover:text-brand-700">
            Instructor Terms
          </AppLink>
          .
        </Checkbox>
        {visibleErrors.terms && (
          <p id={`${idFor('terms')}-error`} className="mt-1.5 pl-8 text-xs font-medium text-rose-600">
            {visibleErrors.terms}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted sm:max-w-xs">
          Demo application — details are saved only in this browser.
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
              Submitting…
            </>
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </form>
  );
}

function ApplicationAside() {
  const mentor = featuredInstructors[1];
  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
        <h2 className="text-lg font-bold">What happens next?</h2>
        <ol className="mt-5 space-y-5">
          {applicationNextSteps.map(({ title, description, icon: Icon }, index) => (
            <li key={title} className="relative flex gap-4">
              {index < applicationNextSteps.length - 1 && (
                <span aria-hidden className="absolute top-11 bottom-[-1.25rem] left-5 w-px bg-line" />
              )}
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon aria-hidden className="size-5" strokeWidth={1.9} />
              </span>
              <div>
                <p className="font-semibold text-ink">{title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-body">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <figure className="relative overflow-hidden rounded-3xl bg-brand-gradient p-6 text-white">
        <div aria-hidden className="absolute -top-16 -right-16 size-48 rounded-full bg-white/10 blur-2xl" />
        <Quote aria-hidden className="size-6 text-white/40" fill="currentColor" strokeWidth={0} />
        <blockquote className="mt-3 text-[15px] leading-relaxed text-white/90">“{mentor.quote}”</blockquote>
        <figcaption className="mt-5 flex items-center gap-3">
          <SmartImage
            photoId={mentor.photoId}
            alt=""
            width={44}
            ratio={1}
            widths={[44, 88]}
            sizes="44px"
            crop="faces"
            className="size-11 rounded-full ring-2 ring-white/40"
          />
          <div className="text-sm leading-tight">
            <p className="font-semibold">{mentor.name}</p>
            <p className="mt-0.5 text-white/70">{mentor.specialization}</p>
          </div>
        </figcaption>
      </figure>

      <ul className="space-y-2.5 px-1 text-sm text-body">
        {[
          'Free to publish — no upfront fees',
          'Keep full ownership of your content',
          'Dedicated instructor support',
        ].map((point) => (
          <li key={point} className="flex items-center gap-2.5">
            <CircleCheck aria-hidden className="size-[18px] shrink-0 text-emerald-500" strokeWidth={2.2} />
            {point}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function TeachRegisterPage() {
  usePageMeta(
    'Become an Instructor — Hitswork',
    'Apply to teach on Hitswork. Share your expertise, create online courses and reach learners worldwide.',
  );
  const [application, setApplication] = useState<InstructorApplication | null>(loadApplication);

  const onSubmitted = (submitted: InstructorApplication) => {
    setApplication(submitted);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const onReset = () => {
    clearApplication();
    setApplication(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (application) {
    return (
      <SubmissionSuccess
        title="Application Received"
        message="Thanks for your interest in teaching on Hitswork. We’ll review your instructor application and get back to you."
        referenceLabel="Application ID"
        referenceId={application.id}
        details={[
          { label: 'Name', value: application.name },
          { label: 'Category', value: application.category },
          { label: 'Submitted', value: formatDate(application.submittedAt.slice(0, 10)) },
          { label: 'Status', value: <PendingStatus>Under review</PendingStatus> },
        ]}
        note={
          <>
            We’ll email updates to <span className="font-semibold break-all text-ink">{application.email}</span>.
            Reviews usually take 3–5 working days.
          </>
        }
        resetLabel="Submit a different application"
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
                <AppLink href="/teach" className="rounded-sm transition-colors hover:text-brand-700">
                  Teach on Hitswork
                </AppLink>
              </li>
              <li aria-hidden>
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="font-medium text-ink">
                Apply
              </li>
            </ol>
          </nav>
          <h1 className="text-[2rem] leading-[1.1] font-extrabold tracking-[-0.03em] sm:text-[2.5rem]">
            Become a Hitswork Instructor
          </h1>
          <p className="mt-2.5 max-w-xl text-[16px] leading-relaxed text-body sm:text-[17px]">
            Tell us about yourself and what you’d love to teach. Our team reviews every application personally.
          </p>
        </Container>
      </header>

      <Container className="grid gap-8 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <ApplicationForm onSubmitted={onSubmitted} />
        <ApplicationAside />
      </Container>
    </>
  );
}
