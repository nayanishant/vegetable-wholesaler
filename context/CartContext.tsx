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
  name: string;
  price: number;
  quantity: number;
  image?: string; // store image URL directly as string
}

interface CartContextType {
  cart: StoredCartItem[];
  addToCart: (item: StoredCartItem) => void;
  removeFromCart: (id: string) => void;
  adjustCartItemQuantity: (id: string, quantity: number) => void;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<StoredCartItem[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  // ✅ Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
    setCartLoaded(true);
  }, []);

  // ✅ Save cart to localStorage
  useEffect(() => {
    if (cartLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, cartLoaded]);

  const addToCart = (product: StoredCartItem) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        return [...currentCart, product];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  const adjustCartItemQuantity = (id: string, delta: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getCartCount = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  if (!cartLoaded) return null;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        adjustCartItemQuantity,
        getCartCount,
      }}
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
