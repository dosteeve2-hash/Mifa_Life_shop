import { auth, isAuthConfigured, AUTH_CONFIG_ERROR } from '@/lib/auth/server';
import { toNextJsHandler } from 'better-auth/next-js';

/**
 * Toutes les routes Better Auth : /api/auth/sign-in, /sign-up, /email-otp/*, /get-session…
 *
 * `force-dynamic` évite que Next tente de collecter les données de cette route
 * au build, où les variables d'environnement d'authentification sont absentes.
 */
export const dynamic = 'force-dynamic';

const handlers = toNextJsHandler(auth.handler);

function unavailable() {
  return Response.json({ error: AUTH_CONFIG_ERROR }, { status: 503 });
}

export async function GET(request: Request) {
  if (!isAuthConfigured) return unavailable();
  return handlers.GET(request);
}

export async function POST(request: Request) {
  if (!isAuthConfigured) return unavailable();
  return handlers.POST(request);
}
