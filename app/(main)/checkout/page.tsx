"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import axios from "axios";
import { toast } from "sonner";

interface Address {
  _id?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: number;
  country?: string;
  isDefault?: boolean;
}

interface ProductInfo {
  _id: string;
  name: string;
  price: number;
}

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [phone, setPhone] = useState<string>("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [productMap, setProductMap] = useState<Record<string, ProductInfo>>({});

  const { data: session, status } = useSession();
  const router = useRouter();
  const { items } = useCart();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/profile");
        setAddresses(data.user.address || []);
        setPhone(data.user.phone || "");
        const defaultAddr = data.user.address?.find((a: Address) => a.isDefault);
        if (defaultAddr?._id) setSelectedAddressId(defaultAddr._id);
      } catch {
        toast.error("Failed to load addresses");
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get<ProductInfo[]>("/api/products");
        const map = data.reduce((acc, item) => {
          acc[item._id] = { _id: item._id, name: item.name, price: item.price };
          return acc;
        }, {} as Record<string, ProductInfo>);
        setProductMap(map);
      } catch {
        toast.error("Failed to load product data");
      }
    };

    if (status === "authenticated") {
      fetchUser();
      fetchProducts();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      setIsLoading(false);
      return;
    }

    // Simulate checkout
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Order Placed!", {
        description: "Your order has been successfully placed.",
      });
    }, 700);
  };

  if (status === "loading") return <div>Loading...</div>;

  const total = items.reduce((sum, item) => {
    const product = productMap[item.id];
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Address Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Select Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {addresses.map((addr) => {
                  const selected = addr._id === selectedAddressId;
                  return (
                    <div
                      key={addr._id}
                      className={`p-4 rounded border transition-all ${
                        selected
                          ? "border-green-600 bg-green-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <p className="font-medium">{addr.street}</p>
                      <p>
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p>{addr.country ?? "IN"}</p>
                      <p>{phone}</p>

                      <div className="flex items-center gap-2 mt-3">
                        {addr.isDefault && (
                          <span className="text-xs px-2 py-1 rounded bg-green-500 text-white">
                            Default
                          </span>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant={selected ? "default" : "outline"}
                          onClick={() => setSelectedAddressId(addr._id!)}
                          className={selected ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {selected ? "Selected" : "Select"}
                        </Button>
                      </div>
                    </div>
                  );
                })}

                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Place Order"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => {
                  const product = productMap[item.id];
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {product?.name || "Unknown"} × {item.quantity}
                      </span>
                      <span>₹{(product?.price || 0) * item.quantity}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
