import { StitchPage } from "@/components/StitchPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord vendeur | Mifa Life",
  description: "Gérez votre boutique sur Mifa Life.",
};

export default function SellerDashboardPage() {
  return <StitchPage page="sellerDashboard" title="Mifa Life — Tableau vendeur" />;
}
