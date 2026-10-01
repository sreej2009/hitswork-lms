import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Clapperboard,
  GraduationCap,
  IndianRupee,
  LayoutDashboard,
  Plus,
  Send,
  Settings,
  Star,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react';
import type { InstructorNotificationKind } from '../../types/instructor';
import { useInstructor } from '../../context/InstructorContext';
import { cn } from '../../lib/cn';
import { NotificationsDropdown, type DropdownNotification } from '../layout/NotificationsMenu';
import { UserMenu, type MenuLink } from '../layout/UserMenu';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { SidebarNav, type ShellSidebarProps, type SidebarGroup } from '../dashboard/SidebarNav';
import { Button } from '../ui/Button';

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */

export function InstructorSidebar(props: ShellSidebarProps) {
  const { courses } = useInstructor();
  const groups: SidebarGroup[] = [
    {
      items: [
        { label: 'Overview', href: '/instructor', icon: LayoutDashboard, end: true },
        { label: 'My Courses', href: '/instructor/courses', icon: BookOpen, count: courses.length },
        { label: 'Students', href: '/instructor/students', icon: Users },
        { label: 'Analytics', href: '/instructor/analytics', icon: BarChart3 },
        { label: 'Earnings', href: '/instructor/earnings', icon: Wallet },
      ],
    },
    {
      label: 'Create',
      items: [{ label: 'Create New Course', href: '/instructor/course/create', icon: Plus, highlight: true }],
    },
    {
      label: 'Account',
      items: [
        { label: 'Instructor Profile', href: '/instructor/profile', icon: UserRound },
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ];
  return (
    <SidebarNav
      label="Instructor"
      groups={groups}
      footerItems={[{ label: 'Back to Learning', href: '/dashboard', icon: ArrowLeft }]}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

const instructorMenuLinks: MenuLink[] = [
  { label: 'Instructor Dashboard', href: '/instructor', icon: LayoutDashboard },
  { label: 'Instructor Profile', href: '/instructor/profile', icon: UserRound },
  { label: 'Earnings', href: '/instructor/earnings', icon: IndianRupee },
  { label: 'Back to Learning', href: '/dashboard', icon: GraduationCap },
];

const notificationStyles: Record<InstructorNotificationKind, Pick<DropdownNotification, 'icon' | 'iconClass'>> = {
  enrollment: { icon: Users, iconClass: 'bg-indigo-50 text-indigo-600' },
  review: { icon: Star, iconClass: 'bg-amber-50 text-amber-600' },
  approved: { icon: BadgeCheck, iconClass: 'bg-emerald-50 text-emerald-600' },
  earnings: { icon: IndianRupee, iconClass: 'bg-violet-50 text-violet-600' },
  submitted: { icon: Send, iconClass: 'bg-sky-50 text-sky-600' },
};

export function InstructorNotificationsMenu() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useInstructor();
  const navigate = useNavigate();
  return (
    <NotificationsDropdown
      items={notifications.map((n) => ({ ...n, ...notificationStyles[n.kind] }))}
      onOpen={(id) => {
        const notification = notifications.find((n) => n.id === id);
        markNotificationRead(id);
        if (notification?.href) navigate(notification.href);
      }}
      onMarkAllRead={markAllNotificationsRead}
    />
  );
}

export function CreateCourseButton({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' }) {
  return (
    <Button href="/instructor/course/create" icon={Plus} size={size} className={className}>
      Create New Course
    </Button>
  );
}

interface InstructorHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  primaryAction?: ReactNode;
}

/** Page header for the instructor area: title, instructor notifications and account menu. */
export function InstructorHeader(props: InstructorHeaderProps) {
  return (
    <DashboardHeader
      {...props}
      notifications={<InstructorNotificationsMenu />}
      userMenu={<UserMenu compact links={instructorMenuLinks} />}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Shared building blocks                                             */
/* ------------------------------------------------------------------ */

/** "Sample data" marker so demo figures are never mistaken for real ones. */
export function DemoDataBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-100',
        className,
      )}
    >
      <Clapperboard aria-hidden className="size-3.5" strokeWidth={2} />
      Sample data
    </span>
  );
}

interface PanelProps {
  title?: ReactNode;
  /** Id for the heading, used as the section's accessible name */
  titleId?: string;
  description?: ReactNode;
  /** Right side of the header row: filters, "View all" link… */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Remove body padding, e.g. for edge-to-edge tables */
  flush?: boolean;
}

/** White card section used across the instructor pages. */
export function Panel({ title, titleId, description, action, children, className, flush = false }: PanelProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn('min-w-0 rounded-[20px] border border-line bg-white shadow-card', className)}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="min-w-0">
            {title && (
              <h2 id={titleId} className="text-lg font-bold tracking-[-0.01em]">
                {title}
              </h2>
            )}
            {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={flush ? (title || action ? 'mt-4' : undefined) : 'p-5 sm:p-6'}>{children}</div>
    </section>
  );
}
