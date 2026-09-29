import type { AccentKey } from '../types';

interface AccentStyle {
  /** Pastel surface for icon tiles */
  soft: string;
  /** Foreground colour on soft surfaces */
  text: string;
  /** Saturated gradient for emphasised tiles */
  gradient: string;
  /** Very light wash used behind large cards */
  wash: string;
  /** Border tint on hover */
  border: string;
}

// Class strings are written out in full so Tailwind can detect them.
export const accents: Record<AccentKey, AccentStyle> = {
  blue: {
    soft: 'bg-blue-50',
    text: 'text-blue-600',
    gradient: 'bg-linear-to-br from-blue-500 to-indigo-500',
    wash: 'from-blue-50/90',
    border: 'group-hover:border-blue-200',
  },
  green: {
    soft: 'bg-emerald-50',
    text: 'text-emerald-600',
    gradient: 'bg-linear-to-br from-emerald-500 to-teal-500',
    wash: 'from-emerald-50/90',
    border: 'group-hover:border-emerald-200',
  },
  pink: {
    soft: 'bg-pink-50',
    text: 'text-pink-600',
    gradient: 'bg-linear-to-br from-pink-500 to-fuchsia-500',
    wash: 'from-pink-50/90',
    border: 'group-hover:border-pink-200',
  },
  orange: {
    soft: 'bg-orange-50',
    text: 'text-orange-600',
    gradient: 'bg-linear-to-br from-orange-400 to-rose-500',
    wash: 'from-orange-50/90',
    border: 'group-hover:border-orange-200',
  },
  purple: {
    soft: 'bg-violet-50',
    text: 'text-violet-600',
    gradient: 'bg-linear-to-br from-violet-500 to-purple-500',
    wash: 'from-violet-50/90',
    border: 'group-hover:border-violet-200',
  },
  cyan: {
    soft: 'bg-cyan-50',
    text: 'text-cyan-600',
    gradient: 'bg-linear-to-br from-cyan-500 to-sky-500',
    wash: 'from-cyan-50/90',
    border: 'group-hover:border-cyan-200',
  },
  indigo: {
    soft: 'bg-indigo-50',
    text: 'text-indigo-600',
    gradient: 'bg-linear-to-br from-indigo-500 to-violet-500',
    wash: 'from-indigo-50/90',
    border: 'group-hover:border-indigo-200',
  },
  teal: {
    soft: 'bg-teal-50',
    text: 'text-teal-600',
    gradient: 'bg-linear-to-br from-teal-500 to-emerald-500',
    wash: 'from-teal-50/90',
    border: 'group-hover:border-teal-200',
  },
  rose: {
    soft: 'bg-rose-50',
    text: 'text-rose-600',
    gradient: 'bg-linear-to-br from-rose-500 to-pink-500',
    wash: 'from-rose-50/90',
    border: 'group-hover:border-rose-200',
  },
};
