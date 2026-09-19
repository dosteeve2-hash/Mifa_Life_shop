import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import ParametresClient from './ParametresClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Paramètres | Mifa Life',
  description: 'Gérez vos notifications, préférences et sécurité de votre compte Mifa Life.',
};

export type UserPrefs = {
  notif_commandes: boolean;
  notif_promotions: boolean;
  notif_newsletter: boolean;
  langue: string;
  devise: string;
  theme: string;
};

const DEFAULT_PREFS: UserPrefs = {
  notif_commandes: true,
  notif_promotions: true,
  notif_newsletter: false,
  langue: 'fr',
  devise: 'XOF',
  theme: 'light',
};

export default async function ParametresPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let prefs: UserPrefs = DEFAULT_PREFS;
  try {
    const { data } = await supabase
      .from('user_preferences')
      .select('notif_commandes, notif_promotions, notif_newsletter, langue, devise, theme')
      .eq('user_id', user.id)
      .single();
    if (data) prefs = data as UserPrefs;
  } catch {
    // Table inexistante ou pas d'enregistrement — fallback mock
  }

  return <ParametresClient user={{ id: user.id, email: user.email ?? '' }} prefs={prefs} />;
}
