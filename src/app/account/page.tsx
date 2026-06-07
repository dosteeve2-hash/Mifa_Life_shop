import { StitchPage } from "@/components/StitchPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon compte | Mifa Life",
  description: "Gérez votre compte Mifa Life.",
};

export default function AccountPage() {
  return <StitchPage page="account" title="Mifa Life — Mon compte" />;
}
