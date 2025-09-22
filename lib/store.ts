'use client';

import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

// Product Type 
export interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  image: string;
  sizes: string[];
  colors: string[];
  category: string;
  description: string;
  inStock: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface WishlistItem {
  product: Product;
}

interface StoreState {
  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartItemQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;

  // UI State
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Filters
  filters: {
    brands: string[];
    categories: string[];
    priceRange: [number, number];
    sizes: string[];
    colors: string[];
    inStock: boolean;
    sortBy: string;
  };
  updateFilters: (filters: Partial<StoreState['filters']>) => void;
  clearFilters: () => void;
}

// ---------- Helpers ----------
const isServer = typeof window === 'undefined';

// Provide a safe storage that only touches localStorage in the browser.
// On the server, we return a no-op storage so build/SSG never sees window.
const safeStorage: StateStorage =
  !isServer
    ? {
        getItem: (name) => window.localStorage.getItem(name),
        setItem: (name, value) => window.localStorage.setItem(name, value),
        removeItem: (name) => window.localStorage.removeItem(name),
      }
    : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      };

function computeTotals(items: CartItem[]) {
  const cartTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { cartTotal, cartCount };
}

// ---------- Store ----------
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart state
      cartItems: [],
      cartTotal: 0,
      cartCount: 0,

      addToCart: (product, size, color, quantity = 1) => {
        const cartItems = get().cartItems;
        const existing = cartItems.find(
          (i) => i.product._id === product._id && i.size === size && i.color === color
        );

        let next: CartItem[];
        if (existing) {
          next = cartItems.map((i) =>
            i.product._id === product._id && i.size === size && i.color === color
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        } else {
          next = [...cartItems, { product, quantity, size, color }];
        }

        const { cartTotal, cartCount } = computeTotals(next);
        set({ cartItems: next, cartTotal, cartCount });
      },

      removeFromCart: (productId, size, color) => {
        const next = get().cartItems.filter(
          (i) => !(i.product._id === productId && i.size === size && i.color === color)
        );
        const { cartTotal, cartCount } = computeTotals(next);
        set({ cartItems: next, cartTotal, cartCount });
      },

      updateCartItemQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, size, color);
          return;
        }
        const next = get().cartItems.map((i) =>
          i.product._id === productId && i.size === size && i.color === color
            ? { ...i, quantity }
            : i
        );
        const { cartTotal, cartCount } = computeTotals(next);
        set({ cartItems: next, cartTotal, cartCount });
      },

      clearCart: () => {
        set({ cartItems: [], cartTotal: 0, cartCount: 0 });
      },

      // Wishlist
      wishlistItems: [],
      addToWishlist: (product) => {
        const wishlistItems = get().wishlistItems;
        if (!wishlistItems.some((w) => w.product._id === product._id)) {
          set({ wishlistItems: [...wishlistItems, { product }] });
        }
      },
      removeFromWishlist: (productId) => {
        set({
          wishlistItems: get().wishlistItems.filter((w) => w.product._id !== productId),
        });
      },
      clearWishlist: () => set({ wishlistItems: [] }),
      isInWishlist: (productId) => get().wishlistItems.some((w) => w.product._id === productId),

      // UI state
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      isWishlistOpen: false,
      setWishlistOpen: (open) => set({ isWishlistOpen: open }),
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

      // Filters
      filters: {
        brands: [],
        categories: [],
        priceRange: [0, 5000],
        sizes: [],
        colors: [],
        inStock: false,
        sortBy: 'featured',
      },
      updateFilters: (newFilters) => set({ filters: { ...get().filters, ...newFilters } }),
      clearFilters: () =>
        set({
          filters: {
            brands: [],
            categories: [],
            priceRange: [0, 5000],
            sizes: [],
            colors: [],
            inStock: false,
            sortBy: 'featured',
          },
        }),
    }),
    {
      name: 'letlapa-store',
      // JSON wrapper around the safe storage (browser uses localStorage; server is no-op)
      storage: createJSONStorage(() => safeStorage),
      // Avoid trying to use persisted values on the server; rehydrate on client
      skipHydration: isServer,
      // Recompute totals after hydration so UI shows correct values
      onRehydrateStorage: () => (state) => {
        // state is the rehydrated partial StoreState
        if (!state) return;
        const nextItems = state.cartItems ?? [];
        const { cartTotal, cartCount } = computeTotals(nextItems);
        // we can safely call set here—closure still has access
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        (useStore as any).setState?.({ cartTotal, cartCount });
      },
      // Optionally persist only essentials
      partialize: (s) => ({
        cartItems: s.cartItems,
        wishlistItems: s.wishlistItems,
        cartTotal: s.cartTotal,
        cartCount: s.cartCount,
        // persist UI flags if you like:
        // isCartOpen: s.isCartOpen,
        // isWishlistOpen: s.isWishlistOpen,
      }),
    }
  )
);
