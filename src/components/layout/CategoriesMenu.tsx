import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { categories, categoryHref } from '../../data/categories';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { formatNumber } from '../../lib/format';
import { AppLink } from '../ui/AppLink';
import { TextLink } from '../ui/TextLink';

/** Desktop "Categories" mega-menu. Opens on hover or click; closes on Escape or outside click. */
export function CategoriesMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 140);
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="categories-menu"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-[14.5px] font-medium transition-colors min-[1360px]:px-3',
          open ? 'bg-canvas text-ink' : 'text-body hover:bg-canvas hover:text-ink',
        )}
      >
        Categories
        <ChevronDown
          aria-hidden
          className={cn('size-4 transition-transform duration-200', open && 'rotate-180')}
          strokeWidth={2.2}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="categories-menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full -left-3 z-50 w-[660px] pt-3"
          >
            <div className="rounded-2xl border border-line bg-white p-3 shadow-float">
              <p className="px-2.5 pt-1 pb-2 text-xs font-semibold tracking-[0.12em] text-subtle uppercase">
                Browse categories
              </p>
              <ul className="grid grid-cols-3 gap-1">
                {categories.map((category) => {
                  const accent = accents[category.accent];
                  const Icon = category.icon;
                  return (
                    <li key={category.id}>
                      <AppLink
                        href={categoryHref(category.id)}
                        className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-canvas"
                      >
                        <span
                          className={cn(
                            'grid size-10 shrink-0 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-105',
                            accent.soft,
                            accent.text,
                          )}
                        >
                          <Icon aria-hidden className="size-[18px]" strokeWidth={2} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-ink">{category.name}</span>
                          <span className="block text-xs text-muted">{formatNumber(category.courseCount)} courses</span>
                        </span>
                      </AppLink>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2 flex items-center justify-between gap-4 rounded-xl bg-linear-to-r from-brand-50 to-grape-50 px-4 py-3">
                <p className="flex items-center gap-2 text-sm text-body">
                  <Sparkles aria-hidden className="size-4 text-brand-600" />
                  <span>
                    <span className="font-semibold text-ink">New:</span> Generative AI career path
                  </span>
                </p>
                <TextLink href="/courses">All courses</TextLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
