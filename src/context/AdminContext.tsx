import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  DEFAULT_ADMIN_SETTINGS,
  catalogAdminCourses,
  seedApplications,
  seedCategories,
  seedInstructors,
  seedNotifications,
  seedOrders,
  seedStudents,
  submissionAdminCourses,
} from '../data/admin';
import { createSampleCourses, createSampleInstructor, createSampleNotifications } from '../data/instructor';
import type {
  AdminApplication,
  AdminCategory,
  AdminCourse,
  AdminCourseStatus,
  AdminInstructor,
  AdminInstructorStatus,
  AdminNotification,
  AdminOrder,
  AdminSettings,
  AdminStudent,
  AdminStudentStatus,
  AdminUser,
} from '../types/admin';
import type { Order } from '../types';
import { DEMO_ADMIN, normaliseEmail } from '../lib/auth';
import {
  ADMIN_KEYS,
  builderCourses,
  deleteBuilderCourse,
  loadOrSeed,
  readJson,
  toAdminCourse,
  updateBuilderCourse,
  writeJson,
} from '../lib/adminStorage';
import { COURSES_KEY, INSTRUCTOR_KEY, NOTIFICATIONS_KEY, readMap, writeEntry } from '../lib/instructorStorage';
import { loadApplication } from '../lib/instructorApplication';
import { instructorSlug } from '../data/instructors';
import type { Instructor } from '../types/instructor';

export interface NewAdminCourse {
  title: string;
  instructor: string;
  category: string;
  level: AdminCourse['level'];
  price: number;
}

interface AdminValue {
  admin: AdminUser;
  updateSettings: (patch: Partial<AdminSettings>) => void;

  courses: AdminCourse[];
  getCourse: (id: string) => AdminCourse | undefined;
  pendingCourses: AdminCourse[];
  setCourseStatus: (id: string, status: AdminCourseStatus, note?: string) => void;
  updateCourse: (id: string, patch: Partial<Pick<AdminCourse, 'title' | 'category' | 'level' | 'price'>>) => void;
  addCourse: (input: NewAdminCourse) => AdminCourse;
  deleteCourse: (id: string) => void;

  instructors: AdminInstructor[];
  setInstructorStatus: (id: string, status: AdminInstructorStatus) => void;
  applications: AdminApplication[];
  decideApplication: (id: string, approve: boolean) => void;

  students: AdminStudent[];
  setStudentStatus: (id: string, status: AdminStudentStatus) => void;

  orders: AdminOrder[];
  refundOrder: (id: string) => void;

  categories: AdminCategory[];
  saveCategory: (category: AdminCategory) => void;
  deleteCategory: (id: string) => void;

  notifications: AdminNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  /** Re-reads data other parts of the app may have changed (e.g. new submissions) */
  refresh: () => void;
}

const AdminContext = createContext<AdminValue | null>(null);

const methodLabel: Record<Order['paymentMethod'], AdminOrder['paymentMethod']> = {
  card: 'Card',
  upi: 'UPI',
  netbanking: 'Net Banking',
  wallet: 'Wallet',
};

/** Orders placed through the real checkout in this browser, shown alongside the sample orders. */
function liveOrders(): AdminOrder[] {
  const stored = readJson<Order[]>('hitswork_orders') ?? [];
  return stored.map((order) => ({
    id: order.id,
    student: 'Demo learner',
    studentEmail: 'demo@hitswork.com',
    courses: order.courseIds,
    amount: order.total,
    paymentMethod: methodLabel[order.paymentMethod] ?? 'Card',
    date: order.placedAt,
    status: 'Paid',
  }));
}

/** An application sent through /teach/register in this browser. */
function liveApplication(): AdminApplication | null {
  const app = loadApplication();
  if (!app) return null;
  return {
    id: app.id,
    name: app.name,
    email: app.email,
    expertise: app.expertise,
    experience: app.experience,
    category: app.category,
    about: app.about,
    appliedAt: app.submittedAt,
    status: 'Pending',
    live: true,
  };
}

function useStored<T>(key: string, seed: () => T) {
  const [value, setValue] = useState<T>(() => loadOrSeed(key, seed));
  const update = useCallback(
    (next: (current: T) => T) =>
      setValue((current) => {
        const result = next(current);
        writeJson(key, result);
        return result;
      }),
    [key],
  );
  return [value, update] as const;
}

/** Admin state. Mounted only inside the admin area, so every visit starts from fresh storage. */
export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useStored<AdminUser>(ADMIN_KEYS.admin, () => ({
    email: DEMO_ADMIN.email,
    name: DEMO_ADMIN.name,
    role: 'admin',
    settings: DEFAULT_ADMIN_SETTINGS,
  }));
  const [storedCourses, setStoredCourses] = useStored<AdminCourse[]>(ADMIN_KEYS.courses, () => [
    ...submissionAdminCourses(),
    ...catalogAdminCourses(),
  ]);
  const [instructors, setInstructors] = useStored<AdminInstructor[]>(ADMIN_KEYS.instructors, () => seedInstructors());
  const [students, setStudents] = useStored<AdminStudent[]>(ADMIN_KEYS.students, () => seedStudents());
  const [orders, setOrders] = useStored<AdminOrder[]>(ADMIN_KEYS.orders, () => seedOrders());
  const [categories, setCategories] = useStored<AdminCategory[]>(ADMIN_KEYS.categories, () => seedCategories());
  const [notifications, setNotifications] = useStored<AdminNotification[]>(ADMIN_KEYS.notifications, () =>
    seedNotifications(),
  );
  const [applications, setApplications] = useStored<AdminApplication[]>(ADMIN_KEYS.applications, () =>
    seedApplications(),
  );
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  // Pick up activity from the rest of the app: new orders and a new instructor application.
  useEffect(() => {
    const live = liveOrders();
    if (live.length) setOrders((current) => [...live.filter((o) => !current.some((c) => c.id === o.id)), ...current]);
    const app = liveApplication();
    if (app) setApplications((current) => (current.some((a) => a.id === app.id) ? current : [app, ...current]));
    // Run on mount and whenever data is refreshed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refresh]);

  // Builder courses are read live from the instructor store on every refresh.
  const liveCourses = useMemo(
    () => builderCourses().map(toAdminCourse),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version],
  );

  const courses = useMemo(
    () =>
      [...liveCourses, ...storedCourses].sort((a, b) =>
        (b.submittedAt ?? b.updatedAt).localeCompare(a.submittedAt ?? a.updatedAt),
      ),
    [liveCourses, storedCourses],
  );

  const getCourse = useCallback((id: string) => courses.find((c) => c.id === id), [courses]);

  const setCourseStatus = useCallback(
    (id: string, status: AdminCourseStatus, note?: string) => {
      const course = courses.find((c) => c.id === id);
      if (!course) return;
      const now = new Date().toISOString();
      if (course.source === 'instructor' && course.instructorEmail) {
        const messages: Partial<Record<AdminCourseStatus, string>> = {
          Published: `Your course “${course.title}” has been approved and is now live`,
          'Changes Requested': `Changes requested for “${course.title}”: ${note ?? ''}`,
          Rejected: `“${course.title}” was not approved: ${note ?? ''}`,
        };
        updateBuilderCourse(course.instructorEmail, id, { status, reviewNote: note }, messages[status]);
        refresh();
      } else {
        setStoredCourses((current) =>
          current.map((c) => (c.id === id ? { ...c, status, reviewNote: note ?? c.reviewNote, updatedAt: now } : c)),
        );
      }
    },
    [courses, refresh, setStoredCourses],
  );

  const updateCourse = useCallback(
    (id: string, patch: Partial<Pick<AdminCourse, 'title' | 'category' | 'level' | 'price'>>) => {
      const course = courses.find((c) => c.id === id);
      if (!course) return;
      if (course.source === 'instructor' && course.instructorEmail) {
        updateBuilderCourse(course.instructorEmail, id, {
          ...(patch.title !== undefined && { title: patch.title }),
          ...(patch.category !== undefined && { category: patch.category }),
          ...(patch.level !== undefined && { level: patch.level }),
          ...(patch.price !== undefined && { price: patch.price }),
        });
        refresh();
      } else {
        setStoredCourses((current) =>
          current.map((c) => (c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c)),
        );
      }
    },
    [courses, refresh, setStoredCourses],
  );

  const addCourse = useCallback(
    (input: NewAdminCourse) => {
      const now = new Date().toISOString();
      const course: AdminCourse = {
        id: `adm-${Date.now().toString(36)}`,
        source: 'submission',
        ...input,
        status: 'Draft',
        students: 0,
        rating: null,
        revenue: 0,
        image: '1499951360447-b19be8fe80f5',
        updatedAt: now,
      };
      setStoredCourses((current) => [course, ...current]);
      return course;
    },
    [setStoredCourses],
  );

  const deleteCourse = useCallback(
    (id: string) => {
      const course = courses.find((c) => c.id === id);
      if (!course) return;
      if (course.source === 'instructor' && course.instructorEmail) {
        deleteBuilderCourse(course.instructorEmail, id);
        refresh();
      } else {
        setStoredCourses((current) => current.filter((c) => c.id !== id));
      }
    },
    [courses, refresh, setStoredCourses],
  );

  const setInstructorStatus = useCallback(
    (id: string, status: AdminInstructorStatus) =>
      setInstructors((current) => current.map((i) => (i.id === id ? { ...i, status } : i))),
    [setInstructors],
  );

  const decideApplication = useCallback(
    (id: string, approve: boolean) => {
      const app = applications.find((a) => a.id === id);
      if (!app) return;
      setApplications((current) =>
        current.map((a) => (a.id === id ? { ...a, status: approve ? 'Approved' : 'Rejected' } : a)),
      );
      if (!approve) return;
      // The applicant becomes an instructor ("role = instructor").
      setInstructors((current) =>
        current.some((i) => i.email === app.email)
          ? current.map((i) => (i.email === app.email ? { ...i, status: 'Active' } : i))
          : [
              {
                id: instructorSlug(app.name) || app.id,
                name: app.name,
                email: app.email,
                headline: `${app.category} Instructor`,
                bio: app.about,
                specializations: app.expertise
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
                courses: 0,
                students: 0,
                rating: 0,
                revenue: 0,
                certificates: 0,
                status: 'Active',
                joinedAt: new Date().toISOString().slice(0, 10),
              },
              ...current,
            ],
      );
      // A real account that applied in this browser gets instructor access straight away.
      if (app.live) {
        const email = normaliseEmail(app.email);
        if (!readMap<Instructor>(INSTRUCTOR_KEY)[email]) {
          writeEntry(INSTRUCTOR_KEY, email, createSampleInstructor(email, app.name));
          writeEntry(COURSES_KEY, email, createSampleCourses());
          writeEntry(NOTIFICATIONS_KEY, email, createSampleNotifications());
        }
      }
    },
    [applications, setApplications, setInstructors],
  );

  const setStudentStatus = useCallback(
    (id: string, status: AdminStudentStatus) =>
      setStudents((current) => current.map((s) => (s.id === id ? { ...s, status } : s))),
    [setStudents],
  );

  const refundOrder = useCallback(
    (id: string) => setOrders((current) => current.map((o) => (o.id === id ? { ...o, status: 'Refunded' } : o))),
    [setOrders],
  );

  const saveCategory = useCallback(
    (category: AdminCategory) =>
      setCategories((current) =>
        current.some((c) => c.id === category.id)
          ? current.map((c) => (c.id === category.id ? category : c))
          : [...current, category],
      ),
    [setCategories],
  );

  const deleteCategory = useCallback(
    (id: string) => setCategories((current) => current.filter((c) => c.id !== id)),
    [setCategories],
  );

  const markNotificationRead = useCallback(
    (id: string) => setNotifications((current) => current.map((n) => (n.id === id ? { ...n, read: true } : n))),
    [setNotifications],
  );
  const markAllNotificationsRead = useCallback(
    () => setNotifications((current) => current.map((n) => ({ ...n, read: true }))),
    [setNotifications],
  );

  const updateSettings = useCallback(
    (patch: Partial<AdminSettings>) =>
      setAdmin((current) => ({ ...current, settings: { ...current.settings, ...patch } })),
    [setAdmin],
  );

  const value: AdminValue = {
    admin,
    updateSettings,
    courses,
    getCourse,
    pendingCourses: courses.filter((c) => c.status === 'Pending Review'),
    setCourseStatus,
    updateCourse,
    addCourse,
    deleteCourse,
    instructors,
    setInstructorStatus,
    applications,
    decideApplication,
    students,
    setStudentStatus,
    orders,
    refundOrder,
    categories,
    saveCategory,
    deleteCategory,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    refresh,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminValue {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used inside <AdminProvider>');
  return context;
}
