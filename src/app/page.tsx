import { createServerSupabaseClient } from '@/lib/supabase/server';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import FeaturedProducts, { type Product } from '@/components/FeaturedProducts';
import EngagementsSection from '@/components/EngagementsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface MifaProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  category?: string;
  images?: string[];
  stock?: number;
  featured?: boolean;
  shipping_days?: number;
  active?: boolean;
}

interface SimpleProduct {
  id: number;
  name: string;
  price_cfa: number;
  original_price_cfa?: number;
  stock?: number;
  category?: string;
  image_url?: string;
  active?: boolean;
}

interface MifaCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  sort_order?: number;
  active?: boolean;
}

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  // Fetch featured products
  let products: Product[] = [];
  const { data: mifaData } = await supabase
    .from('mifa_products')
    .select('id,name,description,price,original_price,category,images,stock,featured,shipping_days')
    .eq('featured', true)
    .eq('active', true)
    .limit(8);

  if (mifaData && mifaData.length > 0) {
    products = (mifaData as MifaProduct[]).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      original_price: p.original_price,
      category: p.category,
      images: p.images,
      featured: p.featured,
      shipping_days: p.shipping_days,
      stock: p.stock,
    }));
  } else {
    const { data: simpleData } = await supabase
      .from('products')
      .select('id,name,price_cfa,original_price_cfa,stock,category,image_url')
      .eq('active', true)
      .limit(8);
    if (simpleData) {
      products = (simpleData as SimpleProduct[]).map((p) => ({
        id: p.id,
        name: p.name,
        price_cfa: p.price_cfa,
        original_price_cfa: p.original_price_cfa,
        category: p.category,
        image_url: p.image_url,
        stock: p.stock,
      }));
    }
  }

  // Fetch categories
  let categories: { name: string; slug: string; icon?: string | null }[] = [];
  const { data: catData } = await supabase
    .from('mifa_categories')
    .select('id,name,slug,icon')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (catData) {
    categories = (catData as MifaCategory[]).map((c) => ({
      name: c.name,
      slug: c.slug,
      icon: c.icon,
    }));
  }

  // Hero products (first 4 featured)
  const heroProducts = products.slice(0, 4).map((p) => ({
    id: p.id,
    name: p.name,
    price: (p.price ?? p.price_cfa) as number,
    image_url: p.image_url ?? (p.images?.[0]) ?? null,
  }));

  return (
    <>
      <HeroSection products={heroProducts} />
      <CategoriesSection categories={categories} />
      <EngagementsSection />
      <FeaturedProducts products={products} />
      <TestimonialsSection />

      {/* How it works */}
      <section id="how" className="section">
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <div className="sec-eyebrow">Simple &amp; rapide</div>
              <h2 className="sec-ti">Comment ça marche ?</h2>
            </div>
          </div>
          <div className="how-grid">
            {[
              { n: '1', title: 'Choisissez vos produits', sub: 'Parcourez notre catalogue et ajoutez vos articles au panier en un clic.' },
              { n: '2', title: 'Indiquez votre adresse', sub: 'Bamako, Sikasso, Mopti — nous livrons partout au Mali.' },
              { n: '3', title: 'Payez en toute sécurité', sub: 'Orange Money, Wave ou paiement à la livraison selon votre préférence.' },
              { n: '4', title: 'Recevez votre commande', sub: 'Livraison rapide et soignée directement à votre porte.' },
            ].map((s) => (
              <div key={s.n} className="how-card">
                <div className="how-num">{s.n}</div>
                <div className="how-ti">{s.title}</div>
                <div className="how-sub">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment banner */}
      <div id="pays">
        <div className="wrap">
          <div className="pays-inner">
            <div className="pay-item">
              <div className="pay-ico" style={{ background: '#FF6B00' }}>OM</div>
              <div className="pay-lbl">Orange Money</div>
            </div>
            <div className="pay-sep" />
            <div className="pay-item">
              <div className="pay-ico" style={{ background: '#0087C3' }}>Wave</div>
              <div className="pay-lbl">Wave</div>
            </div>
            <div className="pay-sep" />
            <div className="pay-item">
              <div className="pay-ico" style={{ background: '#2C3A3F' }}>Cash</div>
              <div className="pay-lbl">À la livraison</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust section */}
      <div id="trust">
        <div className="wrap">
          <div className="trust-grid">
            {[
              { ico: '🔒', ti: 'Paiement sécurisé', sub: 'Toutes les transactions sont cryptées et protégées.' },
              { ico: '🚀', ti: 'Livraison rapide', sub: 'Bamako J+1 à J+2, reste du Mali 2 à 5 jours.' },
              { ico: '↩️', ti: 'Retours faciles', sub: '14 jours pour retourner un article, remboursement garanti.' },
              { ico: '📞', ti: 'Support 7j/7', sub: 'Notre équipe est disponible tous les jours pour vous aider.' },
            ].map((t) => (
              <div key={t.ti} className="trust-card">
                <div className="trust-ico" style={{ fontSize: 18 }}>{t.ico}</div>
                <div>
                  <div className="trust-ti">{t.ti}</div>
                  <div className="trust-sub">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div id="cta-band">
        <div className="cta-geo a" />
        <div className="cta-geo b" />
        <div className="cta-in">
          <h2 className="cta-ti">Prêt à découvrir nos produits ?</h2>
          <p className="cta-sub">
            Des centaines d&apos;articles soigneusement sélectionnés vous attendent.
            Paiement simple, livraison fiable.
          </p>
          <div className="cta-btns">
            <Link href="/shop" className="cta-btn white">
              🛍️ Voir la boutique
            </Link>
            <Link href="/login" className="cta-btn outline">
              Créer un compte gratuit
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

