import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  // console.log("Middleware token:", token);

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/auth") ||
    ["/login", "/register", "/products", "/cart", "/"].includes(pathname)
  ) {
    return NextResponse.next();
  }

  if (!token && pathname === "/checkout") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token?.role === "admin") {
    return NextResponse.next();
  }

  if (token?.role === "user") {
    const adminOnlyRoutes = ["/admin", "/admin-dashboard", "/admin/settings"];
    const isAdminOnly = adminOnlyRoutes.some((route) => pathname.startsWith(route));

    if (isAdminOnly) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login|register).*)"],
};
