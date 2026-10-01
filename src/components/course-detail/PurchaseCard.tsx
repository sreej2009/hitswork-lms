import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Award, Check, Heart, Infinity as InfinityIcon, Play, ShieldCheck, ShoppingCart } from 'lucide-react';
import type { Course } from '../../types';
import { useStore } from '../../context/StoreContext';
import { cn } from '../../lib/cn';
import { discountPercent, formatPrice } from '../../lib/format';
import { Button } from '../ui/Button';
import { SmartImage } from '../ui/SmartImage';
import { EnrollButton } from './EnrollButton';
import { useAuthGate } from '../../hooks/useAuthGate';

export function PriceBlock({ course, compact }: { course: Course; compact?: boolean }) {
  if (course.price === 0) {
    return <p className={cn('font-display font-extrabold tracking-tight text-ink', compact ? 'text-xl' : 'text-[2rem] leading-none')}>Free</p>;
  }
  const discount = discountPercent(course.price, course.originalPrice);
  return (
    <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
      <span
        className={cn(
          'font-display font-extrabold tracking-tight text-ink',
          compact ? 'text-xl' : 'text-[2rem] leading-none',
        )}
      >
        <span className="sr-only">Price: </span>
        {formatPrice(course.price)}
      </span>
      <span className={cn('text-subtle line-through', compact ? 'text-sm' : 'text-base')}>
        <span className="sr-only">Original price: </span>
        {formatPrice(course.originalPrice)}
      </span>
      {discount > 0 && (
        <span
          className={cn(
            'rounded-md bg-emerald-50 font-bold text-emerald-700 ring-1 ring-emerald-100',
            compact ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-0.5 text-sm',
          )}
        >
          {discount}% OFF
        </span>
      )}
    </p>
  );
}

function WishlistToggle({ course }: { course: Course }) {
  const { wishlist, toggleWishlist } = useStore();
  const gate = useAuthGate();
  const saved = wishlist.has(course.id);
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={() => {
        if (gate({ type: 'wishlist', courseId: course.id, title: course.title })) toggleWishlist(course.id);
      }}
      className={cn(
        'inline-flex h-12 grow basis-0 items-center justify-center gap-2 rounded-xl border px-3 text-[15px] font-semibold whitespace-nowrap transition-colors duration-200 sm:h-[52px]',
        saved
          ? 'border-rose-200 bg-rose-50 text-rose-500'
          : 'border-line-strong bg-white text-body hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500',
      )}
    >
      <motion.span
        key={saved ? 'saved' : 'idle'}
        initial={saved ? { scale: 0.55 } : false}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 520, damping: 14 }}
        className="grid place-items-center"
      >
        <Heart aria-hidden className="size-5" strokeWidth={2} fill={saved ? 'currentColor' : 'none'} />
      </motion.span>
      {saved ? 'Wishlisted' : 'Wishlist'}
    </motion.button>
  );
}

const guarantees = [
  { icon: ShieldCheck, label: '30-Day Money-Back Guarantee' },
  { icon: InfinityIcon, label: 'Lifetime Access' },
  { icon: Award, label: 'Certificate of Completion' },
];

interface PurchaseCardProps {
  course: Course;
  /** `sidebar`: floating desktop card with preview image; `inline`: normal section on smaller screens */
  variant: 'sidebar' | 'inline';
}

export const PurchaseCard = forwardRef<HTMLDivElement, PurchaseCardProps>(function PurchaseCard({ course, variant }, ref) {
  const { cart, enrolled, addToCart } = useStore();
  const inCart = cart.has(course.id);
  const isEnrolled = enrolled.has(course.id);
  const sidebar = variant === 'sidebar';

  const perks = guarantees.map(({ icon: Icon, label }) => (
    <li key={label} className="flex items-center gap-2.5">
      <Icon aria-hidden className="size-[18px] shrink-0 text-brand-600" strokeWidth={1.9} />
      {label}
    </li>
  ));

  const actions = (
    <div className="space-y-3">
      <EnrollButton course={course} fullWidth />
      {isEnrolled ? (
        <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-emerald-700">
          <Check aria-hidden className="size-4" strokeWidth={2.6} />
          Purchased — you have lifetime access
        </p>
      ) : (
        <div className="flex gap-3">
          {course.price > 0 &&
            (inCart ? (
              <Button
                href="/cart"
                variant="soft"
                size="lg"
                arrow
                // grow + zero basis: fill the row but leave room for the wishlist button.
                className="grow basis-0"
              >
                Go to Cart
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                className="grow basis-0"
                icon={ShoppingCart}
                onClick={() => addToCart(course.id, course.title)}
              >
                Add to Cart
              </Button>
            ))}
          <WishlistToggle course={course} />
        </div>
      )}
    </div>
  );

  return (
    <div ref={ref} className="relative">
      {sidebar && (
        <div
          aria-hidden
          className="absolute -inset-4 -z-10 rounded-[2.25rem] bg-linear-to-br from-brand-500/45 via-grape-600/35 to-orchid-500/30 blur-2xl"
        />
      )}
      <div className={cn('overflow-hidden rounded-3xl border border-line bg-white', sidebar ? 'shadow-float' : 'shadow-card')}>
        {sidebar && (
          <div className="p-3 pb-0">
            <a
              href="#curriculum"
              aria-label="Preview this course: see free preview lectures"
              className="group relative block aspect-[16/10] overflow-hidden rounded-2xl bg-brand-50"
            >
              <SmartImage
                photoId={course.image}
                alt={course.imageAlt}
                width={720}
                ratio={16 / 10}
                widths={[480, 720, 960]}
                sizes="360px"
                priority
                className="size-full transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
              />
              <span aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/60 via-ink/10 to-transparent" />
              <span
                aria-hidden
                className="absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 text-brand-600 shadow-float transition-transform duration-300 group-hover:scale-110"
              >
                <Play className="ml-0.5 size-6" fill="currentColor" strokeWidth={0} />
              </span>
              <span aria-hidden className="absolute inset-x-0 bottom-3 text-center text-sm font-semibold text-white">
                Preview this course
              </span>
            </a>
          </div>
        )}

        {sidebar ? (
          <div className="p-6">
            <PriceBlock course={course} />
            <div className="mt-5">{actions}</div>
            <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm text-body">{perks}</ul>
          </div>
        ) : (
          <div className="p-6 sm:grid sm:grid-cols-[1fr_minmax(0,300px)] sm:items-center sm:gap-8 sm:p-7">
            <div>
              <PriceBlock course={course} />
              <ul className="mt-5 space-y-2.5 text-sm text-body">{perks}</ul>
            </div>
            <div className="mt-6 sm:mt-0">{actions}</div>
          </div>
        )}
      </div>
    </div>
  );
});
