"use client";

import Link from "next/link";
import { ShoppingCart, Leaf, Boxes, Warehouse } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function MobileNav({ session }: { session: any }) {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t sm:hidden">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className="flex flex-col items-center text-sm text-gray-700"
        >
          <Leaf className="h-5 w-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/products"
          className="flex flex-col items-center text-sm text-gray-700"
        >
          <Boxes className="h-5 w-5" />
          <span>Products</span>
        </Link>

        <Link
          href="/cart"
          className="relative flex flex-col items-center text-sm text-gray-700"
        >
          <ShoppingCart className="h-5 w-5" />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {session?.user.role === "admin" && (
          <Link
            href="/inventory"
            className="flex flex-col items-center text-sm text-gray-700"
          >
            <Warehouse className="h-5 w-5" />
            <span>Inventory</span>
          </Link>
        )}
      </div>
    </div>
  );
}
