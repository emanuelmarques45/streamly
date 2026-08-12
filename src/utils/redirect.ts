/**
 * Só aceita caminhos internos. Sem isso, `?redirect=https://exemplo.com`
 * transformaria o login em um open redirect.
 */
export function safeRedirect(value: string | null | undefined, fallback = "/") {
  if (!value) return fallback;

  // Precisa começar com "/" e não pode ser "//host" (URL protocol-relative).
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;

  return value;
}
