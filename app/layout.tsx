import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import ToasterClient from "@/components/ToasterClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreshWholesale - Premium Vegetable Wholesaler",
  description: "Your trusted partner for wholesale vegetables",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/application.png" />
      </head>
      <body className={`h-screen flex flex-col ${inter.className}`}>
        <ToasterClient />
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
