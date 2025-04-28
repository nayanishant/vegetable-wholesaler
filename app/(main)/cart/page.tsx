"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

interface InventoryItem {
  _id: string;
  name: string;
  price: number;
  image?: {
    url: string;
  };
}

export default function Cart() {
  const { cart, adjustCartItemQuantity } = useCart();
  const { status } = useSession();
  const router = useRouter();
  const [productData, setProductData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchInventory = async () => {
    try {
      const { data } = await axios.get<InventoryItem[]>("/api/products");
      setProductData(data);
    } catch (error) {
      console.error("❌ Error fetching product data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchInventory();
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex cart-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
        <span className="ml-2 text-sm text-gray-600">Loading cart...</span>
      </div>
    );
  }

  // Merge cart cart with full product info
  const mergedcart = cart.map((cartItem) => {
    const fullItem = productData.find((p) => p._id === cartItem.id);
    return {
      ...cartItem,
      name: fullItem?.name || "Unknown Product",
      price: fullItem?.price || 0,
    };
  });

  const total = mergedcart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setCheckoutLoading(true);
    setTimeout(() => {
      router.push("/checkout");
    }, 700);
  };

  if (mergedcart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center pb-20">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/products">
          <Button className="bg-green-500 hover:bg-green-600">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-20">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {mergedcart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex cart-center gap-4">
                <Image
                  src={item.image || "/default-image.jpg"}
                  alt={item.name || "Product Image"}
                  width={100}
                  height={100}
                  className="object-cover w-24 h-24 rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
                </div>
                <div className="flex cart-center gap-2 h-10 items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-6 h-6 sm:w-8 sm:h-8"
                    onClick={() => adjustCartItemQuantity(item.id, -1)}
                  >
                    <Minus className="w-4 h-4 sm:w-6 sm:h-6" />
                  </Button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-6 h-6 sm:w-8 sm:h-8"
                    onClick={() => adjustCartItemQuantity(item.id, 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="w-6 h-6 sm:w-8 sm:h-8"
                    onClick={() =>
                      adjustCartItemQuantity(item.id, -item.quantity)
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="block mt-4">
                <Button
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <div className="flex cart-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Redirecting...
                    </div>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
