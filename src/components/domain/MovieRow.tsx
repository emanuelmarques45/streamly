import { Movie } from "@/types/Movie";
import { MovieCard } from "./MovieCard";
import { MovieCategory } from "@/types/MovieCategory";
import { getMovies } from "@/services/movies";

type MovieRowProps = {
  title: string;
  category: MovieCategory;
};

export async function MovieRow({ title, category }: MovieRowProps) {
  const { results } = await getMovies(1, category);

  return (
    <section className='pb-10'>
      <h2 className='mb-4 text-xl font-semibold'>{title}</h2>
      <div
        className='flex
        gap-4
        overflow-x-auto
        pb-2
        scrollbar-hide'
      >
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
