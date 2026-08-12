import { searchMulti } from "@/services/catalog";
import { parsePage } from "@/utils/params";
import { fail, ok } from "@/utils/response";

const SEARCH_CACHE = "public, s-maxage=300, stale-while-revalidate=3600";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const page = parsePage(searchParams.get("page"));

  if (!query) {
    return ok({ page: 1, totalPages: 0, totalResults: 0, items: [] });
  }

  try {
    const data = await searchMulti(query, page);
    return ok(data, { cacheControl: SEARCH_CACHE });
  } catch {
    return fail("Failed to search", 502);
  }
}
