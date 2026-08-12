"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useState, useTransition } from "react";
import { CARD_IMAGE_SIZES, IMAGE_BASE_URL } from "@/constants";
import { MediaItem, mediaHref } from "@/types/Media";
import { toFavoriteType } from "@/types/Favorite";
import { formatYear } from "@/utils/format";
import { RatingBadge } from "../ui/RatingBadge";
import { Spinner } from "../ui/Spinner";
import { FavoriteButton } from "./FavoriteButton";

type MediaCardProps = {
  item: MediaItem;
  /** Marks the image as priority; use only for the first visible items. */
  priority?: boolean;
  className?: string;
};

/**
 * One card for both movies and TV shows. This used to be two nearly identical
 * components (`MovieCard` and `TvShowCard`).
 */
export function MediaCard({ item, priority, className }: MediaCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const year = formatYear(item.date);
  const typeLabel = item.mediaType === "movie" ? "filme" : "série";

  return (
    <div
      className={clsx(
        "relative shrink-0 w-35 sm:w-40 md:w-45 lg:w-50 xl:w-55",
        className
      )}
    >
      <Link
        href={mediaHref(item)}
        onClick={() => startTransition(() => {})}
        aria-label={`Ver detalhes do ${typeLabel} ${item.title}`}
        title={item.title}
        className={clsx(
          "block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isPending && "pointer-events-none"
        )}
      >
        <article
          className={clsx(
            "group h-full overflow-hidden rounded-xl bg-surface transition hover:scale-[1.02]",
            isPending && "opacity-60"
          )}
        >
          <div className='relative aspect-2/3 w-full bg-black/20'>
            {!loaded && item.posterPath && (
              <div className='absolute inset-0 animate-pulse bg-border' />
            )}

            {item.posterPath ? (
              <Image
                // w342 is plenty for a ~220px card; `original` was pulling in
                // images of several MB per card.
                src={`${IMAGE_BASE_URL.w342}${item.posterPath}`}
                alt={item.title}
                fill
                priority={priority}
                sizes={CARD_IMAGE_SIZES}
                className={clsx(
                  "object-cover transition-opacity duration-300",
                  loaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setLoaded(true)}
              />
            ) : (
              <div className='flex h-full items-center justify-center px-2 text-center text-sm text-text-muted'>
                Sem imagem
              </div>
            )}

            <span className='absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white'>
              {item.mediaType === "movie" ? "Filme" : "Série"}
            </span>
          </div>

          <div className='p-4'>
            <h3 className='line-clamp-2 font-semibold'>{item.title}</h3>

            <div className='mt-1 flex items-center gap-2'>
              <RatingBadge value={item.voteAverage} />
              {year && (
                <span className='text-sm text-text-muted'>· {year}</span>
              )}
            </div>
          </div>
        </article>
      </Link>

      <FavoriteButton
        itemId={item.id}
        itemType={toFavoriteType(item.mediaType)}
        size='sm'
        className='absolute right-2 top-2 bg-black/40 backdrop-blur-sm hover:bg-black/60'
      />

      {isPending && (
        <div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/40'>
          <Spinner />
        </div>
      )}
    </div>
  );
}
