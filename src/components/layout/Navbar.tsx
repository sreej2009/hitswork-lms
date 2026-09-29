import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Menu, Search, ShoppingCart, X } from 'lucide-react';
import { primaryNav } from '../../data/navigation';
import { useStore } from '../../context/StoreContext';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { IconButton } from '../ui/IconButton';
import { Logo } from '../ui/Logo';
import { CategoriesMenu } from './CategoriesMenu';
import { MobileDrawer } from './MobileDrawer';
import { SearchBar } from './SearchBar';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { cart } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300',
        scrolled
          ? 'border-line/70 bg-white/80 shadow-nav backdrop-blur-xl backdrop-saturate-150'
          : 'border-line bg-white',
      )}
    >
      <a
        href="#main"
        className="sr-only rounded-lg bg-ink text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[80] focus:px-4 focus:py-2.5"
      >
        Skip to content
      </a>

      <Container size="wide" className="flex h-16 items-center gap-3 lg:h-[72px] min-[1360px]:gap-5">
        <Logo />

        <nav aria-label="Primary" className="ml-1 hidden items-center gap-0.5 xl:flex min-[1360px]:ml-2">
          <CategoriesMenu />
          {primaryNav.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-lg px-2.5 py-2 text-[14.5px] font-medium whitespace-nowrap text-body min-[1360px]:px-3 transition-colors hover:bg-canvas hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <SearchBar hotkey className="mx-2 max-w-2xl flex-1 max-md:hidden lg:mx-3 xl:mx-1 min-[1360px]:mx-4" />

        <div className="ml-auto flex items-center gap-0.5 md:ml-0">
          <IconButton
            icon={mobileSearchOpen ? X : Search}
            label={mobileSearchOpen ? 'Close search' : 'Search'}
            aria-expanded={mobileSearchOpen}
            aria-controls="mobile-search"
            onClick={() => setMobileSearchOpen((value) => !value)}
            className="md:hidden"
          />
          <IconButton icon={ShoppingCart} label="Cart" badge={cart.size} className="max-md:hidden" />
          <IconButton icon={Bell} label="Notifications, 3 unread" badge className="max-md:hidden" />

          <div className="ml-2 hidden items-center gap-2 border-l border-line pl-3 lg:flex min-[1360px]:ml-3 min-[1360px]:pl-4">
            <Button variant="ghost" size="sm" href="/login" className="px-3">
              Sign In
            </Button>
            <Button size="sm" href="/signup" className="px-5">
              Sign Up
            </Button>
          </div>

          <IconButton
            ref={menuButtonRef}
            icon={Menu}
            label="Open menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={() => setDrawerOpen(true)}
            className="-mr-2 text-ink lg:ml-1 xl:hidden"
          />
        </div>
      </Container>

      <AnimatePresence initial={false}>
        {mobileSearchOpen && (
          <motion.div
            id="mobile-search"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <Container className="py-3">
              <SearchBar autoFocus />
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileDrawer open={drawerOpen} onClose={closeDrawer} returnFocusRef={menuButtonRef} />
    </header>
  );
}
