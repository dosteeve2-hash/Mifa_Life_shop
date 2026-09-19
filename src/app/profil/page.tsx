import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import ProfilClient from './ProfilClient';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mon profil | Mifa Life',
  description: 'Gérez votre profil, adresse de livraison et préférences Mifa Life.',
};

export type ProfilData = {
  prenom: string | null;
  nom: string | null;
  telephone: string | null;
  adresse_ligne1: string | null;
  adresse_ligne2: string | null;
  ville: string | null;
  pays: string | null;
  code_postal: string | null;
  avatar_url: string | null;
};

export default async function ProfilPage() {
  const supabase = await createServerSupabaseClient();

  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  let profil: ProfilData | null = null;
  try {
    const { data } = await supabase
      .from('profils')
      .select('prenom, nom, telephone, adresse_ligne1, adresse_ligne2, ville, pays, code_postal, avatar_url')
      .eq('user_id', user.id)
      .single();
    profil = data;
  } catch {
    // Table inexistante ou pas d'enregistrement — on passe null (fallback mock)
    profil = null;
  }

  return (
    <ProfilClient
      userId={user.id}
      email={user.email ?? ''}
      profil={profil}
    />
  );
}
