import { getGenres } from "@/services/catalog";
import { fail, ok } from "@/utils/response";

const PUBLIC_CACHE = "public, s-maxage=86400, stale-while-revalidate=604800";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "movie";

  if (type !== "movie" && type !== "tv") {
    return fail("Invalid media type", 400);
  }

  try {
    const genres = await getGenres(type);
    return ok(genres, { cacheControl: PUBLIC_CACHE });
  } catch {
    return fail("Failed to fetch genres", 502);
  }
}
