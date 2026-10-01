import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BookOpen,
  CircleCheck,
  Clock3,
  GraduationCap,
  IndianRupee,
  Search,
  Star,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from 'lucide-react';
import { courses as catalog } from '../../data/courses';
import { instructorSummary, studentSummary } from '../../data/admin';
import type { AdminApplication, AdminInstructor, AdminStudent } from '../../types/admin';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { formatDate, formatNumber, formatPrice, formatRelative } from '../../lib/format';
import {
  AdminHeader,
  ConfirmDialog,
  PersonCell,
  RatingText,
  SampleNote,
  StatusPill,
} from '../../components/admin/AdminChrome';
import { DataTable, RowAction } from '../../components/admin/DataTable';
import { ProgressBar } from '../../components/dashboard/ProgressBar';
import { CourseThumb } from '../../components/instructor/CourseList';
import { Panel } from '../../components/instructor/InstructorChrome';
import { MetricCard } from '../../components/instructor/MetricCard';
import { AppLink } from '../../components/ui/AppLink';
import { Button } from '../../components/ui/Button';
import { Field, SelectInput, TextArea } from '../../components/ui/Form';
import { Modal } from '../../components/ui/Modal';

/* ------------------------------------------------------------------ */
/*  Shared: message dialog (demo — nothing is sent)                    */
/* ------------------------------------------------------------------ */

function useMessageDialog() {
  const { notify } = useStore();
  const [to, setTo] = useState<{ name: string; email: string } | null>(null);
  const [text, setText] = useState('');
  const dialog = (
    <Modal
      open={!!to}
      onClose={() => setTo(null)}
      title={`Message ${to?.name ?? ''}`}
      description="Demo only — messages aren’t delivered yet."
      footer={
        <>
          <Button variant="secondary" onClick={() => setTo(null)}>
            Cancel
          </Button>
          <Button
            disabled={text.trim().length < 2}
            onClick={() => {
              notify(`Message to ${to?.name} saved (demo)`);
              setTo(null);
            }}
          >
            Send Message
          </Button>
        </>
      }
    >
      <Field id="admin-message" label="Message">
        <TextArea id="admin-message" rows={5} autoFocus value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
    </Modal>
  );
  return {
    message: (person: { name: string; email: string }) => {
      setText('');
      setTo(person);
    },
    dialog,
  };
}

function SearchBox({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-subtle"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-line-strong bg-white pr-4 pl-10 text-[15px] text-ink outline-none placeholder:text-subtle focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Instructors                                                        */
/* ------------------------------------------------------------------ */

type InstructorAction =
  | { type: 'approve' | 'suspend'; instructor: AdminInstructor }
  | { type: 'app-approve' | 'app-reject'; app: AdminApplication };

function useInstructorActions() {
  const { setInstructorStatus, decideApplication } = useAdmin();
  const { notify } = useStore();
  const [action, setAction] = useState<InstructorAction | null>(null);
  const close = () => setAction(null);
  const dialogs = (
    <>
      <ConfirmDialog
        open={action?.type === 'approve'}
        title="Approve this instructor?"
        description="They’ll be able to publish courses after review."
        confirmLabel="Approve"
        onClose={close}
        onConfirm={() => {
          if (action?.type !== 'approve') return;
          setInstructorStatus(action.instructor.id, 'Active');
          notify(`${action.instructor.name} is now active`);
          close();
        }}
      />
      <ConfirmDialog
        open={action?.type === 'suspend'}
        title="Suspend this instructor?"
        description="Their courses stay visible to enrolled learners, but they can’t publish or edit until reinstated."
        confirmLabel="Suspend"
        tone="danger"
        onClose={close}
        onConfirm={() => {
          if (action?.type !== 'suspend') return;
          setInstructorStatus(action.instructor.id, 'Suspended');
          notify(`${action.instructor.name} suspended`);
          close();
        }}
      />
      <ConfirmDialog
        open={action?.type === 'app-approve'}
        title="Approve this application?"
        description="The applicant becomes an instructor and can start creating courses."
        confirmLabel="Approve Application"
        onClose={close}
        onConfirm={() => {
          if (action?.type !== 'app-approve') return;
          decideApplication(action.app.id, true);
          notify(`${action.app.name} approved as an instructor`);
          close();
        }}
      />
      <ConfirmDialog
        open={action?.type === 'app-reject'}
        title="Reject this application?"
        description="The applicant will be told their application wasn’t successful."
        confirmLabel="Reject Application"
        tone="danger"
        onClose={close}
        onConfirm={() => {
          if (action?.type !== 'app-reject') return;
          decideApplication(action.app.id, false);
          notify(`Application from ${action.app.name} rejected`);
          close();
        }}
      />
    </>
  );
  return { setAction, dialogs };
}

function ApplicationReview({
  app,
  onClose,
  onDecide,
}: {
  app: AdminApplication | null;
  onClose: () => void;
  onDecide: (approve: boolean) => void;
}) {
  return (
    <Modal
      open={!!app}
      onClose={onClose}
      title={app?.name ?? ''}
      description={app ? `${app.email} · applied ${formatRelative(app.appliedAt)}` : undefined}
      footer={
        app?.status === 'Pending' ? (
          <>
            <Button variant="danger" onClick={() => onDecide(false)}>
              Reject
            </Button>
            <Button onClick={() => onDecide(true)}>Approve</Button>
          </>
        ) : undefined
      }
    >
      {app && (
        <dl className="space-y-3 text-sm">
          {[
            ['Expertise', app.expertise],
            ['Experience', app.experience],
            ['Category', app.category],
            ['About', app.about],
            ['Status', <StatusPill key="s" status={app.status} />],
          ].map(([label, value]) => (
            <div key={String(label)}>
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="mt-0.5 text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Modal>
  );
}

export function AdminInstructorsPage() {
  usePageMeta('Instructors — Hitswork Admin', 'Manage instructors and applications.');
  const { instructors, applications } = useAdmin();
  const { setAction, dialogs } = useInstructorActions();
  const { message, dialog } = useMessageDialog();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [reviewing, setReviewing] = useState<AdminApplication | null>(null);

  const pendingApps = applications.filter((a) => a.status === 'Pending');
  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return instructors
      .filter((i) => status === 'All statuses' || i.status === status)
      .filter((i) => !term || `${i.name} ${i.email} ${i.specializations.join(' ')}`.toLowerCase().includes(term));
  }, [instructors, query, status]);

  const actions = (i: AdminInstructor) => (
    <div className="flex flex-wrap justify-end gap-1">
      <RowAction href={`/admin/instructors/${i.id}`}>View</RowAction>
      {i.status !== 'Active' && (
        <RowAction tone="primary" onClick={() => setAction({ type: 'approve', instructor: i })}>
          Approve
        </RowAction>
      )}
      {i.status !== 'Suspended' && (
        <RowAction tone="danger" onClick={() => setAction({ type: 'suspend', instructor: i })}>
          Suspend
        </RowAction>
      )}
      <RowAction onClick={() => message(i)}>Message</RowAction>
    </div>
  );

  return (
    <>
      <AdminHeader title="Instructors" subtitle="People teaching on Hitswork and new applications." />
      <section
        aria-label="Instructor metrics"
        className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 xl:grid-cols-4"
      >
        <MetricCard index={0} label="Total Instructors" value={formatNumber(instructorSummary.total)} icon={Users} />
        <MetricCard
          index={1}
          label="Active"
          value={formatNumber(instructorSummary.active)}
          icon={UserCheck}
          tone="bg-emerald-50 text-emerald-600"
        />
        <MetricCard
          index={2}
          label="Pending Applications"
          value={pendingApps.length}
          icon={UserPlus}
          tone="bg-amber-50 text-amber-600"
        />
        <MetricCard
          index={3}
          label="Suspended"
          value={formatNumber(instructorSummary.suspended)}
          icon={UserX}
          tone="bg-rose-50 text-rose-600"
        />
      </section>
      <SampleNote />

      <div id="applications" className="mt-6">
        <Panel
          title="Pending Instructor Applications"
          titleId="applications-title"
          description={`${pendingApps.length} waiting for a decision`}
          flush
        >
          <DataTable
            rows={applications.filter((a) => a.status === 'Pending')}
            rowKey={(a) => a.id}
            caption="Pending instructor applications"
            empty={<p className="px-6 py-10 text-center text-sm text-muted">No pending applications.</p>}
            columns={[
              {
                key: 'name',
                header: 'Name',
                render: (a) => <PersonCell name={a.name} sub={a.live ? 'Applied on this site' : a.category} />,
              },
              { key: 'email', header: 'Email', render: (a) => a.email },
              { key: 'expertise', header: 'Expertise', render: (a) => a.expertise },
              {
                key: 'experience',
                header: 'Experience',
                render: (a) => <span className="whitespace-nowrap">{a.experience}</span>,
              },
              {
                key: 'applied',
                header: 'Applied',
                render: (a) => <span className="whitespace-nowrap">{formatRelative(a.appliedAt)}</span>,
              },
              { key: 'status', header: 'Status', render: (a) => <StatusPill status={a.status} /> },
              {
                key: 'actions',
                header: <span className="sr-only">Actions</span>,
                align: 'right',
                render: (a) => (
                  <div className="flex justify-end gap-1">
                    <RowAction onClick={() => setReviewing(a)}>Review</RowAction>
                    <RowAction tone="primary" onClick={() => setAction({ type: 'app-approve', app: a })}>
                      Approve
                    </RowAction>
                    <RowAction tone="danger" onClick={() => setAction({ type: 'app-reject', app: a })}>
                      Reject
                    </RowAction>
                  </div>
                ),
              },
            ]}
            card={(a) => (
              <div>
                <PersonCell name={a.name} sub={`${a.email} · ${a.expertise}`} />
                <p className="mt-2 text-xs text-muted">
                  {a.experience} · applied {formatRelative(a.appliedAt)}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1">
                  <RowAction onClick={() => setReviewing(a)}>Review</RowAction>
                  <RowAction tone="primary" onClick={() => setAction({ type: 'app-approve', app: a })}>
                    Approve
                  </RowAction>
                  <RowAction tone="danger" onClick={() => setAction({ type: 'app-reject', app: a })}>
                    Reject
                  </RowAction>
                </div>
              </div>
            )}
          />
        </Panel>
      </div>

      <Panel className="mt-6" title="All Instructors" titleId="instructors-title" flush>
        <div className="flex flex-col gap-3 border-b border-line px-5 pb-4 sm:flex-row sm:px-6">
          <SearchBox id="instructor-search" value={query} onChange={setQuery} placeholder="Search instructors..." />
          <div className="sm:w-48">
            <label htmlFor="instructor-status" className="sr-only">
              Status
            </label>
            <SelectInput
              id="instructor-status"
              options={['All statuses', 'Active', 'Pending', 'Suspended']}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11"
            />
          </div>
        </div>
        <DataTable
          rows={rows}
          rowKey={(i) => i.id}
          caption="Instructors"
          empty={<p className="px-6 py-10 text-center text-sm text-muted">No instructors match.</p>}
          columns={[
            {
              key: 'name',
              header: 'Instructor',
              render: (i) => (
                <PersonCell name={i.name} sub={i.headline} href={`/admin/instructors/${i.id}`} photoId={i.photoId} />
              ),
            },
            { key: 'email', header: 'Email', className: 'max-w-[12rem] truncate', render: (i) => i.email },
            { key: 'courses', header: 'Courses', align: 'right', render: (i) => i.courses },
            { key: 'students', header: 'Students', align: 'right', render: (i) => formatNumber(i.students) },
            {
              key: 'rating',
              header: 'Rating',
              align: 'right',
              render: (i) => <RatingText rating={i.rating || null} />,
            },
            {
              key: 'revenue',
              header: 'Revenue',
              align: 'right',
              render: (i) => <span className="whitespace-nowrap">{formatPrice(i.revenue)}</span>,
            },
            { key: 'status', header: 'Status', render: (i) => <StatusPill status={i.status} /> },
            {
              key: 'joined',
              header: 'Joined',
              render: (i) => <span className="whitespace-nowrap">{formatDate(i.joinedAt)}</span>,
            },
            { key: 'actions', header: <span className="sr-only">Actions</span>, align: 'right', render: actions },
          ]}
          card={(i) => (
            <div>
              <div className="flex items-start justify-between gap-3">
                <PersonCell name={i.name} sub={i.email} href={`/admin/instructors/${i.id}`} photoId={i.photoId} />
                <StatusPill status={i.status} />
              </div>
              <p className="mt-2 text-xs text-muted">
                {i.courses} courses · {formatNumber(i.students)} students · {formatPrice(i.revenue)}
              </p>
              <div className="mt-2 [&>div]:justify-start">{actions(i)}</div>
            </div>
          )}
        />
      </Panel>

      <ApplicationReview
        app={reviewing}
        onClose={() => setReviewing(null)}
        onDecide={(approve) => {
          const app = reviewing!;
          setReviewing(null);
          setAction({ type: approve ? 'app-approve' : 'app-reject', app });
        }}
      />
      {dialogs}
      {dialog}
    </>
  );
}

export function AdminInstructorDetailPage() {
  const { id = '' } = useParams();
  const { instructors, courses } = useAdmin();
  const { setAction, dialogs } = useInstructorActions();
  const { message, dialog } = useMessageDialog();
  const instructor = instructors.find((i) => i.id === id);
  usePageMeta(instructor ? `${instructor.name} — Hitswork Admin` : 'Instructor not found', 'Instructor details.');

  if (!instructor) {
    return (
      <>
        <AdminHeader title="Instructor not found" />
        <Button href="/admin/instructors" variant="secondary">
          Back to Instructors
        </Button>
      </>
    );
  }
  const taught = courses.filter((c) => c.instructor === instructor.name);

  return (
    <>
      <AdminHeader
        eyebrow={
          <AppLink
            href="/admin/instructors"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Instructors
          </AppLink>
        }
        title={instructor.name}
        subtitle={instructor.headline}
      />
      {instructor.status === 'Suspended' && (
        <p
          role="status"
          className="mb-6 flex items-center gap-2.5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 ring-1 ring-rose-100"
        >
          <AlertTriangle aria-hidden className="size-4 shrink-0" />
          This instructor is suspended. They can’t publish or edit courses until reinstated.
        </p>
      )}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <Panel>
          <PersonCell name={instructor.name} sub={instructor.email} photoId={instructor.photoId} />
          <div className="mt-3">
            <StatusPill status={instructor.status} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-body">{instructor.bio}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Specializations">
            {instructor.specializations.map((s) => (
              <li key={s} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">Joined {formatDate(instructor.joinedAt)}</p>
          <div className="mt-5 grid gap-2">
            {instructor.status !== 'Active' && (
              <Button onClick={() => setAction({ type: 'approve', instructor })}>Approve</Button>
            )}
            {instructor.status !== 'Suspended' && (
              <Button variant="danger" onClick={() => setAction({ type: 'suspend', instructor })}>
                Suspend
              </Button>
            )}
            <Button variant="secondary" onClick={() => message(instructor)}>
              Message
            </Button>
          </div>
        </Panel>

        <div className="min-w-0 space-y-6">
          <section
            aria-label="Instructor metrics"
            className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 lg:grid-cols-4"
          >
            <MetricCard label="Courses" value={instructor.courses} icon={BookOpen} />
            <MetricCard
              index={1}
              label="Students"
              value={formatNumber(instructor.students)}
              icon={Users}
              tone="bg-cyan-50 text-cyan-600"
            />
            <MetricCard
              index={2}
              label="Revenue"
              value={formatPrice(instructor.revenue)}
              icon={IndianRupee}
              tone="bg-emerald-50 text-emerald-600"
            />
            <MetricCard
              index={3}
              label="Rating"
              value={instructor.rating ? instructor.rating.toFixed(1) : '—'}
              icon={Star}
              tone="bg-amber-50 text-amber-500"
            />
          </section>
          <p className="flex items-center gap-2 text-sm text-body">
            <Award aria-hidden className="size-4 text-brand-600" />
            {formatNumber(instructor.certificates)} certificates issued to learners
          </p>
          <Panel title="Course performance" titleId="instructor-courses" flush>
            <DataTable
              rows={taught}
              rowKey={(c) => c.id}
              caption={`Courses by ${instructor.name}`}
              breakpoint="lg"
              empty={<p className="px-6 py-10 text-center text-sm text-muted">No courses yet.</p>}
              columns={[
                {
                  key: 'course',
                  header: 'Course',
                  render: (c) => (
                    <AppLink
                      href={`/admin/courses/${c.id}/review`}
                      className="flex items-center gap-3 font-semibold text-ink hover:text-brand-700"
                    >
                      <CourseThumb course={c} className="h-9 w-14" />
                      <span className="line-clamp-2">{c.title}</span>
                    </AppLink>
                  ),
                },
                { key: 'students', header: 'Students', align: 'right', render: (c) => formatNumber(c.students) },
                { key: 'rating', header: 'Rating', align: 'right', render: (c) => <RatingText rating={c.rating} /> },
                { key: 'revenue', header: 'Revenue', align: 'right', render: (c) => formatPrice(c.revenue) },
                { key: 'status', header: 'Status', render: (c) => <StatusPill status={c.status} /> },
              ]}
              card={(c) => (
                <AppLink href={`/admin/courses/${c.id}/review`} className="block">
                  <p className="font-semibold text-ink">{c.title}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <StatusPill status={c.status} />
                    {formatNumber(c.students)} students · {formatPrice(c.revenue)}
                  </p>
                </AppLink>
              )}
            />
          </Panel>
        </div>
      </div>
      {dialogs}
      {dialog}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Students                                                           */
/* ------------------------------------------------------------------ */

function useStudentSuspend() {
  const { setStudentStatus } = useAdmin();
  const { notify } = useStore();
  const [target, setTarget] = useState<AdminStudent | null>(null);
  const suspending = target?.status !== 'Suspended';
  const dialog = (
    <ConfirmDialog
      open={!!target}
      title={suspending ? 'Suspend this student?' : 'Reinstate this student?'}
      description={
        suspending
          ? 'They won’t be able to sign in or access their courses.'
          : 'They’ll regain access to their courses.'
      }
      confirmLabel={suspending ? 'Suspend' : 'Reinstate'}
      tone={suspending ? 'danger' : 'primary'}
      onClose={() => setTarget(null)}
      onConfirm={() => {
        if (!target) return;
        setStudentStatus(target.id, suspending ? 'Suspended' : 'Active');
        notify(`${target.name} ${suspending ? 'suspended' : 'reinstated'}`);
        setTarget(null);
      }}
    />
  );
  return { suspend: setTarget, dialog };
}

export function AdminStudentsPage() {
  usePageMeta('Students — Hitswork Admin', 'Manage students.');
  const { students } = useAdmin();
  const { suspend, dialog } = useStudentSuspend();
  const { message, dialog: messageDialog } = useMessageDialog();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return students
      .filter((s) => status === 'All statuses' || s.status === status)
      .filter((s) => !term || `${s.name} ${s.email}`.toLowerCase().includes(term));
  }, [students, query, status]);

  const actions = (s: AdminStudent) => (
    <div className="flex flex-wrap justify-end gap-1">
      <RowAction href={`/admin/students/${s.id}`}>View</RowAction>
      <RowAction tone={s.status === 'Suspended' ? 'primary' : 'danger'} onClick={() => suspend(s)}>
        {s.status === 'Suspended' ? 'Reinstate' : 'Suspend'}
      </RowAction>
      <RowAction onClick={() => message(s)}>Message</RowAction>
    </div>
  );

  return (
    <>
      <AdminHeader title="Students" subtitle="Learners across Hitswork." />
      <section aria-label="Student metrics" className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 xl:grid-cols-4">
        <MetricCard index={0} label="Total Students" value={formatNumber(studentSummary.total)} icon={Users} />
        <MetricCard
          index={1}
          label="Active"
          value={formatNumber(studentSummary.active)}
          icon={UserCheck}
          tone="bg-emerald-50 text-emerald-600"
        />
        <MetricCard
          index={2}
          label="New This Month"
          value={formatNumber(studentSummary.newThisMonth)}
          icon={UserPlus}
          tone="bg-cyan-50 text-cyan-600"
          trend="+11.2%"
        />
        <MetricCard
          index={3}
          label="Completed Courses"
          value={formatNumber(studentSummary.completed)}
          icon={CircleCheck}
          tone="bg-violet-50 text-violet-600"
        />
      </section>
      <SampleNote />

      <Panel
        className="mt-6"
        title="All Students"
        titleId="students-list"
        description="A sample of recently active students."
        flush
      >
        <div className="flex flex-col gap-3 border-b border-line px-5 pb-4 sm:flex-row sm:px-6">
          <SearchBox id="student-admin-search" value={query} onChange={setQuery} placeholder="Search students..." />
          <div className="sm:w-48">
            <label htmlFor="student-admin-status" className="sr-only">
              Status
            </label>
            <SelectInput
              id="student-admin-status"
              options={['All statuses', 'Active', 'Inactive', 'Suspended']}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11"
            />
          </div>
        </div>
        <DataTable
          rows={rows}
          rowKey={(s) => s.id}
          caption="Students"
          empty={<p className="px-6 py-10 text-center text-sm text-muted">No students match.</p>}
          columns={[
            {
              key: 'name',
              header: 'Student',
              render: (s) => (
                <PersonCell name={s.name} sub={s.email} href={`/admin/students/${s.id}`} photoId={s.photoId} />
              ),
            },
            { key: 'courses', header: 'Courses', align: 'right', render: (s) => s.courses },
            {
              key: 'progress',
              header: 'Progress',
              render: (s) => (
                <div className="flex items-center gap-2">
                  <ProgressBar value={s.progress} label={`${s.name}'s average progress`} size="sm" className="w-20" />
                  <span className="text-xs font-semibold tabular-nums">{s.progress}%</span>
                </div>
              ),
            },
            {
              key: 'active',
              header: 'Last Active',
              render: (s) => <span className="whitespace-nowrap">{formatRelative(s.lastActive)}</span>,
            },
            { key: 'status', header: 'Status', render: (s) => <StatusPill status={s.status} /> },
            {
              key: 'joined',
              header: 'Joined',
              render: (s) => <span className="whitespace-nowrap">{formatDate(s.joinedAt)}</span>,
            },
            { key: 'actions', header: <span className="sr-only">Actions</span>, align: 'right', render: actions },
          ]}
          card={(s) => (
            <div>
              <div className="flex items-start justify-between gap-3">
                <PersonCell name={s.name} sub={s.email} href={`/admin/students/${s.id}`} photoId={s.photoId} />
                <StatusPill status={s.status} />
              </div>
              <p className="mt-2 text-xs text-muted">
                {s.courses} courses · {s.progress}% avg progress · active {formatRelative(s.lastActive)}
              </p>
              <div className="mt-2 [&>div]:justify-start">{actions(s)}</div>
            </div>
          )}
        />
      </Panel>
      {dialog}
      {messageDialog}
    </>
  );
}

export function AdminStudentDetailPage() {
  const { id = '' } = useParams();
  const { students } = useAdmin();
  const { suspend, dialog } = useStudentSuspend();
  const { message, dialog: messageDialog } = useMessageDialog();
  const student = students.find((s) => s.id === id);
  usePageMeta(student ? `${student.name} — Hitswork Admin` : 'Student not found', 'Student details.');
  if (!student) {
    return (
      <>
        <AdminHeader title="Student not found" />
        <Button href="/admin/students" variant="secondary">
          Back to Students
        </Button>
      </>
    );
  }
  const catalogImage = (courseId: string) => catalog.find((c) => c.id === courseId)?.image ?? '';
  return (
    <>
      <AdminHeader
        eyebrow={
          <AppLink
            href="/admin/students"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Students
          </AppLink>
        }
        title={student.name}
        subtitle={`Joined ${formatDate(student.joinedAt)}`}
      />
      {student.status === 'Suspended' && (
        <p
          role="status"
          className="mb-6 flex items-center gap-2.5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 ring-1 ring-rose-100"
        >
          <AlertTriangle aria-hidden className="size-4 shrink-0" />
          This student is suspended.
        </p>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <Panel>
          <PersonCell name={student.name} sub={student.email} photoId={student.photoId} />
          <div className="mt-3">
            <StatusPill status={student.status} />
          </div>
          <p className="mt-4 text-xs text-muted">Last active {formatRelative(student.lastActive)}</p>
          <p className="mt-1 text-xs text-muted">
            Only learning activity is shown. Payment details are never displayed here.
          </p>
          <div className="mt-5 grid gap-2">
            <Button variant="secondary" onClick={() => suspend(student)}>
              {student.status === 'Suspended' ? 'Reinstate' : 'Suspend'}
            </Button>
            <Button variant="secondary" onClick={() => message(student)}>
              Message
            </Button>
          </div>
        </Panel>
        <div className="min-w-0 space-y-6">
          <section
            aria-label="Learning statistics"
            className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 lg:grid-cols-4"
          >
            <MetricCard label="Courses Enrolled" value={student.courses} icon={BookOpen} />
            <MetricCard
              index={1}
              label="Completed"
              value={student.completed}
              icon={CircleCheck}
              tone="bg-emerald-50 text-emerald-600"
            />
            <MetricCard
              index={2}
              label="Learning Hours"
              value={`${student.learningHours}h`}
              icon={Clock3}
              tone="bg-cyan-50 text-cyan-600"
            />
            <MetricCard
              index={3}
              label="Certificates"
              value={student.certificates}
              icon={GraduationCap}
              tone="bg-violet-50 text-violet-600"
            />
          </section>
          <Panel title="Enrolled Courses" titleId="student-courses" flush>
            <DataTable
              rows={student.enrollments}
              rowKey={(e) => e.courseId}
              caption="Enrolled courses"
              breakpoint="lg"
              columns={[
                {
                  key: 'course',
                  header: 'Course',
                  render: (e) => (
                    <div className="flex items-center gap-3">
                      <CourseThumb course={{ image: catalogImage(e.courseId) }} className="h-9 w-14" />
                      <span className="line-clamp-2 font-semibold text-ink">{e.title}</span>
                    </div>
                  ),
                },
                {
                  key: 'progress',
                  header: 'Progress',
                  render: (e) => (
                    <div className="flex items-center gap-2">
                      <ProgressBar
                        value={e.progress}
                        label={`Progress in ${e.title}`}
                        size="sm"
                        tone={e.progress === 100 ? 'success' : 'brand'}
                        className="w-24"
                      />
                      <span className="text-xs font-semibold tabular-nums">{e.progress}%</span>
                    </div>
                  ),
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (e) => (
                    <StatusPill
                      status={
                        e.status === 'In progress' ? 'Active' : e.status === 'Completed' ? 'Completed' : 'Inactive'
                      }
                    />
                  ),
                },
                {
                  key: 'active',
                  header: 'Last Active',
                  render: (e) => <span className="whitespace-nowrap">{formatRelative(e.lastActive)}</span>,
                },
              ]}
              card={(e) => (
                <div>
                  <p className="font-semibold text-ink">{e.title}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <ProgressBar value={e.progress} label={`Progress in ${e.title}`} size="sm" className="flex-1" />
                    <span className="text-xs font-semibold">{e.progress}%</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {e.status} · {formatRelative(e.lastActive)}
                  </p>
                </div>
              )}
            />
          </Panel>
        </div>
      </div>
      {dialog}
      {messageDialog}
    </>
  );
}
