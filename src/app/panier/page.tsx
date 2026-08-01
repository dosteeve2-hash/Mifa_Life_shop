'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { usePanier } from '@/context/PanierContext';

const LIVRAISON = 500; // FCFA fixe

function formatPrix(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
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
          background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(0,212,255,0.08))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed rgba(212,175,55,0.3)',
        }}
      >
        <ShoppingCart size={48} color="var(--gold)" strokeWidth={1.5} />
      </div>

      <h1
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(22px,4vw,30px)',
          fontWeight: 700,
          fontStyle: 'italic',
          color: 'var(--text)',
        }}
      >
        Votre panier est vide
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text2)', maxWidth: 380, lineHeight: 1.7 }}>
        Ajoutez des articles depuis nos vendeurs artisans africains et retrouvez-les ici.
      </p>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/vendeurs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: 'var(--gold)',
            color: 'var(--bg)',
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
            color: 'var(--text)',
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
    vendeur: string;
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
        background: 'var(--bg2)',
        borderRadius: 14,
        border: '1px solid var(--border)',
        marginBottom: 12,
        alignItems: 'center',
      }}
    >
      {/* Image placeholder Navy */}
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 10,
          background: article.image
            ? `url(${article.image}) center/cover`
            : 'linear-gradient(135deg, #0A1628, #152240)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(212,175,55,0.15)',
        }}
      >
        {!article.image && (
          <ShoppingCart size={22} color="rgba(212,175,55,0.5)" strokeWidth={1.5} />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4, lineHeight: 1.3 }}>
          {article.nom}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>
          Vendeur : {article.vendeur}
        </p>
        <p style={{ fontSize: 12, color: 'var(--gold)' }}>
          {formatPrix(article.prix)} / unité
        </p>
      </div>

      {/* Contrôles quantité */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => onModifier(article.quantite - 1)}
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--bg3)', border: '1px solid var(--border)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text)',
          }}
          aria-label="Diminuer"
        >
          <Minus size={13} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', minWidth: 24, textAlign: 'center' }}>
          {article.quantite}
        </span>
        <button
          onClick={() => onModifier(article.quantite + 1)}
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--bg3)', border: '1px solid var(--border)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text)',
          }}
          aria-label="Augmenter"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Prix total + supprimer */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0, minWidth: 100 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
          {formatPrix(article.prix * article.quantite)}
        </span>
        <button
          onClick={onRetirer}
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ef4444',
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
  const { articles, modifierQuantite, retirerArticle, viderPanier, total, nombreArticles } = usePanier();

  const handleCommander = () => {
    viderPanier();
    toast.success('Commande passée ! Notre équipe vous contactera sous 24h', {
      duration: 5000,
      icon: '✅',
    });
  };

  if (articles.length === 0) {
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
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text3)', textDecoration: 'none', marginBottom: 14 }}
          >
            <ArrowLeft size={14} /> Retour aux vendeurs
          </Link>
          <h1
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: 'clamp(22px,4vw,32px)',
              fontWeight: 700,
              fontStyle: 'italic',
              color: 'var(--text)',
            }}
          >
            Mon Panier{' '}
            <span style={{ color: 'var(--gold)' }}>
              ({nombreArticles} article{nombreArticles !== 1 ? 's' : ''})
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
              {articles.map((article) => (
                <ArticleRow
                  key={article.id}
                  article={article}
                  onModifier={(q) => modifierQuantite(article.id, q)}
                  onRetirer={() => retirerArticle(article.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Résumé */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'var(--bg2)',
              borderRadius: 16,
              border: '1px solid var(--border)',
              padding: 24,
              position: 'sticky',
              top: 100,
            }}
          >
            <h2
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 18,
                fontWeight: 700,
                fontStyle: 'italic',
                color: 'var(--text)',
                marginBottom: 20,
              }}
            >
              Résumé de commande
            </h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text3)', marginBottom: 10 }}>
              <span>Sous-total ({nombreArticles} art.)</span>
              <span style={{ fontWeight: 700, color: 'var(--text)' }}>{formatPrix(total)}</span>
            </div>
            <div
              style={{
                display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text3)',
                marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)',
              }}
            >
              <span>Frais de livraison</span>
              <span style={{ fontWeight: 600, color: 'var(--gold)' }}>{formatPrix(LIVRAISON)}</span>
            </div>
            <div
              style={{
                display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 800,
                color: 'var(--text)', marginBottom: 24,
              }}
            >
              <span>Total</span>
              <span style={{ color: 'var(--gold)' }}>{formatPrix(total + LIVRAISON)}</span>
            </div>

            <motion.button
              onClick={handleCommander}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: 'linear-gradient(135deg, var(--gold), #b8922e)',
                color: '#0A1628',
                borderRadius: 12,
                border: 'none',
                fontWeight: 800,
                fontSize: 15,
                cursor: 'pointer',
                marginBottom: 10,
                letterSpacing: 0.3,
              }}
            >
              Passer commande →
            </motion.button>

            <p style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', lineHeight: 1.5 }}>
              Notre équipe vous contactera sous 24h pour confirmer votre commande.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
