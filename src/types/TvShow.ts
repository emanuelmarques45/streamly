import { Genre } from "./Genre";

export type TvShowCategory =
  | "popular"
  | "top_rated"
  | "on_the_air"
  | "airing_today";

export type TvShow = {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
  overview: string;
  genres: Genre[];
  seasons: Season[];
};

type Season = {
  air_date: string;
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
  air_date: string;
  episode_number: number;
  episode_type: string;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
  vote_average: number;
  vote_count: number;
  crew: any[];
  guest_stars: any[];
};
