import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { AlertCircle, Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

const controlBase =
  'h-12 w-full min-w-0 rounded-xl border bg-white text-[15px] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-subtle disabled:bg-canvas disabled:text-muted';
const controlState = (invalid: boolean) =>
  invalid
    ? 'border-rose-300 focus:border-rose-400 focus:ring-4 focus:ring-rose-100'
    : 'border-line-strong hover:border-brand-200 focus:border-brand-300 focus:ring-4 focus:ring-brand-100';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

/** Label + control + hint/error. The control must use `id` and `fieldDescribedBy(id, …)`. */
export function Field({ id, label, error, hint, optional, className, children }: FieldProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600">
          <AlertCircle aria-hidden className="size-3.5 shrink-0" strokeWidth={2.2} />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

/** aria-describedby value matching what <Field> renders. */
export const fieldDescribedBy = (id: string, error?: string, hint?: ReactNode) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  /** Fixed text or icon inside the left edge, e.g. "+91" */
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Horizontal padding classes; replaces the default so adornments never overlap the text */
  padding?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { invalid = false, leading, trailing, padding, className, ...rest },
  ref,
) {
  return (
    <div className="relative">
      {leading && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[15px] text-muted">
          {leading}
        </span>
      )}
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(controlBase, controlState(invalid), padding ?? cn(leading ? 'pl-12' : 'pl-4', trailing ? 'pr-28' : 'pr-4'), className)}
        {...rest}
      />
      {trailing && <span className="absolute inset-y-0 right-3 flex items-center">{trailing}</span>}
    </div>
  );
});

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  placeholder?: string;
  options: readonly string[];
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(function SelectInput(
  { invalid = false, placeholder, options, className, value, ...rest },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        value={value}
        aria-invalid={invalid || undefined}
        className={cn(
          controlBase,
          controlState(invalid),
          'cursor-pointer appearance-none pr-10 pl-4',
          !value && 'text-subtle',
          className,
        )}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option} value={option} className="text-ink">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted"
        strokeWidth={2.2}
      />
    </div>
  );
});

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { invalid = false, className, rows = 5, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        'block w-full min-w-0 resize-y rounded-xl border bg-white px-4 py-3 text-[15px] leading-relaxed text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-subtle',
        controlState(invalid),
        className,
      )}
      {...rest}
    />
  );
});

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  children: ReactNode;
  invalid?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, invalid, className, ...rest },
  ref,
) {
  return (
    <label className={cn('group flex cursor-pointer items-start gap-3 text-sm text-body', className)}>
      <span className="relative mt-px grid size-5 shrink-0 place-items-center">
        <input
          ref={ref}
          type="checkbox"
          aria-invalid={invalid || undefined}
          className={cn(
            'peer size-5 cursor-pointer appearance-none rounded-md border bg-white transition-colors',
            'checked:border-brand-600 checked:bg-brand-600 group-hover:border-brand-300',
            invalid ? 'border-rose-400' : 'border-line-strong',
          )}
          {...rest}
        />
        <Check
          aria-hidden
          className="pointer-events-none absolute size-3.5 text-white opacity-0 peer-checked:opacity-100"
          strokeWidth={3.2}
        />
      </span>
      <span className="leading-5">{children}</span>
    </label>
  );
});
