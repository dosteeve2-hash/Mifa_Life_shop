import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Ma liste de souhaits | Mifa Life',
  description: 'Retrouvez tous vos produits favoris sauvegardés sur Mifa Life.',
  openGraph: {
    title: 'Ma liste de souhaits | Mifa Life',
    description: 'Vos produits favoris Mifa Life — mode africaine authentique et artisanat premium.',
    url: 'https://mifa.life/wishlist',
  },
  robots: { index: false, follow: false },
};

export default function WishlistLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
