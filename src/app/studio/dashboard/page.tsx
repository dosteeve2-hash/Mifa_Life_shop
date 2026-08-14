import type { Metadata } from 'next';
import DashboardShell from '@/components/studio/dashboard/DashboardShell';

export const metadata: Metadata = {
  title: 'Dashboard — FORGE UI',
  description: 'Dashboard marketplace animé : KPI, courbes, fil d’activité et classement produits.',
  robots: { index: false, follow: false },
};

export default function StudioDashboardPage() {
  return <DashboardShell />;
}
