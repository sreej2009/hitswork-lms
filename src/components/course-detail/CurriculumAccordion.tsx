import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, PlayCircle } from 'lucide-react';
import type { CurriculumSection } from '../../types';
import { cn } from '../../lib/cn';
import { formatDuration } from '../../lib/format';

interface CurriculumAccordionProps {
  sections: CurriculumSection[];
  totals: { sections: number; lectures: number };
  totalHours: number;
}

export function CurriculumAccordion({ sections, totals, totalHours }: CurriculumAccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set([0]));
  const allOpen = open.size === sections.length;

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-body">
          <span className="font-semibold text-ink">{totals.sections} sections</span>
          <span aria-hidden className="mx-2 text-subtle">•</span>
          <span className="font-semibold text-ink">{totals.lectures} lectures</span>
          <span aria-hidden className="mx-2 text-subtle">•</span>
          <span className="font-semibold text-ink">{totalHours}h</span> total length
        </p>
        <button
          type="button"
          onClick={() => setOpen(allOpen ? new Set() : new Set(sections.map((_, i) => i)))}
          className="rounded-md text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
        >
          {allOpen ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
        {sections.map((section, index) => {
          const isOpen = open.has(index);
          const panelId = `${baseId}-panel-${index}`;
          const remaining = section.lectureCount - section.lectures.length;
          return (
            <div key={section.title} className="border-b border-line last:border-b-0">
              <h3 className="font-sans">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                  className={cn(
                    'flex w-full items-center gap-4 px-4 py-4 text-left transition-colors sm:px-5',
                    isOpen ? 'bg-brand-50/50' : 'hover:bg-canvas',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-9 shrink-0 place-items-center rounded-xl font-display text-sm font-bold tabular-nums transition-colors',
                      isOpen ? 'bg-brand-gradient text-white' : 'bg-brand-50 text-brand-700',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] leading-snug font-semibold text-ink">{section.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {section.lectureCount} lectures · {formatDuration(section.minutes)}
                    </span>
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={cn('size-5 shrink-0 text-muted transition-transform duration-300', isOpen && 'rotate-180')}
                    strokeWidth={2}
                  />
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <ul className="border-t border-line px-4 py-2 sm:px-5">
                      {section.lectures.map((lecture) => (
                        <li key={lecture.title} className="flex items-center gap-3 py-2.5 text-sm">
                          <PlayCircle aria-hidden className="size-[18px] shrink-0 text-subtle" strokeWidth={1.8} />
                          <span className="min-w-0 flex-1 text-body">{lecture.title}</span>
                          {lecture.preview && (
                            <span className="shrink-0 rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 ring-1 ring-brand-100">
                              Preview
                            </span>
                          )}
                          <span className="w-14 shrink-0 text-right text-xs text-muted tabular-nums">
                            <span className="sr-only">Duration </span>
                            {lecture.duration}
                          </span>
                        </li>
                      ))}
                      {remaining > 0 && (
                        <li className="py-2.5 pl-[30px] text-xs font-medium text-muted">
                          + {remaining} more {remaining === 1 ? 'lecture' : 'lectures'}
                        </li>
                      )}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {totals.sections > sections.length && (
        <p className="mt-3 text-sm text-muted">
          Showing {sections.length} of {totals.sections} sections — the full curriculum unlocks when you enroll.
        </p>
      )}
    </div>
  );
}
