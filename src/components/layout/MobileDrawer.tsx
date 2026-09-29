import { useEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, Heart, ShoppingCart, X } from 'lucide-react';
import { categories } from '../../data/categories';
import { primaryNav } from '../../data/navigation';
import { useStore } from '../../context/StoreContext';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Logo } from '../ui/Logo';
import { easeOutSoft } from '../ui/Reveal';
import { SearchBar } from './SearchBar';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Element to return focus to after closing */
  returnFocusRef: RefObject<HTMLElement | null>;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export function MobileDrawer({ open, onClose, returnFocusRef }: MobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { cart, wishlist } = useStore();

  useEffect(() => {
    if (!open) return;
    const returnTo = returnFocusRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !panelRef.current) return;
      // Keep keyboard focus inside the drawer.
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
    const onResize = () => {
      if (window.matchMedia('(min-width: 75rem)').matches) onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      returnTo?.focus();
    };
  }, [open, onClose, returnFocusRef]);

  const linkClass =
    'flex w-full items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-canvas';

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
            key="panel"
            ref={panelRef}
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.36, ease: easeOutSoft }}
            className="fixed inset-y-0 right-0 z-[71] flex w-[min(88vw,380px)] flex-col bg-white shadow-2xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <Logo />
              <IconButton ref={closeRef} icon={X} label="Close menu" onClick={onClose} className="-mr-2" />
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <SearchBar className="mx-2 mb-4" />

              <nav aria-label="Mobile">
                <ul className="space-y-0.5">
                  <li>
                    <button
                      type="button"
                      aria-expanded={categoriesOpen}
                      aria-controls="drawer-categories"
                      onClick={() => setCategoriesOpen((value) => !value)}
                      className={linkClass}
                    >
                      Categories
                      <ChevronDown
                        aria-hidden
                        className={cn('size-4 text-muted transition-transform', categoriesOpen && 'rotate-180')}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {categoriesOpen && (
                        <motion.ul
                          id="drawer-categories"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="grid grid-cols-2 gap-1 overflow-hidden px-1 pb-2"
                        >
                          {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                              <li key={category.id}>
                                <a
                                  href={`/categories/${category.id}`}
                                  className="flex items-center gap-2.5 rounded-lg p-2 text-sm font-medium text-body transition-colors hover:bg-canvas hover:text-ink"
                                >
                                  <span
                                    className={cn(
                                      'grid size-8 shrink-0 place-items-center rounded-lg',
                                      accents[category.accent].soft,
                                      accents[category.accent].text,
                                    )}
                                  >
                                    <Icon aria-hidden className="size-4" strokeWidth={2} />
                                  </span>
                                  <span className="leading-tight">{category.name}</span>
                                </a>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                  {primaryNav.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} onClick={onClose} className={linkClass}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mx-3 my-3 h-px bg-line" />

                <ul className="space-y-0.5">
                  {[
                    { label: 'My cart', icon: ShoppingCart, count: cart.size },
                    { label: 'Wishlist', icon: Heart, count: wishlist.size },
                    { label: 'Notifications', icon: Bell, count: 3 },
                  ].map(({ label, icon: Icon, count }) => (
                    <li key={label}>
                      <a href="#" className={linkClass}>
                        <span className="flex items-center gap-3">
                          <Icon aria-hidden className="size-[18px] text-muted" strokeWidth={1.9} />
                          {label}
                        </span>
                        {count > 0 && (
                          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                            {count}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-line p-5">
              <Button variant="secondary" href="/login">
                Sign In
              </Button>
              <Button href="/signup">Sign Up</Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
