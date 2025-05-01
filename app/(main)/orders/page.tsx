"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";

interface Order {
  _id: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  totalPrice: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: number;
    country: string;
  };
}

export default function Orders() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      axios
        .get("/api/orders")
        .then((res) => {
          setOrders(res.data.orders || []);
        })
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading") return <p>Loading session...</p>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <Card key={order._id}>
            <CardHeader>
              <CardTitle>
                Order #{order._id.slice(-6)} •{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </CardTitle>
              <p className="text-sm text-gray-500 capitalize">
                Status: {order.status}
              </p>
              <p className="text-sm text-gray-500">
                Shipping to: {order.shippingAddress.street},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 font-semibold flex justify-between">
                <span>Total</span>
                <span>₹{order.totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
