"use server";

type LogAuthConfirmationParams = {
  email: string | null;
  provider: string | null;
};

export async function logAuthConfirmationAction({
  email,
  provider,
}: LogAuthConfirmationParams) {
  console.log("[auth] successful sign-in", {
    email,
    provider,
    confirmedAt: new Date().toISOString(),
  });

  return { ok: true };
}
