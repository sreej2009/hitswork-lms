import { forwardRef, useState, type ComponentProps } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { TextInput } from '../ui/Form';

type PasswordInputProps = Omit<ComponentProps<typeof TextInput>, 'type' | 'trailing' | 'padding'>;

/** Password field with a show/hide toggle. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(props, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <TextInput
      ref={ref}
      type={visible ? 'text' : 'password'}
      padding="pl-4 pr-12"
      trailing={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          aria-controls={props.id}
          className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
        >
          {visible ? <EyeOff aria-hidden className="size-[18px]" /> : <Eye aria-hidden className="size-[18px]" />}
        </button>
      }
      {...props}
    />
  );
});

export function AuthDivider() {
  return (
    <div className="my-7 flex items-center gap-4" role="separator" aria-label="or">
      <span className="h-px flex-1 bg-line" />
      <span aria-hidden className="text-xs font-semibold tracking-[0.12em] text-subtle">
        OR
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

const GoogleMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="size-[18px]">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
  </svg>
);

const AppleMark = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="size-[18px]" fill="currentColor">
    <path d="M16.37 1.43c0 1.14-.49 2.27-1.18 3.08-.74.9-1.99 1.57-2.99 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.57-2.27 1.21-2.98.8-.94 2.14-1.64 3.25-1.68.03.13.05.28.05.43zm4.56 15.71c-.03.07-.46 1.58-1.52 3.12-.94 1.34-1.94 2.71-3.43 2.71-1.52 0-1.9-.88-3.63-.88-1.7 0-2.3.91-3.67.91-1.38 0-2.33-1.26-3.43-2.8C4.47 18.38 3.43 15.57 3.43 12.92c0-4.28 2.8-6.55 5.55-6.55 1.45 0 2.68.95 3.6.95.87 0 2.22-1.01 3.9-1.01.61 0 2.89.06 4.37 2.19-.13.09-2.38 1.37-2.38 4.19 0 3.26 2.85 4.42 2.96 4.45z" />
  </svg>
);

/** Social sign-in buttons. Providers aren't connected in the demo, so they explain that instead of failing silently. */
export function SocialButtons({ onUnavailable }: { onUnavailable: (provider: string) => void }) {
  const buttonClass =
    'inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line-strong bg-white text-[15px] font-semibold text-ink shadow-xs transition-colors duration-200 hover:border-brand-200 hover:bg-canvas';
  return (
    <div className="grid gap-3">
      <button type="button" className={buttonClass} onClick={() => onUnavailable('Google')}>
        <GoogleMark />
        Continue with Google
      </button>
      <button type="button" className={buttonClass} onClick={() => onUnavailable('Apple')}>
        <AppleMark />
        Continue with Apple
      </button>
    </div>
  );
}
