import type { CourseLevel } from './index';
import type { InstructorCourseStatus } from './instructor';

/** Platform administration types. Shapes mirror what an admin API would return. */

export interface AdminSettings {
  platformName: string;
  currency: 'INR';
  language: string;
  requireCourseApproval: boolean;
  enableReviews: boolean;
  enableCertificates: boolean;
  allowStudentRegistration: boolean;
  allowInstructorApplications: boolean;
  notifyCourseSubmitted: boolean;
  notifyInstructorApplication: boolean;
  notifyNewOrder: boolean;
  notifyRefundRequest: boolean;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin';
  settings: AdminSettings;
}

export type AdminCourseStatus = InstructorCourseStatus;

/**
 * Where a course comes from:
 * - `catalog`: the built-in catalog (data/courses.ts)
 * - `submission`: sample submissions that only exist in the admin demo data
 * - `instructor`: created in the course builder by a signed-up instructor (live, from localStorage)
 */
export type AdminCourseSource = 'catalog' | 'submission' | 'instructor';

export interface AdminCourse {
  id: string;
  source: AdminCourseSource;
  title: string;
  instructor: string;
  /** Owner account for builder courses */
  instructorEmail?: string;
  category: string;
  level: CourseLevel;
  status: AdminCourseStatus;
  students: number;
  rating: number | null;
  price: number;
  revenue: number;
  /** Unsplash id or data URL */
  image: string;
  /** ISO timestamps */
  submittedAt?: string;
  updatedAt: string;
  /** Feedback or rejection reason from the last review */
  reviewNote?: string;
}

export type AdminInstructorStatus = 'Active' | 'Pending' | 'Suspended';

export interface AdminInstructor {
  id: string;
  name: string;
  email: string;
  headline: string;
  bio: string;
  specializations: string[];
  courses: number;
  students: number;
  rating: number;
  revenue: number;
  certificates: number;
  status: AdminInstructorStatus;
  /** ISO date */
  joinedAt: string;
  photoId?: string;
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface AdminApplication {
  id: string;
  name: string;
  email: string;
  expertise: string;
  experience: string;
  category: string;
  about: string;
  /** ISO timestamp */
  appliedAt: string;
  status: ApplicationStatus;
  /** True for an application submitted through /teach/register in this browser */
  live?: boolean;
}

export type AdminStudentStatus = 'Active' | 'Inactive' | 'Suspended';

export interface AdminEnrollment {
  courseId: string;
  title: string;
  progress: number;
  status: 'In progress' | 'Completed' | 'Not started';
  lastActive: string;
}

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  photoId?: string;
  courses: number;
  completed: number;
  progress: number;
  learningHours: number;
  certificates: number;
  lastActive: string;
  status: AdminStudentStatus;
  joinedAt: string;
  enrollments: AdminEnrollment[];
}

export type OrderStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';

export interface AdminOrder {
  id: string;
  student: string;
  studentEmail: string;
  courses: string[];
  amount: number;
  paymentMethod: 'Card' | 'UPI' | 'Net Banking' | 'Wallet';
  /** ISO timestamp */
  date: string;
  status: OrderStatus;
}

export interface AdminCategory {
  id: string;
  name: string;
  description: string;
  /** Key into the admin icon set */
  icon: string;
  status: 'Active' | 'Disabled';
}

export type AdminNotificationKind = 'review' | 'application' | 'refund' | 'enterprise' | 'order';

export interface AdminNotification {
  id: string;
  kind: AdminNotificationKind;
  message: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export type AdminActivityKind = 'application' | 'submitted' | 'published' | 'registered' | 'refund' | 'enterprise';

export interface AdminActivity {
  id: string;
  kind: AdminActivityKind;
  message: string;
  createdAt: string;
}
