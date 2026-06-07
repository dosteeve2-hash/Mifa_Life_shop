'use client';

import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
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
          {displayCats.map((cat) => (
            <motion.div key={cat.slug} variants={cardVariants}>
              <Link
                href={`/shop?cat=${cat.slug}`}
                className="cat-card"
                style={{ textDecoration: 'none' }}
              >
                <div className="cat-ico">{cat.icon}</div>
                <div className="cat-name">{cat.name}</div>
                <div style={{ fontSize: 11, color: 'var(--em)', marginTop: -4 }}>→</div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
