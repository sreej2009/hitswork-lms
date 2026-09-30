import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Order, PaymentMethodId } from '../types';
import { findCoupon } from '../lib/pricing';

interface Toast {
  id: number;
  message: string;
}

interface PlaceOrderInput {
  courseIds: string[];
  original: number;
  discount: number;
  couponCode: string | null;
  couponDiscount: number;
  total: number;
  paymentMethod: PaymentMethodId;
}

interface StoreValue {
  cart: ReadonlySet<string>;
  wishlist: ReadonlySet<string>;
  /** Purchased (or free-enrolled) course ids */
  enrolled: ReadonlySet<string>;
  /** Applied coupon code, if any */
  coupon: string | null;
  orders: readonly Order[];
  toast: Toast | null;
  /** Show a short confirmation message */
  notify: (message: string) => void;
  toggleCart: (id: string, title: string) => void;
  addToCart: (id: string, title: string) => void;
  removeFromCart: (id: string, title: string) => void;
  moveToWishlist: (id: string, title: string) => void;
  moveToCart: (id: string, title: string) => void;
  toggleWishlist: (id: string, title: string) => void;
  enroll: (id: string, title: string) => void;
  /** Adds course access without a toast (sample data, migrations). */
  grantAccess: (ids: string[]) => void;
  /** Returns false for an unknown code */
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  placeOrder: (input: PlaceOrderInput) => Order;
}

const StoreContext = createContext<StoreValue | null>(null);

// ---------------------------------------------------------------------------
// localStorage persistence (demo only — there is no account or backend yet)
// ---------------------------------------------------------------------------

const KEYS = {
  cart: 'hitswork_cart',
  wishlist: 'hitswork_wishlist',
  enrolled: 'hitswork_enrolled',
  coupon: 'hitswork_coupon',
  orders: 'hitswork_orders',
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    // Earlier builds used "hitswork:<name>" keys; read those once so saved carts aren't lost.
    const raw = window.localStorage.getItem(key) ?? window.localStorage.getItem(key.replace('hitswork_', 'hitswork:'));
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (private mode): the app still works for this session.
  }
}

const loadSet = (key: string) => new Set(load<string[]>(key, []));

function without(set: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(set);
  next.delete(id);
  return next;
}

function generateOrderId(date: Date) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O or 1/I
  const suffix = Array.from({ length: 5 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  return `HIT-${date.getFullYear()}-${suffix}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ReadonlySet<string>>(() => loadSet(KEYS.cart));
  const [wishlist, setWishlist] = useState<ReadonlySet<string>>(() => loadSet(KEYS.wishlist));
  const [enrolled, setEnrolled] = useState<ReadonlySet<string>>(() => loadSet(KEYS.enrolled));
  const [coupon, setCoupon] = useState<string | null>(() => load<string | null>(KEYS.coupon, null));
  const [orders, setOrders] = useState<readonly Order[]>(() => load<Order[]>(KEYS.orders, []));
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => save(KEYS.cart, [...cart]), [cart]);
  useEffect(() => save(KEYS.wishlist, [...wishlist]), [wishlist]);
  useEffect(() => save(KEYS.enrolled, [...enrolled]), [enrolled]);
  useEffect(() => save(KEYS.coupon, coupon), [coupon]);
  useEffect(() => save(KEYS.orders, orders), [orders]);

  const notify = useCallback((message: string) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const addToCart = useCallback(
    (id: string, title: string) => {
      notify(`Added “${title}” to your cart`);
      setCart((current) => new Set(current).add(id));
    },
    [notify],
  );

  const removeFromCart = useCallback(
    (id: string, title: string) => {
      notify(`Removed “${title}” from your cart`);
      setCart((current) => without(current, id));
    },
    [notify],
  );

  const toggleCart = useCallback(
    (id: string, title: string) => (cart.has(id) ? removeFromCart(id, title) : addToCart(id, title)),
    [cart, addToCart, removeFromCart],
  );

  const toggleWishlist = useCallback(
    (id: string, title: string) => {
      notify(wishlist.has(id) ? `Removed “${title}” from your wishlist` : `Saved “${title}” to your wishlist`);
      setWishlist((current) => (current.has(id) ? without(current, id) : new Set(current).add(id)));
    },
    [wishlist, notify],
  );

  const moveToWishlist = useCallback(
    (id: string, title: string) => {
      notify(`Moved “${title}” to your wishlist`);
      setCart((current) => without(current, id));
      setWishlist((current) => new Set(current).add(id));
    },
    [notify],
  );

  const moveToCart = useCallback(
    (id: string, title: string) => {
      notify(`Moved “${title}” to your cart`);
      setWishlist((current) => without(current, id));
      setCart((current) => new Set(current).add(id));
    },
    [notify],
  );

  /** Direct enrolment, used for free courses. */
  const enroll = useCallback(
    (id: string, title: string) => {
      notify(`You’re enrolled in “${title}”`);
      setEnrolled((current) => new Set(current).add(id));
      setCart((current) => without(current, id));
    },
    [notify],
  );

  const grantAccess = useCallback((ids: string[]) => {
    setEnrolled((current) => (ids.every((id) => current.has(id)) ? current : new Set([...current, ...ids])));
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const match = findCoupon(code);
    if (match) setCoupon(match.code);
    return match !== null;
  }, []);

  const removeCoupon = useCallback(() => setCoupon(null), []);

  const placeOrder = useCallback((input: PlaceOrderInput) => {
    const now = new Date();
    const order: Order = { id: generateOrderId(now), placedAt: now.toISOString(), ...input };
    setOrders((current) => [order, ...current]);
    setEnrolled((current) => new Set([...current, ...input.courseIds]));
    setCart((current) => new Set([...current].filter((id) => !input.courseIds.includes(id))));
    setWishlist((current) => new Set([...current].filter((id) => !input.courseIds.includes(id))));
    setCoupon(null);
    return order;
  }, []);

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      enrolled,
      coupon,
      orders,
      toast,
      notify,
      toggleCart,
      addToCart,
      removeFromCart,
      moveToWishlist,
      moveToCart,
      toggleWishlist,
      enroll,
      grantAccess,
      applyCoupon,
      removeCoupon,
      placeOrder,
    }),
    [
      cart,
      wishlist,
      enrolled,
      coupon,
      orders,
      toast,
      notify,
      toggleCart,
      addToCart,
      removeFromCart,
      moveToWishlist,
      moveToCart,
      toggleWishlist,
      enroll,
      grantAccess,
      applyCoupon,
      removeCoupon,
      placeOrder,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside <StoreProvider>');
  return context;
}
