"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Product } from "@/types/product";

interface Props {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  priority?: boolean;
}

export default function ProductCard({
  product,
  quantity,
  onAdd,
  onIncrease,
  onDecrease,
  priority,
}: Props) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="aspect-square relative">
        <Image
          src={product.image?.url || "/default-image.jpg"}
          alt={product.name}
          width={300}
          height={300}
          className="object-cover w-full h-full"
          priority={priority}
        />
      </div>
      <div className="p-4 text-sm lg:text-lg">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-gray-600">
          ₹{product.price} per {product.unit}
        </p>
      </div>
      <div className="p-4 pt-0 flex flex-col gap-2">
        {quantity > 0 ? (
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="icon" onClick={onDecrease}>
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-lg font-medium w-8 text-center">{quantity}</span>
            <Button variant="outline" size="icon" onClick={onIncrease}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button className="w-full bg-green-500 hover:bg-green-600 text-sm lg:text-lg" onClick={onAdd}>
            Add
          </Button>
        )}
      </div>
    </div>
  );
}
