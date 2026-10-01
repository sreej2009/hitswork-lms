import { ClipboardCheck, FileText, FolderDown, PenSquare, PlayCircle, type LucideIcon } from 'lucide-react';
import type { CourseSettings, LessonType } from '../types/instructor';

/** Subcategories offered for each builder category. */
export const SUBCATEGORIES: Record<string, string[]> = {
  Development: [
    'Web Development',
    'Mobile Development',
    'Programming Languages',
    'Data Science',
    'Game Development',
    'Databases',
  ],
  Business: ['Entrepreneurship', 'Management', 'Sales', 'Strategy', 'Finance', 'Project Management'],
  Design: ['UI/UX Design', 'Graphic Design', 'Web Design', 'Design Tools', '3D & Animation'],
  Marketing: ['Digital Marketing', 'SEO', 'Social Media Marketing', 'Content Marketing', 'Branding'],
  Photography: ['Digital Photography', 'Portrait Photography', 'Photo Editing', 'Video Production'],
  Music: ['Music Production', 'Instruments', 'Music Theory', 'Vocal'],
  'IT & Software': ['Cloud Computing', 'Network & Security', 'Operating Systems', 'IT Certifications'],
  'Health & Fitness': ['Fitness', 'Yoga', 'Nutrition', 'Mental Health'],
};

export const LANGUAGES = ['English', 'Tamil', 'Hindi', 'Other'] as const;

export const MAX_OBJECTIVES = 8;
export const MIN_OBJECTIVES = 4;
export const MAX_REQUIREMENTS = 8;
export const TITLE_MAX = 80;
export const SUBTITLE_MAX = 120;
export const TARGET_MAX = 500;
export const DESCRIPTION_MIN = 100;

export const DEFAULT_SETTINGS: CourseSettings = {
  visibility: 'Draft',
  allowEnrollments: true,
  certificate: true,
  completionRequirement: 100,
  access: 'lifetime',
  accessDuration: 'Lifetime',
  allowComments: true,
  allowReviews: true,
};

export const LESSON_TYPES: { type: LessonType; label: string; description: string; icon: LucideIcon; tone: string }[] =
  [
    {
      type: 'video',
      label: 'Video Lesson',
      description: 'Upload a video with notes and resources',
      icon: PlayCircle,
      tone: 'bg-brand-50 text-brand-600',
    },
    {
      type: 'article',
      label: 'Article',
      description: 'Written lesson with headings, lists and code',
      icon: FileText,
      tone: 'bg-cyan-50 text-cyan-600',
    },
    {
      type: 'quiz',
      label: 'Quiz',
      description: 'Multiple-choice questions with a pass mark',
      icon: ClipboardCheck,
      tone: 'bg-amber-50 text-amber-600',
    },
    {
      type: 'assignment',
      label: 'Assignment',
      description: 'A task learners submit for grading',
      icon: PenSquare,
      tone: 'bg-violet-50 text-violet-600',
    },
    {
      type: 'resource',
      label: 'Resource',
      description: 'Downloadable files like PDFs or source code',
      icon: FolderDown,
      tone: 'bg-emerald-50 text-emerald-600',
    },
  ];

export const lessonTypeMeta = (type: LessonType) => LESSON_TYPES.find((t) => t.type === type) ?? LESSON_TYPES[0];
