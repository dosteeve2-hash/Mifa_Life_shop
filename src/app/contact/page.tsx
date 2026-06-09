'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const FAQS = [
  { q: 'Quels sont vos délais de livraison ?', a: 'Bamako : 1 à 2 jours. Reste du Mali : 2 à 5 jours ouvrés.' },
  { q: 'Comment suivre ma commande ?', a: 'Rendez-vous sur /track et entrez votre numéro de commande.' },
  { q: 'Quels modes de paiement acceptez-vous ?', a: 'Orange Money, Wave, Moov Money et paiement à la livraison.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--sl3)', padding: 'clamp(28px,5vw,56px) 0' }}>
        <div className="wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14, fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>
            <Link href="/" style={{ color: 'inherit' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>Contact</span>
          </div>
          <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 'clamp(24px,5vw,38px)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Contactez-nous
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
            Notre équipe est disponible 7j/7 pour vous aider.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 32 }}>
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ background: 'var(--white)', borderRadius: 16, padding: 'clamp(20px,4vw,32px)', boxShadow: 'var(--sh-m)' }}
          >
            {sent ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--em-l)', border: '2px solid var(--em-g)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>✓</div>
                <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: 'var(--sl)', marginBottom: 8 }}>Message envoyé !</h2>
                <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 20 }}>Nous vous répondrons dans les 24 heures.</p>
                <button onClick={() => setSent(false)} style={{ padding: '10px 20px', background: 'var(--em)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                  Nouveau message
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: 'var(--sl)', marginBottom: 20 }}>Envoyer un message</h2>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      { label: 'Votre nom', name: 'name', type: 'text', placeholder: 'Amadou Diallo' },
                      { label: 'Email', name: 'email', type: 'email', placeholder: 'vous@exemple.com' },
                    ].map((f) => (
                      <div key={f.name}>
                        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--t3)', marginBottom: 6 }}>{f.label}</label>
                        <input
                          name={f.name} type={f.type} placeholder={f.placeholder} required
                          value={form[f.name as keyof typeof form]}
                          onChange={handle}
                          style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--bg3)', borderRadius: 9, fontSize: 13, color: 'var(--t1)', background: 'var(--bg)', outline: 'none', transition: 'border-color .2s' }}
                          onFocus={(e) => (e.target.style.borderColor = 'var(--em)')}
                          onBlur={(e) => (e.target.style.borderColor = 'var(--bg3)')}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--t3)', marginBottom: 6 }}>Sujet</label>
                    <select
                      name="subject" value={form.subject} onChange={handle} required
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--bg3)', borderRadius: 9, fontSize: 13, color: 'var(--t1)', background: 'var(--bg)', outline: 'none' }}
                    >
                      <option value="">Choisissez un sujet</option>
                      <option>Commande / Livraison</option>
                      <option>Retour / Remboursement</option>
                      <option>Paiement</option>
                      <option>Produit / Catalogue</option>
                      <option>Devenir vendeur</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--t3)', marginBottom: 6 }}>Message</label>
                    <textarea
                      name="message" placeholder="Décrivez votre demande..." required rows={5}
                      value={form.message} onChange={handle}
                      style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--bg3)', borderRadius: 9, fontSize: 13, color: 'var(--t1)', background: 'var(--bg)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color .2s' }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--em)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--bg3)')}
                    />
                  </div>
                  <button
                    type="submit" disabled={loading}
                    style={{ padding: '12px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background .2s', opacity: loading ? .7 : 1 }}
                  >
                    {loading ? <><span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} /> Envoi...</> : '→ Envoyer le message'}
                  </button>
                </form>
              </>
            )}
          </motion.div>

          {/* Sidebar info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '📍', title: 'Adresse', lines: ['Bamako, Mali', 'Hamdallaye ACI 2000'] },
              { icon: '📞', title: 'Téléphone', lines: ['+223 70 00 00 00', '+223 66 00 00 00'] },
              { icon: '✉️', title: 'Email', lines: ['contact@mifa-life.com', 'support@mifa-life.com'] },
              { icon: '🕐', title: 'Horaires', lines: ['Lun–Sam : 8h–20h', 'Dim : 9h–17h'] },
            ].map((info, i) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{ background: 'var(--white)', borderRadius: 12, padding: '18px 20px', boxShadow: 'var(--sh-s)', display: 'flex', gap: 14, alignItems: 'flex-start' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--em-l)', border: '1px solid var(--em-g)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{info.icon}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)', marginBottom: 4 }}>{info.title}</div>
                  {info.lines.map((l) => <div key={l} style={{ fontSize: 13, color: 'var(--t3)' }}>{l}</div>)}
                </div>
              </motion.div>
            ))}

            {/* Quick FAQ */}
            <div style={{ background: 'var(--white)', borderRadius: 12, padding: '18px 20px', boxShadow: 'var(--sh-s)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--t2)', marginBottom: 12 }}>Questions fréquentes</div>
              {FAQS.map((faq, i) => (
                <div key={i} style={{ borderTop: i > 0 ? '1px solid var(--bg3)' : 'none', paddingTop: i > 0 ? 10 : 0, marginTop: i > 0 ? 10 : 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', marginBottom: 4 }}>{faq.q}</div>
                  <div style={{ fontSize: 11, color: 'var(--t4)', lineHeight: 1.6 }}>{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
