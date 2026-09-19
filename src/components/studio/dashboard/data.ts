/**
 * Données de démonstration du dashboard vitrine.
 * Aucune requête réseau : cette page sert de maquette animée, à brancher
 * sur de vraies Server Actions lors de la reprise dans un autre projet.
 */

export interface RevenuePoint {
  label: string;
  revenu: number;
  commandes: number;
}

export const REVENUE_2024: RevenuePoint[] = [
  { label: 'Jan', revenu: 1_820_000, commandes: 142 },
  { label: 'Fév', revenu: 2_140_000, commandes: 168 },
  { label: 'Mar', revenu: 1_960_000, commandes: 151 },
  { label: 'Avr', revenu: 2_680_000, commandes: 204 },
  { label: 'Mai', revenu: 3_120_000, commandes: 246 },
  { label: 'Juin', revenu: 2_940_000, commandes: 231 },
  { label: 'Juil', revenu: 3_780_000, commandes: 298 },
  { label: 'Août', revenu: 4_260_000, commandes: 334 },
  { label: 'Sep', revenu: 3_910_000, commandes: 307 },
  { label: 'Oct', revenu: 4_820_000, commandes: 381 },
  { label: 'Nov', revenu: 5_640_000, commandes: 442 },
  { label: 'Déc', revenu: 6_980_000, commandes: 551 },
];

export interface Kpi {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  /** Variation vs période précédente, en %. */
  delta: number;
  spark: number[];
}

export const KPIS: Kpi[] = [
  {
    id: 'ca',
    label: 'Chiffre d’affaires',
    value: 6_980_000,
    suffix: ' FCFA',
    delta: 23.8,
    spark: [28, 34, 31, 44, 41, 52, 58, 55, 67, 74, 82, 96],
  },
  {
    id: 'commandes',
    label: 'Commandes',
    value: 551,
    delta: 24.6,
    spark: [22, 27, 24, 33, 39, 36, 47, 53, 49, 61, 70, 88],
  },
  {
    id: 'panier',
    label: 'Panier moyen',
    value: 12_670,
    suffix: ' FCFA',
    delta: -3.2,
    spark: [64, 68, 61, 70, 66, 72, 69, 63, 66, 61, 58, 55],
  },
  {
    id: 'conversion',
    label: 'Taux de conversion',
    value: 4.31,
    suffix: ' %',
    decimals: 2,
    delta: 11.4,
    spark: [31, 29, 35, 33, 40, 44, 41, 49, 52, 50, 58, 63],
  },
];

export type ActivityKind = 'order' | 'seller' | 'stock' | 'payout';

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  /** Ancienneté en minutes. */
  ago: number;
}

export const ACTIVITY: ActivityItem[] = [
  { id: 'a1', kind: 'order', title: 'Commande #MF-4821', detail: 'Bazin riche brodé × 2 — 48 000 FCFA', ago: 2 },
  { id: 'a2', kind: 'payout', title: 'Versement Wave', detail: 'Atelier Kadiatou — 312 400 FCFA', ago: 11 },
  { id: 'a3', kind: 'seller', title: 'Nouveau vendeur', detail: 'Maison Sissoko — Bamako, Mali', ago: 26 },
  { id: 'a4', kind: 'stock', title: 'Stock bas', detail: 'Boubou indigo Ségou — 3 restants', ago: 41 },
  { id: 'a5', kind: 'order', title: 'Commande #MF-4818', detail: 'Panier bogolan × 1 — 15 500 FCFA', ago: 58 },
  { id: 'a6', kind: 'order', title: 'Commande #MF-4815', detail: 'Sandales cuir Mopti × 3 — 37 500 FCFA', ago: 73 },
];

export interface TopProduct {
  id: string;
  name: string;
  category: string;
  sold: number;
  /** Part du meilleur vendeur, de 0 à 1 — pilote la largeur de la jauge. */
  share: number;
}

export const TOP_PRODUCTS: TopProduct[] = [
  { id: 'p1', name: 'Bazin riche brodé', category: 'Mode', sold: 184, share: 1 },
  { id: 'p2', name: 'Panier bogolan tressé', category: 'Artisanat', sold: 142, share: 0.77 },
  { id: 'p3', name: 'Boubou indigo Ségou', category: 'Mode', sold: 118, share: 0.64 },
  { id: 'p4', name: 'Sandales cuir Mopti', category: 'Accessoires', sold: 96, share: 0.52 },
  { id: 'p5', name: 'Beurre de karité brut', category: 'Beauté', sold: 71, share: 0.39 },
];
