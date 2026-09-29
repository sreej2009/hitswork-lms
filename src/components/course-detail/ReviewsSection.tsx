import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Course, CourseReview } from '../../types';
import { ratingDistribution } from '../../lib/courseDetail';
import { formatDate, formatNumber } from '../../lib/format';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { RatingStars } from '../ui/RatingStars';

const INITIAL_REVIEWS = 4;

function ReviewCard({ review }: { review: CourseReview }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card"
    >
      <header className="flex items-center gap-3">
        <Avatar name={review.name} />
        <div className="min-w-0">
          <h3 className="truncate font-sans text-sm font-semibold text-ink">{review.name}</h3>
          <p className="text-xs text-muted">
            <time dateTime={review.date}>{formatDate(review.date)}</time>
          </p>
        </div>
      </header>
      <div className="mt-3">
        <RatingStars rating={review.rating} />
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-body">{review.text}</p>
    </motion.article>
  );
}

export function ReviewsSection({ course, reviews }: { course: Course; reviews: CourseReview[] }) {
  const [showAll, setShowAll] = useState(false);
  const distribution = ratingDistribution(course.rating);
  const visible = showAll ? reviews : reviews.slice(0, INITIAL_REVIEWS);

  return (
    <div>
      <div className="grid items-center gap-6 rounded-2xl border border-line bg-white p-6 shadow-card sm:grid-cols-[200px_1fr] sm:gap-10 sm:p-7">
        <div className="text-center sm:border-r sm:border-line sm:pr-8">
          <p className="font-display text-6xl leading-none font-extrabold tracking-[-0.03em] text-ink">
            {course.rating.toFixed(1)}
          </p>
          <div className="mt-3 flex justify-center">
            <RatingStars rating={course.rating} size={18} />
          </div>
          <p className="mt-2 text-sm text-muted">{formatNumber(course.reviews)} ratings</p>
        </div>

        <ul className="space-y-2.5" aria-label="Rating distribution">
          {distribution.map((percent, index) => {
            const stars = 5 - index;
            return (
              <li key={stars} className="flex items-center gap-3 text-sm">
                <span className="flex w-9 shrink-0 items-center gap-1 font-medium text-ink">
                  {stars}
                  <Star aria-hidden className="size-3.5 text-amber-400" fill="currentColor" strokeWidth={0} />
                </span>
                <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-canvas ring-1 ring-line">
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-amber-400 to-amber-300"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                <span className="w-10 shrink-0 text-right text-xs text-muted tabular-nums">
                  <span className="sr-only">{stars} stars: </span>
                  {percent}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {reviews.length > 0 && (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {visible.map((review) => (
                <ReviewCard key={review.name} review={review} />
              ))}
            </AnimatePresence>
          </div>
          {reviews.length > INITIAL_REVIEWS && (
            <Button variant="secondary" onClick={() => setShowAll((value) => !value)} className="mt-6" aria-expanded={showAll}>
              {showAll ? 'Show Fewer Reviews' : 'View All Reviews'}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
