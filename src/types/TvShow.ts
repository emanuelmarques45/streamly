import { Credits, CrewMember } from "./Credits";
import { Genre } from "./Genre";
import { TmdbResponse } from "./TmdbResponse";
import { Videos } from "./Video";

export type TvShowCategory =
  | "popular"
  | "top_rated"
  | "on_the_air"
  | "airing_today";

export const TV_CATEGORIES: TvShowCategory[] = [
  "popular",
  "top_rated",
  "on_the_air",
  "airing_today",
];

export function isTvShowCategory(value: string): value is TvShowCategory {
  return (TV_CATEGORIES as string[]).includes(value);
}

export type TvShow = {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
  overview: string;
  genres?: Genre[];
  seasons?: Season[];
};

/** Resposta de `/tv/{id}` com `append_to_response`. */
export type TvShowDetails = TvShow & {
  tagline: string | null;
  status: string;
  homepage: string | null;
  vote_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  credits?: Credits;
  videos?: Videos;
  recommendations?: TmdbResponse<TvShow>;
  similar?: TmdbResponse<TvShow>;
};

export type Season = {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
};

export type SeasonDetails = {
  _id: string;
  air_date: string | null;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
};

export type Episode = {
  air_date: string | null;
  episode_number: number;
  episode_type: string;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  crew: CrewMember[];
  guest_stars: Credits["cast"];
};
