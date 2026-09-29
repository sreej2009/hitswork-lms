import type { Course } from '../types';

export interface Coupon {
  code: string;
  /** Short description shown once applied */
  label: string;
  percent: number;
  /** Maximum discount in rupees */
  max: number;
}

/** Demo coupons. There is no backend, so validation happens entirely on the client. */
const coupons: Coupon[] = [{ code: 'HITS20', label: '20% off, up to ₹500', percent: 20, max: 500 }];

export const findCoupon = (code: string | null | undefined): Coupon | null =>
  coupons.find((coupon) => coupon.code === code?.trim().toUpperCase()) ?? null;

export interface PriceSummary {
  /** Sum of list prices */
  original: number;
  /** Sum of sale prices */
  subtotal: number;
  /** Sale discount: original − subtotal */
  discount: number;
  coupon: Coupon | null;
  couponDiscount: number;
  total: number;
  /** discount + couponDiscount */
  savings: number;
}

export function summarize(items: Course[], couponCode: string | null): PriceSummary {
  const original = items.reduce((sum, course) => sum + Math.max(course.originalPrice, course.price), 0);
  const subtotal = items.reduce((sum, course) => sum + course.price, 0);
  const coupon = subtotal > 0 ? findCoupon(couponCode) : null;
  const couponDiscount = coupon ? Math.min(Math.round((subtotal * coupon.percent) / 100), coupon.max) : 0;
  const discount = original - subtotal;
  return {
    original,
    subtotal,
    discount,
    coupon,
    couponDiscount,
    total: subtotal - couponDiscount,
    savings: discount + couponDiscount,
  };
}
