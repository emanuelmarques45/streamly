import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MediaDetail } from "@/components/domain/MediaDetail";
import { IMAGE_BASE_URL } from "@/constants";
import { getMovieById } from "@/services/movies";
import { toMediaItem } from "@/types/Media";
import { pickTrailer } from "@/types/Video";
import { formatRuntime, formatYear } from "@/utils/format";
import { parseId } from "@/utils/params";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const movieId = parseId(id);
  const movie = movieId ? await getMovieById(movieId) : null;

  if (!movie) return { title: "Filme não encontrado" };

  const year = formatYear(movie.release_date);
  const title = year ? `${movie.title} (${year})` : movie.title;

  return {
    title,
    description: movie.overview?.slice(0, 200),
    openGraph: {
      title,
      description: movie.overview?.slice(0, 200),
      type: "video.movie",
      images: movie.backdrop_path
        ? [`${IMAGE_BASE_URL.w1280}${movie.backdrop_path}`]
        : undefined,
    },
  };
}

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseId(id);

  if (!movieId) notFound();

  const movie = await getMovieById(movieId);

  if (!movie) notFound();

  return (
    <MediaDetail
      id={movie.id}
      mediaType='movie'
      title={movie.title}
      tagline={movie.tagline}
      overview={movie.overview}
      posterPath={movie.poster_path}
      backdropPath={movie.backdrop_path}
      voteAverage={movie.vote_average}
      voteCount={movie.vote_count}
      date={movie.release_date}
      dateLabel='Lançamento'
      genres={movie.genres}
      facts={[formatRuntime(movie.runtime)]}
      homepage={movie.homepage}
      trailer={pickTrailer(movie.videos?.results)}
      cast={movie.credits?.cast}
      recommendations={movie.recommendations?.results.map(toMediaItem)}
    />
  );
}
