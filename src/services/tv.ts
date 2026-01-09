import { TvShow } from "@/types/TvShow";
import { BASE_URL, HEADERS } from "@/constants";
import { TmdbResponse } from "@/types/TmdbResponse";
import { TvShowCategory } from "@/types/TvShowCategory";

export async function getTvShows(
  page = 1,
  category: TvShowCategory = "popular"
): Promise<TmdbResponse<TvShow>> {
  const res = await fetch(`${BASE_URL}/tv/${category}?page=${page}`, {
    cache: "force-cache",
    headers: HEADERS,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Tv shows");
  }

  return await res.json();
}
