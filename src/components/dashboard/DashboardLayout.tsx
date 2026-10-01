import { createContext, useCallback, useContext, useEffect, useRef, useState, type ComponentType } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useModalDialog } from '../../hooks/useModalDialog';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/cn';
import { IconButton } from '../ui/IconButton';
import { easeOutSoft } from '../ui/Reveal';
import { DashboardSidebar } from './DashboardSidebar';
import type { ShellSidebarProps } from './SidebarNav';

interface DashboardUI {
  openSidebar: () => void;
  /** Returns focus here when the drawer closes */
  registerMenuButton: (element: HTMLButtonElement | null) => void;
}

const DashboardUIContext = createContext<DashboardUI | null>(null);

export function useDashboardUI(): DashboardUI {
  const context = useContext(DashboardUIContext);
  if (!context) throw new Error('useDashboardUI must be used inside <DashboardLayout>');
  return context;
}

const COLLAPSED_KEY = 'hitswork_sidebar_collapsed';

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  returnFocus: HTMLButtonElement | null;
  Sidebar: ComponentType<ShellSidebarProps>;
  label: string;
}

function MobileSidebar({ open, onClose, returnFocus, Sidebar, label }: MobileSidebarProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  returnFocusRef.current = returnFocus;
  useModalDialog({ open, onClose, panelRef, initialFocusRef: closeRef, returnFocusRef, closeWhenMatches: '(min-width: 48rem)' });

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
            role="dialog"
            aria-modal="true"
            aria-label={`${label} menu`}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: easeOutSoft }}
            className="fixed inset-y-0 left-0 z-[71] w-[min(84vw,300px)] bg-white shadow-2xl"
          >
            <span className="absolute top-4 right-3 z-10">
              <IconButton ref={closeRef} icon={X} label="Close menu" onClick={onClose} />
            </span>
            <Sidebar collapsed={false} onNavigate={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

interface DashboardLayoutProps {
  /** Navigation for this area; the student sidebar by default */
  sidebar?: ComponentType<ShellSidebarProps>;
  /** Accessible name of the sidebar landmark */
  label?: string;
}

/** Dashboard shell (student and instructor areas): sidebar (full, rail or drawer) + animated page content. */
export function DashboardLayout({ sidebar: Sidebar = DashboardSidebar, label = 'Student area' }: DashboardLayoutProps) {
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width: 64rem)');
  const [collapsedPreference, setCollapsedPreference] = useState(() => {
    try {
      return window.localStorage.getItem(COLLAPSED_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuButton, setMenuButton] = useState<HTMLButtonElement | null>(null);

  // Tablets always get the icon rail; desktops follow the user's preference.
  const collapsed = !isDesktop || collapsedPreference;

  const toggleCollapsed = () =>
    setCollapsedPreference((value) => {
      try {
        window.localStorage.setItem(COLLAPSED_KEY, String(!value));
      } catch {
        // Preference won't persist.
      }
      return !value;
    });

  useEffect(() => setDrawerOpen(false), [location.pathname]);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const ui = { openSidebar: () => setDrawerOpen(true), registerMenuButton: setMenuButton };

  return (
    <DashboardUIContext.Provider value={ui}>
      <div className="min-h-dvh bg-canvas">
        <a
          href="#main"
          className="sr-only rounded-lg bg-ink text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:px-4 focus:py-2.5"
        >
          Skip to content
        </a>

        <aside
          aria-label={label}
          className={cn(
            'fixed inset-y-0 left-0 z-40 hidden border-r border-line bg-white transition-[width] duration-300 ease-out-soft md:block',
            collapsed ? 'w-[76px]' : 'w-64',
          )}
        >
          <Sidebar collapsed={collapsed} onToggleCollapsed={isDesktop ? toggleCollapsed : undefined} />
        </aside>

        <div className={cn('transition-[padding] duration-300 ease-out-soft', collapsed ? 'md:pl-[76px]' : 'md:pl-64')}>
          <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1280px] px-4 pt-5 pb-16 outline-none sm:px-6 md:pt-7 lg:px-10">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: easeOutSoft }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>

        <MobileSidebar open={drawerOpen} onClose={closeDrawer} returnFocus={menuButton} Sidebar={Sidebar} label={label} />
      </div>
    </DashboardUIContext.Provider>
  );
}
