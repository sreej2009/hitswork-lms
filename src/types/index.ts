import type { LucideIcon } from 'lucide-react';

export type AccentKey =
  | 'blue'
  | 'green'
  | 'pink'
  | 'orange'
  | 'purple'
  | 'cyan'
  | 'indigo'
  | 'teal'
  | 'rose';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export type CourseBadge = 'Bestseller' | 'Top Rated' | 'Hot & New';

export interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  rating: number;
  reviews: number;
  students: number;
  hours: number;
  level: CourseLevel;
  price: number;
  originalPrice: number;
  image: string;
  imageAlt: string;
  badge?: CourseBadge;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  accent: AccentKey;
  courseCount: number;
  topics: string[];
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: AccentKey;
}

export interface Stat {
  value: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}
