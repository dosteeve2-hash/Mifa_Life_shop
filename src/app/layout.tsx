import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title:       'Mifa Life — Votre marketplace au Mali',
  description: 'Commandez depuis la Chine, livré directement au Mali. Payez par Orange Money ou Wave.',
  openGraph: {
    title:       'Mifa Life',
    description: 'Marketplace généraliste pour le Mali',
    url:         'https://mifalife.store',
    siteName:    'Mifa Life',
    locale:      'fr_ML',
    type:        'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-[#F6F4F0] text-gray-900 antialiased`}>
        <CartProvider>
          <Navbar />
          <div className="min-h-screen">
            {children}
          </div>
          <footer className="bg-[#111B22] text-white/60 py-8 mt-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-white">
                  <span className="text-[#009739]">MIFA</span> LIFE
                </span>
                <div className="flex overflow-hidden rounded-[2px]">
                  <span className="block h-2.5 w-[5px] bg-[#009739]" />
                  <span className="block h-2.5 w-[5px] bg-[#FCD116]" />
                  <span className="block h-2.5 w-[5px] bg-[#CE1126]" />
                </div>
              </div>
              <p className="text-xs">
                © {new Date().getFullYear()} Mifa Life Company · Bamako, Mali
              </p>
              <div className="flex gap-4 text-xs">
                <a href="/shop"  className="hover:text-white transition-colors">Boutique</a>
                <a href="/login" className="hover:text-white transition-colors">Connexion</a>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
