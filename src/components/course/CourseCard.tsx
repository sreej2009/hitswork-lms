import { motion } from 'framer-motion';
import { Check, Clock, Heart, ShoppingCart, Users } from 'lucide-react';
import type { Course, CourseBadge } from '../../types';
import { useStore } from '../../context/StoreContext';
import { accentForCategory } from '../../data/categories';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { formatCompact, formatNumber, formatPrice } from '../../lib/format';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';
import { SmartImage } from '../ui/SmartImage';

const badgeTone = {
  Bestseller: 'amber',
  'Top Rated': 'white',
  'Hot & New': 'rose',
} as const satisfies Record<CourseBadge, string>;

function WishlistButton({ course }: { course: Course }) {
  const { wishlist, toggleWishlist } = useStore();
  const saved = wishlist.has(course.id);
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.86 }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${course.title} from wishlist` : `Save ${course.title} to wishlist`}
      onClick={() => toggleWishlist(course.id, course.title)}
      className={cn(
        'relative z-10 grid size-9 place-items-center rounded-full bg-white/95 shadow-xs backdrop-blur transition-colors duration-200',
        saved ? 'text-rose-500' : 'text-body hover:text-rose-500',
      )}
    >
      <motion.span
        key={saved ? 'saved' : 'idle'}
        initial={saved ? { scale: 0.6 } : false}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 520, damping: 14 }}
        className="grid place-items-center"
      >
        <Heart aria-hidden className="size-[17px]" strokeWidth={2} fill={saved ? 'currentColor' : 'none'} />
      </motion.span>
    </motion.button>
  );
}

function CartButton({ course }: { course: Course }) {
  const { cart, toggleCart } = useStore();
  const added = cart.has(course.id);
  return (
    <button
      type="button"
      aria-pressed={added}
      aria-label={added ? `Remove ${course.title} from cart` : `Add ${course.title} to cart`}
      onClick={() => toggleCart(course.id, course.title)}
      className={cn(
        'relative z-10 grid size-10 shrink-0 place-items-center rounded-xl transition-all duration-200',
        added
          ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
          : 'bg-brand-50 text-brand-600 hover:bg-brand-gradient hover:text-white hover:shadow-brand',
      )}
    >
      {added ? (
        <Check aria-hidden className="size-[18px]" strokeWidth={2.4} />
      ) : (
        <ShoppingCart aria-hidden className="size-[18px]" strokeWidth={2} />
      )}
    </button>
  );
}

interface CourseCardProps {
  course: Course;
  /** Load the image eagerly (above-the-fold cards) */
  priority?: boolean;
  className?: string;
}

export function CourseCard({ course, priority, className }: CourseCardProps) {
  const accent = accents[accentForCategory(course.category)];
  const discount = Math.round((1 - course.price / course.originalPrice) * 100);

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card',
        'transition-[transform,box-shadow,border-color] duration-300 ease-out-soft',
        'hover:-translate-y-1 hover:border-brand-100 hover:shadow-card-hover',
        'focus-within:border-brand-200',
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-50">
        <SmartImage
          photoId={course.image}
          alt={course.imageAlt}
          width={480}
          ratio={16 / 10}
          widths={[360, 480, 720]}
          sizes="(min-width: 1200px) 300px, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="size-full transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-ink/25 to-transparent" />
        {course.badge && (
          <Badge tone={badgeTone[course.badge]} className="absolute top-3 left-3 shadow-xs">
            {course.badge}
          </Badge>
        )}
        <div className="absolute top-3 right-3">
          <WishlistButton course={course} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className={cn('truncate text-xs font-semibold tracking-wide', accent.text)}>{course.category}</p>
          <p className="shrink-0 rounded-md bg-canvas px-2 py-0.5 text-[11px] font-medium text-muted ring-1 ring-line">
            <span className="sr-only">Level: </span>
            {course.level}
          </p>
        </div>

        <h3 className="mt-1.5 line-clamp-2 min-h-[2.75rem] font-display text-base leading-[1.375] font-bold tracking-[-0.01em]">
          <a
            href={`/courses/${course.id}`}
            className="rounded-sm transition-colors outline-none group-hover:text-brand-700 after:absolute after:inset-0 after:rounded-card focus-visible:after:ring-2 focus-visible:after:ring-brand-500 focus-visible:after:ring-offset-2"
          >
            {course.title}
          </a>
        </h3>

        <p className="mt-1.5 truncate text-sm text-muted">{course.instructor}</p>

        <div className="mt-3 flex items-center gap-1.5 text-sm">
          <span className="font-bold text-amber-700">{course.rating.toFixed(1)}</span>
          <RatingStars rating={course.rating} />
          <span className="text-xs text-muted">({formatNumber(course.reviews)})</span>
        </div>

        <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
          <li className="inline-flex items-center gap-1.5">
            <Users aria-hidden className="size-3.5 text-subtle" strokeWidth={2} />
            {formatCompact(course.students)} students
          </li>
          <li className="inline-flex items-center gap-1.5">
            <Clock aria-hidden className="size-3.5 text-subtle" strokeWidth={2} />
            {course.hours} hours
          </li>
        </ul>

        {/* Spacer keeps price rows aligned across cards of equal height */}
        <div aria-hidden className="min-h-4 flex-1" />

        <div className="flex items-end justify-between gap-3 border-t border-line pt-4">
          <div className="min-w-0">
            <p className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold tracking-tight text-ink">
                <span className="sr-only">Price: </span>
                {formatPrice(course.price)}
              </span>
              <span className="text-sm text-subtle line-through">
                <span className="sr-only">Original price: </span>
                {formatPrice(course.originalPrice)}
              </span>
            </p>
            <p className="mt-0.5 text-xs font-medium text-emerald-600">{discount}% off today</p>
          </div>
          <CartButton course={course} />
        </div>
      </div>
    </article>
  );
}
