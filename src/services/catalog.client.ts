"use client";

import { ApiResponse } from "@/types/Api";
import { Genre } from "@/types/Genre";
import { MediaType } from "@/types/Media";
import { SeasonDetails } from "@/types/TvShow";
import { safeJson } from "@/utils/safeJson";
import type { DiscoverSort, MediaPage } from "@/services/catalog";

/**
 * Browser-side bridge to the `/api/catalog/*` routes. TMDB is never called
 * directly from the client, which keeps the access token on the server.
 */

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  const body = await safeJson<ApiResponse<T>>(res);

  if (!body) {
    throw new Error("Invalid server response");
  }

  if (!body.ok) {
    throw new Error(body.error);
  }

  return body.data;
}

export function fetchCategoryPage(
  mediaType: MediaType,
  category: string,
  page = 1,
  signal?: AbortSignal
) {
  const params = new URLSearchParams({
    type: mediaType,
    category,
    page: String(page),
  });

  return getJson<MediaPage>(`/api/catalog/list?${params}`, signal);
}

export function fetchSearch(query: string, page = 1, signal?: AbortSignal) {
  const params = new URLSearchParams({ q: query, page: String(page) });

  return getJson<MediaPage>(`/api/catalog/search?${params}`, signal);
}

export type DiscoverQuery = {
  mediaType: MediaType;
  genres: number[];
  year?: number;
  sort: DiscoverSort;
  page?: number;
};

export function fetchDiscover(
  { mediaType, genres, year, sort, page = 1 }: DiscoverQuery,
  signal?: AbortSignal
) {
  const params = new URLSearchParams({
    type: mediaType,
    sort,
    page: String(page),
  });

  if (genres.length) params.set("genres", genres.join(","));
  if (year) params.set("year", String(year));

  return getJson<MediaPage>(`/api/catalog/discover?${params}`, signal);
}

export function fetchGenres(mediaType: MediaType, signal?: AbortSignal) {
  return getJson<Genre[]>(`/api/catalog/genres?type=${mediaType}`, signal);
}

export function fetchSeason(
  tvId: number,
  season: number,
  signal?: AbortSignal
) {
  return getJson<SeasonDetails>(
    `/api/catalog/tv/${tvId}/seasons/${season}`,
    signal
  );
}
