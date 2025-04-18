"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface Product {
  _id: string;
  name: string;
  price: number;
  unit: string;
  image?: {
    url: string;
    size?: number;
    name?: string;
    type?: string;
  };
}

export default function Products() {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { status } = useSession();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/inventory");
        setProducts(data);
      } catch (err) {
        toast({ title: "Failed to load products" });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
      </div>
    );
  }

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleAddToCart = (product: Product) => {
    setLoadingProductId(product._id);
    setTimeout(() => {
      addToCart({ ...product, id: product._id, quantity: 1 });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
      setLoadingProductId(null);
    }, 800);
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
          <Card key={product._id} className="overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={product.image?.url || "/default-image.jpg"}
                alt={product.name}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">
                ₹{product.price} per {product.unit}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => handleAddToCart(product)}
                disabled={loadingProductId === product._id}
              >
                {loadingProductId === product._id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Add to Cart"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
        {!filteredProducts.length && !loading && (
          <p className="text-gray-500 col-span-full text-center">
            No products available right now.
          </p>
        )}
      </div>
    </div>
  );
}
