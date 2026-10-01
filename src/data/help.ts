import { Briefcase, CreditCard, PlayCircle, Presentation, Rocket, UserRound, type LucideIcon } from 'lucide-react';
import type { AccentKey } from '../types';

export type HelpCategoryId = 'getting-started' | 'courses' | 'payments' | 'account' | 'teaching' | 'business';

export interface HelpCategory {
  id: HelpCategoryId;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: AccentKey;
}

export const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn how to create an account and start learning.',
    icon: Rocket,
    accent: 'indigo',
  },
  {
    id: 'courses',
    title: 'Courses & Learning',
    description: 'Course access, progress and learning questions.',
    icon: PlayCircle,
    accent: 'cyan',
  },
  {
    id: 'payments',
    title: 'Payments & Billing',
    description: 'Purchases, refunds and payment questions.',
    icon: CreditCard,
    accent: 'green',
  },
  {
    id: 'account',
    title: 'Account & Profile',
    description: 'Password, profile and account settings.',
    icon: UserRound,
    accent: 'purple',
  },
  {
    id: 'teaching',
    title: 'Teaching on Hitswork',
    description: 'Course creation and instructor support.',
    icon: Presentation,
    accent: 'orange',
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Teams, enterprise learning and business solutions.',
    icon: Briefcase,
    accent: 'pink',
  },
];

export interface HelpArticle {
  id: string;
  category: HelpCategoryId;
  question: string;
  answer: string;
  /** Extra search terms that don't appear in the text */
  keywords?: string[];
  /** Listed under "Popular Questions" */
  popular?: boolean;
}

export const helpArticles: HelpArticle[] = [
  // Getting started
  {
    id: 'create-account',
    category: 'getting-started',
    question: 'How do I create a Hitswork account?',
    answer:
      'Select Sign Up in the top-right corner, enter your name and email, choose a secure password and accept the Terms of Use. You’ll be signed in straight away and taken to your dashboard.',
    keywords: ['register', 'sign up', 'join', 'new account'],
    popular: true,
  },
  {
    id: 'enroll',
    category: 'getting-started',
    question: 'How do I enroll in a course?',
    answer:
      'Open any course from the Courses page and select Enroll Now to check out that course, or Add to Cart to buy several together. Free courses enroll instantly. Once enrolled, the course appears in My Learning.',
    keywords: ['buy', 'purchase', 'join course', 'start course'],
    popular: true,
  },
  {
    id: 'choose-course',
    category: 'getting-started',
    question: 'How do I find the right course for me?',
    answer:
      'Use the search bar or browse by category, then filter by level, rating, duration and price. Each course page shows the curriculum, requirements, instructor and learner reviews so you can decide with confidence.',
    keywords: ['search', 'browse', 'filter', 'recommend'],
  },

  // Courses & learning
  {
    id: 'purchased-courses',
    category: 'courses',
    question: 'Where can I find my purchased courses?',
    answer:
      'Every course you’ve enrolled in is listed in My Learning, available from your profile menu or dashboard. Select Continue Learning to pick up exactly where you left off.',
    keywords: ['my learning', 'enrolled', 'library', 'course access', 'missing course'],
    popular: true,
  },
  {
    id: 'download-certificate',
    category: 'courses',
    question: 'How do I download my certificate?',
    answer:
      'When you complete every lesson in a course, a certificate is issued automatically. Go to Certificates in your dashboard, open the certificate and select Download PDF. You can also share a link to it.',
    keywords: ['certificate', 'completion', 'pdf', 'credential'],
    popular: true,
  },
  {
    id: 'course-progress',
    category: 'courses',
    question: 'How is my course progress saved?',
    answer:
      'Your progress is saved each time you complete a lesson, and the player remembers where you paused a video. Lessons unlock in order, so finish the current lesson to move on.',
    keywords: ['progress', 'resume', 'lesson locked', 'course access'],
  },
  {
    id: 'course-access',
    category: 'courses',
    question: 'How long do I have access to a course?',
    answer:
      'Courses you purchase include lifetime access, including any lessons the instructor adds later. You can learn at your own pace on any device.',
    keywords: ['lifetime', 'expire', 'course access'],
  },

  // Payments & billing
  {
    id: 'refund',
    category: 'payments',
    question: 'How do I request a refund?',
    answer:
      'Eligible purchases are covered by our 30-day money-back guarantee. Contact our support team with your order ID from your receipt, and we’ll review the request and process eligible refunds to your original payment method.',
    keywords: ['refund', 'money back', 'cancel', 'return'],
    popular: true,
  },
  {
    id: 'payment-methods',
    category: 'payments',
    question: 'Which payment methods can I use?',
    answer:
      'Checkout accepts credit and debit cards, UPI, net banking and popular wallets. All prices are shown in Indian Rupees and include applicable taxes before you pay.',
    keywords: ['card', 'upi', 'net banking', 'wallet', 'pay', 'payments'],
  },
  {
    id: 'coupon',
    category: 'payments',
    question: 'How do I apply a coupon code?',
    answer:
      'Add courses to your cart and enter the code in the Coupon box on the cart or checkout page. The discount appears in your order summary before you pay.',
    keywords: ['discount', 'promo', 'offer', 'payments'],
  },

  // Account & profile
  {
    id: 'reset-password',
    category: 'account',
    question: 'How do I reset my password?',
    answer:
      'On the sign-in page, select Forgot password?, enter the email address on your account and follow the link we send you to choose a new password.',
    keywords: ['password', 'forgot', 'reset', 'login', 'sign in'],
    popular: true,
  },
  {
    id: 'change-password',
    category: 'account',
    question: 'How do I change my password?',
    answer:
      'While signed in, open Profile from your account menu and use the Change Password section. Enter your current password, then your new one twice.',
    keywords: ['password', 'security', 'update password'],
  },
  {
    id: 'cant-access-account',
    category: 'account',
    question: 'I can’t access my account',
    answer:
      'Check that you’re using the email address you registered with, then try resetting your password from the sign-in page. If you still can’t get in, contact our support team and we’ll help you recover access.',
    keywords: ['password', 'locked out', 'login', 'sign in', 'cannot', 'can not', 'cant'],
  },
  {
    id: 'update-profile',
    category: 'account',
    question: 'How do I update my profile?',
    answer:
      'Open Profile from your account menu to change your name, email, phone number and country. Select Save Changes when you’re done.',
    keywords: ['name', 'email', 'phone', 'edit profile', 'account'],
    popular: true,
  },
  {
    id: 'notifications',
    category: 'account',
    question: 'How do I manage email notifications?',
    answer:
      'Go to Settings in your dashboard to turn email notifications, course reminders and marketing emails on or off.',
    keywords: ['email', 'settings', 'unsubscribe', 'reminders', 'account'],
  },

  // Teaching
  {
    id: 'become-instructor',
    category: 'teaching',
    question: 'How do I become an instructor?',
    answer:
      'Visit Teach on Hitswork and select Start Teaching to fill in the instructor application. Our team reviews every application, usually within 3–5 working days, and contacts you about next steps.',
    keywords: ['teach', 'instructor', 'apply', 'create course'],
    popular: true,
  },
  {
    id: 'instructor-cost',
    category: 'teaching',
    question: 'Does it cost anything to publish a course?',
    answer:
      'No. Creating and publishing a course is free. Revenue is shared only when a learner enrolls in your paid course.',
    keywords: ['teach', 'instructor', 'fees', 'publish'],
  },
  {
    id: 'instructor-payouts',
    category: 'teaching',
    question: 'How do instructors get paid?',
    answer:
      'Earnings from eligible enrollments are paid monthly to your bank account or UPI ID once they pass the refund window, with an itemised statement.',
    keywords: ['teach', 'instructor', 'earnings', 'payout', 'payments'],
  },

  // Business
  {
    id: 'company-use',
    category: 'business',
    question: 'How can my company use Hitswork?',
    answer:
      'Hitswork for Business gives your teams access to our course library plus admin tools to assign courses, build learning paths and track progress. Visit the For Business page or talk to our team to request a demo.',
    keywords: ['business', 'team', 'enterprise', 'company', 'employees'],
    popular: true,
  },
  {
    id: 'assign-courses',
    category: 'business',
    question: 'Can I assign courses to my team?',
    answer:
      'Yes. Business admins and managers can assign courses or learning paths to people, teams or departments and track completion in reports.',
    keywords: ['business', 'team', 'assign', 'employees'],
  },

  // Support
  {
    id: 'contact-support',
    category: 'getting-started',
    question: 'How do I contact support?',
    answer:
      'Use the form on our Contact page and choose the topic that fits your question. You’ll get a ticket number straight away, and our support team will review your message.',
    keywords: ['help', 'support', 'contact', 'email', 'ticket'],
    popular: true,
  },
];

/** Order of the "Popular Questions" accordion, as listed in the help centre brief. */
const popularOrder = [
  'create-account',
  'enroll',
  'purchased-courses',
  'reset-password',
  'download-certificate',
  'refund',
  'become-instructor',
  'company-use',
  'update-profile',
  'contact-support',
];

export const popularArticles = popularOrder
  .map((id) => helpArticles.find((article) => article.id === id))
  .filter((article): article is HelpArticle => !!article);

export const popularSearches: { label: string; query: string }[] = [
  { label: 'Reset Password', query: 'password' },
  { label: 'Course Access', query: 'course access' },
  { label: 'Payments', query: 'payments' },
  { label: 'Certificates', query: 'certificate' },
  { label: 'Instructor', query: 'instructor' },
  { label: 'Account', query: 'account' },
];
