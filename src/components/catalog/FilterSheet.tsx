import { useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useModalDialog } from '../../hooks/useModalDialog';
import { formatNumber } from '../../lib/format';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { easeOutSoft } from '../ui/Reveal';

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  resultCount: number;
  activeCount: number;
  returnFocusRef: RefObject<HTMLElement | null>;
  children: ReactNode;
}

/** Bottom sheet holding the filters on phones and tablets. Filters apply live; the button just closes. */
export function FilterSheet({ open, onClose, onClear, resultCount, activeCount, returnFocusRef, children }: FilterSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useModalDialog({
    open,
    onClose,
    panelRef,
    initialFocusRef: closeRef,
    returnFocusRef,
    closeWhenMatches: '(min-width: 64rem)',
  });

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
            className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-[2px]"
          />
          <motion.div
            key="sheet"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-sheet-title"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.36, ease: easeOutSoft }}
            className="fixed inset-x-0 bottom-0 z-[71] flex max-h-[88vh] flex-col rounded-t-3xl bg-white shadow-2xl sm:inset-x-auto sm:right-4 sm:bottom-4 sm:left-4 sm:rounded-3xl md:left-auto md:w-[420px]"
          >
            <div aria-hidden className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-line-strong sm:hidden" />
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <h2 id="filter-sheet-title" className="font-sans text-base font-bold">
                Filters
              </h2>
              <IconButton ref={closeRef} icon={X} label="Close filters" onClick={onClose} className="-mr-2" />
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">{children}</div>
            <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-line p-4">
              <Button variant="secondary" onClick={onClear} disabled={activeCount === 0}>
                Clear all
              </Button>
              <Button onClick={onClose}>
                Show {formatNumber(resultCount)} {resultCount === 1 ? 'course' : 'courses'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
