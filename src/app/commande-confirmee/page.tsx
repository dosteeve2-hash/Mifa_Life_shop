'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CommandeConfirmeePage() {
  const [orderNum, setOrderNum] = useState('');

  useEffect(() => {
    setOrderNum(`CMD-${Date.now()}`);
  }, []);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: 480, width: '100%' }}>

        {/* Icône animée */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          style={{ marginBottom: 24, display: 'inline-block' }}
        >
          <CheckCircle size={80} style={{ color: 'var(--gold, #C9A84C)' }} />
        </motion.div>

        {/* Titre */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(26px, 5vw, 36px)',
            fontWeight: 900,
            fontStyle: 'italic',
            color: 'var(--t1)',
            margin: '0 0 12px',
          }}
        >
          Commande confirmée !
        </motion.h1>

        {/* Label numéro */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: 'var(--t3)', marginBottom: 8 }}
        >
          Numéro de commande
        </motion.p>

        {/* Numéro CMD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55 }}
          style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'var(--bg2)',
            border: '1px solid var(--border2)',
            borderRadius: 8,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--gold, #C9A84C)',
            letterSpacing: '.06em',
            marginBottom: 28,
          }}
        >
          {orderNum}
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          style={{ fontSize: 14, color: 'var(--t2)', marginBottom: 36, lineHeight: 1.6 }}
        >
          Merci pour votre commande. Notre équipe vous contactera sous peu pour confirmer la livraison.
        </motion.p>

        {/* Boutons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link href="/collections" style={{
            padding: '12px 24px',
            background: 'var(--gold, #C9A84C)',
            color: '#0a0a14',
            borderRadius: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '.04em',
          }}>
            Continuer mes achats →
          </Link>
          <Link href="/" style={{
            padding: '12px 24px',
            background: 'var(--bg2)',
            color: 'var(--t1)',
            borderRadius: 10,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '.04em',
            border: '1px solid var(--border2)',
          }}>
            Accueil
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
