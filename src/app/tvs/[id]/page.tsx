import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MediaDetail } from "@/components/domain/MediaDetail";
import { SeasonPicker } from "@/components/domain/SeasonPicker";
import { IMAGE_BASE_URL } from "@/constants";
import { getTvShowById } from "@/services/tv";
import { toMediaItem } from "@/types/Media";
import { pickTrailer } from "@/types/Video";
import { formatRuntime, formatYear } from "@/utils/format";
import { parseId } from "@/utils/params";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const tvId = parseId(id);
  const tv = tvId ? await getTvShowById(tvId) : null;

  if (!tv) return { title: "Série não encontrada" };

  const year = formatYear(tv.first_air_date);
  const title = year ? `${tv.name} (${year})` : tv.name;

  return {
    title,
    description: tv.overview?.slice(0, 200),
    openGraph: {
      title,
      description: tv.overview?.slice(0, 200),
      type: "video.tv_show",
      images: tv.backdrop_path
        ? [`${IMAGE_BASE_URL.w1280}${tv.backdrop_path}`]
        : undefined,
    },
  };
}

function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export default async function TvShowPage({ params }: PageProps) {
  const { id } = await params;
  const tvId = parseId(id);

  if (!tvId) notFound();

  const tv = await getTvShowById(tvId);

  if (!tv) notFound();

  const episodeRuntime = tv.episode_run_time?.[0];

  return (
    <MediaDetail
      id={tv.id}
      mediaType='tv'
      title={tv.name}
      tagline={tv.tagline}
      overview={tv.overview}
      posterPath={tv.poster_path}
      backdropPath={tv.backdrop_path}
      voteAverage={tv.vote_average}
      voteCount={tv.vote_count}
      date={tv.first_air_date}
      dateLabel='Estreia'
      genres={tv.genres}
      facts={[
        tv.number_of_seasons
          ? pluralize(tv.number_of_seasons, "temporada", "temporadas")
          : null,
        tv.number_of_episodes
          ? pluralize(tv.number_of_episodes, "episódio", "episódios")
          : null,
        episodeRuntime ? `~${formatRuntime(episodeRuntime)}/ep` : null,
      ]}
      homepage={tv.homepage}
      trailer={pickTrailer(tv.videos?.results)}
      cast={tv.credits?.cast}
      recommendations={tv.recommendations?.results.map(toMediaItem)}
    >
      <SeasonPicker tvId={tv.id} seasons={tv.seasons ?? []} />
    </MediaDetail>
  );
}
