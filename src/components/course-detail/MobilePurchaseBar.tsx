import { useEffect, useState, type RefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Course } from '../../types';
import { EnrollButton } from './EnrollButton';
import { PriceBlock } from './PurchaseCard';

/**
 * Fixed bottom "Enroll" bar for screens below `lg`.
 * Appears only once the inline purchase card has scrolled up out of view (so it never covers the
 * hero or duplicates the card) and hides again when the footer comes into view.
 */
export function MobilePurchaseBar({ course, cardRef }: { course: Course; cardRef: RefObject<HTMLElement | null> }) {
  const [cardPassed, setCardPassed] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const footer = document.querySelector('footer');
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === card) setCardPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
        if (entry.target === footer) setFooterVisible(entry.isIntersecting);
      }
    });
    if (card) observer.observe(card);
    if (footer) observer.observe(footer);
    return () => observer.disconnect();
  }, [cardRef]);

  const visible = cardPassed && !footerVisible;

  // Lets the toast sit above the bar instead of on top of it.
  useEffect(() => {
    if (visible) document.body.dataset.bottomBar = '';
    else delete document.body.dataset.bottomBar;
    return () => {
      delete document.body.dataset.bottomBar;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_-14px_rgb(15_23_42/0.22)] backdrop-blur-lg lg:hidden"
        >
          <div className="mx-auto flex max-w-3xl items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-muted">{course.title}</p>
              <div className="mt-0.5">
                <PriceBlock course={course} compact />
              </div>
            </div>
            <EnrollButton course={course} size="md" className="px-5" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
