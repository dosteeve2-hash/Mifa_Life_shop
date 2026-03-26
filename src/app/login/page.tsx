"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const origin = window.location.origin;
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/`,
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setMessage("Lien de connexion envoye. Verifiez votre boite mail.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Une erreur est survenue.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050806] px-6 py-16 text-white">
      <section className="mx-auto max-w-lg">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,#0a120d_0%,#101813_100%)] shadow-[0_22px_80px_rgba(0,0,0,0.35)]">
          <div className="grid h-2 grid-cols-3">
            <div className="bg-[var(--mg)]" />
            <div className="bg-[var(--my)]" />
            <div className="bg-[var(--mr)]" />
          </div>

          <div className="px-6 py-10 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--mg)]">
              Connexion
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              Accedez a votre espace Mifa Life
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Saisissez votre email pour recevoir un lien magique de connexion.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-[0.25em] text-white/45"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  className="min-h-12 rounded-2xl border border-white/10 bg-[#0b100d] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[var(--mg)]"
                  placeholder="vous@exemple.com"
                />
              </div>

              {error ? (
                <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </p>
              ) : null}

              {message ? (
                <p className="rounded-2xl border border-[var(--mg)]/30 bg-[var(--mg)]/10 px-4 py-3 text-sm text-green-100">
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={pending}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--mg)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Envoi..." : "Recevoir mon lien magique"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
