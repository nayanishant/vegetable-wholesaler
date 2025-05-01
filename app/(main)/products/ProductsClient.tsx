"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Loader2, Minus, Plus, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Product {
  _id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image?: {
    url: string;
    size?: number;
    name?: string;
    type?: string;
  };
}

export default function ProductsClient({ products }: { products: Product[] }) {
  const { cart, addToCart, adjustCartItemQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { status } = useSession();

  const [searchTerm, setSearchTerm] = useState("");

  const getQuantityInCart = (productId: string) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image?.url,
      quantity: 1,
    });
    toast.success("Added to cart", {
      description: `${product.name} added to cart.`,
    });
  };

  const handleIncrease = (productId: string) => {
    adjustCartItemQuantity(productId, 1);
  };

  const handleDecrease = (productId: string) => {
    adjustCartItemQuantity(productId, -1);
  };

  // Normalize products to ensure every product has a defined category
  const normalizedProducts = products.map((p) => ({
    ...p,
    category: p.category || "Others",
  }));

  // Now apply filtering on normalized data
  const filteredProducts = normalizedProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    );
  }

  const categories = Array.from(
    new Set(normalizedProducts.map((p) => p.category))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Our Products</h1>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full max-w-xs mt-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="mt-1" id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const quantityInCart = getQuantityInCart(product._id);

          return (
            <div
              key={product._id}
              className="border rounded-lg overflow-hidden shadow-sm"
            >
              <div className="aspect-square relative">
                <Image
                  src={product.image?.url || "/default-image.jpg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4 text-sm lg:text-lg">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">
                  ₹{product.price} per {product.unit}
                </p>
              </div>

              <div className="p-4 pt-0 flex flex-col gap-2">
                {quantityInCart > 0 ? (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDecrease(product._id)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-medium w-8 text-center">
                      {quantityInCart}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleIncrease(product._id)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-sm lg:text-lg"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        {!filteredProducts.length && (
          <p className="text-gray-500 col-span-full text-center">
            No products available right now.
          </p>
        )}
      </div>
    </div>
  );
}
