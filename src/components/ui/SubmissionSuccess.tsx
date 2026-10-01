import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { Button } from './Button';
import { Container } from './Container';
import { easeOutSoft } from './Reveal';

export interface SubmissionDetail {
  label: string;
  value: ReactNode;
}

interface SubmissionSuccessProps {
  title: string;
  message: string;
  /** Label for the reference, e.g. "Application ID" */
  referenceLabel: string;
  referenceId: string;
  details: SubmissionDetail[];
  /** Line under the details, e.g. where updates will be sent */
  note?: ReactNode;
  /** Text for the link that clears the stored submission */
  resetLabel: string;
  onReset: () => void;
  /** Shown after the title; `null` hides it */
  emoji?: string | null;
  backLabel?: string;
  /** Optional second button, e.g. "Open Instructor Dashboard" */
  secondaryAction?: { label: string; href: string };
}

/** Confirmation screen for demo form submissions (instructor applications, business enquiries). */
export function SubmissionSuccess({
  title,
  message,
  referenceLabel,
  referenceId,
  details,
  note,
  resetLabel,
  onReset,
  emoji = '🎉',
  backLabel = 'Back to Hitswork',
  secondaryAction,
}: SubmissionSuccessProps) {
  const [copied, setCopied] = useState(false);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(referenceId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be unavailable (insecure context); the ID is still visible to copy by hand.
    }
  };

  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-linear-to-b from-brand-50/80 via-grape-50/40 to-white"
      />
      <Container className="py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="relative mx-auto grid size-24 place-items-center"
          >
            <span aria-hidden className="absolute -inset-3 rounded-full bg-brand-100/70" />
            <span className="relative grid size-24 place-items-center rounded-full bg-brand-gradient text-white shadow-[0_18px_40px_-12px_rgb(79_70_229/0.6)]">
              <Check aria-hidden className="size-11" strokeWidth={3} />
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOutSoft }}
          >
            <h1 className="mt-9 text-[2rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2.75rem]">
              {title}
              {emoji && <span aria-hidden> {emoji}</span>}
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-[17px] leading-relaxed text-body">{message}</p>

            <div className="mt-9 rounded-3xl border border-line bg-white p-5 text-left shadow-card sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-canvas px-5 py-4 ring-1 ring-line">
                <div className="min-w-0">
                  <p className="text-xs font-medium tracking-wide text-muted uppercase">{referenceLabel}</p>
                  <p
                    className="mt-0.5 font-display text-lg font-bold tracking-wide text-ink"
                    data-testid="reference-id"
                  >
                    {referenceId}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyId}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
                >
                  {copied ? (
                    <Check aria-hidden className="size-4" strokeWidth={2.6} />
                  ) : (
                    <Copy aria-hidden className="size-4" />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                {details.map((detail) => (
                  <div key={detail.label} className="min-w-0">
                    <dt className="text-xs text-muted">{detail.label}</dt>
                    <dd className="mt-0.5 truncate text-sm font-semibold text-ink">{detail.value}</dd>
                  </div>
                ))}
              </dl>

              {note && <p className="mt-5 border-t border-line pt-5 text-sm leading-relaxed text-body">{note}</p>}
            </div>

            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                {secondaryAction && (
                  <Button href={secondaryAction.href} size="lg" arrow className="max-sm:w-full">
                    {secondaryAction.label}
                  </Button>
                )}
                <Button
                  href="/"
                  size="lg"
                  variant={secondaryAction ? 'secondary' : 'primary'}
                  arrow={!secondaryAction}
                  className="max-sm:w-full"
                >
                  {backLabel}
                </Button>
              </div>
              <button
                type="button"
                onClick={onReset}
                className="rounded-md text-sm font-semibold text-muted transition-colors hover:text-brand-700"
              >
                {resetLabel}
              </button>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/** Amber "Under review" style status for the details grid. */
export function PendingStatus({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-amber-700">
      <span aria-hidden className="size-1.5 rounded-full bg-amber-500" />
      {children}
    </span>
  );
}
