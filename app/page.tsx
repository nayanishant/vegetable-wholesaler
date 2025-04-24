"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative min-h-screen flex items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
            Premium Wholesale Vegetables for Your Business
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Fresh from farm to your doorstep. Quality vegetables at wholesale
            prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-green-500 hover:bg-green-600">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {!session ? (
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white bg-black hover:bg-white/40 outline-none border-none"
                >
                  Login to Order
                </Button>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
