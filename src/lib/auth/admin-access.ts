export function isAdminOrFounder(role: string | null | undefined) {
  return role === "admin" || role === "founder";
}

export function getRoleFromUser(user: {
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
} | null) {
  if (!user) return null;

  const appRole = user.app_metadata?.role;
  if (typeof appRole === "string") return appRole;

  const userRole = user.user_metadata?.role;
  if (typeof userRole === "string") return userRole;

  return null;
}
