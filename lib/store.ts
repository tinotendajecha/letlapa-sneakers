'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Product Type 
export interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
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

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart state
      cartItems: [],
      cartTotal: 0,
      cartCount: 0,

      addToCart: (product, size, color, quantity = 1) => {
        const cartItems = get().cartItems;
        const existingItem = cartItems.find(
          item => item.product._id === product._id && item.size === size && item.color === color
        );

        if (existingItem) {
          set({
            cartItems: cartItems.map(item =>
              item.product._id === product._id && item.size === size && item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            cartItems: [...cartItems, { product, quantity, size, color }],
          });
        }

        // Update totals
        const newCartItems = get().cartItems;
        const total = newCartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const count = newCartItems.reduce((sum, item) => sum + item.quantity, 0);
        set({ cartTotal: total, cartCount: count });
      },

      removeFromCart: (productId, size, color) => {
        const cartItems = get().cartItems.filter(
          item => !(item.product._id === productId && item.size === size && item.color === color)
        );
        set({ cartItems });

        // Update totals
        const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        set({ cartTotal: total, cartCount: count });
      },

      updateCartItemQuantity: (productId, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, size, color);
          return;
        }

        const cartItems = get().cartItems.map(item =>
          item.product._id === productId && item.size === size && item.color === color
            ? { ...item, quantity }
            : item
        );
        set({ cartItems });

        // Update totals
        const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        set({ cartTotal: total, cartCount: count });
      },

      clearCart: () => {
        set({ cartItems: [], cartTotal: 0, cartCount: 0 });
      },

      // Wishlist state
      wishlistItems: [],

      addToWishlist: (product) => {
        const wishlistItems = get().wishlistItems;
        if (!wishlistItems.some(item => item.product._id === product._id)) {
          set({
            wishlistItems: [...wishlistItems, { product }],
          });
        }
      },

      removeFromWishlist: (productId) => {
        set({
          wishlistItems: get().wishlistItems.filter(item => item.product._id !== productId),
        });
      },

      clearWishlist: () => {
        set({ wishlistItems: [] });
      },

      isInWishlist: (productId) => {
        return get().wishlistItems.some(item => item.product._id === productId);
      },

      // UI state
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      isWishlistOpen: false,
      setWishlistOpen: (open) => set({ isWishlistOpen: open }),
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

      // Filters state
      filters: {
        brands: [],
        categories: [],
        priceRange: [0, 5000],
        sizes: [],
        colors: [],
        inStock: false,
        sortBy: 'featured',
      },

      updateFilters: (newFilters) => {
        set({ filters: { ...get().filters, ...newFilters } });
      },

      clearFilters: () => {
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
        });
      },
    }),
    {
      name: 'letlapa-store',
      partialize: (state) => ({
        cartItems: state.cartItems,
        wishlistItems: state.wishlistItems,
        cartTotal: state.cartTotal,
        cartCount: state.cartCount,
      }),
    }
  )
);