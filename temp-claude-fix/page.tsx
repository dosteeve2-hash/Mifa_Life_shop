'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

type Step = 'email' | 'otp' | 'success' | 'error';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<Step>('email');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  /* ── ENVOI OTP ── */
  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Veuillez entrer votre adresse email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Adresse email invalide.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: true,
        },
      });

      if (error) {
        // Gestion des erreurs Supabase spécifiques
        if (error.message.includes('rate limit') || error.status === 429) {
          setErrorMsg('Trop de tentatives. Attendez 60 secondes avant de réessayer.');
        } else if (error.message.includes('invalid email')) {
          setErrorMsg('Adresse email non acceptée par le serveur.');
        } else {
          setErrorMsg(`Erreur : ${error.message}`);
        }
        setLoading(false);
        return;
      }

      setStep('otp');
      startCountdown(60);
    } catch (err) {
      setErrorMsg('Erreur réseau. Vérifiez votre connexion et réessayez.');
      console.error('[sendOtp]', err);
    } finally {
      setLoading(false);
    }
  }

  /* ── VÉRIFICATION OTP ── */
  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!otp.trim() || otp.length < 6) {
      setErrorMsg('Le code doit contenir 6 chiffres.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: 'email',
      });

      if (error) {
        if (error.message.includes('expired') || error.message.includes('invalid')) {
          setErrorMsg('Code expiré ou invalide. Demandez un nouveau code.');
        } else {
          setErrorMsg(`Erreur : ${error.message}`);
        }
        setLoading(false);
        return;
      }

      setStep('success');
      // Redirection après succès
      setTimeout(() => {
        window.location.href = '/shop';
      }, 1500);
    } catch (err) {
      setErrorMsg('Erreur réseau lors de la vérification.');
      console.error('[verifyOtp]', err);
    } finally {
      setLoading(false);
    }
  }

  /* ── RENVOYER LE CODE ── */
  async function resendOtp() {
    if (countdown > 0) return;
    setErrorMsg(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        startCountdown(60);
      }
    } finally {
      setLoading(false);
    }
  }

  function startCountdown(seconds: number) {
    setCountdown(seconds);
    const iv = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(iv); return 0; }
        return c - 1;
      });
    }, 1000);
  }

  return (
    <main className="login-main">
      <div className="login-card">

        {/* Bande Mali */}
        <div className="mali-bar" style={{ marginBottom: '1.5rem' }}>
          <span style={{ background: 'var(--mg)' }} />
          <span style={{ background: 'var(--my)' }} />
          <span style={{ background: 'var(--mr)' }} />
        </div>

        {/* ÉTAPE 1 : EMAIL */}
        {step === 'email' && (
          <>
            <h1 className="login-title">Connexion</h1>
            <p className="login-sub">
              Entrez votre email — nous vous envoyons un code de connexion.
            </p>

            <form onSubmit={sendOtp} className="login-form">
              <div className="form-field">
                <label htmlFor="email" className="form-label">
                  Adresse email <span style={{ color: 'var(--mr)' }}>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="form-input"
                  autoComplete="email"
                  disabled={loading}
                  autoFocus
                />
              </div>

              {errorMsg && (
                <div className="form-error" role="alert">{errorMsg}</div>
              )}

              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <><span className="btn-spinner" /> Envoi en cours…</>
                ) : (
                  'Recevoir le code'
                )}
              </button>
            </form>

            <p className="login-footer-txt">
              Première visite ?{' '}
              <span style={{ color: 'var(--mg)', fontWeight: 600 }}>
                Un compte sera créé automatiquement.
              </span>
            </p>
          </>
        )}

        {/* ÉTAPE 2 : OTP */}
        {step === 'otp' && (
          <>
            <h1 className="login-title">Vérification</h1>
            <p className="login-sub">
              Code envoyé à <strong>{email}</strong>.
              Vérifiez vos spams si nécessaire.
            </p>

            <form onSubmit={verifyOtp} className="login-form">
              <div className="form-field">
                <label htmlFor="otp" className="form-label">
                  Code à 6 chiffres <span style={{ color: 'var(--mr)' }}>*</span>
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
                  className="form-input"
                  style={{ letterSpacing: '0.2em', fontSize: '1.25rem', textAlign: 'center' }}
                  disabled={loading}
                  autoFocus
                />
              </div>

              {errorMsg && (
                <div className="form-error" role="alert">{errorMsg}</div>
              )}

              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <><span className="btn-spinner" /> Vérification…</>
                ) : (
                  'Valider le code'
                )}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                onClick={resendOtp}
                disabled={countdown > 0 || loading}
                className="btn-resend"
              >
                {countdown > 0
                  ? `Renvoyer dans ${countdown}s`
                  : 'Renvoyer le code'}
              </button>
              <button
                onClick={() => { setStep('email'); setErrorMsg(null); setOtp(''); }}
                className="btn-back"
                style={{ display: 'block', margin: '8px auto 0' }}
              >
                ← Changer d&apos;email
              </button>
            </div>
          </>
        )}

        {/* ÉTAPE 3 : SUCCÈS */}
        {step === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div className="success-icon">✓</div>
            <h1 className="login-title">Connecté !</h1>
            <p className="login-sub">
              Bienvenue sur Mifa Life. Redirection en cours…
            </p>
          </div>
        )}

        {/* LIEN RETOUR */}
        {step !== 'success' && (
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '12px' }}>
            <Link href="/" style={{ color: 'var(--t4)', textDecoration: 'none' }}>
              ← Retour à l&apos;accueil
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
