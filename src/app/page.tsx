"use client";

import Link from "next/link";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCallback() {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setMessage(null);
      setError("Veuillez entrer votre email avant de demander un rappel.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: insertError } = await supabase.from("callback_requests").insert([
        { email: normalizedEmail },
      ]);

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setMessage("Demande recue, on vous rappelle!");
      setEmail("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Une erreur est survenue.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050806] text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
        <div className="w-full overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,#0a120d_0%,#101813_100%)] shadow-[0_22px_80px_rgba(0,0,0,0.35)]">
          <div className="grid h-2 grid-cols-3">
            <div className="bg-[var(--mg)]" />
            <div className="bg-[var(--my)]" />
            <div className="bg-[var(--mr)]" />
          </div>

          <div className="px-6 py-12 text-center sm:px-12 sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--mg)]">
              Mifa Life
            </p>
            <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              MIFA LIFE - Plateforme en cours de synchronisation. Revenez dans
              quelques instants.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65">
              Notre experience principale est en cours de mise a jour. Vous
              pouvez nous contacter directement pendant la synchronisation.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="https://wa.me/22300000000?text=Bonjour%20Mifa%20Life"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--mg)] px-8 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Nous contacter sur WhatsApp
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Se connecter
              </Link>
            </div>

            <form
              className="mx-auto mt-10 max-w-xl rounded-[28px] border border-white/10 bg-white/5 p-5 text-left"
              onSubmit={(event) => {
                event.preventDefault();
                void handleCallback();
              }}
            >
              <label
                htmlFor="contact-email"
                className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45"
              >
                Contact rapide
              </label>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Votre email"
                  className="min-h-12 flex-1 rounded-full border border-white/10 bg-[#0b100d] px-5 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[var(--mg)]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#08100b] transition hover:bg-[var(--my)]"
                >
                  {isSubmitting
                    ? "Envoi..."
                    : message
                      ? "C'est note !"
                      : "Etre rappelle"}
                </button>
              </div>

              {error ? (
                <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </p>
              ) : null}

              {message ? (
                <p className="mt-4 rounded-2xl border border-[var(--mg)]/30 bg-[var(--mg)]/10 px-4 py-3 text-sm text-green-100">
                  {message}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
