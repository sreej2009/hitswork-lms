import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Download, ExternalLink, FileArchive, FileText, Link2, Pencil, Trash2 } from 'lucide-react';
import type { Course, Lesson, Resource } from '../../types';
import { courseAnnouncements, courseResources, lessonContent } from '../../data/lessons';
import { useNotes } from '../../hooks/useNotes';
import { lessonPlan } from '../../lib/lessonPlan';
import { cn } from '../../lib/cn';
import { formatDate, formatRelative } from '../../lib/format';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export type LessonTab = 'overview' | 'notes' | 'resources' | 'announcements';

const tabs: { id: LessonTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'notes', label: 'Notes' },
  { id: 'resources', label: 'Resources' },
  { id: 'announcements', label: 'Announcements' },
];

function Overview({ course, lesson }: { course: Course; lesson: Lesson }) {
  const content = lessonContent(course, lesson);
  return (
    <div>
      <h3 className="font-sans text-base font-bold text-ink">About this lesson</h3>
      <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-body">{content.description}</p>
      <h3 className="mt-7 font-sans text-base font-bold text-ink">What you’ll learn</h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {content.outcomes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[15px] text-body">
            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
              <Check aria-hidden className="size-3.5" strokeWidth={3} />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Notes({ course, lesson }: { course: Course; lesson: Lesson }) {
  const { notes, addNote, updateNote, deleteNote } = useNotes(course.id);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  return (
    <div>
      <h3 className="font-sans text-base font-bold text-ink">My Notes</h3>
      <form
        className="mt-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) return;
          addNote(lesson.id, lesson.title, draft);
          setDraft('');
        }}
      >
        <label htmlFor="note-draft" className="sr-only">
          Note for {lesson.title}
        </label>
        <textarea
          id="note-draft"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write your notes here..."
          rows={4}
          maxLength={2000}
          className="w-full resize-y rounded-xl border border-line-strong bg-white px-4 py-3 text-[15px] text-ink outline-none transition-[border-color,box-shadow] placeholder:text-subtle hover:border-brand-200 focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-muted">Saved to this lesson: {lesson.title}</p>
          <Button type="submit" size="sm" disabled={!draft.trim()}>
            Save Note
          </Button>
        </div>
      </form>

      {notes.length > 0 && (
        <ul className="mt-6 space-y-3">
          <AnimatePresence initial={false}>
            {notes.map((note) => (
              <motion.li
                key={note.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -12 }}
                className={cn(
                  'rounded-xl border bg-white p-4',
                  note.lessonId === lesson.id ? 'border-brand-100 ring-1 ring-brand-50' : 'border-line',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-muted">
                    <span className="font-semibold text-ink">{note.lessonTitle}</span> ·{' '}
                    {note.updatedAt !== note.createdAt ? 'Edited ' : 'Saved '}
                    <time dateTime={note.updatedAt}>{formatRelative(note.updatedAt)}</time>
                  </p>
                  {editingId !== note.id && (
                    <div className="-mt-1 -mr-1 flex shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(note.id);
                          setEditText(note.body);
                        }}
                        aria-label="Edit note"
                        className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink"
                      >
                        <Pencil aria-hidden className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteNote(note.id)}
                        aria-label="Delete note"
                        className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 aria-hidden className="size-4" />
                      </button>
                    </div>
                  )}
                </div>
                {editingId === note.id ? (
                  <div className="mt-2">
                    <label htmlFor={`edit-${note.id}`} className="sr-only">
                      Edit note
                    </label>
                    <textarea
                      id={`edit-${note.id}`}
                      value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                      rows={3}
                      autoFocus
                      className="w-full resize-y rounded-lg border border-brand-300 px-3 py-2 text-sm text-ink outline-none focus:ring-4 focus:ring-brand-100"
                    />
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        disabled={!editText.trim()}
                        onClick={() => {
                          updateNote(note.id, editText);
                          setEditingId(null);
                        }}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-body">{note.body}</p>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

const resourceIcons = { pdf: FileText, zip: FileArchive, link: Link2 };
const resourceTints = { pdf: 'bg-rose-50 text-rose-600', zip: 'bg-amber-50 text-amber-600', link: 'bg-blue-50 text-blue-600' };

/** Demo download: a small text file describing the resource and the course outline. */
function downloadDemoResource(course: Course, resource: Resource) {
  const outline = lessonPlan(course)
    .sections.map((section, i) => `${String(i + 1).padStart(2, '0')}. ${section.title}`)
    .join('\n');
  const body = `Hitswork — ${resource.title}\n${'='.repeat(40)}\n\nThis is a demo file. The real ${resource.kind.toUpperCase()} will be available when course materials are published.\n\nCourse: ${course.title}\nInstructor: ${course.instructor}\n\nSections\n${outline}\n`;
  const url = URL.createObjectURL(new Blob([body], { type: 'text/plain' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resource.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')}-demo.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Resources({ course }: { course: Course }) {
  const [downloaded, setDownloaded] = useState<ReadonlySet<string>>(() => new Set());
  return (
    <div>
      <h3 className="font-sans text-base font-bold text-ink">Downloadable resources</h3>
      <ul className="mt-4 space-y-3">
        {courseResources(course).map((resource) => {
          const Icon = resourceIcons[resource.kind];
          const external = resource.href?.startsWith('http');
          return (
            <li key={resource.id} className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-start gap-3.5">
                <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', resourceTints[resource.kind])}>
                  <Icon aria-hidden className="size-5" strokeWidth={1.9} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{resource.title}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {resource.kind === 'link' ? 'Link' : resource.kind.toUpperCase()}
                    {resource.size && ` · ${resource.size}`} · {resource.description}
                  </p>
                </div>
              </div>
              {resource.kind === 'link' && resource.href ? (
                external ? (
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl border border-line-strong bg-white px-4 text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:bg-brand-50/60 hover:text-brand-700"
                  >
                    Open Resource <ExternalLink aria-hidden className="size-4" />
                  </a>
                ) : (
                  <Button href={resource.href} size="sm" variant="secondary">
                    Open Resource
                  </Button>
                )
              ) : (
                <Button
                  size="sm"
                  variant={downloaded.has(resource.id) ? 'soft' : 'secondary'}
                  icon={downloaded.has(resource.id) ? Check : Download}
                  onClick={() => {
                    downloadDemoResource(course, resource);
                    setDownloaded((current) => new Set(current).add(resource.id));
                  }}
                >
                  {downloaded.has(resource.id) ? 'Downloaded' : 'Download'}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted">Downloads are demo files until course materials are published.</p>
    </div>
  );
}

function Announcements({ course }: { course: Course }) {
  return (
    <div>
      <h3 className="font-sans text-base font-bold text-ink">Announcements</h3>
      <ul className="mt-4 space-y-3">
        {courseAnnouncements(course).map((item) => {
          const date = new Date(Date.now() - item.daysAgo * 86_400_000).toISOString();
          return (
            <li key={item.id} className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-center gap-3">
                <Avatar name={item.instructor} size="xs" />
                <div className="min-w-0 text-xs">
                  <p className="font-semibold text-ink">{item.instructor}</p>
                  <p className="text-muted">
                    Instructor · <time dateTime={date}>{formatDate(date.slice(0, 10))}</time>
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-body">{item.message}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface LessonTabsProps {
  course: Course;
  lesson: Lesson;
  active: LessonTab;
  onChange: (tab: LessonTab) => void;
}

export function LessonTabs({ course, lesson, active, onChange }: LessonTabsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    event.stopPropagation(); // don't also seek the video
    const next = (index + delta + tabs.length) % tabs.length;
    refs.current[next]?.focus();
    onChange(tabs[next].id);
  };

  return (
    <div id="lesson-tabs">
      <div role="tablist" aria-label="Lesson details" className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
        {tabs.map((tab, index) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                'relative shrink-0 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors',
                selected ? 'text-brand-700' : 'text-muted hover:text-ink',
              )}
            >
              {tab.label}
              {selected && (
                <motion.span
                  layoutId="lesson-tab-indicator"
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-gradient"
                  transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div id={`panel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`} className="pt-6">
        {active === 'overview' && <Overview course={course} lesson={lesson} />}
        {active === 'notes' && <Notes course={course} lesson={lesson} />}
        {active === 'resources' && <Resources course={course} />}
        {active === 'announcements' && <Announcements course={course} />}
      </div>
    </div>
  );
}
