'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';

type Step = 'email' | 'otp' | 'success';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4 bg-[#F6F4F0]">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' as const }}
      >

        {/* Carte principale */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-gray-200/80">

          {/* Bande Mali en haut de la carte */}
          <div className="flex h-1.5">
            <span className="flex-1 bg-[#009739]" />
            <span className="flex-1 bg-[#FCD116]" />
            <span className="flex-1 bg-[#CE1126]" />
          </div>

          <div className="p-8">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <Link href="/" className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight">
                  <span className="text-[#009739]">MIFA</span> LIFE
                </span>
              </Link>
            </div>

            {/* ── ÉTAPE EMAIL ── */}
            {step === 'email' && (
              <>
                <div className="mb-6 text-center">
                  <h1 className="font-serif text-2xl font-bold text-gray-900">
                    Connexion
                  </h1>
                  <p className="mt-1.5 text-sm text-gray-500">
                    Entrez votre email — nous vous envoyons un code à 6 chiffres.
                  </p>
                </div>

                <form onSubmit={sendOtp} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="email"
                      className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
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
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-[#009739] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#009739]/20 disabled:opacity-60"
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-medium text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#009739] py-3 text-sm font-bold text-white transition-all hover:bg-[#007a2e] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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

                <p className="mt-5 text-center text-xs text-gray-400">
                  Première visite ?{' '}
                  <span className="font-semibold text-[#009739]">
                    Un compte est créé automatiquement.
                  </span>
                </p>
              </>
            )}

            {/* ── ÉTAPE OTP ── */}
            {step === 'otp' && (
              <>
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#009739]/10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="#009739" strokeWidth="1.8">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <h1 className="font-serif text-2xl font-bold text-gray-900">
                    Vérification
                  </h1>
                  <p className="mt-1.5 text-sm text-gray-500">
                    Code envoyé à{' '}
                    <span className="font-semibold text-gray-700">{email}</span>
                  </p>
                </div>

                <form onSubmit={verifyOtp} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="otp"
                      className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
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
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-2xl font-bold tracking-[0.4em] text-gray-900 transition-all focus:border-[#009739] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#009739]/20 disabled:opacity-60"
                    />
                    <p className="mt-1.5 text-center text-xs text-gray-400">
                      Vérifiez vos spams si nécessaire
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-medium text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#009739] py-3 text-sm font-bold text-white transition-all hover:bg-[#007a2e] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Vérification…
                      </>
                    ) : 'Valider le code'}
                  </button>
                </form>

                <div className="mt-5 flex flex-col items-center gap-2 text-center">
                  <button
                    onClick={resend}
                    disabled={countdown > 0 || loading}
                    className="text-sm font-semibold text-[#009739] disabled:cursor-not-allowed disabled:text-gray-400 hover:underline"
                  >
                    {countdown > 0 ? `Renvoyer dans ${countdown}s` : 'Renvoyer le code'}
                  </button>
                  <button
                    onClick={() => { setStep('email'); setError(null); setOtp(''); }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ← Changer d&apos;adresse email
                  </button>
                </div>
              </>
            )}

            {/* ── SUCCÈS ── */}
            {step === 'success' && (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#009739]/10 ring-4 ring-[#009739]/20">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="#009739" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 className="font-serif text-2xl font-bold text-gray-900">Connecté !</h2>
                <p className="mt-2 text-sm text-gray-500">Redirection vers la boutique…</p>
              </div>
            )}
          </div>
        </div>

        {/* Lien retour */}
        {step !== 'success' && (
          <p className="mt-4 text-center text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              ← Retour à l&apos;accueil
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
