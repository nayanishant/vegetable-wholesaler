"use client";

import { ShoppingCart, Menu, X, Leaf, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const { data: session } = useSession();

  const navigation = [
    { name: "Products", href: "/products" },
    { name: "Cart", href: "/cart" },
  ];

  return (
    <nav className="bg-white shadow-sm">
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
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? "bg-green-500 text-white"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Cart for Desktop only
            <Link href="/cart" className="hidden sm:hidden">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link> */}

{!session ? (
  <Link href="/login">
    <Button className="bg-green-500 hover:bg-green-600">Login</Button>
  </Link>
) : (
  <div className="relative group">
    <Button variant="ghost" size="icon" className="relative">
      <Settings className="h-5 w-5 text-gray-700" />
    </Button>

    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border rounded-md opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
      <div className="p-4 flex items-center gap-4">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt="Profile"
            width={100}
            height={100}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div>
          <p className="text-sm font-medium">{session.user?.name}</p>
          <p className="text-xs text-gray-500">{session.user?.email}</p>
        </div>
      </div>
      <div className="border-t" />
      <div className="p-2">
        <Button
          onClick={() => signOut()}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          Sign out
        </Button>
      </div>
    </div>
  </div>
)}

          </div>

          {/* Mobile Hamburger */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === item.href
                  ? "bg-green-500 text-white"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Cart Icon for Mobile Only */}
          <Link
            href="/cart"
            className="hidden sm:hidden"
            onClick={() => setIsOpen(false)}
          >
            <Button
              variant="outline"
              size="icon"
              className="relative w-full justify-start sm:hidden"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="ml-2">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Auth Button for Mobile */}
          {!session ? (
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-green-500 hover:bg-green-600 mt-2">
                Login
              </Button>
            </Link>
          ) : (
            <Button
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
              className="w-full bg-red-500 hover:bg-red-600 mt-2"
            >
              Logout
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
