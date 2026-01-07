import Image from "next/image";
import { notFound } from "next/navigation";
import { getMovieById } from "@/services/movies";
import { IMAGE_BASE_URL } from "@/constants";

export default async function MoviePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await getMovieById(parseInt(id));

  if (!movie) notFound();

  return (
    <section className='mx-auto max-w-5xl px-4 py-6 md:py-10'>
      <div className='flex flex-col gap-6 md:flex-row'>
        <div className='relative aspect-2/3 w-full max-w-xs overflow-hidden rounded-xl bg-black/20'>
          {movie.poster_path && (
            <Image
              src={`${IMAGE_BASE_URL.original}${movie.poster_path}`}
              alt={movie.title}
              fill
              className='object-cover'
              priority
            />
          )}
        </div>

        <div className='flex flex-1 flex-col gap-4'>
          <h1 className='text-2xl font-semibold md:text-3xl'>{movie.title}</h1>

          <p className='text-sm text-text/80'>Release: {movie.release_date}</p>

          <p className='text-sm leading-relaxed text-text/60'>
            {movie.overview}
          </p>

          <span className='text-sm font-medium text-yellow-600  dark:text-yellow-400'>
            ⭐ {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </section>
  );
}
