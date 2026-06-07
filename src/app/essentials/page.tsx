import { StitchPage } from "@/components/StitchPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes essentiels | Mifa Life",
  description: "Vos produits essentiels du quotidien sur Mifa Life.",
};

export default function EssentialsPage() {
  return <StitchPage page="essentials" title="Mifa Life — Mes essentiels" />;
}
