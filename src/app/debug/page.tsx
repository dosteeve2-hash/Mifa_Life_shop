export const dynamic = "force-dynamic";

export default function DebugPage() {
  const supabaseUrlStatus = process.env.NEXT_PUBLIC_SUPABASE_URL ? "OK" : "Manquante";
  const supabaseAnonKeyStatus = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? "OK"
    : "Manquante";

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-[28px] border border-white/10 bg-[var(--surface)] p-8 text-white shadow-[var(--bg3)]">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--mg)]">
          Debug
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Verification des variables Supabase
        </h1>
        <div className="mt-8 grid gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-sm text-white/60">NEXT_PUBLIC_SUPABASE_URL</p>
            <p className="mt-2 text-lg font-semibold">{supabaseUrlStatus}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-sm text-white/60">NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
            <p className="mt-2 text-lg font-semibold">{supabaseAnonKeyStatus}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
