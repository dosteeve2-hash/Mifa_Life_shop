"use client";

import Link from "next/link";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type Step = "email" | "otp" | "success" | "error";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg("Veuillez entrer votre adresse email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Adresse email invalide.");
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
        if (error.message.includes("rate limit") || error.status === 429) {
          setErrorMsg("Trop de tentatives. Attendez 60 secondes avant de reessayer.");
        } else if (error.message.includes("invalid email")) {
          setErrorMsg("Adresse email non acceptee par le serveur.");
        } else {
          setErrorMsg(`Erreur : ${error.message}`);
        }
        setLoading(false);
        return;
      }

      setStep("otp");
      startCountdown(60);
    } catch (err) {
      setErrorMsg("Erreur reseau. Verifiez votre connexion et reessayez.");
      console.error("[sendOtp]", err);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!otp.trim() || otp.length < 6) {
      setErrorMsg("Le code doit contenir 6 chiffres.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: otp.trim(),
        type: "email",
      });

      if (error) {
        if (error.message.includes("expired") || error.message.includes("invalid")) {
          setErrorMsg("Code expire ou invalide. Demandez un nouveau code.");
        } else {
          setErrorMsg(`Erreur : ${error.message}`);
        }
        setLoading(false);
        return;
      }

      setStep("success");
      setTimeout(() => {
        window.location.href = "/shop";
      }, 1500);
    } catch (err) {
      setErrorMsg("Erreur reseau lors de la verification.");
      console.error("[verifyOtp]", err);
    } finally {
      setLoading(false);
    }
  }

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
        if (c <= 1) {
          clearInterval(iv);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  return (
    <main className="login-main">
      <div className="login-card">
        <div className="mali-bar" style={{ marginBottom: "1.5rem" }}>
          <span style={{ background: "var(--mg)" }} />
          <span style={{ background: "var(--my)" }} />
          <span style={{ background: "var(--mr)" }} />
        </div>

        {step === "email" && (
          <>
            <h1 className="login-title">Connexion</h1>
            <p className="login-sub">
              Entrez votre email, nous vous envoyons un code de connexion.
            </p>

            <form onSubmit={sendOtp} className="login-form">
              <div className="form-field">
                <label htmlFor="email" className="form-label">
                  Adresse email <span style={{ color: "var(--mr)" }}>*</span>
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
                <div className="form-error" role="alert">
                  {errorMsg}
                </div>
              )}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-spinner" /> Envoi en cours...
                  </>
                ) : (
                  "Recevoir le code"
                )}
              </button>
            </form>

            <p className="login-footer-txt">
              Premiere visite ?{" "}
              <span style={{ color: "var(--mg)", fontWeight: 600 }}>
                Un compte sera cree automatiquement.
              </span>
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            <h1 className="login-title">Verification</h1>
            <p className="login-sub">
              Code envoye a <strong>{email}</strong>. Verifiez vos spams si
              necessaire.
            </p>

            <form onSubmit={verifyOtp} className="login-form">
              <div className="form-field">
                <label htmlFor="otp" className="form-label">
                  Code a 6 chiffres <span style={{ color: "var(--mr)" }}>*</span>
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="form-input"
                  style={{
                    letterSpacing: "0.2em",
                    fontSize: "1.25rem",
                    textAlign: "center",
                  }}
                  disabled={loading}
                  autoFocus
                />
              </div>

              {errorMsg && (
                <div className="form-error" role="alert">
                  {errorMsg}
                </div>
              )}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-spinner" /> Verification...
                  </>
                ) : (
                  "Valider le code"
                )}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <button
                onClick={resendOtp}
                disabled={countdown > 0 || loading}
                className="btn-resend"
              >
                {countdown > 0
                  ? `Renvoyer dans ${countdown}s`
                  : "Renvoyer le code"}
              </button>
              <button
                onClick={() => {
                  setStep("email");
                  setErrorMsg(null);
                  setOtp("");
                }}
                className="btn-back"
                style={{ display: "block", margin: "8px auto 0" }}
              >
                {"<- Changer d'email"}
              </button>
            </div>
          </>
        )}

        {step === "success" && (
          <div style={{ textAlign: "center" }}>
            <div className="success-icon">OK</div>
            <h1 className="login-title">Connecte !</h1>
            <p className="login-sub">
              Bienvenue sur Mifa Life. Redirection en cours...
            </p>
          </div>
        )}

        {step !== "success" && (
          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "12px" }}>
            <Link href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>
              {"<- Retour a l'accueil"}
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
