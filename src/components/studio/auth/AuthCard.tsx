'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import BorderBeam from '@/components/studio/primitives/BorderBeam';
import MagneticButton from '@/components/studio/primitives/MagneticButton';
import AnimatedTabs from '@/components/studio/primitives/AnimatedTabs';
import SocialButtons from './SocialButtons';
import OtpInput from './OtpInput';
import Field from './Field';
import { EASE, fadeUp, stagger } from '@/lib/motion/presets';
import { sanitizeEmail, sanitizeName } from '@/lib/sanitize';

type Mode = 'signin' | 'signup';
type Step = 'credentials' | 'otp' | 'done';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_PASSWORD = 8;

/**
 * Écran d'authentification animé — maquette de vitrine.
 *
 * Il ne crée aucune session : le parcours réel est dans src/app/login/page.tsx,
 * qui appelle `authClient` (Better Auth) contre la route serveur `/api/auth`.
 * Les entrées sont nettoyées et validées ici pour l'ergonomie ; la validation
 * qui fait foi reste côté serveur. Aucune clé ni secret ne transite ici.
 */
export default function AuthCard() {
  const [mode, setMode] = useState<Mode>('signin');
  const [step, setStep] = useState<Step>('credentials');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(0);
  const [pending, setPending] = useState(false);

  const fail = (message: string) => {
    setError(message);
    setShake((n) => n + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = sanitizeEmail(email);
    const cleanName = sanitizeName(name);

    if (mode === 'signup' && cleanName.length < 2) return fail('Indiquez votre nom complet.');
    if (!EMAIL_RE.test(cleanEmail)) return fail('Cette adresse e-mail est invalide.');
    if (password.length < MIN_PASSWORD)
      return fail(`Le mot de passe doit faire au moins ${MIN_PASSWORD} caractères.`);

    setPending(true);
    // Maquette : on ne crée délibérément aucune session depuis la vitrine.
    // Le vrai parcours Better Auth vit dans src/app/login/page.tsx
    // (`authClient.emailOtp.sendVerificationOtp` puis `authClient.signIn.emailOtp`),
    // avec rate limiting 5 tentatives / 15 min appliqué côté serveur.
    await new Promise((r) => setTimeout(r, 900));
    setPending(false);
    setStep('otp');
  };

  return (
    <BorderBeam radius={22} duration={7} className="w-full max-w-[420px]">
      <motion.div
        key={shake}
        animate={shake ? { x: [0, -9, 8, -6, 0] } : undefined}
        transition={{ duration: 0.4, ease: EASE.inOut }}
        className="p-6 sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
            <ShieldCheck size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-[#e8edf5]">FORGE Auth</p>
            <p className="text-[11px] text-[#4f6d8e]">Sécurisé par Better Auth</p>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {step === 'credentials' && (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.32, ease: EASE.out }}
            >
              <AnimatedTabs
                className="mb-5 w-full"
                value={mode}
                onChange={(id) => {
                  setMode(id as Mode);
                  setError('');
                }}
                items={[
                  { id: 'signin', label: 'Connexion' },
                  { id: 'signup', label: 'Inscription' },
                ]}
              />

              <motion.form
                onSubmit={handleSubmit}
                initial="hidden"
                animate="show"
                variants={stagger(0.06)}
                className="space-y-3"
              >
                <AnimatePresence initial={false}>
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: EASE.out }}
                    >
                      <Field
                        icon={<User size={15} />}
                        type="text"
                        label="Nom complet"
                        value={name}
                        maxLength={100}
                        autoComplete="name"
                        onChange={setName}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={fadeUp}>
                  <Field
                    icon={<Mail size={15} />}
                    type="email"
                    label="Adresse e-mail"
                    value={email}
                    maxLength={254}
                    autoComplete="email"
                    onChange={setEmail}
                  />
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Field
                    icon={<Lock size={15} />}
                    type="password"
                    label="Mot de passe"
                    value={password}
                    maxLength={128}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    onChange={setPassword}
                  />
                </motion.div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      role="alert"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="rounded-lg border border-red/30 bg-red/10 px-3 py-2 text-xs font-semibold text-red"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <MagneticButton type="submit" disabled={pending} className="w-full">
                  {pending && <Loader2 size={15} className="animate-spin" />}
                  {mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}
                </MagneticButton>
              </motion.form>

              <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[.14em] text-[#4f6d8e]">
                <span className="h-px flex-1 bg-gold/12" />
                ou
                <span className="h-px flex-1 bg-gold/12" />
              </div>

              <motion.div initial="hidden" animate="show" variants={stagger(0.08)}>
                <SocialButtons disabled={pending} />
              </motion.div>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.32, ease: EASE.out }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-lg font-bold text-[#e8edf5]">Vérification</h2>
                <p className="text-xs text-[#93aacb]">
                  Code à 6 chiffres envoyé à{' '}
                  <span className="font-mono text-gold">{sanitizeEmail(email)}</span>
                </p>
              </div>
              {/* Équivalent réel : authClient.signIn.emailOtp({ email, otp }) */}
              <OtpInput onComplete={() => setStep('done')} />
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="text-xs font-semibold text-[#93aacb] transition-colors hover:text-gold"
              >
                ← Modifier l’adresse
              </button>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE.out }}
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <motion.span
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
                className="text-[#22c55e]"
              >
                <CheckCircle2 size={52} strokeWidth={1.5} />
              </motion.span>
              <h2 className="text-lg font-bold text-[#e8edf5]">Session ouverte</h2>
              <p className="max-w-[260px] text-xs text-[#93aacb]">
                Démonstration d’interface — aucune session réelle n’a été créée.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </BorderBeam>
  );
}
