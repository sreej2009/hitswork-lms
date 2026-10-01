import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Eye,
  Layers,
  ListChecks,
  Loader2,
  Save,
  Send,
} from 'lucide-react';
import { useInstructor } from '../../context/InstructorContext';
import { useStore } from '../../context/StoreContext';
import { useCourseDraft, type SaveState } from '../../hooks/useCourseDraft';
import { usePageMeta } from '../../hooks/usePageMeta';
import {
  canSubmit,
  checklist,
  completionPercent,
  countLessons,
  effectivePrice,
  type BuilderStep,
  type ChecklistItem,
  type CourseDraft,
} from '../../lib/courseBuilder';
import { requiresCourseApproval } from '../../lib/adminStorage';
import { cn } from '../../lib/cn';
import { formatPrice, formatRelative } from '../../lib/format';
import { BasicsStep, PricingStep, SettingsStep, StepCard } from '../../components/builder/BuilderSteps';
import { CurriculumBuilder } from '../../components/builder/CurriculumBuilder';
import { CourseStatusBadge } from '../../components/instructor/CourseList';
import { AppLink } from '../../components/ui/AppLink';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { easeOutSoft } from '../../components/ui/Reveal';

const STEPS: { id: BuilderStep; label: string }[] = [
  { id: 'basics', label: 'Basic Information' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'settings', label: 'Settings' },
  { id: 'preview', label: 'Preview' },
];

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

function SaveStatus({ state, savedAt, persisted }: { state: SaveState; savedAt: number | null; persisted: boolean }) {
  // Re-render every 30 s so "Saved 2 min ago" stays accurate.
  const [, tick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  let content: ReactNode;
  if (state === 'pending' || state === 'saving')
    content = (
      <>
        <Loader2 aria-hidden className="size-3.5 animate-spin" />
        Saving…
      </>
    );
  else if (savedAt && persisted) {
    const seconds = (Date.now() - savedAt) / 1000;
    content = (
      <>
        <Check aria-hidden className="size-3.5 text-emerald-600" strokeWidth={3} />
        {seconds < 60 ? 'Saved just now' : `Saved ${formatRelative(new Date(savedAt).toISOString())}`}
      </>
    );
  } else content = 'Not saved yet';

  return (
    <p
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-1.5 text-xs text-muted"
      data-testid="save-status"
    >
      {content}
    </p>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-16 shrink-0">
      <svg viewBox="0 0 64 64" className="size-full -rotate-90" aria-hidden>
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--color-brand-50)" strokeWidth="7" />
        <motion.circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="var(--color-brand-600)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c * (1 - percent / 100) }}
          transition={{ duration: 0.6, ease: easeOutSoft }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-sm font-extrabold text-ink">
        {percent}%
      </span>
    </div>
  );
}

interface ProgressPanelProps {
  items: ChecklistItem[];
  draft: CourseDraft;
  onGo: (step: BuilderStep) => void;
  actions?: ReactNode;
}

function ProgressPanel({ items, draft, onGo, actions }: ProgressPanelProps) {
  const percent = completionPercent(items);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <ProgressRing percent={percent} />
        <div>
          <p className="text-sm font-semibold text-ink">Course Progress</p>
          <p className="text-xs text-muted">
            {items.filter((i) => i.done).length} of {items.length} steps complete
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold tracking-[0.12em] text-subtle uppercase">Course Setup</p>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onGo(item.step)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-canvas"
              >
                {item.done ? (
                  <CheckCircle2 aria-hidden className="size-[18px] shrink-0 text-emerald-500" />
                ) : (
                  <Circle
                    aria-hidden
                    className={cn('size-[18px] shrink-0', item.required ? 'text-amber-400' : 'text-line-strong')}
                  />
                )}
                <span className={cn('flex-1', item.done ? 'text-ink' : 'text-body')}>{item.label}</span>
                <span className="sr-only">
                  {item.done ? 'complete' : item.required ? 'required, incomplete' : 'recommended'}
                </span>
                {!item.done && !item.required && <span className="text-[10px] font-medium text-muted">Optional</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-sm text-muted">Course Status</p>
        <CourseStatusBadge status={draft.status} />
      </div>
      {actions}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Preview step (summary)                                             */
/* ------------------------------------------------------------------ */

function PreviewStep({
  draft,
  items,
  onPreview,
  onGo,
}: {
  draft: CourseDraft;
  items: ChecklistItem[];
  onPreview: () => void;
  onGo: (step: BuilderStep) => void;
}) {
  const lessons = countLessons(draft.sections);
  const missing = items.filter((i) => !i.done);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.75rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2rem]">Preview</h1>
        <p className="mt-1.5 text-[15px] text-body sm:text-base">
          Check how learners will see your course before you submit it.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <StepCard title="Course card">
          <div className="overflow-hidden rounded-2xl border border-line">
            {draft.thumbnail ? (
              <img src={draft.thumbnail} alt="" className="aspect-video w-full object-cover" />
            ) : (
              <div className="grid aspect-video place-items-center bg-canvas text-sm text-muted">No thumbnail yet</div>
            )}
            <div className="p-4">
              <p className="text-xs font-semibold text-brand-600">{draft.category || 'Category'}</p>
              <p className="mt-1 font-display text-lg leading-snug font-bold text-ink">
                {draft.title || 'Untitled course'}
              </p>
              <p className="mt-1 text-sm text-body">{draft.subtitle || 'Add a subtitle'}</p>
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <Layers aria-hidden className="size-3.5" />
                  {draft.sections.length} sections · {lessons} lessons
                </span>
                <span>{draft.level}</span>
                <span>{draft.language}</span>
              </p>
              <p className="mt-3 font-display text-xl font-extrabold text-ink">
                {draft.pricing === 'free' ? 'Free' : formatPrice(effectivePrice(draft))}
              </p>
            </div>
          </div>
          <Button icon={Eye} className="mt-5 max-sm:w-full" onClick={onPreview}>
            Open Full Preview
          </Button>
        </StepCard>

        <StepCard title={missing.length ? 'Before you submit' : 'Ready for review'}>
          {missing.length === 0 ? (
            <p className="flex items-start gap-2.5 text-sm text-body">
              <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-emerald-500" />
              Everything required is in place. Preview the course page, then submit it for review.
            </p>
          ) : (
            <ul className="space-y-3">
              {missing.map((item) => (
                <li key={item.id} className="rounded-xl border border-line p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink">
                      {item.label}
                      {!item.required && <span className="ml-1.5 text-xs font-normal text-muted">(recommended)</span>}
                    </p>
                    <button
                      type="button"
                      onClick={() => onGo(item.step)}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                    >
                      Fix
                    </button>
                  </div>
                  <ul className="mt-1 list-disc pl-5 text-xs text-muted">
                    {item.issues.map((issue) => (
                      <li key={issue}>{issue}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </StepCard>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function CourseBuilder() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const { notify } = useStore();
  const { getCourse } = useInstructor();
  const { draft, update, flush, commit, saveState, savedAt, persisted } = useCourseDraft(courseId);
  const [showErrors, setShowErrors] = useState(false);
  const [dialog, setDialog] = useState<'missing' | 'confirm' | 'success' | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<'Pending Review' | 'Published'>('Pending Review');
  const mainRef = useRef<HTMLElement>(null);

  const step = (STEPS.find((s) => s.id === params.get('step'))?.id ?? 'basics') as BuilderStep;
  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const items = checklist(draft);
  const ready = canSubmit(items);
  const inReview = draft.status === 'Pending Review';
  const isNew = !courseId;

  usePageMeta(
    `${isNew ? 'Create Course' : `Edit ${draft.title || 'Course'}`} — Hitswork Instructor`,
    'Build your course: details, curriculum, pricing and settings.',
  );

  // Once a new course has been saved, move to its edit URL (same component, so nothing remounts).
  useEffect(() => {
    if (isNew && persisted) {
      navigate(`/instructor/course/${draft.id}/edit${location.search}`, {
        replace: true,
        state: { builderKey: 'new' },
      });
    }
  }, [isNew, persisted, draft.id, location.search, navigate]);

  // Editing a course that doesn't exist (deleted or wrong link).
  if (courseId && !getCourse(courseId) && !persisted) {
    return (
      <div className="grid min-h-dvh place-items-center bg-canvas px-4">
        <div className="max-w-md rounded-3xl border border-line bg-white p-8 text-center shadow-card">
          <h1 className="text-2xl font-extrabold">Course not found</h1>
          <p className="mt-2 text-body">This course doesn’t exist or was deleted.</p>
          <Button href="/instructor/courses" className="mt-6">
            Back to My Courses
          </Button>
        </div>
      </div>
    );
  }

  const goTo = (next: BuilderStep) => {
    setDrawerOpen(false);
    setParams(
      (current) => {
        const p = new URLSearchParams(current);
        if (next === 'basics') p.delete('step');
        else p.set('step', next);
        return p;
      },
      { replace: true, state: location.state },
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveDraft = () => {
    commit({});
    notify('Draft saved');
  };

  const openPreview = () => {
    const saved = commit({});
    navigate(`/instructor/course/${saved.id}/preview`, { state: { from: `${location.pathname}${location.search}` } });
  };

  const startSubmit = () => {
    setShowErrors(true);
    setDrawerOpen(false);
    setDialog(ready ? 'confirm' : 'missing');
  };

  const confirmSubmit = () => {
    // Platform setting: without required approval, courses go live straight away.
    const status = requiresCourseApproval() ? 'Pending Review' : 'Published';
    setSubmittedStatus(status);
    commit({ status, submittedAt: new Date().toISOString(), reviewNote: undefined });
    setDialog('success');
  };

  const actionButtons = (layout: 'header' | 'panel') => (
    <div className={cn('flex gap-2', layout === 'panel' && 'flex-col')}>
      <Button
        variant="secondary"
        size={layout === 'header' ? 'sm' : 'md'}
        icon={Save}
        onClick={saveDraft}
        fullWidth={layout === 'panel'}
      >
        Save Draft
      </Button>
      <Button
        variant="secondary"
        size={layout === 'header' ? 'sm' : 'md'}
        icon={Eye}
        onClick={openPreview}
        fullWidth={layout === 'panel'}
      >
        Preview
      </Button>
      <Button
        size={layout === 'header' ? 'sm' : 'md'}
        icon={Send}
        onClick={startSubmit}
        disabled={inReview}
        fullWidth={layout === 'panel'}
      >
        {inReview ? 'In Review' : 'Submit for Review'}
      </Button>
    </div>
  );

  return (
    <div className="min-h-dvh bg-canvas pb-24 lg:pb-0">
      <a
        href="#builder-main"
        className="sr-only rounded-lg bg-ink text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:px-4 focus:py-2.5"
      >
        Skip to content
      </a>

      {/* Sticky header + steps */}
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <AppLink
            href="/instructor"
            onClick={() => flush()}
            className="inline-flex min-w-0 items-center gap-1.5 justify-self-start rounded-md text-sm font-semibold text-body hover:text-ink"
          >
            <ArrowLeft aria-hidden className="size-4 shrink-0" />
            <span className="hidden truncate md:inline">Back to Instructor Dashboard</span>
            <span className="md:hidden">Back</span>
          </AppLink>
          <div className="min-w-0 text-center">
            <p className="truncate font-display text-[15px] font-bold text-ink sm:text-base">
              {isNew || !draft.title ? 'Create Course' : 'Edit Course'}
            </p>
            <SaveStatus state={saveState} savedAt={savedAt} persisted={persisted} />
          </div>
          <div className="hidden justify-self-end lg:block">{actionButtons('header')}</div>
        </div>
        <nav aria-label="Course builder steps" className="border-t border-line">
          <ol className="no-scrollbar mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
            {STEPS.map((s, index) => {
              const active = s.id === step;
              const done =
                s.id !== 'preview' && items.filter((i) => i.step === s.id && i.required).every((i) => i.done);
              return (
                <li key={s.id} className="shrink-0">
                  <button
                    type="button"
                    aria-current={active ? 'step' : undefined}
                    onClick={() => goTo(s.id)}
                    className={cn(
                      'inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-semibold whitespace-nowrap transition-colors',
                      active
                        ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'
                        : 'text-body hover:bg-canvas hover:text-ink',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-5 place-items-center rounded-full text-[11px] font-bold',
                        active
                          ? 'bg-brand-gradient text-white'
                          : done
                            ? 'bg-emerald-500 text-white'
                            : 'bg-canvas text-muted ring-1 ring-line',
                      )}
                    >
                      {done && !active ? <Check aria-hidden className="size-3" strokeWidth={3.5} /> : index + 1}
                    </span>
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </header>

      <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)] gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:grid-cols-[minmax(0,1fr)_18.5rem]">
        <main id="builder-main" ref={mainRef} tabIndex={-1} className="min-w-0 outline-none">
          {draft.reviewNote && (draft.status === 'Changes Requested' || draft.status === 'Rejected') && (
            <div
              role="status"
              className={cn(
                'mb-6 flex items-start gap-3 rounded-2xl px-4 py-3.5 text-sm ring-1',
                draft.status === 'Rejected'
                  ? 'bg-rose-50 text-rose-900 ring-rose-100'
                  : 'bg-orange-50 text-orange-900 ring-orange-100',
              )}
            >
              <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
              <p>
                <span className="font-semibold">
                  {draft.status === 'Rejected' ? 'Not approved: ' : 'Changes requested by the Hitswork team: '}
                </span>
                {draft.reviewNote} {draft.status === 'Changes Requested' && 'Update the course, then submit it again.'}
              </p>
            </div>
          )}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: easeOutSoft }}
            >
              {step === 'basics' && <BasicsStep draft={draft} update={update} showErrors={showErrors} />}
              {step === 'curriculum' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-[1.75rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2rem]">
                      Course Curriculum
                    </h1>
                    <p className="mt-1.5 text-[15px] text-body sm:text-base">
                      Organize your course into sections and lessons.
                    </p>
                  </div>
                  {showErrors && items.find((i) => i.id === 'curriculum' && !i.done) && (
                    <p
                      role="alert"
                      className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-100"
                    >
                      <AlertCircle aria-hidden className="size-4 shrink-0" />
                      {items.find((i) => i.id === 'curriculum')!.issues.join(' · ')}
                    </p>
                  )}
                  <CurriculumBuilder
                    sections={draft.sections}
                    onChange={(sections) => update({ sections })}
                    invalid={showErrors && draft.sections.length === 0}
                  />
                </div>
              )}
              {step === 'pricing' && <PricingStep draft={draft} update={update} showErrors={showErrors} />}
              {step === 'settings' && <SettingsStep draft={draft} update={update} />}
              {step === 'preview' && <PreviewStep draft={draft} items={items} onPreview={openPreview} onGo={goTo} />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-6">
            {stepIndex > 0 ? (
              <Button variant="secondary" icon={ArrowLeft} onClick={() => goTo(STEPS[stepIndex - 1].id)}>
                <span className="sm:hidden">Back</span>
                <span className="max-sm:hidden">{STEPS[stepIndex - 1].label}</span>
              </Button>
            ) : (
              <span />
            )}
            {stepIndex < STEPS.length - 1 ? (
              <Button onClick={() => goTo(STEPS[stepIndex + 1].id)}>
                <span className="sm:hidden">Next</span>
                <span className="max-sm:hidden">{STEPS[stepIndex + 1].label}</span>
                <ArrowRight aria-hidden className="size-[18px]" />
              </Button>
            ) : (
              <Button icon={Send} onClick={startSubmit} disabled={inReview}>
                {inReview ? 'In Review' : 'Submit for Review'}
              </Button>
            )}
          </div>
        </main>

        {/* Desktop sidebar */}
        <aside aria-label="Course progress" className="hidden xl:block">
          <div className="sticky top-36 rounded-2xl border border-line bg-white p-5 shadow-card">
            <ProgressPanel items={items} draft={draft} onGo={goTo} actions={actionButtons('panel')} />
          </div>
        </aside>
      </div>

      {/* Mobile / tablet action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Course progress ${completionPercent(items)}%`}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-ink ring-1 ring-line-strong"
          >
            <ListChecks aria-hidden className="size-[18px] text-brand-600" />
            {completionPercent(items)}%
          </button>
          <Button variant="secondary" icon={Save} onClick={saveDraft} className="flex-1 px-3">
            Save
          </Button>
          <Button icon={Send} onClick={startSubmit} disabled={inReview} className="flex-1 px-3">
            {inReview ? 'In Review' : 'Submit'}
          </Button>
        </div>
      </div>
      <Modal open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Course Setup">
        <ProgressPanel
          items={items}
          draft={draft}
          onGo={goTo}
          actions={
            <Button variant="secondary" icon={Eye} fullWidth onClick={openPreview}>
              Preview
            </Button>
          }
        />
      </Modal>

      {/* Submission dialogs */}
      <Modal
        open={dialog === 'missing'}
        onClose={() => setDialog(null)}
        title="A few things are missing"
        description="Complete the required items before submitting your course for review."
        footer={<Button onClick={() => setDialog(null)}>Keep Editing</Button>}
      >
        <ul className="space-y-3">
          {items
            .filter((i) => !i.done && i.required)
            .map((item) => (
              <li key={item.id} className="rounded-xl border border-rose-100 bg-rose-50/50 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">{item.label}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setDialog(null);
                      goTo(item.step);
                    }}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Go to {STEPS.find((s) => s.id === item.step)?.label}
                  </button>
                </div>
                <ul className="mt-1 list-disc pl-5 text-xs text-rose-800">
                  {item.issues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              </li>
            ))}
        </ul>
      </Modal>

      <Modal
        open={dialog === 'confirm'}
        onClose={() => setDialog(null)}
        size="sm"
        title="Submit this course for review?"
        description="You can keep editing while it’s reviewed. Changes made after approval need another review."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button icon={Send} onClick={confirmSubmit}>
              Submit Course
            </Button>
          </>
        }
      >
        <p className="text-sm text-body">
          <span className="font-semibold text-ink">{draft.title}</span> · {draft.sections.length} sections ·{' '}
          {countLessons(draft.sections)} lessons ·{' '}
          {draft.pricing === 'free' ? 'Free' : formatPrice(effectivePrice(draft))}
        </p>
      </Modal>

      <Modal
        open={dialog === 'success'}
        onClose={() => navigate(`/instructor/courses?status=${submittedStatus}`)}
        size="sm"
        title={submittedStatus === 'Published' ? 'Course Published 🎉' : 'Course Submitted for Review 🎉'}
        footer={
          <Button arrow onClick={() => navigate(`/instructor/courses?status=${submittedStatus}`)}>
            Go to My Courses
          </Button>
        }
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-brand-gradient text-white shadow-brand"
        >
          <Check aria-hidden className="size-8" strokeWidth={3} />
        </motion.div>
        <p className="text-center text-[15px] text-body">
          {submittedStatus === 'Published'
            ? 'Your course is now live and visible to learners.'
            : 'Our team will review your course before it becomes available to learners.'}
        </p>
        <div className="mt-4 flex justify-center">
          <CourseStatusBadge status={submittedStatus} />
        </div>
      </Modal>
    </div>
  );
}

/**
 * Create and edit share one builder. The key keeps a brand-new course mounted when its URL switches
 * from /create to /:id/edit after the first save, and remounts when moving to a different course.
 */
export function CourseBuilderPage() {
  const { courseId } = useParams();
  const location = useLocation();
  const key = (location.state as { builderKey?: string } | null)?.builderKey ?? courseId ?? 'new';
  return <CourseBuilder key={key} />;
}
