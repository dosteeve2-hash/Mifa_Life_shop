'use client';

import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';

interface Category {
  name: string;
  slug?: string;
  icon?: string | null;
  id?: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

// Accent colors per category (used as glow/border tint)
const CAT_ACCENTS: Record<string, { accent: string; glow: string }> = {
  electronique: { accent: 'var(--cyan)',  glow: 'rgba(45,212,255,0.12)' },
  mode:         { accent: 'var(--gold)',  glow: 'rgba(240,168,50,0.12)' },
  maison:       { accent: 'var(--green)', glow: 'rgba(34,217,138,0.12)' },
  sport:        { accent: '#f97316',      glow: 'rgba(249,115,22,0.12)' },
  beaute:       { accent: '#e879f9',      glow: 'rgba(232,121,249,0.12)' },
  enfants:      { accent: 'var(--gold2)', glow: 'rgba(247,192,96,0.12)' },
  auto:         { accent: 'var(--text2)', glow: 'rgba(155,168,196,0.12)' },
  alimentation: { accent: 'var(--green)', glow: 'rgba(34,217,138,0.12)' },
};
const DEFAULT_ACCENT = { accent: 'var(--gold)', glow: 'rgba(240,168,50,0.12)' };

const DEFAULT_CATEGORIES = [
  { name: 'Électronique', slug: 'electronique', icon: '💻' },
  { name: 'Mode', slug: 'mode', icon: '👗' },
  { name: 'Maison', slug: 'maison', icon: '🏠' },
  { name: 'Sport', slug: 'sport', icon: '⚽' },
  { name: 'Beauté', slug: 'beaute', icon: '💄' },
  { name: 'Enfants', slug: 'enfants', icon: '🧸' },
  { name: 'Auto', slug: 'auto', icon: '🚗' },
  { name: 'Alimentation', slug: 'alimentation', icon: '🛒' },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.94 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  const displayCats = categories.length > 0
    ? categories.map((c) => ({
        name: c.name,
        slug: c.slug ?? c.name.toLowerCase().replace(/\s+/g, '-'),
        icon: c.icon ?? '🛍️',
      }))
    : DEFAULT_CATEGORIES;

  return (
    <section className="section" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        <div className="sec-hd">
          <div>
            <div className="sec-eyebrow">01 — Collections</div>
            <h2 className="sec-ti">Explorez notre univers.</h2>
            <p style={{ fontSize: 13, color: 'var(--t2)', marginTop: 6, fontFamily: "'Outfit', sans-serif", fontStyle: 'normal' }}>
              {displayCats.length} univers soigneusement sélectionnés
            </p>
          </div>
          <Link href="/shop" className="sec-link">
            Tout voir →
          </Link>
        </div>

        <motion.div
          id="cats-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {displayCats.map((cat) => {
            const theme = CAT_ACCENTS[cat.slug] ?? DEFAULT_ACCENT;
            return (
              <motion.div key={cat.slug} variants={cardVariants}>
                <Link href={`/shop?cat=${cat.slug}`} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    style={{
                      background: 'var(--bg3)',
                      border: '1.5px solid var(--border2)',
                      borderRadius: 'var(--rl)',
                      padding: 'clamp(16px,3vw,22px) 14px',
                      display: 'flex',
                      flexDirection: 'column' as const,
                      alignItems: 'center',
                      gap: 10,
                      cursor: 'pointer',
                      textAlign: 'center' as const,
                      transition: 'border-color 0.22s ease, box-shadow 0.22s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = theme.accent.startsWith('var') ? 'rgba(240,168,50,0.45)' : `${theme.accent}55`;
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 1px ${theme.glow.replace('0.12', '0.15')}, 0 8px 24px rgba(0,0,0,0.4)`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border2)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: theme.glow,
                      border: `1px solid ${theme.glow.replace('0.12', '0.3')}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      lineHeight: 1,
                    }}>
                      {cat.icon}
                    </div>

                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--t1)', fontFamily: "'Outfit', sans-serif", marginBottom: 3 }}>
                        {cat.name}
                      </div>
                      <div style={{
                        fontSize: 9,
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: 'var(--t3)',
                        textTransform: 'uppercase' as const,
                        letterSpacing: '.07em',
                      }}>
                        Explorer →
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
