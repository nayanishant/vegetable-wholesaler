"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: {
    url: string;
    size?: number;
    name?: string;
    type?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  updateQuantity: (id: string, change: number) => void;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  // ✅ Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse cart from localStorage", err);
      }
    }
    setCartLoaded(true);
  }, []);

  useEffect(() => {
    if (cartLoaded) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, cartLoaded]);

  const addToCart = (product: CartItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...currentItems, { ...product }];
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

  // 🚫 Prevent rendering children until cart is loaded
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
