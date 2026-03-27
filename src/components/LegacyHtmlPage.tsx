import { HtmlTemplateFrame } from "@/components/HtmlTemplateFrame";
import type { LegacyPageSlug } from "@/lib/html-pages";
import { getLegacyPageHtml } from "@/lib/html-pages";

export async function LegacyHtmlPage({ slug }: { slug: LegacyPageSlug }) {
  const html = await getLegacyPageHtml(slug);
  return <HtmlTemplateFrame html={html} title={`Mifa Life - ${slug}`} />;
}
