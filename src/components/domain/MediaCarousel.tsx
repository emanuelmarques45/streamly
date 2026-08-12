"use client";

import { MediaItem } from "@/types/Media";
import { MediaCard } from "./MediaCard";
import { MediaScroller } from "./MediaScroller";

type MediaCarouselProps = {
  title: string;
  items: MediaItem[];
  emptyMessage?: string;
};

/** Carrossel de uma lista já resolvida (recomendações, elenco de favoritos…). */
export function MediaCarousel({
  title,
  items,
  emptyMessage,
}: MediaCarouselProps) {
  if (!items.length) {
    if (!emptyMessage) return null;

    return (
      <section className='pb-10'>
        <h2 className='mb-4 text-2xl font-bold'>{title}</h2>
        <p className='text-sm text-text-muted'>{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className='pb-10'>
      <h2 className='mb-4 text-2xl font-bold'>{title}</h2>

      <MediaScroller label={title}>
        {items.map((item) => (
          <MediaCard key={`${item.mediaType}-${item.id}`} item={item} />
        ))}
      </MediaScroller>
    </section>
  );
}
