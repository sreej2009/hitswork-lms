import { useCallback, useState, type FormEvent } from 'react';
import { CalendarDays, CheckCircle2, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useForm } from '../hooks/useForm';
import { formatDate } from '../lib/format';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Field, TextInput, fieldDescribedBy } from '../components/ui/Form';
import { PageHeader } from '../components/ui/PageHeader';

type ProfileValues = { name: string };

export function ProfilePage() {
  useDocumentTitle('Profile — Hitswork');
  const { user, updateProfile } = useAuth();
  const validate = useCallback(
    (v: ProfileValues) => ({ name: v.name.trim().length < 2 ? 'Enter your full name' : undefined }),
    [],
  );
  const { values, setValue, touch, visibleErrors, attemptSubmit } = useForm<ProfileValues>(
    { name: user?.name ?? '' },
    validate,
  );
  const [saved, setSaved] = useState(false);
  if (!user) return null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!attemptSubmit(['name'], () => 'profile-name')) return;
    updateProfile({ name: values.name });
    setSaved(true);
  };

  return (
    <>
      <PageHeader title="Profile" subtitle="Manage how you appear on Hitswork." />
      <Container className="py-10 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <section aria-label="Account summary" className="h-fit rounded-3xl border border-line bg-white p-6 text-center shadow-card sm:p-7">
            <Avatar name={user.name} size="xl" className="mx-auto ring-4 ring-brand-50" />
            <p className="mt-4 font-display text-xl font-bold text-ink">{user.name}</p>
            <ul className="mt-4 space-y-2 text-sm text-body">
              <li className="flex items-center justify-center gap-2">
                <Mail aria-hidden className="size-4 text-muted" strokeWidth={2} />
                <span className="truncate">{user.email}</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <CalendarDays aria-hidden className="size-4 text-muted" strokeWidth={2} />
                Member since {formatDate(user.joinedAt.slice(0, 10))}
              </li>
            </ul>
          </section>

          <section aria-labelledby="profile-details" className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-7">
            <h2 id="profile-details" className="text-xl font-bold tracking-[-0.01em]">
              Personal details
            </h2>
            <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field id="profile-name" label="Full Name" error={visibleErrors.name}>
                <TextInput
                  id="profile-name"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => {
                    setValue('name', e.target.value);
                    setSaved(false);
                  }}
                  onBlur={() => touch('name')}
                  invalid={!!visibleErrors.name}
                  aria-describedby={fieldDescribedBy('profile-name', visibleErrors.name)}
                />
              </Field>
              <Field id="profile-email" label="Email Address" hint="Email changes aren’t available in the demo.">
                <TextInput
                  id="profile-email"
                  type="email"
                  value={user.email}
                  disabled
                  aria-describedby={fieldDescribedBy('profile-email', undefined, true)}
                />
              </Field>
              <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                <Button type="submit">Save Changes</Button>
                {saved && (
                  <p role="status" className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                    <CheckCircle2 aria-hidden className="size-4" strokeWidth={2.2} />
                    Profile updated
                  </p>
                )}
              </div>
            </form>
          </section>
        </div>
      </Container>
    </>
  );
}
