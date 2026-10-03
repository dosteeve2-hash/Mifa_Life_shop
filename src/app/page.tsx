import { createServerSupabaseClient } from '@/lib/supabase/server';
import HeroSectionPremium from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import CategoriesSection from '@/components/CategoriesSection';
import FeaturedProducts, { type Product } from '@/components/FeaturedProducts';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface MifaProduct {
  id: string; name: string; description?: string; price: number;
  original_price?: number; category?: string; images?: string[];
  stock?: number; featured?: boolean; shipping_days?: number; active?: boolean;
}
interface SimpleProduct {
  id: number; name: string; price_cfa: number; original_price_cfa?: number;
  stock?: number; category?: string; image_url?: string; active?: boolean;
}
interface MifaCategory {
  id: string; name: string; slug: string; icon?: string;
  sort_order?: number; active?: boolean;
}

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  let products: Product[] = [];
  const { data: mifaData } = await supabase
    .from('mifa_products')
    .select('id,name,description,price,original_price,category,images,stock,featured,shipping_days')
    .eq('featured', true).eq('active', true).limit(8);

  if (mifaData && mifaData.length > 0) {
    products = (mifaData as MifaProduct[]).map((p) => ({
      id: p.id, name: p.name, price: p.price, original_price: p.original_price,
      category: p.category, images: p.images, featured: p.featured,
      shipping_days: p.shipping_days, stock: p.stock,
    }));
  } else {
    const { data: simpleData } = await supabase
      .from('products').select('id,name,price_cfa,original_price_cfa,stock,category,image_url')
      .eq('active', true).limit(8);
    if (simpleData) {
      products = (simpleData as SimpleProduct[]).map((p) => ({
        id: p.id, name: p.name, price_cfa: p.price_cfa, original_price_cfa: p.original_price_cfa,
        category: p.category, image_url: p.image_url, stock: p.stock,
      }));
    }
  }

  let categories: { name: string; slug: string; icon?: string | null }[] = [];
  const { data: catData } = await supabase
    .from('mifa_categories').select('id,name,slug,icon').eq('active', true)
    .order('sort_order', { ascending: true });
  if (catData) {
    categories = (catData as MifaCategory[]).map((c) => ({ name: c.name, slug: c.slug, icon: c.icon }));
  }

  return (
    <>
      {/* ── Premium Hero (navy/gold/cyan + GSAP) ── */}
      <HeroSectionPremium />

      {/* ── Catégories ── */}
      <div style={{ background: '#0c1a30' }}>
        <CategoriesSection categories={categories} />
      </div>

      {/* ── Features + Stats animés ── */}
      <FeaturesSection />

      {/* ── Produits vedettes avec ScrollTrigger ── */}
      <div style={{ background: '#0A1628' }}>
        <FeaturedProducts products={products} />
      </div>

      {/* ── Comment ça marche ── */}
      <section id="how" className="section" style={{ background: '#0c1a30' }}>
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
              { n: '2', title: 'Indiquez votre adresse', sub: 'Renseignez les informations demandées pour votre commande.' },
              { n: '3', title: 'Consultez les options disponibles', sub: 'Les modalités de commande sont présentées au cours du parcours.' },
              { n: '4', title: 'MVP — pilote recherché', sub: 'La boutique est en phase de MVP et recherche un pilote.' },
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

      {/* ── CTA final ── */}
      <div id="cta-band">
        <div className="cta-geo a" /><div className="cta-geo b" />
        <div className="cta-in">
          <h2 className="cta-ti">Prêt à découvrir nos produits ?</h2>
          <p className="cta-sub">Parcourez le catalogue MIFA Life Shop. Les prix sont affichés en FCFA.</p>
          <div className="cta-btns">
            <Link href="/shop" className="cta-btn white">🛍️ Voir la boutique</Link>
            <Link href="/login" className="cta-btn outline">Créer un compte gratuit</Link>
          </div>
        </div>
      </div>
    </>
  );
}
