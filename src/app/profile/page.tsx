import { Container } from "@/components/layout/Container";
import { FavoriteRow } from "@/components/domain/FavoriteRow";
import { getFavorites } from "@/services/favorites";
import { getMoviesByIds } from "@/services/movies";
import { getTvShowsByIds } from "@/services/tv";
import { Movie } from "@/types/Movie";
import { TvShow } from "@/types/TvShow";

type Favorite = {
  itemId: number;
  itemType: "MOVIE" | "TV";
};

export default async function ProfilePage() {
  const favRes = await getFavorites();

  if (!favRes.ok) {
    return (
      <Container>
        <p>Unauthorized</p>
      </Container>
    );
  }

  const favorites: Favorite[] = favRes.data;

  const movieIds = favorites
    .filter((f) => f.itemType === "MOVIE")
    .map((f) => f.itemId);

  const tvIds = favorites
    .filter((f) => f.itemType === "TV")
    .map((f) => f.itemId);

  const movies: Movie[] = movieIds.length ? await getMoviesByIds(movieIds) : [];

  const tvShows: TvShow[] = tvIds.length ? await getTvShowsByIds(tvIds) : [];

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
