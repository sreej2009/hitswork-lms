/** Instructor area domain types. Shared by the dashboard now and the course builder next. */

export type InstructorCourseStatus = 'Published' | 'Draft' | 'Pending Review' | 'Changes Requested' | 'Rejected';

export type CourseLevelOption = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export type PayoutMethod = 'bank' | 'upi';

export interface PayoutSettings {
  method: PayoutMethod;
  accountName: string;
  /** Last four digits only — the full number is never stored */
  bankLast4: string;
  ifsc: string;
  upiId: string;
}

export interface Instructor {
  /** Account email (normalised) this instructor profile belongs to */
  email: string;
  name: string;
  headline: string;
  bio: string;
  website: string;
  linkedin: string;
  specializations: string[];
  rating: number;
  /** Lifetime students across all courses */
  students: number;
  /** ISO date */
  joinedAt: string;
  payout: PayoutSettings;
}

/* ------------------------------------------------------------------ */
/*  Course builder                                                     */
/* ------------------------------------------------------------------ */

export type LessonType = 'video' | 'article' | 'quiz' | 'assignment' | 'resource';

/** Metadata for an uploaded file. The file itself lives on the media server (simulated for now). */
export interface MediaFile {
  name: string;
  /** Bytes */
  size: number;
  /** MIME type */
  type: string;
  /** Where the file can be fetched from once a real upload API exists; empty in the demo */
  url?: string;
}

export interface VideoAsset extends MediaFile {
  durationSeconds: number;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface QuizContent {
  questions: QuizQuestion[];
  /** 0–100 */
  passingScore: number;
  /** `0` means unlimited */
  attempts: number;
}

export interface AssignmentContent {
  instructions: string;
  submissionType: 'text' | 'file' | 'both';
  maxScore: number;
}

export interface CourseLesson {
  id: string;
  type: LessonType;
  title: string;
  /** Plain text for video/resource lessons */
  description: string;
  freePreview: boolean;
  video?: VideoAsset;
  /** Sanitised HTML (article lessons) */
  content?: string;
  quiz?: QuizContent;
  assignment?: AssignmentContent;
  resources: MediaFile[];
}

export interface CourseSection {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
}

export interface PromoVideo {
  video?: VideoAsset;
  title: string;
  description: string;
}

export interface CoursePromotion {
  price: number;
  /** ISO dates (yyyy-mm-dd) */
  startDate: string;
  endDate: string;
}

export type CourseVisibility = 'Draft' | 'Published' | 'Unlisted';
export type AccessDuration = 'Lifetime' | '30 Days' | '90 Days' | '1 Year';

export interface CourseSettings {
  visibility: CourseVisibility;
  allowEnrollments: boolean;
  certificate: boolean;
  /** Share of the course a learner must complete for the certificate (%) */
  completionRequirement: number;
  access: 'lifetime' | 'limited';
  accessDuration: AccessDuration;
  allowComments: boolean;
  allowReviews: boolean;
}

export interface InstructorCourse {
  id: string;
  title: string;
  category: string;
  level: CourseLevelOption;
  status: InstructorCourseStatus;
  /** Unsplash photo id for the thumbnail */
  image: string;
  students: number;
  /** `null` until the course has reviews */
  rating: number | null;
  reviews: number;
  /** Lifetime revenue in INR */
  revenue: number;
  views: number;
  enrollments: number;
  /** 0–100 */
  completionRate: number;
  lessons: number;
  /** ISO timestamp */
  updatedAt: string;
  /** Catalog id when the course has a public page on Hitswork */
  catalogId?: string;

  // Course builder content. Optional so sample courses created before the builder still load;
  // `toDraft()` fills the defaults.
  subtitle?: string;
  /** Sanitised HTML */
  description?: string;
  subcategory?: string;
  language?: string;
  /** Data URL of the uploaded thumbnail (replaces `image` once set) */
  thumbnail?: string;
  promoVideo?: PromoVideo;
  objectives?: string[];
  requirements?: string[];
  targetStudents?: string;
  sections?: CourseSection[];
  pricing?: 'free' | 'paid';
  /** INR; 0 for free courses */
  price?: number;
  originalPrice?: number;
  currency?: 'INR';
  promotion?: CoursePromotion | null;
  settings?: CourseSettings;
  /** ISO timestamp */
  createdAt?: string;
  /** ISO timestamp of the last Submit for Review */
  submittedAt?: string;
  /** Admin feedback (changes requested) or rejection reason */
  reviewNote?: string;
}

export type StudentStatus = 'Active' | 'Inactive' | 'Completed';

export interface StudentEnrollment {
  courseId: string;
  /** 0–100 */
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
}

export interface InstructorStudent {
  id: string;
  name: string;
  email: string;
  photoId?: string;
  enrollments: StudentEnrollment[];
  learningHours: number;
  /** ISO timestamp */
  lastActive: string;
  status: StudentStatus;
}

export type AnalyticsRange = '7d' | '30d' | '3m' | '1y';

export interface AnalyticsPoint {
  label: string;
  students: number;
  enrollments: number;
  revenue: number;
  views: number;
  completions: number;
}

export interface CourseAnalytics {
  range: AnalyticsRange;
  points: AnalyticsPoint[];
}

export type EarningStatus = 'Completed' | 'Pending' | 'Refunded';

export interface Earning {
  id: string;
  /** ISO date */
  date: string;
  courseId: string;
  student: string;
  amount: number;
  status: EarningStatus;
}

export type InstructorNotificationKind = 'enrollment' | 'review' | 'approved' | 'earnings' | 'submitted';

export interface InstructorNotification {
  id: string;
  kind: InstructorNotificationKind;
  message: string;
  /** ISO timestamp */
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface InstructorActivity {
  id: string;
  kind: 'enrollment' | 'review' | 'lesson' | 'revenue' | 'submitted';
  message: string;
  /** ISO timestamp */
  createdAt: string;
}
