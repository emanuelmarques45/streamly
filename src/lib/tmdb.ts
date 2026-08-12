import { BASE_URL, REVALIDATE } from "@/constants";

/**
 * Camada única de acesso ao TMDB. Só pode ser importada em código de servidor
 * (Server Components e Route Handlers) — é ela que carrega o token.
 *
 * O token vive aqui, e não em `@/constants`, porque aquele módulo é importado
 * por componentes client: um fallback `NEXT_PUBLIC_*` lá dentro seria inlinado
 * no bundle do browser pelo Next e vazaria a credencial.
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
  /** Query string já tipada; valores nulos/indefinidos são descartados. */
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Segundos de cache no Data Cache do Next. */
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
 * Igual ao `tmdbFetch`, mas devolve `null` em vez de lançar — útil para
 * requisições opcionais (ex.: buscar vários itens de uma vez, onde um id
 * inválido não deve derrubar a página inteira).
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
