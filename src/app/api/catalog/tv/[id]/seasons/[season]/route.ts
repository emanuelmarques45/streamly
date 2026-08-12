import { getSeasonEpisodes } from "@/services/tv";
import { parseId } from "@/utils/params";
import { fail, ok } from "@/utils/response";

const PUBLIC_CACHE = "public, s-maxage=21600, stale-while-revalidate=86400";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; season: string }> }
) {
  const { id, season } = await params;

  const tvId = parseId(id);
  const seasonNumber = Number(season);

  if (!tvId || !Number.isInteger(seasonNumber) || seasonNumber < 0) {
    return fail("Invalid season reference", 400);
  }

  const data = await getSeasonEpisodes(tvId, seasonNumber);

  if (!data) return fail("Season not found", 404);

  return ok(data, { cacheControl: PUBLIC_CACHE });
}
