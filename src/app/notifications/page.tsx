'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bell, ShoppingBag, Truck, Tag, CheckCircle } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

let _sb: ReturnType<typeof createBrowserClient> | null = null;
function getSb() {
  if (!_sb) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    if (url && key) _sb = createBrowserClient(url, key);
  }
  return _sb;
}

interface Notif {
  id: string;
  type: 'order' | 'promo' | 'delivery' | 'info';
  title: string;
  body: string;
  created_at: string;
  read: boolean;
}

const TYPE_CONFIG: Record<string, { Icon: React.ElementType; bg: string; color: string }> = {
  order:    { Icon: ShoppingBag, bg: 'var(--em-l)',          color: 'var(--em)' },
  delivery: { Icon: Truck,        bg: 'rgba(0,87,195,.1)',    color: '#0057C3' },
  promo:    { Icon: Tag,          bg: 'var(--or-l)',          color: 'var(--or)' },
  info:     { Icon: Bell,         bg: 'var(--bg2)',           color: 'var(--t3)' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "À l'instant";
  if (m < 60) return `Il y a ${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  return `Il y a ${d}j`;
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const sb = getSb();
    if (!sb) { setLoading(false); return; }
    sb.auth.getUser().then(({ data }) => {
      if (!data.user) { setLoading(false); return; }
      setAuthed(true);
      sb.from('notifications')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
        .limit(30)
        .then(({ data: rows }) => {
          setNotifs((rows as Notif[]) ?? []);
          setLoading(false);
        });
    });
  }, []);

  const markAllRead = async () => {
    const sb = getSb();
    if (!sb) return;
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    await sb.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div style={{ background: 'var(--sl3)', padding: 'clamp(24px,4vw,48px) 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(0,137,123,0.06)', pointerEvents: 'none' }} />
        <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
          <nav style={{ display: 'flex', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.38)', marginBottom: 14 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Accueil</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Notifications</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(22px,4vw,34px)', fontWeight: 700, color: '#fff', marginBottom: 8 }}>Notifications</h1>
              {unread > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'var(--em)', borderRadius: 20, fontSize: 12, fontWeight: 700, color: '#fff' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} /> {unread} non lue{unread > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 10, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                <CheckCircle size={13} /> Tout marquer comme lu
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="wrap" style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 680 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 76, borderRadius: 12, background: 'linear-gradient(90deg, var(--bg2) 25%, var(--bg3) 50%, var(--bg2) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s ease-in-out infinite' }} />
            ))}
          </div>
        ) : !authed ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: 'clamp(40px,8vw,80px) 20px' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>🔒</div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 700, color: 'var(--sl)', marginBottom: 10 }}>Connexion requise</h2>
            <p style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 24 }}>Connectez-vous pour voir vos notifications.</p>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Se connecter →</Link>
          </motion.div>
        ) : notifs.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: 'clamp(40px,8vw,80px) 20px' }}>
            <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 2.5 }} style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
              <Bell size={32} strokeWidth={1} color="var(--t4)" />
            </motion.div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 22, fontWeight: 700, color: 'var(--sl)', marginBottom: 10 }}>Aucune notification</h2>
            <p style={{ fontSize: 14, color: 'var(--t3)', maxWidth: 360, margin: '0 auto 28px', lineHeight: 1.7 }}>Vous serez notifié des mises à jour de vos commandes, promotions et offres exclusives.</p>
            <Link href="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              <ShoppingBag size={14} /> Explorer la boutique
            </Link>
          </motion.div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifs.map((n) => {
              const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.info;
              const Icon = cfg.Icon;
              return (
                <motion.div
                  key={n.id}
                  variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } } }}
                  style={{ display: 'flex', gap: 14, padding: '16px 20px', background: n.read ? 'var(--white)' : 'var(--em-l)', border: `1px solid ${n.read ? 'var(--bg3)' : 'var(--em-g)'}`, borderRadius: 12, alignItems: 'flex-start' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--sl)', marginBottom: 3 }}>{n.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--t3)', lineHeight: 1.6 }}>{n.body}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: 'var(--t4)' }}>{timeAgo(n.created_at)}</span>
                    {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--em)' }} />}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
