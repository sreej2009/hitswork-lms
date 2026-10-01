import { useCallback, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { AuthError, useAuth } from '../../context/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useForm } from '../../hooks/useForm';
import { MIN_PASSWORD_LENGTH, validatePassword } from '../../lib/auth';
import { PasswordInput } from '../../components/auth/AuthFields';
import { AuthShell } from '../../components/auth/AuthShell';
import { AppLink } from '../../components/ui/AppLink';
import { Button } from '../../components/ui/Button';
import { Field, fieldDescribedBy } from '../../components/ui/Form';

type ResetValues = { password: string; confirm: string };
const idFor = (field: keyof ResetValues) => `new-${field}`;

/** Sets a new password from a reset link (/reset-password?token=…). */
export function ResetPasswordPage() {
  useDocumentTitle('Set a New Password — Hitswork');
  const { resetPassword } = useAuth();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const validate = useCallback(
    (v: ResetValues) => ({
      password: validatePassword(v.password),
      confirm: !v.confirm
        ? 'Confirm your new password'
        : v.confirm !== v.password
          ? 'Passwords don’t match'
          : undefined,
    }),
    [],
  );
  const { values, setValue, touch, visibleErrors, attemptSubmit } = useForm<ResetValues>(
    { password: '', confirm: '' },
    validate,
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(token ? null : 'This reset link is invalid or has expired.');
  const [done, setDone] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!attemptSubmit(['password', 'confirm'], idFor)) return;
    setPending(true);
    try {
      await resetPassword(token, values.password);
      setDone(true);
    } catch (e) {
      setError(e instanceof AuthError ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <AuthShell
      title={done ? 'Password updated' : 'Set a new password'}
      subtitle={
        done ? 'You can now sign in with your new password.' : 'Choose a new password for your Hitswork account.'
      }
      footer={
        <AppLink
          href="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700"
        >
          <ArrowLeft aria-hidden className="size-4" strokeWidth={2.2} />
          Back to Sign In
        </AppLink>
      }
    >
      {done ? (
        <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-center">
          <CheckCircle2 aria-hidden className="mx-auto size-10 text-emerald-600" strokeWidth={1.8} />
          <p className="mt-3 text-sm text-emerald-900">Your password has been changed.</p>
          <Button href="/login" size="lg" fullWidth className="mt-5">
            Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5" aria-label="Set a new password">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-800"
            >
              <AlertCircle aria-hidden className="mt-0.5 size-[18px] shrink-0 text-rose-600" />
              <p>
                {error}{' '}
                <AppLink href="/forgot-password" className="font-semibold underline underline-offset-2">
                  Request a new link
                </AppLink>
              </p>
            </div>
          )}
          <Field
            id={idFor('password')}
            label="New Password"
            error={visibleErrors.password}
            hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
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
          </Field>
          <Field id={idFor('confirm')} label="Confirm New Password" error={visibleErrors.confirm}>
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
          <Button type="submit" size="lg" fullWidth disabled={pending || !token} aria-busy={pending}>
            {pending ? (
              <>
                <Loader2 aria-hidden className="size-[18px] animate-spin" />
                Updating…
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
