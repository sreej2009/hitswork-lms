import { startTransition, useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, GraduationCap, LayoutDashboard, LogOut, Settings, UserRound, type LucideIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { firstName } from '../../lib/auth';
import { cn } from '../../lib/cn';
import { AppLink } from '../ui/AppLink';
import { Avatar } from '../ui/Avatar';

export const accountLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: 'My Learning', href: '/my-learning', icon: GraduationCap },
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/profile', icon: UserRound },
  { label: 'Settings', href: '/settings', icon: Settings },
];

/** Signs out, confirms with a toast and returns to the homepage. */
export function useSignOut() {
  const { logout } = useAuth();
  const { notify } = useStore();
  const navigate = useNavigate();
  return () => {
    // Router navigations are transitions; signing out inside the same transition means the page
    // changes to "/" in the same render, so a protected page never sees the signed-out state and
    // redirects to /login instead.
    startTransition(() => {
      navigate('/');
      logout();
    });
    notify('You’ve been signed out');
  };
}

/** Avatar + name button with an account dropdown (menu-button pattern). */
export function UserMenu({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  const signOut = useSignOut();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLElement | null>>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    // Move focus into the menu when it opens.
    itemsRef.current[0]?.focus();
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  if (!user) return null;

  const close = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  };

  const onMenuKeyDown = (event: KeyboardEvent) => {
    const items = itemsRef.current.filter(Boolean) as HTMLElement[];
    const index = items.indexOf(document.activeElement as HTMLElement);
    const move = (next: number) => {
      event.preventDefault();
      items[(next + items.length) % items.length]?.focus();
    };
    if (event.key === 'ArrowDown') move(index + 1);
    else if (event.key === 'ArrowUp') move(index - 1);
    else if (event.key === 'Home') move(0);
    else if (event.key === 'End') move(items.length - 1);
    else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'Tab') close(false);
  };

  const itemClass =
    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-body outline-none transition-colors hover:bg-canvas hover:text-ink focus-visible:bg-canvas focus-visible:text-ink';

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Account menu for ${user.name}`}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          'flex items-center gap-2 rounded-full transition-colors',
          compact ? 'p-1' : 'py-1 pr-2.5 pl-1',
          open ? 'bg-canvas' : 'hover:bg-canvas',
        )}
      >
        <Avatar name={user.name} size="xs" />
        {!compact && (
          <>
            <span className="max-w-28 truncate text-sm font-semibold text-ink">{firstName(user.name)}</span>
            <ChevronDown
              aria-hidden
              className={cn('size-4 text-muted transition-transform duration-200', open && 'rotate-180')}
              strokeWidth={2.2}
            />
          </>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Account"
            onKeyDown={onMenuKeyDown}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full right-0 z-50 mt-3 w-64 origin-top-right rounded-2xl border border-line bg-white p-2 shadow-float"
          >
            <div className="flex items-center gap-3 border-b border-line px-3 pt-2 pb-3.5">
              <Avatar name={user.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>
            <div className="py-1.5">
              {accountLinks.map(({ label, href, icon: Icon }, index) => (
                <AppLink
                  key={href}
                  ref={(node) => {
                    itemsRef.current[index] = node;
                  }}
                  href={href}
                  role="menuitem"
                  tabIndex={-1}
                  onClick={() => close(false)}
                  className={itemClass}
                >
                  <Icon aria-hidden className="size-[18px] text-muted" strokeWidth={1.9} />
                  {label}
                </AppLink>
              ))}
            </div>
            <div className="border-t border-line pt-1.5">
              <button
                ref={(node) => {
                  itemsRef.current[accountLinks.length] = node;
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  close(false);
                  signOut();
                }}
                className={cn(itemClass, 'text-rose-600 hover:bg-rose-50 hover:text-rose-700 focus-visible:bg-rose-50')}
              >
                <LogOut aria-hidden className="size-[18px]" strokeWidth={1.9} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
