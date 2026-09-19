import { betterAuth } from 'better-auth';
import { emailOTP } from 'better-auth/plugins';
import { Pool } from 'pg';
import { sendOtpEmail } from './send-otp';

/**
 * Instance Better Auth — source de vérité de l'identité côté serveur.
 *
 * Ce module ne doit JAMAIS être importé depuis un composant `'use client'` :
 * il porte la connexion Postgres et le secret d'authentification.
 * Côté client, passer par `@/lib/auth/client`.
 */

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL manquante — connexion Postgres directe requise par Better Auth. ' +
      'Supabase la fournit dans Project Settings → Database → Connection string (URI).',
  );
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET manquante — générez-la avec `openssl rand -base64 32`.');
}

/** 15 minutes, en secondes — fenêtre du rate limiting (règle sécurité #4). */
const WINDOW = 15 * 60;
const MAX_ATTEMPTS = 5;

export const auth = betterAuth({
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 jours
    updateAge: 60 * 60 * 24, // prolonge la session au plus une fois par jour
  },

  /* Règle sécurité #4 — 5 tentatives / 15 min sur les routes sensibles. */
  rateLimit: {
    enabled: true,
    window: WINDOW,
    max: 100,
    customRules: {
      '/sign-in/email': { window: WINDOW, max: MAX_ATTEMPTS },
      '/sign-up/email': { window: WINDOW, max: MAX_ATTEMPTS },
      '/email-otp/send-verification-otp': { window: WINDOW, max: MAX_ATTEMPTS },
      '/sign-in/email-otp': { window: WINDOW, max: MAX_ATTEMPTS },
    },
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 10 * 60, // 10 minutes
      async sendVerificationOTP({ email, otp, type }) {
        await sendOtpEmail({ email, otp, type });
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
