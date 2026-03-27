import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/components/providers/CartProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mifa Life Shop",
  description: "Boutique Mifa Life avec catalogue dynamique depuis Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
