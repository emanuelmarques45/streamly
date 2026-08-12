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
