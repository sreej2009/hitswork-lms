import {
  Award,
  BarChart3,
  BellRing,
  BookOpenCheck,
  ClipboardCheck,
  Globe2,
  HandCoins,
  LayoutList,
  Megaphone,
  MessagesSquare,
  PenLine,
  PlaySquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import type { AccentKey, Feature, Stat } from '../types';

export const teachHeroImage = {
  id: '1531427186611-ecfd6d936c79',
  alt: 'Smiling Hitswork instructor ready to record a new lesson',
};

export const teachStats: Stat[] = [
  { value: '50K+', label: 'Active Learners' },
  { value: '10K+', label: 'Courses' },
  { value: '2K+', label: 'Instructors' },
  { value: '120+', label: 'Countries' },
];

export const teachFeatures: Feature[] = [
  {
    title: 'Reach More Learners',
    description: 'Share your expertise with students around the world.',
    icon: Globe2,
    accent: 'indigo',
  },
  {
    title: 'Create With Ease',
    description: 'Build professional courses with simple creator tools.',
    icon: PenLine,
    accent: 'cyan',
  },
  {
    title: 'Grow Your Income',
    description: 'Turn your knowledge into a sustainable revenue stream.',
    icon: HandCoins,
    accent: 'green',
  },
  {
    title: 'Build Your Brand',
    description: 'Create your instructor profile and grow your professional audience.',
    icon: Sparkles,
    accent: 'pink',
  },
];

export interface TeachStep {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const teachSteps: TeachStep[] = [
  {
    title: 'Create Your Instructor Profile',
    description: 'Tell learners who you are, what you teach and why you’re the right guide.',
    icon: UserRound,
  },
  {
    title: 'Build Your Course',
    description: 'Plan sections, upload video lessons and add quizzes with the course builder.',
    icon: LayoutList,
  },
  {
    title: 'Publish & Reach Learners',
    description: 'Submit for a quality review, then go live to learners in 120+ countries.',
    icon: Rocket,
  },
  {
    title: 'Teach & Earn',
    description: 'Answer questions, share updates and earn from every eligible enrollment.',
    icon: Wallet,
  },
];

export const toolkitFeatures: { label: string; icon: LucideIcon }[] = [
  { label: 'Course Builder', icon: LayoutList },
  { label: 'Video Lessons', icon: PlaySquare },
  { label: 'Quizzes & Assignments', icon: ClipboardCheck },
  { label: 'Student Analytics', icon: BarChart3 },
  { label: 'Course Reviews', icon: Star },
  { label: 'Announcements', icon: BellRing },
  { label: 'Certificates', icon: Award },
  { label: 'Revenue Tracking', icon: Wallet },
];

/** Illustrative monthly revenue (₹) for the earnings chart — the last point is the current month. */
export const revenueSeries: { month: string; value: number }[] = [
  { month: 'Oct', value: 118_000 },
  { month: 'Nov', value: 126_500 },
  { month: 'Dec', value: 149_000 },
  { month: 'Jan', value: 141_200 },
  { month: 'Feb', value: 158_800 },
  { month: 'Mar', value: 171_400 },
  { month: 'Apr', value: 166_000 },
  { month: 'May', value: 184_300 },
  { month: 'Jun', value: 196_700 },
  { month: 'Jul', value: 203_900 },
  { month: 'Aug', value: 209_500 },
  { month: 'Sep', value: 248_500 },
];

export const earningPoints: Feature[] = [
  {
    title: 'Flexible Pricing',
    description: 'Set your own course price, run promotions and offer coupons.',
    icon: HandCoins,
    accent: 'indigo',
  },
  {
    title: 'Global Learners',
    description: 'Sell to learners in 120+ countries with local-currency checkout.',
    icon: Globe2,
    accent: 'cyan',
  },
  {
    title: 'Transparent Earnings',
    description: 'See every enrollment, refund and payout in a clear monthly report.',
    icon: BarChart3,
    accent: 'purple',
  },
  {
    title: 'Secure Payments',
    description: 'Monthly payouts to your bank account through trusted payment partners.',
    icon: ShieldCheck,
    accent: 'green',
  },
];

export interface FeaturedInstructor {
  name: string;
  specialization: string;
  photoId: string;
  courses: number;
  students: string;
  rating: number;
  quote: string;
  accent: AccentKey;
}

export const featuredInstructors: FeaturedInstructor[] = [
  {
    name: 'Ananya Sharma',
    specialization: 'UI/UX Designer',
    photoId: '1607746882042-944635dfe10e',
    courses: 8,
    students: '18K',
    rating: 4.9,
    quote: 'I started with one Figma course on weekends. Today my students design products at startups across India.',
    accent: 'pink',
  },
  {
    name: 'Rahul Menon',
    specialization: 'Full Stack Developer',
    photoId: '1629425733761-caae3b5f2e50',
    courses: 12,
    students: '32K',
    rating: 4.8,
    quote: 'The course builder let me focus on teaching. Learner questions keep my content sharp and up to date.',
    accent: 'indigo',
  },
  {
    name: 'Priya Nair',
    specialization: 'Digital Marketing Strategist',
    photoId: '1618835962148-cf177563c6c0',
    courses: 7,
    students: '14K',
    rating: 4.9,
    quote: 'Teaching on Hitswork turned years of client work into a structured programme that helps thousands.',
    accent: 'orange',
  },
];

export const teachBenefits: Feature[] = [
  {
    title: 'Global Reach',
    description: 'Put your course in front of learners across 120+ countries from day one.',
    icon: Globe2,
    accent: 'indigo',
  },
  {
    title: 'Analytics',
    description: 'Track enrollments, watch time and completion to see what works.',
    icon: BarChart3,
    accent: 'cyan',
  },
  {
    title: 'Student Engagement',
    description: 'Q&A, announcements and assignments keep learners moving forward.',
    icon: MessagesSquare,
    accent: 'purple',
  },
  {
    title: 'Secure Payments',
    description: 'Reliable monthly payouts with clear, itemised earning statements.',
    icon: ShieldCheck,
    accent: 'green',
  },
  {
    title: 'Course Certificates',
    description: 'Learners earn a branded certificate when they finish your course.',
    icon: BookOpenCheck,
    accent: 'orange',
  },
  {
    title: 'Marketing Support',
    description: 'Eligible courses feature in Hitswork promotions, emails and search.',
    icon: Megaphone,
    accent: 'pink',
  },
];

export const teachFaqs: { question: string; answer: string }[] = [
  {
    question: 'How do I become an instructor?',
    answer:
      'Apply through the instructor application form. Our team reviews your expertise and teaching sample, usually within 3–5 working days. Once approved, you get access to the course builder and can start creating right away.',
  },
  {
    question: 'Do I need previous teaching experience?',
    answer:
      'No. Many of our instructors are practitioners teaching for the first time. What matters is real expertise in your subject and a willingness to explain it clearly — our creator guides and quality checklist help with the rest.',
  },
  {
    question: 'How much does it cost to publish a course?',
    answer:
      'Nothing. Creating and publishing a course on Hitswork is free. We share revenue only when a learner enrolls in your paid course, so there are no upfront or monthly fees.',
  },
  {
    question: 'How do instructors get paid?',
    answer:
      'Earnings from eligible enrollments are paid monthly to your bank account or UPI ID once they pass the refund window. Your revenue dashboard shows every enrollment, refund and payout in detail.',
  },
  {
    question: 'Can I update my course after publishing?',
    answer:
      'Yes. You can add lessons, replace videos, update resources and post announcements at any time. Enrolled learners automatically get access to the new content.',
  },
  {
    question: 'Can I teach students internationally?',
    answer:
      'Absolutely. Hitswork learners come from 120+ countries. Courses can be taught in any language, and learners pay in their local currency at checkout.',
  },
];

export const teachingCategories = [
  'Development',
  'Business',
  'Design',
  'Marketing',
  'Photography',
  'Music',
  'IT & Software',
  'Other',
] as const;

export const experienceOptions = ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years'] as const;

export const applicationNextSteps: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'Application review',
    description: 'Our team reviews your profile within 3–5 working days.',
    icon: ClipboardCheck,
  },
  { title: 'Onboarding call', description: 'A short call to plan your first course together.', icon: Users },
  { title: 'Start creating', description: 'Get access to the course builder and creator guides.', icon: Rocket },
];
