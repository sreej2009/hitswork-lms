import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import type { Course } from '../../types';
import { courseDetails } from '../../data/courseDetails';
import { useStore } from '../../context/StoreContext';
import { useAuthGate } from '../../hooks/useAuthGate';
import { discountPercent, formatNumber, formatPrice } from '../../lib/format';
import { AppLink } from '../ui/AppLink';
import { RatingStars } from '../ui/RatingStars';
import { SmartImage } from '../ui/SmartImage';

const actionClass = 'inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold transition-colors';

interface CartItemProps {
  course: Course;
  /** `cart`: Remove / Move to Wishlist. `saved`: a wishlist row with Move to Cart. */
  variant?: 'cart' | 'saved';
}

export const CartItem = forwardRef<HTMLLIElement, CartItemProps>(function CartItem({ course, variant = 'cart' }, ref) {
  const { removeFromCart, moveToWishlist, moveToCart, toggleWishlist } = useStore();
  const gate = useAuthGate();
  const detail = courseDetails[course.id];
  const href = `/course/${course.id}`;
  const discount = discountPercent(course.price, course.originalPrice);
  const meta = [
    `${course.hours} hours`,
    detail && `${detail.totals.sections} sections`,
    detail && `${formatNumber(detail.totals.lectures)} lectures`,
    course.level,
  ].filter(Boolean) as string[];

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-4 rounded-2xl border border-line bg-white p-4 shadow-card sm:gap-5 sm:p-5"
    >
      <AppLink
        href={href}
        tabIndex={-1}
        aria-hidden
        className="group relative aspect-[16/10] w-24 shrink-0 self-start overflow-hidden rounded-xl bg-brand-50 sm:w-40 lg:w-44"
      >
        <SmartImage
          photoId={course.image}
          alt=""
          width={352}
          ratio={16 / 10}
          widths={[200, 352]}
          sizes="(min-width: 640px) 176px, 96px"
          className="size-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </AppLink>

      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:gap-6">
        <div className="min-w-0 flex-1">
          <h3 className="font-sans text-[15px] leading-snug font-semibold sm:text-base">
            <AppLink href={href} className="text-ink transition-colors hover:text-brand-700">
              {course.title}
            </AppLink>
          </h3>
          <p className="mt-1 text-sm text-muted">{course.instructor}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
            <span className="font-bold text-amber-700">{course.rating.toFixed(1)}</span>
            <RatingStars rating={course.rating} size={13} />
            <span className="text-xs text-muted">({formatNumber(course.reviews)} ratings)</span>
          </div>
          <ul className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-muted">
            {meta.map((item, index) => (
              <li key={item} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden className="size-1 rounded-full bg-subtle" />}
                {item}
              </li>
            ))}
          </ul>

          {/* -ml-2 lines the button text up with the title despite the padded hit area */}
          <div className="mt-2 -ml-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            {variant === 'cart' ? (
              <>
                <button
                  type="button"
                  onClick={() => removeFromCart(course.id, course.title)}
                  aria-label={`Remove ${course.title} from cart`}
                  className={`${actionClass} text-rose-600 hover:bg-rose-50`}
                >
                  <Trash2 aria-hidden className="size-4" strokeWidth={2} />
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => gate() && moveToWishlist(course.id, course.title)}
                  aria-label={`Move ${course.title} to wishlist`}
                  className={`${actionClass} text-brand-600 hover:bg-brand-50`}
                >
                  <Heart aria-hidden className="size-4" strokeWidth={2} />
                  Move to Wishlist
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => moveToCart(course.id, course.title)}
                  aria-label={`Move ${course.title} to cart`}
                  className={`${actionClass} text-brand-600 hover:bg-brand-50`}
                >
                  <ShoppingCart aria-hidden className="size-4" strokeWidth={2} />
                  Move to Cart
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(course.id)}
                  aria-label={`Remove ${course.title} from wishlist`}
                  className={`${actionClass} text-muted hover:bg-canvas hover:text-ink`}
                >
                  <Trash2 aria-hidden className="size-4" strokeWidth={2} />
                  Remove
                </button>
              </>
            )}
          </div>
        </div>

        <div className="shrink-0 sm:text-right">
          <p className="font-display text-lg font-extrabold tracking-tight text-ink sm:text-xl">
            <span className="sr-only">Price: </span>
            {course.price === 0 ? 'Free' : formatPrice(course.price)}
          </p>
          {discount > 0 && (
            <>
              <p className="text-sm text-subtle line-through">
                <span className="sr-only">Original price: </span>
                {formatPrice(course.originalPrice)}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-emerald-600">{discount}% off</p>
            </>
          )}
        </div>
      </div>
    </motion.li>
  );
});
