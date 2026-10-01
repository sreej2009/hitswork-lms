import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  BadgeCheck,
  BookOpen,
  Briefcase,
  Camera,
  Code2,
  Download,
  GraduationCap,
  Heart,
  IndianRupee,
  Layers,
  Megaphone,
  Monitor,
  Music,
  PenTool,
  Plus,
  ReceiptText,
  RotateCcw,
  Save,
  Search,
  TrendingUp,
  Users,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';
import { CATEGORY_ICON_KEYS } from '../../data/admin';
import { courses as catalog } from '../../data/courses';
import { RANGE_OPTIONS, buildAnalytics } from '../../data/instructor';
import type { AdminCategory, AdminOrder, AdminSettings, OrderStatus } from '../../types/admin';
import type { AnalyticsRange } from '../../types/instructor';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { cn } from '../../lib/cn';
import { formatCompact, formatNumber, formatPrice, formatPriceCompact, formatRelative } from '../../lib/format';
import { sumPoints } from '../../lib/instructorStats';
import { AdminHeader, ConfirmDialog, SampleNote, StatusPill } from '../../components/admin/AdminChrome';
import { DataTable, RowAction } from '../../components/admin/DataTable';
import { AreaChart } from '../../components/charts/AreaChart';
import { BarChart } from '../../components/charts/BarChart';
import { Panel } from '../../components/instructor/InstructorChrome';
import { MetricCard } from '../../components/instructor/MetricCard';
import { Button } from '../../components/ui/Button';
import { Field, SelectInput, TextArea, TextInput } from '../../components/ui/Form';
import { Modal } from '../../components/ui/Modal';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { SwitchField } from '../../components/ui/Switch';

/* ------------------------------------------------------------------ */
/*  Categories                                                         */
/* ------------------------------------------------------------------ */

const ICONS: Record<string, LucideIcon> = {
  code: Code2,
  briefcase: Briefcase,
  pen: PenTool,
  megaphone: Megaphone,
  camera: Camera,
  music: Music,
  graduation: GraduationCap,
  monitor: Monitor,
  heart: Heart,
  layers: Layers,
};

function CategoryDialog({
  open,
  category,
  onClose,
}: {
  open: boolean;
  category: AdminCategory | null;
  onClose: () => void;
}) {
  const { saveCategory, categories } = useAdmin();
  const { notify } = useStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('layers');
  const [status, setStatus] = useState<AdminCategory['status']>('Active');
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(category?.name ?? '');
    setDescription(category?.description ?? '');
    setIcon(category?.icon ?? 'layers');
    setStatus(category?.status ?? 'Active');
    setTried(false);
  }, [open, category]);

  const duplicate = categories.some((c) => c.id !== category?.id && c.name.toLowerCase() === name.trim().toLowerCase());
  const error =
    name.trim().length < 2
      ? 'Enter a category name'
      : duplicate
        ? 'A category with this name already exists'
        : undefined;

  const save = () => {
    setTried(true);
    if (error) return;
    saveCategory({
      id:
        category?.id ??
        name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-'),
      name: name.trim(),
      description: description.trim(),
      icon,
      status,
    });
    notify(category ? 'Category updated' : 'Category added');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add Category'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>{category ? 'Save Changes' : 'Add Category'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field id="category-name" label="Category Name" error={tried ? error : undefined}>
          <TextInput
            id="category-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            invalid={tried && !!error}
          />
        </Field>
        <Field id="category-description" label="Description" optional>
          <TextArea
            id="category-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-ink">Icon</legend>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_ICON_KEYS.map((key) => {
              const Icon = ICONS[key];
              return (
                <label
                  key={key}
                  className={cn(
                    'grid size-11 cursor-pointer place-items-center rounded-xl ring-1 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100',
                    icon === key ? 'bg-brand-50 text-brand-700 ring-brand-300' : 'text-muted ring-line hover:text-ink',
                  )}
                >
                  <input
                    type="radio"
                    name="category-icon"
                    className="sr-only"
                    checked={icon === key}
                    onChange={() => setIcon(key)}
                    aria-label={key}
                  />
                  <Icon aria-hidden className="size-5" />
                </label>
              );
            })}
          </div>
        </fieldset>
        <Field id="category-status" label="Status">
          <SelectInput
            id="category-status"
            options={['Active', 'Disabled']}
            value={status}
            onChange={(e) => setStatus(e.target.value as AdminCategory['status'])}
          />
        </Field>
      </div>
    </Modal>
  );
}

export function AdminCategoriesPage() {
  usePageMeta('Categories — Hitswork Admin', 'Manage course categories.');
  const { categories, saveCategory, deleteCategory } = useAdmin();
  const { notify } = useStore();
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<AdminCategory | null>(null);

  const stats = useMemo(() => {
    const map = new Map<string, { courses: number; students: number }>();
    for (const c of catalog) {
      const entry = map.get(c.category) ?? { courses: 0, students: 0 };
      entry.courses += 1;
      entry.students += c.students;
      map.set(c.category, entry);
    }
    return map;
  }, []);

  return (
    <>
      <AdminHeader
        title="Course Categories"
        subtitle="Organise the catalog."
        primaryAction={
          <Button
            icon={Plus}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Add Category
          </Button>
        }
      />
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const Icon = ICONS[category.icon] ?? Layers;
          const s = stats.get(category.name) ?? { courses: 0, students: 0 };
          return (
            <li
              key={category.id}
              className={cn(
                'rounded-[20px] border border-line bg-white p-5 shadow-card',
                category.status === 'Disabled' && 'opacity-70',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon aria-hidden className="size-5" />
                </span>
                <StatusPill status={category.status} />
              </div>
              <h2 className="mt-4 text-lg font-bold">{category.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{category.description || 'No description'}</p>
              <p className="mt-3 text-sm text-body">
                <span className="font-semibold text-ink">{s.courses}</span> courses ·{' '}
                <span className="font-semibold text-ink">{formatCompact(s.students)}</span> students
              </p>
              <div className="mt-4 flex flex-wrap gap-1 border-t border-line pt-3">
                <RowAction
                  onClick={() => {
                    setEditing(category);
                    setFormOpen(true);
                  }}
                >
                  Edit
                </RowAction>
                <RowAction
                  onClick={() => {
                    saveCategory({ ...category, status: category.status === 'Active' ? 'Disabled' : 'Active' });
                    notify(`${category.name} ${category.status === 'Active' ? 'disabled' : 'enabled'}`);
                  }}
                >
                  {category.status === 'Active' ? 'Disable' : 'Enable'}
                </RowAction>
                <RowAction tone="danger" onClick={() => setToDelete(category)}>
                  Delete
                </RowAction>
              </div>
            </li>
          );
        })}
      </ul>
      <CategoryDialog open={formOpen} category={editing} onClose={() => setFormOpen(false)} />
      <ConfirmDialog
        open={!!toDelete}
        title={`Delete “${toDelete?.name}”?`}
        description="Courses in this category keep their content but will need a new category."
        confirmLabel="Delete Category"
        tone="danger"
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          deleteCategory(toDelete!.id);
          notify('Category deleted');
          setToDelete(null);
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Orders                                                             */
/* ------------------------------------------------------------------ */

type OrderFilter = 'All' | OrderStatus;
const orderFilters: { value: OrderFilter; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Refunded', label: 'Refunded' },
  { value: 'Failed', label: 'Failed' },
];

export function AdminOrdersPage() {
  usePageMeta('Orders — Hitswork Admin', 'Orders and transactions.');
  const { orders, refundOrder } = useAdmin();
  const { notify } = useStore();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [filter, setFilter] = useState<OrderFilter>('All');
  const [viewing, setViewing] = useState<AdminOrder | null>(null);
  const [refunding, setRefunding] = useState<AdminOrder | null>(null);

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return orders
      .filter((o) => filter === 'All' || o.status === filter)
      .filter((o) => !term || `${o.id} ${o.student} ${o.courses.join(' ')}`.toLowerCase().includes(term));
  }, [orders, filter, query]);

  const paid = orders.filter((o) => o.status === 'Paid');
  const refunded = orders.filter((o) => o.status === 'Refunded');

  const actions = (o: AdminOrder) => (
    <div className="flex justify-end gap-1">
      <RowAction onClick={() => setViewing(o)}>View Order</RowAction>
      {o.status === 'Paid' && (
        <RowAction tone="danger" onClick={() => setRefunding(o)}>
          Refund
        </RowAction>
      )}
    </div>
  );

  return (
    <>
      <AdminHeader
        title="Orders & Transactions"
        subtitle="Purchases across the platform (demo — no payments are processed)."
      />
      <section aria-label="Order metrics" className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Orders" value={formatNumber(orders.length)} icon={ReceiptText} />
        <MetricCard
          index={1}
          label="Revenue"
          value={formatPrice(paid.reduce((s, o) => s + o.amount, 0))}
          icon={IndianRupee}
          tone="bg-emerald-50 text-emerald-600"
        />
        <MetricCard
          index={2}
          label="Refunds"
          value={`${refunded.length} · ${formatPriceCompact(refunded.reduce((s, o) => s + o.amount, 0))}`}
          icon={RotateCcw}
          tone="bg-rose-50 text-rose-600"
        />
        <MetricCard
          index={3}
          label="Pending Payments"
          value={orders.filter((o) => o.status === 'Pending').length}
          icon={WalletCards}
          tone="bg-amber-50 text-amber-600"
        />
      </section>
      <SampleNote />

      <Panel
        className="mt-6"
        title="Orders"
        titleId="orders-title"
        action={<SegmentedControl label="Filter orders" options={orderFilters} value={filter} onChange={setFilter} />}
        flush
      >
        <div className="border-b border-line px-5 pb-4 sm:px-6">
          <div className="relative">
            <label htmlFor="order-search" className="sr-only">
              Search orders
            </label>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-subtle"
            />
            <input
              id="order-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order ID, student or course..."
              className="h-11 w-full rounded-xl border border-line-strong bg-white pr-4 pl-10 text-[15px] text-ink outline-none placeholder:text-subtle focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </div>
        <DataTable
          rows={rows}
          rowKey={(o) => o.id}
          caption="Orders"
          empty={<p className="px-6 py-10 text-center text-sm text-muted">No orders match.</p>}
          columns={[
            {
              key: 'id',
              header: 'Order ID',
              render: (o) => <span className="font-mono text-xs font-semibold text-ink">{o.id}</span>,
            },
            {
              key: 'student',
              header: 'Student',
              render: (o) => <span className="whitespace-nowrap">{o.student}</span>,
            },
            {
              key: 'course',
              header: 'Course',
              className: 'max-w-[16rem]',
              render: (o) => <span className="line-clamp-1">{o.courses.join(', ')}</span>,
            },
            {
              key: 'amount',
              header: 'Amount',
              align: 'right',
              render: (o) => <span className="font-semibold whitespace-nowrap">{formatPrice(o.amount)}</span>,
            },
            { key: 'method', header: 'Payment Method', render: (o) => o.paymentMethod },
            {
              key: 'date',
              header: 'Date',
              render: (o) => <span className="whitespace-nowrap">{formatRelative(o.date)}</span>,
            },
            { key: 'status', header: 'Status', render: (o) => <StatusPill status={o.status} /> },
            { key: 'actions', header: <span className="sr-only">Actions</span>, align: 'right', render: actions },
          ]}
          card={(o) => (
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs font-semibold text-ink">{o.id}</p>
                  <p className="mt-0.5 line-clamp-1 text-sm text-body">{o.courses.join(', ')}</p>
                </div>
                <span className="shrink-0 font-semibold text-ink">{formatPrice(o.amount)}</span>
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
                <StatusPill status={o.status} />
                {o.student} · {o.paymentMethod} · {formatRelative(o.date)}
              </p>
              <div className="mt-2 [&>div]:justify-start">{actions(o)}</div>
            </div>
          )}
        />
      </Panel>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={`Order ${viewing?.id ?? ''}`}>
        {viewing && (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {[
              ['Student', viewing.student],
              ['Email', viewing.studentEmail],
              ['Amount', formatPrice(viewing.amount)],
              ['Payment Method', viewing.paymentMethod],
              ['Date', new Date(viewing.date).toLocaleString('en-IN')],
              ['Status', <StatusPill key="s" status={viewing.status} />],
            ].map(([label, value]) => (
              <div key={String(label)} className="min-w-0">
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="mt-0.5 truncate font-medium text-ink">{value}</dd>
              </div>
            ))}
            <div className="col-span-2">
              <dt className="text-xs text-muted">Courses</dt>
              <dd className="mt-1">
                <ul className="list-disc space-y-0.5 pl-5 text-ink">
                  {viewing.courses.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        )}
      </Modal>
      <ConfirmDialog
        open={!!refunding}
        title="Refund this order?"
        description={
          refunding
            ? `${formatPrice(refunding.amount)} will be returned to ${refunding.student}. Demo only — no money moves.`
            : ''
        }
        confirmLabel="Refund Order"
        tone="danger"
        onClose={() => setRefunding(null)}
        onConfirm={() => {
          refundOrder(refunding!.id);
          notify(`Order ${refunding!.id} refunded`);
          setRefunding(null);
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Reports                                                            */
/* ------------------------------------------------------------------ */

type ReportKey = 'students' | 'courses' | 'instructors' | 'revenue' | 'enrollments' | 'completion';

const REPORTS: {
  key: ReportKey;
  title: string;
  icon: LucideIcon;
  chart: 'area' | 'bar';
  metric: 'students' | 'views' | 'revenue' | 'enrollments' | 'completions';
  scale: number;
  money?: boolean;
}[] = [
  { key: 'students', title: 'Student Growth', icon: Users, chart: 'area', metric: 'students', scale: 9 },
  { key: 'courses', title: 'Course Performance', icon: BookOpen, chart: 'bar', metric: 'views', scale: 6 },
  {
    key: 'instructors',
    title: 'Instructor Performance',
    icon: BadgeCheck,
    chart: 'area',
    metric: 'completions',
    scale: 3,
  },
  { key: 'revenue', title: 'Revenue', icon: IndianRupee, chart: 'bar', metric: 'revenue', scale: 9, money: true },
  { key: 'enrollments', title: 'Enrollments', icon: TrendingUp, chart: 'area', metric: 'enrollments', scale: 9 },
  { key: 'completion', title: 'Completion Rate', icon: GraduationCap, chart: 'bar', metric: 'completions', scale: 9 },
];

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminReportsPage() {
  usePageMeta('Reports — Hitswork Admin', 'Reports and analytics.');
  const { notify } = useStore();
  const [range, setRange] = useState<AnalyticsRange>('30d');

  const series = useMemo(
    () =>
      Object.fromEntries(
        REPORTS.map((r) => {
          const { points } = buildAnalytics(range, r.scale);
          const data = points.map((p) => ({
            label: p.label,
            value:
              r.key === 'completion'
                ? Math.min(100, Math.round((p.completions / Math.max(1, p.enrollments)) * 100 * 2.2))
                : p[r.metric],
          }));
          return [
            r.key,
            {
              data,
              total:
                r.key === 'completion'
                  ? Math.round(data.reduce((s, d) => s + d.value, 0) / data.length)
                  : sumPoints(points, r.metric),
            },
          ];
        }),
      ) as Record<ReportKey, { data: { label: string; value: number }[]; total: number }>,
    [range],
  );

  const exportReport = (key: ReportKey | 'all') => {
    const keys = key === 'all' ? REPORTS.map((r) => r.key) : [key];
    const rows: (string | number)[][] = [['Report', 'Period', 'Value']];
    for (const k of keys) {
      const report = REPORTS.find((r) => r.key === k)!;
      for (const point of series[k].data) rows.push([report.title, point.label, point.value]);
    }
    downloadCsv(`hitswork-${key}-report-${range}.csv`, rows);
    notify('Report exported as CSV');
  };

  return (
    <>
      <AdminHeader
        title="Reports & Analytics"
        subtitle="Sample platform data for this demo."
        primaryAction={
          <Button icon={Download} onClick={() => exportReport('all')}>
            Export Report
          </Button>
        }
      />
      <div id="analytics" className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl label="Date range" options={RANGE_OPTIONS} value={range} onChange={setRange} />
        <SampleNote />
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-2">
        {REPORTS.map((report) => {
          const { data, total } = series[report.key];
          const format = report.money
            ? formatPrice
            : report.key === 'completion'
              ? (v: number) => `${v}%`
              : formatNumber;
          const Icon = report.icon;
          const Chart = report.chart === 'area' ? AreaChart : BarChart;
          return (
            <section
              key={report.key}
              id={report.key}
              aria-labelledby={`report-${report.key}`}
              className="min-w-0 rounded-[20px] border border-line bg-white p-5 shadow-card sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <div>
                    <h2 id={`report-${report.key}`} className="text-base font-bold">
                      {report.title}
                    </h2>
                    <p className="font-display text-xl font-extrabold text-ink">
                      {report.key === 'completion' ? `${total}%` : format(total)}
                    </p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" icon={Download} onClick={() => exportReport(report.key)}>
                  CSV
                </Button>
              </div>
              <Chart
                key={`${report.key}-${range}`}
                className="mt-5"
                data={data}
                format={format}
                formatTick={
                  report.money
                    ? formatPriceCompact
                    : report.key === 'completion'
                      ? (v: number) => `${Math.round(v)}%`
                      : (v: number) => formatCompact(Math.round(v))
                }
                seriesName={report.title}
                label={`${report.title} per period (sample data)`}
              />
            </section>
          );
        })}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Settings                                                           */
/* ------------------------------------------------------------------ */

export function AdminSettingsPage() {
  usePageMeta('Settings — Hitswork Admin', 'Platform settings.');
  const { admin, updateSettings } = useAdmin();
  const { notify } = useStore();
  const [draft, setDraft] = useState<AdminSettings>(admin.settings);
  const dirty = JSON.stringify(draft) !== JSON.stringify(admin.settings);
  const set = (patch: Partial<AdminSettings>) => setDraft((d) => ({ ...d, ...patch }));
  const nameError = draft.platformName.trim().length < 2 ? 'Enter a platform name' : undefined;

  const toggles: { section: string; items: { key: keyof AdminSettings; label: string; description: string }[] }[] = [
    {
      section: 'Course Settings',
      items: [
        {
          key: 'requireCourseApproval',
          label: 'Require Course Approval',
          description: 'New and updated courses wait for admin review before going live.',
        },
        { key: 'enableReviews', label: 'Enable Reviews', description: 'Learners can rate and review courses.' },
        {
          key: 'enableCertificates',
          label: 'Enable Certificates',
          description: 'Issue certificates when learners complete a course.',
        },
      ],
    },
    {
      section: 'User Settings',
      items: [
        {
          key: 'allowStudentRegistration',
          label: 'Allow Student Registration',
          description: 'New learners can create accounts.',
        },
        {
          key: 'allowInstructorApplications',
          label: 'Allow Instructor Applications',
          description: 'People can apply to teach.',
        },
      ],
    },
    {
      section: 'Notification Settings',
      items: [
        {
          key: 'notifyCourseSubmitted',
          label: 'New Course Submitted',
          description: 'Notify admins when a course is submitted for review.',
        },
        {
          key: 'notifyInstructorApplication',
          label: 'New Instructor Application',
          description: 'Notify admins about new applications.',
        },
        { key: 'notifyNewOrder', label: 'New Order', description: 'Notify admins about every new order.' },
        {
          key: 'notifyRefundRequest',
          label: 'Refund Request',
          description: 'Notify admins when a learner requests a refund.',
        },
      ],
    },
  ];

  return (
    <>
      <AdminHeader
        title="Settings"
        subtitle="Platform-wide configuration."
        primaryAction={
          <Button
            icon={Save}
            disabled={!dirty || !!nameError}
            onClick={() => {
              updateSettings({ ...draft, platformName: draft.platformName.trim() });
              notify('Settings saved');
            }}
          >
            Save Settings
          </Button>
        }
      />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-2">
        <Panel title="Platform Settings" titleId="platform-settings">
          <div className="space-y-4">
            <Field id="platform-name" label="Platform Name" error={nameError}>
              <TextInput
                id="platform-name"
                value={draft.platformName}
                onChange={(e) => set({ platformName: e.target.value })}
                invalid={!!nameError}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="platform-currency" label="Default Currency">
                <SelectInput
                  id="platform-currency"
                  options={['INR']}
                  value={draft.currency}
                  onChange={() => undefined}
                />
              </Field>
              <Field id="platform-language" label="Default Language">
                <SelectInput
                  id="platform-language"
                  options={['English', 'Tamil', 'Hindi']}
                  value={draft.language}
                  onChange={(e) => set({ language: e.target.value })}
                />
              </Field>
            </div>
          </div>
        </Panel>
        {toggles.map((group) => (
          <Panel key={group.section} title={group.section} titleId={group.section.replace(/\s+/g, '-').toLowerCase()}>
            <div className="space-y-5">
              {group.items.map((item) => (
                <SwitchField
                  key={item.key}
                  label={item.label}
                  description={item.description}
                  checked={draft[item.key] as boolean}
                  onChange={(checked) => set({ [item.key]: checked } as Partial<AdminSettings>)}
                />
              ))}
            </div>
          </Panel>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted" aria-live="polite">
        {dirty ? 'You have unsaved changes.' : 'All changes saved.'}
      </p>
    </>
  );
}
