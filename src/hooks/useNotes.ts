import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Note } from '../types';

const KEY = 'hitswork_notes';

function loadNotes(): Note[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Note[];
  } catch {
    return [];
  }
}

/** Lesson notes for one course, persisted in localStorage (newest first). */
export function useNotes(courseId: string) {
  const [all, setAll] = useState<Note[]>(loadNotes);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(all));
    } catch {
      // Notes last for this session only.
    }
  }, [all]);

  const notes = useMemo(
    () => all.filter((note) => note.courseId === courseId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [all, courseId],
  );

  const addNote = useCallback(
    (lessonId: string, lessonTitle: string, body: string) => {
      const now = new Date().toISOString();
      setAll((current) => [
        { id: `note-${Date.now()}`, courseId, lessonId, lessonTitle, body: body.trim(), createdAt: now, updatedAt: now },
        ...current,
      ]);
    },
    [courseId],
  );

  const updateNote = useCallback((id: string, body: string) => {
    setAll((current) =>
      current.map((note) => (note.id === id ? { ...note, body: body.trim(), updatedAt: new Date().toISOString() } : note)),
    );
  }, []);

  const deleteNote = useCallback((id: string) => setAll((current) => current.filter((note) => note.id !== id)), []);

  return { notes, addNote, updateNote, deleteNote };
}
