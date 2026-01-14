import { Movie } from "@/types/Movie";
import { TvShow } from "@/types/TvShow";
import { MovieCard } from "./MovieCard";
import { TvShowCard } from "./TvShowCard";
import { Container } from "../layout/Container";

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
      <Container>
        <h2 className='mb-4 text-xl font-semibold'>{title}</h2>

        <div
          className='
          grid
          gap-4
          grid-cols-[repeat(auto-fit,minmax(8rem,1fr))]
          place-items-center
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
      </Container>
    </section>
  );
}
