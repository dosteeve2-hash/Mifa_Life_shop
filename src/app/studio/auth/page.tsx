import type { Metadata } from 'next';
import AuroraBackground from '@/components/studio/primitives/AuroraBackground';
import AuthCard from '@/components/studio/auth/AuthCard';

export const metadata: Metadata = {
  title: 'Auth — FORGE UI',
  description: 'Écran d’authentification animé, prêt à brancher sur Better Auth.',
  robots: { index: false, follow: false },
};

const POINTS = [
  ['Formulaire morphé', 'Connexion et inscription partagent la même carte : le champ « nom » se déplie, la pastille glisse.'],
  ['Erreur ressentie', 'Un échec de validation secoue la carte et affiche le message — la faute se voit avant de se lire.'],
  ['Code à usage unique', 'Six cases, avance automatique, retour arrière intelligent, collage d’un code entier géré.'],
  ['Prêt pour Better Auth', 'Les points de branchement sont marqués en commentaire ; aucune clé ne vit côté client.'],
];

export default function StudioAuthPage() {
  return (
    <AuroraBackground className="min-h-[calc(100vh-110px)]">
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 py-16 sm:px-7 lg:grid-cols-[1fr_420px] lg:py-24">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-gold">Authentification</p>
          <h1 className="mt-3 text-[clamp(28px,4.5vw,44px)] font-extrabold leading-tight tracking-[-.03em] text-[#e8edf5]">
            Une porte d’entrée qu’on a envie de pousser.
          </h1>
          <p className="mt-4 max-w-[520px] text-sm leading-relaxed text-[#93aacb]">
            Cette maquette ne crée aucune session : elle simule le parcours pour montrer les
            transitions. Le formulaire nettoie et valide les entrées côté client pour le confort,
            la validation qui fait foi restant côté serveur.
          </p>

          <dl className="mt-9 grid gap-5 sm:grid-cols-2">
            {POINTS.map(([title, body]) => (
              <div key={title} className="border-l-2 border-gold/25 pl-4">
                <dt className="text-[13px] font-bold text-[#e8edf5]">{title}</dt>
                <dd className="mt-1 text-xs leading-relaxed text-[#93aacb]">{body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex justify-center lg:justify-end">
          <AuthCard />
        </div>
      </div>
    </AuroraBackground>
  );
}
