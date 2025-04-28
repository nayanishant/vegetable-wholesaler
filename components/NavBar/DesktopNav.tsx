"use client";

import Link from "next/link";
import { ShoppingCart, Warehouse } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import ProfileAuth from "./ProfileAuth";

export default function DesktopNav({ session }: { session: any }) {
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <div className="hidden sm:flex sm:items-center sm:space-x-4">
      <Link
        href="/products"
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          pathname === "/products"
            ? "bg-green-500 text-white"
            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        }`}
      >
        Products
      </Link>

      <Link
        href="/cart"
        className="relative px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </Link>

      {session?.user.role === "admin" && (
        <Link
          href="/inventory"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            pathname === "/inventory"
              ? "bg-green-500 text-white"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Warehouse />
        </Link>
      )}

      <ProfileAuth session={session} />
    </div>
  );
}
