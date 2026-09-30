import { useCallback, useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2, Mail, CalendarDays } from 'lucide-react';
import { AuthError, useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { profileCountries } from '../../data/users';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useForm } from '../../hooks/useForm';
import { MIN_PASSWORD_LENGTH, validateEmail, validatePassword } from '../../lib/auth';
import { digitsOnly } from '../../lib/checkout';
import { PasswordInput } from '../../components/auth/AuthFields';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DashboardCard } from '../../components/dashboard/Widgets';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Field, SelectInput, TextInput, fieldDescribedBy } from '../../components/ui/Form';

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

function SavedMessage({ children }: { children: string }) {
  return (
    <p role="status" className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
      <CheckCircle2 aria-hidden className="size-4" strokeWidth={2.2} />
      {children}
    </p>
  );
}

type DetailsValues = { name: string; email: string; phone: string; country: string };

function DetailsForm() {
  const { user, updateProfile } = useAuth();
  const validate = useCallback(
    (v: DetailsValues) => ({
      name: v.name.trim().length < 2 ? 'Enter your full name' : undefined,
      email: validateEmail(v.email),
      phone: v.phone && !/^\d{7,15}$/.test(v.phone) ? 'Enter a valid phone number' : undefined,
    }),
    [],
  );
  const { values, setValue, touch, visibleErrors, attemptSubmit } = useForm<DetailsValues>(
    { name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '', country: user?.country ?? 'India' },
    validate,
  );
  const [saved, setSaved] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const change = <K extends keyof DetailsValues>(field: K, value: DetailsValues[K]) => {
    setValue(field, value);
    setSaved(false);
    if (field === 'email') setEmailError(null);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!attemptSubmit(['name', 'email', 'phone'], (f) => `profile-${String(f)}`)) return;
    try {
      updateProfile(values);
      setSaved(true);
    } catch (error) {
      if (error instanceof AuthError) setEmailError(error.message);
      else throw error;
    }
  };

  const emailMessage = visibleErrors.email ?? emailError ?? undefined;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field id="profile-name" label="Full Name" error={visibleErrors.name}>
        <TextInput
          id="profile-name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => change('name', e.target.value)}
          onBlur={() => touch('name')}
          invalid={!!visibleErrors.name}
          aria-describedby={fieldDescribedBy('profile-name', visibleErrors.name)}
        />
      </Field>
      <Field id="profile-email" label="Email" error={emailMessage}>
        <TextInput
          id="profile-email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => change('email', e.target.value)}
          onBlur={() => touch('email')}
          invalid={!!emailMessage}
          aria-describedby={fieldDescribedBy('profile-email', emailMessage)}
        />
      </Field>
      <Field id="profile-phone" label="Phone" error={visibleErrors.phone} optional>
        <TextInput
          id="profile-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={values.phone}
          onChange={(e) => change('phone', digitsOnly(e.target.value).slice(0, 15))}
          onBlur={() => touch('phone')}
          invalid={!!visibleErrors.phone}
          aria-describedby={fieldDescribedBy('profile-phone', visibleErrors.phone)}
        />
      </Field>
      <Field id="profile-country" label="Country">
        <SelectInput
          id="profile-country"
          autoComplete="country-name"
          options={profileCountries}
          value={values.country}
          onChange={(e) => change('country', e.target.value)}
        />
      </Field>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Button type="submit">Save Changes</Button>
        {saved && <SavedMessage>Profile updated</SavedMessage>}
      </div>
    </form>
  );
}

type PasswordValues = { current: string; next: string; confirm: string };

function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const validate = useCallback(
    (v: PasswordValues) => ({
      current: v.current ? undefined : 'Enter your current password',
      next: validatePassword(v.next) ?? (v.next && v.next === v.current ? 'Choose a password you haven’t used here' : undefined),
      confirm: !v.confirm ? 'Confirm your new password' : v.confirm !== v.next ? 'Passwords don’t match' : undefined,
    }),
    [],
  );
  const { values, setValue, touch, visibleErrors, attemptSubmit, reset } = useForm<PasswordValues>(
    { current: '', next: '', confirm: '' },
    validate,
  );
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);
    setSaved(false);
    if (!attemptSubmit(['current', 'next', 'confirm'], (f) => `password-${String(f)}`)) return;
    setPending(true);
    try {
      await changePassword(values.current, values.next);
      setSaved(true);
      reset();
    } catch (error) {
      if (error instanceof AuthError) {
        setServerError(error.message);
        document.getElementById('password-current')?.focus();
      } else throw error;
    } finally {
      setPending(false);
    }
  };

  const currentError = visibleErrors.current ?? serverError ?? undefined;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field id="password-current" label="Current Password" error={currentError} className="sm:col-span-2 sm:max-w-[calc(50%-0.625rem)]">
        <PasswordInput
          id="password-current"
          autoComplete="current-password"
          value={values.current}
          onChange={(e) => setValue('current', e.target.value)}
          onBlur={() => touch('current')}
          invalid={!!currentError}
          aria-describedby={fieldDescribedBy('password-current', currentError)}
        />
      </Field>
      <Field id="password-next" label="New Password" error={visibleErrors.next} hint={`At least ${MIN_PASSWORD_LENGTH} characters`}>
        <PasswordInput
          id="password-next"
          autoComplete="new-password"
          value={values.next}
          onChange={(e) => setValue('next', e.target.value)}
          onBlur={() => touch('next')}
          invalid={!!visibleErrors.next}
          aria-describedby={fieldDescribedBy('password-next', visibleErrors.next, true)}
        />
      </Field>
      <Field id="password-confirm" label="Confirm New Password" error={visibleErrors.confirm}>
        <PasswordInput
          id="password-confirm"
          autoComplete="new-password"
          value={values.confirm}
          onChange={(e) => setValue('confirm', e.target.value)}
          onBlur={() => touch('confirm')}
          invalid={!!visibleErrors.confirm}
          aria-describedby={fieldDescribedBy('password-confirm', visibleErrors.confirm)}
        />
      </Field>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <Button type="submit" variant="secondary" disabled={pending} aria-busy={pending}>
          {pending && <Loader2 aria-hidden className="size-[18px] animate-spin" />}
          {pending ? 'Updating…' : 'Update Password'}
        </Button>
        {saved && <SavedMessage>Password updated</SavedMessage>}
      </div>
    </form>
  );
}

export function ProfilePage() {
  useDocumentTitle('My Profile — Hitswork');
  const { user } = useAuth();
  const { stats } = useLearning();
  if (!user) return null;

  return (
    <>
      <DashboardHeader title="My Profile" subtitle="Manage your personal details and password." />
      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <DashboardCard className="h-fit text-center">
          <Avatar name={user.name} size="xl" className="mx-auto ring-4 ring-brand-50" />
          <p className="mt-4 font-display text-xl font-bold text-ink">{user.name}</p>
          <ul className="mt-3 space-y-2 text-sm text-body">
            <li className="flex items-center justify-center gap-2">
              <Mail aria-hidden className="size-4 shrink-0 text-muted" strokeWidth={2} />
              <span className="truncate">{user.email}</span>
            </li>
            <li className="flex items-center justify-center gap-2">
              <CalendarDays aria-hidden className="size-4 shrink-0 text-muted" strokeWidth={2} />
              Learning since {monthYear.format(new Date(user.joinedAt))}
            </li>
          </ul>
          <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5 text-left">
            <div className="rounded-xl bg-canvas px-3 py-2.5 ring-1 ring-line">
              <dt className="text-xs text-muted">Courses</dt>
              <dd className="font-display text-lg font-bold text-ink">{stats.completedCourses + stats.inProgressCourses}</dd>
            </div>
            <div className="rounded-xl bg-canvas px-3 py-2.5 ring-1 ring-line">
              <dt className="text-xs text-muted">Certificates</dt>
              <dd className="font-display text-lg font-bold text-ink">{stats.certificates}</dd>
            </div>
          </dl>
        </DashboardCard>

        <div className="space-y-6">
          <DashboardCard>
            <h2 className="text-lg font-bold tracking-[-0.01em]">Personal details</h2>
            <div className="mt-5">
              <DetailsForm />
            </div>
          </DashboardCard>
          <DashboardCard>
            <h2 className="text-lg font-bold tracking-[-0.01em]">Change Password</h2>
            <p className="mt-1 text-sm text-body">Use at least {MIN_PASSWORD_LENGTH} characters with a mix of letters and numbers.</p>
            <div className="mt-5">
              <ChangePasswordForm />
            </div>
          </DashboardCard>
        </div>
      </div>
    </>
  );
}
