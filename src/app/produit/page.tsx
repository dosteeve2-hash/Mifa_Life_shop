import { redirect } from "next/navigation";

type ProduitPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function ProduitRedirectPage({
  searchParams,
}: ProduitPageProps) {
  const { id } = await searchParams;
  redirect(id ? `/shop/${id}` : "/shop");
}
