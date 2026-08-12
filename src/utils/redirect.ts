/**
 * Accepts internal paths only. Without this, `?redirect=https://example.com`
 * would turn the login page into an open redirect.
 */
export function safeRedirect(value: string | null | undefined, fallback = "/") {
  if (!value) return fallback;

  // Must start with "/" and must not be "//host" (protocol-relative URL).
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;

  return value;
}
