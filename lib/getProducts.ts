import dbConnect from "@/lib/dbConnect";
import Inventory from "@/models/Inventory";

export async function getProducts() {
  await dbConnect();

  const items = await Inventory.find().lean();

  return items.map((item: any) => ({
    _id: item._id.toString(),
    name: item.name,
    price: item.price,
    unit: item.unit,
    image: item.image || null,
  }));
}
