'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

type Commande = {
  id: string;
  created_at: string;
  total: number;
  statut: string;
  [key: string]: unknown;
};

type Props = {
  user: User;
  commandes: Record<string, unknown>[];
};

let _supabase: ReturnType<typeof createBrowserClient> | null = null;
function getSupabase() {
  if (typeof window === 'undefined') return null;
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return null;
    _supabase = createBrowserClient(url, key);
  }
  return _supabase;
}

function getInitials(email: string): string {
  const local = email.split('@')[0];
  const parts = local.split(/[._\-]+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0] ?? '')
    .join('')
    .toUpperCase() || '?';
}

function formatMembreSince(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

function formatFCFA(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

const STATUT_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  en_attente: { label: 'En attente', bg: 'rgba(240,168,50,0.12)',  color: '#f0a832' },
  confirmée:  { label: 'Confirmée',  bg: 'rgba(34,217,138,0.12)',   color: '#22d98a' },
  livrée:     { label: 'Livrée',     bg: 'rgba(247,192,96,0.20)',   color: '#f7c060' },
};

export default function CompteClient({ user, commandes }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initials = getInitials(user.email ?? '');
  const membreSince = user.created_at ? formatMembreSince(user.created_at) : '—';

  async function handleLogout() {
    const sb = getSupabase();
    if (sb) await sb.auth.signOut();
    try {
      await fetch('/api/auth/signout', { method: 'POST', redirect: 'manual' });
    } catch {}
    startTransition(() => {
      router.push('/');
      router.refresh();
    });
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      <div className="wrap" style={{ paddingTop: 40, maxWidth: 720 }}>

        {/* En-tête */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: 'var(--t1)', marginBottom: 4 }}>
            Mon compte
          </h1>
          <p style={{ fontSize: 13, color: 'var(--t3)' }}>Votre espace personnel Mifa Life</p>
        </div>

        {/* ── Section Profil ── */}
        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--rl)', border: '1.5px solid var(--border2)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ height: 3, background: 'linear-gradient(90deg, var(--gold3) 0%, var(--gold) 40%, var(--gold2) 60%, var(--gold3) 100%)' }} />
          <div style={{ padding: 'clamp(20px,4vw,32px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              {/* Avatar initiales */}
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold3) 100%)',
                color: '#0a0f08', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 800, flexShrink: 0, letterSpacing: '-0.02em',
                fontFamily: '"Playfair Display", serif',
              }}>
                {initials}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--t1)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </div>
                <div style={{ fontSize: 12, color: 'var(--t3)' }}>
                  Membre depuis {membreSince}
                </div>
              </div>
              {/* Bouton déconnexion */}
              <button
                onClick={handleLogout}
                disabled={isPending}
                style={{
                  flexShrink: 0, padding: '9px 18px',
                  border: '1.5px solid rgba(239,68,68,0.35)', borderRadius: 10,
                  fontSize: 12, fontWeight: 700, color: '#ef4444',
                  background: 'rgba(239,68,68,0.06)',
                  cursor: isPending ? 'wait' : 'pointer',
                  transition: 'background 0.18s', opacity: isPending ? 0.6 : 1,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.14)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
              >
                {isPending ? 'Déconnexion…' : 'Se déconnecter'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Section Historique commandes ── */}
        <div style={{ background: 'var(--bg3)', borderRadius: 'var(--rl)', border: '1.5px solid var(--border2)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t3)' }}>
              Historique des commandes
            </p>
            <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'JetBrains Mono, monospace' }}>
              {commandes.length} commande{commandes.length !== 1 ? 's' : ''}
            </span>
          </div>

          {commandes.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🛍️</div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--t2)', marginBottom: 8 }}>
                Vous n&apos;avez pas encore de commande
              </p>
              <p style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 20 }}>
                Découvrez notre sélection de produits premium
              </p>
              <Link
                href="/collections"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 22px', background: 'var(--gold)', color: '#0a0f08',
                  borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none',
                }}
              >
                Commencer mes achats →
              </Link>
            </div>
          ) : (
            <div>
              {commandes.map((rawCmd, idx) => {
                const cmd = rawCmd as Commande;
                const statut =
                  STATUT_CONFIG[cmd.statut] ??
                  { label: cmd.statut, bg: 'rgba(120,120,120,0.1)', color: 'var(--t3)' };
                return (
                  <div
                    key={cmd.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto auto',
                      alignItems: 'center',
                      gap: 'clamp(10px,2vw,20px)',
                      padding: '14px 24px',
                      borderBottom: idx < commandes.length - 1 ? '1px solid var(--border)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg4)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                  >
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--t1)', fontFamily: 'JetBrains Mono, monospace' }}>
                        CMD-{String(cmd.id).slice(0, 8).toUpperCase()}
                      </span>
                      <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>
                        {formatDate(cmd.created_at)}
                      </div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
                      {formatFCFA(Number(cmd.total))}
                    </span>
                    <span style={{
                      padding: '4px 10px', borderRadius: 20,
                      fontSize: 11, fontWeight: 700,
                      background: statut.bg, color: statut.color,
                      whiteSpace: 'nowrap',
                    }}>
                      {statut.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
