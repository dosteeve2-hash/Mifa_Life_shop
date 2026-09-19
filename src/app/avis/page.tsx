import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import AvisClient from './AvisClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Avis clients | Mifa Life',
  description: 'Découvrez les avis et témoignages de nos clients sur MIFA Life.',
};

export type Avis = {
  id: string;
  user_id: string | null;
  produit_id: string;
  nom_auteur: string;
  note: number;
  commentaire: string;
  created_at: string;
};

export default async function AvisPage() {
  const supabase = await createServerSupabaseClient();

  // getUser() — jamais getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: avisData, error } = await supabase
    .from('avis')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  const avis: Avis[] = error ? [] : (avisData ?? []);

  return <AvisClient avis={avis} userId={user?.id ?? null} />;
}
