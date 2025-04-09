"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    price: 2.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1546470427-1ec6b777bb5e",
  },
  {
    id: 2,
    name: "Organic Carrots",
    price: 1.99,
    unit: "kg",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37",
  },
  {
    id: 3,
    name: "Green Lettuce",
    price: 1.49,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1",
  },
  {
    id: 4,
    name: "Red Lettuce",
    price: 1.49,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1",
  },
];

export default function Products() {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: typeof products[0]) => {
    setLoadingProductId(product.id);
    setTimeout(() => {
      addToCart({ ...product, quantity: 1 });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
      setLoadingProductId(null);
    }, 800); // simulate network delay
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Our Products</h1>
        <input
          type="text"
          placeholder="Search products..."
          className="w-full max-w-md px-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">
                ${product.price} per {product.unit}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => handleAddToCart(product)}
                disabled={loadingProductId === product.id}
              >
                {loadingProductId === product.id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Add to Cart"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
