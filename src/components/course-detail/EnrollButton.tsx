import { useEffect, useRef, useState } from 'react';
import { Loader2, PlayCircle } from 'lucide-react';
import type { Course } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Button } from '../ui/Button';

interface EnrollButtonProps {
  course: Course;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

/**
 * Paid courses: "Enroll Now" opens checkout for just this course.
 * Free courses: enroll in place after a brief processing state.
 * Owned courses: "Start Learning" goes to My Learning. State is shared, so every copy stays in sync.
 */
export function EnrollButton({ course, size = 'lg', fullWidth, className }: EnrollButtonProps) {
  const { enrolled, enroll } = useStore();
  const [pending, setPending] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (enrolled.has(course.id)) {
    return (
      <Button href="/my-learning" size={size} fullWidth={fullWidth} icon={PlayCircle} className={className}>
        Start Learning
      </Button>
    );
  }

  if (course.price > 0) {
    return (
      <Button href={`/checkout?buy=${course.id}`} size={size} fullWidth={fullWidth} arrow className={className}>
        Enroll Now
      </Button>
    );
  }

  const onClick = () => {
    setPending(true);
    timer.current = window.setTimeout(() => {
      setPending(false);
      enroll(course.id, course.title);
    }, 700);
  };

  return (
    <Button
      size={size}
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={pending}
      aria-busy={pending}
      arrow={!pending}
      className={className}
    >
      {pending && <Loader2 aria-hidden className="size-[18px] animate-spin" />}
      {pending ? 'Enrolling…' : 'Enroll for Free'}
    </Button>
  );
}
