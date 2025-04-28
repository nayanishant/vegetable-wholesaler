"use client";

import { Leaf } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ProfileAuth from "./ProfileAuth";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <>
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

            {/* Mobile Auth */}
            <div className="lg:hidden md:hidden sm:hidden">
              <ProfileAuth session={session} />
            </div>

            {/* Desktop Navigation */}
            <DesktopNav session={session} />
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <MobileNav session={session} />
    </>
  );
}
