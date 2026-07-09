import { createServerSupabaseClient } from "@/lib/supabase/server";
import PromotionsClient from "./PromotionsClient";

export const metadata = {
  title: "Nos promotions | MIFA Life",
  description: "Codes promo exclusifs MIFA Life — réductions, livraison gratuite et offres spéciales.",
};

export interface Promotion {
  id: string;
  code: string;
  description: string;
  type_reduction: "pourcentage" | "montant_fixe" | "livraison_gratuite";
  valeur: number;
  min_commande: number;
  nb_utilisations_max: number | null;
  nb_utilisations_actuelles: number;
  date_debut: string;
  date_fin: string | null;
  actif: boolean;
}

const mockPromotions: Promotion[] = [
  {
    id: "1",
    code: "BIENVENUE20",
    description: "20% de réduction sur votre première commande",
    type_reduction: "pourcentage",
    valeur: 20,
    min_commande: 15000,
    nb_utilisations_max: null,
    nb_utilisations_actuelles: 142,
    date_debut: "2026-01-01T00:00:00Z",
    date_fin: "2026-12-31T23:59:59Z",
    actif: true,
  },
  {
    id: "2",
    code: "WAXLOVE",
    description: "5 000 FCFA offerts sur les pagnes wax",
    type_reduction: "montant_fixe",
    valeur: 5000,
    min_commande: 25000,
    nb_utilisations_max: 200,
    nb_utilisations_actuelles: 87,
    date_debut: "2026-06-01T00:00:00Z",
    date_fin: "2026-07-31T23:59:59Z",
    actif: true,
  },
  {
    id: "3",
    code: "LIVRAISON",
    description: "Livraison gratuite partout en Afrique de l'Ouest",
    type_reduction: "livraison_gratuite",
    valeur: 0,
    min_commande: 20000,
    nb_utilisations_max: null,
    nb_utilisations_actuelles: 321,
    date_debut: "2026-07-01T00:00:00Z",
    date_fin: null,
    actif: true,
  },
  {
    id: "4",
    code: "FETE50",
    description: "50% sur les tenues de fête traditionnelles",
    type_reduction: "pourcentage",
    valeur: 50,
    min_commande: 30000,
    nb_utilisations_max: 50,
    nb_utilisations_actuelles: 50,
    date_debut: "2025-12-01T00:00:00Z",
    date_fin: "2025-12-31T23:59:59Z",
    actif: false,
  },
  {
    id: "5",
    code: "KENTE10",
    description: "10% sur toute la collection Kente",
    type_reduction: "pourcentage",
    valeur: 10,
    min_commande: 0,
    nb_utilisations_max: null,
    nb_utilisations_actuelles: 208,
    date_debut: "2026-05-01T00:00:00Z",
    date_fin: "2026-09-30T23:59:59Z",
    actif: true,
  },
];

export default async function PromotionsPage() {
  let promotions: Promotion[] = [];

  try {
    const supabase = await createServerSupabaseClient();

    // getUser() — jamais getSession()
    await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .eq("actif", true)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      promotions = data as Promotion[];
    } else {
      promotions = mockPromotions.filter((p) => p.actif);
    }
  } catch {
    promotions = mockPromotions.filter((p) => p.actif);
  }

  return <PromotionsClient promotions={promotions} />;
}
