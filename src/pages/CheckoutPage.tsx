import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { AlertCircle } from 'lucide-react';
import type { Course } from '../types';
import { findPublicCourse } from '../lib/publicCatalog';
import { useStore } from '../context/StoreContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import {
  fieldOrder,
  initialCheckoutForm,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutField,
  type CheckoutForm,
} from '../lib/checkout';
import { summarize } from '../lib/pricing';
import { BillingForm } from '../components/checkout/BillingForm';
import { fieldId } from '../components/checkout/CheckoutSection';
import { CheckoutSteps } from '../components/checkout/CheckoutSteps';
import { ContactForm } from '../components/checkout/ContactForm';
import { EmptyCart } from '../components/checkout/EmptyCart';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PaymentMethod } from '../components/checkout/PaymentMethod';
import { Container } from '../components/ui/Container';
import { PageHeader } from '../components/ui/PageHeader';

const FORM_ID = 'checkout-form';
/** Simulated gateway round-trip. */
const PROCESSING_MS = 1600;

export function CheckoutPage() {
  useDocumentTitle('Checkout — Hitswork');
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { cart, enrolled, coupon, placeOrder } = useStore();

  // "Enroll Now" on a course page checks out just that course (?buy=<id>); otherwise the whole cart.
  const buyNowId = params.get('buy');
  const items = useMemo<Course[]>(() => {
    const ids = buyNowId ? [buyNowId] : [...cart];
    return ids.flatMap((id) => {
      const course = findPublicCourse(id)?.course;
      return course && !enrolled.has(id) ? [course] : [];
    });
  }, [buyNowId, cart, enrolled]);
  const summary = useMemo(() => summarize(items, coupon), [items, coupon]);

  const [form, setForm] = useState<CheckoutForm>(initialCheckoutForm);
  const [touched, setTouched] = useState<ReadonlySet<CheckoutField>>(() => new Set());
  const [submitted, setSubmitted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const errors = useMemo(() => validateCheckout(form), [form]);
  // Show a field's error once it has been left, or everything after a submit attempt.
  const visibleErrors = useMemo<CheckoutErrors>(
    () =>
      submitted
        ? errors
        : Object.fromEntries(Object.entries(errors).filter(([field]) => touched.has(field as CheckoutField))),
    [errors, submitted, touched],
  );
  const errorCount = Object.keys(errors).length;

  const onChange = <K extends CheckoutField>(field: K, value: CheckoutForm[K]) =>
    setForm((current) => ({ ...current, [field]: value }));
  const onBlur = (field: CheckoutField) => setTouched((current) => new Set(current).add(field));

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (processing || !termsAccepted) return;
    setSubmitted(true);

    const firstInvalid = fieldOrder.find((field) => errors[field]);
    if (firstInvalid) {
      const el = document.getElementById(fieldId(firstInvalid));
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus({ preventScroll: true });
      return;
    }

    setProcessing(true);
    timer.current = window.setTimeout(() => {
      const order = placeOrder({
        courseIds: items.map((course) => course.id),
        original: summary.original,
        discount: summary.discount,
        couponCode: summary.coupon?.code ?? null,
        couponDiscount: summary.couponDiscount,
        total: summary.total,
        paymentMethod: form.method,
      });
      navigate('/checkout/success', { replace: true, state: { orderId: order.id } });
    }, PROCESSING_MS);
  };

  const sectionProps = { values: form, errors: visibleErrors, onChange, onBlur };

  return (
    <>
      <PageHeader
        top={<CheckoutSteps current={2} />}
        title="Complete Your Purchase"
        subtitle="You’re one step away from starting your learning journey."
      />

      <Container className="py-10 lg:py-12">
        {items.length === 0 && !processing ? (
          <EmptyCart title="Nothing to check out" text="Your cart is empty. Add a course to continue to checkout." />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] xl:gap-10">
            <form id={FORM_ID} onSubmit={onSubmit} noValidate className="min-w-0 space-y-6" aria-label="Checkout">
              {submitted && errorCount > 0 && (
                <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                  <AlertCircle aria-hidden className="mt-0.5 size-5 shrink-0 text-rose-600" strokeWidth={2} />
                  <p>
                    <span className="font-semibold">
                      Please fix {errorCount} {errorCount === 1 ? 'field' : 'fields'} to continue.
                    </span>{' '}
                    The highlighted fields need your attention.
                  </p>
                </div>
              )}
              <ContactForm {...sectionProps} />
              <BillingForm {...sectionProps} />
              <PaymentMethod {...sectionProps} />
            </form>

            <aside aria-label="Order summary" className="lg:sticky lg:top-24 lg:self-start">
              <OrderSummary
                items={items}
                summary={summary}
                formId={FORM_ID}
                termsAccepted={termsAccepted}
                onTermsChange={setTermsAccepted}
                processing={processing}
              />
            </aside>
          </div>
        )}
      </Container>
    </>
  );
}
