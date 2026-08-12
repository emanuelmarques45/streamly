"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchDiscover } from "@/services/catalog.client";
import type { DiscoverSort } from "@/services/catalog";
import { MediaType } from "@/types/Media";
import { CardSkeleton } from "./CardSkeleton";
import { MediaCard } from "./MediaCard";
import { Spinner } from "../ui/Spinner";

type DiscoverResultsProps = {
  mediaType: MediaType;
  genres: number[];
  year?: number;
  sort: DiscoverSort;
};

export function DiscoverResults({
  mediaType,
  genres,
  year,
  sort,
}: DiscoverResultsProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["discover", mediaType, genres.join(","), year ?? "", sort],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      fetchDiscover({ mediaType, genres, year, sort, page: pageParam }, signal),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(loader);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isError) {
    return (
      <div className='rounded-xl border border-border p-8 text-center'>
        <p className='mb-4 text-text-muted'>
          Não foi possível carregar os resultados.
        </p>
        <button
          onClick={() => refetch()}
          className='rounded-md border border-border px-4 py-2 hover:bg-text/10'
        >
          Tentar de novo
        </button>
      </div>
    );
  }

  const total = data?.pages[0]?.totalResults ?? 0;
  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className='space-y-6'>
      {!isPending && (
        <p className='text-sm text-text-muted'>
          {total.toLocaleString("pt-BR")}{" "}
          {mediaType === "movie" ? "filmes" : "séries"} encontrados
        </p>
      )}

      <div className='flex flex-wrap justify-center gap-6 sm:justify-normal'>
        {isPending &&
          Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}

        {items.map((item, index) => (
          <MediaCard
            key={`${item.mediaType}-${item.id}`}
            item={item}
            priority={index < 6}
          />
        ))}
      </div>

      {!isPending && !items.length && (
        <p className='py-12 text-center text-text-muted'>
          Nenhum título com essa combinação de filtros.
        </p>
      )}

      <div ref={loaderRef} className='flex h-16 items-center justify-center'>
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  );
}
