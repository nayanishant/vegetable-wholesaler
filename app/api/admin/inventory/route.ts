import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Inventory from "@/models/Inventory";
import { adminOnly } from "@/lib/middleware/adminOnly";

export async function GET(req: NextRequest) {
  return adminOnly(req, async () => {
    await dbConnect();
    const items = await Inventory.find({});
    return NextResponse.json(items);
  });
}

export async function POST(req: NextRequest) {
  return adminOnly(req, async (session) => {
    await dbConnect();
    const body = await req.json();

    const newItem = await Inventory.create({
      name: body.name,
      price: body.price,
      unit: body.unit,
      stock: body.stock,
      category: body.category,
      isAvailable: body.isAvailable ?? true,
      image: body.image,
      createdBy: session.user.id,
    });

    return NextResponse.json(newItem, { status: 201 });
  });
}

export async function PATCH(req: NextRequest) {
  return adminOnly(req, async () => {
    await dbConnect();
    const { id, ...data } = await req.json();

    const updatedItem = await Inventory.findByIdAndUpdate(
      id,
      {
        ...data,
        isAvailable: data.isAvailable ?? true,
      },
      { new: true }
    );

    return NextResponse.json(updatedItem);
  });
}

export async function DELETE(req: NextRequest) {
  return adminOnly(req, async () => {
    await dbConnect();
    const { deleteId } = await req.json();
    await Inventory.findByIdAndDelete(deleteId);
    return new NextResponse(null, { status: 204 });
  });
}
