"use client";

import Link from "next/link";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type Step = "email" | "otp" | "success" | "error";
const CALLBACK_URL = "https://mifa-life-shop-9k55.vercel.app/auth/callback?next=/shop";
export const dynamic = "force-dynamic";

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
          emailRedirectTo: CALLBACK_URL,
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
        options: {
          emailRedirectTo: CALLBACK_URL,
        },
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
    <section className="flex min-h-[calc(100vh-10rem)] items-center justify-center py-10">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6 flex h-1 overflow-hidden rounded-full">
          <span className="flex-1 bg-emerald-600" />
          <span className="flex-1 bg-yellow-400" />
          <span className="flex-1 bg-red-600" />
        </div>

        {step === "email" && (
          <>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Connexion</h1>
            <p className="mb-6 text-sm leading-6 text-gray-600">
              Entrez votre email, nous vous envoyons un code de connexion.
            </p>

            <form onSubmit={sendOtp} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Adresse email <span style={{ color: "var(--mr)" }}>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  autoComplete="email"
                  disabled={loading}
                  autoFocus
                />
              </div>

              {errorMsg && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600" role="alert">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Envoi en cours...
                  </>
                ) : (
                  "Recevoir le code"
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-xs leading-6 text-gray-500">
              Premiere visite ?{" "}
              <span style={{ color: "var(--mg)", fontWeight: 600 }}>
                Un compte sera cree automatiquement.
              </span>
            </p>
          </>
        )}

        {step === "otp" && (
          <>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Verification</h1>
            <p className="mb-6 text-sm leading-6 text-gray-600">
              Code envoye a <strong>{email}</strong>. Verifiez vos spams si
              necessaire.
            </p>

            <form onSubmit={verifyOtp} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="otp" className="text-sm font-medium text-gray-700">
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
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
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600" role="alert">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Verification...
                  </>
                ) : (
                  "Valider le code"
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={resendOtp}
                disabled={countdown > 0 || loading}
                className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800 disabled:text-gray-400"
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
                className="mt-2 block w-full text-sm text-gray-500 transition hover:text-gray-700"
              >
                {"<- Changer d'email"}
              </button>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
              OK
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">Connecte !</h1>
            <p className="text-sm leading-6 text-gray-600">
              Bienvenue sur Mifa Life. Redirection en cours...
            </p>
          </div>
        )}

        {step !== "success" && (
          <p className="mt-6 text-center text-xs text-gray-500">
            <Link href="/" className="transition hover:text-gray-700">
              {"<- Retour a l'accueil"}
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
