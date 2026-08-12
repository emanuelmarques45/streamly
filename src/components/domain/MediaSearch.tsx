"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { IMAGE_BASE_URL } from "@/constants";
import { fetchSearch } from "@/services/catalog.client";
import { mediaHref } from "@/types/Media";
import { formatYear } from "@/utils/format";
import { Spinner } from "../ui/Spinner";

const DEBOUNCE_MS = 350;
const MAX_RESULTS = 8;

/**
 * Header search. Covers both movies and TV shows (`/search/multi`), with
 * debounce, React Query caching and keyboard navigation.
 */
export function MediaSearch() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query]);

  const { data, isFetching } = useQuery({
    queryKey: ["search", debounced],
    queryFn: ({ signal }) => fetchSearch(debounced, 1, signal),
    enabled: debounced.length > 1,
    staleTime: 5 * 60 * 1000,
  });

  const results = (data?.items ?? []).slice(0, MAX_RESULTS);

  function close() {
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      close();
      event.currentTarget.blur();
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      event.preventDefault();
      router.push(mediaHref(results[activeIndex]));
      close();
      return;
    }

    if (!results.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    }
  }

  const showPanel = isOpen && debounced.length > 1;

  return (
    <div
      ref={containerRef}
      className='relative'
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          close();
        }
      }}
    >
      <div className='relative'>
        <input
          id='search-bar'
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            // Typing produces a new list, so the previous highlight is meaningless.
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder='Buscar filmes e séries…  (tecla /)'
          role='combobox'
          aria-controls={listId}
          aria-autocomplete='list'
          aria-expanded={showPanel}
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
          }
          className='h-10 w-full border-b border-text/20 bg-transparent px-1 pr-8 text-sm outline-none transition focus:border-b-2 focus:border-primary'
        />

        {isFetching && (
          <span className='absolute right-1 top-1/2 -translate-y-1/2'>
            <Spinner />
          </span>
        )}
      </div>

      {showPanel && (
        <ul
          id={listId}
          role='listbox'
          aria-label='Resultados da busca'
          className='mt-2 max-h-[75vh] overflow-y-auto rounded-b-lg'
        >
          {results.map((item, index) => {
            const year = formatYear(item.date);

            return (
              <li
                key={`${item.mediaType}-${item.id}`}
                id={`${listId}-option-${index}`}
                role='option'
                aria-selected={index === activeIndex}
              >
                <Link
                  href={mediaHref(item)}
                  onClick={close}
                  className={clsx(
                    "flex items-center gap-4 border-b border-text/20 px-3 py-3",
                    index === activeIndex ? "bg-primary/20" : "hover:bg-text/10"
                  )}
                >
                  <div className='relative h-18 w-12 shrink-0 overflow-hidden rounded bg-border'>
                    {item.posterPath && (
                      <Image
                        src={`${IMAGE_BASE_URL.w92}${item.posterPath}`}
                        alt=''
                        fill
                        sizes='48px'
                        className='object-cover'
                      />
                    )}
                  </div>

                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='truncate font-medium'>{item.title}</span>
                      <span className='shrink-0 rounded bg-text/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-text-muted'>
                        {item.mediaType === "movie" ? "Filme" : "Série"}
                      </span>
                      {year && (
                        <span className='shrink-0 text-xs text-text-muted'>
                          {year}
                        </span>
                      )}
                    </div>

                    <p className='truncate text-sm text-text-muted'>
                      {item.overview || "Sem sinopse disponível."}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}

          {!results.length && !isFetching && (
            <li className='px-3 py-4 text-sm text-text-muted'>
              Nenhum resultado para “{debounced}”.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
