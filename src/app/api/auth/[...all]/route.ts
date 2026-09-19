import { auth } from '@/lib/auth/server';
import { toNextJsHandler } from 'better-auth/next-js';

/** Toutes les routes Better Auth : /api/auth/sign-in, /sign-up, /email-otp/*, /get-session… */
export const { GET, POST } = toNextJsHandler(auth.handler);
