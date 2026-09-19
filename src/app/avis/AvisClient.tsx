'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { Avis } from './page';

// ─── Mock fallback ───────────────────────────────────────────────────────────
const MOCK_AVIS: Avis[] = [
  {
    id: 'm1',
    user_id: null,
    produit_id: 'general',
    nom_auteur: 'Aminata K.',
    note: 5,
    commentaire: 'Livraison ultra rapide et produits de qualité. Je recommande MIFA Life sans hésiter !',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'm2',
    user_id: null,
    produit_id: 'general',
    nom_auteur: 'Moussa D.',
    note: 4,
    commentaire: 'Très bon service client, réactif et professionnel. Les produits correspondent exactement aux descriptions.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'm3',
    user_id: null,
    produit_id: 'general',
    nom_auteur: 'Fatou B.',
    note: 5,
    commentaire: 'Ma première commande sur MIFA Life et je suis conquise. Emballage soigné, produit impeccable.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'm4',
    user_id: null,
    produit_id: 'general',
    nom_auteur: 'Ibrahima S.',
    note: 4,
    commentaire: 'Rapport qualité-prix excellent. J\'ai commandé plusieurs fois et je suis toujours satisfait.',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'm5',
    user_id: null,
    produit_id: 'general',
    nom_auteur: 'Kadiatou T.',
    note: 5,
    commentaire: 'Le meilleur site de e-commerce africain ! Sérieux, fiable et des prix imbattables.',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function StarDisplay({ note, size = 16 }: { note: number; size?: number }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{ color: s <= note ? '#F59E0B' : '#334155', fontSize: size }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function StarInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <span style={{ display: 'inline-flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 28,
            color: s <= (hovered || value) ? '#F59E0B' : '#334155',
            transition: 'color 0.15s',
            padding: '0 2px',
          }}
          aria-label={`${s} étoile${s > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </span>
  );
}

// ─── Stats ───────────────────────────────────────────────────────────────────
function AvisStats({ avis }: { avis: Avis[] }) {
  const total = avis.length;
  const moyenne = total > 0 ? avis.reduce((s, a) => s + a.note, 0) / total : 0;

  const dist = [5, 4, 3, 2, 1].map((n) => ({
    note: n,
    count: avis.filter((a) => a.note === n).length,
    pct: total > 0 ? (avis.filter((a) => a.note === n).length / total) * 100 : 0,
  }));

  return (
    <div
      style={{
        background: 'rgba(15,23,42,0.7)',
        border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 16,
        padding: '28px 32px',
        display: 'flex',
        gap: 40,
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 40,
      }}
    >
      {/* Score global */}
      <div style={{ textAlign: 'center', minWidth: 100 }}>
        <div style={{ fontSize: 56, fontWeight: 800, color: '#F59E0B', lineHeight: 1 }}>
          {moyenne.toFixed(1)}
        </div>
        <div style={{ marginTop: 8 }}>
          <StarDisplay note={Math.round(moyenne)} size={20} />
        </div>
        <div style={{ color: '#94A3B8', fontSize: 13, marginTop: 6 }}>
          {total} avis
        </div>
      </div>

      {/* Distribution */}
      <div style={{ flex: 1, minWidth: 220 }}>
        {dist.map(({ note, count, pct }) => (
          <div
            key={note}
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}
          >
            <span style={{ color: '#F59E0B', fontSize: 13, width: 16 }}>{note}</span>
            <span style={{ color: '#F59E0B', fontSize: 12 }}>★</span>
            <div
              style={{
                flex: 1,
                height: 8,
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: (5 - note) * 0.1 }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #F59E0B, #FCD34D)',
                  borderRadius: 4,
                }}
              />
            </div>
            <span style={{ color: '#64748B', fontSize: 12, width: 20, textAlign: 'right' }}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Card avis ───────────────────────────────────────────────────────────────
function AvisCard({ avis, index }: { avis: Avis; index: number }) {
  const date = new Date(avis.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      style={{
        background: 'rgba(15,23,42,0.7)',
        border: '1px solid rgba(245,158,11,0.12)',
        borderRadius: 14,
        padding: '20px 24px',
        display: 'flex',
        gap: 16,
      }}
    >
      {/* Avatar initiales */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0F172A',
          fontWeight: 700,
          fontSize: 15,
          flexShrink: 0,
        }}
      >
        {getInitials(avis.nom_auteur)}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 4 }}>
          <div>
            <span style={{ color: '#F1F5F9', fontWeight: 600, fontSize: 15 }}>{avis.nom_auteur}</span>
            <div style={{ marginTop: 2 }}>
              <StarDisplay note={avis.note} size={14} />
            </div>
          </div>
          <span style={{ color: '#475569', fontSize: 12 }}>{date}</span>
        </div>
        <p style={{ color: '#CBD5E1', fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>
          {avis.commentaire}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Formulaire ──────────────────────────────────────────────────────────────
function FormulaireAvis({
  userId,
  onSuccess,
}: {
  userId: string | null;
  onSuccess: (avis: Avis) => void;
}) {
  const [open, setOpen] = useState(false);
  const [nom, setNom] = useState('');
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim() || note === 0 || !commentaire.trim()) {
      setMessage({ type: 'error', text: 'Merci de remplir tous les champs et de choisir une note.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const payload = {
        user_id: userId,
        produit_id: 'general',
        nom_auteur: nom.trim(),
        note,
        commentaire: commentaire.trim(),
      };
      const { data, error } = await supabase.from('avis').insert(payload).select().single();
      if (error) throw error;
      onSuccess(data as Avis);
      setNom('');
      setNote(0);
      setCommentaire('');
      setOpen(false);
      setMessage({ type: 'success', text: 'Votre avis a bien été publié !' });
    } catch {
      // silencieux si non connecté ou erreur réseau
      setMessage({ type: 'error', text: 'Impossible de publier l\'avis. Réessayez plus tard.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 40 }}>
      {!open && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: '#0F172A',
            fontWeight: 700,
            fontSize: 15,
            padding: '12px 28px',
            borderRadius: 10,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ✍️ Laisser un avis
        </motion.button>
      )}

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 12,
            padding: '10px 16px',
            borderRadius: 8,
            fontSize: 14,
            background: message.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
            color: message.type === 'success' ? '#10B981' : '#EF4444',
            border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          }}
        >
          {message.text}
        </motion.div>
      )}

      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.35 }}
            onSubmit={handleSubmit}
            style={{
              overflow: 'hidden',
              background: 'rgba(15,23,42,0.85)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 14,
              padding: '24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <h3 style={{ color: '#F59E0B', fontWeight: 700, fontSize: 17, margin: 0 }}>
              Votre avis
            </h3>

            <div>
              <label style={{ color: '#94A3B8', fontSize: 13, display: 'block', marginBottom: 6 }}>
                Votre nom *
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex : Aminata K."
                required
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#F1F5F9',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ color: '#94A3B8', fontSize: 13, display: 'block', marginBottom: 8 }}>
                Note *
              </label>
              <StarInput value={note} onChange={setNote} />
            </div>

            <div>
              <label style={{ color: '#94A3B8', fontSize: 13, display: 'block', marginBottom: 6 }}>
                Commentaire *
              </label>
              <textarea
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                placeholder="Partagez votre expérience avec MIFA Life..."
                required
                rows={4}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#F1F5F9',
                  fontSize: 14,
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{
                  background: loading ? '#475569' : 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#0F172A',
                  fontWeight: 700,
                  fontSize: 14,
                  padding: '10px 22px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Envoi...' : 'Publier'}
              </motion.button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#94A3B8',
                  fontWeight: 600,
                  fontSize: 14,
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                }}
              >
                Annuler
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Composant principal ─────────────────────────────────────────────────────
export default function AvisClient({
  avis: initialAvis,
  userId,
}: {
  avis: Avis[];
  userId: string | null;
}) {
  const [avis, setAvis] = useState<Avis[]>(
    initialAvis.length > 0 ? initialAvis : MOCK_AVIS
  );

  const handleNewAvis = (nouvelAvis: Avis) => {
    setAvis((prev) => [nouvelAvis, ...prev]);
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0F172A 0%, #0a1220 100%)',
        padding: '60px 16px',
      }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div style={{ display: 'inline-block', marginBottom: 16 }}>
            <span
              style={{
                background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.3)',
                color: '#F59E0B',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '5px 14px',
                borderRadius: 20,
              }}
            >
              Témoignages
            </span>
          </div>
          <h1
            style={{
              color: '#F1F5F9',
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: 800,
              margin: '0 0 14px',
              lineHeight: 1.2,
            }}
          >
            Avis clients
          </h1>
          <p style={{ color: '#94A3B8', fontSize: 16, margin: 0 }}>
            Ce que nos clients disent de{' '}
            <span style={{ color: '#F59E0B', fontWeight: 600 }}>MIFA Life</span>
          </p>
        </motion.div>

        {/* Stats globales */}
        <AvisStats avis={avis} />

        {/* Formulaire */}
        <FormulaireAvis userId={userId} onSuccess={handleNewAvis} />

        {/* Liste avis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnimatePresence initial={false}>
            {avis.map((a, i) => (
              <AvisCard key={a.id} avis={a} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {avis.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', color: '#475569', padding: '60px 0', fontSize: 15 }}
          >
            Aucun avis pour le moment. Soyez le premier à partager votre expérience !
          </motion.div>
        )}
      </div>
    </main>
  );
}
