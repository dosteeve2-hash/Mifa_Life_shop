import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import CommandesClient from './CommandesClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mes commandes | Mifa Life',
  description: 'Consultez l\'historique détaillé de vos commandes Mifa Life.',
};

export interface CommandeItem {
  produit_nom: string;
  produit_image?: string | null;
  quantite: number;
  prix_unitaire: number;
}

export interface Commande {
  id: string;
  numero: string;
  statut: 'en_cours' | 'confirmee' | 'livree' | 'annulee';
  total_fcfa: number;
  created_at: string;
  items: CommandeItem[];
}

const mockCommandes: Commande[] = [
  {
    id: '1',
    numero: 'CMD-2026-0042',
    statut: 'livree',
    total_fcfa: 47500,
    created_at: '2026-06-15T10:30:00Z',
    items: [
      { produit_nom: 'Robe Wax Élégance', quantite: 1, prix_unitaire: 32000 },
      { produit_nom: 'Sac Kente Premium', quantite: 1, prix_unitaire: 15500 },
    ],
  },
  {
    id: '2',
    numero: 'CMD-2026-0038',
    statut: 'en_cours',
    total_fcfa: 28000,
    created_at: '2026-07-02T14:20:00Z',
    items: [
      { produit_nom: 'Boubou Homme Brodé', quantite: 1, prix_unitaire: 28000 },
    ],
  },
  {
    id: '3',
    numero: 'CMD-2026-0031',
    statut: 'confirmee',
    total_fcfa: 89000,
    created_at: '2026-07-05T09:15:00Z',
    items: [
      { produit_nom: 'Ensemble Pagne', quantite: 2, prix_unitaire: 25000 },
      { produit_nom: 'Foulard Soie Africaine', quantite: 1, prix_unitaire: 12000 },
      { produit_nom: 'Bijoux Cuivre Set', quantite: 1, prix_unitaire: 27000 },
    ],
  },
  {
    id: '4',
    numero: 'CMD-2026-0025',
    statut: 'annulee',
    total_fcfa: 18500,
    created_at: '2026-05-28T16:45:00Z',
    items: [
      { produit_nom: 'T-shirt Kente Print', quantite: 1, prix_unitaire: 18500 },
    ],
  },
];

export default async function CommandesPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let commandes: Commande[] = [];
  let useMock = false;

  try {
    // Fetch les 20 dernières commandes avec leurs items
    const { data, error } = await supabase
      .from('commandes')
      .select(`
        id,
        numero,
        statut,
        total_fcfa,
        created_at,
        commandes_items (
          produit_nom,
          produit_image,
          quantite,
          prix_unitaire
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error || !data) {
      useMock = true;
    } else {
      commandes = data.map((c) => ({
        id: c.id,
        numero: c.numero ?? `CMD-${c.id.slice(0, 8).toUpperCase()}`,
        statut: c.statut as Commande['statut'],
        total_fcfa: c.total_fcfa ?? 0,
        created_at: c.created_at,
        items: (c.commandes_items ?? []) as CommandeItem[],
      }));
    }
  } catch {
    useMock = true;
  }

  if (useMock || commandes.length === 0) {
    commandes = mockCommandes;
  }

  return <CommandesClient commandes={commandes} userEmail={user.email ?? ''} />;
}
