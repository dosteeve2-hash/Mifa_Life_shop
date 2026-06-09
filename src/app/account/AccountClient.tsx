'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

type Props = {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
};

let _supabase: ReturnType<typeof createBrowserClient> | null = null;
function getSupabase() {
  if (typeof window === 'undefined') return null;
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    _supabase = createBrowserClient(url, key);
  }
  return _supabase;
}

export default function AccountClient({ userId, email, fullName, phone, role }: Props) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [nameVal, setNameVal] = useState(fullName);
  const [phoneVal, setPhoneVal] = useState(phone);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const initials = (fullName || email)
    .split(' ')
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  async function handleSave() {
    setSaving(true);
    setSaveMsg(null);
    setSaveErr(null);
    try {
      const sb = getSupabase();
      if (!sb) throw new Error('Client Supabase non disponible');
      const { error } = await sb
        .from('profiles')
        .upsert({ id: userId, full_name: nameVal.trim(), phone: phoneVal.trim() }, { onConflict: 'id' });
      if (error) throw error;
      setSaveMsg('Profil mis à jour !');
      setEditMode(false);
    } catch (err: unknown) {
      setSaveErr(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    startTransition(() => {
      router.push('/login');
      router.refresh();
    });
  }

  const roleLabel: Record<string, string> = {
    customer: 'Client',
    admin: 'Administrateur',
    seller: 'Vendeur',
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      <div className="wrap" style={{ paddingTop: 36, maxWidth: 680 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: 'var(--sl)', marginBottom: 4 }}>
            Mon compte
          </h1>
          <p style={{ fontSize: 13, color: 'var(--t4)' }}>Gérez votre profil et consultez vos commandes</p>
        </div>

        {/* Profile card */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--rl)', border: '1.5px solid var(--bg3)', overflow: 'hidden', marginBottom: 20 }}>

          {/* Mali stripe */}
          <div style={{ display: 'flex', height: 4 }}>
            <span style={{ flex: 1, background: 'var(--mg)' }} />
            <span style={{ flex: 1, background: 'var(--my)' }} />
            <span style={{ flex: 1, background: 'var(--mr)' }} />
          </div>

          <div style={{ padding: 'clamp(20px,4vw,32px)' }}>
            {/* Avatar + email */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--em) 0%, var(--em-d) 100%)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 700, flexShrink: 0, letterSpacing: '-0.02em',
                fontFamily: '"Playfair Display", serif',
              }}>
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {nameVal.trim() || email}
                </div>
                <div style={{ fontSize: 13, color: 'var(--t3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {email}
                </div>
                <span style={{
                  display: 'inline-block', marginTop: 6, padding: '2px 10px', fontSize: 11, fontWeight: 700,
                  borderRadius: 20, background: role === 'admin' ? 'var(--or-l)' : 'var(--em-l)',
                  color: role === 'admin' ? 'var(--or)' : 'var(--em)', textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {roleLabel[role] ?? role}
                </span>
              </div>
              {!editMode && (
                <button
                  onClick={() => { setEditMode(true); setSaveMsg(null); setSaveErr(null); }}
                  style={{ padding: '8px 16px', border: '1.5px solid var(--bg3)', borderRadius: 9, fontSize: 12, fontWeight: 700, color: 'var(--t2)', background: 'var(--bg)', cursor: 'pointer', flexShrink: 0 }}
                >
                  Modifier
                </button>
              )}
            </div>

            {/* Fields */}
            {!editMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="Nom complet" value={nameVal || '—'} />
                <Field label="Téléphone" value={phoneVal || '—'} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)', marginBottom: 6 }}>
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={nameVal}
                    onChange={(e) => setNameVal(e.target.value)}
                    placeholder="Ibrahim Coulibaly"
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--bg3)', borderRadius: 9, fontSize: 13, background: 'var(--bg)', color: 'var(--t1)', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--em)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--bg3)'; }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)', marginBottom: 6 }}>
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={phoneVal}
                    onChange={(e) => setPhoneVal(e.target.value)}
                    placeholder="+223 7x xxx xxx"
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--bg3)', borderRadius: 9, fontSize: 13, background: 'var(--bg)', color: 'var(--t1)', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--em)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--bg3)'; }}
                  />
                </div>

                {saveErr && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 9, padding: '10px 14px', fontSize: 13, color: '#DC2626' }}>
                    {saveErr}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button
                    onClick={() => { setEditMode(false); setNameVal(fullName); setPhoneVal(phone); setSaveErr(null); }}
                    style={{ flex: 1, padding: '10px', border: '1.5px solid var(--bg3)', borderRadius: 9, fontSize: 13, fontWeight: 600, background: 'var(--white)', color: 'var(--t2)', cursor: 'pointer' }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{ flex: 2, padding: '10px', background: 'var(--em)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 700, border: 'none', cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: saving ? 0.7 : 1 }}
                  >
                    {saving ? (
                      <>
                        <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                        Sauvegarde…
                      </>
                    ) : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}

            {saveMsg && !editMode && (
              <div style={{ marginTop: 14, background: 'var(--em-l)', border: '1px solid var(--em-g)', borderRadius: 9, padding: '10px 14px', fontSize: 13, color: 'var(--em-d)', fontWeight: 600 }}>
                {saveMsg}
              </div>
            )}
          </div>
        </div>

        {/* Quick links */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--rl)', border: '1.5px solid var(--bg3)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--bg3)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t4)' }}>Accès rapide</p>
          </div>
          <Link
            href="/orders"
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', borderBottom: '1px solid var(--bg3)', color: 'var(--t1)', textDecoration: 'none', transition: 'background 0.18s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--white)'; }}
          >
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--em-l)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)' }}>Mes commandes</div>
              <div style={{ fontSize: 12, color: 'var(--t3)' }}>Suivez l&apos;état de vos commandes</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--t4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
          <Link
            href="/shop"
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', color: 'var(--t1)', textDecoration: 'none', transition: 'background 0.18s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--white)'; }}
          >
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--or-l)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--or)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)' }}>Continuer mes achats</div>
              <div style={{ fontSize: 12, color: 'var(--t3)' }}>Découvrir la boutique</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--t4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>

        {/* Logout */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--rl)', border: '1.5px solid var(--bg3)', overflow: 'hidden' }}>
          <button
            onClick={handleLogout}
            disabled={isPending}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', color: '#DC2626', background: 'none', border: 'none', cursor: isPending ? 'wait' : 'pointer', transition: 'background 0.18s', textAlign: 'left', opacity: isPending ? 0.6 : 1 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
          >
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {isPending ? 'Déconnexion…' : 'Se déconnecter'}
            </div>
          </button>
        </div>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t4)' }}>{label}</span>
      <span style={{ fontSize: 14, color: 'var(--t1)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}
