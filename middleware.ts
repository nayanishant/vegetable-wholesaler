import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // console.log("Role: ", token?.role);

  const { pathname } = request.nextUrl;

  // Allow public access to auth and login/register
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/products" ||
    pathname === "/cart" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Not authenticated
  if (!token && pathname === "/checkout") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based protection
  if (token?.role === "admin") {
    // Admin has access to everything
    return NextResponse.next();
  }

  if (token?.role === "user") {
    // Block access to admin-only routes
    const adminOnlyRoutes = ["/admin", "/admin-dashboard", "/admin/settings"];
    const isAdminOnly = adminOnlyRoutes.some((route) => pathname.startsWith(route));

    if (isAdminOnly) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // If role is not valid
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login|register).*)"],
};
