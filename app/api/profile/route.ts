import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function PATCH(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { phone, address } = await req.json();
    const updateFields: any = {};

    if (phone) updateFields.phone = phone;

    if (Array.isArray(address)) {
      updateFields.address = address.map((addr, index) => ({
        ...addr,
        isDefault: addr.isDefault ?? index === 0, // default to first if not set
      }));
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateFields },
      { new: true }
    );

    return NextResponse.json({ message: "Profile updated", user: updatedUser });
  } catch (error: any) {
    console.error("❌ Error updating profile:", error.message);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { addressId } = await req.json();

    if (!addressId) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    // Pull the address first
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $pull: { address: { _id: addressId } } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hasDefault = user.address.some((addr: any) => addr.isDefault);

    // If no default exists, promote the first one
    if (!hasDefault && user.address.length > 0) {
      user.address[0].isDefault = true;
      await user.save();
    }

    return NextResponse.json({ message: "Address deleted", user });
  } catch (error: any) {
    console.error("❌ Error deleting address:", error.message);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findOne({ email: session.user.email }).select(
      "phone address"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("❌ Error fetching profile:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
