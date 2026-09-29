import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, GraduationCap, Menu, Search, ShoppingCart, X } from 'lucide-react';
import { NavLink, useLocation } from 'react-router';
import { primaryNav } from '../../data/navigation';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { IconButton, IconLink } from '../ui/IconButton';
import { Logo } from '../ui/Logo';
import { CategoriesMenu } from './CategoriesMenu';
import { MobileDrawer } from './MobileDrawer';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';

/** Height of the docked (top-of-page) navbar; the layout reserves this much space. */
const DOCKED_HEIGHT = 'h-[76px]';

/** True once the page has scrolled; hysteresis stops it flickering at the threshold. */
function useScrolled(enterAt = 24, leaveAt = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled((current) => (current ? window.scrollY > leaveAt : window.scrollY > enterAt));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [enterAt, leaveAt]);
  return scrolled;
}

// All size/shape changes use the same duration and easing so the bar morphs as one piece.
const morph = 'duration-[380ms] ease-out-soft';

export function Navbar() {
  const scrolled = useScrolled();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { cart, enrolled } = useStore();
  const { isAuthenticated } = useAuth();

  // Collapse the search panel and drawer after navigating (e.g. submitting a search).
  const location = useLocation();
  useEffect(() => {
    setSearchOpen(false);
    setDrawerOpen(false);
  }, [location.pathname, location.search]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const toggleSearch = () => setSearchOpen((value) => !value);

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-lg bg-ink text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:px-4 focus:py-2.5"
      >
        Skip to content
      </a>

      <header
        // The wrapper only supplies the floating inset; it must not block clicks on the page beneath it.
        className={cn(
          'pointer-events-none fixed inset-x-0 top-0 z-50 transition-[padding]',
          morph,
          scrolled ? 'px-[4%] pt-3 sm:pt-4 2xl:px-[5%]' : 'px-0 pt-0',
        )}
      >
        <div
          data-state={scrolled ? 'floating' : 'docked'}
          className={cn(
            'pointer-events-auto mx-auto border transition-[height,border-radius,background-color,box-shadow,border-color]',
            morph,
            scrolled
              ? 'h-16 rounded-[2rem] border-line/80 bg-white/80 shadow-[0_14px_36px_-16px_rgb(15_23_42/0.25),0_2px_6px_-2px_rgb(15_23_42/0.06)] backdrop-blur-xl backdrop-saturate-150'
              : cn(DOCKED_HEIGHT, 'rounded-[0rem] border-x-transparent border-t-transparent border-b-line bg-white'),
          )}
        >
          <div
            className={cn(
              'mx-auto flex h-full w-full max-w-[1440px] items-center gap-3 transition-[padding] min-[1360px]:gap-5',
              morph,
              scrolled ? 'pr-3 pl-4 sm:pr-4 sm:pl-5 lg:pl-6' : 'px-4 sm:px-6 lg:px-8',
            )}
          >
            <Logo />

            <nav aria-label="Primary" className="ml-1 hidden items-center gap-0.5 xl:flex min-[1360px]:ml-2">
              <CategoriesMenu />
              {primaryNav.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  className={({ isActive }) =>
                    cn(
                      'relative rounded-lg px-2.5 py-2 text-[14.5px] font-medium whitespace-nowrap transition-colors duration-200 min-[1360px]:px-3',
                      isActive
                        ? 'text-brand-700 after:absolute after:inset-x-2.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand-gradient min-[1360px]:after:inset-x-3'
                        : 'text-body hover:bg-canvas hover:text-ink',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Desktop search. Collapses to an icon when the floating bar leaves it too little room. */}
            <div className="@container mx-2 hidden min-w-0 flex-1 items-center lg:flex lg:mx-3 xl:mx-1 min-[1360px]:mx-4">
              <SearchBar hotkey className="w-full max-w-2xl @max-[13rem]:hidden" />
              <IconButton
                icon={searchOpen ? X : Search}
                label={searchOpen ? 'Close search' : 'Search'}
                aria-expanded={searchOpen}
                aria-controls="nav-search-panel"
                onClick={toggleSearch}
                className="ml-auto @min-[13rem]:hidden"
              />
            </div>

            <div className="ml-auto flex items-center gap-0.5 lg:ml-0">
              <IconButton
                icon={searchOpen ? X : Search}
                label={searchOpen ? 'Close search' : 'Search'}
                aria-expanded={searchOpen}
                aria-controls="nav-search-panel"
                onClick={toggleSearch}
                className="lg:hidden"
              />
              {(isAuthenticated || enrolled.size > 0) && (
                <IconLink href="/my-learning" icon={GraduationCap} label="My Learning" className="max-lg:hidden" />
              )}
              <IconLink href="/cart" icon={ShoppingCart} label="Cart" badge={cart.size} className="max-lg:hidden" />
              <IconButton icon={Bell} label="Notifications, 3 unread" badge className="max-lg:hidden" />

              <div className="ml-2 hidden items-center gap-2 border-l border-line pl-3 lg:flex min-[1360px]:ml-3 min-[1360px]:pl-4">
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <>
                    <Button variant="ghost" size="sm" shape="pill" href="/login" className="px-4">
                      Sign In
                    </Button>
                    <Button size="sm" shape="pill" href="/register" className="px-5">
                      Sign Up
                    </Button>
                  </>
                )}
              </div>

              <IconButton
                ref={menuButtonRef}
                icon={Menu}
                label="Open menu"
                aria-expanded={drawerOpen}
                aria-controls="mobile-drawer"
                onClick={() => setDrawerOpen(true)}
                className="text-ink lg:ml-1 xl:hidden"
              />
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.div
              id="nav-search-panel"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setSearchOpen(false);
              }}
              className={cn('pointer-events-auto mx-auto mt-2 max-w-2xl', !scrolled && 'px-4 sm:px-6')}
            >
              <div className="rounded-2xl border border-line bg-white p-3 shadow-float">
                <SearchBar autoFocus />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Reserves the docked navbar's space, since the header itself is fixed. */}
      <div aria-hidden className={DOCKED_HEIGHT} />

      <MobileDrawer open={drawerOpen} onClose={closeDrawer} returnFocusRef={menuButtonRef} />
    </>
  );
}
