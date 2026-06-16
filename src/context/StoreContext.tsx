"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

export interface CartLine {
  handle: string;
  title: string;
  price: number;
  image: string;
  size: string;
  color: string;
  qty: number;
}

const CART_KEY = "miyaabi_cart";
const WISH_KEY = "miyaabi_wishlist";

interface StoreState {
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  cartOpen: boolean;
  menuOpen: boolean;
  searchOpen: boolean;
  wishlist: string[];
  addToCart: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  removeFromCart: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  clearCart: () => void;
  setCartOpen: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  toggleWishlist: (handle: string) => void;
  inWishlist: (handle: string) => boolean;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      if (c) setCart(JSON.parse(c));
      const w = localStorage.getItem(WISH_KEY);
      if (w) setWishlist(JSON.parse(w));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist
  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = useCallback(
    (line: Omit<CartLine, "qty"> & { qty?: number }) => {
      const qty = line.qty ?? 1;
      setCart((prev) => {
        const idx = prev.findIndex(
          (l) =>
            l.handle === line.handle &&
            l.size === line.size &&
            l.color === line.color
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [...prev, { ...line, qty }];
      });
      setCartOpen(true);
    },
    []
  );

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateQty = useCallback((index: number, qty: number) => {
    setCart((prev) =>
      prev
        .map((l, i) => (i === index ? { ...l, qty: Math.max(0, qty) } : l))
        .filter((l) => l.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((handle: string) => {
    setWishlist((prev) =>
      prev.includes(handle) ? prev.filter((h) => h !== handle) : [...prev, handle]
    );
  }, []);

  const inWishlist = useCallback(
    (handle: string) => wishlist.includes(handle),
    [wishlist]
  );

  const cartCount = cart.reduce((n, l) => n + l.qty, 0);
  const cartTotal = cart.reduce((n, l) => n + l.qty * l.price, 0);

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        cartOpen,
        menuOpen,
        searchOpen,
        wishlist,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        setCartOpen,
        setMenuOpen,
        setSearchOpen,
        toggleWishlist,
        inWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
