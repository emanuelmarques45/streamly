import { BASE_URL } from "@/constants";
import { Movie } from "@/types/Movie";

const API_KEY = process.env.TMDB_API_KEY;

// if (!API_KEY) {
//   throw new Error("TMDB_API_KEY is not defined");
// }

type TMDBResponse<T> = {
  results: T[];
  page: number;
  total_pages: number;
};

const headers = {
  accept: "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

export async function getMovies(page = 1): Promise<TMDBResponse<Movie>> {
  const res = await fetch(`${BASE_URL}/movie/popular?page=${page}`, {
    cache: "force-cache",
    headers,
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
    headers,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch movie");
  }

  return res.json();
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!query) return [];

  const res = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`,
    {
      headers,
    }
  );
  console.log(res.url);

  if (!res.ok) {
    throw new Error("Failed to search movies");
  }

  const data: TMDBResponse<Movie> = await res.json();
  return data.results;
}
