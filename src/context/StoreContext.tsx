import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

interface Toast {
  id: number;
  message: string;
}

interface StoreValue {
  cart: ReadonlySet<string>;
  wishlist: ReadonlySet<string>;
  toast: Toast | null;
  toggleCart: (id: string, title: string) => void;
  toggleWishlist: (id: string, title: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function toggle(set: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(set);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ReadonlySet<string>>(() => new Set());
  const [wishlist, setWishlist] = useState<ReadonlySet<string>>(() => new Set());
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const notify = useCallback((message: string) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const toggleCart = useCallback(
    (id: string, title: string) => {
      notify(cart.has(id) ? `Removed “${title}” from your cart` : `Added “${title}” to your cart`);
      setCart((current) => toggle(current, id));
    },
    [cart, notify],
  );

  const toggleWishlist = useCallback(
    (id: string, title: string) => {
      notify(wishlist.has(id) ? `Removed “${title}” from your wishlist` : `Saved “${title}” to your wishlist`);
      setWishlist((current) => toggle(current, id));
    },
    [wishlist, notify],
  );

  const value = useMemo(
    () => ({ cart, wishlist, toast, toggleCart, toggleWishlist }),
    [cart, wishlist, toast, toggleCart, toggleWishlist],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used inside <StoreProvider>');
  return context;
}
