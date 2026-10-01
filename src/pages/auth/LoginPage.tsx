import { useCallback, useState, type FormEvent } from 'react';
import { useLocation, useSearchParams, type Location } from 'react-router';
import { AlertCircle, Info, Loader2, Presentation, Sparkles } from 'lucide-react';
import { AuthError, useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useForm } from '../../hooks/useForm';
import { DEMO_ACCOUNT, DEMO_ADMIN, DEMO_INSTRUCTOR, firstName, validateEmail, validatePassword } from '../../lib/auth';
import { AuthDivider, PasswordInput, SocialButtons } from '../../components/auth/AuthFields';
import { AuthShell } from '../../components/auth/AuthShell';
import { AppLink } from '../../components/ui/AppLink';
import { Button } from '../../components/ui/Button';
import { Checkbox, Field, TextInput, fieldDescribedBy } from '../../components/ui/Form';
import { SegmentedControl } from '../../components/ui/SegmentedControl';

type LoginValues = { email: string; password: string; remember: boolean };
type Role = 'learner' | 'instructor';

const roleOptions: { value: Role; label: string }[] = [
  { value: 'learner', label: 'I’m a Learner' },
  { value: 'instructor', label: 'I’m an Instructor' },
];
const idFor = (field: keyof LoginValues) => `login-${field}`;

export function LoginPage() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const from = (location.state as { from?: Location } | null)?.from;
  // Instructor sign-in: /login?as=instructor (or /instructor/login), or being sent here from an instructor page.
  const role: Role =
    params.get('as') === 'instructor' || from?.pathname.startsWith('/instructor') ? 'instructor' : 'learner';
  const instructor = role === 'instructor';
  // Admin sign-in (/login?as=admin or /admin/login) is not offered in the role switch.
  const admin = params.get('as') === 'admin' || !!from?.pathname.startsWith('/admin');
  const demo = admin ? DEMO_ADMIN : instructor ? DEMO_INSTRUCTOR : DEMO_ACCOUNT;
  useDocumentTitle(
    admin ? 'Admin Sign In — Hitswork' : instructor ? 'Instructor Sign In — Hitswork' : 'Sign In — Hitswork',
  );
  const { login } = useAuth();
  const { notify } = useStore();
  const validate = useCallback(
    (v: LoginValues) => ({ email: validateEmail(v.email), password: validatePassword(v.password) }),
    [],
  );
  const { values, setValue, touch, visibleErrors, attemptSubmit } = useForm<LoginValues>(
    { email: '', password: '', remember: true },
    validate,
  );
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<AuthError | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const changeRole = (next: Role) => {
    setFormError(null);
    // Keep any "return to" page; the role only changes where a plain sign-in lands.
    setParams(next === 'instructor' ? { as: 'instructor' } : {}, { replace: true, state: location.state });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    if (!attemptSubmit(['email', 'password'], idFor)) return;
    setPending(true);
    try {
      const user = await login(values.email, values.password, values.remember);
      notify(`Welcome back, ${firstName(user.name)}`);
      // <GuestOnly> redirects to the dashboard (or the page that asked for sign-in).
    } catch (error) {
      setPending(false);
      if (error instanceof AuthError) {
        setFormError(error);
        if (error.field) document.getElementById(idFor(error.field))?.focus();
      } else throw error;
    }
  };

  return (
    <AuthShell
      title={admin ? 'Admin sign in' : instructor ? 'Instructor sign in' : 'Welcome back'}
      subtitle={
        admin
          ? 'Sign in to manage the Hitswork platform.'
          : instructor
            ? 'Sign in to manage your courses, students and earnings.'
            : 'Sign in to continue learning with Hitswork.'
      }
      footer={
        instructor ? (
          <>
            New to teaching on Hitswork?{' '}
            <AppLink href="/teach/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Apply to teach
            </AppLink>
          </>
        ) : (
          <>
            Don’t have an account?{' '}
            <AppLink href="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Create an account
            </AppLink>
          </>
        )
      }
    >
      {!admin && (
        <div className="mb-5">
          <SegmentedControl
            label="Sign in as"
            options={roleOptions}
            value={role}
            onChange={changeRole}
            className="w-full"
          />
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-xs">
            {instructor ? (
              <Presentation aria-hidden className="size-[18px]" strokeWidth={2} />
            ) : (
              <Sparkles aria-hidden className="size-[18px]" strokeWidth={2} />
            )}
          </span>
          <div className="min-w-0 text-sm">
            <p className="font-semibold text-ink">
              {admin ? 'Demo admin account' : instructor ? 'Demo instructor account' : 'Try the demo account'}
            </p>
            <p className="mt-0.5 flex flex-wrap gap-x-1.5 text-body">
              <span className="font-medium break-all text-ink">{demo.email}</span>
              <span aria-hidden>·</span>
              <span className="font-medium whitespace-nowrap text-ink">{demo.password}</span>
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="shrink-0"
          onClick={() => {
            setValue('email', demo.email);
            setValue('password', demo.password);
            setFormError(null);
            document.getElementById(idFor('password'))?.focus();
          }}
        >
          {admin ? 'Use demo admin' : instructor ? 'Use demo instructor' : 'Use demo account'}
        </Button>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-5"
        aria-label={instructor ? 'Instructor sign in' : 'Sign in'}
      >
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-800"
          >
            <AlertCircle aria-hidden className="mt-0.5 size-[18px] shrink-0 text-rose-600" strokeWidth={2} />
            <p>
              {formError.message}{' '}
              {formError.field === 'email' ? (
                <AppLink href="/register" className="font-semibold underline underline-offset-2">
                  Create an account
                </AppLink>
              ) : (
                <AppLink href="/forgot-password" className="font-semibold underline underline-offset-2">
                  Reset your password
                </AppLink>
              )}
            </p>
          </div>
        )}

        <Field id={idFor('email')} label="Email Address" error={visibleErrors.email}>
          <TextInput
            id={idFor('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => setValue('email', e.target.value)}
            onBlur={() => touch('email')}
            invalid={!!visibleErrors.email || formError?.field === 'email'}
            aria-describedby={fieldDescribedBy(idFor('email'), visibleErrors.email)}
          />
        </Field>

        <Field id={idFor('password')} label="Password" error={visibleErrors.password}>
          <PasswordInput
            id={idFor('password')}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={values.password}
            onChange={(e) => setValue('password', e.target.value)}
            onBlur={() => touch('password')}
            invalid={!!visibleErrors.password || formError?.field === 'password'}
            aria-describedby={fieldDescribedBy(idFor('password'), visibleErrors.password)}
          />
        </Field>

        <div className="flex items-center justify-between gap-4">
          <Checkbox checked={values.remember} onChange={(e) => setValue('remember', e.target.checked)}>
            Remember me
          </Checkbox>
          <AppLink
            href="/forgot-password"
            className="shrink-0 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Forgot Password?
          </AppLink>
        </div>

        <Button type="submit" size="lg" fullWidth disabled={pending} aria-busy={pending} className="mt-2">
          {pending ? (
            <>
              <Loader2 aria-hidden className="size-[18px] animate-spin" />
              Signing in…
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <AuthDivider />
      <SocialButtons onUnavailable={(provider) => setNotice(`${provider} sign-in isn’t available in this demo yet.`)} />
      <p role="status" className="mt-3 flex min-h-5 items-center justify-center gap-1.5 text-center text-xs text-muted">
        {notice && (
          <>
            <Info aria-hidden className="size-3.5 shrink-0" strokeWidth={2.2} />
            {notice}
          </>
        )}
      </p>
    </AuthShell>
  );
}
