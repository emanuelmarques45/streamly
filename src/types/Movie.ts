import { Genre } from "./Genre";

export type MovieCategory =
  | "popular"
  | "top_rated"
  | "upcoming"
  | "now_playing";

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
