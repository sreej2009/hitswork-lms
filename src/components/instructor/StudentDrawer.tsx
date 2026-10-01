import { useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Clock3, X } from 'lucide-react';
import type { InstructorCourse, InstructorStudent, StudentStatus } from '../../types/instructor';
import { useModalDialog } from '../../hooks/useModalDialog';
import { cn } from '../../lib/cn';
import { formatRelative } from '../../lib/format';
import { unsplash } from '../../lib/images';
import { ProgressBar } from '../dashboard/ProgressBar';
import { Avatar } from '../ui/Avatar';
import { IconButton } from '../ui/IconButton';
import { easeOutSoft } from '../ui/Reveal';

const statusStyles: Record<StudentStatus, string> = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Inactive: 'bg-slate-100 text-slate-600 ring-slate-200',
  Completed: 'bg-brand-50 text-brand-700 ring-brand-100',
};

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ring-1',
        statusStyles[status],
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function StudentAvatar({ student, size = 'sm' }: { student: InstructorStudent; size?: 'sm' | 'lg' }) {
  const box = size === 'lg' ? 'size-16' : 'size-9';
  if (!student.photoId) return <Avatar name={student.name} size={size === 'lg' ? 'md' : 'xs'} />;
  return (
    <img
      src={unsplash(student.photoId, {
        width: size === 'lg' ? 128 : 72,
        height: size === 'lg' ? 128 : 72,
        crop: 'faces',
      })}
      alt=""
      width={size === 'lg' ? 64 : 36}
      height={size === 'lg' ? 64 : 36}
      loading="lazy"
      className={cn('shrink-0 rounded-full bg-brand-50 object-cover', box)}
    />
  );
}

interface StudentDrawerProps {
  student: InstructorStudent | null;
  courses: InstructorCourse[];
  onClose: () => void;
  /** Focus returns here when the drawer closes */
  returnFocusRef: RefObject<HTMLElement | null>;
}

/**
 * Right-side panel with one student's learning summary. Only course-related details are shown —
 * no contact details beyond the email used for the course.
 */
export function StudentDrawer({ student, courses, onClose, returnFocusRef }: StudentDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useModalDialog({ open: !!student, onClose, panelRef, initialFocusRef: closeRef, returnFocusRef });

  const courseTitle = (id: string) => courses.find((course) => course.id === id)?.title ?? 'Course';

  return createPortal(
    <AnimatePresence>
      {student && (
        <>
          <motion.div
            key="overlay"
            aria-hidden
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-[2px]"
          />
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: easeOutSoft }}
            className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <p className="text-sm font-semibold text-muted">Student details</p>
              <IconButton ref={closeRef} icon={X} label="Close student details" onClick={onClose} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
              <div className="flex items-center gap-4">
                <StudentAvatar student={student} size="lg" />
                <div className="min-w-0">
                  <h2 id="student-drawer-title" className="truncate text-xl font-bold tracking-[-0.015em]">
                    {student.name}
                  </h2>
                  <p className="truncate text-sm text-muted">{student.email}</p>
                  <div className="mt-2">
                    <StudentStatusBadge status={student.status} />
                  </div>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { icon: BookOpen, label: 'Courses', value: String(student.enrollments.length) },
                  { icon: Clock3, label: 'Learning hours', value: `${student.learningHours}h` },
                  { icon: CheckCircle2, label: 'Last active', value: formatRelative(student.lastActive) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex min-w-0 flex-col-reverse rounded-2xl bg-canvas p-3 ring-1 ring-line">
                    <dt className="mt-0.5 text-[11px] text-muted">{label}</dt>
                    <dd className="truncate text-sm font-semibold text-ink">{value}</dd>
                    <Icon aria-hidden className="mb-2 size-4 text-brand-600" strokeWidth={2} />
                  </div>
                ))}
              </dl>

              <h3 className="mt-8 text-sm font-semibold text-ink">Enrolled courses</h3>
              <ul className="mt-3 space-y-3">
                {student.enrollments.map((enrollment) => (
                  <li key={enrollment.courseId} className="rounded-2xl border border-line p-4">
                    <p className="text-sm leading-snug font-semibold text-ink">{courseTitle(enrollment.courseId)}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <ProgressBar
                        value={enrollment.progress}
                        label={`Progress in ${courseTitle(enrollment.courseId)}`}
                        tone={enrollment.progress === 100 ? 'success' : 'brand'}
                        size="sm"
                        className="flex-1"
                      />
                      <span className="w-10 text-right text-sm font-semibold text-ink tabular-nums">
                        {enrollment.progress}%
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted">
                      {enrollment.lessonsCompleted} of {enrollment.totalLessons} lessons completed
                    </p>
                  </li>
                ))}
              </ul>

              <p className="mt-6 rounded-xl bg-canvas px-4 py-3 text-xs leading-relaxed text-muted ring-1 ring-line">
                Sample student. Instructors only see course progress and activity — never payment or personal details.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
