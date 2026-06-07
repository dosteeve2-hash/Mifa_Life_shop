import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://mifa.life'),
  title: {
    default: 'Mifa Life — La boutique premium du Mali',
    template: '%s | Mifa Life',
  },
  description:
    'Découvrez les meilleurs produits au Mali — Électronique, Mode, Maison, Sport et plus. Paiement Orange Money & Wave. Livraison à Bamako et partout au Mali.',
  keywords: [
    'boutique mali',
    'acheter en ligne mali',
    'orange money',
    'wave mali',
    'électronique bamako',
    'mode mali',
    'mifa life',
    'marketplace mali',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_ML',
    url: 'https://mifa.life',
    siteName: 'Mifa Life',
    title: 'Mifa Life — La boutique premium du Mali',
    description:
      'Découvrez les meilleurs produits au Mali — Électronique, Mode, Maison, Sport et plus.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mifa Life — La boutique premium du Mali',
    description: 'Découvrez les meilleurs produits au Mali.',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Nunito+Sans:opsz,wght@6..12,400;6..12,500;6..12,600;6..12,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </CartProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
