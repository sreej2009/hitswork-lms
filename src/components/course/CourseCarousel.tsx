import { useCallback, useEffect, useId, useRef, useState, type RefObject } from 'react';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Course } from '../../types';
import { cn } from '../../lib/cn';
import { CourseCard } from './CourseCard';

interface CarouselState {
  trackId: string;
  trackRef: RefObject<HTMLUListElement | null>;
  canPrev: boolean;
  canNext: boolean;
  scrollByPage: (direction: 1 | -1) => void;
}

/** Scroll-snap carousel state: which directions can move, and a page-scroll helper. */
export function useCarousel(): CarouselState {
  const trackId = useId();
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const reduceMotion = useReducedMotion();

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [update]);

  const scrollByPage = useCallback(
    (direction: 1 | -1) => {
      const el = trackRef.current;
      if (!el) return;
      el.scrollBy({ left: direction * el.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
    },
    [reduceMotion],
  );

  return { trackId, trackRef, canPrev, canNext, scrollByPage };
}

const arrowClass =
  'grid size-11 place-items-center rounded-full border border-line-strong bg-white text-ink shadow-xs transition-all duration-200 ' +
  'hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line-strong disabled:hover:bg-white disabled:hover:text-ink';

export function CarouselControls({
  carousel,
  label,
  className,
}: {
  carousel: CarouselState;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        aria-label={`Previous ${label}`}
        aria-controls={carousel.trackId}
        disabled={!carousel.canPrev}
        onClick={() => carousel.scrollByPage(-1)}
        className={arrowClass}
      >
        <ChevronLeft aria-hidden className="size-5" strokeWidth={2.2} />
      </button>
      <button
        type="button"
        aria-label={`Next ${label}`}
        aria-controls={carousel.trackId}
        disabled={!carousel.canNext}
        onClick={() => carousel.scrollByPage(1)}
        className={arrowClass}
      >
        <ChevronRight aria-hidden className="size-5" strokeWidth={2.2} />
      </button>
    </div>
  );
}

/** Horizontal course rail: swipeable on touch, four-up with arrow controls on desktop. */
export function CourseCarousel({
  courses,
  carousel,
  label,
}: {
  courses: Course[];
  carousel: CarouselState;
  label: string;
}) {
  return (
    <ul
      ref={carousel.trackRef}
      id={carousel.trackId}
      aria-label={label}
      className={cn(
        'no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain',
        // Bleed to the screen edge on phones, stay inside the container above that
        '-mx-4 scroll-px-4 px-4 sm:mx-0 sm:scroll-px-0 sm:gap-6 sm:px-0',
        // Room for the card hover lift and shadow
        '-my-4 py-4',
      )}
    >
      {courses.map((course) => (
        <li
          key={course.id}
          className="w-[82%] max-w-[340px] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] sm:max-w-none xl:w-[calc((100%-4.5rem)/4)]"
        >
          <CourseCard course={course} />
        </li>
      ))}
    </ul>
  );
}
