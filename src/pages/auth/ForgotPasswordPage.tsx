import { useCallback, useState, type FormEvent } from 'react';
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useForm } from '../../hooks/useForm';
import { validateEmail } from '../../lib/auth';
import { AuthShell } from '../../components/auth/AuthShell';
import { AppLink } from '../../components/ui/AppLink';
import { Button } from '../../components/ui/Button';
import { Field, TextInput, fieldDescribedBy } from '../../components/ui/Form';

type ResetValues = { email: string };
const EMAIL_ID = 'reset-email';

export function ForgotPasswordPage() {
  useDocumentTitle('Reset Password — Hitswork');
  const { requestPasswordReset } = useAuth();
  const validate = useCallback((v: ResetValues) => ({ email: validateEmail(v.email) }), []);
  const { values, setValue, touch, visibleErrors, attemptSubmit } = useForm<ResetValues>({ email: '' }, validate);
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!attemptSubmit(['email'], () => EMAIL_ID)) return;
    setPending(true);
    setToken(await requestPasswordReset(values.email));
    setPending(false);
    setSentTo(values.email.trim());
  };

  const backToSignIn = (
    <AppLink
      href="/login"
      className="inline-flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700"
    >
      <ArrowLeft aria-hidden className="size-4" strokeWidth={2.2} />
      Back to Sign In
    </AppLink>
  );

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your email address and we’ll send you a link to reset it."
      footer={backToSignIn}
    >
      {sentTo ? (
        <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-white text-emerald-600 shadow-xs">
            <MailCheck aria-hidden className="size-7" strokeWidth={1.8} />
          </span>
          <h2 className="mt-4 font-sans text-lg font-bold text-emerald-900">Check your inbox</h2>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800">
            If an account exists with this email, we’ve sent password reset instructions.
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-emerald-900">{sentTo}</p>
          {token && (
            <p className="mt-4 rounded-xl bg-white/80 px-3 py-2.5 text-xs text-emerald-900 ring-1 ring-emerald-200">
              Demo: emails aren’t sent, so{' '}
              <AppLink href={`/reset-password?token=${token}`} className="font-semibold underline underline-offset-2">
                open the reset link here
              </AppLink>
              .
            </p>
          )}
          <button
            type="button"
            onClick={() => setSentTo(null)}
            className="mt-5 text-sm font-semibold text-emerald-700 underline-offset-4 hover:underline"
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-5" aria-label="Reset password">
          <Field id={EMAIL_ID} label="Email Address" error={visibleErrors.email}>
            <TextInput
              id={EMAIL_ID}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={(e) => setValue('email', e.target.value)}
              onBlur={() => touch('email')}
              invalid={!!visibleErrors.email}
              aria-describedby={fieldDescribedBy(EMAIL_ID, visibleErrors.email)}
            />
          </Field>
          <Button type="submit" size="lg" fullWidth disabled={pending} aria-busy={pending}>
            {pending ? (
              <>
                <Loader2 aria-hidden className="size-[18px] animate-spin" />
                Sending…
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
