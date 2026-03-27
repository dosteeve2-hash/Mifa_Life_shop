import { notFound } from "next/navigation";
import { HtmlTemplateFrame } from "@/components/HtmlTemplateFrame";
import {
  getLegacyPageHtml,
  getLegacyPageSlugs,
  isLegacyPageSlug,
} from "@/lib/html-pages";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getLegacyPageSlugs().map((slug) => ({ slug }));
}

export default async function LegacyHtmlPage({ params }: Props) {
  const { slug } = await params;

  if (!isLegacyPageSlug(slug)) {
    notFound();
  }

  const html = await getLegacyPageHtml(slug);

  return <HtmlTemplateFrame html={html} title={`Mifa Life - ${slug}`} />;
}
