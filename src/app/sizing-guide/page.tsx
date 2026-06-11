import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guide des tailles — Mifa Life',
  description: 'Guide des tailles pour les vêtements disponibles sur Mifa Life.',
};

const WOMEN_SIZES = [
  { eu: 'XS / 34', fr: '34', chest: '80–82', waist: '60–62', hips: '86–88' },
  { eu: 'S / 36', fr: '36', chest: '84–86', waist: '64–66', hips: '90–92' },
  { eu: 'M / 38', fr: '38', chest: '88–90', waist: '68–70', hips: '94–96' },
  { eu: 'L / 40', fr: '40', chest: '92–96', waist: '72–76', hips: '98–102' },
  { eu: 'XL / 42', fr: '42', chest: '98–102', waist: '78–82', hips: '104–108' },
  { eu: 'XXL / 44', fr: '44', chest: '104–108', waist: '84–88', hips: '110–114' },
];

const MEN_SIZES = [
  { eu: 'XS', chest: '80–84', waist: '66–70', collar: '36–37' },
  { eu: 'S', chest: '86–90', waist: '72–76', collar: '38–39' },
  { eu: 'M', chest: '92–96', waist: '78–82', collar: '40–41' },
  { eu: 'L', chest: '98–104', waist: '84–90', collar: '42–43' },
  { eu: 'XL', chest: '106–112', waist: '92–98', collar: '44–45' },
  { eu: 'XXL', chest: '114–120', waist: '100–106', collar: '46–47' },
];

const SHOES = [
  { eu: '38', cm: '24.0', us_w: '7', us_m: '6' },
  { eu: '39', cm: '24.5', us_w: '7.5', us_m: '6.5' },
  { eu: '40', cm: '25.0', us_w: '8.5', us_m: '7' },
  { eu: '41', cm: '25.5', us_w: '9', us_m: '7.5' },
  { eu: '42', cm: '26.5', us_w: '10', us_m: '8.5' },
  { eu: '43', cm: '27.5', us_w: '11', us_m: '9.5' },
  { eu: '44', cm: '28.0', us_w: '12', us_m: '10' },
  { eu: '45', cm: '28.5', us_w: '13', us_m: '11' },
];

const thStyle: React.CSSProperties = { padding: '10px 14px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--t4)', background: 'var(--bg2)', textAlign: 'left' as const, whiteSpace: 'nowrap' as const };
const tdStyle: React.CSSProperties = { padding: '10px 14px', fontSize: 13, color: 'var(--t2)', borderBottom: '1px solid var(--bg2)' };

export default function SizingGuidePage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--sl3)', padding: 'clamp(24px,4vw,48px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(0,137,123,0.06)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 14 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Guide des tailles</span>
          </nav>
          <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(22px,4vw,34px)', fontWeight: 700, color: '#fff', marginBottom: 10 }}>Guide des tailles</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 460, lineHeight: 1.65 }}>
            Toutes les mesures en centimètres. En cas de doute, optez pour la taille supérieure.
          </p>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 60 }}>
        {/* Tip */}
        <div style={{ background: 'var(--em-l)', border: '1px solid var(--em-g)', borderRadius: 12, padding: '14px 18px', marginBottom: 36, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20 }}>📏</span>
          <p style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.7, margin: 0 }}>
            <strong>Comment prendre ses mesures :</strong> Utilisez un mètre ruban. Mesurez le tour de poitrine au niveau le plus fort, le tour de taille au niveau du nombril, et le tour de hanches au niveau le plus fort.
          </p>
        </div>

        {/* Women */}
        <div style={{ marginBottom: 44 }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 700, color: 'var(--sl)', marginBottom: 16 }}>👗 Femmes — Vêtements</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--white)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--bg3)' }}>
              <thead>
                <tr>
                  {['Taille', 'FR', 'Poitrine (cm)', 'Taille (cm)', 'Hanches (cm)'].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WOMEN_SIZES.map((r) => (
                  <tr key={r.eu}>
                    <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--em)' }}>{r.eu}</td>
                    <td style={tdStyle}>{r.fr}</td>
                    <td style={tdStyle}>{r.chest}</td>
                    <td style={tdStyle}>{r.waist}</td>
                    <td style={tdStyle}>{r.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Men */}
        <div style={{ marginBottom: 44 }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 700, color: 'var(--sl)', marginBottom: 16 }}>👔 Hommes — Vêtements</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--white)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--bg3)' }}>
              <thead>
                <tr>
                  {['Taille', 'Poitrine (cm)', 'Taille (cm)', 'Col (cm)'].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MEN_SIZES.map((r) => (
                  <tr key={r.eu}>
                    <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--em)' }}>{r.eu}</td>
                    <td style={tdStyle}>{r.chest}</td>
                    <td style={tdStyle}>{r.waist}</td>
                    <td style={tdStyle}>{r.collar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shoes */}
        <div style={{ marginBottom: 44 }}>
          <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 700, color: 'var(--sl)', marginBottom: 16 }}>👟 Chaussures</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--white)', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--bg3)' }}>
              <thead>
                <tr>
                  {['Taille EU', 'Longueur (cm)', 'US Femme', 'US Homme'].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHOES.map((r) => (
                  <tr key={r.eu}>
                    <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--em)' }}>{r.eu}</td>
                    <td style={tdStyle}>{r.cm}</td>
                    <td style={tdStyle}>{r.us_w}</td>
                    <td style={tdStyle}>{r.us_m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ background: 'var(--white)', borderRadius: 14, padding: '20px 24px', border: '1px solid var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--sl)', marginBottom: 4 }}>Toujours un doute ?</div>
            <p style={{ fontSize: 13, color: 'var(--t3)', margin: 0 }}>Notre équipe vous aide à choisir la bonne taille.</p>
          </div>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', background: 'var(--em)', color: '#fff', borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Nous contacter →
          </Link>
        </div>
      </div>
    </div>
  );
}
