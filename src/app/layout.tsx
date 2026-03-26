import type { Metadata } from "next";
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
      <body>{children}</body>
    </html>
  );
}
