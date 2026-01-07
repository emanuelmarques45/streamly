import { Movie } from "@/types/Movie";
import { MovieCard } from "./MovieCard";

type MovieGridProps = {
  movies: Movie[];
};

export function MovieGrid({ movies }: MovieGridProps) {
  if (!movies.length) {
    return <p className='text-sm text-gray-400'>Nenhum filme encontrado.</p>;
  }

  return (
    <section
      className='
        grid
        grid-cols-2
        gap-4
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
      '
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}
