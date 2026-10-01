import { Briefcase, GraduationCap, Presentation, type LucideIcon } from 'lucide-react';
import type { AccentKey } from '../types';

export interface SupportChannel {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: AccentKey;
  /** Example address for this demo — not a configured inbox */
  email: string;
  /** Label in the contact-details list */
  detailLabel: string;
  link: { label: string; href: string };
}

export const supportChannels: SupportChannel[] = [
  {
    title: 'Learner Support',
    description: 'Questions about courses, payments or your account.',
    icon: GraduationCap,
    accent: 'indigo',
    email: 'support@hitswork.com',
    detailLabel: 'Email',
    link: { label: 'Visit Help Center', href: '/help' },
  },
  {
    title: 'Instructor Support',
    description: 'Help with teaching and course creation.',
    icon: Presentation,
    accent: 'orange',
    email: 'instructors@hitswork.com',
    detailLabel: 'Instructor',
    link: { label: 'Teach on Hitswork', href: '/teach' },
  },
  {
    title: 'Business',
    description: 'Talk to us about team learning and enterprise solutions.',
    icon: Briefcase,
    accent: 'cyan',
    email: 'business@hitswork.com',
    detailLabel: 'Business',
    link: { label: 'Talk to Our Team', href: '/business/contact' },
  },
];

export const contactTopics = [
  'Course Support',
  'Account',
  'Payment',
  'Instructor Support',
  'Business',
  'Technical Issue',
  'Other',
] as const;
