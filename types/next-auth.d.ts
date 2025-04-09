import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      role?: "user" | "admin";
    };
  }

  interface User {
    id: string;
    role?: "user" | "admin";
    name?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string;
    email?: string;
    role?: "user" | "admin";
  }
}
