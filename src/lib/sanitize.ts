/**
 * sanitize.ts — Utilitaires de nettoyage des entrées utilisateur
 * Règle sécurité #2 : validation + trim + longueur max sur tous les inputs
 */

export function sanitizeText(input: string, maxLength = 500): string {
  return input.trim().slice(0, maxLength).replace(/[<>]/g, '')
}

export function sanitizeEmail(input: string): string {
  return input.trim().toLowerCase().slice(0, 254)
}

export function sanitizeName(input: string): string {
  return input.trim().slice(0, 100).replace(/[<>{}|\\^`]/g, '')
}

export function sanitizeSearch(input: string): string {
  return input.trim().slice(0, 200).replace(/[<>{}|\\^`"]/g, '')
}

export function sanitizeUrl(input: string): string {
  const trimmed = input.trim().slice(0, 2048)
  try {
    const url = new URL(trimmed)
    if (!['http:', 'https:'].includes(url.protocol)) return ''
    return trimmed
  } catch {
    return ''
  }
}

export function sanitizeNumber(input: unknown): number | null {
  const n = Number(input)
  return Number.isFinite(n) ? n : null
}
