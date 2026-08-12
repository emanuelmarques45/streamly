/** A valid TMDB page: an integer between 1 and 500. */
export function parsePage(value: string | null | undefined, fallback = 1) {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1 || page > 500) return fallback;
  return page;
}

/** Positive numeric id; returns `null` when the value is unusable. */
export function parseId(value: string | null | undefined): number | null {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

/** Comma-separated list of ids (e.g. `?genres=28,12`). */
export function parseIdList(value: string | null | undefined): number[] {
  if (!value) return [];

  return value
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);
}

/** A plausible release year. */
export function parseYear(value: string | null | undefined): number | undefined {
  const year = Number(value);
  const currentYear = new Date().getFullYear();

  if (!Number.isInteger(year) || year < 1874 || year > currentYear + 5) {
    return undefined;
  }

  return year;
}
