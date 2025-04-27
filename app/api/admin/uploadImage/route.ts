import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Inventory from "@/models/Inventory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  await dbConnect().catch((err) => {
    console.error("❌ Database connection error:", err);
  });

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { file, metadata = {} } = await req.json();

    if (!file || !file.url) {
      return NextResponse.json({ error: "Invalid file data" }, { status: 400 });
    }

    // 👉 Add size check (1MB = 1048576 bytes)
    if (file.size && file.size > 1048576) {
      return NextResponse.json(
        { error: "Image size exceeds 1MB limit" },
        { status: 400 }
      );
    }

    const newImage = await Inventory.findOneAndUpdate(
      { publicId: file.id || file.name },
      {
        url: file.url,
        publicId: file.id || file.name || `image_${Date.now()}`,
        userId: session.user.id,
        width: metadata?.width || undefined,
        height: metadata?.height || undefined,
        format: metadata?.format || file.type,
        size: file.size || undefined,
      },
      { upsert: true, new: true }
    );

    console.log("✅ Image saved to database:", newImage);

    return NextResponse.json(
      { message: "Image uploaded successfully", newImage },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error saving image:", error.message);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
