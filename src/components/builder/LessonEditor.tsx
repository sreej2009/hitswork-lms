import { useState } from 'react';
import { AlertCircle, ArrowDown, ArrowUp, Check, Plus, Trash2 } from 'lucide-react';
import type { CourseLesson, CourseSection, LessonType, QuizContent, QuizQuestion } from '../../types/instructor';
import { LESSON_TYPES, lessonTypeMeta } from '../../data/courseBuilder';
import { lessonErrors, newId } from '../../lib/courseBuilder';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { Checkbox, Field, SelectInput, TextArea, TextInput } from '../ui/Form';
import { Modal } from '../ui/Modal';
import { FileAttachments, VideoUpload } from './MediaInputs';
import { RichTextEditor } from './RichTextEditor';

/* ------------------------------------------------------------------ */
/*  Type picker                                                        */
/* ------------------------------------------------------------------ */

export function LessonTypePicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (type: LessonType) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Add a lesson" description="Choose what kind of lesson to create.">
      <ul className="grid gap-2.5">
        {LESSON_TYPES.map(({ type, label, description, icon: Icon, tone }) => (
          <li key={type}>
            <button
              type="button"
              onClick={() => onPick(type)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-line p-4 text-left transition-[border-color,background-color] hover:border-brand-200 hover:bg-brand-50/40"
            >
              <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl', tone)}>
                <Icon aria-hidden className="size-5" strokeWidth={1.9} />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-ink">{label}</span>
                <span className="block text-sm text-muted">{description}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Quiz builder                                                       */
/* ------------------------------------------------------------------ */

const LETTERS = 'ABCDEF';
const MAX_OPTIONS = 6;

function QuizBuilder({ quiz, onChange }: { quiz: QuizContent; onChange: (quiz: QuizContent) => void }) {
  const setQuestions = (questions: QuizQuestion[]) => onChange({ ...quiz, questions });
  const updateQuestion = (id: string, patch: Partial<QuizQuestion>) =>
    setQuestions(quiz.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  const moveQuestion = (from: number, to: number) => {
    if (to < 0 || to >= quiz.questions.length) return;
    const next = [...quiz.questions];
    const [q] = next.splice(from, 1);
    next.splice(to, 0, q);
    setQuestions(next);
  };
  const addQuestion = () => {
    const first = newId('op');
    setQuestions([
      ...quiz.questions,
      {
        id: newId('qq'),
        text: '',
        options: [
          { id: first, text: '' },
          { id: newId('op'), text: '' },
        ],
        correctOptionId: first,
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <ol className="space-y-4">
        {quiz.questions.map((question, qIndex) => (
          <li key={question.id} className="rounded-2xl border border-line bg-canvas/50 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-ink">Question {qIndex + 1}</p>
              <div className="flex">
                <button
                  type="button"
                  aria-label={`Move question ${qIndex + 1} up`}
                  disabled={qIndex === 0}
                  onClick={() => moveQuestion(qIndex, qIndex - 1)}
                  className="grid size-8 place-items-center rounded-lg text-muted hover:bg-white hover:text-ink disabled:opacity-30"
                >
                  <ArrowUp aria-hidden className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Move question ${qIndex + 1} down`}
                  disabled={qIndex === quiz.questions.length - 1}
                  onClick={() => moveQuestion(qIndex, qIndex + 1)}
                  className="grid size-8 place-items-center rounded-lg text-muted hover:bg-white hover:text-ink disabled:opacity-30"
                >
                  <ArrowDown aria-hidden className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete question ${qIndex + 1}`}
                  disabled={quiz.questions.length === 1}
                  onClick={() => setQuestions(quiz.questions.filter((q) => q.id !== question.id))}
                  className="grid size-8 place-items-center rounded-lg text-muted hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
                >
                  <Trash2 aria-hidden className="size-4" />
                </button>
              </div>
            </div>
            <label htmlFor={`${question.id}-text`} className="sr-only">
              Question {qIndex + 1}
            </label>
            <TextInput
              id={`${question.id}-text`}
              value={question.text}
              placeholder="e.g. What does JSX stand for?"
              onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
              className="mt-2"
            />
            <fieldset className="mt-3">
              <legend className="mb-2 text-xs font-medium text-muted">Options — select the correct answer</legend>
              <ul className="space-y-2">
                {question.options.map((option, oIndex) => {
                  const correct = question.correctOptionId === option.id;
                  return (
                    <li key={option.id} className="flex items-center gap-2">
                      <label
                        className={cn(
                          'grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-sm font-bold ring-1 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100',
                          correct
                            ? 'bg-emerald-500 text-white ring-emerald-500'
                            : 'bg-white text-muted ring-line-strong hover:ring-brand-200',
                        )}
                      >
                        <input
                          type="radio"
                          name={`${question.id}-correct`}
                          checked={correct}
                          onChange={() => updateQuestion(question.id, { correctOptionId: option.id })}
                          className="sr-only"
                          aria-label={`Option ${LETTERS[oIndex]} is correct`}
                        />
                        {correct ? <Check aria-hidden className="size-4" strokeWidth={3} /> : LETTERS[oIndex]}
                      </label>
                      <label htmlFor={`${option.id}-text`} className="sr-only">
                        Option {LETTERS[oIndex]}
                      </label>
                      <input
                        id={`${option.id}-text`}
                        value={option.text}
                        placeholder={`Option ${LETTERS[oIndex]}`}
                        onChange={(e) =>
                          updateQuestion(question.id, {
                            options: question.options.map((o) =>
                              o.id === option.id ? { ...o, text: e.target.value } : o,
                            ),
                          })
                        }
                        className="h-10 min-w-0 flex-1 rounded-xl border border-line-strong bg-white px-3 text-sm text-ink outline-none placeholder:text-subtle focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                      />
                      <button
                        type="button"
                        aria-label={`Remove option ${LETTERS[oIndex]}`}
                        disabled={question.options.length <= 2}
                        onClick={() => {
                          const options = question.options.filter((o) => o.id !== option.id);
                          updateQuestion(question.id, {
                            options,
                            correctOptionId: correct ? options[0].id : question.correctOptionId,
                          });
                        }}
                        className="grid size-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30"
                      >
                        <Trash2 aria-hidden className="size-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Button
                variant="ghost"
                size="sm"
                icon={Plus}
                className="mt-2"
                disabled={question.options.length >= MAX_OPTIONS}
                onClick={() =>
                  updateQuestion(question.id, { options: [...question.options, { id: newId('op'), text: '' }] })
                }
              >
                Add Option
              </Button>
            </fieldset>
          </li>
        ))}
      </ol>
      <Button variant="soft" icon={Plus} onClick={addQuestion}>
        Add Question
      </Button>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="quiz-passing" label="Passing Score">
          <SelectInput
            id="quiz-passing"
            options={['50%', '60%', '70%', '80%', '90%', '100%']}
            value={`${quiz.passingScore}%`}
            onChange={(e) => onChange({ ...quiz, passingScore: Number.parseInt(e.target.value, 10) })}
          />
        </Field>
        <Field id="quiz-attempts" label="Attempts Allowed">
          <SelectInput
            id="quiz-attempts"
            options={['Unlimited', '1', '2', '3']}
            value={quiz.attempts === 0 ? 'Unlimited' : String(quiz.attempts)}
            onChange={(e) =>
              onChange({ ...quiz, attempts: e.target.value === 'Unlimited' ? 0 : Number(e.target.value) })
            }
          />
        </Field>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lesson editor                                                      */
/* ------------------------------------------------------------------ */

interface LessonEditorProps {
  open: boolean;
  /** The lesson being edited (a fresh one when adding) */
  lesson: CourseLesson | null;
  sections: CourseSection[];
  sectionId: string;
  isNew: boolean;
  onClose: () => void;
  onSave: (lesson: CourseLesson, sectionId: string) => void;
}

export function LessonEditor(props: LessonEditorProps) {
  // Remount the form for each lesson so local state starts fresh.
  return <LessonEditorDialog key={props.lesson?.id ?? 'none'} {...props} />;
}

function LessonEditorDialog({
  open,
  lesson: initial,
  sections,
  sectionId: initialSection,
  isNew,
  onClose,
  onSave,
}: LessonEditorProps) {
  const [lesson, setLesson] = useState<CourseLesson | null>(initial);
  const [sectionId, setSectionId] = useState(initialSection);
  const [errors, setErrors] = useState<string[]>([]);
  const [videoBusy, setVideoBusy] = useState(false);
  const [filesBusy, setFilesBusy] = useState(false);
  if (!lesson) return null;
  const meta = lessonTypeMeta(lesson.type);
  // Functional update: uploads finish asynchronously and must not overwrite edits made meanwhile.
  const set = (patch: Partial<CourseLesson>) => setLesson((current) => (current ? { ...current, ...patch } : current));
  const busy = videoBusy || filesBusy;

  const save = () => {
    if (busy) return;
    const problems = lessonErrors(lesson);
    setErrors(problems);
    if (problems.length) return;
    onSave({ ...lesson, title: lesson.title.trim() }, sectionId);
  };

  const sectionLabel = (s: CourseSection, i: number) =>
    `Section ${String(i + 1).padStart(2, '0')} · ${s.title || 'Untitled'}`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={`${isNew ? 'New' : 'Edit'} ${meta.label.replace(' Lesson', '').toLowerCase()} lesson`}
      description={meta.description}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} icon={Check} disabled={busy}>
            {busy ? 'Uploading…' : lesson.type === 'assignment' ? 'Save Assignment' : 'Save Lesson'}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {errors.length > 0 && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-800">
            <p className="flex items-center gap-2 font-semibold">
              <AlertCircle aria-hidden className="size-4" />
              Please fix the following
            </p>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-6">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Field
            id="lesson-title"
            label={
              lesson.type === 'article'
                ? 'Article Title'
                : lesson.type === 'quiz'
                  ? 'Quiz Title'
                  : lesson.type === 'assignment'
                    ? 'Assignment Title'
                    : 'Lesson Title'
            }
          >
            <TextInput
              id="lesson-title"
              value={lesson.title}
              maxLength={100}
              placeholder="e.g. Your First React Component"
              onChange={(e) => set({ title: e.target.value })}
            />
          </Field>
          <Field id="lesson-section" label="Section">
            <SelectInput
              id="lesson-section"
              options={sections.map(sectionLabel)}
              value={sectionLabel(
                sections.find((s) => s.id === sectionId) ?? sections[0],
                Math.max(
                  0,
                  sections.findIndex((s) => s.id === sectionId),
                ),
              )}
              onChange={(e) => {
                const index = sections.map(sectionLabel).indexOf(e.target.value);
                if (index >= 0) setSectionId(sections[index].id);
              }}
            />
          </Field>
        </div>

        {lesson.type === 'video' && (
          <>
            <div>
              <p className="mb-1.5 text-sm font-medium text-ink">Video</p>
              <VideoUpload
                previewKey={lesson.id}
                value={lesson.video}
                onChange={(video) => set({ video })}
                onBusyChange={setVideoBusy}
                emptyText="Upload the lesson video. You can replace it later."
              />
            </div>
            <Field id="lesson-description" label="Lesson Description" optional>
              <TextArea
                id="lesson-description"
                rows={3}
                maxLength={1000}
                value={lesson.description}
                onChange={(e) => set({ description: e.target.value })}
                placeholder="What will learners do or learn in this lesson?"
              />
            </Field>
          </>
        )}

        {lesson.type === 'article' && (
          <div>
            <p id="lesson-content-label" className="mb-1.5 text-sm font-medium text-ink">
              Content
            </p>
            <RichTextEditor
              id="lesson-content"
              labelledBy="lesson-content-label"
              value={lesson.content ?? ''}
              onChange={(content) => set({ content })}
              placeholder="Write your lesson. Use headings, lists, links and code blocks."
              minHeight="min-h-64"
            />
          </div>
        )}

        {lesson.type === 'quiz' && lesson.quiz && <QuizBuilder quiz={lesson.quiz} onChange={(quiz) => set({ quiz })} />}

        {lesson.type === 'assignment' && lesson.assignment && (
          <>
            <Field id="assignment-instructions" label="Instructions">
              <TextArea
                id="assignment-instructions"
                rows={6}
                maxLength={3000}
                value={lesson.assignment.instructions}
                onChange={(e) => set({ assignment: { ...lesson.assignment!, instructions: e.target.value } })}
                placeholder="Describe the task, what to submit and how it will be graded."
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <fieldset>
                <legend className="mb-1.5 text-sm font-medium text-ink">Submission Type</legend>
                <div className="flex gap-2">
                  {(['text', 'file', 'both'] as const).map((type) => (
                    <label
                      key={type}
                      className={cn(
                        'flex h-11 flex-1 cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold capitalize transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100',
                        lesson.assignment!.submissionType === type
                          ? 'border-brand-300 bg-brand-50 text-brand-700'
                          : 'border-line-strong text-body hover:border-brand-200',
                      )}
                    >
                      <input
                        type="radio"
                        name="submission-type"
                        className="sr-only"
                        checked={lesson.assignment!.submissionType === type}
                        onChange={() => set({ assignment: { ...lesson.assignment!, submissionType: type } })}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </fieldset>
              <Field id="assignment-score" label="Maximum Score">
                <TextInput
                  id="assignment-score"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={1000}
                  value={lesson.assignment.maxScore}
                  onChange={(e) =>
                    set({
                      assignment: {
                        ...lesson.assignment!,
                        maxScore: Math.max(1, Math.min(1000, Number(e.target.value) || 1)),
                      },
                    })
                  }
                />
              </Field>
            </div>
          </>
        )}

        {lesson.type === 'resource' && (
          <Field id="lesson-description" label="Description" optional>
            <TextArea
              id="lesson-description"
              rows={3}
              value={lesson.description}
              onChange={(e) => set({ description: e.target.value })}
              placeholder="What's included in these files?"
            />
          </Field>
        )}

        {(lesson.type === 'video' || lesson.type === 'resource') && (
          <div>
            <p className="mb-2 text-sm font-medium text-ink">Resources</p>
            <FileAttachments
              files={lesson.resources}
              onChange={(update) =>
                setLesson((current) => (current ? { ...current, resources: update(current.resources) } : current))
              }
              onBusyChange={setFilesBusy}
            />
          </div>
        )}

        {lesson.type !== 'quiz' && lesson.type !== 'assignment' && (
          <Checkbox checked={lesson.freePreview} onChange={(e) => set({ freePreview: e.target.checked })}>
            <span className="font-medium text-ink">Free Preview</span>
            <span className="block text-xs text-muted">Anyone can watch or read this lesson before enrolling.</span>
          </Checkbox>
        )}
      </div>
    </Modal>
  );
}
