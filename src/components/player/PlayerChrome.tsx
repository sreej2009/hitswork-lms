import { useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, CalendarCheck, CheckCircle2, Clock3, CircleHelp, FolderOpen, NotebookPen, PanelRightClose, PanelRightOpen, Star, Users, X } from 'lucide-react';
import type { CourseLearning } from '../../context/LearningContext';
import { getInstructor, instructorSlug } from '../../data/instructors';
import { useModalDialog } from '../../hooks/useModalDialog';
import { cn } from '../../lib/cn';
import { formatCompact, formatDate } from '../../lib/format';
import { UserMenu } from '../layout/UserMenu';
import { ProgressBar } from '../dashboard/ProgressBar';
import { AppLink } from '../ui/AppLink';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Logo } from '../ui/Logo';
import { easeOutSoft } from '../ui/Reveal';
import { TextLink } from '../ui/TextLink';

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

const headerButton =
  'inline-flex h-9 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white';

interface PlayerHeaderProps {
  learning: CourseLearning;
  onNotes: () => void;
  onResources: () => void;
  onHelp: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function PlayerHeader({ learning, onNotes, onResources, onHelp, sidebarOpen, onToggleSidebar }: PlayerHeaderProps) {
  const completed = learning.status === 'completed';
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B1220] text-white">
      <div className="flex h-16 items-center gap-3 px-3 sm:px-5">
        <span className="max-md:hidden">
          <Logo tone="light" />
        </span>
        <span className="md:hidden">
          <Logo tone="light" markOnly />
        </span>
        <span aria-hidden className="h-6 w-px bg-white/15 max-sm:hidden" />
        <p className="min-w-0 flex-1 truncate text-sm font-semibold sm:text-[15px]">{learning.course.title}</p>

        <div className="hidden w-44 shrink-0 lg:block xl:w-52">
          <p className={cn('text-xs font-semibold', completed ? 'text-emerald-300' : 'text-white/85')}>
            {learning.percent}% Complete
          </p>
          <ProgressBar value={learning.percent} label="Course progress" tone={completed ? 'success' : 'brand'} size="sm" onDark className="mt-1.5" />
        </div>

        <nav aria-label="Learning tools" className="flex shrink-0 items-center gap-0.5 lg:ml-2">
          <button type="button" onClick={onNotes} className={cn(headerButton, 'max-sm:hidden')}>
            <NotebookPen aria-hidden className="size-4" />
            <span className="max-xl:sr-only">Notes</span>
          </button>
          <button type="button" onClick={onResources} className={cn(headerButton, 'max-sm:hidden')}>
            <FolderOpen aria-hidden className="size-4" />
            <span className="max-xl:sr-only">Resources</span>
          </button>
          <button type="button" onClick={onHelp} className={headerButton} aria-haspopup="dialog">
            <CircleHelp aria-hidden className="size-4" />
            <span className="max-xl:sr-only">Help</span>
          </button>
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? 'Hide course content' : 'Show course content'}
            aria-pressed={sidebarOpen}
            className={cn(headerButton, 'max-lg:hidden')}
          >
            {sidebarOpen ? <PanelRightClose aria-hidden className="size-4" /> : <PanelRightOpen aria-hidden className="size-4" />}
          </button>
        </nav>
        <span className="ml-1 shrink-0 rounded-full bg-white/95">
          <UserMenu compact />
        </span>
      </div>
      {/* Thin progress line for small screens */}
      <div className="h-0.5 bg-white/10 lg:hidden" aria-hidden>
        <div className={cn('h-full transition-[width] duration-500', completed ? 'bg-emerald-400' : 'bg-brand-400')} style={{ width: `${learning.percent}%` }} />
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Completion
// ---------------------------------------------------------------------------

export function CompletionPanel({ learning, onRewatch }: { learning: CourseLearning; onRewatch: () => void }) {
  const completedAt = learning.record.completedAt ?? new Date().toISOString();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: easeOutSoft }}
      className="relative isolate flex min-h-[420px] flex-col items-center justify-center overflow-hidden px-6 py-12 text-center text-white sm:aspect-video sm:min-h-0 sm:rounded-2xl"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_50%_0%,rgb(124_58_237/0.45),transparent_70%),radial-gradient(50%_60%_at_50%_100%,rgb(16_185_129/0.25),transparent_70%)] bg-[#111827]" />
      <motion.span
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
        className="grid size-20 place-items-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-[0_18px_40px_-12px_rgb(16_185_129/0.7)] ring-8 ring-white/10"
      >
        <CheckCircle2 aria-hidden className="size-10" strokeWidth={2.2} />
      </motion.span>
      <h2 className="mt-6 text-3xl font-extrabold tracking-[-0.02em] text-white sm:text-4xl">Congratulations! 🎉</h2>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/75 sm:text-base">
        You’ve completed <span className="font-semibold text-white">{learning.course.title}</span>.
      </p>
      <dl className="mt-7 grid w-full max-w-xl grid-cols-1 gap-3 text-left min-[480px]:grid-cols-3">
        {[
          { icon: CheckCircle2, label: 'Status', value: 'Course completed' },
          { icon: CalendarCheck, label: 'Completed on', value: formatDate(completedAt.slice(0, 10)) },
          { icon: Clock3, label: 'Learning time', value: `${learning.course.hours} hours` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
            <dt className="flex items-center gap-1.5 text-xs text-white/60">
              <Icon aria-hidden className="size-3.5" /> {label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
        <Button href="/certificates" arrow icon={Award}>
          View Certificate
        </Button>
        <Button href="/my-learning" variant="white">
          Continue Learning
        </Button>
      </div>
      <button type="button" onClick={onRewatch} className="mt-5 text-sm font-medium text-white/60 underline-offset-4 hover:text-white hover:underline">
        Rewatch lessons
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Instructor
// ---------------------------------------------------------------------------

export function InstructorMini({ name }: { name: string }) {
  const instructor = getInstructor(name);
  return (
    <section aria-labelledby="player-instructor" className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <h2 id="player-instructor" className="font-sans text-xs font-semibold tracking-[0.12em] text-muted uppercase">
        Instructor
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Avatar name={name} size="md" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold text-ink">{instructor.name}</p>
          <p className="text-sm text-muted">{instructor.title}</p>
          <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-body">
            <span className="inline-flex items-center gap-1">
              <Star aria-hidden className="size-3.5 text-amber-400" fill="currentColor" strokeWidth={0} />
              {instructor.rating.toFixed(1)} Instructor Rating
            </span>
            <span className="inline-flex items-center gap-1">
              <Users aria-hidden className="size-3.5 text-muted" />
              {formatCompact(instructor.students)} Students
            </span>
          </p>
        </div>
        <TextLink href={`/instructors/${instructorSlug(name)}`}>View Instructor</TextLink>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Dialogs
// ---------------------------------------------------------------------------

function Modal({
  open,
  onClose,
  label,
  side,
  children,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  side: 'right' | 'center';
  children: ReactNode;
  returnFocusRef?: RefObject<HTMLElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useModalDialog({ open, onClose, panelRef, initialFocusRef: closeRef, returnFocusRef });
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            aria-hidden
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-[2px]"
          />
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            initial={side === 'right' ? { x: '100%' } : { opacity: 0, scale: 0.97 }}
            animate={side === 'right' ? { x: 0 } : { opacity: 1, scale: 1 }}
            exit={side === 'right' ? { x: '100%' } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: easeOutSoft }}
            className={cn(
              'fixed z-[71] bg-white shadow-2xl',
              side === 'right'
                ? 'inset-y-0 right-0 flex w-[min(92vw,420px)] flex-col'
                : 'top-1/2 left-1/2 w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl',
            )}
          >
            <span className="absolute top-3 right-3 z-10">
              <IconButton ref={closeRef} icon={X} label={`Close ${label.toLowerCase()}`} onClick={onClose} />
            </span>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function CurriculumDrawer({ open, onClose, returnFocusRef, children }: {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  return (
    <Modal open={open} onClose={onClose} label="Course content" side="right" returnFocusRef={returnFocusRef}>
      <div className="min-h-0 flex-1 pt-2">{children}</div>
    </Modal>
  );
}

const shortcuts: [string, string][] = [
  ['Space', 'Play / pause'],
  ['← / →', 'Seek back / forward 10 seconds'],
  ['Shift + ← / →', 'Previous / next lesson'],
  ['M', 'Mute / unmute'],
  ['F', 'Fullscreen'],
  ['Esc', 'Exit fullscreen or close panels'],
];

export function ShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} label="Keyboard shortcuts" side="center">
      <div className="p-6">
        <h2 className="font-sans text-lg font-bold text-ink">Help & shortcuts</h2>
        <p className="mt-1 text-sm text-body">Shortcuts work whenever you’re not typing in a field.</p>
        <dl className="mt-5 divide-y divide-line">
          {shortcuts.map(([keys, action]) => (
            <div key={keys} className="flex items-center justify-between gap-4 py-2.5 text-sm">
              <dt>
                <kbd className="rounded-md border border-line-strong bg-canvas px-2 py-1 font-sans text-xs font-semibold text-ink">{keys}</kbd>
              </dt>
              <dd className="text-right text-body">{action}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-xs text-muted">
          Need more help? Ask in the course Q&amp;A or visit the <AppLink href="/support" className="font-semibold text-brand-600 hover:text-brand-700">Help Centre</AppLink>.
        </p>
      </div>
    </Modal>
  );
}
