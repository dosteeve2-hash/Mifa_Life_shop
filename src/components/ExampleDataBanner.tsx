'use client';

import { usePathname } from 'next/navigation';

const EXAMPLE_ROUTES = ['/admin', '/commandes', '/comparateur', '/dashboard', '/essentials', '/seller-dashboard'];

export default function ExampleDataBanner() {
  const pathname = usePathname();
  if (!EXAMPLE_ROUTES.some((route) => pathname.startsWith(route))) return null;

  return (
    <div
      role="note"
      style={{
        padding: '10px 16px',
        textAlign: 'center',
        fontSize: 12,
        lineHeight: 1.5,
        background: 'var(--bg3)',
        borderBottom: '1px solid var(--border2)',
        color: 'var(--text2)',
      }}
    >
      <strong style={{ color: 'var(--gold)' }}>Données d&apos;exemple.</strong> Les produits, notes,
      commandes et montants de cette page sont fictifs et illustrent la plateforme. Ils ne
      proviennent d&apos;aucun vendeur ni client réel.
    </div>
  );
}
