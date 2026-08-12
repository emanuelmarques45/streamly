/** Ano de uma data do TMDB (`2024-05-17` → `2024`). */
export function formatYear(date?: string | null) {
  if (!date) return null;
  return date.slice(0, 4);
}

/** Data legível em pt-BR; devolve `null` para datas ausentes ou inválidas. */
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

/** Duração em minutos → `2h 15min`. */
export function formatRuntime(minutes?: number | null) {
  if (!minutes || minutes <= 0) return null;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (!hours) return `${rest}min`;
  if (!rest) return `${hours}h`;
  return `${hours}h ${rest}min`;
}

/** Nota do TMDB com uma casa; `null` quando o título ainda não tem votos. */
export function formatRating(vote?: number | null) {
  if (typeof vote !== "number" || Number.isNaN(vote) || vote <= 0) return null;
  return vote.toFixed(1);
}
