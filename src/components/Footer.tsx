'use client';

import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer id="footer">
      <div className="wrap">
        <div className="ft-grid">
          {/* Col 1 — Brand */}
          <div>
            <div className="ft-logo">
              <Logo variant="compact" size="sm" />
            </div>
            <p className="ft-desc">
              Marketplace malienne avec catalogue de produits et prix affichés en FCFA.
            </p>
            <div className="ft-pays">
              <div className="ft-pay-chip" style={{ color: '#ff8c42', borderColor: 'rgba(255,140,66,0.25)' }}>Catalogue</div>
              <div className="ft-pay-chip" style={{ color: '#38b6ff', borderColor: 'rgba(56,182,255,0.25)' }}>FCFA</div>
              <div className="ft-pay-chip">MVP</div>
            </div>

            {/* Newsletter */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 10 }}>
                Newsletter
              </div>
              <form
                onSubmit={(e) => e.preventDefault()}
                style={{ display: 'flex', gap: 8 }}
              >
                <input
                  type="email"
                  placeholder="votre@email.com"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border2)',
                    borderRadius: 8,
                    fontSize: 12,
                    color: 'var(--t1)',
                    fontFamily: "'Outfit', sans-serif",
                    outline: 'none',
                  }}
                  onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--gold)'; }}
                  onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = 'var(--border2)'; }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '8px 14px',
                    background: 'var(--gold)',
                    color: 'var(--bg)',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Outfit', sans-serif",
                    whiteSpace: 'nowrap',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold2)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold)'; }}
                >
                  S&apos;abonner
                </button>
              </form>
            </div>
          </div>

          {/* Col 2 — Boutique */}
          <div>
            <div className="ft-col-ti">Boutique</div>
            <div className="ft-links">
              <Link href="/shop" className="ft-l">Tous les produits</Link>
              <Link href="/shop?sort=sale" className="ft-l">Promos</Link>
              <Link href="/shop?sort=newest" className="ft-l">Nouveautés</Link>
              <Link href="/flash" className="ft-l">Flash Deals</Link>
              <Link href="/categories" className="ft-l">Catégories</Link>
            </div>
          </div>

          {/* Col 3 — Informations */}
          <div>
            <div className="ft-col-ti">Informations</div>
            <div className="ft-links">
              <Link href="/about" className="ft-l">À propos</Link>
              <Link href="/contact" className="ft-l">Contact</Link>
              <Link href="/faq" className="ft-l">FAQ</Link>
              <Link href="/track" className="ft-l">Suivi de commande</Link>
              <Link href="/sizing-guide" className="ft-l">Guide des tailles</Link>
            </div>
          </div>

          {/* Col 4 — Légal + Réseaux */}
          <div>
            <div className="ft-col-ti">Légal</div>
            <div className="ft-links">
              <Link href="/privacy" className="ft-l">Confidentialité</Link>
              <Link href="/privacy" className="ft-l">CGV</Link>
              <Link href="/returns" className="ft-l">Retours</Link>
            </div>

            {/* Social icons */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--t3)', marginBottom: 10 }}>
                Suivez-nous
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  {
                    href: '#', label: 'Facebook',
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>,
                  },
                  {
                    href: '#', label: 'Instagram',
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>,
                  },
                  {
                    href: '#', label: 'WhatsApp',
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>,
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    style={{
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--bg3)',
                      border: '1px solid var(--border2)',
                      borderRadius: 8,
                      color: 'var(--t3)',
                      transition: 'color 0.2s, border-color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.color = 'var(--gold)';
                      el.style.borderColor = 'rgba(212,175,55,0.35)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLAnchorElement;
                      el.style.color = 'var(--t3)';
                      el.style.borderColor = 'var(--border2)';
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
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
