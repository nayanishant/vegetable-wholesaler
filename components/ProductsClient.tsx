"use client";

import { useState, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useFilteredProducts } from "@/hooks/useFilteredProducts";
import Link from "next/link";
import { Product } from "@/types/product";

export default function ProductsClient({ products }: { products: Product[] }) {
  const { status } = useSession();
  const { cart, addToCart, adjustCartItemQuantity } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

  const containerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const normalized = products.map((p) => ({
    ...p,
    category: p.category || "Others",
  }));
  const filtered = useFilteredProducts(normalized, searchTerm);

  const grouped = filtered.reduce((acc, product) => {
    const cat = product.category || "Others";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const getQuantity = (id: string) =>
    cart.find((i) => i.id === id)?.quantity || 0;

  const handleAdd = (p: Product) => {
    addToCart({
      id: p._id,
      name: p.name,
      price: p.price,
      image: p.image?.url,
      quantity: 1,
    });
    toast.success("Added to cart", { description: `${p.name} added to cart.` });
  };

  const adjustQty = (id: string, delta: number) =>
    adjustCartItemQuantity(id, delta);

  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
      <h1 className="text-3xl font-bold mb-4">Our Products</h1>
      <div className="relative w-full max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products..."
          className="pl-10 pr-4 py-2 w-full border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <div
          key={category}
          className="relative bg-gray-50 rounded-xl shadow-md mb-10 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold capitalize">{category}</h2>
            <Link href={`/category/${encodeURIComponent(category)}`}>
              <Button variant="link" className="text-green-600 text-sm">
                View All
              </Button>
            </Link>
          </div>

          {/* Arrow buttons */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 opacity-50"
            onClick={() =>
              containerRefs.current[category]?.scrollBy({
                left: -300,
                behavior: "smooth",
              })
            }
          >
            <ChevronLeft />
          </button>

          <div
            ref={(el) => (containerRefs.current[category] = el)}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-1 py-4"
          >
            {items.map((p, i) => (
              <div key={p._id} className="flex-shrink-0 w-32 lg:w-64">
                <ProductCard
                  product={p}
                  quantity={getQuantity(p._id)}
                  onAdd={() => handleAdd(p)}
                  onIncrease={() => adjustQty(p._id, 1)}
                  onDecrease={() => adjustQty(p._id, -1)}
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-2 opacity-50"
            onClick={() =>
              containerRefs.current[category]?.scrollBy({
                left: 300,
                behavior: "smooth",
              })
            }
          >
            <ChevronRight />
          </button>
        </div>
      ))}
    </div>
  );
}
