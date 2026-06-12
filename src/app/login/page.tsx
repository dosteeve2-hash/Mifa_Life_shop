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

  return (
    <div
      className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4"
      style={{ background: 'var(--bg)' }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' as const }}
      >
        {/* Carte principale */}
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            background: 'var(--bg3)',
            border: '1.5px solid var(--border2)',
            boxShadow: '0 14px 42px rgba(0,0,0,0.65)',
          }}
        >
          {/* Bande dorée en haut */}
          <div className="h-[3px]" style={{ background: 'var(--gold)' }} />

          <div className="p-8">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <Link href="/" aria-label="Retour à l'accueil">
                <Logo variant="full" size="md" />
              </Link>
            </div>

            {/* ── ÉTAPE EMAIL ── */}
            {step === 'email' && (
              <>
                <div className="mb-6 text-center">
                  <h1
                    className="font-serif text-2xl font-bold italic"
                    style={{ color: 'var(--text)' }}
                  >
                    Connexion
                  </h1>
                  <p className="mt-1.5 text-sm" style={{ color: 'var(--text2)' }}>
                    Entrez votre email — nous vous envoyons un code à 6 chiffres.
                  </p>
                </div>

                <form onSubmit={sendOtp} className="flex flex-col gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-xs font-bold uppercase tracking-wider font-mono"
                      style={{ color: 'var(--text3)' }}
                    >
                      Adresse email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      autoComplete="email"
                      autoFocus
                      disabled={loading}
                      className="w-full rounded-xl px-4 py-3 text-sm transition-all disabled:opacity-60"
                      style={{
                        background: 'var(--bg2)',
                        border: '1.5px solid var(--border2)',
                        color: 'var(--text)',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(240,168,50,0.12)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>

                  {error && (
                    <div
                      className="rounded-xl px-4 py-3 text-sm font-medium"
                      style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--red)' }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: 'var(--gold)', color: 'var(--bg)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gold)'; }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="h-4 w-4 animate-spin rounded-full border-2"
                          style={{ borderColor: 'rgba(7,14,31,0.3)', borderTopColor: 'var(--bg)' }}
                        />
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

                <p className="mt-5 text-center text-xs" style={{ color: 'var(--text3)' }}>
                  Première visite ?{' '}
                  <span className="font-semibold" style={{ color: 'var(--gold)' }}>
                    Un compte est créé automatiquement.
                  </span>
                </p>
              </>
            )}

            {/* ── ÉTAPE OTP ── */}
            {step === 'otp' && (
              <>
                <div className="mb-6 text-center">
                  <div
                    className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ background: 'rgba(240,168,50,0.08)', border: '1px solid rgba(240,168,50,0.2)' }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="var(--gold)" strokeWidth="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <h1
                    className="font-serif text-2xl font-bold italic"
                    style={{ color: 'var(--text)' }}
                  >
                    Vérification
                  </h1>
                  <p className="mt-1.5 text-sm" style={{ color: 'var(--text2)' }}>
                    Code envoyé à{' '}
                    <span className="font-semibold" style={{ color: 'var(--text)' }}>{email}</span>
                  </p>
                </div>

                <form onSubmit={verifyOtp} className="flex flex-col gap-4">
                  <div>
                    <label
                      htmlFor="otp"
                      className="mb-1.5 block text-xs font-bold uppercase tracking-wider font-mono"
                      style={{ color: 'var(--text3)' }}
                    >
                      Code à 6 chiffres
                    </label>
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
                      className="w-full rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-[0.4em] transition-all disabled:opacity-60 font-mono"
                      style={{
                        background: 'var(--bg2)',
                        border: '1.5px solid var(--border2)',
                        color: 'var(--text)',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(240,168,50,0.12)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    <p className="mt-1.5 text-center text-xs" style={{ color: 'var(--text3)' }}>
                      Vérifiez vos spams si nécessaire
                    </p>
                  </div>

                  {error && (
                    <div
                      className="rounded-xl px-4 py-3 text-sm font-medium"
                      style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--red)' }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: 'var(--gold)', color: 'var(--bg)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--gold2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--gold)'; }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="h-4 w-4 animate-spin rounded-full border-2"
                          style={{ borderColor: 'rgba(7,14,31,0.3)', borderTopColor: 'var(--bg)' }}
                        />
                        Vérification…
                      </>
                    ) : 'Valider le code'}
                  </button>
                </form>

                <div className="mt-5 flex flex-col items-center gap-2 text-center">
                  <button
                    onClick={resend}
                    disabled={countdown > 0 || loading}
                    className="text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:underline font-mono"
                    style={{ color: 'var(--gold)' }}
                  >
                    {countdown > 0 ? `Renvoyer dans ${countdown}s` : 'Renvoyer le code'}
                  </button>
                  <button
                    onClick={() => { setStep('email'); setError(null); setOtp(''); }}
                    className="text-xs transition-colors"
                    style={{ color: 'var(--text3)' }}
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
              <div className="flex flex-col items-center py-4 text-center">
                <div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    background: 'rgba(34,217,138,0.08)',
                    boxShadow: '0 0 0 4px rgba(34,217,138,0.15)',
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="var(--green)" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2
                  className="font-serif text-2xl font-bold italic"
                  style={{ color: 'var(--text)' }}
                >
                  Connecté !
                </h2>
                <p className="mt-2 text-sm" style={{ color: 'var(--text2)' }}>
                  Redirection vers la boutique…
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lien retour */}
        {step !== 'success' && (
          <p className="mt-4 text-center text-xs" style={{ color: 'var(--text3)' }}>
            <Link
              href="/"
              className="transition-colors hover:underline"
              style={{ color: 'var(--text3)' }}
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
