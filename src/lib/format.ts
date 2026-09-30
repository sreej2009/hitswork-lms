const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const grouped = new Intl.NumberFormat('en-US');
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const shortDate = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

/** 125000 → "125K" */
export const formatCompact = (value: number) => compact.format(value);

/** 165823 → "165,823" */
export const formatNumber = (value: number) => grouped.format(value);

/** 6999 → "₹6,999" */
export const formatPrice = (value: number) => currency.format(value);

/** 85 → "1h 25m", 45 → "45m", 120 → "2h" */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (!h) return `${m}m`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/** "2026-09-12" → "12 Sept 2026" */
export const formatDate = (iso: string) => shortDate.format(new Date(`${iso}T00:00:00`));

/** "2026-09" → "September 2026" */
export const formatMonth = (isoMonth: string) => monthYear.format(new Date(`${isoMonth}-01T00:00:00`));

/** Percentage saved, rounded down so it never overstates the discount. */
export const discountPercent = (price: number, originalPrice: number) =>
  originalPrice > price && price > 0 ? Math.floor((1 - price / originalPrice) * 100) : 0;

const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/** "2026-09-30T08:00:00Z" → "2 hours ago", "yesterday", "3 weeks ago" */
export function formatRelative(iso: string, now = Date.now()): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return 'just now';
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['minute', 60],
    ['hour', 3600],
    ['day', 86400],
    ['week', 604800],
    ['month', 2629800],
    ['year', 31557600],
  ];
  let unit: [Intl.RelativeTimeFormatUnit, number] = units[0];
  for (const candidate of units) if (abs >= candidate[1]) unit = candidate;
  return relative.format(Math.round(seconds / unit[1]), unit[0]);
}

/** 725 → "12:05", 4365 → "1:12:45" */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${String(m).padStart(2, '0')}:${sec}`;
}
