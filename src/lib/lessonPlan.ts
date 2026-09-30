import type { Course } from '../types';
import { courseDetails } from '../data/courseDetails';

export interface PlanLesson {
  /** Stable id: "<courseId>:<index>" */
  id: string;
  index: number;
  title: string;
  /** Exact length, e.g. 725 for "12:05" */
  seconds: number;
  /** Rounded length for compact labels */
  minutes: number;
  sectionIndex: number;
  sectionTitle: string;
}

export interface PlanSection {
  title: string;
  lessons: PlanLesson[];
}

export interface LessonPlan {
  sections: PlanSection[];
  lessons: PlanLesson[];
}

/** "12:05" → 725, "1:12:45" → 4365 */
function toSeconds(duration: string) {
  return duration.split(':').map(Number).reduce((total, part) => total * 60 + part, 0);
}

/** Outline for courses without a written curriculum yet; weights set each lesson's relative length. */
const genericOutline: { title: string; lessons: [string, number][] }[] = [
  {
    title: 'Getting Started',
    lessons: [
      ['Welcome and course overview', 1],
      ['How this course is structured', 1],
      ['Setting up your workspace', 2],
    ],
  },
  {
    title: 'Core Skills',
    lessons: [
      ['Key concepts explained', 3],
      ['Guided walkthrough', 4],
      ['Practice exercise', 3],
      ['Common mistakes to avoid', 2],
    ],
  },
  {
    title: 'Applying What You Learned',
    lessons: [
      ['Project brief', 1],
      ['Building the project step by step', 5],
      ['Reviewing your work', 2],
    ],
  },
  {
    title: 'Next Steps',
    lessons: [
      ['Course recap', 1],
      ['Where to go from here', 1],
    ],
  },
];

const cache = new Map<string, LessonPlan>();

export function lessonPlan(course: Course): LessonPlan {
  const cached = cache.get(course.id);
  if (cached) return cached;

  const detail = courseDetails[course.id];
  let index = 0;
  const make = (title: string, seconds: number, sectionIndex: number, sectionTitle: string): PlanLesson => ({
    id: `${course.id}:${index}`,
    index: index++,
    title,
    seconds,
    minutes: Math.max(1, Math.round(seconds / 60)),
    sectionIndex,
    sectionTitle,
  });

  let sections: PlanSection[];
  if (detail) {
    sections = detail.curriculum.map((section, s) => ({
      title: section.title,
      lessons: section.lectures.map((lecture) => make(lecture.title, toSeconds(lecture.duration), s, section.title)),
    }));
  } else {
    // These are representative lessons, not the full course, so keep lengths realistic (≈4–45 min)
    // and scale them gently with the course length.
    const minutesPerWeight = 4 + Math.min(course.hours, 50) / 10;
    sections = genericOutline.map((section, s) => ({
      title: section.title,
      lessons: section.lessons.map(([title, weight]) =>
        // A few extra seconds so durations read naturally (12:37 rather than 12:00).
        make(title, Math.max(3, Math.round(weight * minutesPerWeight)) * 60 + ((title.length * 37) % 60), s, section.title),
      ),
    }));
  }

  const plan = { sections, lessons: sections.flatMap((section) => section.lessons) };
  cache.set(course.id, plan);
  return plan;
}
