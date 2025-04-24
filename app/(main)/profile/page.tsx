"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface Address {
  _id?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: number;
  country?: string;
  isDefault?: boolean;
}

interface UserInfo {
  name: string;
  email: string;
  image?: string;
  role?: string;
}

export default function ProfilePage() {
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Address>({});
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/profile");
      setPhone(data.user.phone || "");
      setAddresses(data.user.address || []);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddAddress = () => {
    const updated = [...addresses];
    if (updated.length === 0) newAddress.isDefault = true;
    updated.push(newAddress);
    setAddresses(updated);
    setNewAddress({});
  };

  const handleDeleteAddress = async (id?: string) => {
    if (!id) return;

    try {
      await axios.delete("/api/profile", { data: { addressId: id } });
      toast.success("Address deleted");
      fetchProfile();
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = (index: number) => {
    const updated = addresses.map((addr, i) => ({
      ...addr,
      isDefault: i === index,
    }));
    setAddresses(updated);
  };

  const handleSave = async () => {
    try {
      await axios.patch("/api/profile", { phone, address: addresses });
      toast.success("Profile updated");
      fetchProfile();
    } catch {
      toast.error("Failed to update profile");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        <span className="ml-2 text-gray-500">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-20 lg:py-20 px-4 space-y-6">
      {/* ✅ User Info Section */}
      {session?.user && (
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-4">
              {session?.user.image && (
                <Image
                  src={session?.user.image}
                  alt={session?.user.name ?? "User Profile Image"}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-lg font-semibold">{session?.user.name}</p>
                <p className="text-sm text-gray-500">{session?.user.email}</p>
                {session?.user.role == "admin" ? (
                  <p className="text-sm text-gray-400 capitalize">
                    {session?.user.role}
                  </p>
                ) : (
                  ""
                )}
              </div>
            </div>
            <Button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ✅ Phone & Address Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <h3 className="text-lg font-semibold mt-6">Saved Addresses</h3>
          {addresses.map((addr, idx) => (
            <div
              key={addr._id || idx}
              className="border p-4 rounded-md bg-muted/20 space-y-1"
            >
              <p>
                <strong>Street:</strong> {addr.street}
              </p>
              <p>
                <strong>City:</strong> {addr.city}
              </p>
              <p>
                <strong>State:</strong> {addr.state}
              </p>
              <p>
                <strong>Postal Code:</strong> {addr.postalCode}
              </p>
              <p>
                <strong>Country:</strong> {addr.country ?? "IN"}
              </p>
              {addr.isDefault && (
                <span className="text-xs px-2 py-1 rounded bg-green-500 text-white">
                  Default
                </span>
              )}
              <div className="flex gap-2 pt-2">
                {!addr.isDefault && (
                  <Button
                    variant="outline"
                    onClick={() => handleSetDefault(idx)}
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteAddress(addr._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}

          <div className="mt-6 space-y-2 border-t pt-4">
            <h4 className="font-semibold">Add New Address</h4>
            <Input
              placeholder="Street"
              value={newAddress.street || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
            />
            <Input
              placeholder="City"
              value={newAddress.city || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />
            <Input
              placeholder="State"
              value={newAddress.state || ""}
              onChange={(e) =>
                setNewAddress({ ...newAddress, state: e.target.value })
              }
            />
            <Input
              placeholder="Postal Code"
              type="number"
              value={newAddress.postalCode || ""}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  postalCode: Number(e.target.value),
                })
              }
            />
            <Button variant="outline" onClick={handleAddAddress}>
              Add Address
            </Button>
          </div>

          <div className="pt-6">
            <Button className="bg-green-500" onClick={handleSave}>
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
