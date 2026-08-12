import { MediaType } from "./Media";

/**
 * Espelha o enum gerado pelo Prisma (objeto const + union) para que os valores
 * vindos do banco sejam atribuíveis sem cast.
 */
export const FavoriteType = {
  MOVIE: "MOVIE",
  TV: "TV",
} as const;

export type FavoriteType = (typeof FavoriteType)[keyof typeof FavoriteType];

export type Favorite = {
  itemId: number;
  itemType: FavoriteType;
};

export function isFavoriteType(value: unknown): value is FavoriteType {
  return value === FavoriteType.MOVIE || value === FavoriteType.TV;
}

export function toFavoriteType(mediaType: MediaType): FavoriteType {
  return mediaType === "movie" ? FavoriteType.MOVIE : FavoriteType.TV;
}

export function toMediaType(itemType: FavoriteType): MediaType {
  return itemType === FavoriteType.MOVIE ? "movie" : "tv";
}

export function favoriteKey({ itemId, itemType }: Favorite) {
  return `${itemType}:${itemId}`;
}
