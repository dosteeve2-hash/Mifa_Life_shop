'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useCart as useBoutiqueCart } from '@/context/CartContext';
import { useCart as usePanierCart } from '@/hooks/useCart';
import { placeOrderAction } from '@/actions/checkout';

function formatPrice(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

const CITIES = ['Bamako', 'Sikasso', 'Mopti', 'Gao', 'Tombouctou', 'Kayes', 'Kidal', 'Koulikoro', 'Ségou'];
const LIVRAISON_FIXE = 2500;
const LIVRAISON_SEUIL = 50000;

type PayMethod = 'orange' | 'wave' | 'cash';
const STEPS = ['Informations', 'Livraison', 'Paiement'];

/* ── Inner component (uses useSearchParams) ── */
function CheckoutInner() {
  const params = useSearchParams();
  const isPanierSource = params.get('source') === 'panier';

  const boutique = useBoutiqueCart();
  const panierCart = usePanierCart();

  // Determine which cart to use
  const cartItems = isPanierSource
    ? panierCart.items.map(i => ({ id: 0, name: i.nom, price_cfa: i.prix, quantity: i.quantite, image_url: i.image ?? null }))
    : boutique.items.map(i => ({ id: i.id, name: i.name, price_cfa: i.price_cfa, quantity: i.quantity, image_url: i.image_url }));
  const cartTotal = isPanierSource ? panierCart.total : boutique.totalPrice;
  const cartCount = isPanierSource ? panierCart.count : boutique.totalItems;
  const doClearCart = isPanierSource ? panierCart.clearCart : boutique.clearCart;

  const fraisLivraison = cartTotal >= LIVRAISON_SEUIL ? 0 : LIVRAISON_FIXE;
  const totalFinal = cartTotal + fraisLivraison;

  const [step, setStep] = useState(0);

  // Step 0 — Informations client
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [ville, setVille] = useState('');

  // Step 1 — Livraison
  const [adresse, setAdresse] = useState('');
  const [quartier, setQuartier] = useState('');
  const [instructions, setInstructions] = useState('');

  // Step 2 — Paiement
  const [payMethod, setPayMethod] = useState<PayMethod>('orange');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const validateStep0 = () => {
    const e: Record<string, string> = {};
    if (!nom.trim()) e.nom = 'Requis';
    if (!prenom.trim()) e.prenom = 'Requis';
    if (!telephone.trim() || telephone.length < 8) e.telephone = 'Numéro invalide';
    if (!ville) e.ville = 'Choisissez une ville';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!adresse.trim()) e.adresse = 'Requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = async () => {
    setConfirming(true);
    setErrors({});

    // Vendor (panier) flow — no DB insert needed
    if (isPanierSource) {
      await new Promise(r => setTimeout(r, 800)); // simulate
      doClearCart();
      toast.success('Commande reçue ! Nous vous contacterons sous 24h.', { duration: 5000 });
      setConfirmed(true);
      setConfirmedOrderId('panier-' + Date.now().toString(36));
      setConfirming(false);
      return;
    }

    // Boutique flow — DB insert
    const result = await placeOrderAction({
      items: cartItems.map(i => ({ id: i.id, name: i.name, price_cfa: i.price_cfa, quantity: i.quantity })),
      total: cartTotal,
      paymentMethod: payMethod,
      shipping: { firstName: prenom, lastName: nom, phone: telephone, city: ville, address: adresse, quarter: quartier },
    });

    if (result.ok) {
      doClearCart();
      setConfirmedOrderId(result.orderId);
      toast.success('Commande confirmée !', { duration: 4000 });
      setConfirmed(true);
    } else {
      setErrors({ general: result.error ?? 'Erreur lors de la commande' });
    }
    setConfirming(false);
  };

  /* ── Confirmation screen ── */
  if (confirmed) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 20, textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(22,163,74,.1)', border: '3px solid #16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}
        >
          ✓
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--t1)', marginBottom: 10 }}>
            Commande confirmée !
          </h1>
          <p style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 6 }}>
            Merci {prenom} ! Votre commande a bien été enregistrée.
          </p>
          {confirmedOrderId && (
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--em)', marginBottom: 20 }}>
              N° : #{confirmedOrderId.slice(-8).toUpperCase()}
            </p>
          )}
          <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 24 }}>
            Notre équipe vous contactera dans les 24h pour confirmer votre livraison.
          </p>
          <Link
            href="/shop"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}
          >
            Continuer mes achats →
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ── Empty cart ── */
  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16, textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>Votre panier est vide</h2>
        <Link href={isPanierSource ? '/panier' : '/cart'} style={{ color: 'var(--em)', fontWeight: 600 }}>
          ← Retour au panier
        </Link>
      </div>
    );
  }

  const slideVariants = {
    initial: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  const inputStyle = (hasError?: boolean) => ({
    width: '100%',
    padding: '10px 14px',
    border: `1.5px solid ${hasError ? '#dc2626' : 'var(--border2)'}`,
    borderRadius: 9,
    fontSize: 13,
    background: 'var(--bg)',
    color: 'var(--t1)',
    outline: 'none',
  });

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    color: 'var(--t3)',
    marginBottom: 6,
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'initial' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: i <= step ? 'var(--em)' : 'var(--bg4)',
                color: i <= step ? '#fff' : 'var(--t3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, flexShrink: 0,
                border: i === step ? '3px solid var(--em-d)' : 'none',
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: i === step ? 'var(--em)' : 'var(--t3)' }}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < step ? 'var(--em)' : 'var(--bg4)', margin: '0 12px', borderRadius: 1 }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, alignItems: 'start' }}>

          {/* Form */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ background: 'var(--bg3)', borderRadius: 16, border: '1.5px solid var(--border)', padding: 'clamp(20px,4vw,36px)', overflow: 'hidden' }}>
              <AnimatePresence mode="wait" custom={1}>

                {/* ── Step 0: Informations client ── */}
                {step === 0 && (
                  <motion.div key="step0" custom={1} variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.28 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)', marginBottom: 24 }}>
                      Informations client
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      {([
                        { label: 'Nom', value: nom, set: setNom, key: 'nom', placeholder: 'Coulibaly' },
                        { label: 'Prénom', value: prenom, set: setPrenom, key: 'prenom', placeholder: 'Ibrahim' },
                      ] as const).map((f) => (
                        <div key={f.key}>
                          <label style={labelStyle}>{f.label}</label>
                          <input
                            type="text"
                            value={f.value}
                            onChange={(e) => f.set(e.target.value)}
                            placeholder={f.placeholder}
                            style={inputStyle(!!errors[f.key])}
                          />
                          {errors[f.key] && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>{errors[f.key]}</p>}
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <label style={labelStyle}>Téléphone (Orange Money / Wave)</label>
                      <input
                        type="tel"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder="+223 7x xxx xxx"
                        style={inputStyle(!!errors.telephone)}
                      />
                      {errors.telephone && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>{errors.telephone}</p>}
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <label style={labelStyle}>Ville</label>
                      <select
                        value={ville}
                        onChange={(e) => setVille(e.target.value)}
                        style={{ ...inputStyle(!!errors.ville), color: ville ? 'var(--t1)' : 'var(--t3)' }}
                      >
                        <option value="">Choisissez une ville</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.ville && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>{errors.ville}</p>}
                    </div>

                    <button
                      onClick={() => { if (validateStep0()) setStep(1); }}
                      style={{ width: '100%', marginTop: 24, padding: '13px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >
                      Continuer → Livraison
                    </button>
                  </motion.div>
                )}

                {/* ── Step 1: Livraison ── */}
                {step === 1 && (
                  <motion.div key="step1" custom={1} variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.28 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)', marginBottom: 24 }}>
                      Adresse de livraison
                    </h2>

                    <div style={{ marginBottom: 14 }}>
                      <label style={labelStyle}>Adresse</label>
                      <input
                        type="text"
                        value={adresse}
                        onChange={(e) => setAdresse(e.target.value)}
                        placeholder="Rue, numéro..."
                        style={inputStyle(!!errors.adresse)}
                      />
                      {errors.adresse && <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4 }}>{errors.adresse}</p>}
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <label style={labelStyle}>Quartier (optionnel)</label>
                      <input
                        type="text"
                        value={quartier}
                        onChange={(e) => setQuartier(e.target.value)}
                        placeholder="Hamdallaye, Badalabougou..."
                        style={inputStyle()}
                      />
                    </div>

                    <div style={{ marginBottom: 14 }}>
                      <label style={labelStyle}>Instructions de livraison (optionnel)</label>
                      <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Près de la mosquée, 2e porte à gauche..."
                        rows={3}
                        style={{ ...inputStyle(), resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                      <button onClick={() => setStep(0)} style={{ flex: 1, padding: 13, border: '1.5px solid var(--border2)', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'var(--bg3)', color: 'var(--t2)', cursor: 'pointer' }}>
                        ← Retour
                      </button>
                      <button onClick={() => { if (validateStep1()) setStep(2); }} style={{ flex: 2, padding: 13, background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                        Continuer → Paiement
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 2: Paiement ── */}
                {step === 2 && (
                  <motion.div key="step2" custom={1} variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.28 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)', marginBottom: 24 }}>
                      Mode de paiement
                    </h2>

                    {([
                      { id: 'orange' as PayMethod, label: 'Orange Money', desc: 'Paiement mobile sécurisé', color: '#FF6B00', emoji: '📱' },
                      { id: 'wave'   as PayMethod, label: 'Wave',         desc: 'Application de paiement Wave', color: '#0087C3', emoji: '🌊' },
                      { id: 'cash'   as PayMethod, label: 'Espèces à la livraison', desc: 'Payez en cash à la réception', color: '#16a34a', emoji: '💵' },
                    ] as const).map(m => (
                      <button
                        key={m.id}
                        onClick={() => setPayMethod(m.id)}
                        style={{
                          width: '100%', padding: 16, borderRadius: 12,
                          border: `2px solid ${payMethod === m.id ? m.color : 'var(--border)'}`,
                          background: payMethod === m.id ? `${m.color}12` : 'var(--bg3)',
                          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12,
                          cursor: 'pointer', textAlign: 'left',
                        }}
                      >
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: `${m.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                          {m.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{m.label}</div>
                          <div style={{ fontSize: 12, color: 'var(--t3)' }}>{m.desc}</div>
                        </div>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${payMethod === m.id ? m.color : 'var(--border2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {payMethod === m.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />}
                        </div>
                      </button>
                    ))}

                    {/* Récapitulatif livraison */}
                    <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 14, marginTop: 4, marginBottom: 16, fontSize: 13, color: 'var(--t2)' }}>
                      <p style={{ fontWeight: 600, color: 'var(--t1)', marginBottom: 4 }}>{prenom} {nom} — {telephone}</p>
                      <p>{adresse}{quartier ? `, ${quartier}` : ''} · {ville}</p>
                      {instructions && <p style={{ color: 'var(--t3)', marginTop: 4 }}>{instructions}</p>}
                    </div>

                    {errors.general && (
                      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 9, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 14 }}>
                        {errors.general}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={() => setStep(1)} style={{ flex: 1, padding: 13, border: '1.5px solid var(--border2)', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'var(--bg3)', color: 'var(--t2)', cursor: 'pointer' }}>
                        ← Retour
                      </button>
                      <button
                        onClick={handleConfirm}
                        disabled={confirming}
                        style={{ flex: 2, padding: 13, background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', cursor: confirming ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: confirming ? 0.85 : 1 }}
                      >
                        {confirming ? (
                          <>
                            <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                            Confirmation...
                          </>
                        ) : '✓ Confirmer la commande'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: 'var(--t3)' }}>
              <Link href={isPanierSource ? '/panier' : '/cart'} style={{ color: 'inherit', textDecoration: 'underline' }}>
                ← Retour au panier
              </Link>
            </p>
          </div>

          {/* Order summary */}
          <div style={{ background: 'var(--bg3)', borderRadius: 16, border: '1px solid var(--border)', padding: 24, position: 'sticky', top: 100 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)', marginBottom: 16 }}>
              Résumé ({cartCount} art.)
            </h2>

            <div style={{ marginBottom: 16 }}>
              {cartItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--t2)', marginBottom: 8 }}>
                  <span style={{ flex: 1, marginRight: 8 }}>{item.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 600, flexShrink: 0 }}>{formatPrice(item.price_cfa * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--t3)', marginBottom: 8 }}>
                <span>Sous-total</span>
                <span style={{ fontWeight: 600, color: 'var(--t1)' }}>{formatPrice(cartTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--t3)', marginBottom: 12 }}>
                <span>Livraison</span>
                <span style={{ fontWeight: 600, color: fraisLivraison === 0 ? 'var(--green)' : 'var(--em)' }}>
                  {fraisLivraison === 0 ? 'Gratuite 🎉' : formatPrice(fraisLivraison)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: 'var(--t1)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--em)' }}>{formatPrice(totalFinal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Page export wrapped in Suspense (required for useSearchParams) ── */
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--border2)', borderTop: '3px solid var(--em)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <CheckoutInner />
    </Suspense>
  );
}
