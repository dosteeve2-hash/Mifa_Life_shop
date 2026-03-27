import Link from "next/link";

export function Footer() {
  return (
    <footer id="footer" aria-label="Pied de page">
      <div className="wrap">
        <div className="ft-grid">
          <div>
            <div className="ft-logo">
              <div className="logo-bars" style={{ gap: 3 }}>
                <span
                  style={{
                    width: 22,
                    height: 2,
                    background: "var(--em)",
                    display: "block",
                    borderRadius: 2,
                  }}
                />
                <span
                  style={{
                    width: 14,
                    height: 2,
                    background: "var(--em)",
                    display: "block",
                    borderRadius: 2,
                  }}
                />
                <span
                  style={{
                    width: 18,
                    height: 2,
                    background: "var(--em)",
                    display: "block",
                    borderRadius: 2,
                  }}
                />
              </div>
              <em>MIFA</em> LIFE
              <div className="flag-mini">
                <span style={{ background: "var(--mg)" }} />
                <span style={{ background: "var(--my)" }} />
                <span style={{ background: "var(--mr)" }} />
              </div>
            </div>
            <p className="ft-desc">
              Marketplace generaliste pour le Mali. Produits du monde entier,
              paiements mobiles locaux et livraison a Bamako.
            </p>
            <div className="ft-pays">
              <span className="ft-pay-chip">Orange Money</span>
              <span className="ft-pay-chip">Wave</span>
              <span className="ft-pay-chip">Moov Money</span>
              <span className="ft-pay-chip">Carte</span>
            </div>
          </div>

          <div>
            <div className="ft-col-ti">Boutique</div>
            <div className="ft-links">
              <Link className="ft-l" href="/shop">
                Catalogue
              </Link>
              <Link className="ft-l" href="/categories">
                Categories
              </Link>
              <Link className="ft-l" href="/track">
                Suivi commande
              </Link>
              <Link className="ft-l" href="/returns">
                Retours
              </Link>
            </div>
          </div>

          <div>
            <div className="ft-col-ti">Informations</div>
            <div className="ft-links">
              <Link className="ft-l" href="/about">
                A propos
              </Link>
              <Link className="ft-l" href="/faq">
                FAQ
              </Link>
              <Link className="ft-l" href="/contact">
                Contact
              </Link>
              <Link className="ft-l" href="/seller-register">
                Vendre sur Mifa Life
              </Link>
            </div>
          </div>

          <div>
            <div className="ft-col-ti">Legal</div>
            <div className="ft-links">
              <Link className="ft-l" href="/returns">
                Politique de retour
              </Link>
              <Link className="ft-l" href="/contact">
                Confidentialite
              </Link>
              <Link className="ft-l" href="/faq">
                Conditions generales
              </Link>
            </div>
          </div>
        </div>

        <div className="ft-bottom">
          <div className="ft-copy">© 2024 Mifa Life Company · Bamako, Mali</div>
          <div className="ft-domain">mifalife.store</div>
        </div>
      </div>
    </footer>
  );
}
