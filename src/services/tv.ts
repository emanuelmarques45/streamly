import { Episode, SeasonDetails, TvShow, TvShowCategory } from "@/types/TvShow";
import { BASE_URL, HEADERS } from "@/constants";
import { TmdbResponse } from "@/types/TmdbResponse";

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

export async function getTvShowById(id: number): Promise<TvShow> {
  const res = await fetch(`${BASE_URL}/tv/${id}`, {
    headers: HEADERS,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Tv show");
  }

  return res.json();
}

export async function getTvShowsByIds(ids: number[]): Promise<TvShow[]> {
  const requests = ids.map((id) =>
    fetch(`${BASE_URL}/tv/${id}`, {
      headers: HEADERS,
    }).then((res) => res.json())
  );

  return Promise.all(requests);
}

export async function getSeasonEpisodes(
  tvId: number,
  seasonNumber: number
): Promise<SeasonDetails> {
  const res = await fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}`, {
    headers: HEADERS,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch season episodes");
  }

  return res.json();
}
