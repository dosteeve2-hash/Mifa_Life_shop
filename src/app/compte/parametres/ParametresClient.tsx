'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import { Bell, Globe, Shield, Trash2, LogOut, Key, ChevronRight } from 'lucide-react';
import type { UserPrefs } from './page';

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
  user: { id: string; email: string };
  prefs: UserPrefs;
};

/* ── Charte ── */
const NAVY = '#0A1628';
const GOLD = '#D4AF37';
const CYAN = '#00BCD4';
const RED = '#EF4444';

/* ── Animations ── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 280, damping: 26 },
  },
};

/* ── Toggle Switch ── */
function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: checked ? GOLD : 'rgba(255,255,255,0.15)',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: 'spring' as const, stiffness: 500, damping: 30 }}
        style={{
          position: 'absolute',
          top: 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: checked ? NAVY : '#666',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }}
      />
    </button>
  );
}

/* ── Section Card ── */
function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
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
      <div
        style={{
          padding: '14px 24px',
          borderBottom: '1px solid rgba(212,175,55,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ color: GOLD, display: 'flex' }}>{icon}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: GOLD,
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ padding: 'clamp(16px,3vw,24px)' }}>{children}</div>
    </motion.div>
  );
}

/* ── Toggle Row ── */
function ToggleRow({
  label,
  description,
  checked,
  onChange,
  saving,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  saving: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '12px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 11, color: 'var(--t3)' }}>{description}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={saving} />
    </div>
  );
}

/* ── Select stylé ── */
function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--t3)',
        }}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          border: `1.5px solid rgba(212,175,55,0.25)`,
          borderRadius: 10,
          fontSize: 13,
          background: 'rgba(10,22,40,0.8)',
          color: 'var(--t1)',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
          paddingRight: 36,
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: '#0A1628' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ── Composant principal ── */
export default function ParametresClient({ user, prefs }: Props) {
  const router = useRouter();

  /* Notifications */
  const [notifCommandes, setNotifCommandes] = useState(prefs.notif_commandes);
  const [notifPromos, setNotifPromos] = useState(prefs.notif_promotions);
  const [notifNewsletter, setNotifNewsletter] = useState(prefs.notif_newsletter);

  /* Préférences */
  const [langue, setLangue] = useState(prefs.langue);
  const [devise, setDevise] = useState(prefs.devise);

  /* UI */
  const [saving, setSaving] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  /* ── Toast ── */
  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  /* ── Sauvegarde préférences ── */
  async function handleSave() {
    setSaving(true);
    try {
      const sb = getSB();
      if (!sb) throw new Error('Client Supabase indisponible');
      const { error } = await sb.from('user_preferences').upsert(
        {
          user_id: user.id,
          notif_commandes: notifCommandes,
          notif_promotions: notifPromos,
          notif_newsletter: notifNewsletter,
          langue,
          devise,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
      if (error) throw error;
      showToast('Paramètres enregistrés ✓', true);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde', false);
    } finally {
      setSaving(false);
    }
  }

  /* ── Reset mot de passe ── */
  async function handleResetPassword() {
    setSendingReset(true);
    try {
      const sb = getSB();
      if (!sb) throw new Error('Client Supabase indisponible');
      const { error } = await sb.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/compte/parametres`,
      });
      if (error) throw error;
      showToast('Email de réinitialisation envoyé ✓', true);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Erreur lors de l\'envoi', false);
    } finally {
      setSendingReset(false);
    }
  }

  /* ── Déconnexion ── */
  async function handleSignOut() {
    setSigningOut(true);
    try {
      const sb = getSB();
      if (!sb) throw new Error('Client Supabase indisponible');
      await sb.auth.signOut();
      router.push('/');
    } catch {
      setSigningOut(false);
      showToast('Erreur lors de la déconnexion', false);
    }
  }

  /* ── Bouton action ── */
  function ActionButton({
    onClick,
    loading,
    children,
    variant = 'default',
    icon,
  }: {
    onClick: () => void;
    loading?: boolean;
    children: React.ReactNode;
    variant?: 'default' | 'danger' | 'outline';
    icon?: React.ReactNode;
  }) {
    const colors = {
      default: { bg: GOLD, color: NAVY, border: GOLD },
      danger: { bg: RED, color: '#fff', border: RED },
      outline: { bg: 'transparent', color: 'var(--t2)', border: 'rgba(255,255,255,0.15)' },
    };
    const c = colors[variant];
    return (
      <button
        onClick={onClick}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '11px 20px',
          background: loading ? `${c.bg}90` : c.bg,
          color: c.color,
          border: `1.5px solid ${c.border}`,
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 700,
          cursor: loading ? 'wait' : 'pointer',
          transition: 'opacity 0.2s, transform 0.15s',
          letterSpacing: '0.03em',
          width: '100%',
        }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
      >
        {loading ? (
          <span
            style={{
              width: 14,
              height: 14,
              border: `2px solid ${c.color}40`,
              borderTop: `2px solid ${c.color}`,
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.7s linear infinite',
            }}
          />
        ) : icon}
        {loading ? 'Chargement…' : children}
      </button>
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
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(22px,4vw,30px)',
              fontWeight: 700,
              color: GOLD,
              marginBottom: 4,
            }}
          >
            Paramètres du compte
          </h1>
          <p style={{ fontSize: 13, color: 'var(--t3)' }}>
            Gérez vos notifications, préférences et sécurité
          </p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible">

          {/* ── NOTIFICATIONS ── */}
          <SectionCard icon={<Bell size={16} />} title="Notifications">
            <ToggleRow
              label="Commandes"
              description="Confirmations, expéditions et livraisons"
              checked={notifCommandes}
              onChange={setNotifCommandes}
              saving={saving}
            />
            <ToggleRow
              label="Promotions"
              description="Offres exclusives et ventes flash"
              checked={notifPromos}
              onChange={setNotifPromos}
              saving={saving}
            />
            <div style={{ padding: '12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 2 }}>
                    Newsletter
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--t3)' }}>
                    Actualités mode africaine et nouveautés
                  </div>
                </div>
                <Toggle checked={notifNewsletter} onChange={setNotifNewsletter} disabled={saving} />
              </div>
            </div>
          </SectionCard>

          {/* ── PRÉFÉRENCES ── */}
          <SectionCard icon={<Globe size={16} />} title="Préférences">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <SelectField
                label="Langue"
                value={langue}
                onChange={setLangue}
                options={[
                  { value: 'fr', label: '🇫🇷 Français' },
                  { value: 'en', label: '🇬🇧 English' },
                ]}
              />
              <SelectField
                label="Devise"
                value={devise}
                onChange={setDevise}
                options={[
                  { value: 'XOF', label: 'XOF — Franc CFA' },
                  { value: 'EUR', label: 'EUR — Euro' },
                  { value: 'USD', label: 'USD — Dollar' },
                ]}
              />
            </div>
          </SectionCard>

          {/* Bouton Enregistrer */}
          <motion.div variants={slideUp} style={{ marginBottom: 20 }}>
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
              }}
              onMouseEnter={(e) => { if (!saving) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
            >
              {saving ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: `2px solid ${NAVY}40`,
                      borderTop: `2px solid ${NAVY}`,
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                  Enregistrement…
                </>
              ) : (
                'Enregistrer les paramètres'
              )}
            </button>
          </motion.div>

          {/* ── SÉCURITÉ ── */}
          <SectionCard icon={<Shield size={16} />} title="Sécurité">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Compte actuel */}
              <div
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `${GOLD}18`,
                    border: `1.5px solid ${GOLD}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: GOLD,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 1 }}>Compte connecté</div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--t1)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.email}
                  </div>
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: `${CYAN}18`,
                    border: `1px solid ${CYAN}40`,
                    fontSize: 10,
                    fontWeight: 700,
                    color: CYAN,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    flexShrink: 0,
                  }}
                >
                  Actif
                </div>
              </div>

              {/* Changer mot de passe */}
              <ActionButton
                onClick={handleResetPassword}
                loading={sendingReset}
                icon={<Key size={14} />}
                variant="outline"
              >
                Changer le mot de passe
              </ActionButton>

              {/* Déconnexion */}
              <ActionButton
                onClick={handleSignOut}
                loading={signingOut}
                icon={<LogOut size={14} />}
                variant="outline"
              >
                Se déconnecter
              </ActionButton>
            </div>
          </SectionCard>

          {/* ── COMPTE — ZONE DANGER ── */}
          <SectionCard icon={<Trash2 size={16} />} title="Compte">
            <p style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 16, lineHeight: 1.6 }}>
              La suppression de votre compte est irréversible. Toutes vos commandes, préférences et
              données personnelles seront définitivement effacées.
            </p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 20px',
                  background: 'transparent',
                  color: RED,
                  border: `1.5px solid ${RED}60`,
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s, border-color 0.2s',
                  width: '100%',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${RED}12`;
                  e.currentTarget.style.borderColor = RED;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = `${RED}60`;
                }}
              >
                <Trash2 size={14} />
                Supprimer mon compte
              </button>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ type: 'spring' as const, stiffness: 320, damping: 28 }}
                  style={{
                    padding: 16,
                    background: `${RED}0c`,
                    border: `1.5px solid ${RED}40`,
                    borderRadius: 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: RED,
                      marginBottom: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    ⚠️ Êtes-vous certain·e de vouloir supprimer votre compte ?
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 16 }}>
                    Cette action est définitive et ne peut pas être annulée.
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: 'transparent',
                        color: 'var(--t2)',
                        border: '1.5px solid rgba(255,255,255,0.15)',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => {
                        showToast('Contactez le support pour supprimer votre compte.', false);
                        setShowDeleteConfirm(false);
                      }}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: RED,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Trash2 size={13} />
                      Confirmer la suppression
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </SectionCard>

          {/* Lien retour profil */}
          <motion.div variants={slideUp}>
            <Link
              href="/profil"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 20px',
                background: `linear-gradient(145deg, ${NAVY} 0%, #0f1e3a 100%)`,
                border: `1px solid rgba(212,175,55,0.18)`,
                borderRadius: 14,
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--t2)',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s',
                marginBottom: 20,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${GOLD}50`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.18)'; }}
            >
              <span>Retour au profil</span>
              <ChevronRight size={14} style={{ color: GOLD }} />
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
              position: 'fixed',
              bottom: 28,
              left: '50%',
              transform: 'translateX(-50%)',
              background: toast.ok ? '#0a2e1a' : '#2e0a0a',
              border: `1.5px solid ${toast.ok ? '#22d98a' : RED}`,
              color: toast.ok ? '#22d98a' : RED,
              padding: '12px 24px',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
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
