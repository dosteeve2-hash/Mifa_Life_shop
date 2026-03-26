import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * Route handler pour le callback Supabase Auth.
 * Obligatoire pour que le lien email redirige correctement.
 * URL : /auth/callback?code=xxx
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/shop';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error('[auth/callback] exchangeCodeForSession error:', error.message);
  }

  // Échec → redirection vers login avec message d'erreur
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
