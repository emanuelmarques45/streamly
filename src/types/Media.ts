import { Movie } from "./Movie";
import { TvShow } from "./TvShow";

export type MediaType = "movie" | "tv";

/**
 * Forma normalizada usada por componentes que precisam lidar com filmes e
 * séries ao mesmo tempo (busca, discover, favoritos).
 */
export type MediaItem = {
  id: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  /** `release_date` para filmes, `first_air_date` para séries. */
  date: string | null;
};

export function isMovie(item: Movie | TvShow): item is Movie {
  return "title" in item;
}

export function toMediaItem(item: Movie | TvShow): MediaItem {
  if (isMovie(item)) {
    return {
      id: item.id,
      mediaType: "movie",
      title: item.title,
      overview: item.overview ?? "",
      posterPath: item.poster_path,
      backdropPath: item.backdrop_path ?? null,
      voteAverage: item.vote_average ?? 0,
      date: item.release_date || null,
    };
  }

  return {
    id: item.id,
    mediaType: "tv",
    title: item.name,
    overview: item.overview ?? "",
    posterPath: item.poster_path,
    backdropPath: item.backdrop_path ?? null,
    voteAverage: item.vote_average ?? 0,
    date: item.first_air_date || null,
  };
}

export function mediaHref(item: Pick<MediaItem, "id" | "mediaType">) {
  return item.mediaType === "movie" ? `/movies/${item.id}` : `/tvs/${item.id}`;
}
