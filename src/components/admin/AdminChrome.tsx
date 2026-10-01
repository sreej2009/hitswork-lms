import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Building2,
  ClipboardCheck,
  FileBarChart,
  GraduationCap,
  IndianRupee,
  LayoutDashboard,
  LayoutGrid,
  Loader2,
  Presentation,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  Star,
  UserPlus,
  X,
} from 'lucide-react';
import type { AdminNotificationKind } from '../../types/admin';
import { AdminProvider, useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { isAdminEmail } from '../../lib/auth';
import { cn } from '../../lib/cn';
import { formatPrice } from '../../lib/format';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { DashboardLayout } from '../dashboard/DashboardLayout';
import { SidebarNav, type ShellSidebarProps, type SidebarGroup } from '../dashboard/SidebarNav';
import { NotificationsDropdown, type DropdownNotification } from '../layout/NotificationsMenu';
import { UserMenu, type MenuLink } from '../layout/UserMenu';
import { AppLink } from '../ui/AppLink';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Modal } from '../ui/Modal';

/* ------------------------------------------------------------------ */
/*  Access                                                             */
/* ------------------------------------------------------------------ */

/**
 * Admin routes: signed-out visitors go to the sign-in page (admin mode) and come back;
 * signed-in users without the admin role go to their dashboard.
 */
export function RequireAdmin() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login?as=admin" replace state={{ from: location }} />;
  if (!isAdminEmail(user?.email)) return <Navigate to="/dashboard" replace />;
  return (
    <AdminProvider>
      <Outlet />
    </AdminProvider>
  );
}

export function AdminLayout() {
  return <DashboardLayout sidebar={AdminSidebar} label="Admin area" />;
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */

function AdminSidebar(props: ShellSidebarProps) {
  const { pendingCourses, orders } = useAdmin();
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const groups: SidebarGroup[] = [
    {
      items: [
        { label: 'Overview', href: '/admin', icon: LayoutDashboard, end: true },
        { label: 'Courses', href: '/admin/courses', icon: BookOpen, end: true },
        {
          label: 'Pending Reviews',
          href: '/admin/courses/pending',
          icon: ClipboardCheck,
          count: pendingCourses.length,
        },
        { label: 'Instructors', href: '/admin/instructors', icon: Presentation },
        { label: 'Students', href: '/admin/students', icon: GraduationCap },
        { label: 'Categories', href: '/admin/categories', icon: LayoutGrid },
      ],
    },
    {
      label: 'Commerce',
      items: [
        { label: 'Orders', href: '/admin/orders', icon: ReceiptText, count: pendingOrders },
        { label: 'Revenue', href: '/admin/reports#revenue', icon: IndianRupee },
      ],
    },
    {
      label: 'Reports',
      items: [
        { label: 'Analytics', href: '/admin/reports#analytics', icon: BarChart3 },
        { label: 'Reports', href: '/admin/reports', icon: FileBarChart },
      ],
    },
    { label: 'System', items: [{ label: 'Settings', href: '/admin/settings', icon: Settings }] },
  ];
  return (
    <SidebarNav
      label="Admin"
      groups={groups}
      footerItems={[{ label: 'Back to Website', href: '/', icon: ArrowLeft }]}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Global search                                                      */
/* ------------------------------------------------------------------ */

interface SearchHit {
  id: string;
  label: string;
  meta: string;
  href: string;
}

function AdminSearch() {
  const { courses, students, instructors, orders } = useAdmin();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length < 2) return [];
    const match = (...values: string[]) => values.some((v) => v.toLowerCase().includes(term));
    const take = <T,>(items: T[], map: (item: T) => SearchHit) => items.slice(0, 4).map(map);
    return [
      {
        label: 'Courses',
        hits: take(
          courses.filter((c) => match(c.title, c.instructor, c.category)),
          (c) => ({
            id: c.id,
            label: c.title,
            meta: `${c.instructor} · ${c.status}`,
            href: `/admin/courses/${c.id}/review`,
          }),
        ),
      },
      {
        label: 'Students',
        hits: take(
          students.filter((s) => match(s.name, s.email)),
          (s) => ({ id: s.id, label: s.name, meta: s.email, href: `/admin/students/${s.id}` }),
        ),
      },
      {
        label: 'Instructors',
        hits: take(
          instructors.filter((i) => match(i.name, i.email, i.specializations.join(' '))),
          (i) => ({ id: i.id, label: i.name, meta: i.headline, href: `/admin/instructors/${i.id}` }),
        ),
      },
      {
        label: 'Orders',
        hits: take(
          orders.filter((o) => match(o.id, o.student, o.courses.join(' '))),
          (o) => ({
            id: o.id,
            label: o.id,
            meta: `${o.student} · ${formatPrice(o.amount)}`,
            href: `/admin/orders?q=${encodeURIComponent(o.id)}`,
          }),
        ),
      },
    ].filter((g) => g.hits.length);
  }, [query, courses, students, instructors, orders]);

  const go = (href: string) => {
    setOpen(false);
    setQuery('');
    navigate(href);
  };

  return (
    <div ref={rootRef} className="relative">
      <IconButton
        icon={open ? X : Search}
        label={open ? 'Close search' : 'Search the platform'}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label="Search the platform"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full right-0 z-50 mt-3 w-[min(calc(100vw-2rem),440px)] rounded-2xl border border-line bg-white p-3 shadow-float max-md:-right-24"
          >
            <form
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                const first = groups[0]?.hits[0];
                if (first) go(first.href);
              }}
              className="relative"
            >
              <label htmlFor="admin-search" className="sr-only">
                Search courses, students, instructors and orders
              </label>
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-subtle"
              />
              <input
                id="admin-search"
                autoFocus
                type="search"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, students, instructors, orders…"
                className="h-11 w-full rounded-xl border border-line-strong bg-canvas pr-3 pl-10 text-sm text-ink outline-none focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
              />
            </form>
            <div className="mt-2 max-h-[min(26rem,60vh)] overflow-y-auto" aria-live="polite">
              {query.trim().length < 2 ? (
                <p className="px-2 py-3 text-xs text-muted">Type at least 2 characters.</p>
              ) : groups.length === 0 ? (
                <p className="px-2 py-3 text-sm text-muted">No results for “{query}”.</p>
              ) : (
                groups.map((group) => (
                  <div key={group.label} className="mt-2">
                    <p className="px-2 text-[11px] font-semibold tracking-[0.12em] text-subtle uppercase">
                      {group.label}
                    </p>
                    <ul className="mt-1">
                      {group.hits.map((hit) => (
                        <li key={hit.id}>
                          <button
                            type="button"
                            onClick={() => go(hit.href)}
                            className="flex w-full flex-col rounded-lg px-2 py-2 text-left hover:bg-canvas focus-visible:bg-canvas"
                          >
                            <span className="truncate text-sm font-semibold text-ink">{hit.label}</span>
                            <span className="truncate text-xs text-muted">{hit.meta}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Notifications + header                                             */
/* ------------------------------------------------------------------ */

const notificationStyles: Record<AdminNotificationKind, Pick<DropdownNotification, 'icon' | 'iconClass'>> = {
  review: { icon: ClipboardCheck, iconClass: 'bg-amber-50 text-amber-600' },
  application: { icon: UserPlus, iconClass: 'bg-indigo-50 text-indigo-600' },
  refund: { icon: IndianRupee, iconClass: 'bg-rose-50 text-rose-600' },
  enterprise: { icon: Building2, iconClass: 'bg-cyan-50 text-cyan-600' },
  order: { icon: ReceiptText, iconClass: 'bg-emerald-50 text-emerald-600' },
};

function AdminNotificationsMenu() {
  const { notifications, pendingCourses, markNotificationRead, markAllNotificationsRead } = useAdmin();
  const navigate = useNavigate();
  const items = notifications.map((n) => ({
    ...n,
    // Keep the review reminder in step with the actual queue.
    message: n.kind === 'review' ? `${pendingCourses.length} courses waiting for review` : n.message,
    ...notificationStyles[n.kind],
  }));
  return (
    <NotificationsDropdown
      items={items}
      onOpen={(id) => {
        const n = notifications.find((x) => x.id === id);
        markNotificationRead(id);
        if (n?.href) navigate(n.href);
      }}
      onMarkAllRead={markAllNotificationsRead}
    />
  );
}

const adminMenuLinks: MenuLink[] = [
  { label: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Back to Website', href: '/', icon: ArrowLeft },
];

export function AdminHeader(props: {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  primaryAction?: ReactNode;
}) {
  return (
    <DashboardHeader
      {...props}
      search={<AdminSearch />}
      notifications={<AdminNotificationsMenu />}
      userMenu={<UserMenu compact links={adminMenuLinks} />}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Shared pieces                                                      */
/* ------------------------------------------------------------------ */

const tones = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-800 ring-amber-100',
  red: 'bg-rose-50 text-rose-700 ring-rose-100',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  orange: 'bg-orange-50 text-orange-800 ring-orange-100',
};

const statusTone: Record<string, keyof typeof tones> = {
  Published: 'green',
  Active: 'green',
  Paid: 'green',
  Approved: 'green',
  Completed: 'green',
  Pending: 'amber',
  'Pending Review': 'amber',
  'Changes Requested': 'orange',
  Draft: 'slate',
  Inactive: 'slate',
  Disabled: 'slate',
  Refunded: 'brand',
  Rejected: 'red',
  Suspended: 'red',
  Failed: 'red',
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ring-1',
        tones[statusTone[status] ?? 'slate'],
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  tone?: 'primary' | 'danger';
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  /** Extra form content, e.g. a reason textarea */
  children?: ReactNode;
  /** Disable the confirm button (e.g. missing reason) */
  disabled?: boolean;
}

/** Confirmation for consequential actions. The confirm button is disabled while the action runs. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  tone = 'primary',
  onConfirm,
  onClose,
  children,
  disabled,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);
  const confirm = async () => {
    setBusy(true);
    try {
      // Simulated request so the processing state is visible.
      await new Promise((resolve) => window.setTimeout(resolve, 450));
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal
      open={open}
      onClose={busy ? () => undefined : onClose}
      size="sm"
      title={title}
      description={description}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={confirm}
            disabled={busy || disabled}
            aria-busy={busy}
          >
            {busy && <Loader2 aria-hidden className="size-[18px] animate-spin" />}
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children ?? <p className="text-sm text-body">You can change this later.</p>}
    </Modal>
  );
}

export function SampleNote() {
  return (
    <p className="mt-2.5 flex items-center gap-1.5 text-xs text-muted">
      <ShieldCheck aria-hidden className="size-3.5" />
      Sample platform data for this demo — not real Hitswork statistics.
    </p>
  );
}

export function RatingText({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-muted">—</span>;
  return (
    <span className="inline-flex items-center gap-1 font-semibold text-ink">
      <Star aria-hidden className="size-3.5 text-amber-400" fill="currentColor" strokeWidth={0} />
      {rating.toFixed(1)}
    </span>
  );
}

export function PersonCell({
  name,
  sub,
  href,
  photoId,
}: {
  name: string;
  sub: string;
  href?: string;
  photoId?: string;
}) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
  const avatar = photoId ? (
    <img
      src={`https://images.unsplash.com/photo-${photoId}?w=72&h=72&fit=crop&crop=faces&auto=format&q=70`}
      alt=""
      width={36}
      height={36}
      loading="lazy"
      className="size-9 shrink-0 rounded-full bg-brand-50 object-cover"
    />
  ) : (
    <span
      aria-hidden
      className="grid size-9 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-500 to-grape-600 font-display text-xs font-bold text-white"
    >
      {initials}
    </span>
  );
  return (
    <div className="flex min-w-0 items-center gap-3">
      {avatar}
      <div className="min-w-0 leading-tight">
        {href ? (
          <AppLink href={href} className="block truncate font-semibold text-ink hover:text-brand-700">
            {name}
          </AppLink>
        ) : (
          <p className="truncate font-semibold text-ink">{name}</p>
        )}
        <p className="truncate text-xs text-muted">{sub}</p>
      </div>
    </div>
  );
}
