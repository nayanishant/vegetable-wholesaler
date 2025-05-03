"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { useFilteredProducts } from "@/hooks/useFilteredProducts";
import { Product } from "@/types/product";

export default function CategoryClient({
  category,
  products,
}: {
  category: string;
  products: Product[];
}) {
  const { status } = useSession();
  const { cart, addToCart, adjustCartItemQuantity } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useFilteredProducts(products, searchTerm);

  const getQuantity = (id: string) => cart.find((i) => i.id === id)?.quantity || 0;

  const handleAdd = (p: Product) => {
    addToCart({ id: p._id, name: p.name, price: p.price, image: p.image?.url, quantity: 1 });
    toast.success("Added to cart", { description: `${p.name} added to cart.` });
  };

  const adjustQty = (id: string, delta: number) => adjustCartItemQuantity(id, delta);

  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6 capitalize">{category}</h1>
      <div className="relative w-full max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search products..."
          className="pl-10 pr-4 py-2 w-full border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
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
      )}
    </div>
  );
}
