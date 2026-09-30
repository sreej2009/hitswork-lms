import { useCallback, useMemo, useRef, useState } from 'react';

type Errors<T> = Partial<Record<keyof T, string>>;

/**
 * Minimal form state: values, validation, and which errors to show.
 * An error becomes visible once its field has been left (blurred), or for every field after a submit attempt.
 */
export function useForm<T extends Record<string, unknown>>(initial: T, validate: (values: T) => Errors<T>) {
  const initialRef = useRef(initial);
  const [values, setValues] = useState<T>(initial);
  const [touched, setTouched] = useState<ReadonlySet<keyof T>>(() => new Set());
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validate(values), [validate, values]);
  const visibleErrors = useMemo<Errors<T>>(
    () =>
      submitted
        ? errors
        : (Object.fromEntries(Object.entries(errors).filter(([key]) => touched.has(key as keyof T))) as Errors<T>),
    [errors, submitted, touched],
  );

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
  }, []);

  const touch = useCallback((field: keyof T) => {
    setTouched((current) => new Set(current).add(field));
  }, []);

  /**
   * Marks the form as submitted. Returns true when valid; otherwise focuses the first invalid field
   * (looked up by `idFor(field)`, in `order`) and returns false.
   */
  const attemptSubmit = useCallback(
    (order: (keyof T)[], idFor: (field: keyof T) => string) => {
      setSubmitted(true);
      const first = order.find((field) => errors[field]);
      if (first) document.getElementById(idFor(first))?.focus();
      return !first;
    },
    [errors],
  );

  /** Back to the initial values with no errors showing. */
  const reset = useCallback(() => {
    setValues(initialRef.current);
    setTouched(new Set());
    setSubmitted(false);
  }, []);

  return { values, setValue, touch, errors, visibleErrors, attemptSubmit, reset };
}
