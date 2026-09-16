'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import type { ProfilData } from './page';

/* ── Supabase browser client (singleton) ── */
let _sb: ReturnType<typeof createBrowserClient> | null = null;
function getSB() {
  if (typeof window === 'undefined') return null;
  if (!_sb) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    _sb = createBrowserClient(url, key);
  }
  return _sb;
}

/* ── Types ── */
type Props = {
  userId: string;
  email: string;
  profil: ProfilData | null;
};

/* ── Animation variants ── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } },
};

/* ── Couleurs charte ── */
const NAVY = '#0A1628';
const GOLD = '#D4AF37';
const CYAN = '#00BCD4';

/* ── Composant input stylé ── */
function Field({
  label, value, onChange, type = 'text', placeholder, readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: `1.5px solid ${focused && !readOnly ? GOLD : 'var(--bg3)'}`,
          borderRadius: 10,
          fontSize: 13,
          background: readOnly ? 'var(--bg2)' : 'var(--bg)',
          color: readOnly ? 'var(--t3)' : 'var(--t1)',
          outline: 'none',
          transition: 'border-color 0.2s',
          cursor: readOnly ? 'not-allowed' : 'text',
        }}
      />
    </div>
  );
}

export default function ProfilClient({ userId, email, profil }: Props) {
  /* ── State ── */
  const [prenom, setPrenom] = useState(profil?.prenom ?? '');
  const [nom, setNom] = useState(profil?.nom ?? '');
  const [telephone, setTelephone] = useState(profil?.telephone ?? '');
  const [adresse1, setAdresse1] = useState(profil?.adresse_ligne1 ?? '');
  const [adresse2, setAdresse2] = useState(profil?.adresse_ligne2 ?? '');
  const [ville, setVille] = useState(profil?.ville ?? '');
  const [codePostal, setCodePostal] = useState(profil?.code_postal ?? '');
  const [pays, setPays] = useState(profil?.pays ?? "Côte d'Ivoire");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  /* ── Avatar initiales ── */
  const initiales = (prenom || nom || email)
    .split(/[\s@]/)
    .filter(Boolean)
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  /* ── Toast ── */
  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3200);
  }

  /* ── Sauvegarde ── */
  async function handleSave() {
    setSaving(true);
    try {
      const sb = getSB();
      if (!sb) throw new Error('Client Supabase indisponible');
      const { error } = await sb.from('profils').upsert(
        {
          user_id: userId,
          prenom: prenom.trim() || null,
          nom: nom.trim() || null,
          telephone: telephone.trim() || null,
          adresse_ligne1: adresse1.trim() || null,
          adresse_ligne2: adresse2.trim() || null,
          ville: ville.trim() || null,
          code_postal: codePostal.trim() || null,
          pays: pays.trim() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
      if (error) throw error;
      showToast('Profil enregistré avec succès ✓', true);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde', false);
    } finally {
      setSaving(false);
    }
  }

  /* ── Section card ── */
  function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <motion.div
        variants={slideUp}
        style={{
          background: `linear-gradient(145deg, ${NAVY} 0%, #0f1e3a 100%)`,
          border: `1px solid rgba(212,175,55,0.18)`,
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 20,
        }}
      >
        <div style={{ padding: '14px 24px', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: GOLD }}>
            {title}
          </span>
        </div>
        <div style={{ padding: 'clamp(16px,3vw,28px)' }}>{children}</div>
      </motion.div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      <div className="wrap" style={{ paddingTop: 36, maxWidth: 700 }}>

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 28 }}
        >
          <h1 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(22px,4vw,30px)',
            fontWeight: 700,
            color: GOLD,
            marginBottom: 4,
          }}>
            Mon profil
          </h1>
          <p style={{ fontSize: 13, color: 'var(--t3)' }}>
            Gérez vos informations personnelles et votre adresse de livraison
          </p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible">

          {/* Avatar + email */}
          <motion.div
            variants={slideUp}
            style={{
              background: `linear-gradient(145deg, ${NAVY} 0%, #0f1e3a 100%)`,
              border: `1px solid rgba(212,175,55,0.18)`,
              borderRadius: 16,
              padding: 'clamp(20px,3vw,28px)',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
            }}
          >
            {/* Avatar circulaire */}
            {profil?.avatar_url ? (
              <img
                src={profil.avatar_url}
                alt="Avatar"
                style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: `2.5px solid ${GOLD}`, flexShrink: 0 }}
              />
            ) : (
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: NAVY, border: `2.5px solid ${GOLD}`,
                color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 700, flexShrink: 0,
                fontFamily: '"Playfair Display", serif',
              }}>
                {initiales}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>
                {prenom || nom ? `${prenom} ${nom}`.trim() : email}
              </div>
              <div style={{ fontSize: 13, color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {email}
              </div>
              <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px', borderRadius: 20, background: `${CYAN}18`, border: `1px solid ${CYAN}40`, fontSize: 11, fontWeight: 700, color: CYAN, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Membre Mifa Life
              </div>
            </div>
          </motion.div>

          {/* Informations personnelles */}
          <SectionCard title="Informations personnelles">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Prénom" value={prenom} onChange={setPrenom} placeholder="Aminata" />
              <Field label="Nom" value={nom} onChange={setNom} placeholder="Koné" />
            </div>
            <div style={{ marginTop: 14 }}>
              <Field label="Téléphone" value={telephone} onChange={setTelephone} type="tel" placeholder="+225 07 00 000 000" />
            </div>
            <div style={{ marginTop: 14 }}>
              <Field label="Email (non modifiable)" value={email} readOnly />
            </div>
          </SectionCard>

          {/* Adresse de livraison */}
          <SectionCard title="Adresse de livraison">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Field label="Adresse ligne 1" value={adresse1} onChange={setAdresse1} placeholder="Rue ou quartier" />
              <Field label="Adresse ligne 2 (optionnel)" value={adresse2} onChange={setAdresse2} placeholder="Appartement, bâtiment..." />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Field label="Ville" value={ville} onChange={setVille} placeholder="Abidjan" />
                <Field label="Code postal" value={codePostal} onChange={setCodePostal} placeholder="01 BP..." />
              </div>
              <Field label="Pays" value={pays} onChange={setPays} placeholder="Côte d'Ivoire" />
            </div>
          </SectionCard>

          {/* Bouton Enregistrer */}
          <motion.div variants={slideUp}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: '100%',
                padding: '14px',
                background: saving ? `${GOLD}90` : GOLD,
                color: NAVY,
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 800,
                border: 'none',
                cursor: saving ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'opacity 0.2s, transform 0.15s',
                letterSpacing: '0.04em',
                marginBottom: 20,
              }}
              onMouseEnter={(e) => { if (!saving) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
            >
              {saving ? (
                <>
                  <span style={{ width: 16, height: 16, border: `2px solid ${NAVY}40`, borderTop: `2px solid ${NAVY}`, borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Enregistrement…
                </>
              ) : 'Enregistrer le profil'}
            </button>
          </motion.div>

          {/* Liens rapides */}
          <motion.div variants={slideUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
            <Link
              href="/orders"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px 20px',
                background: `linear-gradient(145deg, ${NAVY} 0%, #0f1e3a 100%)`,
                border: `1px solid rgba(212,175,55,0.18)`,
                borderRadius: 14,
                textDecoration: 'none',
                transition: 'border-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${GOLD}60`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.18)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${GOLD}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Mes commandes</div>
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>Historique</div>
              </div>
            </Link>
            <Link
              href="/wishlist"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px 20px',
                background: `linear-gradient(145deg, ${NAVY} 0%, #0f1e3a 100%)`,
                border: `1px solid rgba(212,175,55,0.18)`,
                borderRadius: 14,
                textDecoration: 'none',
                transition: 'border-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${CYAN}60`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.18)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${CYAN}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Ma wishlist</div>
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>Favoris</div>
              </div>
            </Link>
            <Link
              href="/compte/parametres"
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px 20px',
                background: `linear-gradient(145deg, ${NAVY} 0%, #0f1e3a 100%)`,
                border: `1px solid rgba(212,175,55,0.18)`,
                borderRadius: 14,
                textDecoration: 'none',
                transition: 'border-color 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${GOLD}60`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.18)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${GOLD}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)' }}>Paramètres</div>
                <div style={{ fontSize: 11, color: 'var(--t3)' }}>Notifications, sécurité</div>
              </div>
            </Link>
          </motion.div>

        </motion.div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring' as const, stiffness: 320, damping: 28 }}
            style={{
              position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
              background: toast.ok ? '#0a2e1a' : '#2e0a0a',
              border: `1.5px solid ${toast.ok ? '#22d98a' : '#ef4444'}`,
              color: toast.ok ? '#22d98a' : '#ef4444',
              padding: '12px 24px', borderRadius: 12,
              fontSize: 13, fontWeight: 700,
              boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              whiteSpace: 'nowrap',
              zIndex: 9999,
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
