import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/data/products";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 text-white">
      <h1 className="text-3xl font-semibold">{product.name ?? "Produit"}</h1>
      <p className="mt-4 text-white/70">
        {product.description ?? "Description non disponible."}
      </p>
    </main>
  );
}
