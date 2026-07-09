'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useCart } from '@/context/CartContext';

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
const LIVRAISON_SEUIL = 50_000;
const LIVRAISON_PRIX  = 2_500;
const VILLES = ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Banfora', 'Autre'] as const;

type ModePaiement = 'livraison' | 'mobile_money';
interface FormData {
  prenom: string; nom: string; email: string; telephone: string;
  ville: string; adresse: string;
  mode_paiement: ModePaiement; numero_mobile_money: string;
}
type FormErrors = Partial<Record<keyof FormData, string>>;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

const inputBase: React.CSSProperties = {
  width: '100%', padding: '10px 14px', boxSizing: 'border-box',
  background: 'var(--bg2)', border: '1px solid var(--border2)',
  borderRadius: 8, color: 'var(--t1)', fontSize: 14,
  fontFamily: "'Outfit', sans-serif", outline: 'none',
};
const labelCss: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--t3)',
  marginBottom: 5, fontFamily: "'JetBrains Mono', monospace",
  textTransform: 'uppercase', letterSpacing: '.04em',
};
const errCss: React.CSSProperties = {
  fontSize: 11, color: 'var(--red, #ef4444)', marginTop: 3,
  fontFamily: "'JetBrains Mono', monospace",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const livraison = totalPrice >= LIVRAISON_SEUIL ? 0 : LIVRAISON_PRIX;
  const totalFinal = totalPrice + livraison;

  const [form, setForm] = useState<FormData>({
    prenom: '', nom: '', email: '', telephone: '',
    ville: '', adresse: '', mode_paiement: 'livraison', numero_mobile_money: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: undefined }));
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.prenom.trim()) e.prenom = 'Prénom requis';
    if (!form.nom.trim())    e.nom = 'Nom requis';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email valide requis';
    if (!form.telephone.trim()) e.telephone = 'Numéro requis';
    if (!form.ville)         e.ville = 'Ville requise';
    if (!form.adresse.trim()) e.adresse = 'Adresse requise';
    if (form.mode_paiement === 'mobile_money' && !form.numero_mobile_money.trim())
      e.numero_mobile_money = 'Numéro Mobile Money requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    try {
      const sb = getSupabase();
      if (sb) {
        await sb.from('commandes').insert({
          prenom: form.prenom, nom: form.nom, email: form.email,
          telephone: form.telephone, ville: form.ville, adresse: form.adresse,
          mode_paiement: form.mode_paiement,
          numero_mobile_money: form.numero_mobile_money || null,
          items: JSON.stringify(items), total: totalFinal,
          created_at: new Date().toISOString(),
        });
      }
    } catch { /* silencieux si Supabase non configuré */ }
    clearCart();
    router.push('/commande-confirmee');
  }

  function inp(field: keyof FormData): React.CSSProperties {
    return { ...inputBase, borderColor: errors[field] ? 'var(--red, #ef4444)' : 'var(--border2)' };
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="wrap" style={{ paddingTop: 28, paddingBottom: 72 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <Link href="/panier" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace", color: 'var(--t3)',
            textDecoration: 'none', marginBottom: 14,
          }}>
            <ArrowLeft size={13} /> Retour au panier
          </Link>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 900, fontStyle: 'italic',
            color: 'var(--t1)', margin: 0,
          }}>
            Finaliser la commande
          </h1>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: 28, alignItems: 'start',
          }}>

            {/* ── COLONNE GAUCHE : Formulaire ── */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .1 }}>
              <div style={{ background: 'var(--bg2)', borderRadius: 16, padding: 24, border: '1px solid var(--border2)' }}>
                <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: 'var(--t3)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Informations de livraison
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={labelCss}>Prénom *</label>
                    <input style={inp('prenom')} value={form.prenom} onChange={e => set('prenom', e.target.value)} placeholder="Kofi" />
                    {errors.prenom && <p style={errCss}>{errors.prenom}</p>}
                  </div>
                  <div>
                    <label style={labelCss}>Nom *</label>
                    <input style={inp('nom')} value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="Ouédraogo" />
                    {errors.nom && <p style={errCss}>{errors.nom}</p>}
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelCss}>Email *</label>
                  <input type="email" style={inp('email')} value={form.email} onChange={e => set('email', e.target.value)} placeholder="kofi@example.com" />
                  {errors.email && <p style={errCss}>{errors.email}</p>}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelCss}>Téléphone *</label>
                  <input style={inp('telephone')} value={form.telephone} onChange={e => set('telephone', e.target.value)} placeholder="+226 70 00 00 00" />
                  {errors.telephone && <p style={errCss}>{errors.telephone}</p>}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelCss}>Ville *</label>
                  <select style={inp('ville')} value={form.ville} onChange={e => set('ville', e.target.value)}>
                    <option value="">Sélectionner une ville</option>
                    {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  {errors.ville && <p style={errCss}>{errors.ville}</p>}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelCss}>Adresse de livraison *</label>
                  <textarea style={{ ...inp('adresse'), minHeight: 72, resize: 'vertical' }} value={form.adresse} onChange={e => set('adresse', e.target.value)} placeholder="Secteur 15, rue 12.34..." />
                  {errors.adresse && <p style={errCss}>{errors.adresse}</p>}
                </div>
                <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: 'var(--t3)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Mode de paiement
                </h3>
                {(['livraison', 'mobile_money'] as ModePaiement[]).map(mode => (
                  <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer', fontSize: 14, color: 'var(--t1)', fontFamily: "'Outfit', sans-serif" }}>
                    <input type="radio" name="mode_paiement" value={mode} checked={form.mode_paiement === mode} onChange={() => set('mode_paiement', mode)} style={{ accentColor: 'var(--gold, #C9A84C)', width: 16, height: 16 }} />
                    {mode === 'livraison' ? '💵 Paiement à la livraison' : '📱 Mobile Money (Moov / Orange)'}
                  </label>
                ))}
                {form.mode_paiement === 'mobile_money' && (
                  <div style={{ marginTop: 10 }}>
                    <label style={labelCss}>Numéro Mobile Money *</label>
                    <input style={inp('numero_mobile_money')} value={form.numero_mobile_money} onChange={e => set('numero_mobile_money', e.target.value)} placeholder="+226 60 00 00 00" />
                    {errors.numero_mobile_money && <p style={errCss}>{errors.numero_mobile_money}</p>}
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── COLONNE DROITE : Résumé commande ── */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .2 }}>
              <div style={{ background: 'var(--bg2)', borderRadius: 16, padding: 24, border: '1px solid var(--border2)', position: 'sticky', top: 100 }}>
                <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: 'var(--t3)', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '.06em', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShoppingBag size={14} /> Résumé de la commande
                </h2>
                {items.length === 0 ? (
                  <p style={{ color: 'var(--t3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Panier vide</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                    {items.map(item => (
                      <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {item.image_url && (
                          <Image src={item.image_url} alt={item.name} width={48} height={48} style={{ borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border2)' }} />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--t1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                          <p style={{ margin: 0, fontSize: 11, color: 'var(--t3)', fontFamily: "'JetBrains Mono', monospace" }}>x{item.quantity} — {fmt(item.price_cfa)}</p>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', whiteSpace: 'nowrap' }}>{fmt(item.price_cfa * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ borderTop: '1px solid var(--border2)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--t2)', marginBottom: 8 }}>
                    <span>Sous-total</span><span>{fmt(totalPrice)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: livraison === 0 ? 'var(--cyan, #06b6d4)' : 'var(--t2)', marginBottom: 12 }}>
                    <span>Livraison</span><span>{livraison === 0 ? '🎁 Gratuite' : fmt(livraison)}</span>
                  </div>
                  {livraison > 0 && (
                    <p style={{ fontSize: 11, color: 'var(--t3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 12 }}>
                      Livraison offerte dès {fmt(LIVRAISON_SEUIL)}
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: 'var(--t1)', marginBottom: 20 }}>
                    <span>Total</span><span style={{ color: 'var(--gold, #C9A84C)' }}>{fmt(totalFinal)}</span>
                  </div>
                  <button type="submit" disabled={submitting || items.length === 0} style={{
                    width: '100%', padding: '14px 20px', borderRadius: 12,
                    background: submitting ? 'var(--border2)' : 'var(--gold, #C9A84C)',
                    color: '#0a0a14', fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13, fontWeight: 700, border: 'none',
                    cursor: submitting || items.length === 0 ? 'not-allowed' : 'pointer',
                    letterSpacing: '.04em', transition: 'opacity .2s',
                    opacity: items.length === 0 ? .5 : 1,
                  }}>
                    {submitting ? 'Traitement…' : 'Confirmer la commande →'}
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        </form>
      </div>
    </div>
  );
}
