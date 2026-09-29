import {
  BriefcaseBusiness,
  Camera,
  CodeXml,
  GraduationCap,
  HeartPulse,
  Megaphone,
  MonitorCog,
  Music,
  PenTool,
} from 'lucide-react';
import type { AccentKey, Category } from '../types';

export const categories: Category[] = [
  {
    id: 'development',
    name: 'Development',
    icon: CodeXml,
    accent: 'blue',
    courseCount: 15234,
    topics: ['Web Dev', 'Mobile Apps', 'Python'],
  },
  {
    id: 'business',
    name: 'Business',
    icon: BriefcaseBusiness,
    accent: 'green',
    courseCount: 12456,
    topics: ['Strategy', 'Finance', 'Product'],
  },
  {
    id: 'design',
    name: 'Design',
    icon: PenTool,
    accent: 'pink',
    courseCount: 9876,
    topics: ['UI/UX', 'Figma', 'Motion'],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: Megaphone,
    accent: 'orange',
    courseCount: 8234,
    topics: ['Digital', 'SEO', 'Social Media'],
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: Camera,
    accent: 'purple',
    courseCount: 4512,
    topics: ['Portrait', 'Lightroom', 'Video'],
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    accent: 'cyan',
    courseCount: 3890,
    topics: ['Production', 'Guitar', 'Theory'],
  },
  {
    id: 'teaching',
    name: 'Teaching',
    icon: GraduationCap,
    accent: 'indigo',
    courseCount: 2745,
    topics: ['Online Teaching', 'Curriculum', 'EdTech'],
  },
  {
    id: 'it-software',
    name: 'IT & Software',
    icon: MonitorCog,
    accent: 'teal',
    courseCount: 7968,
    topics: ['Cloud', 'Security', 'Networking'],
  },
  {
    id: 'health-fitness',
    name: 'Health & Fitness',
    icon: HeartPulse,
    accent: 'rose',
    courseCount: 3321,
    topics: ['Fitness', 'Nutrition', 'Yoga'],
  },
];

export const topCategoryIds = ['development', 'business', 'design', 'marketing'];

export const topCategories = categories.filter((category) => topCategoryIds.includes(category.id));

const accentByName: Record<string, AccentKey> = {
  ...Object.fromEntries(categories.map((category) => [category.name, category.accent])),
  'Data Science': 'indigo',
};

/** Accent colour for a course's category label. */
export const accentForCategory = (name: string): AccentKey => accentByName[name] ?? 'indigo';
