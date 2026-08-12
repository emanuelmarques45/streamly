import { discover, isDiscoverSort } from "@/services/catalog";
import { parseIdList, parsePage, parseYear } from "@/utils/params";
import { fail, ok } from "@/utils/response";

const PUBLIC_CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "movie";

  if (type !== "movie" && type !== "tv") {
    return fail("Tipo de mídia inválido", 400);
  }

  const sortParam = searchParams.get("sort") ?? "";

  try {
    const data = await discover({
      mediaType: type,
      page: parsePage(searchParams.get("page")),
      genres: parseIdList(searchParams.get("genres")),
      year: parseYear(searchParams.get("year")),
      sortBy: isDiscoverSort(sortParam) ? sortParam : undefined,
    });

    return ok(data, { cacheControl: PUBLIC_CACHE });
  } catch {
    return fail("Não foi possível carregar os resultados", 502);
  }
}
