import { useState } from 'react';
import type { AdminCourse } from '../../types/admin';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { Field, TextArea } from '../ui/Form';
import { ConfirmDialog } from './AdminChrome';

export type CourseDecision = 'approve' | 'changes' | 'reject' | 'publish' | 'unpublish' | 'delete';

const MIN_NOTE = 10;

/**
 * Every course status change made by an admin goes through these dialogs.
 * Usage: `const { decide, dialogs } = useCourseDecisions(); … decide('approve', course) … {dialogs}`
 */
export function useCourseDecisions(onDone?: (decision: CourseDecision, course: AdminCourse) => void) {
  const { setCourseStatus, deleteCourse } = useAdmin();
  const { notify } = useStore();
  const [pending, setPending] = useState<{ decision: CourseDecision; course: AdminCourse } | null>(null);
  const [note, setNote] = useState('');
  const [touched, setTouched] = useState(false);

  const decide = (decision: CourseDecision, course: AdminCourse) => {
    setNote('');
    setTouched(false);
    setPending({ decision, course });
  };
  const close = () => setPending(null);

  const finish = (message: string) => {
    if (!pending) return;
    notify(message);
    onDone?.(pending.decision, pending.course);
    setPending(null);
  };

  const noteValid = note.trim().length >= MIN_NOTE;
  const course = pending?.course;
  const noteField = (label: string, placeholder: string) => (
    <Field
      id="decision-note"
      label={label}
      error={touched && !noteValid ? `Please write at least ${MIN_NOTE} characters` : undefined}
      hint={`${note.trim().length} characters`}
    >
      <TextArea
        id="decision-note"
        rows={4}
        maxLength={1000}
        autoFocus
        value={note}
        placeholder={placeholder}
        onChange={(e) => setNote(e.target.value)}
        onBlur={() => setTouched(true)}
        invalid={touched && !noteValid}
      />
    </Field>
  );

  const dialogs = (
    <>
      <ConfirmDialog
        open={pending?.decision === 'approve'}
        title="Approve this course?"
        description="This course will become available to learners after approval."
        confirmLabel="Approve Course"
        onClose={close}
        onConfirm={() => {
          setCourseStatus(course!.id, 'Published');
          finish(`“${course!.title}” approved and published`);
        }}
      >
        <p className="text-sm font-semibold text-ink">{course?.title}</p>
        <p className="text-sm text-muted">by {course?.instructor}</p>
      </ConfirmDialog>

      <ConfirmDialog
        open={pending?.decision === 'changes'}
        title="Request Changes"
        description="The instructor sees your feedback on their dashboard and can resubmit."
        confirmLabel="Send Feedback"
        disabled={!noteValid}
        onClose={close}
        onConfirm={() => {
          setCourseStatus(course!.id, 'Changes Requested', note.trim());
          finish('Feedback sent to the instructor');
        }}
      >
        {noteField('Feedback', 'Tell the instructor what needs to be updated...')}
      </ConfirmDialog>

      <ConfirmDialog
        open={pending?.decision === 'reject'}
        title="Reject Course"
        description="A reason is required. The instructor will see it."
        confirmLabel="Reject Course"
        tone="danger"
        disabled={!noteValid}
        onClose={close}
        onConfirm={() => {
          setCourseStatus(course!.id, 'Rejected', note.trim());
          finish(`“${course!.title}” rejected`);
        }}
      >
        {noteField('Reason', 'Explain why this course can’t be published...')}
      </ConfirmDialog>

      <ConfirmDialog
        open={pending?.decision === 'publish'}
        title="Publish this course?"
        description="It will appear in the public catalog straight away."
        confirmLabel="Publish"
        onClose={close}
        onConfirm={() => {
          setCourseStatus(course!.id, 'Published');
          finish(`“${course!.title}” published`);
        }}
      />

      <ConfirmDialog
        open={pending?.decision === 'unpublish'}
        title="Unpublish this course?"
        description="Learners won’t be able to find or buy it. Enrolled learners keep access."
        confirmLabel="Unpublish"
        tone="danger"
        onClose={close}
        onConfirm={() => {
          setCourseStatus(course!.id, 'Draft');
          finish(`“${course!.title}” unpublished`);
        }}
      />

      <ConfirmDialog
        open={pending?.decision === 'delete'}
        title="Delete this course?"
        description="This permanently removes the course. It can’t be undone."
        confirmLabel="Delete Course"
        tone="danger"
        onClose={close}
        onConfirm={() => {
          deleteCourse(course!.id);
          finish(`“${course!.title}” deleted`);
        }}
      >
        <p className="text-sm font-semibold text-ink">{course?.title}</p>
      </ConfirmDialog>
    </>
  );

  return { decide, dialogs };
}
