'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { placeOrderAction } from '@/actions/checkout';

function formatPrice(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

const CITIES = ['Bamako', 'Sikasso', 'Mopti', 'Gao', 'Tombouctou', 'Kayes', 'Kidal', 'Koulikoro', 'Ségou'];

type PayMethod = 'orange' | 'wave' | 'cash';

const STEPS = ['Livraison', 'Paiement', 'Confirmation'];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(0);

  // Step 1 form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [quarter, setQuarter] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2
  const [payMethod, setPayMethod] = useState<PayMethod>('orange');

  // Step 3
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'Requis';
    if (!lastName.trim()) e.lastName = 'Requis';
    if (!phone.trim() || phone.length < 8) e.phone = 'Numéro invalide';
    if (!city) e.city = 'Choisissez une ville';
    if (!address.trim()) e.address = 'Requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleConfirm = async () => {
    setConfirming(true);
    setErrors({});
    const result = await placeOrderAction({
      items: items.map((i) => ({ id: i.id, name: i.name, price_cfa: i.price_cfa, quantity: i.quantity })),
      total: totalPrice,
      paymentMethod: payMethod,
      shipping: { firstName, lastName, phone, city, address, quarter },
    });
    if (result.ok) {
      clearCart();
      setConfirmedOrderId(result.orderId);
      setConfirmed(true);
    } else {
      setErrors({ general: result.error ?? 'Erreur lors de la commande' });
    }
    setConfirming(false);
  };

  if (confirmed) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, gap: 20, textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--em-l)', border: '3px solid var(--em)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}
        >
          ✓
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, fontWeight: 700, color: 'var(--sl)', marginBottom: 10 }}>
            Commande confirmée !
          </h1>
          <p style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 6 }}>
            Merci {firstName} ! Votre commande a bien été enregistrée.
          </p>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--em)', marginBottom: 20 }}>
            N° de commande : #{'ML' + (confirmedOrderId ?? '').slice(0, 6).toUpperCase()}
          </p>
          <p style={{ fontSize: 13, color: 'var(--t4)', marginBottom: 24 }}>
            Vous recevrez une confirmation par SMS. Notre équipe vous contactera dans les 24h.
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

  const slideVariants = {
    initial: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 720 }}>
        {/* Steps indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'initial' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: i < step ? 'var(--em)' : i === step ? 'var(--em)' : 'var(--bg3)',
                color: i <= step ? '#fff' : 'var(--t4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, flexShrink: 0,
                border: i === step ? '3px solid var(--em-d)' : 'none',
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 600, color: i === step ? 'var(--em)' : 'var(--t4)' }}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < step ? 'var(--em)' : 'var(--bg3)', margin: '0 12px', borderRadius: 1 }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--white)', borderRadius: 'var(--rl)', border: '1.5px solid var(--bg3)', padding: 'clamp(20px,4vw,36px)', overflow: 'hidden' }}>
          <AnimatePresence mode="wait" custom={1}>
            {step === 0 && (
              <motion.div key="step0" custom={1} variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.28 }}>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 700, color: 'var(--sl)', marginBottom: 24 }}>
                  Adresse de livraison
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { label: 'Prénom', value: firstName, set: setFirstName, key: 'firstName', placeholder: 'Ibrahim' },
                    { label: 'Nom', value: lastName, set: setLastName, key: 'lastName', placeholder: 'Coulibaly' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)', marginBottom: 6 }}>{f.label}</label>
                      <input
                        type="text"
                        value={f.value}
                        onChange={(e) => f.set(e.target.value)}
                        placeholder={f.placeholder}
                        style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${errors[f.key] ? '#EF4444' : 'var(--bg3)'}`, borderRadius: 9, fontSize: 13, background: 'var(--bg)', color: 'var(--t1)', outline: 'none' }}
                      />
                      {errors[f.key] && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{errors[f.key]}</p>}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)', marginBottom: 6 }}>Téléphone (Orange Money / Wave)</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+223 7x xxx xxx" style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${errors.phone ? '#EF4444' : 'var(--bg3)'}`, borderRadius: 9, fontSize: 13, background: 'var(--bg)', color: 'var(--t1)', outline: 'none' }} />
                  {errors.phone && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{errors.phone}</p>}
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)', marginBottom: 6 }}>Ville</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${errors.city ? '#EF4444' : 'var(--bg3)'}`, borderRadius: 9, fontSize: 13, background: 'var(--bg)', color: city ? 'var(--t1)' : 'var(--t4)', outline: 'none' }}>
                    <option value="">Choisissez une ville</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.city && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{errors.city}</p>}
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)', marginBottom: 6 }}>Adresse</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rue, numéro..." style={{ width: '100%', padding: '10px 14px', border: `1.5px solid ${errors.address ? '#EF4444' : 'var(--bg3)'}`, borderRadius: 9, fontSize: 13, background: 'var(--bg)', color: 'var(--t1)', outline: 'none' }} />
                  {errors.address && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{errors.address}</p>}
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)', marginBottom: 6 }}>Quartier (optionnel)</label>
                  <input type="text" value={quarter} onChange={(e) => setQuarter(e.target.value)} placeholder="Hamdallaye, Badalabougou..." style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--bg3)', borderRadius: 9, fontSize: 13, background: 'var(--bg)', color: 'var(--t1)', outline: 'none' }} />
                </div>
                <button
                  onClick={() => { if (validateStep1()) setStep(1); }}
                  style={{ width: '100%', marginTop: 24, padding: '13px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  Continuer → Paiement
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" custom={1} variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.28 }}>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 700, color: 'var(--sl)', marginBottom: 24 }}>
                  Mode de paiement
                </h2>
                {([
                  { id: 'orange' as PayMethod, label: 'Orange Money', desc: 'Paiement mobile sécurisé', color: '#FF6B00', emoji: '📱' },
                  { id: 'wave' as PayMethod, label: 'Wave', desc: 'Application de paiement Wave', color: '#0087C3', emoji: '🌊' },
                  { id: 'cash' as PayMethod, label: 'Paiement à la livraison', desc: 'Payez en espèces à la réception', color: '#2C3A3F', emoji: '💵' },
                ] as const).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPayMethod(m.id)}
                    style={{
                      width: '100%', padding: 16, borderRadius: 12, border: `2px solid ${payMethod === m.id ? m.color : 'var(--bg3)'}`,
                      background: payMethod === m.id ? `${m.color}10` : 'var(--white)',
                      display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12, cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: `${m.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                      {m.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)' }}>{m.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--t3)' }}>{m.desc}</div>
                    </div>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${payMethod === m.id ? m.color : 'var(--bg3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {payMethod === m.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />}
                    </div>
                  </button>
                ))}
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button onClick={() => setStep(0)} style={{ flex: 1, padding: 13, border: '1.5px solid var(--bg3)', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'var(--white)', color: 'var(--t2)', cursor: 'pointer' }}>
                    ← Retour
                  </button>
                  <button onClick={() => setStep(2)} style={{ flex: 2, padding: 13, background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    Vérifier la commande →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" custom={1} variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.28 }}>
                <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 700, color: 'var(--sl)', marginBottom: 20 }}>
                  Confirmation
                </h2>
                {/* Summary */}
                <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Livraison</div>
                  <p style={{ fontSize: 13, color: 'var(--t2)' }}>{firstName} {lastName} · {phone}</p>
                  <p style={{ fontSize: 13, color: 'var(--t2)' }}>{address}{quarter ? `, ${quarter}` : ''} · {city}</p>
                </div>
                <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Paiement</div>
                  <p style={{ fontSize: 13, color: 'var(--t2)' }}>
                    {payMethod === 'orange' ? '📱 Orange Money' : payMethod === 'wave' ? '🌊 Wave' : '💵 Paiement à la livraison'}
                  </p>
                </div>
                <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Articles ({items.length})</div>
                  {items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--t2)', marginBottom: 6 }}>
                      <span>{item.name} × {item.quantity}</span>
                      <span style={{ fontWeight: 700 }}>{formatPrice(item.price_cfa * item.quantity)}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid var(--bg3)', paddingTop: 10, marginTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--em)' }}>{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                {errors.general && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 9, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 14 }}>
                    {errors.general}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setStep(1)} style={{ flex: 1, padding: 13, border: '1.5px solid var(--bg3)', borderRadius: 10, fontSize: 13, fontWeight: 600, background: 'var(--white)', color: 'var(--t2)', cursor: 'pointer' }}>
                    ← Retour
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={confirming}
                    style={{ flex: 2, padding: 13, background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, border: 'none', cursor: confirming ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  >
                    {confirming ? (
                      <>
                        <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                        Confirmation...
                      </>
                    ) : '✓ Confirmer la commande'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: 'var(--t4)' }}>
          <Link href="/cart" style={{ color: 'inherit', textDecoration: 'none' }}>← Retour au panier</Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
