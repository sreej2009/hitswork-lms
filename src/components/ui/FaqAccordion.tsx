import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/cn';
import { easeOutSoft } from './Reveal';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  /** Index open on first render; `null` starts fully collapsed */
  defaultOpen?: number | null;
  className?: string;
}

/** Single-open accordion for FAQs. */
export function FaqAccordion({ items, defaultOpen = 0, className }: FaqAccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const buttonId = `${baseId}-q-${index}`;
        const panelId = `${baseId}-a-${index}`;
        return (
          <div
            key={item.question}
            className={cn(
              'rounded-2xl border bg-white transition-[border-color,box-shadow] duration-300',
              isOpen ? 'border-brand-100 shadow-card' : 'border-line hover:border-brand-100',
            )}
          >
            <h3 className="font-sans text-pretty">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left sm:px-6 sm:py-5"
              >
                <span className="min-w-0 flex-1 text-[15px] font-semibold text-ink sm:text-base">{item.question}</span>
                <span
                  className={cn(
                    'grid size-8 shrink-0 place-items-center rounded-full transition-colors duration-300',
                    isOpen ? 'bg-brand-gradient text-white' : 'bg-brand-50 text-brand-600',
                  )}
                >
                  <Plus
                    aria-hidden
                    className={cn('size-4 transition-transform duration-300', isOpen && 'rotate-45')}
                    strokeWidth={2.4}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: easeOutSoft }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-[15px] leading-relaxed text-body sm:px-6 sm:pr-16">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
