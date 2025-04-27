"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import ImageUploader from "@/components/ImageUploader";

interface InventoryItem {
  _id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  isAvailable: boolean;
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    price: "",
    unit: "kg",
    stock: "",
    isAvailable: "true",
  });
  const [imageFile, setImageFile] = useState<any>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/inventory");
      setItems(data);
    } catch (err) {
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      unit: "kg",
      stock: "",
      isAvailable: "true",
    });
    setEditId(null);
    setImageFile(null);
  };
  

  const handleSubmit = async () => {
    try {
      const basePayload = {
        name: form.name,
        price: parseFloat(form.price),
        unit: form.unit,
        stock: parseInt(form.stock),
        isAvailable: form.isAvailable === "true",
      };
  
      if (editId) {
        await axios.patch("/api/admin/inventory", {
          id: editId,
          ...basePayload,
        });
        toast.success("Product updated");
      } else {
        await axios.post("/api/admin/inventory", {
          ...basePayload,
          image: imageFile,
        });
        toast.success("Product added");
      }
  
      resetForm();
      fetchInventory();
    } catch (err) {
      toast.error(editId ? "Error updating product" : "Error adding product");
    }
  };
  

  const handleEdit = (item: InventoryItem) => {
    setEditId(item._id);
    setForm({
      name: item.name,
      price: item.price.toString(),
      unit: item.unit,
      stock: item.stock.toString(),
      isAvailable: item.isAvailable.toString(),
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete("/api/admin/inventory", {
        data: { deleteId: id },
      });
      toast.success("Product deleted");
      fetchInventory();
    } catch (err) {
      toast.error("Error deleting product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 lg:pt-20 lg:pb-10">
      <Card>
        <CardHeader>
          <CardTitle>{editId ? "Edit Product" : "Add New Product"}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <Input
            placeholder="Unit (kg, piece...)"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
          <Input
            placeholder="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
          <ImageUploader onUploadComplete={(file) => setImageFile(file)} />
          <select
            className="border rounded px-2 py-1"
            value={form.isAvailable}
            onChange={(e) => setForm({ ...form, isAvailable: e.target.value })}
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
          <div className="col-span-1 sm:col-span-2 flex gap-2">
            <Button className="bg-green-500" onClick={handleSubmit}>
              {editId ? "Update Product" : "Add Product"}
            </Button>
            {editId && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Inventory</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="animate-spin h-5 w-5" />
            Loading...
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item._id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} / {item.unit} • Stock: {item.stock}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
