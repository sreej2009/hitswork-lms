import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createSampleCourses, createSampleInstructor, createSampleNotifications } from '../data/instructor';
import { findDemoAccount, isAdminEmail, normaliseEmail } from '../lib/auth';
import type {
  CourseLevelOption,
  Instructor,
  InstructorCourse,
  InstructorNotification,
  PayoutSettings,
} from '../types/instructor';
import { COURSES_KEY, INSTRUCTOR_KEY, NOTIFICATIONS_KEY, readMap, writeEntry } from '../lib/instructorStorage';
import { useAuth } from './AuthContext';

export interface NewCourseInput {
  title: string;
  category: string;
  level: CourseLevelOption;
}

export type ProfileInput = Pick<Instructor, 'name' | 'headline' | 'bio' | 'website' | 'linkedin' | 'specializations'>;

interface InstructorValue {
  instructor: Instructor | null;
  isInstructor: boolean;
  /** True until the signed-in account's instructor data has been read */
  loading: boolean;
  /** Turns the signed-in account into a (demo) instructor with sample courses */
  activate: () => void;
  updateProfile: (patch: ProfileInput) => void;
  updatePayout: (payout: PayoutSettings) => void;

  courses: InstructorCourse[];
  getCourse: (id: string) => InstructorCourse | undefined;
  createCourse: (input: NewCourseInput) => InstructorCourse;
  /** Inserts or replaces a whole course (course builder autosave) */
  saveCourse: (course: InstructorCourse) => void;
  updateCourse: (id: string, patch: Partial<Omit<InstructorCourse, 'id'>>) => void;
  submitForReview: (id: string) => void;
  duplicateCourse: (id: string) => InstructorCourse | undefined;
  deleteCourse: (id: string) => void;

  notifications: InstructorNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const InstructorContext = createContext<InstructorValue | null>(null);

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Default thumbnail for new courses until the builder lets instructors upload one. */
const PLACEHOLDER_IMAGE = '1499951360447-b19be8fe80f5';

export function InstructorProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const email = user ? normaliseEmail(user.email) : null;

  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [notifications, setNotifications] = useState<InstructorNotification[]>([]);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  // Load (or, for the built-in demo account, create) the signed-in account's instructor data.
  useEffect(() => {
    if (!email || !user) {
      setInstructor(null);
      setCourses([]);
      setNotifications([]);
      setLoadedFor(null);
      return;
    }
    let profile = readMap<Instructor>(INSTRUCTOR_KEY)[email] ?? null;
    // Both built-in demo accounts (learner and instructor) come with a ready-made instructor profile.
    if (!profile && findDemoAccount(email) && !isAdminEmail(email)) {
      profile = createSampleInstructor(email, user.name);
      writeEntry(INSTRUCTOR_KEY, email, profile);
      writeEntry(COURSES_KEY, email, createSampleCourses());
      writeEntry(NOTIFICATIONS_KEY, email, createSampleNotifications());
    }
    setInstructor(profile);
    setCourses(profile ? (readMap<InstructorCourse[]>(COURSES_KEY)[email] ?? []) : []);
    setNotifications(profile ? (readMap<InstructorNotification[]>(NOTIFICATIONS_KEY)[email] ?? []) : []);
    setLoadedFor(email);
    // `user.name` only seeds a new profile; changing it shouldn't reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const saveInstructor = useCallback(
    (next: Instructor) => {
      if (!email) return;
      setInstructor(next);
      writeEntry(INSTRUCTOR_KEY, email, next);
    },
    [email],
  );

  const saveCourses = useCallback(
    (update: (current: InstructorCourse[]) => InstructorCourse[]) => {
      if (!email) return;
      setCourses((current) => {
        const next = update(current);
        writeEntry(COURSES_KEY, email, next);
        return next;
      });
    },
    [email],
  );

  const saveNotifications = useCallback(
    (update: (current: InstructorNotification[]) => InstructorNotification[]) => {
      if (!email) return;
      setNotifications((current) => {
        const next = update(current);
        writeEntry(NOTIFICATIONS_KEY, email, next);
        return next;
      });
    },
    [email],
  );

  const activate = useCallback(() => {
    if (!email || !user) return;
    const profile = createSampleInstructor(email, user.name);
    const sampleCourses = createSampleCourses();
    const sampleNotifications = createSampleNotifications();
    writeEntry(COURSES_KEY, email, sampleCourses);
    writeEntry(NOTIFICATIONS_KEY, email, sampleNotifications);
    setCourses(sampleCourses);
    setNotifications(sampleNotifications);
    saveInstructor(profile);
  }, [email, user, saveInstructor]);

  const updateProfile = useCallback(
    (patch: ProfileInput) => {
      if (instructor) saveInstructor({ ...instructor, ...patch });
    },
    [instructor, saveInstructor],
  );

  const updatePayout = useCallback(
    (payout: PayoutSettings) => {
      if (instructor) saveInstructor({ ...instructor, payout });
    },
    [instructor, saveInstructor],
  );

  const getCourse = useCallback((id: string) => courses.find((course) => course.id === id), [courses]);

  const createCourse = useCallback(
    (input: NewCourseInput) => {
      const course: InstructorCourse = {
        id: newId('ic'),
        title: input.title.trim(),
        category: input.category,
        level: input.level,
        status: 'Draft',
        image: PLACEHOLDER_IMAGE,
        students: 0,
        rating: null,
        reviews: 0,
        revenue: 0,
        views: 0,
        enrollments: 0,
        completionRate: 0,
        lessons: 0,
        updatedAt: new Date().toISOString(),
      };
      saveCourses((current) => [course, ...current]);
      return course;
    },
    [saveCourses],
  );

  const saveCourse = useCallback(
    (course: InstructorCourse) =>
      saveCourses((current) =>
        current.some((c) => c.id === course.id)
          ? current.map((c) => (c.id === course.id ? course : c))
          : [course, ...current],
      ),
    [saveCourses],
  );

  const updateCourse = useCallback(
    (id: string, patch: Partial<Omit<InstructorCourse, 'id'>>) =>
      saveCourses((current) =>
        current.map((course) =>
          course.id === id ? { ...course, ...patch, updatedAt: new Date().toISOString() } : course,
        ),
      ),
    [saveCourses],
  );

  const submitForReview = useCallback(
    (id: string) => {
      const course = courses.find((c) => c.id === id);
      if (!course) return;
      updateCourse(id, { status: 'Pending Review' });
      saveNotifications((current) => [
        {
          id: newId('in'),
          kind: 'submitted',
          message: `${course.title} was submitted for review`,
          createdAt: new Date().toISOString(),
          read: false,
          href: '/instructor/courses',
        },
        ...current,
      ]);
    },
    [courses, updateCourse, saveNotifications],
  );

  const duplicateCourse = useCallback(
    (id: string) => {
      const source = courses.find((c) => c.id === id);
      if (!source) return undefined;
      const copy: InstructorCourse = {
        ...source,
        id: newId('ic'),
        title: `${source.title} (Copy)`,
        status: 'Draft',
        students: 0,
        rating: null,
        reviews: 0,
        revenue: 0,
        views: 0,
        enrollments: 0,
        completionRate: 0,
        catalogId: undefined,
        updatedAt: new Date().toISOString(),
      };
      saveCourses((current) => [copy, ...current]);
      return copy;
    },
    [courses, saveCourses],
  );

  const deleteCourse = useCallback(
    (id: string) => saveCourses((current) => current.filter((course) => course.id !== id)),
    [saveCourses],
  );

  const markNotificationRead = useCallback(
    (id: string) => saveNotifications((current) => current.map((n) => (n.id === id ? { ...n, read: true } : n))),
    [saveNotifications],
  );

  const markAllNotificationsRead = useCallback(
    () => saveNotifications((current) => current.map((n) => ({ ...n, read: true }))),
    [saveNotifications],
  );

  const value = useMemo<InstructorValue>(
    () => ({
      instructor,
      isInstructor: !!instructor,
      loading: !!email && loadedFor !== email,
      activate,
      updateProfile,
      updatePayout,
      courses,
      getCourse,
      createCourse,
      saveCourse,
      updateCourse,
      submitForReview,
      duplicateCourse,
      deleteCourse,
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      instructor,
      email,
      loadedFor,
      activate,
      updateProfile,
      updatePayout,
      courses,
      getCourse,
      createCourse,
      saveCourse,
      updateCourse,
      submitForReview,
      duplicateCourse,
      deleteCourse,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
    ],
  );

  return <InstructorContext.Provider value={value}>{children}</InstructorContext.Provider>;
}

export function useInstructor(): InstructorValue {
  const context = useContext(InstructorContext);
  if (!context) throw new Error('useInstructor must be used inside <InstructorProvider>');
  return context;
}
