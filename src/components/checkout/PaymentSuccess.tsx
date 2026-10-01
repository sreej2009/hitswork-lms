import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import type { Course, Order } from '../../types';
import { formatDate, formatPrice } from '../../lib/format';
import { Button } from '../ui/Button';
import { SmartImage } from '../ui/SmartImage';
import { easeOutSoft } from '../ui/Reveal';

const methodLabels: Record<Order['paymentMethod'], string> = {
  card: 'Credit / Debit Card',
  upi: 'UPI',
  netbanking: 'Net Banking',
  wallet: 'Wallet',
};

export function PaymentSuccess({ order, courses }: { order: Order; courses: Course[] }) {
  const [copied, setCopied] = useState(false);

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be unavailable (insecure context); the ID is still visible to copy by hand.
    }
  };

  const details = [
    { label: 'Amount Paid', value: formatPrice(order.total) },
    { label: 'Courses', value: String(order.courseIds.length) },
    { label: 'Payment Method', value: methodLabels[order.paymentMethod] },
    { label: 'Date', value: formatDate(order.placedAt.slice(0, 10)) },
  ];

  return (
    <div className="mx-auto max-w-2xl text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="relative mx-auto grid size-24 place-items-center"
      >
        <span aria-hidden className="absolute inset-0 rounded-full bg-emerald-400/25 motion-safe:animate-ping [animation-iteration-count:1]" />
        <span aria-hidden className="absolute -inset-3 rounded-full bg-emerald-100/70" />
        <span className="relative grid size-24 place-items-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_18px_40px_-12px_rgb(16_185_129/0.6)]">
          <Check aria-hidden className="size-11" strokeWidth={3} />
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: easeOutSoft }}
      >
        <h1 className="mt-9 text-[2rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2.75rem]">
          Payment Successful!
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[17px] leading-relaxed text-body">
          Welcome to Hitswork. Your learning journey starts now.
        </p>

        <div className="mt-9 rounded-3xl border border-line bg-white p-6 text-left shadow-card sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-canvas px-5 py-4 ring-1 ring-line">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted uppercase">Order ID</p>
              <p className="mt-0.5 font-display text-lg font-bold tracking-wide text-ink">{order.id}</p>
            </div>
            <button
              type="button"
              onClick={copyOrderId}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
            >
              {copied ? <Check aria-hidden className="size-4" strokeWidth={2.6} /> : <Copy aria-hidden className="size-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {details.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="mt-0.5 text-[15px] font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-6 space-y-3 border-t border-line pt-6">
            {courses.map((course) => (
              <li key={course.id} className="flex items-center gap-3.5">
                <div className="aspect-[16/10] w-16 shrink-0 overflow-hidden rounded-lg bg-brand-50">
                  <SmartImage photoId={course.image} alt="" width={128} ratio={16 / 10} className="size-full" />
                </div>
                <p className="min-w-0 flex-1 text-sm leading-snug font-semibold text-ink">{course.title}</p>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  Purchased
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={courses[0] ? `/learn/${courses[0].id}` : '/my-learning'} size="lg" arrow>
            Continue Learning
          </Button>
          <Button href="/my-learning" size="lg" variant="secondary">
            Go to My Courses
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
