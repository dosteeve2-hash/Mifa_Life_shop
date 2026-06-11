import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return [];
}

export default async function LegacyHtmlPage({ params }: Props) {
  await params;
  notFound();
}
