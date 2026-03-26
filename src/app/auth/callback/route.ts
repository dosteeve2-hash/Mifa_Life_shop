import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const APP_URL = "https://mifa-life-shop-9k55.vercel.app";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/shop";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${APP_URL}${next}`);
    }
  }
  return NextResponse.redirect(`${APP_URL}/login?error=auth_callback_failed`);
}
