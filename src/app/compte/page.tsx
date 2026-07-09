import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import CompteClient from './CompteClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mon compte | Mifa Life',
  description: 'Votre espace personnel Mifa Life.',
};

export default async function ComptePage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let commandes: Record<string, unknown>[] = [];
  try {
    const { data } = await supabase
      .from('commandes')
      .select('*')
      .eq('email', user.email)
      .order('created_at', { ascending: false })
      .limit(10);
    commandes = data ?? [];
  } catch {}

  return <CompteClient user={user} commandes={commandes} />;
}
