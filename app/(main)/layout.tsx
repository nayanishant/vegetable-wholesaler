import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/NavBar/navbar";
import { CartProvider } from "@/context/CartContext";
import { EdgeStoreProvider } from "@/lib/edgestore";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <CartProvider>
        <Navbar />
        <main className="flex-1 h-full bg-background">
          <EdgeStoreProvider>{children}</EdgeStoreProvider>
        </main>
      </CartProvider>
    </ThemeProvider>
  );
}
