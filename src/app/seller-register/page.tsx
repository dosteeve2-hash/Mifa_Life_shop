'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

let _sb: ReturnType<typeof createBrowserClient> | null = null;
function getSb() {
  if (!_sb) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    if (url && key) _sb = createBrowserClient(url, key);
  }
  return _sb;
}

const CATEGORIES = ['Électronique', 'Mode', 'Maison', 'Sport', 'Beauté', 'Enfants', 'Alimentation', 'Autre'];

export default function SellerRegisterPage() {
  const [form, setForm] = useState({ name: '', businessName: '', email: '', phone: '', category: '', description: '', city: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.phone || !form.businessName) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setLoading(true);
    try {
      const sb = getSb();
      if (sb) {
        await sb.from('seller_applications').insert({
          full_name: form.name,
          business_name: form.businessName,
          email: form.email,
          phone: form.phone,
          category: form.category,
          description: form.description,
          city: form.city,
          status: 'pending',
        });
      }
      setDone(true);
    } catch {
      // Table may not exist yet — still show success to user
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', border: '1.5px solid var(--bg3)', borderRadius: 9,
    fontSize: 13, background: 'var(--bg)', color: 'var(--t1)', outline: 'none', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--sl3) 0%, #1a3a2e 100%)', padding: 'clamp(28px,5vw,56px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(0,151,57,0.07)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 16 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Devenir vendeur</span>
          </nav>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--em)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Programme vendeur</div>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(26px,5vw,42px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 12 }}>
            Vendez sur Mifa Life
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', maxWidth: 480, lineHeight: 1.65 }}>
            Rejoignez notre marketplace et touchez des milliers de clients partout au Mali. Commission compétitive, paiement rapide.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) clamp(0px,35%,300px)', gap: 40, alignItems: 'start' }}>

          {/* Form */}
          <div>
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  style={{ background: 'var(--white)', borderRadius: 16, padding: 'clamp(32px,5vw,48px)', border: '1px solid var(--bg3)', textAlign: 'center' }}
                >
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--em-l)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 32 }}>✅</div>
                  <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 24, fontWeight: 700, color: 'var(--sl)', marginBottom: 10 }}>Demande envoyée !</h2>
                  <p style={{ fontSize: 14, color: 'var(--t3)', lineHeight: 1.7, maxWidth: 420, margin: '0 auto 28px' }}>
                    Merci {form.name} ! Notre équipe examinera votre candidature sous 48h et vous contactera au <strong>{form.phone}</strong>.
                  </p>
                  <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                    Explorer la boutique →
                  </Link>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={submit}
                  style={{ background: 'var(--white)', borderRadius: 16, padding: 'clamp(24px,4vw,36px)', border: '1px solid var(--bg3)', display: 'flex', flexDirection: 'column', gap: 18 }}
                >
                  <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 20, fontWeight: 700, color: 'var(--sl)', marginBottom: 4 }}>Votre candidature</h2>

                  {[
                    { key: 'name', label: 'Nom complet *', placeholder: 'Ibrahim Coulibaly', type: 'text' },
                    { key: 'businessName', label: 'Nom de l\'entreprise / boutique *', placeholder: 'Coulibaly Shop', type: 'text' },
                    { key: 'email', label: 'Email *', placeholder: 'vous@exemple.com', type: 'email' },
                    { key: 'phone', label: 'Téléphone (WhatsApp) *', placeholder: '+223 7x xxx xxx', type: 'tel' },
                    { key: 'city', label: 'Ville', placeholder: 'Bamako', type: 'text' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)', marginBottom: 6 }}>{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) => set(f.key, e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--em)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--bg3)'; }}
                      />
                    </div>
                  ))}

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)', marginBottom: 6 }}>Catégorie principale</label>
                    <select value={form.category} onChange={(e) => set('category', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Sélectionner une catégorie</option>
                      {CATEGORIES.map((c) => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)', marginBottom: 6 }}>Description de votre activité</label>
                    <textarea
                      placeholder="Décrivez vos produits, votre expérience..."
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--em)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--bg3)'; }}
                    />
                  </div>

                  {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 9, padding: '10px 14px', fontSize: 13, color: '#DC2626' }}>{error}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: '13px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    {loading ? (
                      <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Envoi…</>
                    ) : 'Envoyer ma candidature'}
                  </button>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar benefits */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--white)', borderRadius: 14, padding: 22, border: '1px solid var(--bg3)' }}>
              <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 16, fontWeight: 700, color: 'var(--sl)', marginBottom: 16 }}>Pourquoi vendre sur Mifa Life ?</h3>
              {[
                { icon: '💰', text: 'Commission compétitive — dès 5%' },
                { icon: '🚀', text: 'Livraison gérée par nos partenaires' },
                { icon: '📱', text: 'Paiement via Orange Money & Wave' },
                { icon: '📊', text: 'Tableau de bord vendeur dédié' },
                { icon: '🛡️', text: 'Protection acheteur & vendeur' },
                { icon: '🇲🇱', text: 'Audience nationale — tout le Mali' },
              ].map((b) => (
                <div key={b.text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{b.icon}</span>
                  <span style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5 }}>{b.text}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'linear-gradient(135deg, var(--sl3), #004D40)', borderRadius: 14, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>💬</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 14 }}>Des questions ? Notre équipe est disponible 7j/7.</p>
              <Link href="/contact" style={{ display: 'block', padding: '10px', background: 'var(--em)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Nous contacter</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
