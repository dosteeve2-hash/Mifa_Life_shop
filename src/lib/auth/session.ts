import 'server-only';

import { headers } from 'next/headers';
import { auth, isAuthConfigured, AUTH_CONFIG_ERROR } from './server';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

/**
 * Utilisateur de la requête en cours, ou `null`.
 *
 * Remplace `supabase.auth.getUser()` dans les Server Components et Server Actions.
 * Comme les politiques RLS ont été retirées (l'identité ne vient plus de Supabase),
 * c'est cette fonction qui fait foi : **toute** requête touchant des données
 * personnelles doit filtrer explicitement sur l'`id` qu'elle renvoie.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  // Config absente (build, ou déploiement mal renseigné) : personne n'est
  // connecté. Les pages redirigent alors vers /login au lieu de planter.
  if (!isAuthConfigured) return null;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name ?? null,
  };
}

/**
 * Comme `getCurrentUser`, mais lève si personne n'est authentifié.
 * À utiliser dans les Server Actions, où un `null` silencieux laisserait
 * passer une écriture non autorisée.
 */
export async function requireUser(): Promise<AuthUser> {
  if (!isAuthConfigured) throw new Error(AUTH_CONFIG_ERROR);
  const user = await getCurrentUser();
  if (!user) throw new Error('non authentifié');
  return user;
}
