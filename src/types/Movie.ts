import { Credits } from "./Credits";
import { Genre } from "./Genre";
import { TmdbResponse } from "./TmdbResponse";
import { Videos } from "./Video";

export type MovieCategory =
  | "popular"
  | "top_rated"
  | "upcoming"
  | "now_playing";

export const MOVIE_CATEGORIES: MovieCategory[] = [
  "popular",
  "top_rated",
  "upcoming",
  "now_playing",
];

export function isMovieCategory(value: string): value is MovieCategory {
  return (MOVIE_CATEGORIES as string[]).includes(value);
}

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genres?: Genre[];
};

/** Resposta de `/movie/{id}` com `append_to_response`. */
export type MovieDetails = Movie & {
  tagline: string | null;
  runtime: number | null;
  status: string;
  homepage: string | null;
  vote_count: number;
  credits?: Credits;
  videos?: Videos;
  recommendations?: TmdbResponse<Movie>;
  similar?: TmdbResponse<Movie>;
};
