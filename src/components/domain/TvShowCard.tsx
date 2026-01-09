"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import Image from "next/image";
import { IMAGE_BASE_URL } from "@/constants";
import { Spinner } from "../ui/Spinner";
import { TvShow } from "@/types/TvShow";

export function TvShowCard({ show }: { show: TvShow }) {
  const [loaded, setLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {});
  }

  return (
    <div className='relative w-1/2 shrink-0'>
      <Link
        href={`/tv/${show.id}`}
        onClick={handleClick}
        aria-label={`Ver detalhes da série ${show.name}`}
        title={show.name}
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
            {!loaded && (
              <div className='absolute inset-0 animate-pulse bg-border' />
            )}

            {show.poster_path ? (
              <Image
                src={`${IMAGE_BASE_URL.original}${show.poster_path}`}
                alt={show.name}
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
            )}
          </div>

          <div className='p-4'>
            <h3 className='line-clamp-2 font-semibold'>{show.name}</h3>

            <span className='mt-1 block text-sm text-yellow-600 dark:text-yellow-400'>
              ⭐ {show.vote_average.toFixed(1)}
            </span>
          </div>
        </article>
      </Link>

      {isPending && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/40'>
          <Spinner />
        </div>
      )}
    </div>
  );
}
