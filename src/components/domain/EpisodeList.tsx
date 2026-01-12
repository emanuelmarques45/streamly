import Image from "next/image";
import { IMAGE_BASE_URL } from "@/constants";
import { getSeasonEpisodes } from "@/services/tv";

type Props = {
  tvId: number;
  season: number;
};

export async function EpisodeList({ tvId, season }: Props) {
  const data = await getSeasonEpisodes(tvId, season);

  if (!data?.episodes?.length) {
    return <p className='text-sm text-text/60'>No episodes found.</p>;
  }

  return (
    <div className='space-y-4'>
      {data.episodes.map((ep: any) => (
        <div
          key={ep.id}
          className='
            flex
            gap-4
            rounded-lg
            border
            border-border
            p-4
          '
        >
          <div className='relative h-24 w-40 overflow-hidden rounded-md bg-black/20'>
            {ep.still_path && (
              <Image
                src={`${IMAGE_BASE_URL.w300}${ep.still_path}`}
                alt={ep.name}
                fill
                className='object-cover'
              />
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <strong>
              {ep.episode_number}. {ep.name}
            </strong>

            <span className='text-xs text-text/60'>{ep.air_date}</span>

            <p className='text-sm text-text/70 line-clamp-2'>{ep.overview}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
