import { useEffect } from 'react';
import { useDocumentTitle } from './useDocumentTitle';

/** Sets the document title and meta description, restoring the site-wide description on leave. */
export function usePageMeta(title: string, description: string) {
  useDocumentTitle(title);
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) return;
    const previous = meta.content;
    meta.content = description;
    return () => {
      meta.content = previous;
    };
  }, [description]);
}
