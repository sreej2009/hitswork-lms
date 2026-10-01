import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import type { Course } from '../../types';
import { useStore } from '../../context/StoreContext';
import { useAuthGate } from '../../hooks/useAuthGate';
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
 * Owned courses: "Start Learning" opens the course player. State is shared, so every copy stays in sync.
 */
export function EnrollButton({ course, size = 'lg', fullWidth, className }: EnrollButtonProps) {
  const { enrolled, enroll } = useStore();
  const gate = useAuthGate();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (enrolled.has(course.id)) {
    return (
      <Button href={`/learn/${course.id}`} size={size} fullWidth={fullWidth} arrow className={className}>
        Start Learning
      </Button>
    );
  }

  if (course.price > 0) {
    return (
      <Button
        size={size}
        fullWidth={fullWidth}
        arrow
        className={className}
        // Guests sign in first and come back to this course page.
        onClick={() => gate() && navigate(`/checkout?buy=${course.id}`)}
      >
        Enroll Now
      </Button>
    );
  }

  const onClick = () => {
    if (!gate()) return;
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
