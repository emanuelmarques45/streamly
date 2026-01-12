import { BASE_URL, HEADERS } from "@/constants";
import { Movie, MovieCategory } from "@/types/Movie";
import { TmdbResponse } from "@/types/TmdbResponse";

export async function getMovies(
  page = 1,
  category: MovieCategory = "popular"
): Promise<TmdbResponse<Movie>> {
  const res = await fetch(`${BASE_URL}/movie/${category}?page=${page}`, {
    cache: "force-cache",
    headers: HEADERS,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movies");
  }

  return await res.json();
}

export async function getMovieById(id: number): Promise<Movie> {
  await new Promise((r) => setTimeout(r, 300));
  const res = await fetch(`${BASE_URL}/movie/${id}`, {
    cache: "force-cache",
    headers: HEADERS,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movie");
  }

  return res.json();
}

export async function getMoviesByIds(ids: number[]): Promise<Movie[]> {
  const requests = ids.map((id) =>
    fetch(`${BASE_URL}/movie/${id}`, {
      headers: HEADERS,
    }).then((res) => res.json())
  );

  return Promise.all(requests);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query) return [];

  const res = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`,
    {
      headers: HEADERS,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to search movies");
  }

  const data: TmdbResponse<Movie> = await res.json();
  return data.results;
}
