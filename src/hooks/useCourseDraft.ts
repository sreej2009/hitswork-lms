import { useCallback, useEffect, useRef, useState } from 'react';
import { useInstructor } from '../context/InstructorContext';
import { emptyDraft, finaliseDraft, toDraft, type CourseDraft } from '../lib/courseBuilder';

export type SaveState = 'idle' | 'pending' | 'saving' | 'saved';
export type DraftPatch = Partial<CourseDraft> | ((current: CourseDraft) => Partial<CourseDraft>);

const AUTOSAVE_DELAY = 800;

/**
 * Course builder state with debounced autosave. Edits update local state immediately; after a short
 * pause the whole draft is written through `saveCourse` (localStorage today, an API later).
 * A brand-new course is only stored once something has actually been entered.
 */
export function useCourseDraft(courseId: string | undefined) {
  const { getCourse, saveCourse } = useInstructor();
  const existing = courseId ? getCourse(courseId) : undefined;
  const [draft, setDraft] = useState<CourseDraft>(() => (existing ? toDraft(existing) : emptyDraft()));
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [savedAt, setSavedAt] = useState<number | null>(existing ? Date.parse(existing.updatedAt) : null);
  const [persisted, setPersisted] = useState(!!existing);
  const timer = useRef<number | undefined>(undefined);
  const latest = useRef(draft);
  latest.current = draft;
  const dirty = useRef(false);

  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    if (!dirty.current) return latest.current;
    dirty.current = false;
    setSaveState('saving');
    const final = finaliseDraft(latest.current);
    saveCourse(final);
    setPersisted(true);
    setSavedAt(Date.now());
    // Keep "Saving…" on screen briefly so the state change is noticeable.
    window.setTimeout(() => setSaveState('saved'), 350);
    return final;
  }, [saveCourse]);

  const update = useCallback(
    /** A patch, or a function of the latest draft (for async callbacks like finished uploads) */
    (patch: DraftPatch) => {
      setDraft((current) => ({ ...current, ...(typeof patch === 'function' ? patch(current) : patch) }));
      dirty.current = true;
      setSaveState('pending');
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => flush(), AUTOSAVE_DELAY);
    },
    [flush],
  );

  /** Saves immediately and applies a status change (e.g. submit for review). */
  const commit = useCallback(
    (patch: Partial<CourseDraft>) => {
      latest.current = { ...latest.current, ...patch };
      setDraft(latest.current);
      dirty.current = true;
      return flush();
    },
    [flush],
  );

  // Save pending edits when leaving the builder (route change, tab close).
  useEffect(() => {
    const onUnload = () => flush();
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
      flush();
    };
  }, [flush]);

  return { draft, update, flush, commit, saveState, savedAt, persisted, exists: !!existing || persisted };
}
