import { useRef, useState, type FormEvent, type RefObject } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, GraduationCap, Heart, LogOut, Search, ShoppingCart, X } from 'lucide-react';
import { categories, categoryHref } from '../../data/categories';
import { primaryNav } from '../../data/navigation';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { useModalDialog } from '../../hooks/useModalDialog';
import { accents } from '../../lib/accents';
import { cn } from '../../lib/cn';
import { AppLink } from '../ui/AppLink';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Logo } from '../ui/Logo';
import { easeOutSoft } from '../ui/Reveal';
import { accountLinks, useSignOut } from './UserMenu';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Element to return focus to after closing */
  returnFocusRef: RefObject<HTMLElement | null>;
}

export function MobileDrawer({ open, onClose, returnFocusRef }: MobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { cart, wishlist, enrolled } = useStore();
  const { user, isAuthenticated } = useAuth();
  const signOut = useSignOut();
  const navigate = useNavigate();

  useModalDialog({
    open,
    onClose,
    panelRef,
    initialFocusRef: closeRef,
    returnFocusRef,
    closeWhenMatches: '(min-width: 75rem)',
  });

  // Colours are set per state (not layered) so the active style never competes with the default.
  const linkBase = 'flex w-full items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium transition-colors';
  const linkClass = cn(linkBase, 'text-ink hover:bg-canvas');
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(linkBase, isActive ? 'bg-brand-50 text-brand-700' : 'text-ink hover:bg-canvas');

  const onSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = String(new FormData(event.currentTarget).get('q') ?? '').trim();
    onClose();
    navigate(q ? `/courses?q=${encodeURIComponent(q)}` : '/courses');
  };

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
            transition={{ duration: 0.32, ease: easeOutSoft }}
            className="fixed inset-y-0 right-0 z-[71] flex w-[min(88vw,380px)] flex-col bg-white shadow-2xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <Logo />
              <IconButton ref={closeRef} icon={X} label="Close menu" onClick={onClose} className="-mr-2" />
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4">
              <nav aria-label="Mobile">
                <ul className="space-y-0.5">
                  <li>
                    <NavLink to="/" end onClick={onClose} className={navLinkClass}>
                      Home
                    </NavLink>
                  </li>
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
                                <AppLink
                                  href={categoryHref(category.id)}
                                  onClick={onClose}
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
                                </AppLink>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                  {primaryNav.map((link) => (
                    <li key={link.label}>
                      <NavLink to={link.href} onClick={onClose} className={navLinkClass}>
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <form role="search" onSubmit={onSearch} className="group relative mx-1 mt-5">
                <label htmlFor="drawer-search" className="sr-only">
                  Search courses
                </label>
                <Search
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-subtle group-focus-within:text-brand-600"
                  strokeWidth={2}
                />
                <input
                  id="drawer-search"
                  type="search"
                  name="q"
                  autoComplete="off"
                  placeholder="Search courses..."
                  className="h-12 w-full rounded-full border border-line bg-canvas pr-4 pl-11 text-[15px] text-ink outline-none transition-[border-color,box-shadow,background-color] placeholder:text-subtle focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
                />
              </form>

              <div className="mx-3 my-4 h-px bg-line" />

              <ul className="space-y-0.5" aria-label="Your account">
                {[
                  ...(isAuthenticated
                    ? accountLinks.map((link) => ({ ...link, count: link.href === '/my-learning' ? enrolled.size : 0 }))
                    : [{ label: 'My Learning', href: '/my-learning', icon: GraduationCap, count: enrolled.size }]),
                  { label: 'My Cart', href: '/cart', icon: ShoppingCart, count: cart.size },
                  { label: 'Wishlist', href: isAuthenticated ? '/wishlist' : '/cart', icon: Heart, count: wishlist.size },
                ].map(({ label, href, icon: Icon, count }) => (
                  <li key={label}>
                    <AppLink href={href} onClick={onClose} className={linkClass}>
                      <span className="flex items-center gap-3">
                        <Icon aria-hidden className="size-[18px] text-muted" strokeWidth={1.9} />
                        {label}
                      </span>
                      {count > 0 && (
                        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                          {count}
                        </span>
                      )}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line p-5">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    shape="pill"
                    icon={LogOut}
                    onClick={() => {
                      onClose();
                      signOut();
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" shape="pill" href="/login" onClick={onClose}>
                    Sign In
                  </Button>
                  <Button shape="pill" href="/register" onClick={onClose}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
