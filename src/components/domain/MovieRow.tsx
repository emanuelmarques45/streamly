"use client";

import { useEffect, useRef } from "react";
import { MovieCategory } from "@/types/Movie";
import { MovieCard } from "./MovieCard";
import { getMovies } from "@/services/movies";
import { Movie } from "@/types/Movie";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/Spinner";
import { CardSkeleton } from "./CardSkeleton";

type MovieRowProps = {
  title: string;
  category: MovieCategory;
};

export function MovieRow({ title, category }: MovieRowProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["movies", category],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }) => getMovies(pageParam, category),

      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.total_pages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
    });

  useEffect(() => {
    if (!loaderRef.current || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: containerRef.current,
        threshold: 0.2,
      }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <section className='pb-10'>
      <h2 className='mb-4 text-2xl md:text-3xl font-bold'>{title}</h2>

      <div
        ref={containerRef}
        className='
          flex
          gap-4
          overflow-x-auto
          pb-2
          scrollbar-hide
          scroll-smooth
        '
      >
        {isPending &&
          Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        {data?.pages.map((page) =>
          page.results.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        )}

        {/* Sentinel + Spinner */}
        {hasNextPage && (
          <div
            ref={loaderRef}
            className='
              min-w-20
              shrink-0
              flex
              items-center
              justify-center
            '
          >
            {isFetchingNextPage && <Spinner />}
          </div>
        )}
      </div>
    </section>
  );
}
