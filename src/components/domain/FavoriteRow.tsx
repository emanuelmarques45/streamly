import { Movie } from "@/types/Movie";
import { TvShow } from "@/types/TvShow";
import { MovieCard } from "./MovieCard";
import { TvShowCard } from "./TvShowCard";

type FavoriteRowProps = {
  title: string;
  items: (Movie | TvShow)[];
};

function isMovie(item: Movie | TvShow): item is Movie {
  return "title" in item;
}

export function FavoriteRow({ title, items }: FavoriteRowProps) {
  return (
    <section className='pb-10'>
      <h2 className='mb-4 text-xl font-semibold'>{title}</h2>

      <div
        className='
          grid
          gap-6
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6
        '
      >
        {items.map((item) =>
          isMovie(item) ? (
            <MovieCard key={`movie-${item.id}`} movie={item} />
          ) : (
            <TvShowCard key={`tv-${item.id}`} show={item} />
          )
        )}
      </div>
    </section>
  );
}
