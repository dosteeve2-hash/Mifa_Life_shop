import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-2xl rounded-[32px] border border-[var(--border)] bg-[var(--bg2)] p-10 shadow-[var(--bg3)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--mg)]">
          Mifa Life
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Boutique dynamique connectee a Supabase
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--muted)]">
          Decouvrez les vrais produits, des prix en FCFA et une interface
          inspiree du Mali Design System.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--mg)] px-8 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Ouvrir la boutique
        </Link>
      </div>
    </main>
  );
}
