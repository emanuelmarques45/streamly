export type Favorite = {
  itemId: number;
  itemType: FavoriteType;
};

export enum FavoriteType {
  MOVIE = "MOVIE",
  TV = "TV",
}
