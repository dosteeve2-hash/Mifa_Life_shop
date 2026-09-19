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

const DATABASE_URL = process.env.DATABASE_URL;
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;

/**
 * `false` si la configuration d'authentification est incomplète.
 *
 * On ne lève pas à l'import : `next build` compile ce module sans variables
 * d'environnement (c'est le cas en CI), et échouer ici casserait le build.
 * C'est la route `/api/auth` qui refuse alors toute requête (503), et
 * `getCurrentUser()` qui renvoie `null` — l'application se comporte comme si
 * personne n'était connecté, plutôt que de servir une auth à moitié configurée.
 */
export const isAuthConfigured = Boolean(DATABASE_URL && BETTER_AUTH_SECRET);

export const AUTH_CONFIG_ERROR =
  'Authentification non configurée : renseignez DATABASE_URL (Supabase → Project Settings → ' +
  'Database → Connection string URI) et BETTER_AUTH_SECRET (openssl rand -base64 32).';

/** 15 minutes, en secondes — fenêtre du rate limiting (règle sécurité #4). */
const WINDOW = 15 * 60;
const MAX_ATTEMPTS = 5;

export const auth = betterAuth({
  database: new Pool({ connectionString: DATABASE_URL }),
  // Jamais utilisé pour signer quoi que ce soit : quand la config manque, la
  // route d'auth répond 503 avant d'atteindre Better Auth.
  secret: BETTER_AUTH_SECRET ?? 'unconfigured-build-placeholder',
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
