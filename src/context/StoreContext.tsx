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
import { normaliseEmail } from '../lib/auth';
import { takePendingIntent } from '../lib/pendingIntent';
import { useAuth } from './AuthContext';

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
  /** The signed-in account's saved courses (empty for guests) */
  wishlist: ReadonlySet<string>;
  /** Purchased (or free-enrolled) course ids — empty for guests, so they always see "Enroll Now" */
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
  toggleWishlist: (id: string) => void;
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

const EMPTY: ReadonlySet<string> = new Set();

/** Each account has its own wishlist: hitswork_wishlist:<email>. */
const wishlistKey = (email: string) => `${KEYS.wishlist}:${email}`;

function loadWishlist(email: string): Set<string> {
  try {
    const own = window.localStorage.getItem(wishlistKey(email));
    if (own) return new Set(JSON.parse(own) as string[]);
    // Earlier builds kept one shared wishlist; hand it to the first account that signs in.
    const legacy = window.localStorage.getItem(KEYS.wishlist);
    window.localStorage.removeItem(KEYS.wishlist);
    return new Set(legacy ? (JSON.parse(legacy) as string[]) : []);
  } catch {
    return new Set();
  }
}

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
  const { user } = useAuth();
  const email = user ? normaliseEmail(user.email) : null;
  const [cart, setCart] = useState<ReadonlySet<string>>(() => loadSet(KEYS.cart));
  const [wishlistState, setWishlistState] = useState<{ email: string | null; ids: ReadonlySet<string> }>(() => ({
    email,
    ids: email ? loadWishlist(email) : EMPTY,
  }));
  const [ownedEnrolled, setEnrolled] = useState<ReadonlySet<string>>(() => loadSet(KEYS.enrolled));
  const [coupon, setCoupon] = useState<string | null>(() => load<string | null>(KEYS.coupon, null));
  const [orders, setOrders] = useState<readonly Order[]>(() => load<Order[]>(KEYS.orders, []));
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<number | undefined>(undefined);

  // Switch wishlists when the signed-in account changes (sign in, sign out, another account).
  if (wishlistState.email !== email) setWishlistState({ email, ids: email ? loadWishlist(email) : EMPTY });
  const wishlist = wishlistState.email === email ? wishlistState.ids : EMPTY;
  const setWishlist = useCallback(
    (update: (current: ReadonlySet<string>) => ReadonlySet<string>) =>
      setWishlistState((state) => (state.email ? { ...state, ids: update(state.ids) } : state)),
    [],
  );
  // Guests don't own courses; only a signed-in learner sees "Start Learning".
  const enrolled = email ? ownedEnrolled : EMPTY;

  useEffect(() => save(KEYS.cart, [...cart]), [cart]);
  useEffect(() => {
    if (wishlistState.email) save(wishlistKey(wishlistState.email), [...wishlistState.ids]);
  }, [wishlistState]);
  useEffect(() => save(KEYS.enrolled, [...ownedEnrolled]), [ownedEnrolled]);
  useEffect(() => save(KEYS.coupon, coupon), [coupon]);
  useEffect(() => save(KEYS.orders, orders), [orders]);

  const notify = useCallback((message: string) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const addToCart = useCallback(
    (id: string, title: string) => {
      if (enrolled.has(id)) {
        notify('You’re already enrolled in this course.');
        return;
      }
      notify(`Added “${title}” to your cart`);
      setCart((current) => new Set(current).add(id));
    },
    [notify, enrolled],
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

  /** Requires a signed-in account — UI gates this with useAuthGate first. */
  const toggleWishlist = useCallback(
    (id: string) => {
      if (!email) return;
      notify(wishlist.has(id) ? 'Removed from wishlist' : 'Added to wishlist');
      setWishlist((current) => (current.has(id) ? without(current, id) : new Set(current).add(id)));
    },
    [email, wishlist, notify, setWishlist],
  );

  const moveToWishlist = useCallback(
    (id: string, title: string) => {
      if (!email) return;
      notify(`Moved “${title}” to your wishlist`);
      setCart((current) => without(current, id));
      setWishlist((current) => new Set(current).add(id));
    },
    [email, notify, setWishlist],
  );

  const moveToCart = useCallback(
    (id: string, title: string) => {
      notify(`Moved “${title}” to your cart`);
      setWishlist((current) => without(current, id));
      setCart((current) => new Set(current).add(id));
    },
    [notify, setWishlist],
  );

  // Replay a guest's "save to wishlist" once they have signed in.
  useEffect(() => {
    if (!email) return;
    const intent = takePendingIntent();
    if (intent?.type !== 'wishlist') return;
    setWishlist((current) => new Set(current).add(intent.courseId));
    notify('Added to wishlist');
  }, [email, notify, setWishlist]);

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
  }, [setWishlist]);

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
