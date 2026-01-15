import { EpisodeList } from "@/components/domain/EpisodeList";
import { FavoriteButton } from "@/components/domain/FavoriteButton";
import { ItemPoster } from "@/components/domain/ItemPoster";
import { Container } from "@/components/layout/Container";
import { IMAGE_BASE_URL } from "@/constants";
import { getTvShowById } from "@/services/tv";
import { FavoriteType } from "@/types/Favorite";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function TvShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tv = await getTvShowById(parseInt(id));

  if (!tv) notFound();

  return (
    <section>
      <Container>
        <div className='flex flex-col gap-6 md:flex-row'>
          <div className='relative aspect-2/3 w-full max-w-xs overflow-hidden rounded-xl bg-black/20'>
            {tv.poster_path && (
              <ItemPoster
                src={`${IMAGE_BASE_URL.original}${tv.poster_path}`}
                alt={tv.name}
              />
            )}
          </div>

          <div className='flex flex-1 flex-col gap-4'>
            <div className='flex justify-between items-center'>
              <h1 className='text-2xl font-semibold md:text-3xl'>{tv.name}</h1>
              <FavoriteButton itemType={FavoriteType.TV} itemId={tv.id} />
            </div>

            <p className='text-sm text-text/80'>
              First air date: {tv.first_air_date}
            </p>

            <p className='text-sm leading-relaxed text-text/60'>
              {tv.overview}
            </p>

            <span className='text-sm font-medium text-yellow-600  dark:text-yellow-400'>
              ⭐ {tv.vote_average.toFixed(1)}
            </span>

            {tv.genres && (
              <div className='flex flex-wrap gap-2'>
                {tv.genres.map((genre) => (
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

        <div className='mt-10'>
          <h2 className='mb-4 text-xl font-semibold'>Episodes</h2>

          {tv.seasons
            ?.filter((s: any) => s.season_number > 0)
            .map((season: any) => (
              <div key={season.id} className='mb-10'>
                <h3 className='mb-4 text-lg font-medium'>
                  Season {season.season_number}
                </h3>

                <EpisodeList tvId={tv.id} season={season.season_number} />
              </div>
            ))}
        </div>
      </Container>
    </section>
  );
}
