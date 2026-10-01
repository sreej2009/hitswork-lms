import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, Bell, BellOff, CheckCircle2, Flame, GraduationCap, PlayCircle, type LucideIcon } from 'lucide-react';
import type { NotificationKind } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLearning } from '../../context/LearningContext';
import { cn } from '../../lib/cn';
import { formatRelative } from '../../lib/format';
import { Button } from '../ui/Button';

const kindStyles: Record<NotificationKind, { icon: LucideIcon; className: string }> = {
  lesson: { icon: PlayCircle, className: 'bg-blue-50 text-blue-600' },
  completed: { icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-600' },
  certificate: { icon: Award, className: 'bg-violet-50 text-violet-600' },
  streak: { icon: Flame, className: 'bg-orange-50 text-orange-600' },
  enrolled: { icon: GraduationCap, className: 'bg-indigo-50 text-indigo-600' },
};

export interface DropdownNotification {
  id: string;
  message: string;
  /** ISO timestamp */
  createdAt: string;
  read: boolean;
  icon: LucideIcon;
  /** Tile colours for the icon */
  iconClass: string;
}

function NotificationItem({ notification, onOpen }: { notification: DropdownNotification; onOpen: () => void }) {
  const Icon = notification.icon;
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          'flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-canvas',
          !notification.read && 'bg-brand-50/50',
        )}
      >
        <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl', notification.iconClass)}>
          <Icon aria-hidden className="size-[18px]" strokeWidth={2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className={cn('block text-sm leading-snug', notification.read ? 'text-body' : 'font-medium text-ink')}>
            {notification.message}
          </span>
          <span className="mt-1 block text-xs text-muted">{formatRelative(notification.createdAt)}</span>
        </span>
        {!notification.read && (
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-500">
            <span className="sr-only">Unread</span>
          </span>
        )}
      </button>
    </li>
  );
}

interface NotificationsDropdownProps {
  items: DropdownNotification[];
  onOpen: (id: string) => void;
  onMarkAllRead: () => void;
  /** Replaces the list, e.g. a sign-in prompt for visitors */
  placeholder?: ReactNode;
  className?: string;
}

/** Bell button with an unread dot and a dropdown of recent notifications. */
export function NotificationsDropdown({ items, onOpen, onMarkAllRead, placeholder, className }: NotificationsDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const unread = placeholder ? 0 : items.filter((item) => !item.read).length;

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

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'relative inline-flex size-10 items-center justify-center rounded-full text-body transition-colors duration-200 hover:bg-canvas hover:text-ink',
          open && 'bg-canvas text-ink',
        )}
      >
        <Bell aria-hidden className="size-5" strokeWidth={1.9} />
        {unread > 0 && (
          <span aria-hidden className="absolute top-2 right-2.5 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label="Notifications"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full right-0 z-50 mt-3 w-[min(calc(100vw-2rem),380px)] origin-top-right rounded-2xl border border-line bg-white shadow-float"
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                Notifications
                {unread > 0 && (
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                    {unread} new
                  </span>
                )}
              </p>
              {!placeholder && (
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  disabled={unread === 0}
                  className="rounded-md text-xs font-semibold text-brand-600 transition-colors hover:text-brand-700 disabled:cursor-default disabled:text-subtle"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {placeholder ??
              (items.length === 0 ? (
                <div className="flex flex-col items-center px-5 py-10 text-center">
                  <BellOff aria-hidden className="size-6 text-subtle" strokeWidth={1.8} />
                  <p className="mt-3 text-sm font-medium text-ink">You’re all caught up</p>
                </div>
              ) : (
                <ul className="max-h-[min(24rem,60vh)] space-y-0.5 overflow-y-auto p-2">
                  {items.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onOpen={() => {
                        setOpen(false);
                        onOpen(notification.id);
                      }}
                    />
                  ))}
                </ul>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** The learner's notifications (course progress, certificates, streaks). */
export function NotificationsMenu({ className }: { className?: string }) {
  const { isAuthenticated } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useLearning();
  const navigate = useNavigate();

  const items: DropdownNotification[] = notifications.map((notification) => ({
    ...notification,
    icon: kindStyles[notification.kind].icon,
    iconClass: kindStyles[notification.kind].className,
  }));

  const open = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    markNotificationRead(id);
    if (notification?.href) navigate(notification.href);
  };

  return (
    <NotificationsDropdown
      className={className}
      items={items}
      onOpen={open}
      onMarkAllRead={markAllNotificationsRead}
      placeholder={
        isAuthenticated ? undefined : (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-body">Sign in to see updates about your courses.</p>
            <Button href="/login" size="sm" shape="pill" className="mt-4 px-5">
              Sign In
            </Button>
          </div>
        )
      }
    />
  );
}
