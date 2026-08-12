"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCategoryPage } from "@/services/catalog.client";
import { MediaType } from "@/types/Media";
import { CardSkeleton } from "./CardSkeleton";
import { MediaCard } from "./MediaCard";
import { MediaScroller } from "./MediaScroller";
import { Spinner } from "../ui/Spinner";

type MediaRowProps = {
  title: string;
  mediaType: MediaType;
  category: string;
  /** Link "ver tudo" à direita do título. */
  href?: string;
  /** Prioriza as imagens da primeira leva (usar apenas na primeira linha). */
  priority?: boolean;
};

export function MediaRow({
  title,
  mediaType,
  category,
  href,
  priority,
}: MediaRowProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["catalog", mediaType, category],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      fetchCategoryPage(mediaType, category, pageParam, signal),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  useEffect(() => {
    const loader = loaderRef.current;
    const container = containerRef.current;
    if (!loader || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: container, threshold: 0.2 }
    );

    observer.observe(loader);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <section className='pb-10'>
      <div className='mb-4 flex items-baseline justify-between gap-4'>
        <h2 className='text-2xl font-bold md:text-3xl'>{title}</h2>

        {href && (
          <Link
            href={href}
            className='shrink-0 text-sm text-primary hover:underline'
          >
            Ver tudo →
          </Link>
        )}
      </div>

      {isError ? (
        <div className='flex items-center gap-4 rounded-xl border border-border p-6 text-sm'>
          <p className='text-text-muted'>Não foi possível carregar esta lista.</p>
          <button
            onClick={() => refetch()}
            className='rounded-md border border-border px-3 py-1 hover:bg-text/10'
          >
            Tentar de novo
          </button>
        </div>
      ) : (
        <MediaScroller containerRef={containerRef} label={title}>
          {isPending &&
            Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}

          {data?.pages.map((page) =>
            page.items.map((item, index) => (
              <MediaCard
                key={`${item.mediaType}-${item.id}`}
                item={item}
                priority={priority && page.page === 1 && index < 4}
              />
            ))
          )}

          {hasNextPage && (
            <div
              ref={loaderRef}
              className='flex min-w-20 shrink-0 items-center justify-center'
            >
              {isFetchingNextPage && <Spinner />}
            </div>
          )}
        </MediaScroller>
      )}
    </section>
  );
}
