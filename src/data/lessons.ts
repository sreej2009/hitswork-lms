import type { Announcement, Course, Lesson, Resource } from '../types';
import { courseDetails } from './courseDetails';

export interface LessonContent {
  description: string;
  outcomes: string[];
}

/** Hand-written copy for specific lessons, keyed by "<courseId>/<lesson title>". */
const lessonCopy: Record<string, LessonContent> = {
  'web-development/Responsive Layouts with CSS Grid': {
    description:
      'Learn how to create flexible layouts that adapt beautifully across desktop, tablet and mobile devices.',
    outcomes: ['Responsive layouts', 'CSS Grid', 'Flexbox', 'Mobile-first design'],
  },
  'web-development/Flexbox from First Principles': {
    description:
      'Understand how Flexbox distributes space along a single axis, and when to reach for it instead of Grid.',
    outcomes: ['Main and cross axes', 'Alignment and spacing', 'Wrapping content', 'Common Flexbox patterns'],
  },
  'web-development/Thinking in Components': {
    description:
      'Break a page into small, reusable React components and decide where each piece of state should live.',
    outcomes: ['Component boundaries', 'Props vs. state', 'Composition', 'Reusable UI patterns'],
  },
  'web-development/Building a REST API with Express': {
    description:
      'Design and build a REST API with Express, from routing and request validation to structured error responses.',
    outcomes: ['Routing and controllers', 'Request validation', 'HTTP status codes', 'Testing endpoints'],
  },
};

const genericOutcomes = [
  'The core idea behind this lesson',
  'A worked example you can reuse',
  'Common pitfalls and how to avoid them',
  'A short practice task',
];

export function lessonContent(course: Course, lesson: Lesson): LessonContent {
  const custom = lessonCopy[`${course.id}/${lesson.title}`];
  if (custom) return custom;
  // Otherwise pick four of the course's learning outcomes, rotating by lesson so each feels different.
  const learn = courseDetails[course.id]?.learn;
  const outcomes = learn
    ? Array.from({ length: 4 }, (_, i) => learn[(lesson.index + i) % learn.length])
    : genericOutcomes;
  return {
    description: `${lesson.title} is part of “${lesson.sectionTitle}”. Follow along with ${course.instructor} as the key ideas are explained step by step, then put them into practice before moving on to the next lesson.`,
    outcomes,
  };
}

export function courseResources(course: Course): Resource[] {
  if (course.id === 'web-development') {
    return [
      {
        id: 'cheatsheet',
        title: 'Responsive Design Cheatsheet',
        kind: 'pdf',
        size: '1.2 MB',
        description: 'Breakpoints, Grid and Flexbox recipes on two printable pages.',
      },
      {
        id: 'starter',
        title: 'Project Starter Files',
        kind: 'zip',
        size: '4.8 MB',
        description: 'HTML, CSS and JavaScript starter code for every project in the course.',
      },
      {
        id: 'mdn',
        title: 'Useful CSS Resources',
        kind: 'link',
        href: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout',
        description: 'MDN’s guide to modern CSS layout, a great companion to this section.',
      },
    ];
  }
  return [
    {
      id: 'workbook',
      title: `${course.title} — Course Workbook`,
      kind: 'pdf',
      size: '0.9 MB',
      description: 'Key takeaways and exercises for every section.',
    },
    {
      id: 'files',
      title: 'Exercise Files',
      kind: 'zip',
      size: '2.4 MB',
      description: 'Everything you need to follow along with the practical lessons.',
    },
    {
      id: 'syllabus',
      title: 'Course Page & Syllabus',
      kind: 'link',
      href: `/course/${course.id}`,
      description: 'The full curriculum, requirements and instructor details.',
    },
  ];
}

export function courseAnnouncements(course: Course): Announcement[] {
  if (course.id === 'web-development') {
    return [
      { id: 'a1', message: 'New React project files have been added to the Resources tab.', instructor: course.instructor, daysAgo: 2 },
      { id: 'a2', message: 'Module 5 has been updated with new examples for React 19.', instructor: course.instructor, daysAgo: 9 },
      { id: 'a3', message: 'Live Q&A this Friday at 7pm IST — bring your portfolio questions!', instructor: course.instructor, daysAgo: 16 },
    ];
  }
  return [
    { id: 'a1', message: 'New practice exercises have been added to the Resources tab.', instructor: course.instructor, daysAgo: 5 },
    { id: 'a2', message: `Welcome to ${course.title}! Introduce yourself in the Q&A and share your goals.`, instructor: course.instructor, daysAgo: 21 },
  ];
}
