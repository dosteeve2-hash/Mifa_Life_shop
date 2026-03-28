import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mifa Life",
  description: "Marketplace Mifa Life pour le Mali.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-[#F6F4F0] text-gray-900 antialiased`}>
        <CartProvider>
          <div className="min-h-screen">{children}</div>
        </CartProvider>
      </body>
    </html>
  );
}
