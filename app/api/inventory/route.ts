import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Inventory from "@/models/Inventory";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const items = await Inventory.find({ isAvailable: true }).sort({
      createdAt: -1,
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { message: "Failed to fetch inventory items." },
      { status: 500 }
    );
  }
}
