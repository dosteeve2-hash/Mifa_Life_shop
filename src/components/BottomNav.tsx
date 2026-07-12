'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const ITEMS = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/shop', label: 'Boutique', icon: LayoutGrid },
  { href: '/cart', label: 'Panier', icon: ShoppingBag, badge: true },
  { href: '/wishlist', label: 'Favoris', icon: Heart },
  { href: '/account', label: 'Compte', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav id="bottom-nav" aria-label="Navigation principale">
      <div className="bn-in">
        {ITEMS.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            className={`bn-item${isActive(href) ? ' on' : ''}`}
            aria-current={isActive(href) ? 'page' : undefined}
          >
            <Icon size={21} strokeWidth={isActive(href) ? 2.4 : 1.9} />
            <span>{label}</span>
            {badge && totalItems > 0 && (
              <span className="bn-bdg">{totalItems > 99 ? '99+' : totalItems}</span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
