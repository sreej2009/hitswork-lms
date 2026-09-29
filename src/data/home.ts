import { Award, BadgeCheck, Clock3, GraduationCap, Infinity as InfinityIcon, Wallet, Globe } from 'lucide-react';
import type { Feature, Stat } from '../types';

export const heroStats: Stat[] = [
  { value: '50K+', label: 'Students' },
  { value: '10K+', label: 'Courses' },
  { value: '500+', label: 'Instructors' },
  { value: '100+', label: 'Partner Universities' },
];

export const heroImage = {
  id: '1544717305-2782549b5136',
  alt: 'Smiling young professional holding a notebook, ready to learn',
};

export const upgradeImage = {
  id: '1603575448878-868a20723f5d',
  alt: 'Student concentrating while taking an online course on his laptop',
};

export const learnerAvatars = [
  { id: '1494790108377-be9c29b29330', alt: 'Hitswork learner' },
  { id: '1507003211169-0a1dd7228f2d', alt: 'Hitswork learner' },
  { id: '1438761681033-6461ffad8d80', alt: 'Hitswork learner' },
  { id: '1500648767791-00dcc994a43e', alt: 'Hitswork learner' },
];

export const upgradeHighlights = [
  { label: 'Learn from Experts', icon: GraduationCap },
  { label: 'Get Certified', icon: Award },
  { label: 'Lifetime Access', icon: InfinityIcon },
];

export const features: Feature[] = [
  {
    title: 'Expert Instructors',
    description: 'Learn from industry experts and top universities',
    icon: BadgeCheck,
    accent: 'indigo',
  },
  {
    title: 'Flexible Learning',
    description: 'Learn at your own pace, anytime, anywhere',
    icon: Clock3,
    accent: 'cyan',
  },
  {
    title: 'Globally Recognized',
    description: 'Earn certificates valued by top companies',
    icon: Globe,
    accent: 'pink',
  },
  {
    title: 'Affordable Pricing',
    description: 'High-quality education for everyone',
    icon: Wallet,
    accent: 'green',
  },
];
