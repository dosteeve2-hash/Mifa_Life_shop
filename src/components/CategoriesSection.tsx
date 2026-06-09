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

// Per-category accent colors [bg, border, text gradient]
const CAT_THEMES: Record<string, { bg: string; border: string; accent: string }> = {
  electronique: { bg: 'linear-gradient(135deg,#E3F2FD 0%,#BBDEFB 100%)', border: '#90CAF9', accent: '#1565C0' },
  mode:         { bg: 'linear-gradient(135deg,#FCE4EC 0%,#F8BBD0 100%)', border: '#F48FB1', accent: '#AD1457' },
  maison:       { bg: 'linear-gradient(135deg,#E8F5E9 0%,#C8E6C9 100%)', border: '#A5D6A7', accent: '#2E7D32' },
  sport:        { bg: 'linear-gradient(135deg,#FFF3E0 0%,#FFE0B2 100%)', border: '#FFCC80', accent: '#E65100' },
  beaute:       { bg: 'linear-gradient(135deg,#F3E5F5 0%,#E1BEE7 100%)', border: '#CE93D8', accent: '#7B1FA2' },
  enfants:      { bg: 'linear-gradient(135deg,#FFFDE7 0%,#FFF9C4 100%)', border: '#FFF176', accent: '#F57F17' },
  auto:         { bg: 'linear-gradient(135deg,#ECEFF1 0%,#CFD8DC 100%)', border: '#B0BEC5', accent: '#37474F' },
  alimentation: { bg: 'linear-gradient(135deg,#E0F2F1 0%,#B2DFDB 100%)', border: '#80CBC4', accent: '#00695C' },
};

const DEFAULT_THEME = { bg: 'linear-gradient(135deg,#F6F4F0 0%,#EEE9E1 100%)', border: 'var(--bg3)', accent: 'var(--em)' };

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
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.93 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] as [number,number,number,number] },
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
            <div className="sec-eyebrow">Parcourir</div>
            <h2 className="sec-ti">Nos catégories</h2>
            <p style={{ fontSize: 13, color: 'var(--t3)', marginTop: 4 }}>
              Explorez nos {displayCats.length} univers soigneusement sélectionnés
            </p>
          </div>
          <Link href="/shop" className="sec-link">
            Tout voir <span>→</span>
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
            const theme = CAT_THEMES[cat.slug] ?? DEFAULT_THEME;
            return (
              <motion.div key={cat.slug} variants={cardVariants}>
                <Link
                  href={`/shop?cat=${cat.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <motion.div
                    whileHover={{ y: -5, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    style={{
                      background: theme.bg,
                      border: `1.5px solid ${theme.border}`,
                      borderRadius: 'var(--rl)',
                      padding: 'clamp(16px,3vw,22px) 14px',
                      display: 'flex',
                      flexDirection: 'column' as const,
                      alignItems: 'center',
                      gap: 10,
                      cursor: 'pointer',
                      textAlign: 'center' as const,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      position: 'relative' as const,
                      overflow: 'hidden',
                      transition: 'box-shadow 0.22s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                    }}
                  >
                    {/* Subtle corner decoration */}
                    <div style={{
                      position: 'absolute',
                      top: -18,
                      right: -18,
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: `${theme.border}55`,
                      pointerEvents: 'none',
                    }} />

                    <div style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: 'rgba(255,255,255,0.85)',
                      border: `1.5px solid ${theme.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      lineHeight: 1,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      position: 'relative' as const,
                      zIndex: 1,
                    }}>
                      {cat.icon}
                    </div>

                    <div style={{ position: 'relative' as const, zIndex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent, marginBottom: 2 }}>
                        {cat.name}
                      </div>
                      <div style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: theme.accent,
                        opacity: 0.6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 3,
                      }}>
                        Voir <span style={{ fontSize: 12 }}>→</span>
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
