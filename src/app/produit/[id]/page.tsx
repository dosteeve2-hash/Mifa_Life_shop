import { PRODUCTS } from '@/lib/products';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return { title: 'Produit introuvable' };
  return {
    title: `${product.name} — MIFA Life`,
    description: product.description,
    openGraph: {
      title: `${product.name} — MIFA Life`,
      description: product.description,
      siteName: 'MIFA Life',
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
