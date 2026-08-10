import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { PanierProvider } from '@/context/PanierContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import LenisProvider from '@/components/providers/LenisProvider';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://mifa.life'),
  title: {
    default: 'Mifa Life — La boutique africaine premium',
    template: '%s | Mifa Life',
  },
  description:
    'Mode africaine authentique, artisanat premium, livraison rapide partout en Afrique. Paiement Orange Money & Wave.',
  keywords: [
    'boutique africaine', 'mode africaine', 'artisanat mali', 'acheter en ligne mali',
    'orange money', 'wave mali', 'marketplace afrique', 'mifa life',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_ML',
    url: 'https://mifa.life',
    siteName: 'Mifa Life',
    title: 'Mifa Life — La boutique africaine premium',
    description: 'Mode africaine authentique, artisanat premium. Paiement Orange Money & Wave.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mifa Life — La boutique africaine premium',
    description: 'Mode africaine authentique, artisanat premium.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/android-chrome-192x192.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LenisProvider>
          <CartProvider>
            <PanierProvider>
              <Navbar />
              <main style={{ flex: 1 }}>{children}</main>
              <Footer />
              <BottomNav />
            </PanierProvider>
          </CartProvider>
        </LenisProvider>
        <Toaster position="top-right" richColors />
        <div id="modal-root" />
      </body>
    </html>
  );
}
