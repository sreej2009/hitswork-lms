import { useMemo, useRef, useState } from 'react';
import { CalendarClock, CalendarDays, Landmark, PiggyBank, Smartphone, TrendingUp, Wallet } from 'lucide-react';
import { earningsByMonth, earningsSummary, instructorTransactions } from '../../data/instructor';
import type { EarningStatus } from '../../types/instructor';
import { useInstructor } from '../../context/InstructorContext';
import { useStore } from '../../context/StoreContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { cn } from '../../lib/cn';
import { formatChange, formatDate, formatPrice, formatPriceCompact } from '../../lib/format';
import { BarChart } from '../../components/charts/BarChart';
import { DemoDataBadge, InstructorHeader, Panel } from '../../components/instructor/InstructorChrome';
import { MetricCard } from '../../components/instructor/MetricCard';
import { PayoutDialog } from '../../components/instructor/PayoutDialog';
import { Button } from '../../components/ui/Button';
import { SegmentedControl } from '../../components/ui/SegmentedControl';

const statusStyles: Record<EarningStatus, string> = {
  Completed: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Pending: 'bg-amber-50 text-amber-800 ring-amber-100',
  Refunded: 'bg-rose-50 text-rose-700 ring-rose-100',
};

function EarningBadge({ status }: { status: EarningStatus }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ring-1',
        statusStyles[status],
      )}
    >
      {status}
    </span>
  );
}

type TxFilter = 'All' | EarningStatus;
const txFilters: { value: TxFilter; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Refunded', label: 'Refunded' },
];

export function InstructorEarningsPage() {
  usePageMeta('Earnings — Hitswork Instructor', 'Revenue, balances, transactions and payout settings.');
  const { instructor, courses, updatePayout } = useInstructor();
  const { notify } = useStore();
  const [filter, setFilter] = useState<TxFilter>('All');
  const [payoutOpen, setPayoutOpen] = useState(false);
  const payoutButtonRef = useRef<HTMLButtonElement>(null);
  const months = useMemo(() => earningsByMonth(), []);
  const courseTitle = (id: string) => courses.find((c) => c.id === id)?.title ?? 'Deleted course';
  const transactions = instructorTransactions.filter((tx) => filter === 'All' || tx.status === filter);
  const monthChange =
    ((earningsSummary.thisMonth - earningsSummary.previousMonth) / earningsSummary.previousMonth) * 100;
  const payout = instructor?.payout;

  return (
    <>
      <InstructorHeader
        title="Earnings"
        subtitle={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            Your revenue, balance and payouts.
            <DemoDataBadge />
          </span>
        }
      />

      <section
        aria-label="Balances"
        className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]"
      >
        <div className="relative isolate overflow-hidden rounded-[20px] bg-brand-gradient p-6 text-white shadow-brand">
          <div aria-hidden className="absolute -top-16 -right-10 -z-10 size-48 rounded-full bg-white/15 blur-2xl" />
          <p className="flex items-center gap-2 text-sm font-medium text-white/80">
            <Wallet aria-hidden className="size-4" />
            Total Earnings
          </p>
          <p className="mt-3 font-display text-[2.25rem] leading-none font-extrabold tracking-[-0.03em] sm:text-[2.75rem]">
            {formatPrice(earningsSummary.total)}
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
            <TrendingUp aria-hidden className="size-3.5" />
            {formatChange(18.6)} in the last 30 days
          </p>
        </div>
        <MetricCard
          label="Available Balance"
          value={formatPrice(earningsSummary.available)}
          icon={PiggyBank}
          tone="bg-emerald-50 text-emerald-600"
          caption="ready to pay out"
        />
        <MetricCard
          index={1}
          label="Pending"
          value={formatPrice(earningsSummary.pending)}
          icon={CalendarClock}
          tone="bg-amber-50 text-amber-600"
          caption="clears after the refund window"
        />
      </section>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <Panel
          title="Monthly Earnings"
          titleId="earnings-chart-title"
          description="Your share of sales, last 12 months"
        >
          <BarChart
            data={months}
            format={formatPrice}
            formatTick={formatPriceCompact}
            seriesName="Earnings"
            highlightLast
            label="Monthly earnings for the last 12 months (sample data)"
          />
        </Panel>

        <div className="grid gap-4 min-[480px]:grid-cols-3 xl:grid-cols-1">
          {[
            {
              label: 'This Month',
              value: earningsSummary.thisMonth,
              note: `${formatChange(monthChange)} vs last month`,
              icon: CalendarDays,
            },
            { label: 'Previous Month', value: earningsSummary.previousMonth, note: 'Paid out', icon: CalendarClock },
            { label: 'Total Earnings', value: earningsSummary.total, note: 'Since you started teaching', icon: Wallet },
          ].map(({ label, value, note, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-[20px] border border-line bg-white p-4 shadow-card"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon aria-hidden className="size-5" strokeWidth={1.9} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted">{label}</p>
                <p className="truncate font-display text-lg font-extrabold text-ink">{formatPrice(value)}</p>
                <p className="truncate text-xs text-subtle">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <Panel
          title="Transactions"
          titleId="transactions-title"
          description="Your share per enrollment, after platform fees"
          action={
            <SegmentedControl label="Filter transactions" options={txFilters} value={filter} onChange={setFilter} />
          }
          flush
        >
          <table className="hidden w-full text-left text-sm md:table">
            <thead>
              <tr className="border-b border-line text-xs text-muted">
                <th scope="col" className="py-3 pr-3 pl-6 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Course
                </th>
                <th scope="col" className="px-3 py-3 font-medium">
                  Student
                </th>
                <th scope="col" className="px-3 py-3 text-right font-medium">
                  Amount
                </th>
                <th scope="col" className="py-3 pr-6 pl-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-line last:border-b-0">
                  <td className="py-3 pr-3 pl-6 whitespace-nowrap text-muted">{formatDate(tx.date)}</td>
                  <td className="max-w-[16rem] px-3 py-3">
                    <span className="line-clamp-1 text-ink">{courseTitle(tx.courseId)}</span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-body">{tx.student}</td>
                  <td
                    className={cn(
                      'px-3 py-3 text-right font-semibold whitespace-nowrap tabular-nums',
                      tx.status === 'Refunded' ? 'text-muted line-through' : 'text-ink',
                    )}
                  >
                    {formatPrice(tx.amount)}
                  </td>
                  <td className="py-3 pr-6 pl-3">
                    <EarningBadge status={tx.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="divide-y divide-line md:hidden">
            {transactions.map((tx) => (
              <li key={tx.id} className="flex items-start justify-between gap-4 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{courseTitle(tx.courseId)}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {tx.student} · {formatDate(tx.date)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span
                    className={cn(
                      'text-sm font-semibold tabular-nums',
                      tx.status === 'Refunded' ? 'text-muted line-through' : 'text-ink',
                    )}
                  >
                    {formatPrice(tx.amount)}
                  </span>
                  <EarningBadge status={tx.status} />
                </div>
              </li>
            ))}
          </ul>
          {transactions.length === 0 && <p className="px-6 py-10 text-center text-sm text-muted">No transactions.</p>}
        </Panel>

        <Panel
          title="Payout Settings"
          titleId="payout-settings-title"
          description="Where your earnings are paid each month"
          className="self-start"
        >
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">Payment method</p>
          {payout && (
            <div className="mt-3 flex items-center gap-3.5 rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-xs ring-1 ring-line">
                {payout.method === 'bank' ? (
                  <Landmark aria-hidden className="size-5" />
                ) : (
                  <Smartphone aria-hidden className="size-5" />
                )}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-ink">{payout.method === 'bank' ? 'Bank Account' : 'UPI'}</p>
                <p className="truncate text-sm text-muted">
                  {payout.method === 'bank'
                    ? `${payout.accountName} · •••• ${payout.bankLast4 || '----'}`
                    : payout.upiId}
                </p>
              </div>
            </div>
          )}
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Schedule</dt>
              <dd className="font-medium text-ink">Monthly, on the 5th</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Minimum payout</dt>
              <dd className="font-medium text-ink">{formatPrice(1000)}</dd>
            </div>
          </dl>
          <Button
            ref={payoutButtonRef}
            variant="secondary"
            fullWidth
            className="mt-5"
            onClick={() => setPayoutOpen(true)}
          >
            Manage Payout Settings
          </Button>
        </Panel>
      </div>

      {payout && (
        <PayoutDialog
          open={payoutOpen}
          settings={payout}
          returnFocusRef={payoutButtonRef}
          onClose={() => setPayoutOpen(false)}
          onSave={(settings) => {
            updatePayout(settings);
            setPayoutOpen(false);
            notify('Payout settings saved');
          }}
        />
      )}
    </>
  );
}
