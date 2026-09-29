import { Star } from 'lucide-react';

const STARS = [0, 1, 2, 3, 4];

/** Five-star rating with fractional fill. */
export function RatingStars({ rating, size = 14 }: { rating: number; size?: number }) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
  const row = (className: string) => (
    <span className={className}>
      {STARS.map((i) => (
        // shrink-0: the clipped overlay is narrower than the row, so the stars must keep their size.
        <Star
          key={i}
          aria-hidden
          fill="currentColor"
          strokeWidth={0}
          className="shrink-0"
          style={{ width: size, height: size }}
        />
      ))}
    </span>
  );

  return (
    <span role="img" aria-label={`Rated ${rating} out of 5`} className="relative inline-flex shrink-0">
      {row('flex gap-0.5 text-slate-200')}
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${percent}%` }}>
        {row('flex w-max gap-0.5 text-amber-400')}
      </span>
    </span>
  );
}
