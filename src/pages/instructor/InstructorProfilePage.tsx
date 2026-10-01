import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';
import { Check, ExternalLink, Loader2, Star, Users } from 'lucide-react';
import { SPECIALIZATION_OPTIONS } from '../../data/instructor';
import { useAuth } from '../../context/AuthContext';
import { useInstructor, type ProfileInput } from '../../context/InstructorContext';
import { useStore } from '../../context/StoreContext';
import { useForm } from '../../hooks/useForm';
import { usePageMeta } from '../../hooks/usePageMeta';
import { simulateRequest } from '../../lib/auth';
import { cn } from '../../lib/cn';
import { formatCompact } from '../../lib/format';
import { InstructorHeader, Panel } from '../../components/instructor/InstructorChrome';
import { InstructorProfileCard, instructorProfileSlug } from '../../components/instructor/InstructorProfileCard';
import { AppLink } from '../../components/ui/AppLink';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Field, TextArea, TextInput, fieldDescribedBy } from '../../components/ui/Form';

type ProfileValues = ProfileInput;
type ProfileField = keyof ProfileValues;

const HEADLINE_MAX = 80;
const BIO_MAX = 1000;
const MAX_SPECIALIZATIONS = 6;
const fieldOrder: ProfileField[] = ['name', 'headline', 'bio', 'website', 'linkedin', 'specializations'];
const idFor = (field: ProfileField) => `instructor-profile-${field}`;

const isUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

function validate(v: ProfileValues): Partial<Record<ProfileField, string>> {
  return {
    name: v.name.trim().length < 2 ? 'Enter your full name' : undefined,
    headline: !v.headline.trim()
      ? 'Add a short headline'
      : v.headline.length > HEADLINE_MAX
        ? `Keep it under ${HEADLINE_MAX} characters`
        : undefined,
    bio: v.bio.trim().length < 30 ? 'Write at least 30 characters about yourself' : undefined,
    website: v.website && !isUrl(v.website) ? 'Enter a full URL, e.g. https://yoursite.com' : undefined,
    linkedin:
      v.linkedin && (!isUrl(v.linkedin) || !/linkedin\.com/i.test(v.linkedin))
        ? 'Enter your LinkedIn profile URL'
        : undefined,
    specializations: v.specializations.length === 0 ? 'Choose at least one specialization' : undefined,
  };
}

export function InstructorProfilePage() {
  usePageMeta('Instructor Profile — Hitswork', 'Edit how learners see you on Hitswork.');
  const { user } = useAuth();
  const { instructor, courses, updateProfile } = useInstructor();
  const { notify } = useStore();
  const validateProfile = useCallback(validate, []);
  const initial: ProfileValues = {
    name: instructor?.name ?? '',
    headline: instructor?.headline ?? '',
    bio: instructor?.bio ?? '',
    website: instructor?.website ?? '',
    linkedin: instructor?.linkedin ?? '',
    specializations: instructor?.specializations ?? [],
  };
  const { values, setValue, touch, visibleErrors, attemptSubmit } = useForm<ProfileValues>(initial, validateProfile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<ProfileValues>(initial);
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  if (!instructor) return null;
  const publishedCount = courses.filter((course) => course.status === 'Published').length;

  const toggleSpecialization = (item: string) => {
    const has = values.specializations.includes(item);
    if (!has && values.specializations.length >= MAX_SPECIALIZATIONS) return;
    setValue(
      'specializations',
      has ? values.specializations.filter((s) => s !== item) : [...values.specializations, item],
    );
    touch('specializations');
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || !attemptSubmit(fieldOrder, idFor)) return;
    setSaving(true);
    await simulateRequest(600);
    const clean: ProfileValues = {
      ...values,
      name: values.name.trim(),
      headline: values.headline.trim(),
      bio: values.bio.trim(),
      website: values.website.trim(),
      linkedin: values.linkedin.trim(),
    };
    updateProfile(clean);
    setSaved(clean);
    setSaving(false);
    notify('Instructor profile saved');
  };

  const text = (field: 'name' | 'headline' | 'website' | 'linkedin') => ({
    id: idFor(field),
    value: values[field],
    onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(field, e.target.value),
    onBlur: () => touch(field),
    invalid: !!visibleErrors[field],
    'aria-describedby': fieldDescribedBy(idFor(field), visibleErrors[field]),
  });

  return (
    <>
      <InstructorHeader title="Instructor Profile" subtitle="This is how learners see you on Hitswork." />

      <section className="relative isolate mb-6 overflow-hidden rounded-[20px] border border-line bg-white p-5 shadow-card sm:p-6">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-20 bg-linear-to-r from-brand-50 via-grape-50 to-brand-50"
        />
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="rounded-full bg-white p-1 ring-1 ring-line [width:fit-content]">
            <Avatar name={instructor.name} size="xl" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-2xl font-bold tracking-[-0.02em]">{instructor.name}</h2>
            <p className="mt-0.5 text-sm font-medium text-brand-700">Instructor</p>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-body">
              <span className="inline-flex items-center gap-1.5">
                <Star aria-hidden className="size-4 text-amber-400" fill="currentColor" strokeWidth={0} />
                <span className="font-semibold text-ink">{instructor.rating.toFixed(1)}</span> Rating
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users aria-hidden className="size-4 text-brand-500" />
                <span className="font-semibold text-ink">{formatCompact(instructor.students)}+</span> Students
              </span>
            </div>
          </div>
          <Button
            href={`/instructors/${instructorProfileSlug(instructor.name)}`}
            variant="secondary"
            arrow
            className="max-sm:w-full"
          >
            View Public Profile
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Panel title="Profile details" titleId="profile-details-title">
          <form onSubmit={onSubmit} noValidate aria-labelledby="profile-details-title" className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={idFor('name')} label="Full Name" error={visibleErrors.name}>
                <TextInput {...text('name')} autoComplete="name" />
              </Field>
              <Field
                id="instructor-profile-email"
                label="Email"
                hint={
                  <>
                    Your sign-in email. Change it in{' '}
                    <AppLink href="/profile" className="font-semibold text-brand-600 hover:text-brand-700">
                      account settings
                    </AppLink>
                    .
                  </>
                }
              >
                <TextInput
                  id="instructor-profile-email"
                  value={user?.email ?? instructor.email}
                  readOnly
                  disabled
                  aria-describedby="instructor-profile-email-hint"
                />
              </Field>
            </div>

            <Field
              id={idFor('headline')}
              label="Headline"
              error={visibleErrors.headline}
              hint={`${values.headline.length}/${HEADLINE_MAX} · e.g. “Full Stack Developer & Lead Instructor”`}
            >
              <TextInput
                {...text('headline')}
                maxLength={HEADLINE_MAX + 20}
                aria-describedby={fieldDescribedBy(idFor('headline'), visibleErrors.headline, true)}
              />
            </Field>

            <Field
              id={idFor('bio')}
              label="Bio"
              error={visibleErrors.bio}
              hint={`${values.bio.length}/${BIO_MAX} · Your experience, teaching style and who your courses are for.`}
            >
              <TextArea
                id={idFor('bio')}
                rows={6}
                maxLength={BIO_MAX}
                value={values.bio}
                onChange={(e) => setValue('bio', e.target.value)}
                onBlur={() => touch('bio')}
                invalid={!!visibleErrors.bio}
                aria-describedby={fieldDescribedBy(idFor('bio'), visibleErrors.bio, true)}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id={idFor('website')} label="Website" optional error={visibleErrors.website}>
                <TextInput {...text('website')} type="url" inputMode="url" placeholder="https://" />
              </Field>
              <Field id={idFor('linkedin')} label="LinkedIn" optional error={visibleErrors.linkedin}>
                <TextInput
                  {...text('linkedin')}
                  type="url"
                  inputMode="url"
                  placeholder="https://www.linkedin.com/in/"
                />
              </Field>
            </div>

            <fieldset>
              <legend className="mb-1.5 flex w-full items-baseline justify-between text-sm font-medium text-ink">
                Specialization
                <span className="text-xs font-normal text-muted">
                  {values.specializations.length}/{MAX_SPECIALIZATIONS} selected
                </span>
              </legend>
              <div id={idFor('specializations')} tabIndex={-1} className="flex flex-wrap gap-2 outline-none">
                {SPECIALIZATION_OPTIONS.map((item) => {
                  const selected = values.specializations.includes(item);
                  const full = !selected && values.specializations.length >= MAX_SPECIALIZATIONS;
                  return (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={selected}
                      disabled={full}
                      onClick={() => toggleSpecialization(item)}
                      className={cn(
                        'inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                        selected
                          ? 'bg-brand-gradient text-white shadow-brand'
                          : 'bg-white text-body ring-1 ring-line-strong hover:text-ink hover:ring-brand-200',
                      )}
                    >
                      {selected && <Check aria-hidden className="size-3.5" strokeWidth={3} />}
                      {item}
                    </button>
                  );
                })}
              </div>
              {visibleErrors.specializations && (
                <p className="mt-1.5 text-xs font-medium text-rose-600">{visibleErrors.specializations}</p>
              )}
            </fieldset>

            <div className="flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted" aria-live="polite">
                {dirty ? 'You have unsaved changes.' : 'All changes saved.'}
              </p>
              <Button type="submit" disabled={saving || !dirty} aria-busy={saving} className="max-sm:w-full">
                {saving ? (
                  <>
                    <Loader2 aria-hidden className="size-[18px] animate-spin" />
                    Saving…
                  </>
                ) : (
                  'Save Profile'
                )}
              </Button>
            </div>
          </form>
        </Panel>

        <div className="space-y-3 xl:sticky xl:top-6 xl:self-start">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-ink">Public Profile Preview</h2>
            <AppLink
              href={`/instructors/${instructorProfileSlug(instructor.name)}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Open
              <ExternalLink aria-hidden className="size-3.5" />
            </AppLink>
          </div>
          <InstructorProfileCard
            profile={{ ...values, rating: instructor.rating, students: instructor.students }}
            courseCount={publishedCount}
          />
          <p className="text-xs text-muted">The preview updates as you type. Save to publish your changes.</p>
        </div>
      </div>
    </>
  );
}
