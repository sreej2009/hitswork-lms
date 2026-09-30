import {
  Award,
  BadgeCheck,
  Bell,
  BookOpenCheck,
  Briefcase,
  Building2,
  ChartNoAxesCombined,
  ClipboardList,
  Code2,
  FileBarChart,
  Gauge,
  KeyRound,
  LayoutDashboard,
  Megaphone,
  Palette,
  Route,
  Settings2,
  TrendingUp,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { AccentKey, Feature } from '../types';

/** Fictional company names shown as text wordmarks (no real logos). */
export const trustedCompanies: { name: string; style: string }[] = [
  { name: 'NOVA', style: 'font-display font-extrabold tracking-[0.28em]' },
  { name: 'Vertex', style: 'font-display font-bold tracking-tight italic' },
  { name: 'Northstar', style: 'font-serif font-semibold italic' },
  { name: 'elevate', style: 'font-sans font-semibold tracking-[-0.04em] lowercase' },
  { name: 'ORBIT', style: 'font-sans font-bold tracking-[0.18em]' },
  { name: 'Lumina', style: 'font-display font-extrabold tracking-[-0.02em]' },
];

export const businessBenefits: Feature[] = [
  {
    title: 'Upskill Your Workforce',
    description: 'Help employees develop relevant technical and professional skills.',
    icon: TrendingUp,
    accent: 'indigo',
  },
  {
    title: 'Centralized Learning',
    description: 'Manage learning across teams from one platform.',
    icon: LayoutDashboard,
    accent: 'cyan',
  },
  {
    title: 'Track Progress',
    description: 'See completion, engagement and learning activity.',
    icon: ChartNoAxesCombined,
    accent: 'purple',
  },
  {
    title: 'Expert-Led Courses',
    description: 'Give employees access to high-quality instructor-led content.',
    icon: BadgeCheck,
    accent: 'green',
  },
  {
    title: 'Custom Learning Paths',
    description: 'Create role-based learning journeys.',
    icon: Route,
    accent: 'orange',
  },
  {
    title: 'Certificates & Recognition',
    description: 'Track achievements and celebrate employee growth.',
    icon: Award,
    accent: 'pink',
  },
];

export const dashboardFeatures: { label: string; description: string; icon: LucideIcon }[] = [
  { label: 'Team Analytics', description: 'Engagement and activity for every team.', icon: Users },
  { label: 'Course Completion', description: 'Who finished what, and when.', icon: BookOpenCheck },
  { label: 'Learning Hours', description: 'Time invested, by person or department.', icon: Gauge },
  { label: 'Skill Progress', description: 'Growth against the skills that matter.', icon: TrendingUp },
  { label: 'Department Reports', description: 'Exportable summaries for leadership.', icon: FileBarChart },
];

export interface LearningPath {
  title: string;
  icon: LucideIcon;
  accent: AccentKey;
  courses: number;
  topics: string[];
  href: string;
}

export const learningPaths: LearningPath[] = [
  {
    title: 'Software Development',
    icon: Code2,
    accent: 'indigo',
    courses: 48,
    topics: ['Frontend', 'Backend', 'Cloud', 'DevOps'],
    href: '/courses?category=development',
  },
  {
    title: 'Business & Leadership',
    icon: Briefcase,
    accent: 'cyan',
    courses: 36,
    topics: ['Leadership', 'Communication', 'Management', 'Strategy'],
    href: '/courses?category=business',
  },
  {
    title: 'Design',
    icon: Palette,
    accent: 'pink',
    courses: 29,
    topics: ['UI/UX', 'Product Design', 'Research', 'Visual Design'],
    href: '/courses?category=design',
  },
  {
    title: 'Sales & Marketing',
    icon: Megaphone,
    accent: 'orange',
    courses: 32,
    topics: ['Sales', 'Digital Marketing', 'Content', 'Analytics'],
    href: '/courses?category=marketing',
  },
];

export type EmployeeStatus = 'Active' | 'Completed' | 'At Risk';

export interface DemoEmployee {
  name: string;
  role: string;
  department: 'Engineering' | 'Design' | 'Marketing' | 'HR';
  progress: number;
  courses: number;
  status: EmployeeStatus;
  photoId: string;
}

export const businessDepartments = ['Engineering', 'Design', 'Marketing', 'HR'] as const;
export const employeeStatuses: EmployeeStatus[] = ['Active', 'Completed', 'At Risk'];

/** Sample employees for the team-management preview. */
export const demoEmployees: DemoEmployee[] = [
  {
    name: 'Arun Kumar',
    role: 'Senior Engineer',
    department: 'Engineering',
    progress: 82,
    courses: 14,
    status: 'Active',
    photoId: '1595152772835-219674b2a8a6',
  },
  {
    name: 'Priya Sharma',
    role: 'Product Designer',
    department: 'Design',
    progress: 94,
    courses: 18,
    status: 'Active',
    photoId: '1607746882042-944635dfe10e',
  },
  {
    name: 'Rahul Menon',
    role: 'Growth Marketer',
    department: 'Marketing',
    progress: 68,
    courses: 11,
    status: 'Active',
    photoId: '1629425733761-caae3b5f2e50',
  },
  {
    name: 'Kavya Reddy',
    role: 'HR Business Partner',
    department: 'HR',
    progress: 100,
    courses: 9,
    status: 'Completed',
    photoId: '1611432579699-484f7990b127',
  },
  {
    name: 'Neha Iyer',
    role: 'Frontend Engineer',
    department: 'Engineering',
    progress: 100,
    courses: 16,
    status: 'Completed',
    photoId: '1580489944761-15a19d654956',
  },
  {
    name: 'Vikram Rao',
    role: 'Content Strategist',
    department: 'Marketing',
    progress: 24,
    courses: 5,
    status: 'At Risk',
    photoId: '1506794778202-cad84cf45f1d',
  },
];

export interface BusinessMetric {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
}

export const businessMetrics: BusinessMetric[] = [
  { value: 86, suffix: '%', label: 'Course Completion' },
  { value: 92, suffix: '%', label: 'Active Learners' },
  { value: 24, suffix: 'K+', label: 'Learning Hours' },
  { value: 4.8, decimals: 1, suffix: '/5', label: 'Average Course Rating' },
];

/** Sample monthly learning hours and completions for the analytics chart. */
export const learningActivity: { month: string; hours: number; completions: number }[] = [
  { month: 'Jan', hours: 2860, completions: 980 },
  { month: 'Feb', hours: 3240, completions: 1120 },
  { month: 'Mar', hours: 3610, completions: 1290 },
  { month: 'Apr', hours: 3420, completions: 1340 },
  { month: 'May', hours: 4180, completions: 1560 },
  { month: 'Jun', hours: 4730, completions: 1830 },
];

export const adminFeatures: { label: string; icon: LucideIcon }[] = [
  { label: 'Employee Management', icon: Users },
  { label: 'Department Management', icon: Building2 },
  { label: 'Course Assignment', icon: ClipboardList },
  { label: 'Learning Paths', icon: Route },
  { label: 'Progress Tracking', icon: TrendingUp },
  { label: 'Reports & Analytics', icon: FileBarChart },
  { label: 'Certificates', icon: Award },
  { label: 'Notifications', icon: Bell },
  { label: 'Role-Based Access', icon: KeyRound },
  { label: 'Admin Controls', icon: Settings2 },
];

export interface BusinessSolution {
  id: 'small-teams' | 'growing' | 'enterprise';
  title: string;
  description: string;
  audience: string;
  highlights: string[];
  cta: string;
  icon: LucideIcon;
}

export const businessSolutions: BusinessSolution[] = [
  {
    id: 'small-teams',
    title: 'Small Teams',
    description: 'For growing teams that want simple centralized learning.',
    audience: 'Typically 5–50 learners',
    highlights: ['Curated course library', 'Team progress dashboard', 'Certificates of completion'],
    cta: 'Explore Plans',
    icon: Users,
  },
  {
    id: 'growing',
    title: 'Growing Businesses',
    description: 'For organizations scaling their workforce and training programs.',
    audience: 'Typically 50–500 learners',
    highlights: ['Custom learning paths', 'Department reports', 'Course assignment & reminders'],
    cta: 'Talk to Sales',
    icon: TrendingUp,
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    description: 'For large organizations needing advanced controls and support.',
    audience: '500+ learners',
    highlights: ['Role-based access & SSO', 'Dedicated success manager', 'Advanced analytics & exports'],
    cta: 'Contact Enterprise',
    icon: UserCog,
  },
];

export interface BusinessTestimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  photoId: string;
}

/** Illustrative testimonials from fictional people and companies. */
export const businessTestimonials: BusinessTestimonial[] = [
  {
    quote:
      'Hitswork gives our teams a simple way to discover relevant courses and track learning progress without creating another complicated workflow.',
    name: 'Meera Krishnan',
    role: 'Head of Learning & Development',
    company: 'Northstar Labs',
    photoId: '1573497019940-1c28c88b4f3e',
  },
  {
    quote:
      'Role-based learning paths cut our engineering onboarding from weeks of ad-hoc sessions to a clear, self-paced plan new hires actually finish.',
    name: 'Vikram Iyer',
    role: 'VP of Engineering',
    company: 'Vertex Systems',
    photoId: '1560250097-0b93528c311a',
  },
  {
    quote:
      'Department reports make it easy to show leadership where learning time goes and which programmes are moving the needle.',
    name: 'Sarah Thomas',
    role: 'People Operations Lead',
    company: 'Lumina Health',
    photoId: '1611432579699-484f7990b127',
  },
];

export const businessFaqs: { question: string; answer: string }[] = [
  {
    question: 'What is Hitswork for Business?',
    answer:
      'Hitswork for Business gives your organization access to our course library plus admin tools to assign courses, build learning paths and track progress across teams — all from one platform.',
  },
  {
    question: 'Can I assign courses to employees?',
    answer:
      'Yes. Admins and managers can assign individual courses or complete learning paths to people, teams or whole departments, with optional due dates and automatic reminders.',
  },
  {
    question: 'Can managers track learning progress?',
    answer:
      'Managers see progress, completions, learning hours and at-risk learners for their teams in real time, and can export reports for reviews.',
  },
  {
    question: 'Can I create custom learning paths?',
    answer:
      'Yes. Combine courses in any order to build role-based journeys for onboarding, promotions or new skills, and track completion for each path.',
  },
  {
    question: 'Can I manage multiple departments?',
    answer:
      'Yes. Organise people into departments and teams, give each its own admins and learning plans, and compare activity across the organization.',
  },
  {
    question: 'Do you provide enterprise support?',
    answer:
      'Enterprise customers get a dedicated customer success manager, onboarding assistance, priority support and help designing learning programmes.',
  },
  {
    question: 'Can employees access courses from mobile?',
    answer:
      'Yes. Hitswork works on any modern phone, tablet or laptop, and progress syncs across devices so employees can learn wherever they are.',
  },
  {
    question: 'How does enterprise pricing work?',
    answer:
      'Pricing depends on the number of learners, the content you need and the admin features you choose. Talk to our team for a quote tailored to your organization.',
  },
];

export const companySizes = ['1–10', '11–50', '51–200', '201–500', '500+'] as const;

export const learningGoals = [
  'Employee Upskilling',
  'Onboarding',
  'Leadership Training',
  'Technical Training',
  'Custom Learning',
  'Other',
] as const;

/** Prefilled company size when arriving from a solution card (`/business/contact?plan=…`). */
export const planCompanySize: Record<BusinessSolution['id'], (typeof companySizes)[number]> = {
  'small-teams': '11–50',
  growing: '51–200',
  enterprise: '500+',
};
