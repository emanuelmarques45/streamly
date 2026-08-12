"use client";

import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { DISCOVER_SORTS } from "@/services/catalog";
import { Genre } from "@/types/Genre";
import { MediaType } from "@/types/Media";

type DiscoverFiltersProps = {
  mediaType: MediaType;
  genres: Genre[];
  selectedGenres: number[];
  year?: number;
  sort: string;
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR - i);

/**
 * Filtros do Discover. Todo o estado vive na URL, então a combinação escolhida
 * é compartilhável e sobrevive ao refresh.
 */
export function DiscoverFilters({
  mediaType,
  genres,
  selectedGenres,
  year,
  sort,
}: DiscoverFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const push = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);

      startTransition(() => {
        router.replace(`/discover?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  function setMediaType(next: MediaType) {
    push((params) => {
      params.set("type", next);
      // Os ids de gênero do TMDB não são compartilhados entre filmes e séries.
      params.delete("genres");
    });
  }

  function toggleGenre(id: number) {
    const next = selectedGenres.includes(id)
      ? selectedGenres.filter((genreId) => genreId !== id)
      : [...selectedGenres, id];

    push((params) => {
      if (next.length) params.set("genres", next.join(","));
      else params.delete("genres");
    });
  }

  function setParam(key: string, value: string) {
    push((params) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
  }

  const hasFilters = selectedGenres.length > 0 || Boolean(year);

  return (
    <div
      className={clsx("space-y-6 transition-opacity", isPending && "opacity-60")}
    >
      <div className='flex flex-wrap items-center gap-3'>
        <div
          role='group'
          aria-label='Tipo de mídia'
          className='inline-flex overflow-hidden rounded-lg border border-border'
        >
          {(["movie", "tv"] as const).map((type) => (
            <button
              key={type}
              type='button'
              onClick={() => setMediaType(type)}
              aria-pressed={mediaType === type}
              className={clsx(
                "px-4 py-2 text-sm transition",
                mediaType === type
                  ? "bg-primary text-white"
                  : "hover:bg-text/10"
              )}
            >
              {type === "movie" ? "Filmes" : "Séries"}
            </button>
          ))}
        </div>

        <label className='flex items-center gap-2 text-sm'>
          <span className='text-text-muted'>Ordenar por</span>
          <select
            value={sort}
            onChange={(event) => setParam("sort", event.target.value)}
            className='rounded-lg border border-border bg-background px-3 py-2 text-sm'
          >
            {DISCOVER_SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className='flex items-center gap-2 text-sm'>
          <span className='text-text-muted'>Ano</span>
          <select
            value={year ? String(year) : ""}
            onChange={(event) => setParam("year", event.target.value)}
            className='rounded-lg border border-border bg-background px-3 py-2 text-sm'
          >
            <option value=''>Todos</option>
            {YEARS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {hasFilters && (
          <button
            type='button'
            onClick={() =>
              push((params) => {
                params.delete("genres");
                params.delete("year");
              })
            }
            className='text-sm text-primary hover:underline'
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className='flex flex-wrap gap-2' role='group' aria-label='Gêneros'>
        {genres.map((genre) => {
          const active = selectedGenres.includes(genre.id);

          return (
            <button
              key={genre.id}
              type='button'
              onClick={() => toggleGenre(genre.id)}
              aria-pressed={active}
              className={clsx(
                "rounded-full border px-3 py-1 text-sm transition",
                active
                  ? "border-primary bg-primary text-white"
                  : "border-border text-text-muted hover:border-primary hover:text-text"
              )}
            >
              {genre.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
