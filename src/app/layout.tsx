import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PostHogProvider } from '@/components/PostHogProvider';
import { PostHogPageview } from '@/components/PostHogPageview';
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
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: '#0a0f08' }}>
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageview />
          </Suspense>
          <CartProvider>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </CartProvider>
        </PostHogProvider>
        <div id="modal-root" />
      </body>
    </html>
  );
}
