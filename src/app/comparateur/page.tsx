'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { X, Plus, Check, Minus } from 'lucide-react';

let _sb: ReturnType<typeof createBrowserClient> | null = null;
function getSb() {
  if (!_sb) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    if (url && key) _sb = createBrowserClient(url, key);
  }
  return _sb;
}

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category?: string;
  rating?: number;
  reviews_count?: number;
  brand?: string;
  stock?: number;
  description?: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Tecno Spark 10', price: 65000, original_price: 72000, image_url: '', category: 'electronique', rating: 4.3, reviews_count: 128, brand: 'Tecno', stock: 15, description: 'Écran 6.8", 128GB, 4GB RAM, batterie 5000mAh' },
  { id: 'p2', name: 'Samsung Galaxy A05', price: 89000, original_price: 95000, image_url: '', category: 'electronique', rating: 4.5, reviews_count: 76, brand: 'Samsung', stock: 8, description: 'Écran 6.7", 64GB, 4GB RAM, triple capteur 50MP' },
  { id: 'p3', name: 'Itel A70', price: 42000, image_url: '', category: 'electronique', rating: 4.0, reviews_count: 204, brand: 'Itel', stock: 31, description: 'Écran 6.6", 128GB, 3GB RAM, batterie 5000mAh' },
];

const ATTRIBUTES = [
  { key: 'price',          label: 'Prix',           fmt: (v: unknown) => v ? `${Number(v).toLocaleString('fr')} FCFA` : '—' },
  { key: 'brand',          label: 'Marque',          fmt: (v: unknown) => String(v ?? '—') },
  { key: 'category',       label: 'Catégorie',       fmt: (v: unknown) => String(v ?? '—') },
  { key: 'rating',         label: 'Note',            fmt: (v: unknown) => v ? `${v}/5 ⭐` : '—' },
  { key: 'reviews_count',  label: 'Avis',            fmt: (v: unknown) => v ? `${v} avis` : '—' },
  { key: 'stock',          label: 'Disponibilité',   fmt: (v: unknown) => v && Number(v) > 0 ? '✅ En stock' : '❌ Épuisé' },
  { key: 'description',    label: 'Caractéristiques', fmt: (v: unknown) => String(v ?? '—') },
];

function getBest(products: Product[], key: keyof Product): string | null {
  if (!['price', 'rating', 'reviews_count', 'stock'].includes(key)) return null;
  const vals = products.map((p) => Number(p[key] ?? 0));
  if (vals.every((v) => v === 0)) return null;
  const best = key === 'price' ? Math.min(...vals.filter((v) => v > 0)) : Math.max(...vals);
  const idx = vals.indexOf(best);
  return products[idx]?.id ?? null;
}

export default function ComparateurPage() {
  const [selected, setSelected] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = getSb();
    if (!sb) { setLoading(false); return; }
    sb.from('mifa_products').select('id,name,price,original_price,image_url,category,rating,reviews_count,brand,stock,description')
      .limit(50).then(({ data }) => {
        if (data && data.length > 0) setAllProducts(data as Product[]);
        setLoading(false);
      });
  }, []);

  const addProduct = (p: Product) => {
    if (selected.length >= 3 || selected.find((s) => s.id === p.id)) return;
    setSelected((prev) => [...prev, p]);
    setShowPicker(false);
    setSearch('');
  };

  const removeProduct = (id: string) => setSelected((prev) => prev.filter((p) => p.id !== id));

  const filtered = allProducts.filter((p) =>
    !selected.find((s) => s.id === p.id) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || (p.category ?? '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--sl3) 0%, #1a3a2e 100%)', padding: 'clamp(24px,4vw,44px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(0,137,123,0.06)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 14 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <Link href="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Boutique</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Comparateur</span>
          </nav>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(22px,4vw,34px)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>Comparer les produits</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 460 }}>Ajoutez jusqu&apos;à 3 produits pour les comparer côte à côte.</p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 36, paddingBottom: 60 }}>
        {/* Product slots */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${selected.length < 3 ? selected.length + 1 : 3}, 1fr)`, gap: 16, marginBottom: 32, alignItems: 'stretch' }}>
          {selected.map((p) => (
            <div key={p.id} style={{ background: 'var(--white)', borderRadius: 14, border: '2px solid var(--em)', padding: '20px 16px', textAlign: 'center', position: 'relative' }}>
              <button onClick={() => removeProduct(p.id)} style={{ position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderRadius: '50%', background: 'var(--bg2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={12} color="var(--t3)" />
              </button>
              <div style={{ width: 64, height: 64, borderRadius: 10, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 28 }}>
                {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} /> : '📱'}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--sl)', marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--em)' }}>{p.price.toLocaleString('fr')} F</div>
            </div>
          ))}
          {selected.length < 3 && (
            <button onClick={() => setShowPicker(true)} style={{ background: 'var(--white)', borderRadius: 14, border: '2px dashed var(--bg3)', padding: '28px 16px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--em-l)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={20} color="var(--em)" />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t3)' }}>Ajouter un produit</span>
            </button>
          )}
        </div>

        {/* Product picker */}
        {showPicker && (
          <div style={{ background: 'var(--white)', borderRadius: 14, border: '1px solid var(--bg3)', padding: 20, marginBottom: 28 }}>
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit…"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--bg3)', borderRadius: 9, fontSize: 13, color: 'var(--t1)', background: 'var(--bg)', outline: 'none', marginBottom: 14 }}
            />
            {loading ? (
              <div style={{ textAlign: 'center', padding: 20, color: 'var(--t4)', fontSize: 13 }}>Chargement…</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
                {filtered.slice(0, 20).map((p) => (
                  <button key={p.id} onClick={() => addProduct(p)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid var(--bg3)', borderRadius: 9, cursor: 'pointer', background: 'var(--bg)', textAlign: 'left' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📦</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--sl)' }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--t4)' }}>{p.price.toLocaleString('fr')} FCFA · {p.category ?? '—'}</div>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 20, color: 'var(--t4)', fontSize: 13 }}>Aucun produit trouvé</div>}
              </div>
            )}
          </div>
        )}

        {/* Comparison table */}
        {selected.length >= 2 && (
          <div style={{ background: 'var(--white)', borderRadius: 16, border: '1px solid var(--bg3)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--bg3)' }}>
              <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 18, fontWeight: 700, color: 'var(--sl)', margin: 0 }}>Comparaison détaillée</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg2)' }}>
                    <th style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--t4)', textAlign: 'left', width: 160 }}>Critère</th>
                    {selected.map((p) => (
                      <th key={p.id} style={{ padding: '10px 16px', fontSize: 13, fontWeight: 700, color: 'var(--sl)', textAlign: 'left' }}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ATTRIBUTES.map(({ key, label, fmt }) => {
                    const bestId = getBest(selected, key as keyof Product);
                    return (
                      <tr key={key} style={{ borderBottom: '1px solid var(--bg2)' }}>
                        <td style={{ padding: '11px 16px', fontSize: 12, fontWeight: 700, color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</td>
                        {selected.map((p) => {
                          const isBest = bestId === p.id;
                          return (
                            <td key={p.id} style={{ padding: '11px 16px', fontSize: 13, color: 'var(--t2)', background: isBest ? 'rgba(0,137,123,0.04)' : undefined }}>
                              {isBest && <Check size={12} color="var(--em)" style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                              {fmt(p[key as keyof Product])}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* CTA row */}
            <div style={{ display: 'grid', gridTemplateColumns: `160px repeat(${selected.length}, 1fr)`, gap: 0 }}>
              <div />
              {selected.map((p) => (
                <div key={p.id} style={{ padding: '14px 16px', borderTop: '1px solid var(--bg3)' }}>
                  <Link href={`/shop/${p.id}`} style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'var(--em)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                    Voir le produit →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {selected.length === 0 && !showPicker && (
          <div style={{ textAlign: 'center', padding: 'clamp(40px,8vw,80px) 20px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>⚖️</div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 700, color: 'var(--sl)', marginBottom: 10 }}>Aucun produit sélectionné</h2>
            <p style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 24 }}>Cliquez sur &quot;Ajouter un produit&quot; pour démarrer votre comparaison.</p>
            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              Explorer la boutique →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
