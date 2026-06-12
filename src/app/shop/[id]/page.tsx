import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import FeaturedProducts, { type Product } from '@/components/FeaturedProducts';
import AddToCartButton from '@/components/AddToCartButton';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('mifa_products')
    .select('name,description')
    .eq('id', id)
    .single();
  if (data) {
    return { title: data.name, description: data.description };
  }
  return { title: 'Produit' };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  let product: {
    id: string | number;
    name: string;
    description?: string;
    price: number;
    original_price?: number;
    category?: string;
    images?: string[];
    image_url?: string | null;
    stock?: number;
    featured?: boolean;
    shipping_days?: number;
  } | null = null;

  const { data: mifaProduct } = await supabase
    .from('mifa_products')
    .select('id,name,description,price,original_price,category,images,stock,featured,shipping_days')
    .eq('id', id)
    .single();

  if (mifaProduct) {
    product = mifaProduct as unknown as typeof product;
  } else {
    const numId = parseInt(id, 10);
    if (!isNaN(numId)) {
      const { data: simpleProduct } = await supabase
        .from('products')
        .select('id,name,price_cfa,original_price_cfa,stock,category,image_url')
        .eq('id', numId)
        .single();
      if (simpleProduct) {
        const sp = simpleProduct as { id: number; name: string; price_cfa: number; original_price_cfa?: number; stock?: number; category?: string; image_url?: string };
        product = {
          id: sp.id,
          name: sp.name,
          price: sp.price_cfa,
          original_price: sp.original_price_cfa,
          category: sp.category,
          image_url: sp.image_url,
          stock: sp.stock,
        };
      }
    }
  }

  if (!product) notFound();

  const price = product.price;
  const original = product.original_price;
  const discount = original && original > price ? Math.round((1 - price / original) * 100) : null;
  const images = product.images && product.images.length > 0 ? product.images : product.image_url ? [product.image_url] : [];
  const mainImage = images[0] ?? null;

  let related: Product[] = [];
  if (product.category) {
    const { data: relData } = await supabase
      .from('mifa_products')
      .select('id,name,price,original_price,category,images,featured,shipping_days')
      .eq('active', true)
      .ilike('category', `%${product.category}%`)
      .neq('id', String(product.id))
      .limit(4);
    if (relData) {
      related = (relData as Array<{ id: string; name: string; price: number; original_price?: number; category?: string; images?: string[]; featured?: boolean; shipping_days?: number }>).map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        original_price: p.original_price,
        category: p.category,
        images: p.images,
        featured: p.featured,
        shipping_days: p.shipping_days,
      }));
    }
  }

  const cartItem = {
    id: Number(product.id) || 0,
    name: product.name,
    price_cfa: price,
    image_url: mainImage,
  };

  const inStock = (product.stock ?? 0) > 0;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="wrap" style={{ paddingTop: 24, paddingBottom: 60 }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: 6, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.04em', marginBottom: 28, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--t3)'; }}
          >
            Accueil
          </Link>
          <span>›</span>
          <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--t3)'; }}
          >
            Boutique
          </Link>
          {product.category && (
            <>
              <span>›</span>
              <Link href={`/shop?cat=${product.category}`} style={{ color: 'inherit', textDecoration: 'none' }}>{product.category}</Link>
            </>
          )}
          <span>›</span>
          <span style={{ color: 'var(--t2)' }}>{product.name}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48, marginBottom: 64 }}>
          {/* Gallery */}
          <div>
            <div style={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: 'var(--rl)',
              overflow: 'hidden',
              background: 'var(--bg3)',
              border: '1.5px solid var(--border2)',
              marginBottom: 12,
            }}>
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t3)' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              )}
              {discount && discount >= 5 && (
                <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', borderRadius: 6, background: 'rgba(239,68,68,0.12)', color: 'var(--red)', border: '1px solid rgba(239,68,68,0.3)', fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                  -{discount}%
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <div key={i} style={{
                    position: 'relative',
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: i === 0 ? '2px solid var(--gold)' : '1.5px solid var(--border2)',
                    background: 'var(--bg3)',
                  }}>
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="64px" style={{ objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            {product.category && (
              <div style={{ fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>
                {product.category}
              </div>
            )}

            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, fontStyle: 'italic', color: 'var(--t1)', lineHeight: 1.2, marginBottom: 20 }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: 'var(--gold)' }}>
                {formatPrice(price)}
              </span>
              {original && original > price && (
                <>
                  <span style={{ fontSize: 16, fontFamily: "'JetBrains Mono', monospace", color: 'var(--t3)', textDecoration: 'line-through' }}>{formatPrice(original)}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--red)', background: 'rgba(239,68,68,0.10)', padding: '2px 8px', borderRadius: 5, border: '1px solid rgba(239,68,68,0.2)' }}>-{discount}%</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div style={{ marginBottom: 20 }}>
              {inStock ? (
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--green)', background: 'rgba(34,217,138,0.08)', padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(34,217,138,0.2)' }}>
                  ✓ En stock ({product.stock} disponibles)
                </span>
              ) : (
                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--red)', background: 'rgba(239,68,68,0.08)', padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(239,68,68,0.2)' }}>
                  Rupture de stock
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p style={{ fontSize: 14, color: 'var(--t2)', lineHeight: 1.75, marginBottom: 24, maxWidth: 480 }}>
                {product.description}
              </p>
            )}

            {/* Shipping */}
            {product.shipping_days !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--t2)', marginBottom: 28, padding: '12px 16px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border2)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span>Livraison en <strong style={{ color: 'var(--t1)', fontFamily: "'JetBrains Mono', monospace" }}>{product.shipping_days}–{product.shipping_days + 2} jours</strong> ouvrés</span>
              </div>
            )}

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
              {[
                { icon: '🔒', label: 'Paiement sécurisé' },
                { icon: '↩️', label: 'Retours 14j' },
                { icon: '✓', label: 'Qualité garantie' },
              ].map((b) => (
                <div key={b.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 10px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 20,
                  fontSize: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: 'var(--t2)',
                  fontWeight: 600,
                }}>
                  <span>{b.icon}</span>
                  {b.label}
                </div>
              ))}
            </div>

            <AddToCartButton item={cartItem} />
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <div className="sec-hd" style={{ marginBottom: 20 }}>
              <div>
                <div className="sec-eyebrow">Suggestions</div>
                <h2 className="sec-ti">Vous aimerez aussi.</h2>
              </div>
            </div>
            <FeaturedProducts products={related} />
          </div>
        )}
      </div>
    </div>
  );
}
