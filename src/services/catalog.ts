import { REVALIDATE } from "@/constants";
import { tmdbFetch } from "@/lib/tmdb";
import { Genre } from "@/types/Genre";
import { MediaItem, MediaType, toMediaItem } from "@/types/Media";
import { Movie } from "@/types/Movie";
import { TmdbResponse } from "@/types/TmdbResponse";
import { TvShow } from "@/types/TvShow";

/**
 * Serviços que atravessam filmes e séries: trending, discover, gêneros e
 * multi-search. Todos rodam no servidor e devolvem `MediaItem` normalizado.
 */

export type TimeWindow = "day" | "week";

export type DiscoverFilters = {
  mediaType: MediaType;
  page?: number;
  /** Ids de gênero do TMDB. */
  genres?: number[];
  /** Ano de lançamento / primeira exibição. */
  year?: number;
  sortBy?: DiscoverSort;
  minVotes?: number;
};

export type DiscoverSort =
  | "popularity.desc"
  | "vote_average.desc"
  | "primary_release_date.desc"
  | "revenue.desc";

export const DISCOVER_SORTS: { value: DiscoverSort; label: string }[] = [
  { value: "popularity.desc", label: "Mais populares" },
  { value: "vote_average.desc", label: "Melhor avaliados" },
  { value: "primary_release_date.desc", label: "Mais recentes" },
  { value: "revenue.desc", label: "Maiores bilheterias" },
];

export function isDiscoverSort(value: string): value is DiscoverSort {
  return DISCOVER_SORTS.some((sort) => sort.value === value);
}

export type MediaPage = {
  page: number;
  totalPages: number;
  totalResults: number;
  items: MediaItem[];
};

function toMediaPage(
  response: TmdbResponse<Movie | TvShow>,
  mediaType: MediaType
): MediaPage {
  return {
    page: response.page,
    totalPages: Math.min(response.total_pages, 500), // limite duro do TMDB
    totalResults: response.total_results,
    items: response.results.map((item) => ({
      ...toMediaItem(item),
      mediaType,
    })),
  };
}

export async function getTrending(
  mediaType: MediaType | "all" = "all",
  timeWindow: TimeWindow = "week"
): Promise<MediaItem[]> {
  type TrendingResult = (Movie | TvShow) & {
    media_type?: MediaType | "person";
  };

  const data = await tmdbFetch<TmdbResponse<TrendingResult>>(
    `/trending/${mediaType}/${timeWindow}`
  );

  return data.results
    .filter((item) => item.media_type !== "person")
    .map((item) => {
      const media = toMediaItem(item);
      return item.media_type
        ? { ...media, mediaType: item.media_type as MediaType }
        : media;
    });
}

export async function getGenres(mediaType: MediaType): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>(
    `/genre/${mediaType}/list`,
    { revalidate: 60 * 60 * 24 }
  );

  return data.genres;
}

export async function discover({
  mediaType,
  page = 1,
  genres,
  year,
  sortBy = "popularity.desc",
  minVotes,
}: DiscoverFilters): Promise<MediaPage> {
  // `primary_release_date` não existe em séries — o TMDB usa `first_air_date`.
  const sort =
    mediaType === "tv" && sortBy === "primary_release_date.desc"
      ? "first_air_date.desc"
      : sortBy;

  // Ordenar por nota sem um piso de votos traz títulos com 1 voto e nota 10.
  const voteFloor =
    minVotes ?? (sortBy === "vote_average.desc" ? 300 : undefined);

  const data = await tmdbFetch<TmdbResponse<Movie | TvShow>>(
    `/discover/${mediaType}`,
    {
      params: {
        page,
        sort_by: sort,
        include_adult: false,
        with_genres: genres?.length ? genres.join(",") : undefined,
        "vote_count.gte": voteFloor,
        ...(year
          ? mediaType === "movie"
            ? { primary_release_year: year }
            : { first_air_date_year: year }
          : {}),
      },
    }
  );

  return toMediaPage(data, mediaType);
}

export async function searchMulti(
  query: string,
  page = 1
): Promise<MediaPage> {
  type MultiResult = (Movie | TvShow) & { media_type: MediaType | "person" };

  const data = await tmdbFetch<TmdbResponse<MultiResult>>("/search/multi", {
    params: { query, page, include_adult: false },
    revalidate: REVALIDATE.search,
  });

  const items = data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => ({
      ...toMediaItem(item),
      mediaType: item.media_type as MediaType,
    }));

  return {
    page: data.page,
    totalPages: Math.min(data.total_pages, 500),
    totalResults: data.total_results,
    items,
  };
}

export async function getCategoryPage(
  mediaType: MediaType,
  category: string,
  page = 1
): Promise<MediaPage> {
  const data = await tmdbFetch<TmdbResponse<Movie | TvShow>>(
    `/${mediaType}/${category}`,
    { params: { page } }
  );

  return toMediaPage(data, mediaType);
}
