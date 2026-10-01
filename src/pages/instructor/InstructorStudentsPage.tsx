import { useMemo, useRef, useState } from 'react';
import { ChevronRight, CircleCheck, Gauge, Search, SearchX, UserCheck, Users } from 'lucide-react';
import { instructorStudents, studentSummary } from '../../data/instructor';
import type { InstructorStudent, StudentStatus } from '../../types/instructor';
import { useInstructor } from '../../context/InstructorContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { formatNumber, formatRelative } from '../../lib/format';
import { ProgressBar } from '../../components/dashboard/ProgressBar';
import { DemoDataBadge, InstructorHeader, Panel } from '../../components/instructor/InstructorChrome';
import { MetricCard } from '../../components/instructor/MetricCard';
import { StudentAvatar, StudentDrawer, StudentStatusBadge } from '../../components/instructor/StudentDrawer';
import { Button } from '../../components/ui/Button';
import { SelectInput } from '../../components/ui/Form';

const progressBands = [
  { label: '0–25%', min: 0, max: 25 },
  { label: '26–50%', min: 26, max: 50 },
  { label: '51–75%', min: 51, max: 75 },
  { label: '76–100%', min: 76, max: 100 },
] as const;

const statusOptions: StudentStatus[] = ['Active', 'Inactive', 'Completed'];

/** The enrollment shown in the table row: the one in the filtered course, else the most recent. */
const primaryEnrollment = (student: InstructorStudent, courseId: string) =>
  student.enrollments.find((e) => e.courseId === courseId) ?? student.enrollments[0];

export function InstructorStudentsPage() {
  usePageMeta('Students — Hitswork Instructor', 'See who is learning in your courses and how they are progressing.');
  const { courses } = useInstructor();
  const [query, setQuery] = useState('');
  const [courseId, setCourseId] = useState('');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState('');
  const [selected, setSelected] = useState<InstructorStudent | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const courseTitle = (id: string) => courses.find((course) => course.id === id)?.title ?? 'Course';
  const courseOptions = courses.filter((course) => course.students > 0);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    const band = progressBands.find((b) => b.label === progress);
    return instructorStudents.filter((student) => {
      if (term && !`${student.name} ${student.email}`.toLowerCase().includes(term)) return false;
      if (courseId && !student.enrollments.some((e) => e.courseId === courseId)) return false;
      if (status && student.status !== status) return false;
      if (band) {
        const value = primaryEnrollment(student, courseId).progress;
        if (value < band.min || value > band.max) return false;
      }
      return true;
    });
  }, [query, courseId, status, progress]);

  const filtersActive = !!(query || courseId || status || progress);
  const clearFilters = () => {
    setQuery('');
    setCourseId('');
    setStatus('');
    setProgress('');
  };

  const open = (student: InstructorStudent, trigger: HTMLElement) => {
    returnFocusRef.current = trigger;
    setSelected(student);
  };

  return (
    <>
      <InstructorHeader
        title="Your Students"
        subtitle={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            Follow progress across your courses.
            <DemoDataBadge />
          </span>
        }
      />

      <section aria-label="Student metrics" className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 xl:grid-cols-4">
        <MetricCard index={0} label="Total Students" value={formatNumber(studentSummary.total)} icon={Users} />
        <MetricCard
          index={1}
          label="Active Learners"
          value={formatNumber(studentSummary.active)}
          icon={UserCheck}
          tone="bg-cyan-50 text-cyan-600"
        />
        <MetricCard
          index={2}
          label="Completed Courses"
          value={formatNumber(studentSummary.completed)}
          icon={CircleCheck}
          tone="bg-emerald-50 text-emerald-600"
        />
        <MetricCard
          index={3}
          label="Average Progress"
          value={`${studentSummary.averageProgress}%`}
          icon={Gauge}
          tone="bg-violet-50 text-violet-600"
        />
      </section>

      <Panel
        className="mt-6"
        title="Students"
        titleId="students-title"
        description="A sample of recently active students. Select a student to see their progress."
        flush
      >
        <div className="grid gap-3 border-b border-line px-5 pb-4 sm:grid-cols-2 sm:px-6 xl:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <label htmlFor="student-search" className="sr-only">
              Search students
            </label>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-subtle"
            />
            <input
              id="student-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students..."
              className="h-11 w-full rounded-xl border border-line-strong bg-white pr-4 pl-10 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-subtle hover:border-brand-200 focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
            />
          </div>
          <div>
            <label htmlFor="student-course" className="sr-only">
              Filter by course
            </label>
            <SelectInput
              id="student-course"
              options={['All courses', ...courseOptions.map((course) => course.title)]}
              value={courseOptions.find((course) => course.id === courseId)?.title ?? 'All courses'}
              onChange={(e) => setCourseId(courseOptions.find((course) => course.title === e.target.value)?.id ?? '')}
              className="h-11 truncate"
            />
          </div>
          <div>
            <label htmlFor="student-status" className="sr-only">
              Filter by status
            </label>
            <SelectInput
              id="student-status"
              options={['All statuses', ...statusOptions]}
              value={status || 'All statuses'}
              onChange={(e) => setStatus(e.target.value === 'All statuses' ? '' : e.target.value)}
              className="h-11"
            />
          </div>
          <div>
            <label htmlFor="student-progress" className="sr-only">
              Filter by progress
            </label>
            <SelectInput
              id="student-progress"
              options={['Any progress', ...progressBands.map((b) => b.label)]}
              value={progress || 'Any progress'}
              onChange={(e) => setProgress(e.target.value === 'Any progress' ? '' : e.target.value)}
              className="h-11"
            />
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {visible.length} {visible.length === 1 ? 'student' : 'students'} shown
        </p>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <SearchX aria-hidden className="size-6" />
            </span>
            <p className="mt-5 text-lg font-bold text-ink">No students match your filters</p>
            {filtersActive && (
              <Button variant="secondary" className="mt-5" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Wide screens: table */}
            <table className="hidden w-full text-left text-sm xl:table">
              <thead>
                <tr className="border-b border-line text-xs text-muted">
                  <th scope="col" className="py-3 pr-4 pl-6 font-medium">
                    Student
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Course
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Progress
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Last Active
                  </th>
                  <th scope="col" className="py-3 pr-6 pl-4 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((student) => {
                  const enrollment = primaryEnrollment(student, courseId);
                  return (
                    <tr
                      key={student.id}
                      onClick={(event) =>
                        open(student, event.currentTarget.querySelector('button') ?? event.currentTarget)
                      }
                      className="cursor-pointer border-b border-line transition-colors last:border-b-0 hover:bg-canvas/70"
                    >
                      <td className="py-3 pr-4 pl-6">
                        <div className="flex items-center gap-3">
                          <StudentAvatar student={student} />
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              open(student, event.currentTarget);
                            }}
                            className="min-w-0 rounded-md text-left"
                          >
                            <span className="block font-semibold text-ink hover:text-brand-700">{student.name}</span>
                            <span className="block text-xs text-muted">{student.email}</span>
                          </button>
                        </div>
                      </td>
                      <td className="max-w-[16rem] px-4 py-3">
                        <span className="line-clamp-2 text-body">{courseTitle(enrollment.courseId)}</span>
                        {student.enrollments.length > 1 && (
                          <span className="text-xs text-muted">+{student.enrollments.length - 1} more</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ProgressBar
                            value={enrollment.progress}
                            label={`${student.name}'s progress`}
                            tone={enrollment.progress === 100 ? 'success' : 'brand'}
                            size="sm"
                            className="w-24"
                          />
                          <span className="w-10 text-xs font-semibold text-ink tabular-nums">
                            {enrollment.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-muted">{formatRelative(student.lastActive)}</td>
                      <td className="py-3 pr-6 pl-4">
                        <StudentStatusBadge status={student.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Narrow screens: cards */}
            <ul className="divide-y divide-line xl:hidden">
              {visible.map((student) => {
                const enrollment = primaryEnrollment(student, courseId);
                return (
                  <li key={student.id}>
                    <button
                      type="button"
                      onClick={(event) => open(student, event.currentTarget)}
                      className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors hover:bg-canvas/70 sm:px-6"
                    >
                      <StudentAvatar student={student} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate font-semibold text-ink">{student.name}</span>
                          <StudentStatusBadge status={student.status} />
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted">
                          {courseTitle(enrollment.courseId)} · {formatRelative(student.lastActive)}
                        </span>
                        <span className="mt-2 flex items-center gap-3">
                          <ProgressBar
                            value={enrollment.progress}
                            label={`${student.name}'s progress`}
                            tone={enrollment.progress === 100 ? 'success' : 'brand'}
                            size="sm"
                            className="flex-1"
                          />
                          <span className="w-9 text-right text-xs font-semibold text-ink tabular-nums">
                            {enrollment.progress}%
                          </span>
                        </span>
                      </span>
                      <ChevronRight aria-hidden className="size-4 shrink-0 text-subtle" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Panel>

      <StudentDrawer
        student={selected}
        courses={courses}
        onClose={() => setSelected(null)}
        returnFocusRef={returnFocusRef}
      />
    </>
  );
}
