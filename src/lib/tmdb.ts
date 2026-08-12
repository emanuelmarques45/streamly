import { BASE_URL, REVALIDATE } from "@/constants";

/**
 * The single entry point to TMDB. Import it from server code only (Server
 * Components and Route Handlers) — this is the module that carries the token.
 *
 * The token lives here rather than in `@/constants` because that module is
 * imported by client components: a `NEXT_PUBLIC_*` fallback there would be
 * inlined into the browser bundle by Next and leak the credential.
 */
const TMDB_TOKEN = process.env.TMDB_TOKEN ?? process.env.NEXT_PUBLIC_TMDB_TOKEN;

const HEADERS = {
  accept: "application/json",
  Authorization: `Bearer ${TMDB_TOKEN}`,
};

/**
 * TMDB answers in English unless told otherwise. Sending the locale on every
 * request is what makes titles, overviews and genre names come back in
 * Portuguese; `region` also makes "now playing" and "upcoming" reflect
 * Brazilian release dates.
 */
const TMDB_LANGUAGE = "pt-BR";
const TMDB_REGION = "BR";
const TMDB_FALLBACK_LANGUAGE = "en-US";

export class TmdbError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = "TmdbError";
  }
}

type TmdbFetchOptions = {
  /** Typed query string; null and undefined values are dropped. */
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Cache lifetime in seconds, for Next's Data Cache. */
  revalidate?: number;
};

export async function tmdbFetch<T>(
  path: string,
  { params, revalidate = REVALIDATE.list }: TmdbFetchOptions = {}
): Promise<T> {
  if (!TMDB_TOKEN) {
    throw new TmdbError("TMDB_TOKEN is not configured", 500);
  }

  const url = new URL(`${BASE_URL}${path}`);

  // Defaults first, so an explicit `params.language` can still override them.
  url.searchParams.set("language", TMDB_LANGUAGE);
  url.searchParams.set("region", TMDB_REGION);

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    headers: HEADERS,
    next: { revalidate },
  });

  if (!res.ok) {
    throw new TmdbError(`TMDB request failed for ${path}`, res.status);
  }

  return (await res.json()) as T;
}

/**
 * Same as `tmdbFetch`, but returns `null` instead of throwing. Useful for
 * optional requests, such as fetching several items at once, where one bad id
 * should not take down the whole page.
 */
export async function tmdbFetchSafe<T>(
  path: string,
  options?: TmdbFetchOptions
): Promise<T | null> {
  try {
    return await tmdbFetch<T>(path, options);
  } catch {
    return null;
  }
}

type Translatable = { overview: string; tagline?: string | null };

/**
 * Fetches a detail resource in the default locale, falling back to the original
 * synopsis when TMDB has no translation for it.
 *
 * TMDB does not fall back on its own: an untranslated title comes back with an
 * empty `overview` rather than the English text. A blank synopsis is worse than
 * an English one, so we ask again — only when the field is actually empty.
 */
export async function tmdbFetchDetail<T extends Translatable>(
  path: string,
  options?: TmdbFetchOptions
): Promise<T | null> {
  const localized = await tmdbFetchSafe<T>(path, options);

  if (!localized || localized.overview) return localized;

  const original = await tmdbFetchSafe<Translatable>(path, {
    params: { language: TMDB_FALLBACK_LANGUAGE },
    revalidate: options?.revalidate,
  });

  if (!original?.overview) return localized;

  // The spread only overwrites fields already present on `Translatable`, so the
  // result keeps T's shape; TypeScript cannot narrow that on a generic.
  return {
    ...localized,
    overview: original.overview,
    tagline: localized.tagline || original.tagline,
  } as T;
}
