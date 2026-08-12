import { REVALIDATE } from "@/constants";
import { tmdbFetch, tmdbFetchSafe } from "@/lib/tmdb";
import { Movie, MovieCategory, MovieDetails } from "@/types/Movie";
import { TmdbResponse } from "@/types/TmdbResponse";

export async function getMovies(
  page = 1,
  category: MovieCategory = "popular"
): Promise<TmdbResponse<Movie>> {
  return tmdbFetch<TmdbResponse<Movie>>(`/movie/${category}`, {
    params: { page },
  });
}

export async function getMovieById(id: number): Promise<MovieDetails | null> {
  return tmdbFetchSafe<MovieDetails>(`/movie/${id}`, {
    params: {
      append_to_response: "credits,videos,recommendations",
    },
    revalidate: REVALIDATE.detail,
  });
}

export async function getMoviesByIds(ids: number[]): Promise<Movie[]> {
  const results = await Promise.all(
    ids.map((id) =>
      tmdbFetchSafe<Movie>(`/movie/${id}`, { revalidate: REVALIDATE.detail })
    )
  );

  // Invalid ids, or titles removed from TMDB, just drop out of the list.
  return results.filter((movie): movie is Movie => movie !== null);
}

export async function searchMovies(
  query: string,
  page = 1
): Promise<TmdbResponse<Movie>> {
  return tmdbFetch<TmdbResponse<Movie>>("/search/movie", {
    params: { query, page, include_adult: false },
    revalidate: REVALIDATE.search,
  });
}
