import { StitchPage } from "@/components/StitchPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon tableau de bord | Mifa Life",
  description: "Suivez vos commandes et gérez votre compte Mifa Life.",
};

export default function DashboardPage() {
  return <StitchPage page="dashboard" title="Mifa Life — Tableau de bord" />;
}
