import Image from "next/image";
import { notFound } from "next/navigation";
import { getMovieById } from "@/services/movies";
import { IMAGE_BASE_URL } from "@/constants";
import { FavoriteButton } from "@/components/domain/FavoriteButton";
import { Container } from "@/components/layout/Container";
import { FavoriteType } from "@/types/Favorite";
import { ItemPoster } from "@/components/domain/ItemPoster";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieById(parseInt(id));

  if (!movie) notFound();

  return (
    <section>
      <Container>
        <div className='flex flex-col gap-6 md:flex-row'>
          <div className='relative aspect-2/3 w-full max-w-xs overflow-hidden rounded-xl bg-black/20'>
            {movie.poster_path && (
              <ItemPoster
                src={`${IMAGE_BASE_URL.original}${movie.poster_path}`}
                alt={movie.title}
              />
            )}
          </div>

          <div className='flex flex-1 flex-col gap-4'>
            <div className='flex justify-between items-center'>
              <h1 className='text-2xl font-semibold md:text-3xl'>
                {movie.title}
              </h1>
              <FavoriteButton itemId={movie.id} itemType={FavoriteType.MOVIE} />
            </div>

            <p className='text-sm text-text/80'>
              Release: {movie.release_date}
            </p>

            <p className='text-sm leading-relaxed text-text/60'>
              {movie.overview}
            </p>

            <span className='text-sm font-medium text-yellow-600  dark:text-yellow-400'>
              ⭐ {movie.vote_average.toFixed(1)}
            </span>

            {movie.genres && (
              <div className='flex flex-wrap gap-2'>
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className='
                    rounded-full
                      bg-border
                      px-3
                      py-1
                      text-xs
                      font-medium
                    '
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
