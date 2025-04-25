import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Inventory, { IInventory } from "@/models/Inventory";

type LeanInventory = Omit<
  IInventory,
  "_id" | "createdBy" | "createdAt" | "updatedAt"
> & {
  _id: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const items = await Inventory.find().lean();

    const sanitized: LeanInventory[] = items.map((item: any) => ({
      ...item,
      _id: item._id.toString(),
      createdBy: item.createdBy?.toString(),
      createdAt: item.createdAt?.toISOString(),
      updatedAt: item.updatedAt?.toISOString(),
    }));

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { message: "Failed to fetch inventory items." },
      { status: 500 }
    );
  }
}
