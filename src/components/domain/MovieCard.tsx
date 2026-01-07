"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import Image from "next/image";
import { Movie } from "@/types/Movie";
import { IMAGE_BASE_URL } from "@/constants";
import { Spinner } from "../ui/Spinner";

export function MovieCard({ movie }: { movie: Movie }) {
  const [loaded, setLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {});
  }

  return (
    <div className='relative'>
      <Link
        href={`/movies/${movie.id}`}
        onClick={handleClick}
        aria-label={`Ver detalhes do filme ${movie.title}`}
        title={movie.title}
        className={`block h-full ${isPending ? "pointer-events-none" : ""}`}
      >
        <article
          className={`
            h-full
            group
            overflow-hidden
            rounded-xl
            bg-surface
            transition
            hover:scale-[1.02]
            ${isPending ? "opacity-60" : ""}
          `}
        >
          <div className='relative aspect-2/3 w-full bg-black/20'>
            {/* Skeleton da imagem */}
            {!loaded && (
              <div className='absolute inset-0 animate-pulse bg-border' />
            )}

            {/* {movie.poster_path ? (
              <Image
                src={`${IMAGE_BASE_URL.original}${movie.poster_path}`}
                alt={movie.title}
                fill
                className={`object-cover transition-opacity duration-300 ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setLoaded(true)}
              />
            ) : (
              <div className='flex h-full items-center justify-center text-sm text-gray-400'>
                Sem imagem
              </div>
            )} */}
          </div>

          <div className='p-4'>
            <h3 className='line-clamp-2 font-semibold'>{movie.title}</h3>

            <span className='mt-1 block text-sm text-yellow-600 dark:text-yellow-400'>
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </article>
      </Link>

      {/* Overlay de transição */}
      {isPending && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/40'>
          <Spinner />
        </div>
      )}
    </div>
  );
}
