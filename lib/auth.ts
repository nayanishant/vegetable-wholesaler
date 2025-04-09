import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "./dbConnect";
import { env } from "@/lib/env"; // path to your env.ts

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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password.");
        }

        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found.");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            console.log("Invalid password");
            throw new Error("Invalid password.");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.log("Error", error);
          throw new Error("Something went wrong.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      await dbConnect();
      // console.log("Profile: ", profile);
      // console.log("Token: ", token);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
  
      if (account?.provider === "google") {
        let existingUser = await User.findOne({ email: token.email });
  
        if (!existingUser) {
          existingUser = await User.create({
            email: token.email,
            name: profile?.name,
            image: token.picture,
            provider: "google",
            role: "user",
          });
        }
  
        token.id = existingUser._id.toString();
        token.name = existingUser.name;
        token.role = existingUser.role;
      }

      if (!user && token?.email && !token.role) {
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.name = dbUser.name;
          token.role = dbUser.role;
        }
      }
  
      return token;
    },
  
    async session({ session, token }) {
      if (session?.user) {
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
    maxAge: 1 * 24 * 60 * 60,
  },
  secret: env.NEXTAUTH_SECRET,
};
