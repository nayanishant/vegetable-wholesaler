import dbConnect from "@/lib/dbConnect";
import Inventory from "@/models/Inventory";
import { Product } from "@/types/product";

export async function getProducts(category?: string): Promise<Product[]> {
  await dbConnect();

  const query = category
    ? { category: { $regex: new RegExp(`^${category}$`, "i") } }
    : {};

  const items = await Inventory.find(query).lean();

  return items.map((item: any) => ({
    _id: item._id.toString(),
    name: item.name,
    price: item.price,
    unit: item.unit,
    category: item.category,
    image: item.image || null,
  }));
}
