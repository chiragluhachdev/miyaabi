"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
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

interface StoreState {
  cart: CartLine[];
  cartCount: number;
  cartTotal: number;
  cartOpen: boolean;
  menuOpen: boolean;
  searchOpen: boolean;
  addToCart: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  removeFromCart: (index: number) => void;
  updateQty: (index: number, qty: number) => void;
  setCartOpen: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

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
        addToCart,
        removeFromCart,
        updateQty,
        setCartOpen,
        setMenuOpen,
        setSearchOpen,
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
