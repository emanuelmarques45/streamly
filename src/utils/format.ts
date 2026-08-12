/** Year of a TMDB date (`2024-05-17` -> `2024`). */
export function formatYear(date?: string | null) {
  if (!date) return null;
  return date.slice(0, 4);
}

/** Human-readable pt-BR date; returns `null` for missing or invalid dates. */
export function formatDate(date?: string | null) {
  if (!date) return null;

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Runtime in minutes -> `2h 15min`. */
export function formatRuntime(minutes?: number | null) {
  if (!minutes || minutes <= 0) return null;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (!hours) return `${rest}min`;
  if (!rest) return `${hours}h`;
  return `${hours}h ${rest}min`;
}

/** TMDB score with one decimal; `null` when the title has no votes yet. */
export function formatRating(vote?: number | null) {
  if (typeof vote !== "number" || Number.isNaN(vote) || vote <= 0) return null;
  return vote.toFixed(1);
}
