import { StitchPage } from "@/components/StitchPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ma liste de souhaits | Mifa Life",
  description: "Vos produits favoris sauvegardés sur Mifa Life.",
};

export default function WishlistPage() {
  return <StitchPage page="wishlist" title="Mifa Life — Liste de souhaits" />;
}
