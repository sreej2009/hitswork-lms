import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type {
  AppNotification,
  Certificate,
  Course,
  CourseProgress,
  LearningRecord,
  LessonProgress,
  NotificationKind,
} from '../types';
import type { LearnerStats } from '../data/achievements';
import { courses } from '../data/courses';
import { learningStreakDays, sampleLearning } from '../data/learning';
import { sampleNotifications } from '../data/notifications';
import { lessonPlan, type LessonPlan, type PlanLesson } from '../lib/lessonPlan';
import { useAuth } from './AuthContext';
import { useStore } from './StoreContext';

const KEYS = {
  learning: 'hitswork_learning',
  certificates: 'hitswork_certificates',
  notifications: 'hitswork_notifications',
  // Derived summaries (the source of truth is `learning`), plus per-lesson resume points.
  courseProgress: 'hitswork_course_progress',
  lessonProgress: 'hitswork_lesson_progress',
} as const;

type PositionMap = Record<string, Record<string, { positionSeconds: number; updatedAt: string }>>;

/** Resume points from the stored per-lesson progress. */
function loadPositions(): PositionMap {
  const stored = load<Record<string, Record<string, LessonProgress>>>(KEYS.lessonProgress, {});
  const positions: PositionMap = {};
  for (const [courseId, lessons] of Object.entries(stored)) {
    positions[courseId] = {};
    for (const [lessonId, progress] of Object.entries(lessons)) {
      if (progress.positionSeconds > 0)
        positions[courseId][lessonId] = { positionSeconds: progress.positionSeconds, updatedAt: progress.updatedAt };
    }
  }
  return positions;
}

export type LearningStatus = 'not-started' | 'in-progress' | 'completed';

/** Everything the UI needs about one enrolled course. */
export interface CourseLearning {
  course: Course;
  record: LearningRecord;
  plan: LessonPlan;
  completedCount: number;
  totalLessons: number;
  /** 0–100 */
  percent: number;
  status: LearningStatus;
  /** Lesson to resume: the current lesson if unfinished, else the first incomplete one */
  nextLesson: PlanLesson;
  certificate: Certificate | null;
}

interface LearningValue {
  /** False until sample data has been loaded for a signed-in user */
  ready: boolean;
  /** Most recently accessed first */
  myCourses: CourseLearning[];
  getLearning: (courseId: string) => CourseLearning | null;
  stats: LearnerStats & { inProgressCourses: number };
  certificates: Certificate[];
  notifications: AppNotification[];
  unreadCount: number;
  openLesson: (courseId: string, lessonId: string) => void;
  setLessonComplete: (courseId: string, lessonId: string, complete: boolean) => void;
  completeCourse: (courseId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetSampleData: () => void;
  /** Saved video position for a lesson, in seconds (0 if none) */
  getLessonPosition: (courseId: string, lessonId: string) => number;
  setLessonPosition: (courseId: string, lessonId: string, seconds: number) => void;
}

const LearningContext = createContext<LearningValue | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: state lasts for this session only.
  }
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const randomCode = (length: number) =>
  Array.from({ length }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join('');

const courseById = new Map(courses.map((course) => [course.id, course]));

function makeCertificate(courseId: string, recipientName: string, issuedAt: string): Certificate {
  return {
    id: `HW-${new Date(issuedAt).getFullYear()}-${randomCode(4)}-${randomCode(4)}`,
    courseId,
    recipientName,
    issuedAt,
  };
}

function makeNotification(kind: NotificationKind, message: string, href?: string, createdAt = new Date()): AppNotification {
  return { id: `n-${createdAt.getTime()}-${randomCode(4)}`, kind, message, href, createdAt: createdAt.toISOString(), read: false };
}

const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();

export function LearningProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { enrolled, grantAccess } = useStore();
  // null = never initialised on this browser (sample data not loaded yet)
  const [records, setRecords] = useState<Record<string, LearningRecord> | null>(() => load(KEYS.learning, null));
  const [certificates, setCertificates] = useState<Certificate[]>(() => load(KEYS.certificates, []));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => load(KEYS.notifications, []));
  const [positions, setPositions] = useState<PositionMap>(loadPositions);

  useEffect(() => save(KEYS.learning, records), [records]);
  useEffect(() => save(KEYS.certificates, certificates), [certificates]);
  useEffect(() => save(KEYS.notifications, notifications), [notifications]);

  // First sign-in on this browser: load the sample learning history (merged with any purchases).
  useEffect(() => {
    if (!isAuthenticated || records !== null) return;
    const next: Record<string, LearningRecord> = {};
    const issued: Certificate[] = [];
    for (const seed of sampleLearning) {
      const course = courseById.get(seed.courseId);
      if (!course) continue;
      const plan = lessonPlan(course);
      const done = Math.round(seed.progress * plan.lessons.length);
      const completedAt = seed.completedDaysAgo !== undefined ? hoursAgo(seed.completedDaysAgo * 24) : undefined;
      next[course.id] = {
        courseId: course.id,
        enrolledAt: hoursAgo(seed.enrolledDaysAgo * 24),
        lastAccessedAt: hoursAgo(seed.lastAccessedHoursAgo),
        completedAt,
        completedLessonIds: plan.lessons.slice(0, done).map((lesson) => lesson.id),
        currentLessonId: plan.lessons[Math.min(done, plan.lessons.length - 1)].id,
      };
      if (completedAt) issued.push(makeCertificate(course.id, user?.name ?? 'Learner', completedAt));
    }
    for (const id of enrolled) {
      if (!next[id] && courseById.has(id)) next[id] = { courseId: id, enrolledAt: new Date().toISOString(), completedLessonIds: [] };
    }
    setRecords(next);
    setCertificates(issued);
    setNotifications(
      sampleNotifications.map((seed) => ({
        ...makeNotification(seed.kind, seed.message, seed.href, new Date(Date.now() - seed.minutesAgo * 60_000)),
        read: seed.read,
      })),
    );
  }, [isAuthenticated, records, enrolled, user?.name]);

  // Keep purchases and learning records in step, in both directions.
  useEffect(() => {
    if (!records) return;
    const missing = [...enrolled].filter((id) => !records[id] && courseById.has(id));
    if (missing.length) {
      const now = new Date();
      setRecords((current) => {
        const next = { ...current };
        for (const id of missing) next[id] = { courseId: id, enrolledAt: now.toISOString(), completedLessonIds: [] };
        return next;
      });
      setNotifications((current) => [
        ...missing.map((id) =>
          makeNotification('enrolled', `You’re enrolled in ${courseById.get(id)!.title}. Start your first lesson!`, `/learn/${id}`, now),
        ),
        ...current,
      ]);
    }
    const unowned = Object.keys(records).filter((id) => !enrolled.has(id));
    if (unowned.length) grantAccess(unowned);
  }, [enrolled, records, grantAccess]);

  const certificateByCourse = useMemo(() => new Map(certificates.map((c) => [c.courseId, c])), [certificates]);

  const toLearning = useCallback(
    (record: LearningRecord): CourseLearning | null => {
      const course = courseById.get(record.courseId);
      if (!course) return null;
      const plan = lessonPlan(course);
      const done = new Set(record.completedLessonIds);
      const completedCount = plan.lessons.filter((lesson) => done.has(lesson.id)).length;
      const totalLessons = plan.lessons.length;
      const percent = Math.round((completedCount / totalLessons) * 100);
      const current = plan.lessons.find((lesson) => lesson.id === record.currentLessonId);
      const nextLesson =
        (current && !done.has(current.id) ? current : plan.lessons.find((lesson) => !done.has(lesson.id))) ??
        current ??
        plan.lessons[0];
      return {
        course,
        record,
        plan,
        completedCount,
        totalLessons,
        percent,
        status: record.completedAt ? 'completed' : completedCount > 0 ? 'in-progress' : 'not-started',
        nextLesson,
        certificate: certificateByCourse.get(course.id) ?? null,
      };
    },
    [certificateByCourse],
  );

  const myCourses = useMemo(
    () =>
      Object.values(records ?? {})
        .map(toLearning)
        .filter((item): item is CourseLearning => item !== null)
        .sort((a, b) =>
          (b.record.lastAccessedAt ?? b.record.enrolledAt).localeCompare(a.record.lastAccessedAt ?? a.record.enrolledAt),
        ),
    [records, toLearning],
  );

  const getLearning = useCallback(
    (courseId: string) => (records?.[courseId] ? toLearning(records[courseId]) : null),
    [records, toLearning],
  );

  const stats = useMemo(() => {
    const completed = myCourses.filter((c) => c.status === 'completed');
    return {
      completedCourses: completed.length,
      inProgressCourses: myCourses.filter((c) => c.status === 'in-progress').length,
      learningHours: Math.round(
        myCourses.reduce((sum, c) => sum + (c.status === 'completed' ? c.course.hours : (c.course.hours * c.percent) / 100), 0),
      ),
      streakDays: learningStreakDays,
      certificates: certificates.length,
      categoriesExplored: new Set(myCourses.map((c) => c.course.category)).size,
    };
  }, [myCourses, certificates.length]);

  const updateRecord = useCallback((courseId: string, update: (record: LearningRecord) => LearningRecord) => {
    setRecords((current) => (current?.[courseId] ? { ...current, [courseId]: update(current[courseId]) } : current));
  }, []);

  const openLesson = useCallback(
    (courseId: string, lessonId: string) =>
      updateRecord(courseId, (record) => ({ ...record, currentLessonId: lessonId, lastAccessedAt: new Date().toISOString() })),
    [updateRecord],
  );

  /** Marks a finished course: completion date, certificate and notifications (once). */
  const finishCourse = useCallback(
    (courseId: string) => {
      const course = courseById.get(courseId);
      if (!course || certificateByCourse.has(courseId)) return;
      const now = new Date();
      const certificate = makeCertificate(courseId, user?.name ?? 'Learner', now.toISOString());
      setCertificates((current) => [certificate, ...current]);
      setNotifications((current) => [
        makeNotification('certificate', `You earned a new certificate for ${course.title}.`, `/certificates/${certificate.id}`, now),
        makeNotification('completed', `Congratulations! You completed ${course.title}.`, `/my-learning?tab=completed`, now),
        ...current,
      ]);
    },
    [certificateByCourse, user?.name],
  );

  const setLessonComplete = useCallback(
    (courseId: string, lessonId: string, complete: boolean) => {
      const record = records?.[courseId];
      const course = courseById.get(courseId);
      if (!record || !course) return;
      const done = new Set(record.completedLessonIds);
      if (complete) done.add(lessonId);
      else done.delete(lessonId);
      const allDone = lessonPlan(course).lessons.every((lesson) => done.has(lesson.id));
      const now = new Date().toISOString();
      updateRecord(courseId, (current) => ({
        ...current,
        completedLessonIds: [...done],
        lastAccessedAt: now,
        completedAt: current.completedAt ?? (allDone ? now : undefined),
      }));
      if (allDone) finishCourse(courseId);
    },
    [records, updateRecord, finishCourse],
  );

  const completeCourse = useCallback(
    (courseId: string) => {
      const course = courseById.get(courseId);
      if (!course || !records?.[courseId]) return;
      const now = new Date().toISOString();
      updateRecord(courseId, (current) => ({
        ...current,
        completedLessonIds: lessonPlan(course).lessons.map((lesson) => lesson.id),
        lastAccessedAt: now,
        completedAt: current.completedAt ?? now,
      }));
      finishCourse(courseId);
    },
    [records, updateRecord, finishCourse],
  );

  const getLessonPosition = useCallback(
    (courseId: string, lessonId: string) => positions[courseId]?.[lessonId]?.positionSeconds ?? 0,
    [positions],
  );

  const setLessonPosition = useCallback((courseId: string, lessonId: string, seconds: number) => {
    setPositions((current) => {
      if (Math.abs((current[courseId]?.[lessonId]?.positionSeconds ?? 0) - seconds) < 1) return current;
      return {
        ...current,
        [courseId]: { ...current[courseId], [lessonId]: { positionSeconds: Math.floor(seconds), updatedAt: new Date().toISOString() } },
      };
    });
  }, []);

  // Mirror derived progress into its own keys so other tools can read it; `hitswork_learning` stays the source.
  useEffect(() => {
    if (!records) return;
    const courseProgress: Record<string, CourseProgress> = {};
    const lessonProgress: Record<string, Record<string, LessonProgress>> = {};
    for (const item of myCourses) {
      const id = item.course.id;
      courseProgress[id] = {
        percent: item.percent,
        completedLessons: item.completedCount,
        totalLessons: item.totalLessons,
        status: item.status,
        currentLessonId: item.record.currentLessonId,
        updatedAt: item.record.lastAccessedAt ?? item.record.enrolledAt,
      };
      const done = new Set(item.record.completedLessonIds);
      const lessons: Record<string, LessonProgress> = {};
      for (const lesson of item.plan.lessons) {
        const position = positions[id]?.[lesson.id];
        if (!done.has(lesson.id) && !position) continue;
        lessons[lesson.id] = {
          completed: done.has(lesson.id),
          positionSeconds: position?.positionSeconds ?? 0,
          updatedAt: position?.updatedAt ?? item.record.lastAccessedAt ?? item.record.enrolledAt,
        };
      }
      lessonProgress[id] = lessons;
    }
    save(KEYS.courseProgress, courseProgress);
    save(KEYS.lessonProgress, lessonProgress);
  }, [records, myCourses, positions]);

  const markNotificationRead = useCallback(
    (id: string) => setNotifications((current) => current.map((n) => (n.id === id ? { ...n, read: true } : n))),
    [],
  );
  const markAllNotificationsRead = useCallback(
    () => setNotifications((current) => current.map((n) => (n.read ? n : { ...n, read: true }))),
    [],
  );

  /** Clears learning data; the sample history is loaded again straight away. */
  const resetSampleData = useCallback(() => {
    setPositions({});
    setCertificates([]);
    setNotifications([]);
    setRecords(null);
  }, []);

  const value = useMemo<LearningValue>(
    () => ({
      ready: records !== null,
      myCourses,
      getLearning,
      stats,
      certificates,
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      openLesson,
      setLessonComplete,
      completeCourse,
      markNotificationRead,
      markAllNotificationsRead,
      resetSampleData,
      getLessonPosition,
      setLessonPosition,
    }),
    [
      records,
      myCourses,
      getLearning,
      stats,
      certificates,
      notifications,
      openLesson,
      setLessonComplete,
      completeCourse,
      markNotificationRead,
      markAllNotificationsRead,
      resetSampleData,
      getLessonPosition,
      setLessonPosition,
    ],
  );

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning(): LearningValue {
  const context = useContext(LearningContext);
  if (!context) throw new Error('useLearning must be used inside <LearningProvider>');
  return context;
}
