"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useFilteredProducts } from "@/hooks/useFilteredProducts";
import Link from "next/link";
import { Product } from "@/types/product";

export default function ProductsClient({ products }: { products: Product[] }) {
  const { status } = useSession();
  const { cart, addToCart, adjustCartItemQuantity } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

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
          className="bg-gray-50 rounded-xl shadow-md mb-10 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold capitalize">{category}</h2>
            <Link href={`/category/${encodeURIComponent(category)}`}>
              <Button variant="link" className="text-green-600 text-sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p, i) => (
              <ProductCard
                key={p._id}
                product={p}
                quantity={getQuantity(p._id)}
                onAdd={() => handleAdd(p)}
                onIncrease={() => adjustQty(p._id, 1)}
                onDecrease={() => adjustQty(p._id, -1)}
                priority={i === 0}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
