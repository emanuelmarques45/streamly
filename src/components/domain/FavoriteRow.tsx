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
 * Grade de favoritos. Espelha o cache do `useFavorites`, então desfavoritar um
 * item o remove da lista na hora — sem esperar um novo render do servidor.
 */
export function FavoriteRow({ title, items }: FavoriteRowProps) {
  const { isFavorite, isTogglingItem, isReady } = useFavorites();

  // Enquanto a lista do cliente não chegou, confia no que veio do servidor.
  const visible = !isReady
    ? items
    : items.filter((item) => {
        const favorite = {
          itemId: item.id,
          itemType: toFavoriteType(item.mediaType),
        };

        // Mantém o card enquanto a remoção está em voo, evitando "pulo" no grid.
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
