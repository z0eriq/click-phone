import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/lib/i18n";
import { TAX_RATE, SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  nameAr?: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  storage?: string;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.productId === item.productId && i.variantId === item.variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),

      setCoupon: (code, discount) =>
        set({ couponCode: code, couponDiscount: discount }),

      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

      getSubtotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().couponDiscount;
        const afterDiscount = subtotal - discount;
        const tax = afterDiscount * TAX_RATE;
        const shipping =
          afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        return afterDiscount + tax + shipping;
      },

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "click-phone-cart" }
  )
);

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: "ar",
      setLocale: (locale) => set({ locale }),
    }),
    { name: "click-phone-locale" }
  )
);

interface WishlistStore {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleItem: (productId: string) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) =>
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items
            : [...state.items, productId],
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        })),
      isInWishlist: (productId) => get().items.includes(productId),
      toggleItem: (productId) => {
        const isIn = get().isInWishlist(productId);
        if (isIn) get().removeItem(productId);
        else get().addItem(productId);
      },
    }),
    { name: "click-phone-wishlist" }
  )
);
