import type { Course } from '../../types';
import { cn } from '../../lib/cn';
import { CourseCard } from './CourseCard';

interface CourseGridProps {
  courses: Course[];
  /** On phones, show only this many cards to keep the page scannable */
  mobileLimit?: number;
  /** Number of leading cards whose images load eagerly */
  priorityCount?: number;
}

/** 1 column on phones, 2 on tablets, 4 on desktop. Cards stretch to equal height. */
export function CourseGrid({ courses, mobileLimit, priorityCount = 0 }: CourseGridProps) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
      {courses.map((course, index) => (
        <li key={course.id} className={cn(mobileLimit !== undefined && index >= mobileLimit && 'hidden sm:block')}>
          <CourseCard course={course} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
