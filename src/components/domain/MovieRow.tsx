import { MovieCategory } from "@/types/Movie";
import { MovieCard } from "./MovieCard";
import { getMovies } from "@/services/movies";

type MovieRowProps = {
  title: string;
  category: MovieCategory;
};

export async function MovieRow({ title, category }: MovieRowProps) {
  const { results } = await getMovies(1, category);

  return (
    <section className='pb-10'>
      <h2 className='mb-4 text-2xl md:text-3xl font-bold'>{title}</h2>
      <div
        className='flex
        gap-4
        overflow-x-auto
        pb-2
        scrollbar-hide
        scroll-smooth'
      >
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
