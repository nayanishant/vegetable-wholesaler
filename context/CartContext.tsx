"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface StoredCartItem {
  id: string;
  quantity: number;
  image?: { url: string };
}

interface FullCartItem extends StoredCartItem {
  name?: string;
  price?: number;
}

interface CartContextType {
  items: StoredCartItem[];
  addToCart: (item: StoredCartItem) => void;
  updateQuantity: (id: string, change: number) => void;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<StoredCartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  // ✅ Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      } catch (err) {
        console.error("❌ Failed to parse cart from localStorage", err);
      }
    }
    setCartLoaded(true);
  }, []);

  // ✅ Save only essential data to localStorage
  useEffect(() => {
    if (cartLoaded) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, cartLoaded]);

  const addToCart = (product: {
    id: string;
    quantity: number;
    image?: { url?: string };
  }) => {
    const itemToStore: StoredCartItem = {
      id: product.id,
      quantity: product.quantity,
      image: product.image?.url ? { url: product.image.url } : undefined,
    };

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === itemToStore.id
      );
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === itemToStore.id
            ? { ...item, quantity: item.quantity + itemToStore.quantity }
            : item
        );
      }
      return [...currentItems, itemToStore];
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getCartCount = () =>
    items.reduce((total, item) => total + item.quantity, 0);

  if (!cartLoaded) return null;

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, getCartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
