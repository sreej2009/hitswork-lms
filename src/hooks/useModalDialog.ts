import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

interface ModalDialogOptions {
  open: boolean;
  onClose: () => void;
  /** The dialog panel; Tab focus is kept inside it */
  panelRef: RefObject<HTMLElement | null>;
  /** Receives focus when the dialog opens */
  initialFocusRef: RefObject<HTMLElement | null>;
  /** Receives focus again when the dialog closes */
  returnFocusRef?: RefObject<HTMLElement | null>;
  /** Close automatically once this media query matches (e.g. the desktop layout takes over) */
  closeWhenMatches?: string;
}

/** Shared modal behaviour: scroll lock, initial focus, focus trap, Escape to close, focus return. */
export function useModalDialog({
  open,
  onClose,
  panelRef,
  initialFocusRef,
  returnFocusRef,
  closeWhenMatches,
}: ModalDialogOptions) {
  // Read through a ref so a new onClose function on every parent render doesn't re-run the effect
  // (which would steal focus from whatever the user is typing in).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const returnTo = returnFocusRef?.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    initialFocusRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key !== 'Tab' || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    const query = closeWhenMatches ? window.matchMedia(closeWhenMatches) : null;
    const onQueryChange = () => {
      if (query?.matches) onCloseRef.current();
    };

    document.addEventListener('keydown', onKeyDown);
    query?.addEventListener('change', onQueryChange);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      query?.removeEventListener('change', onQueryChange);
      returnTo?.focus();
    };
  }, [open, panelRef, initialFocusRef, returnFocusRef, closeWhenMatches]);
}
