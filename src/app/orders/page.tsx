import { StitchPage } from "@/components/StitchPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes commandes | Mifa Life",
  description: "Suivez toutes vos commandes Mifa Life.",
};

export default function OrdersPage() {
  return <StitchPage page="orders" title="Mifa Life — Mes commandes" />;
}
