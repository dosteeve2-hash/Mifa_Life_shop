import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import SuiviCommandesClient from './SuiviCommandesClient';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Suivi des commandes | Mifa Life',
  description: 'Suivez vos commandes en temps réel avec notre système de tracking.',
};

/* ── Types ── */
export type EtapeLivraison = {
  id: string;
  label: string;
  description: string;
  completee: boolean;
  date?: string;
};

export type Commande = {
  id: string;
  numero: string;
  produit: string;
  image: string;
  prix: number;
  date: string;
  statutActuel: string;
  etapes: EtapeLivraison[];
};

/* ── Mocks ── */
const MOCKS_COMMANDES: Commande[] = [
  {
    id: 'cmd-001',
    numero: 'MFL-2026-001',
    produit: 'Boubou Grande Occasion - Indigo Royal',
    image: '/images/products/boubou-indigo.jpg',
    prix: 45000,
    date: '2026-07-01',
    statutActuel: 'En transit',
    etapes: [
      { id: 'e1', label: 'Commandé', description: 'Commande confirmée et paiement reçu', completee: true, date: '01 Juil. 2026, 10:24' },
      { id: 'e2', label: 'Préparé', description: 'Article sélectionné et emballé par notre équipe', completee: true, date: '02 Juil. 2026, 09:15' },
      { id: 'e3', label: 'Expédié', description: 'Colis remis au transporteur', completee: true, date: '03 Juil. 2026, 14:00' },
      { id: 'e4', label: 'En transit', description: 'Colis en route vers votre adresse', completee: true, date: '05 Juil. 2026, 08:30' },
      { id: 'e5', label: 'Livré', description: 'Colis livré à destination', completee: false },
    ],
  },
  {
    id: 'cmd-002',
    numero: 'MFL-2026-002',
    produit: 'Ensemble Wax Ankara - Sunset Collection',
    image: '/images/products/wax-sunset.jpg',
    prix: 28500,
    date: '2026-07-03',
    statutActuel: 'Expédié',
    etapes: [
      { id: 'e1', label: 'Commandé', description: 'Commande confirmée et paiement reçu', completee: true, date: '03 Juil. 2026, 16:40' },
      { id: 'e2', label: 'Préparé', description: 'Article sélectionné et emballé par notre équipe', completee: true, date: '04 Juil. 2026, 11:00' },
      { id: 'e3', label: 'Expédié', description: 'Colis remis au transporteur', completee: true, date: '06 Juil. 2026, 13:20' },
      { id: 'e4', label: 'En transit', description: 'Colis en route vers votre adresse', completee: false },
      { id: 'e5', label: 'Livré', description: 'Colis livré à destination', completee: false },
    ],
  },
  {
    id: 'cmd-003',
    numero: 'MFL-2026-003',
    produit: 'Kaftan Soie Brodée - Blanc Ivoire',
    image: '/images/products/kaftan-ivoire.jpg',
    prix: 62000,
    date: '2026-06-15',
    statutActuel: 'Livré',
    etapes: [
      { id: 'e1', label: 'Commandé', description: 'Commande confirmée et paiement reçu', completee: true, date: '15 Juin 2026, 09:00' },
      { id: 'e2', label: 'Préparé', description: 'Article sélectionné et emballé par notre équipe', completee: true, date: '16 Juin 2026, 10:30' },
      { id: 'e3', label: 'Expédié', description: 'Colis remis au transporteur', completee: true, date: '17 Juin 2026, 08:45' },
      { id: 'e4', label: 'En transit', description: 'Colis en route vers votre adresse', completee: true, date: '19 Juin 2026, 15:00' },
      { id: 'e5', label: 'Livré', description: 'Colis livré à destination', completee: true, date: '21 Juin 2026, 11:20' },
    ],
  },
  {
    id: 'cmd-004',
    numero: 'MFL-2026-004',
    produit: 'Dashiki Premium - Terracotta & Or',
    image: '/images/products/dashiki-terracotta.jpg',
    prix: 19800,
    date: '2026-07-08',
    statutActuel: 'Préparé',
    etapes: [
      { id: 'e1', label: 'Commandé', description: 'Commande confirmée et paiement reçu', completee: true, date: '08 Juil. 2026, 14:10' },
      { id: 'e2', label: 'Préparé', description: 'Article sélectionné et emballé par notre équipe', completee: true, date: '09 Juil. 2026, 10:00' },
      { id: 'e3', label: 'Expédié', description: 'Colis remis au transporteur', completee: false },
      { id: 'e4', label: 'En transit', description: 'Colis en route vers votre adresse', completee: false },
      { id: 'e5', label: 'Livré', description: 'Colis livré à destination', completee: false },
    ],
  },
];

export default async function SuiviCommandesPage() {
  const supabase = await createServerSupabaseClient();

  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <SuiviCommandesClient
      commandes={MOCKS_COMMANDES}
      user={{ id: user.id, email: user.email ?? '' }}
    />
  );
}
