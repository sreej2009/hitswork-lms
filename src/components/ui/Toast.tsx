import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/** Transient confirmation for cart / wishlist actions. */
export function Toast() {
  const { toast } = useStore();
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4 in-data-bottom-bar:max-lg:bottom-28">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="flex max-w-md items-center gap-3 rounded-2xl bg-ink py-3 pr-5 pl-3 text-sm font-medium text-white shadow-float"
          >
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
              <Check aria-hidden className="size-4" strokeWidth={2.6} />
            </span>
            <span className="line-clamp-2">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
