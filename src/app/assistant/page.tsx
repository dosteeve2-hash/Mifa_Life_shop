import { StitchPage } from "@/components/StitchPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assistant Shopping | Mifa Life",
  description: "Votre assistant shopping personnel Mifa Life.",
};

export default function AssistantPage() {
  return <StitchPage page="assistant" title="Mifa Life — Assistant Shopping" />;
}
