import type { NotificationKind } from '../types';

export interface NotificationSeed {
  kind: NotificationKind;
  message: string;
  minutesAgo: number;
  read: boolean;
  href?: string;
}

/** Initial notifications that accompany the sample learning history. */
export const sampleNotifications: NotificationSeed[] = [
  {
    kind: 'lesson',
    message: 'Your React course has a new lesson: Server Actions in Practice.',
    minutesAgo: 35,
    read: false,
    href: '/learn/react-typescript-production',
  },
  {
    kind: 'streak',
    message: 'Your 7-day learning streak is active. Keep it going today!',
    minutesAgo: 180,
    read: false,
    href: '/dashboard',
  },
  {
    kind: 'certificate',
    message: 'You earned a new certificate for Smartphone Photography.',
    minutesAgo: 60 * 24 * 6,
    read: false,
    href: '/certificates',
  },
  {
    kind: 'completed',
    message: 'Congratulations! You completed The Complete Digital Marketing Strategy Course.',
    minutesAgo: 60 * 24 * 11,
    read: true,
    href: '/my-learning?tab=completed',
  },
];
