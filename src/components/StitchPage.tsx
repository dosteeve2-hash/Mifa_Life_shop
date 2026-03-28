import { HtmlTemplateFrame } from "@/components/HtmlTemplateFrame";
import { getStitchPageHtml, type StitchPageKey } from "@/lib/stitch-pages";

export async function StitchPage({
  page,
  title,
}: {
  page: StitchPageKey;
  title: string;
}) {
  const html = await getStitchPageHtml(page);
  return <HtmlTemplateFrame html={html} title={title} />;
}
