import { useState, type DragEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Check, ChevronDown, Eye, GripVertical, Layers, Pencil, Plus, Trash2 } from 'lucide-react';
import type { CourseLesson, CourseSection, LessonType } from '../../types/instructor';
import { lessonTypeMeta } from '../../data/courseBuilder';
import { lessonMeta, lessonSeconds, newId, newLesson } from '../../lib/courseBuilder';
import { formatDuration } from '../../lib/format';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { TextArea, TextInput } from '../ui/Form';
import { easeOutSoft } from '../ui/Reveal';
import { LessonEditor, LessonTypePicker } from './LessonEditor';

type DragItem = { kind: 'section'; id: string } | { kind: 'lesson'; id: string };
type DropTarget = { sectionId: string; index: number } | { sectionIndex: number } | null;

const pad = (n: number) => String(n).padStart(2, '0');

interface CurriculumBuilderProps {
  sections: CourseSection[];
  onChange: (sections: CourseSection[]) => void;
  invalid?: boolean;
}

export function CurriculumBuilder({ sections, onChange, invalid }: CurriculumBuilderProps) {
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [picker, setPicker] = useState<{ sectionId: string } | null>(null);
  const [editor, setEditor] = useState<{ lesson: CourseLesson; sectionId: string; isNew: boolean } | null>(null);
  const [drag, setDrag] = useState<DragItem | null>(null);
  const [target, setTarget] = useState<DropTarget>(null);

  /* ---------- sections ---------- */

  const addSection = () => {
    const section: CourseSection = { id: newId('sec'), title: '', description: '', lessons: [] };
    onChange([...sections, section]);
    setEditingSection(section.id);
    return section;
  };

  const updateSection = (id: string, patch: Partial<CourseSection>) =>
    onChange(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const moveSection = (from: number, to: number) => {
    if (to < 0 || to >= sections.length || from === to) return;
    const next = [...sections];
    const [s] = next.splice(from, 1);
    next.splice(to, 0, s);
    onChange(next);
  };

  const deleteSection = (section: CourseSection) => {
    if (
      section.lessons.length &&
      !window.confirm(`Delete “${section.title || 'this section'}” and its ${section.lessons.length} lessons?`)
    )
      return;
    onChange(sections.filter((s) => s.id !== section.id));
  };

  /* ---------- lessons ---------- */

  const startAddLesson = (sectionId?: string) => {
    const id = sectionId ?? sections[sections.length - 1]?.id ?? addSection().id;
    setPicker({ sectionId: id });
  };

  const pickType = (type: LessonType) => {
    if (!picker) return;
    setEditor({ lesson: newLesson(type), sectionId: picker.sectionId, isNew: true });
    setPicker(null);
  };

  const saveLesson = (lesson: CourseLesson, sectionId: string) => {
    // Remove from wherever it was, then put it in the chosen section (same position if unchanged).
    let position = -1;
    const without = sections.map((s) => {
      const index = s.lessons.findIndex((l) => l.id === lesson.id);
      if (index >= 0 && s.id === sectionId) position = index;
      return { ...s, lessons: s.lessons.filter((l) => l.id !== lesson.id) };
    });
    onChange(
      without.map((s) => {
        if (s.id !== sectionId) return s;
        const lessons = [...s.lessons];
        lessons.splice(position >= 0 ? position : lessons.length, 0, lesson);
        return { ...s, lessons };
      }),
    );
    setCollapsed((current) => {
      const next = new Set(current);
      next.delete(sectionId);
      return next;
    });
    setEditor(null);
  };

  const deleteLesson = (sectionId: string, lessonId: string) =>
    onChange(
      sections.map((s) => (s.id === sectionId ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) } : s)),
    );

  /** Moves a lesson to `index` in section `toId` (possibly a different section). */
  const moveLesson = (lessonId: string, toId: string, index: number) => {
    let moving: CourseLesson | undefined;
    let fromId = '';
    let fromIndex = -1;
    for (const s of sections) {
      const i = s.lessons.findIndex((l) => l.id === lessonId);
      if (i >= 0) {
        moving = s.lessons[i];
        fromId = s.id;
        fromIndex = i;
      }
    }
    if (!moving) return;
    // Removing from earlier in the same list shifts the target index down by one.
    const insertAt = fromId === toId && fromIndex < index ? index - 1 : index;
    onChange(
      sections
        .map((s) => (s.id === fromId ? { ...s, lessons: s.lessons.filter((l) => l.id !== lessonId) } : s))
        .map((s) => {
          if (s.id !== toId) return s;
          const lessons = [...s.lessons];
          lessons.splice(Math.max(0, Math.min(insertAt, lessons.length)), 0, moving!);
          return { ...s, lessons };
        }),
    );
  };

  /** Arrow-button move: steps across section boundaries. */
  const nudgeLesson = (sectionIndex: number, lessonIndex: number, direction: -1 | 1) => {
    const section = sections[sectionIndex];
    const lesson = section.lessons[lessonIndex];
    const targetIndex = lessonIndex + direction;
    if (targetIndex >= 0 && targetIndex < section.lessons.length) {
      moveLesson(lesson.id, section.id, direction === 1 ? targetIndex + 1 : targetIndex);
    } else {
      const neighbour = sections[sectionIndex + direction];
      if (neighbour) moveLesson(lesson.id, neighbour.id, direction === 1 ? 0 : neighbour.lessons.length);
    }
  };

  /* ---------- drag & drop (native HTML5) ---------- */

  const startDrag = (event: DragEvent, item: DragItem) => {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', item.id);
    setDrag(item);
  };
  const endDrag = () => {
    setDrag(null);
    setTarget(null);
  };
  const overLesson = (event: DragEvent, sectionId: string, index: number) => {
    if (drag?.kind !== 'lesson') return;
    event.preventDefault();
    event.stopPropagation();
    const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const after = event.clientY > box.top + box.height / 2;
    setTarget({ sectionId, index: after ? index + 1 : index });
  };
  const overSection = (event: DragEvent, sectionIndex: number, section: CourseSection) => {
    if (!drag) return;
    event.preventDefault();
    if (drag.kind === 'section') setTarget({ sectionIndex });
    else if (!target || !('sectionId' in target) || target.sectionId !== section.id)
      setTarget({ sectionId: section.id, index: section.lessons.length });
  };
  const drop = (event: DragEvent) => {
    event.preventDefault();
    if (drag?.kind === 'lesson' && target && 'sectionId' in target) moveLesson(drag.id, target.sectionId, target.index);
    if (drag?.kind === 'section' && target && 'sectionIndex' in target)
      moveSection(
        sections.findIndex((s) => s.id === drag.id),
        target.sectionIndex,
      );
    endDrag();
  };

  const toggle = (id: string) =>
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const totalLessons = sections.reduce((n, s) => n + s.lessons.length, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">{sections.length}</span>{' '}
          {sections.length === 1 ? 'section' : 'sections'} ·{' '}
          <span className="font-semibold text-ink">{totalLessons}</span> {totalLessons === 1 ? 'lesson' : 'lessons'}
        </p>
        <div className="grid grid-cols-2 gap-2 max-sm:w-full">
          <Button variant="secondary" icon={Plus} onClick={addSection} fullWidth className="max-sm:px-3">
            Add Section
          </Button>
          <Button icon={Plus} onClick={() => startAddLesson()} fullWidth className="max-sm:px-3">
            Add Lesson
          </Button>
        </div>
      </div>

      {sections.length === 0 ? (
        <div
          className={cn(
            'mt-5 flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-12 text-center',
            invalid ? 'border-rose-300 bg-rose-50/40' : 'border-line-strong bg-canvas/60',
          )}
        >
          <span className="grid size-14 place-items-center rounded-2xl bg-white text-brand-600 shadow-xs ring-1 ring-line">
            <Layers aria-hidden className="size-6" />
          </span>
          <p className="mt-4 font-semibold text-ink">Start with your first section</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Group lessons into sections, e.g. “Introduction” or “Fundamentals”.
          </p>
          <Button icon={Plus} className="mt-5" onClick={addSection}>
            Add Section
          </Button>
        </div>
      ) : (
        <ol className="mt-5 space-y-4" onDragEnd={endDrag}>
          {sections.map((section, sIndex) => {
            const isCollapsed = collapsed.has(section.id);
            const editing = editingSection === section.id;
            const minutes = Math.round(section.lessons.reduce((t, l) => t + lessonSeconds(l), 0) / 60);
            const sectionTarget =
              drag?.kind === 'section' && target && 'sectionIndex' in target && target.sectionIndex === sIndex;
            return (
              <li
                key={section.id}
                onDragOver={(e) => overSection(e, sIndex, section)}
                onDrop={drop}
                className={cn(
                  'rounded-2xl border bg-white shadow-card transition-[box-shadow,border-color,opacity]',
                  sectionTarget ? 'border-brand-300 ring-4 ring-brand-50' : 'border-line',
                  drag?.kind === 'section' && drag.id === section.id && 'opacity-50',
                )}
              >
                {/* Section header */}
                <div
                  draggable={!editing}
                  onDragStart={(e) => startDrag(e, { kind: 'section', id: section.id })}
                  className="flex items-start gap-2 p-4 sm:gap-3 sm:p-5"
                >
                  <span aria-hidden title="Drag to reorder" className="mt-1.5 hidden cursor-grab text-subtle sm:block">
                    <GripVertical className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xs font-bold tracking-[0.12em] text-brand-600 uppercase">
                      Section {pad(sIndex + 1)}
                    </p>
                    {editing ? (
                      <div className="mt-2 space-y-2.5">
                        <label htmlFor={`${section.id}-title`} className="sr-only">
                          Section title
                        </label>
                        <TextInput
                          id={`${section.id}-title`}
                          autoFocus
                          value={section.title}
                          maxLength={80}
                          placeholder="e.g. Introduction to React"
                          onChange={(e) => updateSection(section.id, { title: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setEditingSection(null);
                          }}
                        />
                        <label htmlFor={`${section.id}-description`} className="sr-only">
                          Section description
                        </label>
                        <TextArea
                          id={`${section.id}-description`}
                          rows={2}
                          maxLength={240}
                          value={section.description}
                          placeholder="What does this section cover? (optional)"
                          onChange={(e) => updateSection(section.id, { description: e.target.value })}
                        />
                        <Button size="sm" icon={Check} onClick={() => setEditingSection(null)}>
                          Done
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="mt-1 text-[17px] leading-snug font-bold text-ink">
                          {section.title || <span className="text-subtle">Untitled section</span>}
                        </h3>
                        {section.description && <p className="mt-1 text-sm text-body">{section.description}</p>}
                        <p className="mt-1.5 text-xs text-muted">
                          {section.lessons.length} {section.lessons.length === 1 ? 'lesson' : 'lessons'}
                          {minutes > 0 && ` · ${formatDuration(minutes)}`}
                        </p>
                      </>
                    )}
                  </div>
                  {!editing && (
                    <div className="flex shrink-0 flex-wrap justify-end">
                      <button
                        type="button"
                        aria-label={`Edit section ${sIndex + 1}`}
                        onClick={() => setEditingSection(section.id)}
                        className="grid size-9 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-brand-700"
                      >
                        <Pencil aria-hidden className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Move section ${sIndex + 1} up`}
                        disabled={sIndex === 0}
                        onClick={() => moveSection(sIndex, sIndex - 1)}
                        className="grid size-9 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink disabled:opacity-30"
                      >
                        <ArrowUp aria-hidden className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Move section ${sIndex + 1} down`}
                        disabled={sIndex === sections.length - 1}
                        onClick={() => moveSection(sIndex, sIndex + 1)}
                        className="grid size-9 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink disabled:opacity-30"
                      >
                        <ArrowDown aria-hidden className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete section ${sIndex + 1}`}
                        onClick={() => deleteSection(section)}
                        className="grid size-9 place-items-center rounded-lg text-muted hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 aria-hidden className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-expanded={!isCollapsed}
                        aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} section ${sIndex + 1}`}
                        onClick={() => toggle(section.id)}
                        className="grid size-9 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
                      >
                        <ChevronDown
                          aria-hidden
                          className={cn('size-4 transition-transform', isCollapsed && '-rotate-90')}
                        />
                      </button>
                    </div>
                  )}
                </div>

                {/* Lessons */}
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: easeOutSoft }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-line px-3 pt-3 pb-4 sm:px-5">
                        <ol className="space-y-2">
                          {section.lessons.map((lesson, lIndex) => {
                            const meta = lessonTypeMeta(lesson.type);
                            const Icon = meta.icon;
                            const showBefore =
                              drag?.kind === 'lesson' &&
                              target &&
                              'sectionId' in target &&
                              target.sectionId === section.id &&
                              target.index === lIndex;
                            return (
                              <li
                                key={lesson.id}
                                draggable
                                onDragStart={(e) => startDrag(e, { kind: 'lesson', id: lesson.id })}
                                onDragOver={(e) => overLesson(e, section.id, lIndex)}
                                onDrop={drop}
                                className={cn(
                                  'relative flex items-center gap-2 rounded-xl border border-line bg-white px-2.5 py-2.5 transition-opacity sm:gap-3 sm:px-3',
                                  drag?.kind === 'lesson' && drag.id === lesson.id && 'opacity-40',
                                )}
                              >
                                {showBefore && (
                                  <span
                                    aria-hidden
                                    className="absolute -top-1.5 right-2 left-2 h-0.5 rounded-full bg-brand-500"
                                  />
                                )}
                                <span
                                  aria-hidden
                                  title="Drag to reorder"
                                  className="hidden cursor-grab text-subtle sm:block"
                                >
                                  <GripVertical className="size-4" />
                                </span>
                                <span className={cn('grid size-9 shrink-0 place-items-center rounded-lg', meta.tone)}>
                                  <Icon aria-hidden className="size-4" strokeWidth={2} />
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                                    Lesson {pad(lIndex + 1)}
                                  </p>
                                  <p className="truncate text-sm font-semibold text-ink">{lesson.title}</p>
                                  <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted">
                                    {lessonMeta(lesson)}
                                    {lesson.freePreview && (
                                      <span className="inline-flex items-center gap-1 font-semibold text-brand-600">
                                        <Eye aria-hidden className="size-3" />
                                        Free preview
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <div className="flex shrink-0">
                                  <button
                                    type="button"
                                    aria-label={`Edit ${lesson.title}`}
                                    onClick={() => setEditor({ lesson, sectionId: section.id, isNew: false })}
                                    className="grid size-8 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-brand-700"
                                  >
                                    <Pencil aria-hidden className="size-4" />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label={`Move ${lesson.title} up`}
                                    disabled={sIndex === 0 && lIndex === 0}
                                    onClick={() => nudgeLesson(sIndex, lIndex, -1)}
                                    className="grid size-8 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink disabled:opacity-30"
                                  >
                                    <ArrowUp aria-hidden className="size-4" />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label={`Move ${lesson.title} down`}
                                    disabled={sIndex === sections.length - 1 && lIndex === section.lessons.length - 1}
                                    onClick={() => nudgeLesson(sIndex, lIndex, 1)}
                                    className="grid size-8 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink disabled:opacity-30"
                                  >
                                    <ArrowDown aria-hidden className="size-4" />
                                  </button>
                                  <button
                                    type="button"
                                    aria-label={`Delete ${lesson.title}`}
                                    onClick={() => deleteLesson(section.id, lesson.id)}
                                    className="grid size-8 place-items-center rounded-lg text-muted hover:bg-rose-50 hover:text-rose-600"
                                  >
                                    <Trash2 aria-hidden className="size-4" />
                                  </button>
                                </div>
                              </li>
                            );
                          })}
                        </ol>
                        {section.lessons.length === 0 && (
                          <p
                            className={cn(
                              'rounded-xl border border-dashed px-4 py-4 text-center text-sm text-muted',
                              drag?.kind === 'lesson' &&
                                target &&
                                'sectionId' in target &&
                                target.sectionId === section.id
                                ? 'border-brand-300 bg-brand-50/60'
                                : 'border-line-strong',
                            )}
                          >
                            No lessons yet — add one or drag a lesson here.
                          </p>
                        )}
                        {drag?.kind === 'lesson' &&
                          target &&
                          'sectionId' in target &&
                          target.sectionId === section.id &&
                          target.index === section.lessons.length &&
                          section.lessons.length > 0 && (
                            <span aria-hidden className="mt-1.5 block h-0.5 rounded-full bg-brand-500" />
                          )}
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Plus}
                          className="mt-2.5 text-brand-700"
                          onClick={() => startAddLesson(section.id)}
                        >
                          Add Lesson
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      )}

      <LessonTypePicker open={!!picker} onClose={() => setPicker(null)} onPick={pickType} />
      <LessonEditor
        open={!!editor}
        lesson={editor?.lesson ?? null}
        sections={sections}
        sectionId={editor?.sectionId ?? ''}
        isNew={editor?.isNew ?? false}
        onClose={() => setEditor(null)}
        onSave={saveLesson}
      />
    </div>
  );
}
