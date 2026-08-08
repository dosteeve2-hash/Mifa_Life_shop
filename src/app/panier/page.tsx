'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  Package,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const LIVRAISON_FIXE = 2500;
const LIVRAISON_GRATUITE_SEUIL = 50000;

function formatPrix(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

/* ─── État vide ───────────────────────────────────────────── */
function PanierVide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        textAlign: 'center',
        gap: 20,
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'var(--em-l)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed var(--border2)',
        }}
      >
        <ShoppingCart size={48} color="var(--em)" strokeWidth={1.5} />
      </div>

      <h1
        style={{
          fontSize: 'clamp(22px,4vw,30px)',
          fontWeight: 700,
          color: 'var(--t1)',
        }}
      >
        Votre panier est vide
      </h1>
      <p style={{ fontSize: 14, color: 'var(--t3)', maxWidth: 380, lineHeight: 1.7 }}>
        Ajoutez des articles depuis nos vendeurs artisans et retrouvez-les ici.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/vendeurs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: 'var(--em)',
            color: '#fff',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          Découvrir les vendeurs →
        </Link>
        <Link
          href="/shop"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: 'var(--bg2)',
            color: 'var(--t1)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          Voir la boutique
        </Link>
      </div>
    </motion.div>
  );
}

/* ─── Ligne article ───────────────────────────────────────── */
type ArticleRowProps = {
  article: {
    id: string;
    nom: string;
    prix: number;
    quantite: number;
    image?: string;
  };
  onModifier: (quantite: number) => void;
  onRetirer: () => void;
};

function ArticleRow({ article, onModifier, onRetirer }: ArticleRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        display: 'flex',
        gap: 16,
        padding: 16,
        background: 'var(--bg3)',
        borderRadius: 14,
        border: '1px solid var(--border)',
        marginBottom: 12,
        alignItems: 'center',
      }}
    >
      {/* Image */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 10,
          background: article.image
            ? `url(${article.image}) center/cover`
            : 'var(--bg4)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        {!article.image && (
          <Package size={22} color="var(--t3)" strokeWidth={1.5} />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--t1)', marginBottom: 4, lineHeight: 1.3 }}>
          {article.nom}
        </p>
        <p style={{ fontSize: 12, color: 'var(--em)', fontWeight: 600 }}>
          {formatPrix(article.prix)} / unité
        </p>
      </div>

      {/* Contrôles quantité */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => onModifier(article.quantite - 1)}
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--bg4)', border: '1px solid var(--border)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--t1)',
          }}
          aria-label="Diminuer"
        >
          <Minus size={13} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', minWidth: 24, textAlign: 'center' }}>
          {article.quantite}
        </span>
        <button
          onClick={() => onModifier(article.quantite + 1)}
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--bg4)', border: '1px solid var(--border)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--t1)',
          }}
          aria-label="Augmenter"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Prix total + supprimer */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0, minWidth: 100 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)' }}>
          {formatPrix(article.prix * article.quantite)}
        </span>
        <button
          onClick={onRetirer}
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'rgba(220,38,38,.08)', border: '1px solid rgba(220,38,38,.2)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#dc2626',
          }}
          aria-label="Supprimer"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Page principale ─────────────────────────────────────── */
export default function PanierPage() {
  const router = useRouter();
  const { items, updateQty, removeItem, clearCart, total, count } = useCart();

  const fraisLivraison = total >= LIVRAISON_GRATUITE_SEUIL ? 0 : LIVRAISON_FIXE;
  const totalFinal = total + fraisLivraison;

  const handleCommander = () => {
    router.push('/checkout?source=panier');
  };

  if (items.length === 0) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <PanierVide />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <Link
            href="/vendeurs"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--t3)', textDecoration: 'none', marginBottom: 14 }}
          >
            <ArrowLeft size={14} /> Retour aux vendeurs
          </Link>
          <h1 style={{ fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: 'var(--t1)' }}>
            Mon Panier{' '}
            <span style={{ color: 'var(--em)' }}>
              ({count} article{count !== 1 ? 's' : ''})
            </span>
          </h1>
        </div>

        {/* Grid deux colonnes */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 28,
            alignItems: 'start',
          }}
        >
          {/* Liste articles */}
          <div style={{ gridColumn: 'span 2' }}>
            <AnimatePresence initial={false}>
              {items.map((article) => (
                <ArticleRow
                  key={article.id}
                  article={article}
                  onModifier={(q) => updateQty(article.id, q)}
                  onRetirer={() => removeItem(article.id)}
                />
              ))}
            </AnimatePresence>

            <button
              onClick={clearCart}
              style={{
                marginTop: 8,
                fontSize: 12,
                color: 'var(--t3)',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Vider le panier
            </button>
          </div>

          {/* Résumé commande */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'var(--bg3)',
              borderRadius: 16,
              border: '1px solid var(--border)',
              padding: 24,
              position: 'sticky',
              top: 100,
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--t1)', marginBottom: 20 }}>
              Résumé de commande
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--t3)', marginBottom: 10 }}>
              <span>Sous-total ({count} art.)</span>
              <span style={{ fontWeight: 700, color: 'var(--t1)' }}>{formatPrix(total)}</span>
            </div>
            <div
              style={{
                display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--t3)',
                marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)',
              }}
            >
              <span>Livraison</span>
              {fraisLivraison === 0 ? (
                <span style={{ fontWeight: 600, color: 'var(--green)' }}>Gratuite 🎉</span>
              ) : (
                <span style={{ fontWeight: 600, color: 'var(--em)' }}>{formatPrix(fraisLivraison)}</span>
              )}
            </div>

            {fraisLivraison > 0 && (
              <p style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 12, lineHeight: 1.5 }}>
                Livraison gratuite dès {formatPrix(LIVRAISON_GRATUITE_SEUIL)} d&apos;achats
              </p>
            )}

            <div
              style={{
                display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800,
                color: 'var(--t1)', marginBottom: 24,
              }}
            >
              <span>Total</span>
              <span style={{ color: 'var(--em)' }}>{formatPrix(totalFinal)}</span>
            </div>

            <motion.button
              onClick={handleCommander}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: 'var(--em)',
                color: '#fff',
                borderRadius: 12,
                border: 'none',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                marginBottom: 10,
              }}
            >
              Passer la commande →
            </motion.button>

            <p style={{ fontSize: 11, color: 'var(--t3)', textAlign: 'center', lineHeight: 1.5 }}>
              Paiement sécurisé — Orange Money, Wave, Espèces
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
