import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price_cfa: number | null;
  image_url: string | null;
  category: string | null;
};

const CATEGORIES = [
  { name: "Electronique", slug: "electronique", icon: "💻" },
  { name: "Mode", slug: "mode", icon: "👗" },
  { name: "Maison", slug: "maison", icon: "🏠" },
  { name: "Sport", slug: "sport", icon: "⚽" },
  { name: "Beaute", slug: "beaute", icon: "💄" },
  { name: "Enfants", slug: "enfants", icon: "🧸" },
  { name: "Auto", slug: "auto", icon: "🚗" },
  { name: "Alimentation", slug: "alimentation", icon: "🛒" },
];

const HOW_IT_WORKS = [
  {
    number: "1",
    title: "Choisissez vos produits",
    description:
      "Parcourez la boutique et trouvez rapidement les articles que vous voulez commander.",
  },
  {
    number: "2",
    title: "Payez facilement",
    description:
      "Reglez par Orange Money, Wave, Moov Money ou carte selon votre preference.",
  },
  {
    number: "3",
    title: "Nous gérons la logistique",
    description:
      "Mifa Life suit votre commande, coordonne l'acheminement et vous informe a chaque etape.",
  },
  {
    number: "4",
    title: "Recevez au Mali",
    description:
      "Votre commande est livree a Bamako et dans les communes environnantes avec suivi en temps reel.",
  },
];

function formatPrice(value: number | null) {
  return `${new Intl.NumberFormat("fr-FR").format(value ?? 0)} FCFA`;
}

async function getFeaturedProducts() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("products")
      .select("id, name, description, price_cfa, image_url, category")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(8);

    return (data as Product[] | null) ?? [];
  } catch (error) {
    console.error("[HomePage] fetch error:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const heroProducts = featuredProducts.slice(0, 4);

  return (
    <main>
      <section id="hero" aria-label="Bienvenue sur Mifa Life">
        <div className="hero-bg" />
        <div className="hero-overlay" />

        <div className="hero-in">
          <div className="hero-txt">
            <div className="hero-eyebrow">
              <span />
              Votre marketplace au Mali
            </div>

            <h1 className="hero-h1">
              Commandez n&apos;importe quel produit depuis la Chine, livre
              directement au <em>Mali</em>.
            </h1>

            <p className="hero-sub">
              Produits du monde entier livres au Mali. Payez par Orange Money,
              Wave ou Moov Money avec une experience Mifa Life fidele a votre
              design original.
            </p>

            <form action="/shop" method="GET" className="hero-search">
              <select id="hs-cat" name="cat" className="hs-cat" defaultValue="">
                <option value="">Toutes categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                id="heroSearch"
                name="q"
                className="hs-inp"
                type="search"
                placeholder="Rechercher un produit, une marque ou une categorie"
              />

              <button type="submit" className="hs-btn">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Rechercher
              </button>
            </form>

            <div className="hero-chips">
              {["Telephone", "Ventilateur", "Chaussures", "Sac", "Ecouteurs"].map(
                (term) => (
                  <Link
                    key={term}
                    href={`/shop?q=${encodeURIComponent(term)}`}
                    className="hc"
                  >
                    {term}
                  </Link>
                ),
              )}
            </div>
          </div>

          <div className="hero-cards" id="heroCards">
            {heroProducts.length > 0
              ? heroProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/shop/${product.id}`}
                    className="hc-card"
                  >
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="hc-img" />
                    ) : (
                      <div className="hc-img-ph">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="rgba(255,255,255,.3)"
                          strokeWidth="1.2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}

                    <div className="hc-info">
                      <div className="hc-name">{product.name}</div>
                      <div className="hc-price">{formatPrice(product.price_cfa)}</div>
                    </div>
                  </Link>
                ))
              : Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="hc-skel" aria-hidden="true">
                    <div className="hc-skel-img" />
                    <div className="hc-skel-body">
                      <div className="hc-skel-line" />
                      <div className="hc-skel-line" />
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      <section className="section" aria-label="Categories">
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <div className="sec-eyebrow">Categories</div>
              <h2 className="sec-ti">Explorez les univers Mifa Life</h2>
            </div>
            <Link href="/shop" className="sec-link">
              Voir tout
            </Link>
          </div>

          <div id="cats-grid">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?cat=${category.slug}`}
                className="cat-card"
              >
                <div className="cat-ico">{category.icon}</div>
                <div className="cat-name">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-label="Produits en avant">
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <div className="sec-eyebrow">Selection</div>
              <h2 id="featured-title" className="sec-ti">
                Nouveautes
              </h2>
            </div>
            <Link href="/shop" className="sec-link">
              Parcourir le catalogue
            </Link>
          </div>

          <div id="featured-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Link key={product.id} href={`/shop/${product.id}`} className="prod-card">
                  <div className="prod-img-wrap">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="prod-img" />
                    ) : (
                      <div className="prod-img-ph">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--t4)"
                          strokeWidth="1.2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}

                    {product.category ? (
                      <div className="prod-badge pb-new">{product.category}</div>
                    ) : null}
                  </div>

                  <div className="prod-body">
                    {product.category ? (
                      <div className="prod-cat">{product.category}</div>
                    ) : null}
                    <div className="prod-name">{product.name}</div>
                    <div className="prod-price-row">
                      <span className="prod-price">{formatPrice(product.price_cfa)}</span>
                    </div>
                    <div className="prod-shipping">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="1" y="3" width="15" height="13" />
                        <path d="M16 8h4l3 5v4h-7V8z" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                      Livraison Bamako et environs
                    </div>
                    <div className="prod-add">Voir le produit</div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-ico">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--t4)"
                    strokeWidth="1.5"
                  >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                  </svg>
                </div>
                <div className="empty-ti">Aucun produit pour l&apos;instant</div>
                <p className="empty-sub">
                  Ajoutez vos premiers produits dans Supabase pour remplir cette
                  section automatiquement.
                </p>
                <Link href="/shop" className="empty-cta">
                  Aller a la boutique
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="how" className="section" aria-label="Comment ca marche">
        <div className="wrap">
          <div className="sec-hd">
            <div>
              <div className="sec-eyebrow">Comment ca marche</div>
              <h2 className="sec-ti">Une experience simple et rassurante</h2>
            </div>
          </div>

          <div className="how-grid">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.number} className="how-card">
                <div className="how-num">{step.number}</div>
                <div className="how-ti">{step.title}</div>
                <p className="how-sub">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pays" aria-label="Paiements acceptes">
        <div className="wrap">
          <div className="pays-inner">
            <div className="pay-item">
              <div className="pay-ico" style={{ background: "#FF6600" }}>
                Orange Money
              </div>
              <div className="pay-lbl">Mobile money</div>
            </div>
            <div className="pay-sep" />
            <div className="pay-item">
              <div className="pay-ico" style={{ background: "#00AAFF" }}>
                Wave
              </div>
              <div className="pay-lbl">Paiement instantane</div>
            </div>
            <div className="pay-sep" />
            <div className="pay-item">
              <div className="pay-ico" style={{ background: "#0099CC" }}>
                Moov Money
              </div>
              <div className="pay-lbl">Disponible au Mali</div>
            </div>
            <div className="pay-sep" />
            <div className="pay-item">
              <div className="pay-ico" style={{ background: "#1A1F71" }}>
                Carte
              </div>
              <div className="pay-lbl">Visa et Mastercard</div>
            </div>
          </div>
        </div>
      </section>

      <section id="trust" aria-label="Pourquoi faire confiance a Mifa Life">
        <div className="wrap">
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-ico">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--em)"
                  strokeWidth="1.8"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <div className="trust-ti">Paiement escrow</div>
                <p className="trust-sub">
                  Votre argent est securise jusqu&apos;a la confirmation de reception.
                </p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-ico">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--em)"
                  strokeWidth="1.8"
                >
                  <rect x="1" y="3" width="15" height="13" />
                  <path d="M16 8h4l3 5v4h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <div>
                <div className="trust-ti">Livraison au Mali</div>
                <p className="trust-sub">
                  Livraison a Bamako et communes environnantes. Suivi en temps reel.
                </p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-ico">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--em)"
                  strokeWidth="1.8"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 1 0 .49-3.36" />
                </svg>
              </div>
              <div>
                <div className="trust-ti">Retour sous 7 jours</div>
                <p className="trust-sub">
                  Produit non conforme ? Remboursement garanti sous 7 jours.
                </p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-ico">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--em)"
                  strokeWidth="1.8"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <div className="trust-ti">Support local</div>
                <p className="trust-sub">
                  Notre equipe est a Bamako, disponible du lundi au samedi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta-band" aria-label="Rejoindre Mifa Life">
        <div className="cta-geo a" />
        <div className="cta-geo b" />
        <div className="cta-in">
          <div
            className="mali-stripe"
            style={{
              width: 48,
              height: 3,
              borderRadius: 2,
              overflow: "hidden",
              margin: "0 auto clamp(14px,3vw,20px)",
            }}
          >
            <span style={{ background: "var(--mg)" }} />
            <span style={{ background: "var(--my)" }} />
            <span style={{ background: "var(--mr)" }} />
          </div>

          <div className="cta-ti">Commencez a commander aujourd&apos;hui</div>
          <p className="cta-sub">
            Creez votre compte gratuitement et accedez a des milliers de produits
            livres directement au Mali.
          </p>

          <div className="cta-btns">
            <Link className="cta-btn white" href="/login">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Creer un compte gratuit
            </Link>

            <Link className="cta-btn outline" href="/shop">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Parcourir le catalogue
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
