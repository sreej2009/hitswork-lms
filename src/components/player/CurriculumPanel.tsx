import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronDown, Lock, PlayCircle, Search } from 'lucide-react';
import type { Lesson } from '../../types';
import type { CourseLearning } from '../../context/LearningContext';
import { cn } from '../../lib/cn';
import { formatClock, formatDuration } from '../../lib/format';
import { ProgressBar } from '../dashboard/ProgressBar';

interface CurriculumPanelProps {
  learning: CourseLearning;
  currentLessonId: string;
  isUnlocked: (lesson: Lesson) => boolean;
  onSelect: (lesson: Lesson) => void;
}

/** Course content: progress, lesson search and an accordion of sections. Used in the sidebar and the drawer. */
export function CurriculumPanel({ learning, currentLessonId, isUnlocked, onSelect }: CurriculumPanelProps) {
  const { plan, course } = learning;
  const done = useMemo(() => new Set(learning.record.completedLessonIds), [learning.record.completedLessonIds]);
  const currentSection = plan.lessons.find((l) => l.id === currentLessonId)?.sectionIndex ?? 0;
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set([currentSection]));
  const [query, setQuery] = useState('');

  // Keep the current lesson's section open as the learner moves through the course.
  useEffect(() => {
    setOpen((current) => (current.has(currentSection) ? current : new Set(current).add(currentSection)));
  }, [currentSection]);

  const q = query.trim().toLowerCase();
  const sections = plan.sections
    .map((section, index) => ({
      section,
      index,
      lessons: q ? section.lessons.filter((l) => l.title.toLowerCase().includes(q)) : section.lessons,
    }))
    .filter((entry) => entry.lessons.length > 0);
  const completed = learning.status === 'completed';

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-line p-5">
        <h2 className="font-sans text-base font-bold text-ink">Course Content</h2>
        <p className="mt-1 text-xs text-muted">
          {plan.sections.length} Sections · {plan.lessons.length} Lectures · {course.hours}h Total
        </p>

        <div className="mt-4 rounded-2xl bg-canvas p-4 ring-1 ring-line">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold text-muted">Course Progress</p>
            <p className={cn('font-display text-lg font-extrabold', completed ? 'text-emerald-600' : 'text-ink')}>
              {learning.percent}%
            </p>
          </div>
          <ProgressBar
            value={learning.percent}
            label="Course progress"
            tone={completed ? 'success' : 'brand'}
            className="mt-2"
          />
          <p className="mt-2 text-xs text-muted">
            {learning.completedCount} / {learning.totalLessons} lessons completed
          </p>
        </div>

        <div className="group relative mt-4">
          <label htmlFor={`lesson-search-${course.id}`} className="sr-only">
            Search course content
          </label>
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle group-focus-within:text-brand-600"
            strokeWidth={2.2}
          />
          <input
            id={`lesson-search-${course.id}`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search course content..."
            className="h-10 w-full rounded-xl border border-line-strong bg-white pr-3 pl-10 text-sm text-ink outline-none transition-[border-color,box-shadow] placeholder:text-subtle hover:border-brand-200 focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {sections.length === 0 && <p className="p-6 text-center text-sm text-muted">No lessons match “{query}”.</p>}
        {sections.map(({ section, index, lessons }) => {
          // Searching shows every matching section expanded.
          const isOpen = q !== '' || open.has(index);
          const doneInSection = section.lessons.filter((l) => done.has(l.id)).length;
          const minutes = Math.round(section.lessons.reduce((sum, l) => sum + l.seconds, 0) / 60);
          const panelId = `section-${course.id}-${index}`;
          return (
            <div key={section.title} className="border-b border-line">
              <h3 className="font-sans">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                  className={cn('flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-canvas', isOpen && 'bg-canvas/70')}
                >
                  <span className="mt-0.5 font-display text-xs font-bold text-brand-600 tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm leading-snug font-semibold text-ink">{section.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {doneInSection} / {section.lessons.length} · {formatDuration(minutes)}
                    </span>
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={cn('mt-0.5 size-4 shrink-0 text-muted transition-transform duration-200', isOpen && 'rotate-180')}
                    strokeWidth={2.2}
                  />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ol
                    id={panelId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden px-2 pb-2"
                  >
                    {lessons.map((lesson) => {
                      const current = lesson.id === currentLessonId;
                      const complete = done.has(lesson.id);
                      const unlocked = isUnlocked(lesson);
                      return (
                        <li key={lesson.id}>
                          <button
                            type="button"
                            onClick={() => unlocked && onSelect(lesson)}
                            disabled={!unlocked}
                            aria-current={current ? 'step' : undefined}
                            title={unlocked ? undefined : 'Complete the previous lessons to unlock'}
                            className={cn(
                              'flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors',
                              current
                                ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-100'
                                : unlocked
                                  ? 'text-body hover:bg-canvas hover:text-ink'
                                  : 'cursor-not-allowed text-subtle',
                            )}
                          >
                            {complete ? (
                              <CheckCircle2 aria-hidden className="mt-0.5 size-[18px] shrink-0 text-emerald-600" strokeWidth={2.2} />
                            ) : !unlocked ? (
                              <Lock aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
                            ) : (
                              <PlayCircle
                                aria-hidden
                                className={cn('mt-0.5 size-[18px] shrink-0', current ? 'text-brand-600' : 'text-muted')}
                                strokeWidth={2}
                              />
                            )}
                            <span className={cn('min-w-0 flex-1 leading-snug', current && 'font-semibold')}>
                              {lesson.title}
                              <span className="sr-only">
                                {complete ? ' (completed)' : !unlocked ? ' (locked)' : current ? ' (current lesson)' : ''}
                              </span>
                            </span>
                            <span className="shrink-0 text-xs tabular-nums">{formatClock(lesson.seconds)}</span>
                          </button>
                        </li>
                      );
                    })}
                  </motion.ol>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
