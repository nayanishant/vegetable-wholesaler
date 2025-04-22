"use client";

import {
  ShoppingCart,
  Leaf,
  Settings,
  Warehouse,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const { data: session } = useSession();

  return (
    <>
      {/* Top Navbar for Desktop */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Leaf className="h-8 w-8 text-green-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                FreshWholesale
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              {/* Products */}
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

              {/* Cart */}
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

              {/* Admin Inventory */}
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

              {/* Profile / Auth */}
              {!session ? (
                <Link href="/login">
                  <Button className="bg-green-500 hover:bg-green-600">
                    Login
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <Button
                    onClick={() => signOut()}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation Bar for Mobile */}
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
              <span>Admin</span>
            </Link>
          )}

          {!session ? (
            <Link
              href="/login"
              className="flex flex-col items-center text-sm text-gray-700"
            >
              <Settings className="h-5 w-5" />
              <span>Login</span>
            </Link>
          ) : (
            <button
              onClick={() => signOut()}
              className="flex flex-col items-center text-sm text-gray-700"
            >
              <Settings className="h-5 w-5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
