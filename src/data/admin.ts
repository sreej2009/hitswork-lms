import type {
  AdminActivity,
  AdminApplication,
  AdminCategory,
  AdminCourse,
  AdminInstructor,
  AdminNotification,
  AdminOrder,
  AdminSettings,
  AdminStudent,
} from '../types/admin';
import type { CourseLesson, CourseSection } from '../types/instructor';
import { categories } from './categories';
import { courses } from './courses';
import { getInstructor, instructorSlug } from './instructors';

/**
 * Sample data for the admin panel. Figures are demo values (labelled "Sample data" in the UI).
 * Timestamps are relative to when the data is first created so "2 hours ago" reads naturally.
 */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const ago = (ms: number, now = Date.now()) => new Date(now - ms).toISOString();

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  platformName: 'Hitswork',
  currency: 'INR',
  language: 'English',
  requireCourseApproval: true,
  enableReviews: true,
  enableCertificates: true,
  allowStudentRegistration: true,
  allowInstructorApplications: true,
  notifyCourseSubmitted: true,
  notifyInstructorApplication: true,
  notifyNewOrder: false,
  notifyRefundRequest: true,
};

/** Headline numbers for the dashboard (sample values). */
export const platformMetrics = {
  students: 52_480,
  instructors: 2_184,
  publishedCourses: 10_248,
  revenue: 4_820_000,
  monthlyEnrollments: 8_420,
};

export const instructorSummary = { total: 2_184, active: 1_942, pending: 42, suspended: 18 };
export const studentSummary = { total: 52_480, active: 41_820, newThisMonth: 4_240, completed: 18_640 };

/* ------------------------------------------------------------------ */
/*  Courses                                                            */
/* ------------------------------------------------------------------ */

/** Revenue shares of the sample ₹48.2L, proportional to each course's sales volume. */
const totalVolume = courses.reduce((sum, c) => sum + c.price * c.students, 0);

export function catalogAdminCourses(now = Date.now()): AdminCourse[] {
  return courses.map((course, index) => ({
    id: course.id,
    source: 'catalog',
    title: course.title,
    instructor: course.instructor,
    category: course.category,
    level: course.level,
    status: 'Published',
    students: course.students,
    rating: course.rating,
    price: course.price,
    revenue: Math.round(((course.price * course.students) / totalVolume) * platformMetrics.revenue),
    image: course.image,
    updatedAt: ago((index % 40) * DAY + (index % 7) * HOUR, now),
  }));
}

interface SubmissionSeed {
  id: string;
  title: string;
  instructor: string;
  category: string;
  level: AdminCourse['level'];
  price: number;
  image: string;
  status: AdminCourse['status'];
  submittedAgo: number;
  reviewNote?: string;
}

const submissionSeeds: SubmissionSeed[] = [
  {
    id: 'sub-react-architecture',
    title: 'Advanced React Architecture',
    instructor: 'Sree Kumar',
    category: 'Development',
    level: 'Advanced',
    price: 7499,
    image: '1633356122544-f134324a6cee',
    status: 'Pending Review',
    submittedAgo: 2 * HOUR,
  },
  {
    id: 'sub-uiux-masterclass',
    title: 'UI/UX Design Masterclass',
    instructor: 'Ananya Sharma',
    category: 'Design',
    level: 'Intermediate',
    price: 5999,
    image: '1581291518857-4e27b48ff24e',
    status: 'Pending Review',
    submittedAgo: 5 * HOUR,
  },
  {
    id: 'sub-python-analysis',
    title: 'Python for Data Analysis',
    instructor: 'Rahul Menon',
    category: 'Development',
    level: 'Beginner',
    price: 4999,
    image: '1551288049-bebda4e38f71',
    status: 'Pending Review',
    submittedAgo: DAY,
  },
  {
    id: 'sub-content-playbook',
    title: 'The Content Marketing Playbook',
    instructor: 'Priya Nair',
    category: 'Marketing',
    level: 'All Levels',
    price: 3999,
    image: '1504868584819-f8e8b4b6d7e3',
    status: 'Pending Review',
    submittedAgo: 2 * DAY,
  },
  {
    id: 'sub-aws-foundations',
    title: 'Cloud Foundations with AWS',
    instructor: 'Arjun Rao',
    category: 'IT & Software',
    level: 'Beginner',
    price: 5499,
    image: '1550751827-4bd374c3f58b',
    status: 'Changes Requested',
    submittedAgo: 4 * DAY,
    reviewNote: 'Please add captions to the video lessons and a quiz at the end of section 2.',
  },
  {
    id: 'sub-crypto-riches',
    title: 'Get Rich With Crypto in 7 Days',
    instructor: 'Mark Stevens',
    category: 'Business',
    level: 'Beginner',
    price: 9999,
    image: '1554224155-6726b3ff858f',
    status: 'Rejected',
    submittedAgo: 9 * DAY,
    reviewNote: 'Courses must not promise guaranteed financial returns.',
  },
  {
    id: 'sub-figma-motion',
    title: 'Motion Design in Figma',
    instructor: 'Ananya Sharma',
    category: 'Design',
    level: 'Intermediate',
    price: 4499,
    image: '1626785774573-4b799315345d',
    status: 'Draft',
    submittedAgo: 6 * DAY,
  },
];

export function submissionAdminCourses(now = Date.now()): AdminCourse[] {
  return submissionSeeds.map((seed) => ({
    id: seed.id,
    source: 'submission',
    title: seed.title,
    instructor: seed.instructor,
    category: seed.category,
    level: seed.level,
    status: seed.status,
    students: 0,
    rating: null,
    price: seed.price,
    revenue: 0,
    image: seed.image,
    submittedAt: seed.status === 'Draft' ? undefined : ago(seed.submittedAgo, now),
    updatedAt: ago(seed.submittedAgo, now),
    reviewNote: seed.reviewNote,
  }));
}

const lesson = (
  id: string,
  type: CourseLesson['type'],
  title: string,
  extra: Partial<CourseLesson> = {},
): CourseLesson => ({
  id,
  type,
  title,
  description: '',
  freePreview: false,
  resources: [],
  ...extra,
});

/** Review content for sample submissions: what the instructor wrote in the builder. */
export function submissionContent(id: string) {
  const seed = submissionSeeds.find((s) => s.id === id);
  if (!seed) return null;
  const topic = seed.title;
  const sections: CourseSection[] = [
    {
      id: `${id}-s1`,
      title: 'Getting Started',
      description: `What you need before diving into ${topic}.`,
      lessons: [
        lesson(`${id}-l1`, 'video', 'Welcome and course overview', {
          freePreview: true,
          description: 'Meet your instructor and see what you will build.',
          video: { name: 'welcome.mp4', size: 48_000_000, type: 'video/mp4', durationSeconds: 412 },
        }),
        lesson(`${id}-l2`, 'article', 'How to get the most from this course', {
          content:
            '<p>Work through each section in order and complete the exercises.</p><ul><li>Watch the lesson</li><li>Try the exercise</li><li>Check the solution</li></ul>',
        }),
        lesson(`${id}-l3`, 'resource', 'Starter files', {
          resources: [
            { name: 'starter-kit.zip', size: 2_400_000, type: 'application/zip' },
            { name: 'cheat-sheet.pdf', size: 380_000, type: 'application/pdf' },
          ],
        }),
      ],
    },
    {
      id: `${id}-s2`,
      title: 'Core Concepts',
      description: 'The fundamentals, step by step.',
      lessons: [
        lesson(`${id}-l4`, 'video', 'Key ideas explained', {
          video: { name: 'core-ideas.mp4', size: 96_000_000, type: 'video/mp4', durationSeconds: 1_064 },
          resources: [{ name: 'slides.pdf', size: 1_200_000, type: 'application/pdf' }],
        }),
        lesson(`${id}-l5`, 'quiz', 'Check your understanding', {
          quiz: {
            passingScore: 70,
            attempts: 0,
            questions: [
              {
                id: `${id}-q1`,
                text: `Which statement best describes the goal of ${topic}?`,
                options: [
                  { id: 'a', text: 'Building practical, real-world skills' },
                  { id: 'b', text: 'Memorising definitions' },
                  { id: 'c', text: 'Passing a single exam' },
                ],
                correctOptionId: 'a',
              },
            ],
          },
        }),
        lesson(`${id}-l6`, 'assignment', 'Mini project', {
          assignment: {
            instructions:
              'Apply what you learned to a small project and submit a short write-up explaining your decisions.',
            submissionType: 'both',
            maxScore: 100,
          },
        }),
      ],
    },
  ];
  return {
    subtitle: `A practical, project-based course on ${topic.toLowerCase()}.`,
    description: `<p>${topic} takes you from the fundamentals to confident, real-world practice.</p><p>Each section ends with an exercise so you can <strong>apply what you learn</strong> straight away.</p>`,
    objectives: [
      'Understand the core concepts',
      'Apply them in a real project',
      'Avoid common mistakes',
      'Build a portfolio piece',
    ],
    requirements: ['A computer with internet access', 'Curiosity and willingness to practise'],
    sections,
  };
}

/* ------------------------------------------------------------------ */
/*  Instructors & applications                                         */
/* ------------------------------------------------------------------ */

const instructorPhotos: Record<string, string> = {
  'Ananya Sharma': '1607746882042-944635dfe10e',
  'Rahul Menon': '1629425733761-caae3b5f2e50',
  'Priya Nair': '1618835962148-cf177563c6c0',
};

export function seedInstructors(now = Date.now()): AdminInstructor[] {
  const names = [...new Set(courses.map((c) => c.instructor))];
  const fromCatalog: AdminInstructor[] = names.map((name, index) => {
    const profile = getInstructor(name);
    const taught = courses.filter((c) => c.instructor === name);
    const specializations = [...new Set(taught.map((c) => c.category))];
    return {
      id: instructorSlug(name),
      name,
      email: `${instructorSlug(name).replace(/-/g, '.')}@example.com`,
      headline: profile.title,
      bio: `${name} teaches ${specializations.join(', ')} on Hitswork, focusing on practical, project-based learning.`,
      specializations,
      courses: profile.courses,
      students: profile.students,
      rating: profile.rating,
      revenue: taught.reduce(
        (sum, c) => sum + Math.round(((c.price * c.students) / totalVolume) * platformMetrics.revenue),
        0,
      ),
      certificates: Math.round(profile.students * 0.18),
      status: index === 7 || index === 15 ? 'Suspended' : 'Active',
      joinedAt: ago((200 + index * 23) * DAY, now).slice(0, 10),
    };
  });
  const extra: AdminInstructor[] = [
    { name: 'Sree Kumar', specializations: ['Development'], status: 'Active' as const },
    { name: 'Ananya Sharma', specializations: ['Design'], status: 'Active' as const },
    { name: 'Rahul Menon', specializations: ['Development'], status: 'Active' as const },
    { name: 'Priya Nair', specializations: ['Marketing'], status: 'Active' as const },
    { name: 'Arjun Rao', specializations: ['IT & Software'], status: 'Pending' as const },
    { name: 'Mark Stevens', specializations: ['Business'], status: 'Suspended' as const },
  ].map((item, index) => ({
    id: instructorSlug(item.name),
    name: item.name,
    email: `${instructorSlug(item.name).replace(/-/g, '.')}@example.com`,
    headline: `${item.specializations[0]} Instructor`,
    bio: `${item.name} is building courses in ${item.specializations[0]} on Hitswork.`,
    specializations: item.specializations,
    courses: item.status === 'Pending' ? 0 : 2 + index,
    students: item.status === 'Pending' ? 0 : 1_200 * (index + 2),
    rating: item.status === 'Pending' ? 0 : 4.5 + (index % 4) / 10,
    revenue: item.status === 'Pending' ? 0 : 48_000 * (index + 1),
    certificates: item.status === 'Pending' ? 0 : 140 * (index + 1),
    status: item.status,
    joinedAt: ago((30 + index * 40) * DAY, now).slice(0, 10),
    photoId: instructorPhotos[item.name],
  }));
  return [...extra, ...fromCatalog];
}

export function seedApplications(now = Date.now()): AdminApplication[] {
  return [
    {
      id: 'app-meera',
      name: 'Meera Krishnan',
      email: 'meera.k@example.com',
      expertise: 'Leadership, Coaching',
      experience: '10+ years',
      category: 'Business',
      about: 'Leadership coach helping first-time managers build confident teams.',
      appliedAt: ago(40 * MINUTE, now),
      status: 'Pending',
    },
    {
      id: 'app-vikram',
      name: 'Vikram Iyer',
      email: 'vikram.i@example.com',
      expertise: 'Kubernetes, DevOps',
      experience: '5–10 years',
      category: 'IT & Software',
      about: 'Platform engineer teaching practical DevOps and cloud-native tooling.',
      appliedAt: ago(6 * HOUR, now),
      status: 'Pending',
    },
    {
      id: 'app-kavya',
      name: 'Kavya Reddy',
      email: 'kavya.r@example.com',
      expertise: 'Carnatic Music, Vocals',
      experience: '10+ years',
      category: 'Music',
      about: 'Performing vocalist teaching Carnatic fundamentals for beginners.',
      appliedAt: ago(DAY + 2 * HOUR, now),
      status: 'Pending',
    },
    {
      id: 'app-daniel',
      name: 'Daniel Joseph',
      email: 'daniel.j@example.com',
      expertise: 'Street Photography',
      experience: '3–5 years',
      category: 'Photography',
      about: 'Photographer teaching composition and editing with a phone or camera.',
      appliedAt: ago(3 * DAY, now),
      status: 'Pending',
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Students                                                           */
/* ------------------------------------------------------------------ */

const studentSeeds: [string, string | undefined, AdminStudent['status'], number][] = [
  ['Arun Kumar', '1595152772835-219674b2a8a6', 'Active', 2],
  ['Priya Sharma', '1607746882042-944635dfe10e', 'Active', 5],
  ['Rahul Menon', '1629425733761-caae3b5f2e50', 'Inactive', 72],
  ['Kavya Reddy', '1611432579699-484f7990b127', 'Active', 24],
  ['Neha Iyer', '1580489944761-15a19d654956', 'Active', 1],
  ['Vikram Rao', '1506794778202-cad84cf45f1d', 'Suspended', 300],
  ['Meera Krishnan', '1573497019940-1c28c88b4f3e', 'Active', 7],
  ['Daniel Joseph', '1560250097-0b93528c311a', 'Active', 48],
  ['Sana Qureshi', '1614644147724-2d4785d69962', 'Active', 29],
  ['Karthik Subramanian', '1531427186611-ecfd6d936c79', 'Inactive', 430],
  ['Ananya Das', '1544005313-94ddf0286df2', 'Active', 3],
  ['Joel Mathew', '1566492031773-4f4e44671857', 'Active', 96],
];

export function seedStudents(now = Date.now()): AdminStudent[] {
  return studentSeeds.map(([name, photoId, status, hoursAgo], index) => {
    const picks = [0, 1, 2, 3].map((k) => courses[(index * 7 + k * 11) % courses.length]).slice(0, 2 + (index % 3));
    const enrollments = picks.map((course, k) => {
      const progress = k === 0 ? 100 : (index * 17 + k * 29) % 100;
      return {
        courseId: course.id,
        title: course.title,
        progress,
        status: (progress === 100
          ? 'Completed'
          : progress === 0
            ? 'Not started'
            : 'In progress') as AdminStudent['enrollments'][number]['status'],
        lastActive: ago(hoursAgo * HOUR + k * DAY, now),
      };
    });
    const completed = enrollments.filter((e) => e.status === 'Completed').length;
    return {
      id: `stu-${instructorSlug(name)}`,
      name,
      email: `${instructorSlug(name).replace(/-/g, '.')}@example.com`,
      photoId,
      courses: enrollments.length,
      completed,
      progress: Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length),
      learningHours: 6 + index * 7,
      certificates: completed,
      lastActive: ago(hoursAgo * HOUR, now),
      status,
      joinedAt: ago((15 + index * 31) * DAY, now).slice(0, 10),
      enrollments,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Orders                                                             */
/* ------------------------------------------------------------------ */

const methods: AdminOrder['paymentMethod'][] = ['Card', 'UPI', 'Net Banking', 'Wallet'];
const orderStatuses: AdminOrder['status'][] = ['Paid', 'Paid', 'Paid', 'Pending', 'Paid', 'Failed', 'Paid', 'Refunded'];

export function seedOrders(now = Date.now()): AdminOrder[] {
  return Array.from({ length: 18 }, (_, index) => {
    const [name] = studentSeeds[index % studentSeeds.length];
    const course = courses[(index * 5 + 3) % courses.length];
    const second = index % 4 === 0 ? courses[(index * 3 + 9) % courses.length] : null;
    return {
      id: `HIT-2026-${(48213 + index * 377).toString(36).toUpperCase()}`,
      student: name,
      studentEmail: `${instructorSlug(name).replace(/-/g, '.')}@example.com`,
      courses: [course.title, ...(second ? [second.title] : [])],
      amount: course.price + (second?.price ?? 0),
      paymentMethod: methods[index % methods.length],
      date: ago(index * 9 * HOUR + index * MINUTE * 13, now),
      status: orderStatuses[index % orderStatuses.length],
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Categories, notifications, activity                                */
/* ------------------------------------------------------------------ */

const categoryIcons: Record<string, string> = {
  development: 'code',
  business: 'briefcase',
  design: 'pen',
  marketing: 'megaphone',
  photography: 'camera',
  music: 'music',
  teaching: 'graduation',
  'it-software': 'monitor',
  'health-fitness': 'heart',
};

export function seedCategories(): AdminCategory[] {
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: `Courses about ${category.topics.join(', ').toLowerCase()} and more.`,
    icon: categoryIcons[category.id] ?? 'layers',
    status: 'Active',
  }));
}

export function seedNotifications(now = Date.now()): AdminNotification[] {
  return [
    {
      id: 'an-1',
      kind: 'review',
      message: 'Courses are waiting for review',
      createdAt: ago(10 * MINUTE, now),
      read: false,
      href: '/admin/courses/pending',
    },
    {
      id: 'an-2',
      kind: 'application',
      message: 'New instructor application from Meera Krishnan',
      createdAt: ago(40 * MINUTE, now),
      read: false,
      href: '/admin/instructors#applications',
    },
    {
      id: 'an-3',
      kind: 'refund',
      message: 'Refund request received for order HIT-2026-11VX',
      createdAt: ago(3 * HOUR, now),
      read: false,
      href: '/admin/orders',
    },
    {
      id: 'an-4',
      kind: 'enterprise',
      message: 'Enterprise inquiry received from Northstar Labs',
      createdAt: ago(DAY, now),
      read: true,
      href: '/admin/reports',
    },
  ];
}

export function adminActivity(now = Date.now()): AdminActivity[] {
  return [
    {
      id: 'aa-1',
      kind: 'application',
      message: 'New instructor application received from Meera Krishnan',
      createdAt: ago(2 * MINUTE, now),
    },
    {
      id: 'aa-2',
      kind: 'submitted',
      message: '“Advanced React Architecture” was submitted for review',
      createdAt: ago(15 * MINUTE, now),
    },
    {
      id: 'aa-3',
      kind: 'published',
      message: '“Git & GitHub for Developers” was published',
      createdAt: ago(HOUR, now),
    },
    { id: 'aa-4', kind: 'registered', message: 'New student registered: Ananya Das', createdAt: ago(3 * HOUR, now) },
    {
      id: 'aa-5',
      kind: 'refund',
      message: 'Refund requested for a Photography Masterclass order',
      createdAt: ago(DAY, now),
    },
    {
      id: 'aa-6',
      kind: 'enterprise',
      message: 'New enterprise inquiry from Northstar Labs',
      createdAt: ago(DAY + 4 * HOUR, now),
    },
  ];
}

export const CATEGORY_ICON_KEYS = [
  'code',
  'briefcase',
  'pen',
  'megaphone',
  'camera',
  'music',
  'graduation',
  'monitor',
  'heart',
  'layers',
] as const;
