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
    <section className='pb-12'>
      <h2 className='mb-6 text-2xl font-semibold'>{title}</h2>

      <div
        className='
          flex
          flex-wrap
          gap-6
          justify-center
          sm:justify-normal
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
