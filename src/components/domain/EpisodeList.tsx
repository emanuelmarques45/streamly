import Image from "next/image";
import { IMAGE_BASE_URL } from "@/constants";
import { Episode } from "@/types/TvShow";
import { formatDate, formatRuntime } from "@/utils/format";
import { RatingBadge } from "../ui/RatingBadge";

type EpisodeListProps = {
  episodes: Episode[];
};

/** Lista de episódios de uma temporada (apresentacional). */
export function EpisodeList({ episodes }: EpisodeListProps) {
  if (!episodes.length) {
    return (
      <p className='text-sm text-text-muted'>
        Nenhum episódio cadastrado para esta temporada.
      </p>
    );
  }

  return (
    <ol className='space-y-4'>
      {episodes.map((episode) => {
        const airDate = formatDate(episode.air_date);
        const runtime = formatRuntime(episode.runtime);

        return (
          <li
            key={episode.id}
            className='flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row'
          >
            <div className='relative aspect-video w-full shrink-0 overflow-hidden rounded-md bg-black/20 sm:h-24 sm:w-40'>
              {episode.still_path ? (
                <Image
                  src={`${IMAGE_BASE_URL.w300}${episode.still_path}`}
                  alt=''
                  fill
                  sizes='(max-width: 640px) 100vw, 160px'
                  className='object-cover'
                />
              ) : (
                <div className='flex h-full items-center justify-center text-xs text-text-muted'>
                  Sem imagem
                </div>
              )}
            </div>

            <div className='flex min-w-0 flex-col gap-1'>
              <strong className='text-sm'>
                {episode.episode_number}. {episode.name}
              </strong>

              <div className='flex flex-wrap items-center gap-x-2 text-xs text-text-muted'>
                {airDate && <span>{airDate}</span>}
                {runtime && <span>· {runtime}</span>}
                <RatingBadge value={episode.vote_average} className='text-xs' />
              </div>

              <p className='line-clamp-3 text-sm text-text/70'>
                {episode.overview || "Sem descrição."}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
