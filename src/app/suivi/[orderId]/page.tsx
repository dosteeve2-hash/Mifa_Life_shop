import { Suspense } from 'react';
import TrackingClient from './TrackingClient';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

function TrackingSkeleton() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <style>{`@keyframes ts-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 36, height: 36, border: '3px solid #e4ebf5',
        borderTop: '3px solid #00BCD4', borderRadius: '50%',
        animation: 'ts-spin 0.8s linear infinite' }} />
      <p style={{ fontSize: 13, color: 'var(--t3)' }}>Chargement de votre commande…</p>
    </div>
  );
}

export default async function SuiviPage({ params }: PageProps) {
  const { orderId } = await params;
  return (
    <Suspense fallback={<TrackingSkeleton />}>
      <TrackingClient orderId={orderId} />
    </Suspense>
  );
}
