import { useCallback, useState, type FormEvent } from 'react';
import { AlertCircle, Info, Loader2 } from 'lucide-react';
import { AuthError, useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useForm } from '../../hooks/useForm';
import { MIN_PASSWORD_LENGTH, firstName, passwordStrength, validateEmail, validatePassword } from '../../lib/auth';
import { cn } from '../../lib/cn';
import { AuthDivider, PasswordInput, SocialButtons } from '../../components/auth/AuthFields';
import { AuthShell } from '../../components/auth/AuthShell';
import { AppLink } from '../../components/ui/AppLink';
import { Button } from '../../components/ui/Button';
import { Checkbox, Field, TextInput, fieldDescribedBy } from '../../components/ui/Form';

type RegisterValues = { name: string; email: string; password: string; confirm: string; terms: boolean };
const idFor = (field: keyof RegisterValues) => `register-${field}`;
const fieldOrder: (keyof RegisterValues)[] = ['name', 'email', 'password', 'confirm', 'terms'];

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'] as const;
const strengthColors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-brand-500', 'bg-emerald-500'] as const;

function StrengthMeter({ password }: { password: string }) {
  const score = passwordStrength(password);
  if (!password) return null;
  return (
    <div className="mt-2 flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1" aria-hidden>
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className={cn('h-1.5 flex-1 rounded-full transition-colors', step <= score ? strengthColors[score] : 'bg-line')}
          />
        ))}
      </div>
      <span className="w-12 text-right text-xs font-medium text-muted">{strengthLabels[score]}</span>
    </div>
  );
}

export function RegisterPage() {
  useDocumentTitle('Create Account — Hitswork');
  const { register } = useAuth();
  const { notify } = useStore();
  const validate = useCallback(
    (v: RegisterValues) => ({
      name: v.name.trim().length < 2 ? (v.name.trim() ? 'Enter your full name' : 'Full name is required') : undefined,
      email: validateEmail(v.email),
      password: validatePassword(v.password),
      confirm: !v.confirm ? 'Confirm your password' : v.confirm !== v.password ? 'Passwords don’t match' : undefined,
      terms: v.terms ? undefined : 'Please accept the Terms of Use and Privacy Policy',
    }),
    [],
  );
  const { values, setValue, touch, visibleErrors, attemptSubmit } = useForm<RegisterValues>(
    { name: '', email: '', password: '', confirm: '', terms: false },
    validate,
  );
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<AuthError | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    if (!attemptSubmit(fieldOrder, idFor)) return;
    setPending(true);
    try {
      const user = await register(values.name, values.email, values.password);
      notify(`Welcome to Hitswork, ${firstName(user.name)}!`);
    } catch (error) {
      setPending(false);
      if (error instanceof AuthError) {
        setFormError(error);
        document.getElementById(idFor('email'))?.focus();
      } else throw error;
    }
  };

  return (
    <AuthShell
      title="Create your Hitswork account"
      subtitle="Start learning from thousands of courses."
      footer={
        <>
          Already have an account?{' '}
          <AppLink href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign In
          </AppLink>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5" aria-label="Create account">
        {formError && (
          <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-800">
            <AlertCircle aria-hidden className="mt-0.5 size-[18px] shrink-0 text-rose-600" strokeWidth={2} />
            <p>
              {formError.message}{' '}
              <AppLink href="/login" className="font-semibold underline underline-offset-2">
                Sign in instead
              </AppLink>
            </p>
          </div>
        )}

        <Field id={idFor('name')} label="Full Name" error={visibleErrors.name}>
          <TextInput
            id={idFor('name')}
            autoComplete="name"
            placeholder="Priya Sharma"
            value={values.name}
            onChange={(e) => setValue('name', e.target.value)}
            onBlur={() => touch('name')}
            invalid={!!visibleErrors.name}
            aria-describedby={fieldDescribedBy(idFor('name'), visibleErrors.name)}
          />
        </Field>

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
            invalid={!!visibleErrors.email || !!formError}
            aria-describedby={fieldDescribedBy(idFor('email'), visibleErrors.email)}
          />
        </Field>

        <Field
          id={idFor('password')}
          label="Password"
          error={visibleErrors.password}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters. Mix letters, numbers and symbols for a stronger password.`}
        >
          <PasswordInput
            id={idFor('password')}
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => setValue('password', e.target.value)}
            onBlur={() => touch('password')}
            invalid={!!visibleErrors.password}
            aria-describedby={fieldDescribedBy(idFor('password'), visibleErrors.password, true)}
          />
          <StrengthMeter password={values.password} />
        </Field>

        <Field id={idFor('confirm')} label="Confirm Password" error={visibleErrors.confirm}>
          <PasswordInput
            id={idFor('confirm')}
            autoComplete="new-password"
            value={values.confirm}
            onChange={(e) => setValue('confirm', e.target.value)}
            onBlur={() => touch('confirm')}
            invalid={!!visibleErrors.confirm}
            aria-describedby={fieldDescribedBy(idFor('confirm'), visibleErrors.confirm)}
          />
        </Field>

        <div>
          <Checkbox
            id={idFor('terms')}
            checked={values.terms}
            onChange={(e) => setValue('terms', e.target.checked)}
            invalid={!!visibleErrors.terms}
            aria-describedby={visibleErrors.terms ? `${idFor('terms')}-error` : undefined}
          >
            I agree to the{' '}
            <AppLink href="/terms" className="font-semibold text-brand-600 hover:text-brand-700">
              Terms of Use
            </AppLink>{' '}
            and{' '}
            <AppLink href="/privacy" className="font-semibold text-brand-600 hover:text-brand-700">
              Privacy Policy
            </AppLink>
            .
          </Checkbox>
          {visibleErrors.terms && (
            <p id={`${idFor('terms')}-error`} className="mt-1.5 flex items-center gap-1.5 pl-8 text-xs font-medium text-rose-600">
              <AlertCircle aria-hidden className="size-3.5 shrink-0" strokeWidth={2.2} />
              {visibleErrors.terms}
            </p>
          )}
        </div>

        <Button type="submit" size="lg" fullWidth disabled={pending} aria-busy={pending} className="mt-2">
          {pending ? (
            <>
              <Loader2 aria-hidden className="size-[18px] animate-spin" />
              Creating account…
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      <AuthDivider />
      <SocialButtons onUnavailable={(provider) => setNotice(`${provider} sign-up isn’t available in this demo yet.`)} />
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
