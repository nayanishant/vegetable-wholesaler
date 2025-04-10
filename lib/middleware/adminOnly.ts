import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function adminOnly(
  req: NextRequest,
  callback: (session: any) => Promise<NextResponse>
): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden: Admins only" }, { status: 403 });
  }

  return callback(session);
}
