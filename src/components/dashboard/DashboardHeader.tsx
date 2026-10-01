import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { NotificationsMenu } from '../layout/NotificationsMenu';
import { SearchBar } from '../layout/SearchBar';
import { UserMenu } from '../layout/UserMenu';
import { IconButton } from '../ui/IconButton';
import { Logo } from '../ui/Logo';
import { useDashboardUI } from './DashboardLayout';

/** Learner course search: an icon that opens the search bar in a popover. */
function CourseSearchPopover() {
  const [searchOpen, setSearchOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!searchOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setSearchOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSearchOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [searchOpen]);

  return (
    <div ref={rootRef} className="relative">
      <IconButton
        icon={searchOpen ? X : Search}
        label={searchOpen ? 'Close search' : 'Search courses'}
        aria-expanded={searchOpen}
        aria-controls={panelId}
        onClick={() => setSearchOpen((value) => !value)}
      />
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full right-0 z-50 mt-3 w-[min(calc(100vw-2rem),420px)] rounded-2xl border border-line bg-white p-3 shadow-float max-md:-right-24"
          >
            <SearchBar autoFocus />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeaderActions({
  search = <CourseSearchPopover />,
  notifications = <NotificationsMenu />,
  userMenu = <UserMenu compact />,
}: HeaderSlots) {
  return (
    <div className="flex items-center gap-1">
      {search}
      {notifications}
      <span className="ml-1">{userMenu}</span>
    </div>
  );
}

interface HeaderSlots {
  /** Search control; the learner course search by default */
  search?: ReactNode;
  /** Bell + dropdown; the learner notifications by default */
  notifications?: ReactNode;
  /** Avatar menu; the learner account menu by default */
  userMenu?: ReactNode;
}

interface DashboardHeaderProps extends HeaderSlots {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Extra controls under the title row, e.g. a back link */
  eyebrow?: ReactNode;
  /** Main call to action, e.g. "Create New Course" — beside the title on desktop, full width on phones */
  primaryAction?: ReactNode;
}

/** Page title + search, notifications and account menu. On phones it adds the menu button and logo. */
export function DashboardHeader({
  title,
  subtitle,
  eyebrow,
  primaryAction,
  search,
  notifications,
  userMenu,
}: DashboardHeaderProps) {
  const slots = { search, notifications, userMenu };
  const { openSidebar, registerMenuButton } = useDashboardUI();
  return (
    <header className="mb-8">
      <div className="mb-6 flex items-center gap-2 md:hidden">
        <IconButton
          ref={registerMenuButton}
          icon={Menu}
          label="Open menu"
          onClick={openSidebar}
          className="-ml-2 text-ink"
        />
        <Logo size="compact" />
        <div className="ml-auto">
          <HeaderActions {...slots} />
        </div>
      </div>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          {eyebrow && <div className="mb-3">{eyebrow}</div>}
          <h1 className={cn('text-[1.75rem] leading-tight font-extrabold tracking-[-0.03em] sm:text-[2rem]')}>
            {title}
          </h1>
          {subtitle && <p className="mt-1.5 text-[15px] text-body sm:text-base">{subtitle}</p>}
        </div>
        <div className="hidden shrink-0 items-center gap-4 md:flex">
          {primaryAction}
          <HeaderActions {...slots} />
        </div>
      </div>
      {primaryAction && <div className="mt-5 md:hidden [&>*]:w-full">{primaryAction}</div>}
    </header>
  );
}
