import { StitchPage } from "@/components/StitchPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Actualités | Mifa Life",
  description: "Actualités, tendances et stories de la marketplace du Mali.",
};

export default function BlogPage() {
  return <StitchPage page="blog" title="Mifa Life — Blog" />;
}
