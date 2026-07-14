'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import Logo from '@/components/Logo';

type Step = 'email' | 'otp' | 'success';

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

/* ── Styles Glass Light (autonomes, pas de dépendance aux utilitaires) ── */
const S = {
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 64px)',
    padding: '24px 16px',
    background: 'var(--bg)',
  } as React.CSSProperties,
  card: {
    overflow: 'hidden',
    borderRadius: '18px',
    background: 'var(--glass2)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    border: '1px solid var(--glass-brd)',
    boxShadow: 'var(--sh-l)',
  } as React.CSSProperties,
  band: {
    height: '3px',
    background: 'linear-gradient(90deg, var(--gold), var(--cyan))',
  } as React.CSSProperties,
  inner: { padding: '32px' } as React.CSSProperties,
  title: {
    fontSize: '26px',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: 'var(--text)',
    margin: 0,
  } as React.CSSProperties,
  subtitle: {
    marginTop: '6px',
    fontSize: '14px',
    color: 'var(--text2)',
    lineHeight: 1.5,
  } as React.CSSProperties,
  label: {
    display: 'block',
    marginBottom: '7px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text3)',
    fontFamily: 'var(--font-mono)',
  } as React.CSSProperties,
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    borderRadius: '12px',
    background: 'var(--bg2)',
    border: '1.5px solid var(--border2)',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color .2s, box-shadow .2s',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  error: {
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '13.5px',
    fontWeight: 500,
    background: 'rgba(220,38,38,0.07)',
    border: '1px solid rgba(220,38,38,0.25)',
    color: 'var(--red)',
  } as React.CSSProperties,
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '13px 16px',
    fontSize: '14px',
    fontWeight: 700,
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    background: 'var(--gold)',
    color: '#ffffff',
    boxShadow: 'var(--sh-s)',
    transition: 'background .2s, transform .1s',
  } as React.CSSProperties,
  spinner: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.35)',
    borderTopColor: '#ffffff',
    animation: 'spin 0.8s linear infinite',
  } as React.CSSProperties,
  form: { display: 'flex', flexDirection: 'column', gap: '16px' } as React.CSSProperties,
};

export default function LoginPage() {
  const [step,    setStep]    = useState<Step>('email');
  const [email,   setEmail]   = useState('');
  const [otp,     setOtp]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [countdown, setCount] = useState(0);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Adresse email invalide.');
      return;
    }
    setLoading(true);
    try {
      const supabase = getSupabase();
      if (!supabase) { setError('Configuration manquante.'); setLoading(false); return; }
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (err) throw err;
      setStep('otp');
      startCountdown(60);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(msg.includes('rate') ? 'Trop de tentatives — attendez 60s.' : msg);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (otp.length < 6) { setError('Le code doit contenir 6 chiffres.'); return; }
    setLoading(true);
    try {
      const supabase = getSupabase();
      if (!supabase) { setError('Configuration manquante.'); setLoading(false); return; }
      const { error: err } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'email',
      });
      if (err) throw err;
      setStep('success');
      setTimeout(() => { location.href = '/shop'; }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur';
      setError(msg.includes('expired') || msg.includes('invalid')
        ? 'Code expiré ou invalide. Demandez un nouveau code.'
        : msg);
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (countdown > 0) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabase();
      if (!supabase) { setLoading(false); return; }
      await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      startCountdown(60);
    } finally {
      setLoading(false);
    }
  }

  function startCountdown(s: number) {
    setCount(s);
    const iv = setInterval(() => setCount((c) => { if (c <= 1) { clearInterval(iv); return 0; } return c - 1; }), 1000);
  }

  const focusRing = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = 'var(--gold)';
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47,111,237,0.14)';
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = 'var(--border2)';
      e.currentTarget.style.boxShadow = 'none';
    },
  };

  return (
    <div style={S.page}>
      <motion.div
        style={{ width: '100%', maxWidth: '440px' }}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' as const }}
      >
        {/* Carte principale */}
        <div style={S.card}>
          {/* Bande accent en haut */}
          <div style={S.band} />

          <div style={S.inner}>
            {/* Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <Link href="/" aria-label="Retour à l'accueil">
                <Logo variant="full" size="md" />
              </Link>
            </div>

            {/* ── ÉTAPE EMAIL ── */}
            {step === 'email' && (
              <>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <h1 style={S.title}>Connexion</h1>
                  <p style={S.subtitle}>
                    Entrez votre email — nous vous envoyons un code à 6 chiffres.
                  </p>
                </div>

                <form onSubmit={sendOtp} style={S.form}>
                  <div>
                    <label htmlFor="email" style={S.label}>Adresse email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      autoComplete="email"
                      autoFocus
                      disabled={loading}
                      style={{ ...S.input, opacity: loading ? 0.6 : 1 }}
                      {...focusRing}
                    />
                  </div>

                  {error && <div style={S.error}>{error}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ ...S.button, opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gold)'; }}
                  >
                    {loading ? (
                      <>
                        <span style={S.spinner} />
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2">
                          <path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/>
                        </svg>
                        Recevoir le code
                      </>
                    )}
                  </button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--text3)' }}>
                  Première visite ?{' '}
                  <span style={{ fontWeight: 600, color: 'var(--gold)' }}>
                    Un compte est créé automatiquement.
                  </span>
                </p>
              </>
            )}

            {/* ── ÉTAPE OTP ── */}
            {step === 'otp' && (
              <>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div
                    style={{
                      margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '56px', height: '56px', borderRadius: '16px',
                      background: 'rgba(47,111,237,0.08)', border: '1px solid rgba(47,111,237,0.2)',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="var(--gold)" strokeWidth="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <h1 style={S.title}>Vérification</h1>
                  <p style={S.subtitle}>
                    Code envoyé à{' '}
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{email}</span>
                  </p>
                </div>

                <form onSubmit={verifyOtp} style={S.form}>
                  <div>
                    <label htmlFor="otp" style={S.label}>Code à 6 chiffres</label>
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      autoFocus
                      disabled={loading}
                      style={{
                        ...S.input,
                        textAlign: 'center', fontSize: '24px', fontWeight: 700,
                        letterSpacing: '0.4em', fontFamily: 'var(--font-mono)',
                        opacity: loading ? 0.6 : 1,
                      }}
                      {...focusRing}
                    />
                    <p style={{ marginTop: '7px', textAlign: 'center', fontSize: '12px', color: 'var(--text3)' }}>
                      Vérifiez vos spams si nécessaire
                    </p>
                  </div>

                  {error && <div style={S.error}>{error}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ ...S.button, opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gold)'; }}
                  >
                    {loading ? (
                      <>
                        <span style={S.spinner} />
                        Vérification…
                      </>
                    ) : 'Valider le code'}
                  </button>
                </form>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
                  <button
                    onClick={resend}
                    disabled={countdown > 0 || loading}
                    style={{
                      background: 'none', border: 'none', fontSize: '13.5px', fontWeight: 600,
                      fontFamily: 'var(--font-mono)', color: 'var(--gold)',
                      cursor: countdown > 0 || loading ? 'not-allowed' : 'pointer',
                      opacity: countdown > 0 || loading ? 0.4 : 1,
                    }}
                  >
                    {countdown > 0 ? `Renvoyer dans ${countdown}s` : 'Renvoyer le code'}
                  </button>
                  <button
                    onClick={() => { setStep('email'); setError(null); setOtp(''); }}
                    style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--text3)', cursor: 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; }}
                  >
                    ← Changer d&apos;adresse email
                  </button>
                </div>
              </>
            )}

            {/* ── SUCCÈS ── */}
            {step === 'success' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 0' }}>
                <div
                  style={{
                    marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'rgba(22,163,74,0.08)',
                    boxShadow: '0 0 0 4px rgba(22,163,74,0.15)',
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="var(--green)" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 style={S.title}>Connecté !</h2>
                <p style={{ ...S.subtitle, marginTop: '8px' }}>
                  Redirection vers la boutique…
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lien retour */}
        {step !== 'success' && (
          <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '12px' }}>
            <Link
              href="/"
              style={{ color: 'var(--text3)', textDecoration: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text2)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text3)'; }}
            >
              ← Retour à l&apos;accueil
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
