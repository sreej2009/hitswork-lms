import type { Course, CourseDetail, CurriculumSection } from '../types';
import type {
  CourseLesson,
  CourseSection,
  CourseSettings,
  Instructor,
  InstructorCourse,
  LessonType,
  PromoVideo,
} from '../types/instructor';
import {
  DEFAULT_SETTINGS,
  DESCRIPTION_MIN,
  MIN_OBJECTIVES,
  SUBCATEGORIES,
  SUBTITLE_MAX,
  TITLE_MAX,
} from '../data/courseBuilder';
import { formatClock } from './courseMedia';
import { htmlToText } from './sanitizeHtml';

/** A course with every builder field present. */
export type CourseDraft = InstructorCourse &
  Required<
    Pick<
      InstructorCourse,
      | 'subtitle'
      | 'description'
      | 'subcategory'
      | 'language'
      | 'objectives'
      | 'requirements'
      | 'targetStudents'
      | 'sections'
      | 'pricing'
      | 'price'
      | 'originalPrice'
      | 'currency'
      | 'settings'
      | 'createdAt'
    >
  > & { promoVideo: PromoVideo; promotion: InstructorCourse['promotion'] };

export const newId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/** Thumbnail shown until the instructor uploads their own. */
export const PLACEHOLDER_IMAGE = '1499951360447-b19be8fe80f5';

export function emptyDraft(id = newId('ic')): CourseDraft {
  const now = new Date().toISOString();
  return {
    id,
    title: '',
    category: '',
    level: 'Beginner',
    status: 'Draft',
    image: PLACEHOLDER_IMAGE,
    students: 0,
    rating: null,
    reviews: 0,
    revenue: 0,
    views: 0,
    enrollments: 0,
    completionRate: 0,
    lessons: 0,
    updatedAt: now,
    createdAt: now,
    subtitle: '',
    description: '',
    subcategory: '',
    language: 'English',
    promoVideo: { title: '', description: '' },
    objectives: ['', '', '', ''],
    requirements: [''],
    targetStudents: '',
    sections: [],
    pricing: 'paid',
    price: 0,
    originalPrice: 0,
    currency: 'INR',
    promotion: null,
    settings: { ...DEFAULT_SETTINGS },
  };
}

/** Fills builder fields missing from older courses (e.g. the sample courses). */
export function toDraft(course: InstructorCourse): CourseDraft {
  const base = emptyDraft(course.id);
  return {
    ...base,
    ...course,
    subtitle: course.subtitle ?? '',
    description: course.description ?? '',
    subcategory: course.subcategory ?? '',
    language: course.language ?? 'English',
    promoVideo: course.promoVideo ?? base.promoVideo,
    objectives: course.objectives ?? base.objectives,
    requirements: course.requirements ?? base.requirements,
    targetStudents: course.targetStudents ?? '',
    sections: course.sections ?? [],
    pricing: course.pricing ?? 'paid',
    price: course.price ?? 0,
    originalPrice: course.originalPrice ?? 0,
    currency: 'INR',
    promotion: course.promotion ?? null,
    settings: { ...DEFAULT_SETTINGS, ...course.settings },
    createdAt: course.createdAt ?? course.updatedAt,
  };
}

/** Values stored with the course: trims empty list items and refreshes derived fields. */
export function finaliseDraft(draft: CourseDraft): CourseDraft {
  return {
    ...draft,
    lessons: countLessons(draft.sections),
    updatedAt: new Date().toISOString(),
  };
}

export const countLessons = (sections: CourseSection[]) => sections.reduce((n, s) => n + s.lessons.length, 0);

/* ------------------------------------------------------------------ */
/*  Lessons                                                            */
/* ------------------------------------------------------------------ */

export function newLesson(type: LessonType): CourseLesson {
  const lesson: CourseLesson = { id: newId('ls'), type, title: '', description: '', freePreview: false, resources: [] };
  if (type === 'article') lesson.content = '';
  if (type === 'quiz') {
    const a = newId('op');
    lesson.quiz = {
      questions: [
        {
          id: newId('qq'),
          text: '',
          options: [
            { id: a, text: '' },
            { id: newId('op'), text: '' },
            { id: newId('op'), text: '' },
            { id: newId('op'), text: '' },
          ],
          correctOptionId: a,
        },
      ],
      passingScore: 70,
      attempts: 0,
    };
  }
  if (type === 'assignment') lesson.assignment = { instructions: '', submissionType: 'both', maxScore: 100 };
  return lesson;
}

/** Estimated length in seconds, used for curriculum totals and the course page. */
export function lessonSeconds(lesson: CourseLesson): number {
  if (lesson.type === 'video') return lesson.video?.durationSeconds ?? 0;
  if (lesson.type === 'article')
    return Math.max(60, Math.round((htmlToText(lesson.content ?? '').split(' ').length / 200) * 60));
  if (lesson.type === 'quiz') return (lesson.quiz?.questions.length ?? 0) * 60;
  if (lesson.type === 'assignment') return 15 * 60;
  return 0;
}

/** "Video · 08:24", "Quiz · 5 questions"… */
export function lessonMeta(lesson: CourseLesson): string {
  switch (lesson.type) {
    case 'video':
      return lesson.video ? `Video · ${formatClock(lesson.video.durationSeconds)}` : 'Video · no file yet';
    case 'article':
      return `Article · ${Math.round(lessonSeconds(lesson) / 60)} min read`;
    case 'quiz': {
      const n = lesson.quiz?.questions.length ?? 0;
      return `Quiz · ${n} ${n === 1 ? 'question' : 'questions'}`;
    }
    case 'assignment':
      return `Assignment · ${lesson.assignment?.maxScore ?? 100} points`;
    default: {
      const n = lesson.resources.length;
      return `Resource · ${n} ${n === 1 ? 'file' : 'files'}`;
    }
  }
}

/** Validation for the lesson editor. */
export function lessonErrors(lesson: CourseLesson): string[] {
  const errors: string[] = [];
  if (!lesson.title.trim()) errors.push('Give the lesson a title.');
  if (lesson.type === 'article' && htmlToText(lesson.content ?? '').length < 20)
    errors.push('Write the article content (at least 20 characters).');
  if (lesson.type === 'quiz') {
    const quiz = lesson.quiz;
    if (!quiz?.questions.length) errors.push('Add at least one question.');
    quiz?.questions.forEach((q, i) => {
      if (!q.text.trim()) errors.push(`Question ${i + 1} needs text.`);
      const filled = q.options.filter((o) => o.text.trim());
      if (filled.length < 2) errors.push(`Question ${i + 1} needs at least two answer options.`);
      else if (!q.options.find((o) => o.id === q.correctOptionId)?.text.trim())
        errors.push(`Choose the correct answer for question ${i + 1}.`);
    });
  }
  if (lesson.type === 'assignment' && (lesson.assignment?.instructions.trim().length ?? 0) < 20)
    errors.push('Write the assignment instructions (at least 20 characters).');
  if (lesson.type === 'resource' && lesson.resources.length === 0) errors.push('Attach at least one file.');
  return errors;
}

/* ------------------------------------------------------------------ */
/*  Checklist & submission                                             */
/* ------------------------------------------------------------------ */

export type BuilderStep = 'basics' | 'curriculum' | 'pricing' | 'settings' | 'preview';

export interface ChecklistItem {
  id: 'basics' | 'thumbnail' | 'objectives' | 'curriculum' | 'pricing' | 'settings';
  label: string;
  step: BuilderStep;
  done: boolean;
  /** Blocks submission when not done */
  required: boolean;
  /** What is missing, for the validation dialog */
  issues: string[];
}

export function basicsIssues(d: CourseDraft): string[] {
  const issues: string[] = [];
  const title = d.title.trim();
  if (title.length < 8) issues.push('Course title (at least 8 characters)');
  else if (title.length > TITLE_MAX) issues.push(`Course title (under ${TITLE_MAX} characters)`);
  if (d.subtitle.trim().length < 10) issues.push('Subtitle (at least 10 characters)');
  else if (d.subtitle.length > SUBTITLE_MAX) issues.push(`Subtitle (under ${SUBTITLE_MAX} characters)`);
  if (htmlToText(d.description).length < DESCRIPTION_MIN)
    issues.push(`Description (at least ${DESCRIPTION_MIN} characters)`);
  if (!d.category) issues.push('Category');
  else if (!d.subcategory || !SUBCATEGORIES[d.category]?.includes(d.subcategory)) issues.push('Subcategory');
  if (!d.level) issues.push('Course level');
  if (!d.language) issues.push('Language');
  return issues;
}

export function pricingIssues(d: CourseDraft): string[] {
  if (d.pricing === 'free') return [];
  const issues: string[] = [];
  if (!d.price || d.price < 199) issues.push('Price (at least ₹199 for paid courses)');
  if (d.originalPrice && d.originalPrice < d.price) issues.push('Original price must be higher than the price');
  if (d.promotion) {
    if (!d.promotion.price || d.promotion.price >= d.price)
      issues.push('Promotional price must be lower than the price');
    if (!d.promotion.startDate || !d.promotion.endDate) issues.push('Promotion start and end dates');
    else if (d.promotion.endDate < d.promotion.startDate) issues.push('Promotion must end after it starts');
  }
  return issues;
}

export function curriculumIssues(d: CourseDraft): string[] {
  const issues: string[] = [];
  if (d.sections.length === 0) issues.push('At least one section');
  if (countLessons(d.sections) === 0) issues.push('At least one lesson');
  d.sections.forEach((s, i) => {
    if (!s.title.trim()) issues.push(`A title for section ${i + 1}`);
  });
  return issues;
}

export function checklist(d: CourseDraft): ChecklistItem[] {
  const basics = basicsIssues(d);
  const curriculum = curriculumIssues(d);
  const pricing = pricingIssues(d);
  const objectives = d.objectives.filter((o) => o.trim()).length;
  return [
    { id: 'basics', label: 'Basic Information', step: 'basics', done: !basics.length, required: true, issues: basics },
    {
      id: 'thumbnail',
      label: 'Thumbnail',
      step: 'basics',
      done: !!d.thumbnail,
      required: true,
      issues: d.thumbnail ? [] : ['Course thumbnail'],
    },
    {
      id: 'objectives',
      label: 'Learning Objectives',
      step: 'basics',
      done: objectives >= MIN_OBJECTIVES,
      required: false,
      issues: objectives >= MIN_OBJECTIVES ? [] : [`${MIN_OBJECTIVES} learning objectives recommended`],
    },
    {
      id: 'curriculum',
      label: 'Curriculum',
      step: 'curriculum',
      done: !curriculum.length,
      required: true,
      issues: curriculum,
    },
    { id: 'pricing', label: 'Pricing', step: 'pricing', done: !pricing.length, required: true, issues: pricing },
    { id: 'settings', label: 'Settings', step: 'settings', done: true, required: false, issues: [] },
  ];
}

export const completionPercent = (items: ChecklistItem[]) =>
  Math.round((items.filter((i) => i.done).length / items.length) * 100);

export const canSubmit = (items: ChecklistItem[]) => items.every((i) => !i.required || i.done);

/* ------------------------------------------------------------------ */
/*  Learner-facing preview                                             */
/* ------------------------------------------------------------------ */

/** Price learners would pay today, taking an active promotion into account. */
export function effectivePrice(d: CourseDraft, today = new Date().toISOString().slice(0, 10)) {
  if (d.pricing === 'free') return 0;
  const p = d.promotion;
  if (p && p.price && p.startDate <= today && today <= p.endDate) return p.price;
  return d.price;
}

/** Builds the catalog-shaped `Course` + `CourseDetail` so the Course Details page can render a draft. */
export function toCatalogPreview(d: CourseDraft, instructor: Instructor): { course: Course; detail: CourseDetail } {
  const seconds = d.sections.reduce((total, s) => total + s.lessons.reduce((t, l) => t + lessonSeconds(l), 0), 0);
  const price = effectivePrice(d);
  const curriculum: CurriculumSection[] = d.sections.map((section) => ({
    title: section.title || 'Untitled section',
    lectureCount: section.lessons.length,
    minutes: Math.round(section.lessons.reduce((t, l) => t + lessonSeconds(l), 0) / 60),
    lectures: section.lessons.map((lesson) => ({
      title: lesson.title || 'Untitled lesson',
      duration: lesson.type === 'video' ? formatClock(lessonSeconds(lesson)) : lessonMeta(lesson).split(' · ')[0],
      preview: lesson.freePreview,
    })),
  }));
  const course: Course = {
    id: `preview-${d.id}`,
    title: d.title || 'Untitled course',
    category: d.category || 'Development',
    instructor: instructor.name,
    rating: d.rating ?? 0,
    reviews: d.reviews,
    students: d.students,
    hours: Math.max(0.5, Math.round((seconds / 3600) * 2) / 2),
    level: d.level,
    price,
    originalPrice: d.pricing === 'free' ? 0 : Math.max(d.originalPrice || d.price, price),
    image: d.thumbnail || d.image,
    imageAlt: d.title,
  };
  const detail: CourseDetail = {
    subcategory: d.subcategory || d.category || 'Course',
    tagline: d.subtitle,
    lastUpdated: d.updatedAt.slice(0, 7),
    language: d.language,
    totals: { sections: d.sections.length, lectures: countLessons(d.sections) },
    learn: d.objectives.filter((o) => o.trim()),
    requirements: d.requirements.filter((r) => r.trim()),
    audience: d.targetStudents
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean),
    description: [],
    curriculum,
    reviews: [],
  };
  return { course, detail };
}

export const defaultSettings = (): CourseSettings => ({ ...DEFAULT_SETTINGS });
