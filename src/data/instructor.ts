import type {
  AnalyticsPoint,
  AnalyticsRange,
  CourseAnalytics,
  Earning,
  Instructor,
  InstructorActivity,
  InstructorCourse,
  InstructorNotification,
  InstructorStudent,
} from '../types/instructor';

/**
 * Sample data for the instructor area. Everything here is demo content: the dashboard labels it as such.
 * Timestamps are generated relative to "now" so relative times ("2 min ago") always read naturally.
 */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const isoAgo = (ms: number, now = Date.now()) => new Date(now - ms).toISOString();

export const SPECIALIZATION_OPTIONS = [
  'Web Development',
  'React',
  'JavaScript',
  'UI/UX',
  'TypeScript',
  'Node.js',
  'Figma',
  'CSS',
] as const;

export function createSampleInstructor(email: string, name: string, now = Date.now()): Instructor {
  return {
    email,
    name,
    headline: 'Full Stack Developer & Lead Instructor',
    bio: 'I help beginners and working developers build real-world web applications. Over the last few years I’ve taught modern JavaScript, React and product design to learners across 120+ countries, with a focus on projects you can put in your portfolio.',
    website: 'https://hitswork.com',
    linkedin: 'https://www.linkedin.com/in/hitswork-instructor',
    specializations: ['Web Development', 'React', 'JavaScript', 'UI/UX'],
    rating: 4.8,
    students: 12_480,
    joinedAt: new Date(now - 420 * DAY).toISOString().slice(0, 10),
    payout: { method: 'bank', accountName: name, bankLast4: '4821', ifsc: 'HDFC0001234', upiId: '' },
  };
}

export function createSampleCourses(now = Date.now()): InstructorCourse[] {
  const at = (ms: number) => isoAgo(ms, now);
  return [
    {
      id: 'ic-web-bootcamp',
      title: 'The Complete Web Development Bootcamp 2026',
      category: 'Development',
      level: 'All Levels',
      status: 'Published',
      image: '1517694712202-14dd9538aa97',
      students: 12_480,
      rating: 4.8,
      reviews: 3_412,
      revenue: 248_500,
      views: 86_400,
      enrollments: 12_480,
      completionRate: 64,
      lessons: 33,
      updatedAt: at(2 * HOUR),
      catalogId: 'web-development',
    },
    {
      id: 'ic-uiux-essentials',
      title: 'UI/UX Design Essentials',
      category: 'Design',
      level: 'Beginner',
      status: 'Published',
      image: '1432888498266-38ffec3eaf0a',
      students: 8_240,
      rating: 4.9,
      reviews: 2_106,
      revenue: 162_000,
      views: 54_200,
      enrollments: 8_240,
      completionRate: 71,
      lessons: 28,
      updatedAt: at(1 * DAY),
      catalogId: 'ui-ux',
    },
    {
      id: 'ic-react-typescript',
      title: 'React & TypeScript: Build Production-Ready Apps',
      category: 'Development',
      level: 'Intermediate',
      status: 'Published',
      image: '1555949963-aa79dcee981c',
      students: 3_120,
      rating: 4.7,
      reviews: 684,
      revenue: 24_500,
      views: 21_800,
      enrollments: 3_120,
      completionRate: 58,
      lessons: 24,
      updatedAt: at(3 * DAY),
      catalogId: 'react-typescript-production',
    },
    {
      id: 'ic-node-apis',
      title: 'Node.js & Express: REST APIs from Scratch',
      category: 'Development',
      level: 'Intermediate',
      status: 'Published',
      image: '1558494949-ef010cbdcc31',
      students: 2_240,
      rating: 4.6,
      reviews: 412,
      revenue: 18_000,
      views: 16_900,
      enrollments: 2_240,
      completionRate: 55,
      lessons: 22,
      updatedAt: at(6 * DAY),
    },
    {
      id: 'ic-typescript-deep-dive',
      title: 'TypeScript Deep Dive',
      category: 'Development',
      level: 'Advanced',
      status: 'Published',
      image: '1498050108023-c5249f4df085',
      students: 1_560,
      rating: 4.8,
      reviews: 298,
      revenue: 12_500,
      views: 11_300,
      enrollments: 1_560,
      completionRate: 61,
      lessons: 18,
      updatedAt: at(9 * DAY),
    },
    {
      id: 'ic-figma-prototyping',
      title: 'Figma Prototyping Workshop',
      category: 'Design',
      level: 'Beginner',
      status: 'Published',
      image: '1581291518857-4e27b48ff24e',
      students: 980,
      rating: 4.7,
      reviews: 176,
      revenue: 8_200,
      views: 7_600,
      enrollments: 980,
      completionRate: 74,
      lessons: 12,
      updatedAt: at(14 * DAY),
    },
    {
      id: 'ic-git-github',
      title: 'Git & GitHub for Developers',
      category: 'Development',
      level: 'Beginner',
      status: 'Published',
      image: '1629654297299-c8506221ca97',
      students: 1_860,
      rating: 4.6,
      reviews: 352,
      revenue: 3_200,
      views: 9_800,
      enrollments: 1_860,
      completionRate: 79,
      lessons: 10,
      updatedAt: at(21 * DAY),
    },
    {
      id: 'ic-css-layout',
      title: 'Modern CSS Layout: Flexbox & Grid',
      category: 'Development',
      level: 'Beginner',
      status: 'Published',
      image: '1558655146-9f40138edfeb',
      students: 720,
      rating: 4.5,
      reviews: 121,
      revenue: 5_600,
      views: 6_200,
      enrollments: 720,
      completionRate: 68,
      lessons: 14,
      updatedAt: at(30 * DAY),
    },
    {
      id: 'ic-javascript-masterclass',
      title: 'JavaScript Masterclass',
      category: 'Development',
      level: 'Intermediate',
      status: 'Draft',
      image: '1587620962725-abab7fe55159',
      students: 0,
      rating: null,
      reviews: 0,
      revenue: 0,
      views: 0,
      enrollments: 0,
      completionRate: 0,
      lessons: 9,
      updatedAt: at(40 * MINUTE),
    },
    {
      id: 'ic-nextjs-app-router',
      title: 'Next.js App Router in Practice',
      category: 'Development',
      level: 'Advanced',
      status: 'Pending Review',
      image: '1633356122544-f134324a6cee',
      students: 0,
      rating: null,
      reviews: 0,
      revenue: 0,
      views: 0,
      enrollments: 0,
      completionRate: 0,
      lessons: 20,
      updatedAt: at(1 * DAY + 3 * HOUR),
    },
    {
      id: 'ic-web-accessibility',
      title: 'Web Accessibility Basics',
      category: 'Development',
      level: 'Beginner',
      status: 'Rejected',
      image: '1499951360447-b19be8fe80f5',
      students: 0,
      rating: null,
      reviews: 0,
      revenue: 0,
      views: 0,
      enrollments: 0,
      completionRate: 0,
      lessons: 6,
      updatedAt: at(12 * DAY),
    },
  ];
}

export function createSampleNotifications(now = Date.now()): InstructorNotification[] {
  const at = (ms: number) => isoAgo(ms, now);
  return [
    {
      id: 'in-1',
      kind: 'enrollment',
      message: 'New student enrolled in The Complete Web Development Bootcamp 2026',
      createdAt: at(2 * MINUTE),
      read: false,
      href: '/instructor/students',
    },
    {
      id: 'in-2',
      kind: 'review',
      message: 'Your course UI/UX Design Essentials received a new 5-star review',
      createdAt: at(1 * HOUR),
      read: false,
      href: '/instructor/analytics',
    },
    {
      id: 'in-3',
      kind: 'approved',
      message: 'Your course Git & GitHub for Developers has been approved',
      createdAt: at(1 * DAY),
      read: false,
      href: '/instructor/courses',
    },
    {
      id: 'in-4',
      kind: 'earnings',
      message: 'Your monthly earnings report is ready',
      createdAt: at(2 * DAY),
      read: true,
      href: '/instructor/earnings',
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Read-only sample data (not persisted)                              */
/* ------------------------------------------------------------------ */

const loadedAt = Date.now();

export const instructorActivity: InstructorActivity[] = [
  {
    id: 'ia-1',
    kind: 'enrollment',
    message: 'New student enrolled in The Complete Web Development Bootcamp 2026',
    createdAt: isoAgo(2 * MINUTE, loadedAt),
  },
  {
    id: 'ia-2',
    kind: 'review',
    message: 'UI/UX Design Essentials received a 5-star review',
    createdAt: isoAgo(HOUR, loadedAt),
  },
  {
    id: 'ia-3',
    kind: 'lesson',
    message: 'A student completed “Building REST APIs” in Node.js & Express',
    createdAt: isoAgo(3 * HOUR, loadedAt),
  },
  {
    id: 'ia-4',
    kind: 'revenue',
    message: 'Revenue for React & TypeScript increased 14% this week',
    createdAt: isoAgo(DAY + 2 * HOUR, loadedAt),
  },
  {
    id: 'ia-5',
    kind: 'submitted',
    message: 'Next.js App Router in Practice was submitted for review',
    createdAt: isoAgo(DAY + 3 * HOUR, loadedAt),
  },
];

/** Headline figures for the Students page (all sample values). */
export const studentSummary = {
  total: 12_480,
  active: 8_920,
  completed: 5_240,
  averageProgress: 68,
};

const enrollment = (courseId: string, progress: number, totalLessons: number) => ({
  courseId,
  progress,
  totalLessons,
  lessonsCompleted: Math.round((progress / 100) * totalLessons),
});

export const instructorStudents: InstructorStudent[] = [
  {
    id: 'st-arun',
    name: 'Arun Kumar',
    email: 'arun.k@example.com',
    photoId: '1595152772835-219674b2a8a6',
    enrollments: [enrollment('ic-web-bootcamp', 82, 33), enrollment('ic-git-github', 100, 10)],
    learningHours: 46,
    lastActive: isoAgo(2 * HOUR, loadedAt),
    status: 'Active',
  },
  {
    id: 'st-priya',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    photoId: '1607746882042-944635dfe10e',
    enrollments: [enrollment('ic-uiux-essentials', 94, 28), enrollment('ic-figma-prototyping', 60, 12)],
    learningHours: 38,
    lastActive: isoAgo(5 * HOUR, loadedAt),
    status: 'Active',
  },
  {
    id: 'st-rahul',
    name: 'Rahul Menon',
    email: 'rahul.m@example.com',
    photoId: '1629425733761-caae3b5f2e50',
    enrollments: [enrollment('ic-typescript-deep-dive', 46, 18)],
    learningHours: 12,
    lastActive: isoAgo(3 * DAY, loadedAt),
    status: 'Inactive',
  },
  {
    id: 'st-kavya',
    name: 'Kavya Reddy',
    email: 'kavya.r@example.com',
    photoId: '1611432579699-484f7990b127',
    enrollments: [enrollment('ic-uiux-essentials', 100, 28)],
    learningHours: 31,
    lastActive: isoAgo(DAY, loadedAt),
    status: 'Completed',
  },
  {
    id: 'st-neha',
    name: 'Neha Iyer',
    email: 'neha.i@example.com',
    photoId: '1580489944761-15a19d654956',
    enrollments: [enrollment('ic-react-typescript', 72, 24), enrollment('ic-web-bootcamp', 100, 33)],
    learningHours: 64,
    lastActive: isoAgo(30 * MINUTE, loadedAt),
    status: 'Active',
  },
  {
    id: 'st-vikram',
    name: 'Vikram Rao',
    email: 'vikram.r@example.com',
    photoId: '1506794778202-cad84cf45f1d',
    enrollments: [enrollment('ic-node-apis', 18, 22)],
    learningHours: 4,
    lastActive: isoAgo(12 * DAY, loadedAt),
    status: 'Inactive',
  },
  {
    id: 'st-meera',
    name: 'Meera Krishnan',
    email: 'meera.k@example.com',
    photoId: '1573497019940-1c28c88b4f3e',
    enrollments: [enrollment('ic-web-bootcamp', 55, 33)],
    learningHours: 21,
    lastActive: isoAgo(7 * HOUR, loadedAt),
    status: 'Active',
  },
  {
    id: 'st-daniel',
    name: 'Daniel Joseph',
    email: 'daniel.j@example.com',
    photoId: '1560250097-0b93528c311a',
    enrollments: [enrollment('ic-css-layout', 100, 14), enrollment('ic-git-github', 80, 10)],
    learningHours: 17,
    lastActive: isoAgo(2 * DAY, loadedAt),
    status: 'Completed',
  },
  {
    id: 'st-sana',
    name: 'Sana Qureshi',
    email: 'sana.q@example.com',
    photoId: '1614644147724-2d4785d69962',
    enrollments: [enrollment('ic-figma-prototyping', 34, 12)],
    learningHours: 6,
    lastActive: isoAgo(DAY + 5 * HOUR, loadedAt),
    status: 'Active',
  },
  {
    id: 'st-karthik',
    name: 'Karthik Subramanian',
    email: 'karthik.s@example.com',
    photoId: '1531427186611-ecfd6d936c79',
    enrollments: [enrollment('ic-web-bootcamp', 12, 33)],
    learningHours: 3,
    lastActive: isoAgo(18 * DAY, loadedAt),
    status: 'Inactive',
  },
  {
    id: 'st-ananya',
    name: 'Ananya Das',
    email: 'ananya.d@example.com',
    photoId: '1544005313-94ddf0286df2',
    enrollments: [enrollment('ic-react-typescript', 88, 24)],
    learningHours: 29,
    lastActive: isoAgo(45 * MINUTE, loadedAt),
    status: 'Active',
  },
  {
    id: 'st-joel',
    name: 'Joel Mathew',
    email: 'joel.m@example.com',
    photoId: '1566492031773-4f4e44671857',
    enrollments: [enrollment('ic-typescript-deep-dive', 100, 18)],
    learningHours: 22,
    lastActive: isoAgo(4 * DAY, loadedAt),
    status: 'Completed',
  },
];

/* ------------------------------------------------------------------ */
/*  Analytics series                                                   */
/* ------------------------------------------------------------------ */

/** Small deterministic wobble so charts look organic but never change between renders. */
const wobble = (i: number, seed: number) => Math.sin(i * 1.7 + seed) * 0.5 + Math.sin(i * 0.6 + seed * 2) * 0.5;

const dayLabel = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' });
const weekdayLabel = new Intl.DateTimeFormat('en-IN', { weekday: 'short' });
const monthLabel = new Intl.DateTimeFormat('en-IN', { month: 'short' });

const rangeConfig: Record<
  AnalyticsRange,
  { count: number; perPoint: number; label: (date: Date, i: number) => string; step: (now: Date, back: number) => Date }
> = {
  '7d': {
    count: 7,
    perPoint: 1,
    label: (date) => weekdayLabel.format(date),
    step: (now, back) => new Date(now.getTime() - back * DAY),
  },
  '30d': {
    count: 30,
    perPoint: 1,
    label: (date) => dayLabel.format(date),
    step: (now, back) => new Date(now.getTime() - back * DAY),
  },
  '3m': {
    count: 13,
    perPoint: 7,
    label: (date) => dayLabel.format(date),
    step: (now, back) => new Date(now.getTime() - back * 7 * DAY),
  },
  '1y': {
    count: 12,
    perPoint: 30.4,
    label: (date) => monthLabel.format(date),
    step: (now, back) => new Date(now.getFullYear(), now.getMonth() - back, 1),
  },
};

export const RANGE_OPTIONS: { value: AnalyticsRange; label: string }[] = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '3m', label: '3 Months' },
  { value: '1y', label: '1 Year' },
];

/** Daily baselines the series are built from (sample values). */
const DAILY = { students: 34, enrollments: 41, revenue: 1_320, views: 290, completions: 15 };

export function buildAnalytics(range: AnalyticsRange, share = 1, now = new Date(loadedAt)): CourseAnalytics {
  const config = rangeConfig[range];
  const points: AnalyticsPoint[] = Array.from({ length: config.count }, (_, index) => {
    const back = config.count - 1 - index;
    const date = config.step(now, back);
    // Gentle growth across the period plus a little noise.
    const trend = 0.78 + (index / Math.max(1, config.count - 1)) * 0.36;
    const scale = (base: number, seed: number) =>
      Math.max(0, Math.round(base * config.perPoint * share * trend * (1 + wobble(index, seed) * 0.18)));
    return {
      label: config.label(date, index),
      students: scale(DAILY.students, 1),
      enrollments: scale(DAILY.enrollments, 2),
      revenue: scale(DAILY.revenue, 3),
      views: scale(DAILY.views, 4),
      completions: scale(DAILY.completions, 5),
    };
  });
  return { range, points };
}

/** Change shown next to each metric, compared with the previous period (sample values). */
export const rangeChange: Record<
  AnalyticsRange,
  { enrollments: number; views: number; completion: number; revenue: number }
> = {
  '7d': { enrollments: 6.8, views: 4.1, completion: 1.2, revenue: 9.4 },
  '30d': { enrollments: 12.4, views: 8.2, completion: 2.6, revenue: 18.6 },
  '3m': { enrollments: 21.3, views: 15.7, completion: 3.9, revenue: 26.2 },
  '1y': { enrollments: 64.0, views: 48.5, completion: 6.1, revenue: 82.3 },
};

/* ------------------------------------------------------------------ */
/*  Earnings                                                           */
/* ------------------------------------------------------------------ */

export const earningsSummary = {
  total: 482_500,
  available: 124_800,
  pending: 42_500,
  thisMonth: 48_600,
  previousMonth: 41_000,
};

const monthlyEarnings = [
  24_300, 27_100, 31_800, 29_400, 33_600, 36_200, 38_900, 42_700, 45_100, 43_800, 41_000, 48_600,
];

/** Last 12 months of earnings, ending with the current month. */
export function earningsByMonth(now = new Date(loadedAt)) {
  return monthlyEarnings.map((value, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (monthlyEarnings.length - 1 - index), 1);
    return { label: monthLabel.format(date), value };
  });
}

const tx = (
  id: number,
  days: number,
  courseId: string,
  student: string,
  amount: number,
  status: Earning['status'],
): Earning => ({
  id: `tx-${id}`,
  date: isoAgo(days * DAY, loadedAt).slice(0, 10),
  courseId,
  student,
  amount,
  status,
});

/** Instructor share per enrollment, after platform fees and taxes (sample values). */
export const instructorTransactions: Earning[] = [
  tx(1, 0, 'ic-web-bootcamp', 'Meera Krishnan', 3_150, 'Pending'),
  tx(2, 0, 'ic-uiux-essentials', 'Sana Qureshi', 2_790, 'Pending'),
  tx(3, 1, 'ic-react-typescript', 'Ananya Das', 2_970, 'Pending'),
  tx(4, 2, 'ic-web-bootcamp', 'Karthik Subramanian', 3_150, 'Completed'),
  tx(5, 3, 'ic-node-apis', 'Vikram Rao', 2_420, 'Refunded'),
  tx(6, 4, 'ic-typescript-deep-dive', 'Joel Mathew', 2_610, 'Completed'),
  tx(7, 5, 'ic-uiux-essentials', 'Kavya Reddy', 2_790, 'Completed'),
  tx(8, 6, 'ic-web-bootcamp', 'Neha Iyer', 3_150, 'Completed'),
  tx(9, 8, 'ic-figma-prototyping', 'Priya Sharma', 1_980, 'Completed'),
  tx(10, 9, 'ic-css-layout', 'Daniel Joseph', 1_640, 'Completed'),
  tx(11, 11, 'ic-git-github', 'Arun Kumar', 760, 'Completed'),
  tx(12, 13, 'ic-web-bootcamp', 'Rahul Menon', 3_150, 'Refunded'),
  tx(13, 15, 'ic-react-typescript', 'Neha Iyer', 2_970, 'Completed'),
  tx(14, 18, 'ic-uiux-essentials', 'Priya Sharma', 2_790, 'Completed'),
];

export const COURSE_CATEGORY_OPTIONS = [
  'Development',
  'Business',
  'Design',
  'Marketing',
  'Photography',
  'Music',
  'IT & Software',
  'Health & Fitness',
] as const;

export const COURSE_LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'] as const;
