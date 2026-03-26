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
      const { error: insertError } = await supabase
        .from("callback_requests")
        .insert([{ email: normalizedEmail }]);

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
    <main>
      <section id="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-in">
          <div>
            <div className="hero-eyebrow">
              <span />
              Votre marketplace au Mali
            </div>
            <h1 className="hero-h1">
              Mifa Life, commandez des produits du monde entier, livres
              directement au <em>Mali</em>.
            </h1>
            <p className="hero-sub">
              Produits du monde entier livres au Mali. Payez par Orange Money,
              Wave ou Moov, avec une experience boutique inspiree de votre
              design HTML original.
            </p>

            <form
              className="hero-search"
              onSubmit={(event) => {
                event.preventDefault();
                void handleCallback();
              }}
            >
              <select className="hs-cat" defaultValue="rappel" aria-label="Action">
                <option value="rappel">Rappel</option>
                <option value="shop">Boutique</option>
              </select>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Entrez votre email"
                className="hs-inp"
              />
              <button type="submit" className="hs-btn" disabled={isSubmitting}>
                {isSubmitting ? "Envoi..." : message ? "C'est note !" : "Etre rappele"}
              </button>
            </form>

            {error ? <p className="hero-feedback error">{error}</p> : null}
            {message ? <p className="hero-feedback success">{message}</p> : null}

            <div className="hero-chips">
              <Link href="/shop" className="hc">
                Electronique
              </Link>
              <Link href="/shop" className="hc">
                Mode
              </Link>
              <Link href="/shop" className="hc">
                Maison
              </Link>
              <Link href="/login" className="hc">
                Connexion
              </Link>
            </div>
          </div>

          <div className="hero-cards">
            <div className="hc-card">
              <div className="hc-img-ph">Wax</div>
              <div className="hc-info">
                <div className="hc-name">Selection mode Mifa Life</div>
                <div className="hc-price">Nouveautes</div>
              </div>
            </div>
            <div className="hc-card">
              <div className="hc-img-ph">Maison</div>
              <div className="hc-info">
                <div className="hc-name">Maison & cadeaux</div>
                <div className="hc-price">Livraison rapide</div>
              </div>
            </div>
            <div className="hc-card">
              <div className="hc-img-ph">Tech</div>
              <div className="hc-info">
                <div className="hc-name">Produits internationaux</div>
                <div className="hc-price">Paiement mobile</div>
              </div>
            </div>
            <div className="hc-card">
              <div className="hc-img-ph">Sport</div>
              <div className="hc-info">
                <div className="hc-name">Support WhatsApp</div>
                <div className="hc-price">Mifa Life</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <p className="sec-eyebrow">Mifa Life</p>
              <h2 className="sec-ti">Explorez les univers de la marketplace</h2>
            </div>
            <Link href="/shop" className="sec-link">
              Voir le catalogue
            </Link>
          </div>

          <div id="cats-grid">
            <Link href="/shop" className="cat-card">
              <div className="cat-ico">A</div>
              <div className="cat-name">Accessoires</div>
            </Link>
            <Link href="/shop" className="cat-card">
              <div className="cat-ico">M</div>
              <div className="cat-name">Mode</div>
            </Link>
            <Link href="/shop" className="cat-card">
              <div className="cat-ico">B</div>
              <div className="cat-name">Beaute</div>
            </Link>
            <Link href="/shop" className="cat-card">
              <div className="cat-ico">T</div>
              <div className="cat-name">Tech</div>
            </Link>
          </div>
        </div>
      </section>

      <section id="trust">
        <div className="wrap">
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-ico">1</div>
              <div>
                <div className="trust-ti">Paiement mobile</div>
                <div className="trust-sub">
                  Orange Money, Wave et Moov selon votre preference.
                </div>
              </div>
            </div>
            <div className="trust-card">
              <div className="trust-ico">2</div>
              <div>
                <div className="trust-ti">Support humain</div>
                <div className="trust-sub">
                  WhatsApp et callback pour accompagner chaque commande.
                </div>
              </div>
            </div>
            <div className="trust-card">
              <div className="trust-ico">3</div>
              <div>
                <div className="trust-ti">Identite Mifa Life</div>
                <div className="trust-sub">
                  Une interface calquee sur la direction visuelle originale.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
