import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { CartProvider } from "@/context/CartContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <CartProvider>
        <Navbar />
        <main className="flex-1 h-full bg-background">{children}</main>
        <Toaster />
      </CartProvider>
    </ThemeProvider>
  );
}
