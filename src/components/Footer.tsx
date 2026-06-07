import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="footer">
      <div className="wrap">
        <div className="ft-grid">
          {/* Col 1 */}
          <div>
            <div className="ft-logo">
              <em>MIFA</em> LIFE
            </div>
            <p className="ft-desc">
              La marketplace premium du Mali. Des milliers de produits, un paiement simplifié,
              une livraison fiable partout au Mali.
            </p>
            <div className="ft-pays">
              <div className="ft-pay-chip" style={{ color: '#FF6B00', borderColor: 'rgba(255,107,0,0.3)' }}>Orange Money</div>
              <div className="ft-pay-chip" style={{ color: '#0087C3', borderColor: 'rgba(0,135,195,0.3)' }}>Wave</div>
              <div className="ft-pay-chip">Cash</div>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <div className="ft-col-ti">Boutique</div>
            <div className="ft-links">
              <Link href="/shop" className="ft-l">Tous les produits</Link>
              <Link href="/shop?sort=sale" className="ft-l">Promos</Link>
              <Link href="/shop?sort=newest" className="ft-l">Nouveautés</Link>
              <Link href="/flash" className="ft-l">Flash Deals</Link>
            </div>
          </div>

          {/* Col 3 */}
          <div>
            <div className="ft-col-ti">Informations</div>
            <div className="ft-links">
              <Link href="/about" className="ft-l">À propos</Link>
              <Link href="/contact" className="ft-l">Contact</Link>
              <Link href="/faq" className="ft-l">FAQ</Link>
              <Link href="/track" className="ft-l">Suivi de commande</Link>
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <div className="ft-col-ti">Légal</div>
            <div className="ft-links">
              <Link href="/privacy" className="ft-l">Confidentialité</Link>
              <Link href="/privacy" className="ft-l">Conditions générales</Link>
              <Link href="/returns" className="ft-l">Retours &amp; remboursements</Link>
            </div>
          </div>
        </div>

        <div className="ft-bottom">
          <p className="ft-copy">© {new Date().getFullYear()} Mifa Life. Tous droits réservés.</p>
          <p className="ft-domain">Bamako, Mali 🇲🇱 &nbsp;·&nbsp; mifa.life</p>
        </div>
      </div>
    </footer>
  );
}
