import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import dbConnect from "./dbConnect";
import { env } from "@/lib/env";

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      await dbConnect();

      const dbUser = await User.findOne({ email: token.email });

      // Create user if not exist (Google login)
      if (!dbUser && token.email) {
        const newUser = await User.create({
          email: token.email,
          name: user?.name || token.name || token.email?.split("@")[0],
          image: user?.image || token.picture,
          provider: "google",
          role: "user",
        });

        token.id = newUser._id.toString();
        token.role = newUser.role;
        token.name = newUser.name;
      } else if (dbUser) {
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.name =
          dbUser.name || user?.name || token.name || token.email?.split("@")[0];
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
