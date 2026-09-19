import 'server-only';

type OtpType = 'sign-in' | 'email-verification' | 'forget-password' | 'change-email';

interface SendOtpParams {
  email: string;
  otp: string;
  type: OtpType;
}

const SUBJECTS: Record<OtpType, string> = {
  'sign-in': 'Votre code de connexion Mifa Life',
  'email-verification': 'Vérifiez votre adresse — Mifa Life',
  'forget-password': 'Réinitialisation de votre mot de passe — Mifa Life',
  'change-email': 'Confirmez votre nouvelle adresse — Mifa Life',
};

/**
 * Envoi du code à usage unique.
 *
 * Aucun fournisseur d'e-mail n'est configuré sur le projet à ce jour
 * (`RESEND_API_KEY` / `SENDGRID_API_KEY` sont commentés dans `.env.example`).
 * Tant qu'il n'y en a pas, le code est journalisé côté serveur pour permettre
 * les tests locaux, et l'envoi échoue explicitement en production plutôt que
 * de laisser croire qu'un e-mail est parti.
 */
export async function sendOtpEmail({ email, otp, type }: SendOtpParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'RESEND_API_KEY manquante — impossible d’envoyer le code de connexion. ' +
          'Configurez un fournisseur d’e-mail avant d’ouvrir l’authentification au public.',
      );
    }
    console.info('[auth] OTP (dev, aucun e-mail envoyé)', { email, otp, type });
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.AUTH_EMAIL_FROM ?? 'Mifa Life <no-reply@mifa.life>',
      to: email,
      subject: SUBJECTS[type],
      text: `Votre code Mifa Life : ${otp}\n\nIl expire dans 10 minutes. Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.`,
    }),
  });

  if (!response.ok) {
    // Le corps de la réponse peut contenir l'adresse : on ne journalise que le statut.
    throw new Error(`Envoi du code impossible (statut ${response.status}).`);
  }
}
