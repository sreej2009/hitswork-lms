import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { Course } from '../types';
import { findPublicCourse } from '../lib/publicCatalog';
import { useStore } from '../context/StoreContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { cn } from '../lib/cn';
import { summarize } from '../lib/pricing';
import { CartItem } from '../components/checkout/CartItem';
import { CartSummary } from '../components/checkout/CartSummary';
import { CheckoutSteps } from '../components/checkout/CheckoutSteps';
import { EmptyCart } from '../components/checkout/EmptyCart';
import { Container } from '../components/ui/Container';
import { PageHeader } from '../components/ui/PageHeader';

/** Resolve ids (kept in insertion order) to courses, skipping anything already purchased. */
function resolve(ids: ReadonlySet<string>, enrolled: ReadonlySet<string>): Course[] {
  return [...ids].flatMap((id) => {
    const course = findPublicCourse(id)?.course;
    return course && !enrolled.has(id) ? [course] : [];
  });
}

export function CartPage() {
  useDocumentTitle('Shopping Cart — Hitswork');
  const { cart, wishlist, enrolled, coupon } = useStore();
  const items = useMemo(() => resolve(cart, enrolled), [cart, enrolled]);
  const saved = useMemo(() => resolve(wishlist, enrolled).filter((c) => !cart.has(c.id)), [wishlist, enrolled, cart]);
  const summary = useMemo(() => summarize(items, coupon), [items, coupon]);

  return (
    <>
      <PageHeader
        top={<CheckoutSteps current={1} />}
        title="Shopping Cart"
        subtitle="Review your selected courses before checkout."
        meta={
          items.length > 0 && (
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-ink shadow-xs ring-1 ring-line">
              <span className="size-2 rounded-full bg-brand-gradient" aria-hidden />
              {items.length} {items.length === 1 ? 'course' : 'courses'} in your cart
            </p>
          )
        }
      />

      <Container className="py-10 lg:py-12">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-10">
            <section aria-label="Courses in your cart" className="min-w-0">
              <ul className="space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((course) => (
                    <CartItem key={course.id} course={course} />
                  ))}
                </AnimatePresence>
              </ul>
            </section>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <CartSummary summary={summary} itemCount={items.length} />
            </div>
          </div>
        )}

        {saved.length > 0 && (
          <section
            aria-labelledby="saved-title"
            // Align with the cart column when the summary sits beside it.
            className={cn('mt-14', items.length > 0 && 'lg:max-w-[calc(100%-420px)]')}
          >
            <h2 id="saved-title" className="flex items-center gap-2.5 text-xl font-bold tracking-[-0.01em]">
              <Heart aria-hidden className="size-5 text-rose-500" fill="currentColor" strokeWidth={0} />
              Saved for later
              <span className="text-base font-medium text-muted">({saved.length})</span>
            </h2>
            <ul className="mt-5 space-y-4">
              <AnimatePresence initial={false}>
                {saved.map((course) => (
                  <CartItem key={course.id} course={course} variant="saved" />
                ))}
              </AnimatePresence>
            </ul>
          </section>
        )}
      </Container>
    </>
  );
}
