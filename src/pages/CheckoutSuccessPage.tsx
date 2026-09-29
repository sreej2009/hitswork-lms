import { useLocation } from 'react-router';
import { ReceiptText } from 'lucide-react';
import { courses } from '../data/courses';
import { useStore } from '../context/StoreContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { CheckoutSteps } from '../components/checkout/CheckoutSteps';
import { PaymentSuccess } from '../components/checkout/PaymentSuccess';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';

export function CheckoutSuccessPage() {
  useDocumentTitle('Payment Successful — Hitswork');
  const { orders } = useStore();
  const location = useLocation();
  const orderId = (location.state as { orderId?: string } | null)?.orderId;
  // Fall back to the latest order so a refresh of this page still shows the receipt.
  const order = orders.find((o) => o.id === orderId) ?? orders[0];

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-linear-to-b from-emerald-50/70 via-brand-50/40 to-white" />
      <Container className="py-10 sm:py-14">
        <div className="mb-12 flex justify-center">
          <CheckoutSteps current={3} complete={!!order} />
        </div>
        {order ? (
          <PaymentSuccess order={order} courses={courses.filter((course) => order.courseIds.includes(course.id))} />
        ) : (
          <div className="mx-auto flex max-w-md flex-col items-center py-10 text-center">
            <span className="grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <ReceiptText aria-hidden className="size-7" strokeWidth={1.9} />
            </span>
            <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.025em]">No recent order</h1>
            <p className="mt-3 text-[17px] leading-relaxed text-body">
              We couldn’t find a completed purchase on this device.
            </p>
            <Button href="/courses" arrow className="mt-8">
              Explore Courses
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
