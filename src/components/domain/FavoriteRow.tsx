import { Movie } from "@/types/Movie";
import { MovieCard } from "./MovieCard";

type FavoriteRowProps = {
  title: string;
  movies: Movie[];
};

export function FavoriteRow({ title, movies }: FavoriteRowProps) {
  return (
    <section className='pb-10'>
      <h2 className='mb-4 text-xl font-semibold'>{title}</h2>

      <div
        className='
          grid
          gap-12
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6
        '
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
