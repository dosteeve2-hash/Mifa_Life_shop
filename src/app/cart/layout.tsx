import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Mon panier | Mifa Life',
  description: 'Votre panier Mifa Life — vérifiez vos articles et procédez au paiement en toute sécurité.',
  openGraph: {
    title: 'Mon panier | Mifa Life',
    description: 'Finalisez votre commande sur Mifa Life, la boutique africaine premium.',
    url: 'https://mifa.life/cart',
  },
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
