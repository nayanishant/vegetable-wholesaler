import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "./dbConnect";
import { env } from "@/lib/env";

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password.");
        }
      
        await dbConnect();
      
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) {
          throw new Error("No user found or password not set.");
        }
      
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Invalid email or password.");
        }
      
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
      
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // console.log("JWT Callback - user:", user);
      // console.log("JWT Callback - token BEFORE:", token);
      await dbConnect();

      const dbUser = await User.findOne({ email: token.email });

      // Create user if not exist (for Google)
      if (!dbUser && token.email) {
        const newUser = await User.create({
          email: token.email,
          name: user.name || token.name || token.email?.split("@")[0],
          provider: "google",
          role: "user",
        });

        token.id = newUser._id.toString();
        token.role = newUser.role;
        token.name = newUser.name;
      } else if (dbUser) {
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.name = dbUser.name || user?.name || token.name || token.email?.split("@")[0];

      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  secret: env.NEXTAUTH_SECRET,
};
