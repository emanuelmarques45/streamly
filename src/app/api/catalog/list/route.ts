import { getCategoryPage } from "@/services/catalog";
import { isMovieCategory } from "@/types/Movie";
import { isTvShowCategory } from "@/types/TvShow";
import { fail, ok } from "@/utils/response";
import { parsePage } from "@/utils/params";

const PUBLIC_CACHE = "public, s-maxage=3600, stale-while-revalidate=86400";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "movie";
  const category = searchParams.get("category") ?? "popular";
  const page = parsePage(searchParams.get("page"));

  if (type !== "movie" && type !== "tv") {
    return fail("Invalid media type", 400);
  }

  const validCategory =
    type === "movie" ? isMovieCategory(category) : isTvShowCategory(category);

  if (!validCategory) {
    return fail("Invalid category", 400);
  }

  try {
    const data = await getCategoryPage(type, category, page);
    return ok(data, { cacheControl: PUBLIC_CACHE });
  } catch {
    return fail("Failed to fetch catalog", 502);
  }
}
