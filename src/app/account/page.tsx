import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import AccountClient from './AccountClient';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mon compte | Mifa Life',
  description: 'Gérez votre compte Mifa Life.',
};

export default async function AccountPage() {
  const supabase = await createServerSupabaseClient();

  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone, role')
    .eq('id', user.id)
    .single();

  return (
    <AccountClient
      userId={user.id}
      email={user.email ?? ''}
      fullName={profile?.full_name ?? ''}
      phone={profile?.phone ?? ''}
      role={profile?.role ?? 'customer'}
    />
  );
}
