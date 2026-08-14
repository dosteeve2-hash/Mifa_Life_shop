import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import StudioNav from '@/components/studio/StudioNav';
import ScrollProgress from '@/components/studio/primitives/ScrollProgress';

export const metadata: Metadata = {
  title: 'FORGE UI — Studio',
  description:
    'Bibliothèque de composants animés Navy × Gold × Cyan : primitives Motion, dashboard et écrans d’authentification, à reprendre dans n’importe quel projet.',
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="forge-ui min-h-screen bg-[#0A1628]">
      <ScrollProgress />
      <StudioNav />
      {children}
    </div>
  );
}
