import type { Metadata } from 'next';
import CollectionsClient from './CollectionsClient';

export const metadata: Metadata = {
  title: 'Nos Collections — Mifa Life',
  description: 'Découvrez nos collections de mode africaine contemporaine — Kente, Wax, Dashhiki, Robes et Accessoires. Fait avec passion.',
};

export default function CollectionsPage() {
  return <CollectionsClient />;
}
