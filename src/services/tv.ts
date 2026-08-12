import { REVALIDATE } from "@/constants";
import { tmdbFetch, tmdbFetchDetail, tmdbFetchSafe } from "@/lib/tmdb";
import { TmdbResponse } from "@/types/TmdbResponse";
import {
  SeasonDetails,
  TvShow,
  TvShowCategory,
  TvShowDetails,
} from "@/types/TvShow";

export async function getTvShows(
  page = 1,
  category: TvShowCategory = "popular"
): Promise<TmdbResponse<TvShow>> {
  return tmdbFetch<TmdbResponse<TvShow>>(`/tv/${category}`, {
    params: { page },
  });
}

export async function getTvShowById(id: number): Promise<TvShowDetails | null> {
  return tmdbFetchDetail<TvShowDetails>(`/tv/${id}`, {
    params: {
      append_to_response: "credits,videos,recommendations",
    },
    revalidate: REVALIDATE.detail,
  });
}

export async function getTvShowsByIds(ids: number[]): Promise<TvShow[]> {
  const results = await Promise.all(
    ids.map((id) =>
      tmdbFetchSafe<TvShow>(`/tv/${id}`, { revalidate: REVALIDATE.detail })
    )
  );

  return results.filter((show): show is TvShow => show !== null);
}

export async function getSeasonEpisodes(
  tvId: number,
  seasonNumber: number
): Promise<SeasonDetails | null> {
  return tmdbFetchSafe<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`, {
    revalidate: REVALIDATE.detail,
  });
}

export async function searchTvShows(
  query: string,
  page = 1
): Promise<TmdbResponse<TvShow>> {
  return tmdbFetch<TmdbResponse<TvShow>>("/search/tv", {
    params: { query, page, include_adult: false },
    revalidate: REVALIDATE.search,
  });
}
