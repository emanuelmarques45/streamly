"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { toFavoriteType } from "@/types/Favorite";
import { MediaItem } from "@/types/Media";
import { MediaCard } from "./MediaCard";

type FavoriteRowProps = {
  title: string;
  items: MediaItem[];
};

/**
 * Favorites grid. It mirrors the `useFavorites` cache, so unfavoriting an item
 * removes it right away, without waiting for a new server render.
 */
export function FavoriteRow({ title, items }: FavoriteRowProps) {
  const { isFavorite, isTogglingItem, isReady } = useFavorites();

  // Until the client list arrives, trust what came from the server.
  const visible = !isReady
    ? items
    : items.filter((item) => {
        const favorite = {
          itemId: item.id,
          itemType: toFavoriteType(item.mediaType),
        };

        // Keep the card while the removal is in flight to avoid a jump in the grid.
        return isFavorite(favorite) || isTogglingItem(favorite);
      });

  if (!visible.length) return null;

  return (
    <section className='pb-12'>
      <h2 className='mb-6 text-2xl font-semibold'>
        {title}
        <span className='ml-2 text-base font-normal text-text-muted'>
          ({visible.length})
        </span>
      </h2>

      <div className='flex flex-wrap justify-center gap-6 sm:justify-normal'>
        {visible.map((item) => (
          <MediaCard key={`${item.mediaType}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
}
