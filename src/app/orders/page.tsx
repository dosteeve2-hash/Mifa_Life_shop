import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mes commandes | Mifa Life',
  description: 'Suivez toutes vos commandes Mifa Life.',
};

type OrderItem = {
  id: string;
  quantity: number;
  price_cfa: number;
  product_id: number;
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  payment_status: string;
  payment_type: string;
  total_cfa: number;
  delivery_address: string;
  order_items: OrderItem[];
};

function formatPrice(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function orderNumber(id: string) {
  return 'ML' + id.slice(0, 6).toUpperCase();
}

const STATUS_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  pending:    { label: 'En attente',   bg: 'rgba(201,168,76,.14)', color: 'var(--mu)' },
  confirmed:  { label: 'Confirmée',    bg: 'var(--em-l)',           color: 'var(--em-d)' },
  shipped:    { label: 'Expédiée',     bg: 'rgba(0,87,195,.1)',     color: '#0057C3' },
  delivered:  { label: 'Livrée',       bg: 'var(--em-l)',           color: 'var(--em-d)' },
  cancelled:  { label: 'Annulée',      bg: '#FEF2F2',               color: '#DC2626' },
};

const PAY_LABELS: Record<string, string> = {
  orange: 'Orange Money',
  wave:   'Wave',
  cash:   'Livraison',
};

export default async function OrdersPage() {
  const supabase = await createServerSupabaseClient();

  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      created_at,
      status,
      payment_status,
      payment_type,
      total_cfa,
      delivery_address,
      order_items (
        id,
        quantity,
        price_cfa,
        product_id
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[orders page] fetch error:', error);
  }

  const orderList = (orders ?? []) as Order[];

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 60 }}>
      <div className="wrap" style={{ paddingTop: 36, maxWidth: 760 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(22px,4vw,30px)', fontWeight: 700, color: 'var(--sl)', marginBottom: 4 }}>
              Mes commandes
            </h1>
            <p style={{ fontSize: 13, color: 'var(--t4)' }}>
              {orderList.length > 0
                ? `${orderList.length} commande${orderList.length > 1 ? 's' : ''} au total`
                : 'Aucune commande pour le moment'}
            </p>
          </div>
          <Link
            href="/account"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', border: '1.5px solid var(--bg3)', borderRadius: 9, fontSize: 12, fontWeight: 700, color: 'var(--t2)', background: 'var(--white)', textDecoration: 'none' }}
          >
            ← Mon compte
          </Link>
        </div>

        {/* Empty state */}
        {orderList.length === 0 && (
          <div style={{ background: 'var(--white)', borderRadius: 'var(--rl)', border: '1.5px solid var(--bg3)', padding: 'clamp(40px,8vw,80px) clamp(20px,4vw,40px)', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--em-l)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--em)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 20, fontWeight: 700, color: 'var(--sl)', marginBottom: 8 }}>
              Aucune commande
            </h2>
            <p style={{ fontSize: 14, color: 'var(--t3)', marginBottom: 24, maxWidth: 320, margin: '0 auto 24px' }}>
              Vous n&apos;avez pas encore passé de commande. Découvrez nos produits !
            </p>
            <Link
              href="/shop"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'var(--em)', color: '#fff', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}
            >
              Découvrir la boutique →
            </Link>
          </div>
        )}

        {/* Orders list */}
        {orderList.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orderList.map((order) => {
              const st = STATUS_LABELS[order.status] ?? { label: order.status, bg: 'var(--bg3)', color: 'var(--t2)' };
              const itemCount = order.order_items.reduce((s, i) => s + i.quantity, 0);
              let addr: { firstName?: string; lastName?: string; city?: string } = {};
              try { addr = JSON.parse(order.delivery_address ?? '{}'); } catch { /* ignore */ }

              return (
                <div
                  key={order.id}
                  style={{ background: 'var(--white)', borderRadius: 'var(--rl)', border: '1.5px solid var(--bg3)', overflow: 'hidden' }}
                >
                  {/* Order header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--bg3)', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--sl)', fontFamily: '"Playfair Display", serif' }}>
                        #{orderNumber(order.id)}
                      </span>
                      <span style={{
                        display: 'inline-block', padding: '3px 11px', fontSize: 11, fontWeight: 700,
                        borderRadius: 20, background: st.bg, color: st.color,
                        textTransform: 'uppercase', letterSpacing: '0.06em',
                      }}>
                        {st.label}
                      </span>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--t4)' }}>{formatDate(order.created_at)}</span>
                  </div>

                  {/* Order body */}
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'flex-start' }}>

                      {/* Items summary */}
                      <div style={{ flex: '1 1 180px' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t4)', marginBottom: 6 }}>Articles</p>
                        <p style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>
                          {itemCount} article{itemCount > 1 ? 's' : ''}
                          {order.order_items.length > 0 && (
                            <span style={{ color: 'var(--t4)', fontWeight: 400 }}>
                              {' '}({order.order_items.length} référence{order.order_items.length > 1 ? 's' : ''})
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Delivery */}
                      {addr.city && (
                        <div style={{ flex: '1 1 160px' }}>
                          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t4)', marginBottom: 6 }}>Livraison</p>
                          <p style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>
                            {[addr.firstName, addr.lastName].filter(Boolean).join(' ')}
                          </p>
                          <p style={{ fontSize: 12, color: 'var(--t3)' }}>{addr.city}</p>
                        </div>
                      )}

                      {/* Payment */}
                      <div style={{ flex: '1 1 120px' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t4)', marginBottom: 6 }}>Paiement</p>
                        <p style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 500 }}>{PAY_LABELS[order.payment_type] ?? order.payment_type}</p>
                      </div>

                      {/* Total */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--t4)', marginBottom: 6 }}>Total</p>
                        <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--em)' }}>{formatPrice(order.total_cfa)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom link */}
        {orderList.length > 0 && (
          <div style={{ marginTop: 28, textAlign: 'center' }}>
            <Link
              href="/shop"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', border: '1.5px solid var(--bg3)', borderRadius: 10, fontSize: 13, fontWeight: 700, color: 'var(--t2)', background: 'var(--white)', textDecoration: 'none' }}
            >
              Continuer mes achats →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
