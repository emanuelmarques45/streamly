"use client";

import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "@/services/favorites";
import { getMoviesByIds } from "@/services/movies";
import { getTvShowsByIds } from "@/services/tv";
import { Container } from "@/components/layout/Container";
import { FavoriteRow } from "@/components/domain/FavoriteRow";
import { Movie } from "@/types/Movie";
import { TvShow } from "@/types/TvShow";

type Favorite = {
  itemId: number;
  itemType: "MOVIE" | "TV";
};

export default function ProfilePage() {
  const { data: favRes, isLoading: loadingFav } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  const favorites: Favorite[] = favRes?.ok ? favRes.data : [];

  const movieIds = favorites
    .filter((f) => f.itemType === "MOVIE")
    .map((f) => f.itemId);

  const tvIds = favorites
    .filter((f) => f.itemType === "TV")
    .map((f) => f.itemId);

  const { data: movies = [], isLoading: loadingMovies } = useQuery<Movie[]>({
    queryKey: ["favorite-movies", movieIds],
    queryFn: () => getMoviesByIds(movieIds),
    enabled: movieIds.length > 0,
  });

  const { data: tvShows = [], isLoading: loadingTv } = useQuery<TvShow[]>({
    queryKey: ["favorite-tv", tvIds],
    queryFn: () => getTvShowsByIds(tvIds),
    enabled: tvIds.length > 0,
  });

  if (loadingFav || loadingMovies || loadingTv) {
    return <Container>Loading favorites...</Container>;
  }
  if (!movies.length && !tvShows.length) {
    return (
      <Container>
        <p>No favorites yet.</p>
      </Container>
    );
  }

  return (
    <Container className='space-y-10'>
      {movies.length > 0 && (
        <FavoriteRow title='Favorite movies' items={movies} />
      )}

      {tvShows.length > 0 && (
        <FavoriteRow title='Favorite series' items={tvShows} />
      )}
    </Container>
  );
}
