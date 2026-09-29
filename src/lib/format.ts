const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const grouped = new Intl.NumberFormat('en-US');
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/** 125000 → "125K" */
export const formatCompact = (value: number) => compact.format(value);

/** 165823 → "165,823" */
export const formatNumber = (value: number) => grouped.format(value);

/** 84.99 → "$84.99" */
export const formatPrice = (value: number) => currency.format(value);
